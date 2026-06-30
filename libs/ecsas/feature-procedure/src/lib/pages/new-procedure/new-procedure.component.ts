import { Component, inject, OnInit, signal } from '@angular/core';
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
import { Procedure, ProcedurePayload, ProcedureType } from '@org/models';
import { form, FormField, required } from '@angular/forms/signals';
import { ProcedureGateway } from '@org/ecsas/ecsas-data';
import { ProcedureDocumentComponent } from './procedure-document/procedure-document.component';
import { DialogService } from 'primeng/dynamicdialog';

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
  providers: [DialogService],
  templateUrl: './new-procedure.component.html',
})
export class NewProcedureComponent implements OnInit {
  private readonly _procedureGateway = inject(ProcedureGateway);
  private readonly _dialogService = inject(DialogService);
  procedure: Procedure | null = null;
  procedureModel = signal<ProcedurePayload>({
    name: '',
    type: '',
    description: '',
    startDate: new Date().toISOString(),
    endDate: '',
    status: 'IN_PROGRESS',
  });
  procedureForm = form(this.procedureModel, (schemaPath) => {
    required(schemaPath.name, { message: 'Ce champ est obligatoire' });
  });
  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Accueil', route: '/' },
    { label: 'Procédures', route: '/procedure' },
    { label: 'Nouvelle procédure', route: '/procedure/new-procedure' },
  ];

  procedureTypes = signal<ProcedureType[]>([]);

  ngOnInit(): void {
    this.fetchProcedureTypes();
  }

  async fetchProcedureTypes() {
    try {
      const procedureTypes =
        (await this._procedureGateway.getProcedureTypes()) as ProcedureType[];
      const formattedProcedureTypes = procedureTypes.map((type) => {
        return {
          ...type,
          label: type.label,
          value: type.id,
        };
      });
      this.procedureTypes.set(formattedProcedureTypes);
      this.procedureModel().type = formattedProcedureTypes[0].value;
    } catch (error) {
      console.error(error);
    }
  }

  addDocument() {
    this._dialogService.open(ProcedureDocumentComponent, {
      header: 'Ajouter un document',
      width: '40vw',
      focusOnShow: false,
      closable: true,
      closeOnEscape: true,
    });
  }

  onSubmit() {
    const payload = {
      ...this.procedureModel(),
      endDate: new Date(this.procedureModel().endDate).toISOString(),
    };
    console.log({ procedure: payload });
  }
}
