import { DatePipe, formatDate, NgClass } from '@angular/common';
import {
  Component,
  effect,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  Application,
  ApplicationFilters,
  ApplicationImportPreviewRow,
  ApplicationImportRow,
} from '@org/models';
import {
  ButtonComponent,
  DropdownComponent,
  MultiselectComponent,
  TextInputComponent,
} from '@org/ecsas/shared-ui';
import { ProcedureStateService } from '../../../state/procedure-state.service';
import {
  ApplicationGateway,
  ApplicationImportService,
  ProcedureGateway,
} from '@org/ecsas/ecsas-data';
import { map, Subject, takeUntil } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { form, FormField } from '@angular/forms/signals';
import { ExcelExportService, ExcelImportService } from '@org/api/products';
import { DialogService } from 'primeng/dynamicdialog';
import { Message } from 'primeng/message';
import { ApplicationImportPreviewComponent } from './application-import-preview/application-import-preview.component';

@Component({
  selector: 'lib-application-table',
  standalone: true,
  imports: [
    RouterLink,
    NgClass,
    ButtonComponent,
    DropdownComponent,
    MultiselectComponent,
    TextInputComponent,
    DatePipe,
    FormField,
    Message,
  ],
  providers: [DialogService],
  templateUrl: './application-table.component.html',
})
export class ApplicationTableComponent implements OnInit, OnDestroy {
  private readonly _procedureStateService = inject(ProcedureStateService);
  private readonly _applicationGateway = inject(ApplicationGateway);
  private readonly _procedureGateway = inject(ProcedureGateway);
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _excelExportService = new ExcelExportService();
  private readonly _excelImportService = new ExcelImportService();
  private readonly _applicationImportService = inject(ApplicationImportService);
  private readonly _dialogService = inject(DialogService);
  private readonly _unsubscribe = new Subject<void>();

  @ViewChild('importFileInput', { static: false })
  importFileInput: ElementRef<HTMLInputElement> | undefined;

  importMessage = signal('');
  importMessageSeverity = signal<'success' | 'info' | 'error'>('success');
  importMessageKey = signal(0);

  private setImportMessage(
    message: string,
    severity: 'success' | 'info' | 'error' = 'success',
  ) {
    this.importMessage.set(message);
    this.importMessageSeverity.set(severity);
    this.importMessageKey.update((key) => key + 1);
  }

  procedureId = toSignal(
    this._activatedRoute.paramMap.pipe(map((p) => p.get('procedureId'))),
    { initialValue: null },
  );

  statusOptions = [
    { label: 'En attente', value: 'PENDING' },
    { label: 'Approuvé', value: 'APPROVED' },
    { label: 'Rejeté', value: 'REJECTED' },
  ];

  conformities = [
    { label: 'Conforme', value: 'COMPLIANT' },
    { label: 'Hors zone', value: 'OUT_OF_ZONE' },
    { label: 'Dossier incomplet', value: 'INCOMPLETE' },
    { label: 'Demande du Maire', value: 'MAYOR_REQUEST' },
  ];
  pageSizeOptions: { label: string; value: string | number | null }[] = [
    { label: '10', value: 10 },
    { label: '25', value: 25 },
    { label: '50', value: 50 },
    { label: '100', value: 100 },
    { label: '1000', value: 1000 },
    { label: '5000', value: 5000 },
  ];

  pageOptions = signal<{ label: string; value: string | number | null }[]>([
    { label: '1', value: 1 },
  ]);

  applications = signal<Partial<Application>[]>([]);
  procedure = this._procedureStateService.procedure;
  loadingApplications = signal(false);
  filterModel = signal<ApplicationFilters>({
    procedureId: this.procedureId() ?? '',
    address: null,
    applicantStatus: null,
    createdAtFrom: null,
    createdAtTo: null,
    fullName: null,
    nin: null,
    page: 1,
    pageSize: 10,
    phoneNumber: null,
    receivedAmount: null,
    requestedAmount: null,
    status: null,
    state: null,
    mailRef: null,
  });  filterForm = form(this.filterModel);

  constructor() {
    effect(() => {
      this.filterApplications();
    });
  }

  ngOnInit() {
    this.initState();
  }

