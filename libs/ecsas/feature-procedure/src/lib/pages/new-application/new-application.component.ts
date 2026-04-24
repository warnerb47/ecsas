import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BreadcrumbItem, TopbarComponent, TextInputComponent, PhoneInputComponent, DropdownComponent, ButtonComponent, UploadDocumentCardComponent } from '@org/ecsas/shared-ui';

@Component({
  selector: 'lib-new-application-component',
  imports: [TopbarComponent, RouterLink, TextInputComponent, PhoneInputComponent, DropdownComponent, ButtonComponent, UploadDocumentCardComponent],
  templateUrl: './new-application.component.html',
})
export class NewApplicationComponent {
    breadcrumbItems: BreadcrumbItem[] = [
      {label: 'Accueil', route: '/'},
      {label: 'Procédures', route: '/procedure'},
      {label: 'Nouvelle demande', route: '/procedure/new-application'},
    ];

    quartiers = [
      {label: 'Yoff Layenne', value: 'yoff_layenne'},
      {label: 'Ndénate', value: 'ndenate'},
      {label: 'Dagoudane', value: 'dagoudane'},
      {label: 'Mbenguène', value: 'mbenguene'},
    ];
}
