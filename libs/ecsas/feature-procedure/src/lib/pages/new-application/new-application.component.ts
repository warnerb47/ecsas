import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  BreadcrumbItem,
  TopbarComponent,
  ButtonComponent,
  UploadDocumentCardComponent,
  PdfViewerComponent,
  TextInputComponent,
  NumberInputComponent,
} from '@org/ecsas/shared-ui';
import { DialogService } from 'primeng/dynamicdialog';
import { SearchApplicantComponent } from './search-applicant/search-applicant.component';
import { CreateApplicantComponent } from './create-applicant/create-applicant.component';
import {
  Applicant,
  ApplicationDocument,
  ApplicationPayload,
  Procedure,
  ProcedureDocument,
  Source,
} from '@org/models';
import { DatePipe } from '@angular/common';
import { map, Subject, takeUntil } from 'rxjs';
import {
  applyEach,
  form,
  FormField,
  required,
  submit,
} from '@angular/forms/signals';
import { toSignal } from '@angular/core/rxjs-interop';
import { ApplicationGateway, ProcedureGateway } from '@org/ecsas/ecsas-data';

@Component({
  selector: 'lib-new-application-component',
  imports: [
    TopbarComponent,
    RouterLink,
    ButtonComponent,
    DatePipe,
    UploadDocumentCardComponent,
    TextInputComponent,
    NumberInputComponent,
    FormField,
  ],
  providers: [DialogService],
  templateUrl: './new-application.component.html',
})
export class NewApplicationComponent implements OnInit, OnDestroy {
  private readonly _dialogService = inject(DialogService);
  private readonly _unsubscribe = new Subject<void>();
  private readonly _applicationGateway = inject(ApplicationGateway);
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _procedureGateway = inject(ProcedureGateway);
  private readonly _router = inject(Router);

  procedureId = toSignal(
    this._activatedRoute.paramMap.pipe(map((p) => p.get('procedureId'))),
    { initialValue: null },
  );

  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Procédures', route: '/procedure' },
    { label: 'Détail', route: `/procedure/detail/${this.procedureId()}` },
    { label: 'Nouvelle demande', route: '.' },
  ];
  applicant = signal<Partial<Applicant> | null>(null);
  procedure = signal<Partial<Procedure> | null>(null);
  loadingProcedure = signal(false);

  applicationModel = signal<ApplicationPayload>({
    applicant: '',
    procedure: '',
    sources: [] as ApplicationDocument[],
    status: 'PENDING',
    state: 'DEFAULT',
    mailRef: '',
    amount: null,
  });

  applicationForm = form(this.applicationModel);
  ngOnInit() {
    this.initState();
  }

  async initState() {
    if (!this.procedureId()) {
      return;
    }
    this.loadingProcedure.set(true);
    await this.fetchProcedureById();
    this.loadingProcedure.set(false);
  }

  ngOnDestroy() {
    this._unsubscribe.next();
    this._unsubscribe.complete();
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

  searchApplicant() {
    this._dialogService
      .open(SearchApplicantComponent, {
        header: 'Rechercher un bénéficiaire',
        width: '40vw',
        height: '70vh',
        focusOnShow: false,
        closable: true,
        closeOnEscape: true,
      })
      ?.onClose.pipe(takeUntil(this._unsubscribe))
      .subscribe((result) => {
        this.applicant.set(result);
      });
  }

  createApplicant() {
    this._dialogService
      .open(CreateApplicantComponent, {
        header: 'Ajouter un bénéficiaire',
        width: '40vw',
        focusOnShow: false,
        closable: true,
        closeOnEscape: true,
      })
      ?.onClose.pipe(takeUntil(this._unsubscribe))
      .subscribe((result) => {
        if (!result) return;
        this.applicant.set(result);
      });
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

  addDocument(file: File | null, document: ProcedureDocument) {
    if (!file) return;
    const fileName = document?.name ?? file.name;
    const newFile = new File([file], fileName, {
      type: file.type,
      lastModified: file.lastModified,
    });
    this.applicationModel().sources = [
      ...this.applicationModel().sources,
      { document, file: newFile },
    ];
  }

  createApplication(payload: Partial<ApplicationPayload>) {
    const procedureId = this.procedureId() ?? undefined;
    if (!procedureId || !this.applicant()?.id) {
      return null;
    }
    const application: ApplicationPayload = {
      procedure: procedureId,
      applicant: this.applicant()?.id ?? '',
      mailRef: payload.mailRef ?? '',
      amount: payload.amount ?? null,
      status: 'PENDING',
      state: 'DEFAULT',
      sources: payload.sources ?? [],
    };
    return this._applicationGateway.createApplication(application);
  }

  validDocument() {
    for (const document of this.procedure()?.documents ?? []) {
      const found = this.applicationModel().sources?.find((source) => {
        return (
          source.document.name === document.name &&
          source.document.required
        );
      });

      if (!found) {
        return false;
      }
    }
    return true;
  }

  async submitApplication() {
    await submit(this.applicationForm, async () => {
      if (this.applicationForm().valid() && this.validDocument()) {
        const result =await this.createApplication(this.applicationModel());
        if (result) {
          this._router.navigateByUrl(`/procedure/detail/${this.procedureId()}`);
        }
      } else {
        console.log('Invalid form or document');
      }
    });
  }
}
