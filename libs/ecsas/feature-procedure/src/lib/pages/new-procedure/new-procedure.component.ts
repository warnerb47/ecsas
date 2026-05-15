import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BreadcrumbItem, TopbarComponent, TextInputComponent, DropdownComponent, ButtonComponent, TextAreaComponent } from '@org/ecsas/shared-ui';
import { DocumentCardComponent } from '../../components/document-card/document-card.component';
import { Procedure } from '@org/models';
import {form, FormField} from '@angular/forms/signals';

@Component({
  selector: 'lib-new-procedure-component',
  imports: [RouterLink, TopbarComponent, FormField, TextInputComponent, DropdownComponent, ButtonComponent, TextAreaComponent, DocumentCardComponent],
  templateUrl: './new-procedure.component.html',
})
export class NewProcedureComponent {
  procedure: Procedure | null = null;
  procedureForm = form(signal<Procedure>({
    name: '',
    type: 'TABASKI',
    description: '',
    begin: new Date(),
    end: null,
    id: '',
    status: 'IN_PROGRESS'
  }))
  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Accueil', route: '/' },
    { label: 'Procédures', route: '/procedure' },
    { label: 'Nouvelle procédure', route: '/procedure/new-procedure' },
  ];

  procedureTypes = [
    { label: 'Prise en charge médicale', value: 'MEDICAL' },
    { label: 'Secours Tabaski', value: 'TABASKI' },
    { label: 'Secours appelle des layennes', value: 'LAYENNES' },
    { label: 'secours pâque', value: 'PAQUE' },
  ];

}
