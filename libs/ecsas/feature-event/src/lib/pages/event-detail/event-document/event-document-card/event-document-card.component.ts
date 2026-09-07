import { Component, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { UploadDocumentCardComponent } from '@org/ecsas/shared-ui';
import { EventDocument } from '@org/models';
import {
  DocumentDef,
  UploadDocumentEvent,
  VisualizeDocumentEvent,
} from '../event-document.component';

@Component({
  selector: 'lib-event-document-card',
  standalone: true,
  imports: [DatePipe, UploadDocumentCardComponent],
  templateUrl: './event-document-card.component.html',
})
export class EventDocumentCardComponent {
  def = input.required<DocumentDef>();
  doc = input<Partial<EventDocument> | undefined>();

  upload = output<UploadDocumentEvent>();
  visualize = output<VisualizeDocumentEvent>();

  onFileSelected(file: File | null) {
    if (!file) return;
    this.upload.emit({ type: this.def().type, file });
  }

  onVisualize() {
    const doc = this.doc();
    if (!doc?.source) return;
    this.visualize.emit({ type: this.def().type, doc });
  }
}