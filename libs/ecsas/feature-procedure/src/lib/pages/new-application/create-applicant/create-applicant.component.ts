import { Component, inject, signal } from '@angular/core';
import { form, FormField, required, submit } from '@angular/forms/signals';
import { ApplicantGateway } from '@org/ecsas/ecsas-data';
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
  private readonly _applicantGateway = inject(ApplicantGateway);
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
    source: null,
    status: 'DEFAULT',
  });

  applicantForm = form(this.applicantModel, (f) => {
    required(f.fullName, { message: 'Le prénom et nom est requis' });
    required(f.nin, { message: 'Le NIN est requis' });
    required(f.source, {
      message: "La CNI ou l'extrait de naissance est requis",
    });
  });

  async createApplicant() {
    console.log({ applicant: this.applicantModel() });
    const applicantId = await this._applicantGateway.createApplicant(
      this.applicantModel(),
    );
    return applicantId;
  }

  async submitForm() {
    await submit(this.applicantForm, async () => {
      if (this.applicantForm().valid()) {
        const applicantId = await this.createApplicant();
        if (!applicantId) {
          return;
        }
        const applicant = await this._applicantGateway.getApplicantById(applicantId);
        this._dialogRef?.close(applicant);
      }
    });
  }

  onUpload(file: File | null) {
    this.document.update((doc) => ({ ...doc, file }));
  }
}
