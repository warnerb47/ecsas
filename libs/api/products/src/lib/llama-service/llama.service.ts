import { readFile } from '@tauri-apps/plugin-fs';
import { Child, Command } from '@tauri-apps/plugin-shell';

export class LlamaService {
  private apiUrl = 'http://localhost:8080/v1/chat/completions';
  private llamaProcess: Child | null = null;

  async startLlamaServer() {
    try {
      const sidecar = 'binaries/llama-server/llama-server';
      const args = [
        '-m',
        './resources/Qwen3VL-2B-Instruct-Q8_0.gguf',
        '--mmproj',
        './resources/mmproj-Qwen3VL-2B-Instruct-F16.gguf',
        '--port',
        '8080',
        '-t',
        '8',
        '--ctx-size',
        '4096',
        '--mlock',
      ];

      const command = Command.sidecar(sidecar, args);
      const llamaProcess = await command.spawn();
      this.llamaProcess = llamaProcess;
      console.log(
        `llama-server running on port 8080 (pid: ${this.llamaProcess?.pid})`,
      );
    } catch (error) {
      console.error(`Failed to start: ${error}`);
    }
  }

  stopLlamaServer() {
    if (this.llamaProcess) {
      console.log('Stopping llama-server...');
      try {
        this.llamaProcess?.kill();
        this.llamaProcess = null;
      } catch (err) {
        console.error('Failed to kill process:', err);
      }
    }
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
