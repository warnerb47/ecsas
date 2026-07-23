import { Component, OnInit, signal } from '@angular/core';
import { ButtonComponent, TopbarComponent } from '@org/ecsas/shared-ui';
import { StatisticComponent } from '../components/statistic/statistic.component';
import { PendingProcedureComponent } from '../components/pending-procedure/pending-procedure.component';
import { RecentApplicationComponent } from '../components/recent-application/recent-application.component';
import { RouterLink } from '@angular/router';
import { LlamaService } from '@org/api/products';

@Component({
  selector: 'lib-dashboard.component',
  imports: [RouterLink, TopbarComponent, StatisticComponent, PendingProcedureComponent, RecentApplicationComponent, ButtonComponent],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  private readonly _llamaService = new LlamaService();
  isRunning = signal(false);

  ngOnInit() {
    this.updateState();
  }

  async updateState() {
    const isRunning = await this._llamaService.isRunning()
    this.isRunning.set(isRunning);
  }

  async stopLlamaServer() {
    await this._llamaService.stopLlamaServer();
    this.updateState();
  }

  async startLlamaServer() {
    await this._llamaService.startLlamaServer();
    this.updateState();
  }
}
