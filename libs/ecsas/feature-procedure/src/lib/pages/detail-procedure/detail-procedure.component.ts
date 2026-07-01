import { Component } from '@angular/core';
import { TopbarComponent, BreadcrumbItem, ButtonComponent } from '@org/ecsas/shared-ui';
import { Procedure } from '@org/models';
import { ApplicationStatisticsComponent, StatCard } from '../../components/application-statistics/application-statistics.component';
import { ApplicationTableComponent } from '../../components/application-table/application-table.component';

@Component({
  selector: 'lib-detail-procedure-component',
  imports: [ TopbarComponent, ApplicationStatisticsComponent, ApplicationTableComponent, ButtonComponent ],
  templateUrl: './detail-procedure.component.html',
})
export class DetailProcedureComponent {
  tabs: string[] = ['Toutes', 'Commission Sociale', 'Religieux & Culturel', 'Sport & Loisirs'];
  activeTab = 'Toutes';
  breadcrumbItems: BreadcrumbItem[] = [
    {label: 'Accueil', route: '/'},
    {label: 'Procédures', route: '/procedure'},
    {label: 'Détail', route: '/procedure/detail'},
  ];
  statCards: StatCard[] = [
    {
      label: 'En transfert',
      value: '42 dossiers',
      iconClass: 'pi pi-arrow-right-arrow-left',
      iconBgColor: 'bg-blue-50',
      iconTextColor: 'text-blue-600',
    },
    {
      label: 'Réceptionnés',
      value: '128 dossiers',
      iconClass: 'pi pi-check-circle',
      iconBgColor: 'bg-emerald-50',
      iconTextColor: 'text-emerald-600',
    },
    {
      label: 'Délai moyen',
      value: '4.2 Heures',
      iconClass: 'pi pi-clock',
      iconBgColor: 'bg-amber-50',
      iconTextColor: 'text-amber-600',
    },
  ];

  onTabChange(tab: string) {
    this.activeTab = tab;
  }

  onProcedureSelected(procedure: Procedure) {
    console.log({ procedure });
  }

  editProcedure() {
    console.log('editProcedure');
  }
}
