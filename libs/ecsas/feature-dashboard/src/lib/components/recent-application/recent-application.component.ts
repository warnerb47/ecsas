import { Component, effect, inject, signal } from '@angular/core';
import { DatePipe, NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { form, FormField } from '@angular/forms/signals';
import { Application, ApplicationFilters } from '@org/models';
import { ApplicationGateway } from '@org/ecsas/ecsas-data';
import { ButtonComponent, DropdownComponent, MultiselectComponent } from '@org/ecsas/shared-ui';
import { firstValueFrom, of, delay } from 'rxjs';

@Component({
  selector: 'lib-recent-application',
  standalone: true,
  imports: [
    RouterLink,
    DatePipe,
    NgClass,
    FormField,
    ButtonComponent,
    DropdownComponent,
    MultiselectComponent,
  ],
  templateUrl: './recent-application.component.html',
})
export class RecentApplicationComponent {
  private readonly _applicationGateway = inject(ApplicationGateway);

  applications = signal<Partial<Application>[]>([]);
  loading = signal(true);
  error = signal(false);

  statusOptions = [
    { label: 'En cours', value: 'PENDING' },
    { label: 'Approuvée', value: 'APPROVED' },
    { label: 'Rejetée', value: 'REJECTED' },
  ];
  pageSizeOptions = [
    { label: '5', value: 5 },
    { label: '10', value: 10 },
    { label: '20', value: 20 },
  ];

  filterModel = signal<ApplicationFilters>(this._buildInitialFilters());
  filterForm = form(this.filterModel);

  constructor() {
    effect(() => {
      this.fetchApplications();
    });
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
    if (!status) return 'Non défini';
    const map: Record<string, string> = {
      PENDING: 'En cours',
      APPROVED: 'Approuvée',
      REJECTED: 'Rejetée',
    };
    return map[status] ?? 'Non défini';
  }

  nextPage() {
    this.filterModel.update((model) => ({
      ...model,
      page: model.page + 1,
    }));
  }

  previousPage() {
    if (this.filterModel().page <= 1) return;
    this.filterModel.update((model) => ({
      ...model,
      page: model.page - 1,
    }));
  }

  private isMissingTableError(error: unknown): boolean {
    const message =
      error instanceof Error ? error.message : String(error ?? '');
    return message.includes('no such table');
  }

  async fetchApplications() {
    this.loading.set(true);
    this.error.set(false);
    try {
      const applications = await this._applicationGateway.filterApplications(
        this.filterModel(),
      );
      this.applications.set(applications);
    } catch (error) {
      if (this.isMissingTableError(error)) {
        this.applications.set([]);
        return;
      }
      console.error(error);
      this.error.set(true);
    } finally {
      this.loading.set(false);
    }
  }

  async retry() {
    this.loading.set(true);
    await firstValueFrom(of('wait').pipe(delay(1000)));
    await this.fetchApplications();
    this.loading.set(false);
  }

  private _buildInitialFilters(): ApplicationFilters {
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    const createdAtFrom = `${now.getUTCFullYear()}-${pad(now.getUTCMonth() + 1)}-01 00:00:00`;
    return {
      procedureId: null,
      status: null,
      state: null,
      fullName: null,
      nin: null,
      phoneNumber: null,
      requestedAmount: null,
      receivedAmount: null,
      createdAtFrom,
      createdAtTo: null,
      page: 1,
      pageSize: 5,
      address: null,
      applicantStatus: null,
      mailRef: null,
    };
  }
}
