import { DatePipe, NgClass } from '@angular/common';
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
  ButtonComponent,
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
import { form, required } from '@angular/forms/signals';
import { UpdateApplicationComponent } from './update-application/update-application.component';

@Component({
  selector: 'lib-detail-application-component',
  imports: [
    RouterLink,
    TopbarComponent,
    ButtonComponent,
    DatePipe,
    NgClass,
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

  editApplication() {
    this._dialogService
      .open(UpdateApplicationComponent, {
        header: 'Modifier le status de la demande',
        width: '40vw',
        focusOnShow: false,
        closable: true,
        closeOnEscape: true,
        data: {...this.application(), procedure: this.procedure()},
      })
      ?.onClose.pipe(takeUntil(this._unsubscribe))
      .subscribe((result) => {
        if (!result) return;
        this.fetchApplicationById();
      });
  }

  getApplicantStatusClasses(status: string | undefined): string {
    const map: Record<string, string> = {
      SOCIAL_CASE: 'bg-amber-50 text-amber-700 border-amber-100',
      NON_ESSENTIAL: 'bg-slate-50 text-slate-700 border-slate-100',
      RECENTLY_SUPPORTED: 'bg-violet-50 text-violet-700 border-violet-100',
      INAPPROPRIATE_AGE: 'bg-red-50 text-red-700 border-red-100',
      DEFAULT: 'bg-slate-50 text-slate-700 border-slate-100',
    };
    return (status && map[status]) ?? 'bg-slate-50 text-slate-700 border-slate-100';
  }
  getApplicantStatusLabel(status: string | undefined): string {
    if (!status) return 'Non défini';
    const map: Record<string, string> = {
      SOCIAL_CASE: 'Cas social',
      NON_ESSENTIAL: 'Non nécessiteux',
      RECENTLY_SUPPORTED: 'Déjà prise en charge',
      INAPPROPRIATE_AGE: 'Âge non conforme',
      DEFAULT: 'Aucun',
    };
    return map[status] ?? 'Non défini';
  }

  getStatusClasses(status: string | undefined): string {
    if (!status) return 'bg-slate-50 text-slate-700 border-slate-100';
    const map: Record<string, string> = {
      PENDING: 'bg-amber-50 text-amber-700 border-amber-100',
      APPROVED: 'bg-emerald-50 text-emerald-700 border-emerald-100',
      REJECTED: 'bg-red-50 text-red-700 border-red-100',
    };
    return map[status] ?? 'bg-slate-50 text-slate-700 border-slate-100';
  }
  getStatusLabel(status: string | undefined): string {
    if (!status) return 'Non défini';
    const map: Record<string, string> = {
      PENDING: 'En cours',
      APPROVED: 'Acceptée',
      REJECTED: 'Refusée',
    };
    return map[status] ?? 'Non défini';
  }

  getStateClasses(state: string | undefined): string {
    if (!state) return 'bg-slate-50 text-slate-700 border-slate-100';
    const map: Record<string, string> = {
      COMPLIANT: 'bg-emerald-50 text-emerald-700 border-emerald-100',
      OUT_OF_ZONE: 'bg-violet-50 text-violet-700 border-violet-100',
      INCOMPLETE: 'bg-amber-50 text-amber-700 border-amber-100',
      MAYOR_REQUEST: 'bg-blue-50 text-blue-700 border-blue-100',
    };
    return map[state] ?? 'bg-slate-50 text-slate-700 border-slate-100';
  }
  getStateLabel(state: string | undefined): string {
    if (!state) return 'Non défini';
    const map: Record<string, string> = {
      COMPLIANT: 'Conforme',
      OUT_OF_ZONE: 'Hors zone',
      INCOMPLETE: 'Dossier incomplet',
      MAYOR_REQUEST: 'Demande du Maire',
    };
    return map[state] ?? 'Non défini';
  }


}
