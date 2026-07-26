import { invoke } from '@tauri-apps/api/core';
import { Observable, Observer } from 'rxjs';

export interface ProgressEvent {
  status: 'started' | 'streaming' | 'completed' | 'error';
  progress?: number; // 0–100
  message?: string;
  data?: unknown;
}

export class LlamaService {
  private apiUrl = 'http://localhost:8080/v1/chat/completions';

  async startLlamaServer() {
    try {
      const result = await invoke<string>('start_llama_server');
      console.log(result);
    } catch (error) {
      console.error(`Failed to start: ${error}`);
      throw error;
    }
  }

  async stopLlamaServer() {
    try {
      const result = await invoke<string>('stop_llama_server');
      console.log(result);
    } catch (error) {
      console.error(`Failed to stop: ${error}`);
    }
  }

  async isRunning(): Promise<boolean> {
    return await invoke<boolean>('get_llama_status');
  }

  async test() {
    console.log('Testing llama-server...');
    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'Qwen3VL-2B-Instruct-Q4_K_M',
        messages: [
          {
            role: 'user',
            content: [{ type: 'text', text: 'What is tauri' }],
          },
        ],
        temperature: 0.1,
        top_k: 1,
      }),
    });

    const data = await response.json();
    return data;
  }

  async fetchApplicantInfo(base64Image: string): Promise<unknown> {
    const prompt = `
    You are a data extractor. Given a ID card image, return ONLY valid JSON:
        interface Applicant {
        fullName: string;
        nin: string;
        phoneNumber: string;
        birthdate: string;
        address: string;
    };
    `;
    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'Qwen3VL-2B-Instruct-Q4_K_M',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image_url',
                image_url: { url: base64Image },
              },
              {
                type: 'text',
                text: prompt,
              },
            ],
          },
        ],
        temperature: 0.1,
        top_k: 1,
      }),
    });

    const data = await response.json();
    console.log(data);
    return this.parseLlamaResponse(data);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async parseLlamaResponse(response: any): Promise<any> {
    // 1. Get the raw content string
    const rawContent = response.choices?.[0]?.message?.content;

    if (!rawContent) {
      throw new Error('No content received from llama-server');
    }

    try {
      // 2. Check if it's already a valid JSON string (rare but possible)
      // If not, strip Markdown code blocks (```json ... ```)
      const jsonStr = this.extractJsonFromMarkdown(rawContent);

      // 3. Parse the cleaned JSON string
      return JSON.parse(jsonStr);
    } catch (error) {
      console.error('Failed to parse Llama response:', error);
      console.error('Raw content:', rawContent);
      throw new Error(`Invalid JSON response from server: ${error}`);
    }
  }

  private extractJsonFromMarkdown(content: string): string {
    // Regex to match content inside ```json ... ``` or ``` ... ```
    const markdownRegex = /```(?:json)?\s*([\s\S]*?)```/;
    const match = content.match(markdownRegex);

    if (match && match[1]) {
      return match[1].trim();
    }

    // If no markdown block found, return the content as-is (it might be raw JSON)
    return content.trim();
  }

  async fileToBase64(file: File | Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsDataURL(file);
    });
  }

  resizeImage(file: File, maxDim = 1000): Promise<Blob | null> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        const scale = Math.min(maxDim / img.width, maxDim / img.height);
        const canvas = document.createElement('canvas');
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to create canvas context'));
          return;
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => resolve(blob), file.type, 0.85);
      };
    });
  }

  fetchApplicantInfoWithProgress(
    base64Image: string,
  ): Observable<ProgressEvent> {
    return new Observable<ProgressEvent>(
      (observer: Observer<ProgressEvent>) => {
        const prompt = `
          You are a data extractor. Given an ID card image, return ONLY valid JSON:
          {
            "fullName": "string",
            "nin": "string",
            "phoneNumber": "string",
            "birthdate": "YYYY-MM-DD",
            "address": "string"
          }
          Do not include any other text.
      `.trim();

        observer.next({
          status: 'started',
          progress: 0,
          message: 'Starting scan...',
        });

        const controller = new AbortController();
        let fullContent = ''; // Accumulate streamed content here
        let tokensReceived = 0;
        const estimatedTotalTokens = 150;

        fetch(this.apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'Qwen3VL-2B-Instruct-Q8_0',
            messages: [
              {
                role: 'user',
                content: [
                  { type: 'image_url', image_url: { url: base64Image } },
                  { type: 'text', text: prompt },
                ],
              },
            ],
            temperature: 0.1,
            top_k: 1,
            stream: true,
          }),
          signal: controller.signal,
        })
          .then(async (response) => {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }

            const reader = response.body?.getReader();
            if (!reader) throw new Error('ReadableStream not supported');

            const decoder = new TextDecoder();
            let buffer = '';

            observer.next({
              status: 'streaming',
              progress: 10,
              message: 'Processing image...',
            });

            while (true) {
              const { done, value } = await reader.read();
              if (done) break;

              buffer += decoder.decode(value, { stream: true });
              const lines = buffer.split('\n');
              buffer = lines.pop() || '';

              for (const line of lines) {
                if (line.startsWith('data: ')) {
                  const dataStr = line.slice(6);
                  if (dataStr.trim() === '[DONE]') continue;

                  try {
                    const chunk = JSON.parse(dataStr);
                    const delta = chunk.choices?.[0]?.delta?.content || '';

                    if (delta) {
                      fullContent += delta; // Accumulate content
                      tokensReceived += delta.length;

                      const progress = Math.min(
                        95,
                        Math.round(
                          (tokensReceived / estimatedTotalTokens) * 85,
                        ) + 10,
                      );
                      observer.next({
                        status: 'streaming',
                        progress,
                        message: `Extracting data... ${progress}%`,
                      });
                    }
                  } catch (e) {
                    // Ignore parse errors for incomplete chunks
                  }
                }
              }
            }

            // Parse the accumulated content as JSON
            let parsedData: unknown = null;
            try {
              // Clean up potential markdown code blocks if the model adds them
              const cleanJson = fullContent
                .replace(/```json\n?/g, '')
                .replace(/```\n?/g, '')
                .trim();
              parsedData = JSON.parse(cleanJson);
            } catch (parseError) {
              console.warn(
                'Failed to parse JSON response:',
                fullContent,
                parseError,
              );
              // Fallback: return raw string if JSON parsing fails
              parsedData = {
                rawResponse: fullContent,
                parseError: 'Invalid JSON',
              };
            }

            // Emit completion with the full JSON response
            observer.next({
              status: 'completed',
              progress: 100,
              message: 'Scan complete!',
              data: parsedData, // Return the model's JSON response here
            });
            observer.complete();
          })
          .catch((error) => {
            if (error.name === 'AbortError') return;
            observer.next({
              status: 'error',
              message: error.message || 'Scan failed',
            });
            observer.error(error);
          });

        return () => controller.abort();
      },
    );
  }
}
