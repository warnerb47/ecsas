import { Component } from '@angular/core';
import { ButtonComponent, DropdownComponent, SearchInputComponent } from '@org/ecsas/shared-ui';

@Component({
  selector: 'lib-application-table',
  standalone: true,
  imports: [ButtonComponent, DropdownComponent, SearchInputComponent],
  templateUrl: './application-table.component.html',
})
export class ApplicationTableComponent {
  procedureOptions = [
    { label: 'Toutes les procédures', value: 'all' },
    { label: 'Appel Layenne', value: 'layenne' },
    { label: 'Aide Tabaski', value: 'tabaski' },
    { label: 'Secours Médical', value: 'medical' },
  ];

  statusOptions = [
    { label: 'Tous les statuts', value: 'all' },
    { label: 'En attente', value: 'pending' },
    { label: 'Approuvé', value: 'approved' },
    { label: 'Rejeté', value: 'rejected' },
  ];
}
