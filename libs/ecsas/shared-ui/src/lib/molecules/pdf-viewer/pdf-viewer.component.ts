import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Source } from '@org/models';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { DocumentManager } from '@org/api/products';

@Component({
  selector: 'lib-pdf-viewer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pdf-viewer.component.html',
})
export class PdfViewerComponent implements OnInit {
  private readonly _dialogConfig = inject(DynamicDialogConfig);
  private readonly _sanitizer = inject(DomSanitizer);
  private readonly _documentManager = new DocumentManager();

  source = signal<Partial<Source> | null>(null);
  safeUrl = signal<SafeUrl | null>(null);

  ngOnInit(): void {
    this.fetchSource();
  }

  async fetchSource() {
    const dialogData = this._dialogConfig?.data ?? null;
    this.source.set(dialogData);

    const assetUrl = await this.getAssetUrl();
    this.safeUrl.set(
      this._sanitizer.bypassSecurityTrustResourceUrl(assetUrl ?? ''),
    );
  }

  async getAssetUrl() {
    const file = await this._documentManager.fetchFile({
      fullPath: this.source()?.path ?? '',
      mimeType: this.source()?.mimeType ?? '',
    });
    if (!file) {
      return null;
    }
    const arrayBuffer = await file.arrayBuffer();
    const fileData = new Uint8Array(arrayBuffer);
    const blob = new Blob([fileData], { type: file?.type });
    const generatedBlobUrl = URL.createObjectURL(blob);
    return generatedBlobUrl;
  }
}
