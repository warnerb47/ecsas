import { Component, input, OnInit, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../atoms';

@Component({
  selector: 'lib-upload-document-card',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './upload-document-card.component.html'
})
export class UploadDocumentCardComponent implements OnInit {
  documentName = input.required<string>();
  documentHint = input<string>('');
  fileName = input<string>('');
  formatHint = input<string>('Format PDF ou JPG uniquement');
  uploaded = output<void>();
  modified = output<void>();

  isUploaded = signal(false);

  ngOnInit() {
    this.isUploaded.set(!!this.fileName());
  }

  onUpload() {
    this.uploaded.emit();
  }

  onModify() {
    this.modified.emit();
  }
}
