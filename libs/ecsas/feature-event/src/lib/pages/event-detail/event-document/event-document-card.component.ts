import { Component, input, output } from '@angular/core';
import { ButtonComponent } from '@org/ecsas/shared-ui';
import { EventDocument } from '@org/models';
import {
  DocumentDef,
  GenerateDocumentEvent,
  UploadDocumentEvent,
} from './event-document.component';

@Component({
  selector: 'lib-event-document-card',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './event-document-card.component.html',
})
export class EventDocumentCardComponent {
  def = input.required<DocumentDef>();
  doc = input<Partial<EventDocument> | undefined>();

  generate = output<GenerateDocumentEvent>();
  upload = output<UploadDocumentEvent>();

  onGenerate() {
    this.generate.emit({ type: this.def().type, label: this.def().label });
  }

  onFileChange(inputEvent: Event) {
    const target = inputEvent.target as HTMLInputElement | null;
    const file = target?.files?.[0] ?? null;
    if (!target || !file) return;
    this.upload.emit({ type: this.def().type, file });
    target.value = '';
  }
}