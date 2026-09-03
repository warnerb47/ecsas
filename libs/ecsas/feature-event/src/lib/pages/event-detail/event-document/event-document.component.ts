import { Component, input, output } from '@angular/core';
import {
  ButtonComponent,
  UploadDocumentCardComponent,
} from '@org/ecsas/shared-ui';
import {
  EventDocument,
  EventDocumentType,
} from '@org/models';

export interface DocumentDef {
  type: EventDocumentType;
  label: string;
}

export const DOCUMENTS: DocumentDef[] = [
  {
    type: 'INVITATION_LETTER',
    label: "Lettre d'invitation",
  },
  {
    type: 'SPONSORSHIP_LETTER',
    label: 'Lettre de demande de sponsoring',
  },
  {
    type: 'BUDGET',
    label: "Budgetisation de l'évènement",
  },
  {
    type: 'ATTENDANCE_SHEET',
    label: 'Feuille de présence',
  },
  {
    type: 'EVENT_REPORT',
    label: "Rapport d'évènement",
  },
];

export interface GenerateDocumentEvent {
  type: EventDocumentType;
  label: string;
}

export interface UploadDocumentEvent {
  type: EventDocumentType;
  file: File | null;
}

@Component({
  selector: 'lib-event-document',
  standalone: true,
  imports: [ButtonComponent, UploadDocumentCardComponent],
  templateUrl: './event-document.component.html',
})
export class EventDocumentComponent {
  documents = input<Partial<EventDocument>[]>([]);
  documentDefs = DOCUMENTS;

  generate = output<GenerateDocumentEvent>();
  upload = output<UploadDocumentEvent>();
  openFolder = output<void>();

  getDocument(def: DocumentDef): Partial<EventDocument> | undefined {
    return this.documents().find((d) => d.type === def.type);
  }
}
