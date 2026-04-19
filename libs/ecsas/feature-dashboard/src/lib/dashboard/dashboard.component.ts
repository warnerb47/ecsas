import { Component } from '@angular/core';
import { TopbarComponent } from '@ord/ecsas/shared-ui';
import { StatisticComponent } from '../components/statistic/statistic.component';

@Component({
  selector: 'lib-dashboard.component',
  imports: [TopbarComponent, StatisticComponent],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {}
