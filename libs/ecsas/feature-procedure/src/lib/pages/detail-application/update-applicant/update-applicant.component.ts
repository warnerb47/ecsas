import { Component, inject, OnInit, signal } from '@angular/core';
import { form, FormField, required, submit } from '@angular/forms/signals';
import { DocumentManager } from '@org/api/products';
import { ApplicantGateway } from '@org/ecsas/ecsas-data';
import {
  ButtonComponent,
  DropdownComponent,
  PhoneInputComponent,
  TextInputComponent,
  UploadDocumentCardComponent,
} from '@org/ecsas/shared-ui';
import { Applicant, ApplicantPayload } from '@org/models';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';

@Component({
  selector: 'lib-update-applicant-component',
  imports: [
    TextInputComponent,
    ButtonComponent,
    PhoneInputComponent,
    DropdownComponent,
    UploadDocumentCardComponent,
    FormField,
  ],
  templateUrl: './update-applicant.component.html',
  providers: [DialogService],
})
export class UpdateApplicantComponent implements OnInit {
  private readonly _dialogRef = inject(DynamicDialogRef);
  private readonly _dialogConfig = inject(DynamicDialogConfig);
  private readonly _applicantGateway = inject(ApplicantGateway);
  private readonly _documentManager = new DocumentManager();
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
  applicant = signal<Applicant | null>(null);

  ngOnInit() {
    this.initFormState();
  }

  async initFormState() {
    const applicant: Applicant = this._dialogConfig.data;
    if (applicant) {
      this.applicant.set(applicant);
      const file = await this._documentManager.fetchFile({
        fullPath: applicant.sources?.[0]?.path ?? '',
        mimeType: applicant.sources?.[0]?.mimeType ?? '',
      });
      this.applicantModel.set({ ...applicant, source: file });
      this.onUpload(file);
    }
  }

  async updateApplicant() {
    const applicantId = await this._applicantGateway.updateApplicant({
      applicant: this.applicantModel(),
      sourceId: this.applicant()?.sources?.[0]?.id ?? '',
    });
    return applicantId;
  }

  async submitForm() {
    await submit(this.applicantForm, async () => {
      if (this.applicantForm().valid()) {
        await this.updateApplicant();
        if (!this.applicantModel().id) {
          return;
        }
        const applicant = await this._applicantGateway.getApplicantById(
          this.applicantModel()?.id ?? '',
        );
        this._dialogRef?.close(applicant);
      }
    });
  }

  onUpload(file: File | null) {
    this.document.update((doc) => ({ ...doc, file }));
  }
}
