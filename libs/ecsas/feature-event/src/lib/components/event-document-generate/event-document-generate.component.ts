import { Component, computed, inject, input, signal } from '@angular/core';
import { form, FormField, required, submit } from '@angular/forms/signals';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import {
  ButtonComponent,
  TextInputComponent,
} from '@org/ecsas/shared-ui';
import { EventDocumentType } from '@org/models';

interface DocFormModel {
  title: string;
  recipient: string;
}

const DOC_LABELS: Record<EventDocumentType, { label: string; recipientPlaceholder: string }> = {
  INVITATION_LETTER: {
    label: 'Lettre d\'invitation',
    recipientPlaceholder: 'Ex: M. le Président de quartier ...',
  },
  SPONSORSHIP_LETTER: {
    label: 'Lettre de demande de sponsoring',
    recipientPlaceholder: 'Ex: Directeur de société ...',
  },
  BUDGET: { label: 'Budgetisation de l\'évènement', recipientPlaceholder: 'Ex: Commission budget' },
  ATTENDANCE_SHEET: { label: 'Feuille de présence', recipientPlaceholder: 'Ex: Participants' },
  EVENT_REPORT: { label: 'Rapport d\'évènement', recipientPlaceholder: 'Ex: Commission santé' },
};

@Component({
  selector: 'lib-event-document-generate',
  imports: [FormField, TextInputComponent, ButtonComponent],
  templateUrl: './event-document-generate.component.html',
})
export class EventDocumentGenerateComponent {
  private readonly _dialogRef = inject(DynamicDialogRef);
  documentType = input.required<EventDocumentType>();

  labels = computed(() => DOC_LABELS[this.documentType()] ?? DOC_LABELS.EVENT_REPORT);

  model = signal<DocFormModel>({
    title: '',
    recipient: '',
  });

  docForm = form(this.model, (f) => {
    required(f.recipient, { message: 'Ce champ est requis' });
  });

  async submit() {
    await submit(this.docForm, async () => {
      if (this.docForm().valid()) {
        this._dialogRef?.close({
          type: this.documentType(),
          status: 'GENERATED',
          fileName: this.model().title || this.labels().label,
        });
      }
    });
  }
}
