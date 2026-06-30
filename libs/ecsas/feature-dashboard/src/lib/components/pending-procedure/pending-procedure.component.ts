import { Component } from '@angular/core';
import { Procedure } from '@org/models';
import { ButtonLinkComponent, ProcedureCardComponent } from '@org/ecsas/shared-ui';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'lib-pending-procedure',
  imports: [RouterLink, ButtonLinkComponent, ProcedureCardComponent],
  templateUrl: './pending-procedure.component.html',
})
export class PendingProcedureComponent {
  // procedures: Procedure[] = [
  //   {
  //     id: '1',
  //     name: 'Appel des Layennes',
  //     description: 'Aide sociale exceptionnelle destinée aux pèlerins et résidents pour la célébration annuelle.',
  //     begin: new Date('2025-01-15').toISOString(),
  //     end: new Date('2025-06-30').toISOString(),
  //     status: 'IN_PROGRESS',
  //     type: 'LAYENNES',
  //     applicationCount: 3,
  //   },
  //   {
  //     id: '2',
  //     name: 'Secours Médical',
  //     description: "Prise en charge des frais d'hospitalisation et d'achat de médicaments pour les nécessiteux.",
  //     begin: new Date('2025-02-01').toISOString(),
  //     end: new Date('2025-12-31').toISOString(),
  //     status: 'IN_PROGRESS',
  //     type: 'MEDICAL',
  //     applicationCount: 4,
  //   },
  //   {
  //     id: '3',
  //     name: 'Aide Tabaski 2024',
  //     description: "Soutien aux familles vulnérables pour l'achat du bélier de la Tabaski.",
  //     begin: new Date('2024-06-01').toISOString(),
  //     end: new Date('2024-06-30').toISOString(),
  //     status: 'COMPLETED',
  //     type: 'TABASKI',
  //     applicationCount: 0,
  //   },
  // ];
procedures: Procedure[] = [];
}
