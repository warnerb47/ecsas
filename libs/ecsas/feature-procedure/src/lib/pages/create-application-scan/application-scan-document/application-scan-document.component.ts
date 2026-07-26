import {
  Component,
  ElementRef,
  input,
  output,
  signal,
  ViewChild,
} from '@angular/core';
import { LlamaService } from '@org/api/products';
import { tap } from 'rxjs';

@Component({
  selector: 'lib-application-scan-document',
  standalone: true,
  imports: [],
  templateUrl: './application-scan-document.component.html',
})
export class ApplicationScanDocumentComponent {
  private readonly _llamaService = new LlamaService();
  accept = input<string>('');
  rawFileName = input<string>('');
  fileSelected = output<File | null>();
  selectedFileName = signal('');
  selectedFile = output<File | null>();
  progressEvent = signal<{
    status: 'started' | 'streaming' | 'completed' | 'error';
    progress?: number; // 0–100
    message?: string;
    data?: unknown;
  } | null>(null);

  @ViewChild('fileInput', { static: false }) fileInput:
    | ElementRef<HTMLInputElement>
    | undefined;

  onUpload() {
    this.fileInput?.nativeElement?.click();
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0] ?? null;
    this.selectedFile.emit(file ?? null);
    this.selectedFileName.set(file?.name ?? '');
    if (file && this.rawFileName()) {
      const extension = file.type ? `.${file.type.split('/').pop()}` : '';
      const newName = `${this.rawFileName()}${extension}`;
      const renamedFile = new File([file], newName, {
        type: file.type,
        lastModified: file.lastModified,
      });
      this.fileSelected.emit(renamedFile);
      this.scrapInfo(renamedFile);
    } else {
      this.fileSelected.emit(file);
      this.scrapInfo(file);
    }
  }

  async scrapInfo(file: File | null) {
    if (!file) return;
    const resiezedImage = await this._llamaService.resizeImage(file);
    if (!resiezedImage) return;
    const base64 = await this._llamaService.fileToBase64(resiezedImage);
    this._llamaService
      .fetchApplicantInfoWithProgress(base64)
      .pipe(
        tap((res) =>{
          this.progressEvent.set(
            res as unknown as {
              status: 'started' | 'streaming' | 'completed' | 'error';
              progress?: number; // 0–100
              message?: string;
              data?: unknown;
            },
          );
        }
        ),
      )
      .subscribe();
  }
}
