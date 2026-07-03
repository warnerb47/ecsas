import { Component, inject, signal } from '@angular/core';
import { form, FormField, required, submit } from '@angular/forms/signals';
import {
  ButtonComponent,
  DropdownComponent,
  PhoneInputComponent,
  TextInputComponent,
  UploadDocumentCardComponent,
} from '@org/ecsas/shared-ui';
import { ApplicantPayload } from '@org/models';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'lib-create-applicant-component',
  imports: [
    TextInputComponent,
    ButtonComponent,
    PhoneInputComponent,
    DropdownComponent,
    UploadDocumentCardComponent,
    FormField,
  ],
  templateUrl: './create-applicant.component.html',
  providers: [DialogService],
})
export class CreateApplicantComponent {
  private readonly _dialogRef = inject(DynamicDialogRef);
  document = signal<{
    name: string;
    hint: string;
    file: File | null;
  }>({
    name: 'Photocopie CNI ou extrait de naissance',
    hint: 'Copie recto et verso de la CNI',
    file: null,
  });

  applicantStatus = [
    { label: 'Aucun', value: 'DEFAULT' },
    { label: 'Cas social ', value: 'SOCIAL_CASE' },
    { label: 'Non nécessiteux', value: 'NON_ESSENTIAL' },
    { label: 'Déjà prise en charge récemment', value: 'RECENTLY_SUPPORTED' },
    { label: 'Age non conforme', value: 'INAPPROPRIATE_AGE' },
  ];

  applicantModel = signal<ApplicantPayload>({
    fullName: '',
    nin: '',
    phoneNumber: '',
    address: '',
    sources: null,
    status: 'DEFAULT',
  });

  applicantForm = form(this.applicantModel, (f) => {
    required(f.fullName, { message: 'Le prénom et nom est requis' });
    required(f.nin, { message: 'Le NIN est requis' });
    required(f.sources, { message: 'La CNI ou l\'extrait de naissance est requis' });
  });

  async createApplicant() {
    console.log({ applicant: this.applicantModel() });
  }

  async submitForm() {
    await submit(this.applicantForm, async () => {
      if (this.applicantForm().valid()) {
        await this.createApplicant();
        // this._dialogRef?.close(this.applicantModel());
      }
    });
  }

  onUpload(file: File | null) {
    this.document.update((doc) => ({ ...doc, file }));
  }
}
