import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Source } from '@org/models';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { readFile } from '@tauri-apps/plugin-fs';

@Component({
  selector: 'lib-pdf-viewer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pdf-viewer.component.html',
})
export class PdfViewerComponent implements OnInit {
  private readonly _dialogConfig = inject(DynamicDialogConfig);
  private readonly _sanitizer = inject(DomSanitizer);

  source = signal<Partial<Source> | null>(null);
  safeUrl = signal<SafeUrl | null>(null);

  ngOnInit(): void {
    this.fetchSource();
  }

  async fetchSource() {
    const dialogData = this._dialogConfig?.data ?? null;
    this.source.set(dialogData);

    const assetUrl = await this.getAssetUrl();
    console.log({ assetUrl });
    this.safeUrl.set(
      this._sanitizer.bypassSecurityTrustResourceUrl(assetUrl ?? ''),
    );
    console.log({ dialogData });
  }

  async getAssetUrl() {
    // 1. Fetch file bytes from disk via Tauri
    if (!this.source()?.path) {
      return null;
    }

    const fileContents = await readFile(this.source()?.path ?? '');

    // 2. Wrap it into a browser-native PDF blob
    const blob = new Blob([fileContents], { type: this.source()?.mimeType });

    // 3. Generate a standard, local blob:// URL
    const generatedBlobUrl = URL.createObjectURL(blob);
    return generatedBlobUrl;

  }

}
