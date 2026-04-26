import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BreadcrumbItem, TopbarComponent, TextInputComponent, PhoneInputComponent, DropdownComponent, ButtonComponent, UploadDocumentCardComponent } from '@org/ecsas/shared-ui';

@Component({
  selector: 'lib-detail-application-component',
  imports: [RouterLink, TopbarComponent, TextInputComponent, PhoneInputComponent, DropdownComponent, ButtonComponent, UploadDocumentCardComponent],
  templateUrl: './detail-application.component.html',
})
export class DetailApplicationComponent {
    breadcrumbItems: BreadcrumbItem[] = [
      {label: 'Accueil', route: '/'},
      {label: 'Procédures', route: '/procedure'},
      {label: 'Détail demande', route: '/procedure/detail-application'},
    ];

    quartiers = [
      {label: 'Yoff Layenne', value: 'yoff_layenne'},
      {label: 'Ndénate', value: 'ndenate'},
      {label: 'Dagoudane', value: 'dagoudane'},
      {label: 'Mbenguène', value: 'mbenguene'},
    ];
}
