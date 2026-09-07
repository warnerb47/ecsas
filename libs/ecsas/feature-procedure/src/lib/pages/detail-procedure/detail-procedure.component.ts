import { Component, inject, input, OnInit, signal } from '@angular/core';
import {
  TopbarComponent,
  BreadcrumbItem,
  ButtonComponent,
} from '@org/ecsas/shared-ui';
import { Procedure } from '@org/models';
import { ApplicationStatisticsComponent } from './application-statistics/application-statistics.component';
import { ApplicationTableComponent } from './application-table/application-table.component';
import { ProcedureGateway } from '@org/ecsas/ecsas-data';
import { ProcedureStateService } from '../../state/procedure-state.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'lib-detail-procedure-component',
  imports: [
    TopbarComponent,
    ApplicationStatisticsComponent,
    ApplicationTableComponent,
    ButtonComponent,
    RouterLink,
  ],
  templateUrl: './detail-procedure.component.html',
})
export class DetailProcedureComponent implements OnInit {
  procedureId = input<string>('');
  tabs: string[] = [
    'Toutes',
    'Commission Sociale',
    'Religieux & Culturel',
    'Sport & Loisirs',
  ];
  activeTab = 'Toutes';
  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Accueil', route: '/' },
    { label: 'Procédures', route: '/procedure' },
    { label: 'Détail', route: '.' },
  ];
  loadingProcudre = signal(false);
  procedure = signal<Partial<Procedure> | null>(null);
  private readonly _procedureGateway = inject(ProcedureGateway);
  private readonly _procedureStateService = inject(ProcedureStateService);

  ngOnInit() {
    this.fetchProcedureById();
  }

  async fetchProcedureById() {
    try {
      this.loadingProcudre.set(true);
      const procedure = await this._procedureGateway.getProcedureById(
        this.procedureId(),
      );
      this.procedure.set(procedure);
      this._procedureStateService.procedure.set(procedure);
    } catch (error) {
      console.error(error);
    } finally {
      this.loadingProcudre.set(false);
    }
  }
}
