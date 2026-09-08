import { Injectable, signal } from '@angular/core';
import { invoke } from '@tauri-apps/api/core';
import { listen, UnlistenFn } from '@tauri-apps/api/event';
import { readFile } from '@tauri-apps/plugin-fs';

export interface TransferredFile {
  path: string;
  name: string;
}

const MIME_BY_EXTENSION: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  gif: 'image/gif',
  webp: 'image/webp',
  bmp: 'image/bmp',
  heic: 'image/heic',
  heif: 'image/heif',
  svg: 'image/svg+xml',
  pdf: 'application/pdf',
};

function fileNameFromPath(path: string): string {
  return path.split(/[\\/]/).pop() ?? path;
}

function mimeFromName(name: string): string {
  const extension = name.split('.').pop()?.toLowerCase() ?? '';
  return MIME_BY_EXTENSION[extension] ?? 'application/octet-stream';
}

@Injectable({
  providedIn: 'root',
})
export class TransferFileService {
  readonly url = signal<string | null>(null);

  private _unlisten: UnlistenFn[] = [];

  async start(): Promise<string> {
    const url = await invoke<string>('start_transfer_server');
    this.url.set(url);
    return url;
  }

  async stop(): Promise<void> {
    await invoke<string>('stop_transfer_server');
    this.url.set(null);
  }

  listenForFiles(handler: (files: TransferredFile[]) => void): Promise<void> {
    return this._listen('file-received', (paths: string[]) => {
      handler((paths ?? []).map((path) => ({ path, name: fileNameFromPath(path) })));
    });
  }

  listenForStopped(handler: () => void): Promise<void> {
    return this._listen('transfer-stopped', () => {
      this.url.set(null);
      handler();
    });
  }

  async readAsFile(path: string): Promise<File> {
    const bytes = await readFile(path);
    const name = fileNameFromPath(path);
    return new File([bytes], name, { type: mimeFromName(name) });
  }

  dispose(): void {
    for (const unlisten of this._unlisten) {
      unlisten();
    }
    this._unlisten = [];
  }

  private async _listen<T>(
    event: string,
    handler: (payload: T) => void,
  ): Promise<void> {
    const unlisten = await listen<T>(event, (event) => handler(event.payload));
    this._unlisten.push(unlisten);
  }
}