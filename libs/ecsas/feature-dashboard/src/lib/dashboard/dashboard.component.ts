import { Component } from '@angular/core';
import { TopbarComponent } from '@ord/ecsas/shared-ui';
import { StatisticComponent } from '../components/statistic/statistic.component';
import { PendingProcedureComponent } from '../components/pending-procedure/pending-procedure.component';

@Component({
  selector: 'lib-dashboard.component',
  imports: [TopbarComponent, StatisticComponent, PendingProcedureComponent],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {}
