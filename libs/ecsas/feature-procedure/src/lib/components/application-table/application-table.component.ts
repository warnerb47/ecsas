import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Application } from '@org/models';
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

  applications: Application[] = [
    {
      id: 'DJK-788',
      applicant: 'Moussa Sall',
      files: [],
      procedure: 'Appel Layenne',
      mailRef: '',
      createdAt: new Date(),
      status: 'En cours',
      state: 'pending',
      amount: 150000,
    },
    {
      id: 'DJK-789',
      applicant: 'Fatou Diop',
      files: [],
      procedure: 'Médicale',
      mailRef: '',
      createdAt: new Date(),
      status: 'Approuvée',
      state: 'approved',
      amount: 75000,
    },
  ];

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

  getProcedureClasses(procedure: string): string {
    const map: Record<string, string> = {
      'Appel Layenne': 'bg-blue-50 text-blue-700',
      'Médicale': 'bg-emerald-50 text-emerald-700',
      'Aide Tabaski': 'bg-purple-50 text-purple-700',
    };
    return map[procedure] ?? 'bg-slate-50 text-slate-700';
  }

  formatAmount(amount: number): string {
    return amount.toLocaleString('fr-FR') + ' FCFA';
  }
}
