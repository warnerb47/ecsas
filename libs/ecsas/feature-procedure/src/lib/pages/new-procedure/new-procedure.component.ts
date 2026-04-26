import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BreadcrumbItem, TopbarComponent, TextInputComponent, DropdownComponent, ButtonComponent, TextAreaComponent } from '@org/ecsas/shared-ui';
import { DocumentCardComponent } from '../../components/document-card/document-card.component';

@Component({
  selector: 'lib-new-procedure-component',
  imports: [RouterLink, TopbarComponent, TextInputComponent, DropdownComponent, ButtonComponent, TextAreaComponent, DocumentCardComponent],
  templateUrl: './new-procedure.component.html',
})
export class NewProcedureComponent {
    breadcrumbItems: BreadcrumbItem[] = [
      {label: 'Accueil', route: '/'},
      {label: 'Procédures', route: '/procedure'},
      {label: 'Nouvelle procédure', route: '/procedure/new-procedure'},
    ];

    commissions = [
      {label: 'Commission Sociale', value: 'commission_sociale'},
      {label: 'Commission Sport & Culture', value: 'commission_sport_culture'},
      {label: 'Commission Environnement', value: 'commission_environnement'},
    ];

    bureaux = [
      {label: 'Bureau Santé', value: 'bureau_sante'},
      {label: 'Bureau Aide Sociale', value: 'bureau_aide_sociale'},
      {label: 'Bureau du Courrier', value: 'bureau_courrier'},
    ];
}
