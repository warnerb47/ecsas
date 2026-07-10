import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  BreadcrumbItem,
  TopbarComponent,
  TextInputComponent,
  DropdownComponent,
  ButtonComponent,
  TextAreaComponent,
  DateInputComponent,
} from '@org/ecsas/shared-ui';
import {
  Procedure,
  ProcedureDocument,
  ProcedurePayload,
  ProcedureStatus,
  ProcedureType,
} from '@org/models';
import { form, FormField, required, submit } from '@angular/forms/signals';
import { ProcedureGateway } from '@org/ecsas/ecsas-data';
import { DialogService } from 'primeng/dynamicdialog';
import { map, Subject, takeUntil } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  DocumentCardComponent,
  ProcedureDocumentComponent,
} from '../../components';
import { formatDate } from '@angular/common';

@Component({
  selector: 'lib-update-procedure-component',
  imports: [
    RouterLink,
    TopbarComponent,
    DateInputComponent,
    FormField,
    TextInputComponent,
    DropdownComponent,
    ButtonComponent,
    TextAreaComponent,
    DocumentCardComponent,
  ],
  providers: [DialogService],
  templateUrl: './update-procedure.component.html',
})
export class UpdateProcedureComponent implements OnInit, OnDestroy {
  private readonly _procedureGateway = inject(ProcedureGateway);
  private readonly _dialogService = inject(DialogService);
  private readonly _router = inject(Router);
  private readonly _activatedRoute = inject(ActivatedRoute);

  procedureModel = signal<ProcedurePayload>({
    name: '',
    type: '',
    description: '',
    startDate: new Date().toISOString(),
    endDate: '',
    status: 'IN_PROGRESS',
  });
  procedureForm = form(this.procedureModel, (schemaPath) => {
    required(schemaPath.name, { message: 'Ce champ est obligatoire' });
  });
  procedureId = toSignal(
    this._activatedRoute.paramMap.pipe(map((p) => p.get('procedureId'))),
    { initialValue: null },
  );
  procedureStatus = [
    { label: 'En cours', value: 'IN_PROGRESS' },
    { label: 'Clôturé', value: 'COMPLETED' },
  ];

  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Procédures', route: '/procedure' },
    { label: 'Détail', route: `/procedure/detail/${this.procedureId()}` },
    { label: 'Modifier demande', route: '.' },
  ];

  procedureTypes = signal<ProcedureType[]>([]);
  documents = signal<Partial<ProcedureDocument>[]>([]);
  loadingSubmit = signal(false);
  loadingProcudre = signal(false);
  procedure = signal<Partial<Procedure> | null>(null);
  unsubscribe = new Subject<void>();

  ngOnInit(): void {
    this.initState();
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  async initState() {
    await this.fetchProcedureTypes();
    await this.fetchProcedureById();
    this.initFormState(this.procedure());
  }
  async fetchProcedureById() {
    try {
      this.loadingProcudre.set(true);
      const procedure = await this._procedureGateway.getProcedureById(
        this.procedureId() ?? '',
      );
      this.procedure.set(procedure);
    } catch (error) {
      console.error(error);
    } finally {
      this.loadingProcudre.set(false);
    }
  }

  async fetchProcedureTypes() {
    try {
      const procedureTypes =
        (await this._procedureGateway.getProcedureTypes()) as ProcedureType[];
      const formattedProcedureTypes = procedureTypes.map((type) => {
        return {
          ...type,
          label: type.label,
          value: type.id,
        };
      });
      this.procedureTypes.set(formattedProcedureTypes);
      this.procedureModel().type = formattedProcedureTypes[0].value;
    } catch (error) {
      console.error(error);
    }
  }

  initFormState(procedure: Partial<Procedure> | null) {
    const update: ProcedurePayload = {
      name: procedure?.name ?? '',
      type: procedure?.type?.id ?? '',
      description: procedure?.description ?? '',
      startDate: procedure?.startDate ?? '',
      endDate: this.formatDate(procedure?.endDate),
      status: procedure?.status ?? 'IN_PROGRESS',
      documents: procedure?.documents ?? [],
    };
    this.procedureModel.set(update);
    this.documents.set(procedure?.documents ?? []);
  }

  formatDate(date: string | undefined) {
    if (!date) {
      return '';
    }
    return formatDate(date, 'yyyy-MM-dd', 'en-US');
  }

  addDocument() {
    this._dialogService
      .open(ProcedureDocumentComponent, {
        header: 'Ajouter un document',
        width: '40vw',
        focusOnShow: false,
        closable: true,
        closeOnEscape: true,
      })
      ?.onClose.pipe(takeUntil(this.unsubscribe))
      .subscribe((resutl) => {
        if (!resutl) return;
        const document: ProcedureDocument = {
          ...resutl,
          procedureId: this.procedureId() ?? '',
        };
        this.createProcedureDocument(document);
      });
  }

  async createProcedureDocument(payload: ProcedureDocument) {
    try {
      const result =
        await this._procedureGateway.createProcedureDocument(payload);
      if (result.success) {
        this.documents.update((documents) => [
          ...documents,
          { ...payload, id: result.id },
        ]);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async removeDocument(document: Partial<ProcedureDocument>) {
    try {
      await this._procedureGateway.deleteProcedureDocument({
        documentId: document?.id ?? '',
        procedureId: this.procedureId() ?? '',
      });
      this.documents.update((documents) =>
        documents.filter((doc) => doc.name !== document.name),
      );
    } catch (error) {
      console.error(error);
    }
  }

  async onSubmit() {
    await submit(this.procedureForm, async () => {
      if (this.procedureForm().valid()) {
        this.updateProcedure();
      }
    });
  }

  async updateProcedure() {
    try {
      this.loadingSubmit.set(true);
      const payload: ProcedurePayload = {
        ...this.procedureModel(),
        id: this.procedureId() ?? '',
        endDate: new Date(this.procedureModel().endDate).toISOString(),
      };
      await this._procedureGateway.updateProcedure(payload);
      this._router.navigateByUrl(`/procedure/detail/${this.procedureId()}`);
    } catch (error) {
      console.error(error);
    } finally {
      this.loadingSubmit.set(false);
    }
  }
}
