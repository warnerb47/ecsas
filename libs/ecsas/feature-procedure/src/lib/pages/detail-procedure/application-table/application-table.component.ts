import { NgClass } from '@angular/common';
import { Component, inject, input, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Application, Procedure } from '@org/models';
import {
  ButtonComponent,
  DropdownComponent,
  SearchInputComponent,
} from '@org/ecsas/shared-ui';
import { ProcedureStateService } from '../../../state/procedure-state.service';
import { ApplicationGateway, ProcedureGateway } from '@org/ecsas/ecsas-data';
import { map, tap } from 'rxjs';
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
  private _activatedRoute = inject(ActivatedRoute);

  procedureId = toSignal(
    this._activatedRoute.paramMap.pipe(map((p) => p.get('procedureId'))),
    { initialValue: null },
  );

  procedureOptions = [
    { label: 'Toutes les procédures', value: 'all' },
    { label: 'Appel Layenne', value: 'layenne' },
    { label: 'Aide Tabaski', value: 'tabaski' },
    { label: 'Secours Médical', value: 'medical' },
  ];

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
      console.log({ applications });
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
      'En cours': 'bg-amber-50 text-amber-700 border-amber-100',
      Approuvée: 'bg-emerald-50 text-emerald-700 border-emerald-100',
      'En attente': 'bg-amber-50 text-amber-700 border-amber-100',
      Rejetée: 'bg-red-50 text-red-700 border-red-100',
    };
    return map[status] ?? 'bg-slate-50 text-slate-700 border-slate-100';
  }

  getProcedureClasses(procedure: Partial<Procedure> | undefined): string {
    if (!procedure) return 'bg-slate-50 text-slate-700';
    const procedureType = procedure.type?.value ?? 'DEFAULT';
    const map: Record<string, string> = {
      PAQUE: 'bg-blue-50 text-blue-700',
      LAYENNES: 'bg-amber-50 text-amber-700',
      MEDICAL: 'bg-emerald-50 text-emerald-700',
      TABASKI: 'bg-purple-50 text-purple-700',
      DEFAULT: 'bg-slate-50 text-slate-700',
    };
    return map[procedureType];
  }

  formatAmount(amount: number): string {
    return amount.toLocaleString('fr-FR') + ' FCFA';
  }
}
