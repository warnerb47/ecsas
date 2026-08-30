import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ApplicationGateway } from '@org/ecsas/ecsas-data';
import { ApplicationStatistics } from '@org/models';
import { ButtonComponent } from '@org/ecsas/shared-ui';
import { StatisticCardComponent } from './statistic-card/statistic-card.component';
import { delay, firstValueFrom, of } from 'rxjs';

@Component({
  selector: 'lib-statistic',
  imports: [StatisticCardComponent, ButtonComponent],
  templateUrl: './statistic.component.html',
})
export class StatisticComponent implements OnInit {
  private readonly _applicationGateway = inject(ApplicationGateway);

  statistics = signal<ApplicationStatistics | null>(null);
  loading = signal(true);
  error = signal(false);

  total = computed(() => this.statistics()?.total ?? 0);
  pending = computed(() => this.statistics()?.pending ?? 0);
  approved = computed(() => this.statistics()?.approved ?? 0);
  rejected = computed(() => this.statistics()?.rejected ?? 0);

  pendingPercentage = computed(() => this.percentage(this.pending(), this.total()));
  approvedPercentage = computed(() => this.percentage(this.approved(), this.total()));
  rejectedPercentage = computed(() => this.percentage(this.rejected(), this.total()));

  ngOnInit() {
    this.fetchStatistics();
  }

  private percentage(value: number, total: number): string {
    if (!total) {
      return '0%';
    }
    return `${((value / total) * 100).toFixed(1)}%`;
  }

  private isMissingTableError(error: unknown): boolean {
    const message = error instanceof Error ? error.message : String(error ?? '');
    return message.includes('no such table');
  }

  async fetchStatistics() {
    this.loading.set(true);
    this.error.set(false);
    try {
      const statistics = await this._applicationGateway.getApplicationStatistics();
      this.statistics.set(statistics);
    } catch (error) {
      if (this.isMissingTableError(error)) {
        this.statistics.set({
          total: 0,
          pending: 0,
          approved: 0,
          rejected: 0,
        });
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
    await this.fetchStatistics();
    this.loading.set(false);
  }
}
