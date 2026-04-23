import { Component } from '@angular/core';
import { ButtonComponent, TopbarComponent } from '@org/ecsas/shared-ui';
import { StatisticComponent } from '../components/statistic/statistic.component';
import { PendingProcedureComponent } from '../components/pending-procedure/pending-procedure.component';
import { RecentApplicationComponent } from '../components/recent-application/recent-application.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'lib-dashboard.component',
  imports: [RouterLink, TopbarComponent, StatisticComponent, PendingProcedureComponent, RecentApplicationComponent, ButtonComponent],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {}
