import { Component, input, output } from '@angular/core';
import { ButtonComponent } from '@org/ecsas/shared-ui';
import {
  EventDocument,
  EventDocumentType,
} from '@org/models';
import { EventDocumentCardComponent } from './event-document-card.component';

export interface DocumentDef {
  type: EventDocumentType;
  label: string;
  icon: string;
  description: string;
}

export const DOCUMENTS: DocumentDef[] = [
  {
    type: 'INVITATION_LETTER',
    label: "Lettre d'invitation",
    icon: 'pi pi-file-pdf',
    description: "Invitation officielle à l'événement",
  },
  {
    type: 'SPONSORSHIP_LETTER',
    label: 'Lettre de demande de sponsoring',
    icon: 'pi pi-money-bill',
    description: 'Demande de soutien financier',
  },
  {
    type: 'BUDGET',
    label: "Budgetisation de l'évènement",
    icon: 'pi pi-chart-bar',
    description: 'Budget prévisionnel détaillé',
  },
  {
    type: 'ATTENDANCE_SHEET',
    label: 'Feuille de présence',
    icon: 'pi pi-users',
    description: 'Émargement des participants',
  },
  {
    type: 'EVENT_REPORT',
    label: "Rapport d'évènement",
    icon: 'pi pi-file-word',
    description: 'Compte-rendu final de la manifestation',
  },
];

export interface GenerateDocumentEvent {
  type: EventDocumentType;
  label: string;
}

export interface UploadDocumentEvent {
  type: EventDocumentType;
  file: File;
}

@Component({
  selector: 'lib-event-document',
  standalone: true,
  imports: [ButtonComponent, EventDocumentCardComponent],
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