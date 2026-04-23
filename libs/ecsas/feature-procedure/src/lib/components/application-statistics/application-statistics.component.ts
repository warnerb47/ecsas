import { Component, Input } from '@angular/core';
import { ApplicationStatisticsCardComponent, StatCard } from './application-statistics-card/application-statistics-card.component';

export type { StatCard } from './application-statistics-card/application-statistics-card.component';

@Component({
  selector: 'lib-application-statistics',
  standalone: true,
  imports: [ApplicationStatisticsCardComponent],
  templateUrl: './application-statistics.component.html',
})
export class ApplicationStatisticsComponent {
  @Input() cards: StatCard[] = [];
}
