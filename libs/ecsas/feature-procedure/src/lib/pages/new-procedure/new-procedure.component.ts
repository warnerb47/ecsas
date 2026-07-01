import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
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
import {
  Procedure,
  ProcedureDocument,
  ProcedurePayload,
  ProcedureType,
} from '@org/models';
import { form, FormField, required, submit } from '@angular/forms/signals';
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
  private readonly _router = inject(Router);

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
  documents = signal<ProcedureDocument[]>([]);
  loadingSubmit = signal(false);

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
    this._dialogService
      .open(ProcedureDocumentComponent, {
        header: 'Ajouter un document',
        width: '40vw',
        focusOnShow: false,
        closable: true,
        closeOnEscape: true,
      })
      ?.onClose.pipe()
      .subscribe((document) => {
        if (!document) return;
        this.documents.update((documents) => [...documents, document]);
      });
  }

  removeDocument(document: ProcedureDocument) {
    this.documents.update((documents) =>
      documents.filter((doc) => doc.name !== document.name),
    );
  }

  async onSubmit() {
    await submit(this.procedureForm, async () => {
      if (this.procedureForm().valid()) {
        this.createProcedure();
      }
    });
  }

  async createProcedure() {
    try {
      this.loadingSubmit.set(true);
      const payload = {
        ...this.procedureModel(),
        endDate: new Date(this.procedureModel().endDate).toISOString(),
        documents: this.documents(),
      };
      console.log({ procedure: payload });
      const result =
        await this._procedureGateway.createProcedureWithDocuments(payload);
      console.log({ result });
      this._router.navigateByUrl('/procedure');
    } catch (error) {
      console.error(error);
    } finally {
      this.loadingSubmit.set(false);
    }
  }
}
