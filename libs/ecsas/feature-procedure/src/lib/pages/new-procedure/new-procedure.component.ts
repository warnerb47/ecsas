import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  BreadcrumbItem,
  TopbarComponent,
  TextInputComponent,
  DropdownComponent,
  ButtonComponent,
  TextAreaComponent,
  DateInputComponent,
} from '@org/ecsas/shared-ui';
import { DocumentCardComponent } from '../../components/document-card/document-card.component';
import { Procedure } from '@org/models';
import { form, FormField, required } from '@angular/forms/signals';

@Component({
  selector: 'lib-new-procedure-component',
  imports: [
    RouterLink,
    TopbarComponent,
    DateInputComponent,
    FormField,
    TextInputComponent,
    DropdownComponent,
    ButtonComponent,
    TextAreaComponent,
    DocumentCardComponent,
  ],
  templateUrl: './new-procedure.component.html',
})
export class NewProcedureComponent {
  procedure: Procedure | null = null;
  procedureModel = signal<Procedure>({
    name: '',
    type: 'MEDICAL',
    description: '',
    begin: new Date().toISOString(),
    end: '',
    id: '',
    status: 'IN_PROGRESS',
  });
  procedureForm = form(this.procedureModel, (schemaPath) => {
    required(schemaPath.name, { message: 'Ce champ est obligatoire' });
    required(schemaPath.type, { message: 'Ce champ est obligatoire' });
  });
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

  onSubmit() {
    console.log({ procedure: this.procedureModel() });
  }
}
