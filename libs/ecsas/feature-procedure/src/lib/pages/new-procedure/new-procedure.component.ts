import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BreadcrumbItem, TopbarComponent, TextInputComponent, PhoneInputComponent, DropdownComponent, ButtonComponent, UploadDocumentCardComponent } from '@org/ecsas/shared-ui';

@Component({
  selector: 'lib-new-procedure-component',
  imports: [TopbarComponent, RouterLink, TextInputComponent, PhoneInputComponent, DropdownComponent, ButtonComponent, UploadDocumentCardComponent],
  templateUrl: './new-procedure.component.html',
})
export class NewProcedureComponent {
    breadcrumbItems: BreadcrumbItem[] = [
      {label: 'Accueil', route: '/'},
      {label: 'Procédures', route: '/procedure'},
      {label: 'Nouvelle procédure', route: '/procedure/new'},
    ];

    quartiers = [
      {label: 'Yoff Layenne', value: 'yoff_layenne'},
      {label: 'Ndénate', value: 'ndenate'},
      {label: 'Dagoudane', value: 'dagoudane'},
      {label: 'Mbenguène', value: 'mbenguene'},
    ];
}