  ngOnDestroy() {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

  async initState() {
    if (!this.procedureId()) {
      return;
    }
    if (!this.procedure()?.id) {
      await this.fetchProcedureById(this.procedureId() ?? '');
    }
  }

  async fetchProcedureById(procedureId: string) {
    try {
      const procedure =
        await this._procedureGateway.getProcedureById(procedureId);
      this.procedure.set(procedure);
      this._procedureStateService.procedure.set(procedure);
    } catch (error) {
      console.error(error);
    }
  }

  async filterApplications() {
    try {
      if (!this.procedure()?.id) return;
      this.loadingApplications.set(true);
      const applications = await this._applicationGateway.filterApplications({
        ...this.filterModel(),
        procedureId: this.procedure()?.id ?? null,
      });
      this.applications.set(applications);
    } catch (error) {
      console.error(error);
    } finally {
      this.loadingApplications.set(false);
    }
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
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
    if (!status) return 'En attente';
    const map: Record<string, string> = {
      PENDING: 'En attente',
      APPROVED: 'Approuvée',
      REJECTED: 'Rejetée',
    };
    return map[status] ?? 'En attente';
  }

  formatAmount(amount: number): string {
    return amount.toLocaleString('fr-FR') + ' FCFA';
  }

  export() {
    const data = this.applications().map((application, index) => {
      const fullName = (application.applicant?.fullName ?? '').split(' ');
      const lastName = fullName[fullName.length - 1];
      const firstName = fullName.slice(0, fullName.length - 1).join(' ');
      let birthdate = '';
      if (application.applicant?.birthdate) {
        birthdate = formatDate(
          application.applicant.birthdate,
          'dd/MM/yyyy',
          'fr-FR',
        );
      }
      return {
        'N°': index + 1,
        Nom: lastName,
        Prénom: firstName,
        'Date de naissance': birthdate,
        NIN: application.applicant?.nin ?? '',
        Adresse: application.applicant?.address ?? '',
        Telephone: application.applicant?.phoneNumber ?? '',
        'Numéro courrier': application.mailRef ?? '',
      };
    });
    this._excelExportService.exportToExcel(data, 'liste_des_demandes');
  }

  openImportDialog() {
    this.importFileInput?.nativeElement.click();
  }

  async onImportFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (!file) {
      return;
    }
    try {
      const rows = await this._excelImportService.parseApplicationsFile(file);
      if (!rows.length) {
        this.setImportMessage(
          'Aucune ligne à importer dans le fichier.',
          'info',
        );
        return;
      }
      const procedureId = this.procedure()?.id;
      if (!procedureId) {
        this.setImportMessage(
          'Impossible de déterminer la procédure courante.',
          'error',
        );
        return;
      }
      const previewRows =
        await this._applicationImportService.previewApplications(
          rows,
          procedureId,
        );
      this.openImportPreview(previewRows, procedureId);
    } catch (error) {
      console.error(error);
      this.setImportMessage(
        "L'import a échoué. Vérifiez que le fichier respecte le format d'export.",
        'error',
      );
    }
  }

  private openImportPreview(
    previewRows: ApplicationImportPreviewRow[],
    procedureId: string,
  ) {
    this._dialogService
      .open(ApplicationImportPreviewComponent, {
        header: "Aperçu de l'import (Excel)",
        width: '90vw',
        height: '85vh',
        focusOnShow: false,
        closable: true,
        closeOnEscape: true,
        maximizable: true,
        data: {
          procedureName: this.procedure()?.name,
          rows: previewRows,
        },
      })
      ?.onClose.pipe(takeUntil(this._unsubscribe))
      .subscribe(async (selectedRows: ApplicationImportRow[] | undefined) => {
        if (!selectedRows?.length) {
          return;
        }
        this.loadingApplications.set(true);
        try {
          const result =
            await this._applicationImportService.importApplications(
              selectedRows,
              procedureId,
            );
          this.setImportMessage(
            `Import terminé : ${result.applicationsCreated} demande(s) créée(s)` +
              `, ${result.applicantsCreated} demandeur(s) créé(s)` +
              (result.failed ? `, ${result.failed} échec(s).` : '.'),
          );
          this.filterApplications();
        } catch (error) {
          console.error(error);
          this.setImportMessage(
            "L'import a échoué pendant l'enregistrement des demandes.",
            'error',
          );
        } finally {
          this.loadingApplications.set(false);
        }
      });
  }

  nextPage() {
    this.filterModel.update((model) => {
      const page = Number(this.filterModel().page);
      return {
        ...model,
        page: page + 1,
      };
    });
    this.updatePageOptions();
  }

  previousPage() {
    if (this.filterModel().page === 1) return;
    this.filterModel.update((model) => {
      const page = Number(this.filterModel().page);
      return {
        ...model,
        page: page - 1,
      };
    });
    this.updatePageOptions();
  }

  updatePageOptions() {
    const totalPages = this.filterModel().page;
    this.pageOptions.set(
      Array.from({ length: totalPages }, (_, index) => index + 1).map(
        (page) => ({ label: page.toString(), value: page }),
      ),
    );
  }
}
