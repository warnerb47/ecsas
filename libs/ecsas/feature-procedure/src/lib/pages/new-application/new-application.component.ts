import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  BreadcrumbItem,
  TopbarComponent,
  TextInputComponent,
  PhoneInputComponent,
  DropdownComponent,
  ButtonComponent,
  UploadDocumentCardComponent,
} from '@org/ecsas/shared-ui';
import { DialogService } from 'primeng/dynamicdialog';
import { SearchApplicantComponent } from './search-applicant/search-applicant.component';
import { CreateApplicantComponent } from './create-applicant/create-applicant.component';

@Component({
  selector: 'lib-new-application-component',
  imports: [
    TopbarComponent,
    RouterLink,
    TextInputComponent,
    PhoneInputComponent,
    DropdownComponent,
    ButtonComponent,
    UploadDocumentCardComponent,
  ],
  providers: [DialogService],
  templateUrl: './new-application.component.html',
})
export class NewApplicationComponent {
  private readonly _dialogService = inject(DialogService);

  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Accueil', route: '/' },
    { label: 'Procédures', route: '/procedure' },
    { label: 'Nouvelle demande', route: '/procedure/new-application' },
  ];

  quartiers = [
    { label: 'Yoff Layenne', value: 'yoff_layenne' },
    { label: 'Ndénate', value: 'ndenate' },
    { label: 'Dagoudane', value: 'dagoudane' },
    { label: 'Mbenguène', value: 'mbenguene' },
  ];

  searchApplicant() {
    this._dialogService
      .open(SearchApplicantComponent, {
        header: 'Rechercher un bénéficiaire',
        width: '40vw',
        height: '70vh',
        focusOnShow: false,
        closable: true,
        closeOnEscape: true,
      })
      ?.onClose.pipe()
      .subscribe((result) => {
        if (!result) return;
        console.log({ result });
      });
  }

  createApplicant() {
    this._dialogService
      .open(CreateApplicantComponent, {
        header: 'Ajouter un bénéficiaire',
        width: '40vw',
        focusOnShow: false,
        closable: true,
        closeOnEscape: true,
      })
      ?.onClose.pipe()
      .subscribe((result) => {
        if (!result) return;
        console.log({ result });
      });
  }
}
