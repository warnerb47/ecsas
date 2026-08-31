import { Component, inject, signal } from '@angular/core';
import { form, FormField, required, submit } from '@angular/forms/signals';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import {
  ButtonComponent,
  TextInputComponent,
} from '@org/ecsas/shared-ui';
import { EventUsefulLink } from '@org/models';

interface LinkFormModel {
  label: string;
  url: string;
}

@Component({
  selector: 'lib-event-link-form',
  imports: [FormField, TextInputComponent, ButtonComponent],
  templateUrl: './event-link-form.component.html',
})
export class EventLinkFormComponent {
  private readonly _dialogRef = inject(DynamicDialogRef);

  model = signal<LinkFormModel>({
    label: '',
    url: '',
  });

  linkForm = form(this.model, (f) => {
    required(f.label, { message: 'Le titre est requis' });
    required(f.url, { message: 'L\'URL est requise' });
  });

  async submit() {
    await submit(this.linkForm, async () => {
      if (this.linkForm().valid()) {
        this._dialogRef?.close(this.model() as Partial<EventUsefulLink>);
      }
    });
  }
}
