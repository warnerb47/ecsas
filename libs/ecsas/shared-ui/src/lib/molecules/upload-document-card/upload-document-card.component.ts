import {
  Component,
  ElementRef,
  input,
  output,
  signal,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../atoms';

@Component({
  selector: 'lib-upload-document-card',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './upload-document-card.component.html',
})
export class UploadDocumentCardComponent {
  documentName = input.required<string>();
  documentHint = input<string>('');
  fileName = input<string>('');
  formatHint = input<string>('Format PDF ou JPG uniquement');
  selectedFile = output<File | null>();
  selectedFileName = signal(this.fileName() || '');

  @ViewChild('fileInput', { static: false }) fileInput:
    | ElementRef<HTMLInputElement>
    | undefined;

  onUpload() {
    this.fileInput?.nativeElement?.click();
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    this.selectedFile.emit(file ?? null);
    this.selectedFileName.set(file?.name ?? '');
  }
}
