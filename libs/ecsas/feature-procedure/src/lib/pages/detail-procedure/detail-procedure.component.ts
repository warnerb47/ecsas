import { Component } from '@angular/core';
import { TopbarComponent, BreadcrumbItem } from '@org/ecsas/shared-ui';
import { Procedure } from '@org/models';
import { ApplicationStatisticsComponent, StatCard } from '../../components/application-statistics/application-statistics.component';
import { ApplicationTableComponent } from '../../components/application-table/application-table.component';

@Component({
  selector: 'lib-detail-procedure-component',
  imports: [ TopbarComponent, ApplicationStatisticsComponent, ApplicationTableComponent],
  templateUrl: './detail-procedure.component.html',
})
export class DetailProcedureComponent {
  tabs: string[] = ['Toutes', 'Commission Sociale', 'Religieux & Culturel', 'Sport & Loisirs'];
  activeTab: string = 'Toutes';
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

  procedures: Procedure[] = [
    {
      id: '1',
      name: 'Appel des Layennes',
      description: 'Aide sociale exceptionnelle destinée aux pèlerins et résidents pour la célébration annuelle.',
      begin: new Date('2025-01-15').toISOString(),
      end: new Date('2025-06-30').toISOString(),
      status: 'IN_PROGRESS',
      type: 'LAYENNES',
      applicationCount: 3,
    },
    {
      id: '2',
      name: 'Secours Médical',
      description: "Prise en charge des frais d'hospitalisation et d'achat de médicaments pour les nécessiteux.",
      begin: new Date('2025-02-01').toISOString(),
      end: new Date('2025-12-31').toISOString(),
      status: 'IN_PROGRESS',
      type: 'MEDICAL',
      applicationCount: 4,
    },
    {
      id: '3',
      name: 'Aide Tabaski 2024',
      description: "Soutien aux familles vulnérables pour l'achat du bélier de la Tabaski.",
      begin: new Date('2024-06-01').toISOString(),
      end: new Date('2024-06-30').toISOString(),
      status: 'COMPLETED',
      type: 'TABASKI',
      applicationCount: 0,
    },
  ];

  onTabChange(tab: string) {
    this.activeTab = tab;
  }
  
  onProcedureSelected(procedure: Procedure) {
    console.log({ procedure });
  }
}
