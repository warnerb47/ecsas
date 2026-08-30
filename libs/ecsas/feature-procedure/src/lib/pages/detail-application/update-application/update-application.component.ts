import { Component, inject, OnInit, signal } from '@angular/core';
import { form, FormField, required, submit } from '@angular/forms/signals';
import { ApplicationGateway } from '@org/ecsas/ecsas-data';
import {
  ButtonComponent,
  DropdownComponent,
  TextAreaComponent,
} from '@org/ecsas/shared-ui';
import { Application, ApplicationPayload } from '@org/models';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';

@Component({
  selector: 'lib-update-application-component',
  imports: [
    DropdownComponent,
    ButtonComponent,
    TextAreaComponent,
    FormField,
  ],
  templateUrl: './update-application.component.html',
  providers: [DialogService],
})
export class UpdateApplicationComponent implements OnInit {
  private readonly _dialogRef = inject(DynamicDialogRef);
  private readonly _dialogConfig = inject(DynamicDialogConfig);
  private readonly _applicationGateway = inject(ApplicationGateway);
  statuts = [
    { label: 'En cours', value: 'PENDING' },
    { label: 'Acceptée', value: 'APPROVED' },
    { label: 'Refusée', value: 'REJECTED' },
  ];

  conformities = [
    { label: 'Conforme', value: 'COMPLIANT' },
    { label: 'Hors zone', value: 'OUT_OF_ZONE' },
    { label: 'Dossier incomplet', value: 'INCOMPLETE' },
    { label: 'Demande du Maire', value: 'MAYOR_REQUEST' },
  ];

  applicationModel = signal<ApplicationPayload>({
    id: '',
    applicant: '',
    procedure: '',
    mailRef: '',
    status: null,
    state: null,
    requestedAmount: 0,
    receivedAmount: 0,
    comment: '',
    sources: [],
  });

  applicationForm = form(this.applicationModel, (f) => {
    required(f.status, { message: 'Ce champ est requis' });
  });
  loadingSubmit = signal(false);

  ngOnInit() {
    this.initFormState();
  }

  initFormState() {
    const application: Partial<Application> | null = this._dialogConfig.data;
    if (!application) {
      return;
    }
    const values: ApplicationPayload = {
      id: application.id ?? '',
      applicant: application.applicant?.id ?? '',
      procedure: application.procedure?.id ?? '',
      mailRef: application.mailRef ?? '',
      status: application.status ?? null,
      state: application.state ?? null,
      requestedAmount: application.requestedAmount ?? null,
      receivedAmount: application.receivedAmount ?? null,
      comment: application.comment ?? '',
      sources: [],
    };
    console.log({values});
    this.applicationModel.set(values);
  }

  async updateApplication() {
    const applicationId = this.applicationModel().id;
    if (!applicationId) {
      throw new Error('No application id');
    }
    const applicantId = await this._applicationGateway.updateApplication({
      application: this.applicationModel(),
      applicationId,
    });
    return applicantId;
  }

  async submit() {
    try {
      await submit(this.applicationForm, async () => {
        if (this.applicationForm().valid()) {
          if (!this.applicationModel().id) {
            return;
          }
          this.loadingSubmit.set(true);
          await this.updateApplication();
          this._dialogRef.close(true);
        }
      });
    } catch (error) {
      console.error(error);
    } finally {
      this.loadingSubmit.set(false);
    }
  }
}
