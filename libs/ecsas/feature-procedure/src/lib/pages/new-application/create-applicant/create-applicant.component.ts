import { Component, inject, signal } from '@angular/core';
import { form, required, submit } from '@angular/forms/signals';
import {
  ButtonComponent,
  PhoneInputComponent,
  TextInputComponent,
  UploadDocumentCardComponent,
} from '@org/ecsas/shared-ui';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'lib-create-applicant-component',
  imports: [
    TextInputComponent,
    ButtonComponent,
    PhoneInputComponent,
    UploadDocumentCardComponent,
  ],
  templateUrl: './create-applicant.component.html',
  providers: [DialogService],
})
export class CreateApplicantComponent {
  private readonly _dialogRef = inject(DynamicDialogRef);

  documentModel = signal({
    name: '',
    required: false,
  });

  quartiers = [];

  docForm = form(this.documentModel, (f) => {
    required(f.name, { message: 'Le nom du document est requis' });
  });

  async addDocument() {
    await submit(this.docForm, async () => {
      if (this.docForm().valid()) {
        this._dialogRef?.close(this.documentModel());
      }
    });
  }
}
