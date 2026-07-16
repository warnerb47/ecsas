import { DatePipe, NgClass } from '@angular/common';
import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Application, ApplicationFilters } from '@org/models';
import {
  ButtonComponent,
  DropdownComponent,
  TextInputComponent,
} from '@org/ecsas/shared-ui';
import { ProcedureStateService } from '../../../state/procedure-state.service';
import { ApplicationGateway, ProcedureGateway } from '@org/ecsas/ecsas-data';
import { map } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { form, FormField } from '@angular/forms/signals';
import { ExcelExportService } from '@org/api/products';

@Component({
  selector: 'lib-application-table',
  standalone: true,
  imports: [
    RouterLink,
    NgClass,
    ButtonComponent,
    DropdownComponent,
    TextInputComponent,
    DatePipe,
    FormField,
  ],
  templateUrl: './application-table.component.html',
})
export class ApplicationTableComponent implements OnInit {
  private readonly _procedureStateService = inject(ProcedureStateService);
  private readonly _applicationGateway = inject(ApplicationGateway);
  private readonly _procedureGateway = inject(ProcedureGateway);
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _excelExportService = new ExcelExportService();

  procedureId = toSignal(
    this._activatedRoute.paramMap.pipe(map((p) => p.get('procedureId'))),
    { initialValue: null },
  );

  statusOptions = [
    { label: 'Tous les statuts', value: '' },
    { label: 'En attente', value: 'PENDING' },
    { label: 'Approuvé', value: 'APPROVED' },
    { label: 'Rejeté', value: 'REJECTED' },
  ];

  conformities = [
    { label: 'Tous les statuts de Conformité', value: '' },
    { label: 'Conforme', value: 'COMPLIANT' },
    { label: 'Hors zone', value: 'OUT_OF_ZONE' },
    { label: 'Dossier incomplet', value: 'INCOMPLETE' },
    { label: 'Demande du Maire', value: 'MAYOR_REQUEST' },
  ];

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
    mailRef: null
  });
  filterForm = form(this.filterModel);

constructor() {

  effect(() => {
    this.filterApplications();
  });
}

  ngOnInit() {
    this.initState();
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
    const data = this.applications().map((application) => ({
      numero_courrier: application.mailRef ?? '',
      NIN: application.applicant?.nin ?? '',
      date_soummission: application.createdAt ?? '',
      nom: application.applicant?.fullName ?? '',
      telephone: application.applicant?.phoneNumber ?? '',
      adresse: application.applicant?.address ?? '',
      status: this.getStatusLabel(application.status ?? ''),
      etat_conformite: application.state ?? '',
      Montant_reçu: application.receivedAmount ?? 0,
    }))
    this._excelExportService.exportToExcel(data, 'liste_des_demandes');
  }
}
