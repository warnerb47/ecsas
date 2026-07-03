import {
  Component,
  ElementRef,
  input,
  model,
  OnInit,
  output,
  signal,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../atoms';
import {
  FormValueControl,
  ValidationError,
  WithOptionalFieldTree,
} from '@angular/forms/signals';

@Component({
  selector: 'lib-upload-document-card',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './upload-document-card.component.html',
})
export class UploadDocumentCardComponent implements FormValueControl<File | null> {
  label = input('');
  placeholder = input('');
  value = model<File | null>(null);
  accept = input<string>('');

  // Interaction state (touched)
  readonly touched = model<boolean>(false);

  // State inputs automatically populated by [formField]
  readonly invalid = input<boolean>(false);
  readonly errors = input<readonly WithOptionalFieldTree<ValidationError>[]>(
    [],
  );
  readonly disabled = input<boolean>(false);

  selectedFileName = signal('');
  selectedFile = output<File | null>();

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
    this.value.set(file);
  }
}
