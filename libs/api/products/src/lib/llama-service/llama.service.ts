import { invoke } from '@tauri-apps/api/core';
import { readFile } from '@tauri-apps/plugin-fs';



export class LlamaService {
  private apiUrl = 'http://localhost:8080/v1/chat/completions';

  async initServer() {
    // Trigger Rust command to start sidecar
    return await invoke('start_ocr_server');
  }

  async test() {

    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: "Qwen3VL-2B-Instruct-Q8_0",
        messages: [{
          role: "user",
          content: [
            { type: "text", text: "What is tauri" }
          ]
        }],
        temperature: 0.1,
        top_k: 1
      })
    });

    const data = await response.json();
    return data;
  }

  async extractIdCard(imagePath: string): Promise<any> {
    // Read file as Base64 (Angular/TS)
    const base64Image = await this.fileToBase64(imagePath);

    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: "Qwen3VL-2B-Instruct-Q8_0",
        messages: [{
          role: "user",
          content: [
            { type: "image_url", image_url: { url: `data:image/png;base64,${base64Image}` } },
            { type: "text", text: "Extract all text fields from this ID card. Return ONLY valid JSON" }
          ]
        }],
        temperature: 0.1,
        top_k: 1
      })
    });

    const data = await response.json();
    return JSON.parse(data.choices[0].message.content);
  }

  private fileToBase64(path: string): Promise<string> {
    return new Promise((resolve, reject) => {
      readFile(path).then(data => {
        const binary = String.fromCharCode(...new Uint8Array(data));
        resolve(btoa(binary));
      }).catch(reject);
    });
  }
}
