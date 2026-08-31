import { Component, inject, signal } from '@angular/core';
import { form, FormField, required, submit } from '@angular/forms/signals';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import {
  ButtonComponent,
  DateInputComponent,
  DropdownComponent,
  NumberInputComponent,
  TextAreaComponent,
  TextInputComponent,
} from '@org/ecsas/shared-ui';
import { Event, EventPayload } from '@org/models';

@Component({
  selector: 'lib-event-create-dialog',
  imports: [
    FormField,
    TextInputComponent,
    TextAreaComponent,
    DropdownComponent,
    DateInputComponent,
    NumberInputComponent,
    ButtonComponent,
  ],
  templateUrl: './event-create-dialog.component.html',
})
export class EventCreateDialogComponent {
  private readonly _dialogRef = inject(DynamicDialogRef);
  private readonly _dialogConfig = inject(DynamicDialogConfig);

  isEdit = !!this._dialogConfig?.data?.event;

  private readonly existing: Partial<Event> = this._dialogConfig?.data?.event ?? {};

  eventTypes = [
    { label: 'Secours social', value: 'SOCIAL_CARE' },
    { label: 'Santé', value: 'HEALTH' },
    { label: 'Réunion', value: 'MEETING' },
    { label: 'Cérémonie', value: 'CEREMONY' },
    { label: 'Communautaire', value: 'COMMUNITY' },
  ];

  eventStatuses = [
    { label: 'Planifié', value: 'PLANNED' },
    { label: 'En cours', value: 'IN_PROGRESS' },
    { label: 'Terminé', value: 'COMPLETED' },
    { label: 'Annulé', value: 'CANCELLED' },
  ];

  model = signal<EventPayload>({
    id: this.existing.id,
    name: this.existing.name ?? '',
    type: this.existing.type ?? 'MEETING',
    status: this.existing.status ?? 'PLANNED',
    startDate: this.existing.startDate ?? '',
    endDate: this.existing.endDate ?? '',
    startTime: this.existing.startTime ?? '',
    endTime: this.existing.endTime ?? '',
    location: this.existing.location ?? '',
    expectedParticipants: this.existing.expectedParticipants ?? null,
    description: this.existing.description ?? '',
    budget: this.existing.budget ?? null,
  });

  eventForm = form(this.model, (f) => {
    required(f.name, { message: 'Le nom de l\'événement est requis' });
    required(f.type, { message: 'Le type est requis' });
    required(f.status, { message: 'Le statut est requis' });
    required(f.startDate, { message: 'La date de début est requise' });
    required(f.endDate, { message: 'La date de fin est requise' });
  });

  async save() {
    await submit(this.eventForm, async () => {
      if (this.eventForm().valid()) {
        this._dialogRef?.close(this.model());
      }
    });
  }
}
