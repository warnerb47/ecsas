import { Component } from '@angular/core';
import { TopbarComponent, BreadcumComponent, ButtonComponent, BreadcrumbItem } from '@org/ecsas/shared-ui';
import { Procedure } from '@org/models';

@Component({
  selector: 'lib-detail-procedure-component',
  imports: [TopbarComponent, BreadcumComponent, ButtonComponent],
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
  procedures: Procedure[] = [
    {
      id: '1',
      name: 'Appel des Layennes',
      description: 'Aide sociale exceptionnelle destinée aux pèlerins et résidents pour la célébration annuelle.',
      begin: new Date('2025-01-15'),
      end: new Date('2025-06-30'),
      status: 'IN_PROGRESS',
      type: 'LAYENNES',
      applicationCount: 3,
    },
    {
      id: '2',
      name: 'Secours Médical',
      description: "Prise en charge des frais d'hospitalisation et d'achat de médicaments pour les nécessiteux.",
      begin: new Date('2025-02-01'),
      end: new Date('2025-12-31'),
      status: 'IN_PROGRESS',
      type: 'MEDICAL',
      applicationCount: 4,
    },
    {
      id: '3',
      name: 'Aide Tabaski 2024',
      description: "Soutien aux familles vulnérables pour l'achat du bélier de la Tabaski.",
      begin: new Date('2024-06-01'),
      end: new Date('2024-06-30'),
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
