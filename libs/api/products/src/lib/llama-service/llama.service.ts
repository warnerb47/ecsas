import { readFile } from '@tauri-apps/plugin-fs';
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

  async extractIdCard(imagePath: string): Promise<unknown> {
    // Read file as Base64 (Angular/TS)
    const base64Image = await this.fileToBase64(imagePath);

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
                image_url: { url: `data:image/png;base64,${base64Image}` },
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
    return JSON.parse(data.choices[0].message.content);
  }

  private fileToBase64(path: string): Promise<string> {
    return new Promise((resolve, reject) => {
      readFile(path)
        .then((data) => {
          const binary = String.fromCharCode(...new Uint8Array(data));
          resolve(btoa(binary));
        })
        .catch(reject);
    });
  }
}
