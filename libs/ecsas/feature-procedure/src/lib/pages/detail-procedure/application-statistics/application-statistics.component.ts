import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { ApplicationStatisticsCardComponent, StatCard } from './application-statistics-card/application-statistics-card.component';
import { ApplicationGateway } from '@org/ecsas/ecsas-data';
import { ApplicationStatistics } from '@org/models';

export type { StatCard } from './application-statistics-card/application-statistics-card.component';

@Component({
  selector: 'lib-application-statistics',
  standalone: true,
  imports: [ApplicationStatisticsCardComponent],
  templateUrl: './application-statistics.component.html',
})
export class ApplicationStatisticsComponent {
  procedureId = input<string | null>(null);
  private readonly _applicationGateway = inject(ApplicationGateway);

  private readonly _stats = signal<ApplicationStatistics>({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  cards = computed<StatCard[]>(() => [
    {
      label: 'Total Demandes',
      value: String(this._stats().total),
      iconClass: 'pi pi-folder-open',
      iconBgColor: 'bg-blue-50',
      iconTextColor: 'text-blue-600',
    },
    {
      label: 'En Traitement',
      value: String(this._stats().pending),
      iconClass: 'pi pi-clock',
      iconBgColor: 'bg-amber-50',
      iconTextColor: 'text-amber-600',
    },
    {
      label: 'Approuvées',
      value: String(this._stats().approved),
      iconClass: 'pi pi-check-circle',
      iconBgColor: 'bg-emerald-50',
      iconTextColor: 'text-emerald-600',
    },
    {
      label: 'Rejetées',
      value: String(this._stats().rejected),
      iconClass: 'pi pi-times-circle',
      iconBgColor: 'bg-red-50',
      iconTextColor: 'text-red-600',
    },
  ]);

  constructor() {
    effect(() => {
      this.fetchStatistics();
    });
  }

  async fetchStatistics() {
    const procedureId = this.procedureId();
    if (!procedureId) {
      return;
    }
    try {
      const stats =
        await this._applicationGateway.getApplicationStatisticsByProcedureId(
          procedureId,
        );
      this._stats.set(stats);
    } catch (error) {
      console.error(error);
    }
  }
}