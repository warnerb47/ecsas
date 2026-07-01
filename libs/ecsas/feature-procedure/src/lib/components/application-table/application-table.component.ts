import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Application, Procedure } from '@org/models';
import { ButtonComponent, DropdownComponent, SearchInputComponent } from '@org/ecsas/shared-ui';

@Component({
  selector: 'lib-application-table',
  standalone: true,
  imports: [RouterLink, NgClass, ButtonComponent, DropdownComponent, SearchInputComponent],
  templateUrl: './application-table.component.html',
})
export class ApplicationTableComponent {
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

  applications: Application[] = [];

  getInitials(name: string): string {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  getStatusClasses(status: string): string {
    const map: Record<string, string> = {
      'En cours': 'bg-amber-50 text-amber-700 border-amber-100',
      'Approuvée': 'bg-emerald-50 text-emerald-700 border-emerald-100',
      'En attente': 'bg-amber-50 text-amber-700 border-amber-100',
      'Rejetée': 'bg-red-50 text-red-700 border-red-100',
    };
    return map[status] ?? 'bg-slate-50 text-slate-700 border-slate-100';
  }

  getProcedureClasses(procedure: Partial<Procedure>): string {
    const procedureType = procedure.type?.value ?? 'DEFAULT';
    const map: Record<string, string> = {
      'PAQUE': 'bg-blue-50 text-blue-700',
      'LAYENNES': 'bg-amber-50 text-amber-700',
      'MEDICAL': 'bg-emerald-50 text-emerald-700',
      'TABASKI': 'bg-purple-50 text-purple-700',
      'DEFAULT': 'bg-slate-50 text-slate-700',
    };
    return map[procedureType];
  }

  formatAmount(amount: number): string {
    return amount.toLocaleString('fr-FR') + ' FCFA';
  }
}
