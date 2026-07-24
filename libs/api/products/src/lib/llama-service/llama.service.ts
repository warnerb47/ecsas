import { invoke } from '@tauri-apps/api/core';

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
        model: 'Qwen3VL-2B-Instruct-Q8_0',
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
    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'Qwen3VL-2B-Instruct-Q8_0',
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
                text: 'Extract all text fields from this ID card. Return ONLY valid JSON',
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

  async fileToBase64(file: File): Promise<string> {
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
}
