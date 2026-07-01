import { NgClass } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Application, Procedure } from '@org/models';
import {
  ButtonComponent,
  DropdownComponent,
  SearchInputComponent,
} from '@org/ecsas/shared-ui';
import { ProcedureStateService } from '../../../state/procedure-state.service';
import { ApplicationGateway, ProcedureGateway } from '@org/ecsas/ecsas-data';
import { map } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'lib-application-table',
  standalone: true,
  imports: [
    RouterLink,
    NgClass,
    ButtonComponent,
    DropdownComponent,
    SearchInputComponent,
  ],
  templateUrl: './application-table.component.html',
})
export class ApplicationTableComponent implements OnInit {
  private readonly _procedureStateService = inject(ProcedureStateService);
  private readonly _applicationGateway = inject(ApplicationGateway);
  private readonly _procedureGateway = inject(ProcedureGateway);
  private readonly _activatedRoute = inject(ActivatedRoute);

  procedureId = toSignal(
    this._activatedRoute.paramMap.pipe(map((p) => p.get('procedureId'))),
    { initialValue: null },
  );

  statusOptions = [
    { label: 'Tous les statuts', value: 'all' },
    { label: 'En attente', value: 'pending' },
    { label: 'Approuvé', value: 'approved' },
    { label: 'Rejeté', value: 'rejected' },
  ];

  applications = signal<Partial<Application>[]>([]);
  procedure = this._procedureStateService.procedure;
  loadingApplications = signal(false);

  ngOnInit() {
    this.initState();
  }

  async initState() {
    if (!this.procedureId()) {
      return;
    }
    if (!this.procedure()?.id) {
      await this.fetchProcedureById(this.procedureId()!);
    }
    await this.fetchApplications();
  }

  async fetchProcedureById(procedureId: string) {
    try {
      const procedure = await this._procedureGateway.getProcedureById(
        procedureId,
      );
      this.procedure.set(procedure);
      this._procedureStateService.procedure.set(procedure);
    } catch (error) {
      console.error(error);
    }
  }

  async fetchApplications() {
    try {
      if (!this.procedure()?.id) return;
      this.loadingApplications.set(true);
      const applications =
        await this._applicationGateway.getApplicationsByProcedureId(
          this.procedure()?.id ?? '',
        );
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
}
