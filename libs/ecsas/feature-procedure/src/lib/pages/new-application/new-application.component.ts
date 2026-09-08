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
import { form, FormField, submit } from '@angular/forms/signals';
import { toSignal } from '@angular/core/rxjs-interop';
import { ApplicationGateway, ProcedureGateway } from '@org/ecsas/ecsas-data';
import { QRCodeComponent } from 'angularx-qrcode';
import { TransferFileService } from '../../state/transfer-file.service';

type ReceivedSourceItem = ApplicationDocument & { originalName: string };

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
    QRCodeComponent,
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
  private readonly _transferService = inject(TransferFileService);

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
    status: null,
    state: null,
    mailRef: '',
    comment: '',
    receivedAmount: null,
    requestedAmount: null,
  });

  applicationForm = form(this.applicationModel);

  transferUrl = this._transferService.url;
  transferError = signal<string | null>(null);
  receivedSources = signal<ReceivedSourceItem[]>([]);

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
    this._transferService.dispose();
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

  async startTransfer() {
    this.transferError.set(null);
    try {
      await this._transferService.start();
      this._transferService.listenForFiles(async (files) => {
        for (const transferred of files) {
          try {
            const file = await this._transferService.readAsFile(transferred.path);
            const document: Partial<ProcedureDocument> = {
              name: transferred.name,
              required: false,
            };
            const entry: ReceivedSourceItem = {
              document,
              file,
              originalName: file.name,
            };
            this.receivedSources.set([...this.receivedSources(), entry]);
            this.applicationModel().sources = [
              ...this.applicationModel().sources,
              entry,
            ];
          } catch (error) {
            console.error('Impossible de lire le fichier transféré', error);
          }
        }
      });
      this._transferService.listenForStopped(() => this.transferError.set(null));
    } catch (error) {
      this.transferError.set(String(error));
    }
  }

  async stopTransfer() {
    try {
      await this._transferService.stop();
    } catch (error) {
      console.error(error);
    }
  }

  removeReceivedSource(index: number) {
    const target = this.receivedSources()[index];
    this.receivedSources.update((sources) =>
      sources.filter((_, i) => i !== index),
    );
    this.applicationModel().sources = this.applicationModel().sources.filter(
      (source) => source !== target,
    );
  }

  matchReceivedFile(index: number, documentName: string) {
    const item = this.receivedSources()[index];
    if (!item) {
      return;
    }
    const matched =
      this.procedure()?.documents?.find((doc) => doc.name === documentName) ??
      null;
    if (matched) {
      item.document = matched;
      item.file = this.renameFile(item.file, `${matched.name} - ${item.originalName}`);
    } else {
      item.document = { name: item.originalName, required: false };
      item.file = this.renameFile(item.file, item.originalName);
    }
    this.receivedSources.set([...this.receivedSources()]);
    this.applicationModel().sources = [...this.applicationModel().sources];
  }

  renameFile(file: File, newName: string): File {
    return new File([file], newName, {
      type: file.type,
      lastModified: file.lastModified,
    });
  }

  isMatchedReceivedFile(source: ApplicationDocument): boolean {
    return (this.procedure()?.documents ?? []).some(
      (doc) => doc.name === source.document?.name,
    );
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

  addDocument(file: File | null, document: Partial<ProcedureDocument>) {
    if (!file) return;
    const extension = file.name.includes('.')
      ? file.name.slice(file.name.lastIndexOf('.'))
      : '';
    const baseName = document?.name ?? file.name.replace(extension, '');
    const fileName = `${baseName}${extension}`;
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
      requestedAmount: payload.requestedAmount ?? null,
      receivedAmount:  null,
      status: 'PENDING',
      state: null,
      sources: payload.sources ?? [],
      comment: payload.comment ?? '',
    };
    return this._applicationGateway.createApplication(application);
  }

  validDocument() {
    const sources = this.applicationModel().sources ?? [];
    return (this.procedure()?.documents ?? [])
      .filter((doc) => doc.required)
      .every((doc) =>
        sources.some(
          (source) => source.document?.name === doc.name && !!source.file,
        ),
      );
  }

  async submitApplication() {
    await submit(this.applicationForm, async () => {
      if (this.applicationForm().valid() && this.validDocument()) {
        const result = await this.createApplication(this.applicationModel());
        if (result) {
          this._router.navigateByUrl(`/procedure/detail/${this.procedureId()}`);
        }
      } else {
        console.log('Invalid form or document');
      }
    });
  }
}
