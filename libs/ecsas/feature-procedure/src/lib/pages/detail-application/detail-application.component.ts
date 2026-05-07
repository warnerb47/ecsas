import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BreadcrumbItem, TopbarComponent, TextInputComponent, PhoneInputComponent, DropdownComponent, ButtonComponent, UploadDocumentCardComponent, TextAreaComponent } from '@org/ecsas/shared-ui';

@Component({
  selector: 'lib-detail-application-component',
  imports: [RouterLink, TopbarComponent, TextInputComponent, PhoneInputComponent, DropdownComponent, ButtonComponent, UploadDocumentCardComponent, TextAreaComponent],
  templateUrl: './detail-application.component.html',
})
export class DetailApplicationComponent {
    breadcrumbItems: BreadcrumbItem[] = [
      {label: 'Accueil', route: '/'},
      {label: 'Procédures', route: '/procedure'},
      {label: 'Détail demande', route: '/procedure/detail-application'},
    ];

    statuts = [
      {label: 'En cours', value: 'en_cours'},
      {label: 'Acceptée', value: 'acceptee'},
      {label: 'Refusée', value: 'refusee'},
    ];

    conformities = [
      {label: 'En cours de validation', value: 'en_cours'},
      {label: 'Hors zone', value: 'hors_zone'},
      {label: 'Dossier incomplet', value: 'incomplete'},
      {label: 'Demande du Maire', value: 'maire_request'},
    ];
}
