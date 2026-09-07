import { Component, inject, signal } from '@angular/core';
import { form, FormField, required, submit } from '@angular/forms/signals';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import {
  ButtonComponent,
  DropdownComponent,
  TextInputComponent,
} from '@org/ecsas/shared-ui';
import { EventPartner } from '@org/models';

interface PartnerFormModel {
  name: string;
  role: string;
  contact: string;
}

@Component({
  selector: 'lib-event-partner-form',
  imports: [FormField, TextInputComponent, DropdownComponent, ButtonComponent],
  templateUrl: './event-partner-form.component.html',
})
export class EventPartnerFormComponent {
  private readonly _dialogRef = inject(DynamicDialogRef);

  types = [
    { label: 'Spécialiste', value: 'Spécialiste' },
    { label: 'Enseignant', value: 'Enseignant' },
    { label: 'Communauté', value: 'Communauté' },
    { label: 'Mairie', value: 'Mairie' },
    { label: 'Partenaire', value: 'Partenaire' },
    { label: 'Autre', value: 'Autre' },
  ];

  model = signal<PartnerFormModel>({
    name: '',
    role: 'Partenaire',
    contact: '',
  });

  partnerForm = form(this.model, (f) => {
    required(f.name, { message: 'Le nom du partenaire est requis' });
  });

  async submit() {
    await submit(this.partnerForm, async () => {
      if (this.partnerForm().valid()) {
        this._dialogRef?.close(this.model() as Partial<EventPartner>);
      }
    });
  }
}
