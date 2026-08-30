import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Source } from '@org/models';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { DocumentManager } from '@org/api/products';
import { ButtonComponent } from '../../atoms';
import { delay, firstValueFrom, of } from 'rxjs';

@Component({
  selector: 'lib-pdf-viewer',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './pdf-viewer.component.html',
})
export class PdfViewerComponent implements OnInit {
  private readonly _dialogConfig = inject(DynamicDialogConfig);
  private readonly _sanitizer = inject(DomSanitizer);
  private readonly _documentManager = new DocumentManager();

  source = signal<Partial<Source> | null>(null);
  safeUrl = signal<SafeUrl | null>(null);
  loading = signal(false);
  loadFailed = signal(false);
  retrying = signal(false);

  ngOnInit(): void {
    this.fetchSource();
  }

  async onRetry() {
    this.retrying.set(true);
    await firstValueFrom(of('wait').pipe(delay(1000)));
    this.fetchSource();
  }

  async fetchSource() {
    const dialogData = this._dialogConfig?.data ?? null;
    this.source.set(dialogData);

    this.loading.set(true);
    this.loadFailed.set(false);
    try {
      const assetUrl = await this.getAssetUrl();
      if (!assetUrl) {
        this.loadFailed.set(true);
        return;
      }
      this.safeUrl.set(
        this._sanitizer.bypassSecurityTrustResourceUrl(assetUrl),
      );
    } catch (error) {
      console.error(error);
      this.loadFailed.set(true);
    } finally {
      this.loading.set(false);
      this.retrying.set(false);
    }
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
