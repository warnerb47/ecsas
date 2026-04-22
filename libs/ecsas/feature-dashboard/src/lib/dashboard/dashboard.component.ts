import { Component } from '@angular/core';
import { TopbarComponent } from '@org/ecsas/shared-ui';
import { StatisticComponent } from '../components/statistic/statistic.component';
import { PendingProcedureComponent } from '../components/pending-procedure/pending-procedure.component';
import { RecentApplicationComponent } from '../components/recent-application/recent-application.component';

@Component({
  selector: 'lib-dashboard.component',
  imports: [TopbarComponent, StatisticComponent, PendingProcedureComponent, RecentApplicationComponent],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {}
