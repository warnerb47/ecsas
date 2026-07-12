import { DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  ApplicantGateway,
  ApplicationGateway,
  ProcedureGateway,
} from '@org/ecsas/ecsas-data';
import {
  BreadcrumbItem,
  TopbarComponent,
  DropdownComponent,
  ButtonComponent,
  TextAreaComponent,
  PdfViewerComponent,
} from '@org/ecsas/shared-ui';
import {
  Applicant,
  Application,
  ApplicationPayload,
  Procedure,
  Source,
} from '@org/models';
import { DialogService } from 'primeng/dynamicdialog';
import { map, Subject, takeUntil } from 'rxjs';
import { UpdateApplicantComponent } from './update-applicant/update-applicant.component';
import { form, FormField, required, submit } from '@angular/forms/signals';

@Component({
  selector: 'lib-detail-application-component',
  imports: [
    RouterLink,
    TopbarComponent,
    DropdownComponent,
    ButtonComponent,
    TextAreaComponent,
    DatePipe,
    FormField,
  ],
  providers: [DialogService],
  templateUrl: './detail-application.component.html',
})
export class DetailApplicationComponent implements OnInit {
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _procedureGateway = inject(ProcedureGateway);
  private readonly _applicationGateway = inject(ApplicationGateway);
  private readonly _applicantGateway = inject(ApplicantGateway);
  private readonly _dialogService = inject(DialogService);
  private readonly _unsubscribe = new Subject<void>();

  procedureId = toSignal(
    this._activatedRoute.paramMap.pipe(map((p) => p.get('procedureId'))),
    { initialValue: null },
  );
  applicationId = toSignal(
    this._activatedRoute.paramMap.pipe(map((p) => p.get('applicationId'))),
    { initialValue: null },
  );
  procedure = signal<Partial<Procedure> | null>(null);
  application = signal<Partial<Application> | null>(null);
  applicant = signal<Partial<Applicant> | null>(null);

  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Procédures', route: '/procedure' },
    {
      label: 'Détail procedure',
      route: `/procedure/detail/${this.procedureId()}`,
    },
    { label: 'Détail demande', route: '.' },
  ];

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

  ngOnInit(): void {
    this.initState();
  }

  async initState() {
    this.fetchProcedureById();
    await this.fetchApplicationById();
    this.fetchApplicantById(this.application()?.applicant?.id ?? '');
    this.initFormState(this.application());
  }

  initFormState(application: Partial<Application> | null) {
    if (!application) {
      return;
    }
    const values: ApplicationPayload = {
      id: application.id ?? '',
      applicant: application.applicant?.id ?? '',
      procedure: this.procedureId() ?? '',
      mailRef: application.mailRef ?? '',
      status: application.status ?? null,
      state: application.state ?? null,
      requestedAmount: application.requestedAmount ?? null,
      receivedAmount: application.receivedAmount ?? null,
      comment: application.comment ?? '',
      sources: [],
    };
    this.applicationModel.set(values);
  }

  async fetchProcedureById() {
    try {
      const procedure = await this._procedureGateway.getProcedureById(
        this.procedureId() ?? '',
      );
      this.procedure.set(procedure);
    } catch (error) {
      console.error(error);
    }
  }

  async fetchApplicationById() {
    try {
      const application = await this._applicationGateway.getApplicationById(
        this.applicationId() ?? '',
      );
      this.application.set(application);
    } catch (error) {
      console.error(error);
    }
  }

  async fetchApplicantById(applicantId: string) {
    try {
      const applicant =
        await this._applicantGateway.getApplicantById(applicantId);
      this.applicant.set(applicant);
    } catch (error) {
      console.error(error);
    }
  }

  displaySource(source: Partial<Source>) {
    this._dialogService.open(PdfViewerComponent, {
      header: source.name,
      width: '80vw',
      height: '100vh',
      focusOnShow: false,
      closable: true,
      closeOnEscape: true,
      maximizable: true,
      data: source,
    });
  }
  editApplicant() {
    this._dialogService
      .open(UpdateApplicantComponent, {
        header: 'Modifier le bénéficiaire',
        width: '40vw',
        focusOnShow: false,
        closable: true,
        closeOnEscape: true,
        data: this.applicant(),
      })
      ?.onClose.pipe(takeUntil(this._unsubscribe))
      .subscribe((result) => {
        if (!result) return;
        this.applicant.set(result);
      });
  }

  async updateApplication() {
    const applicantId = await this._applicationGateway.updateApplication({
      application: this.applicationModel(),
      applicationId: this.application()?.id ?? '',
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
          this.fetchApplicationById();
        }
      });
    } catch (error) {
      console.error(error);
    } finally {
      this.loadingSubmit.set(false);
    }
  }
}
