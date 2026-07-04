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
import { Applicant, Application, Procedure, Source } from '@org/models';
import { DialogService } from 'primeng/dynamicdialog';
import { map } from 'rxjs';

@Component({
  selector: 'lib-detail-application-component',
  imports: [
    RouterLink,
    TopbarComponent,
    DropdownComponent,
    ButtonComponent,
    TextAreaComponent,
    DatePipe
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
    { label: 'En cours', value: 'en_cours' },
    { label: 'Acceptée', value: 'acceptee' },
    { label: 'Refusée', value: 'refusee' },
  ];

  conformities = [
    { label: 'En cours de validation', value: 'en_cours' },
    { label: 'Hors zone', value: 'hors_zone' },
    { label: 'Dossier incomplet', value: 'incomplete' },
    { label: 'Demande du Maire', value: 'maire_request' },
  ];

  ngOnInit(): void {
    this.initState();
  }

  async initState() {
    this.fetchProcedureById();
    await this.fetchApplicationById();
    this.fetchApplicantById(this.application()?.applicant?.id ?? '');
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
      console.log({ application });
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
    console.log('edit applicant')
  }
}
