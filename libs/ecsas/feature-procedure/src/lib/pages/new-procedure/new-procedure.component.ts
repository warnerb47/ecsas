import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  BreadcrumbItem,
  TopbarComponent,
  TextInputComponent,
  ButtonComponent,
  TextAreaComponent,
} from '@org/ecsas/shared-ui';
import {
  Procedure,
  ProcedureDocument,
} from '@org/models';
import { form, FormField, required, submit } from '@angular/forms/signals';
import { ProcedureGateway } from '@org/ecsas/ecsas-data';
import { DialogService } from 'primeng/dynamicdialog';
import { Message } from 'primeng/message';
import { DocumentCardComponent, ProcedureDocumentComponent } from '../../components';

@Component({
  selector: 'lib-new-procedure-component',
  imports: [
    RouterLink,
    TopbarComponent,
    FormField,
    TextInputComponent,
    ButtonComponent,
    TextAreaComponent,
    DocumentCardComponent,
    Message,
  ],
  providers: [DialogService],
  templateUrl: './new-procedure.component.html',
})
export class NewProcedureComponent {
  private readonly _procedureGateway = inject(ProcedureGateway);
  private readonly _dialogService = inject(DialogService);
  private readonly _router = inject(Router);

  procedure: Procedure | null = null;
  procedureModel = signal<Procedure>({
    name: '',
    description: '',
    icon: '',
    id: '',
  });
  procedureForm = form(this.procedureModel, (schemaPath) => {
    required(schemaPath.name, { message: 'Ce champ est obligatoire' });
  });
  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Accueil', route: '/' },
    { label: 'Procédures', route: '/procedure' },
    { label: 'Nouvelle procédure', route: '/procedure/new-procedure' },
  ];

  documents = signal<ProcedureDocument[]>([]);
  loadingSubmit = signal(false);
  formError = signal('');

  private readonly _fieldLabels: Record<string, string> = {
    name: 'Le nom de la procédure',
  };


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
    this.formError.set('');
    await submit(this.procedureForm, {
      ignoreValidators: 'none',
      action: () => this.createProcedure(),
      onInvalid: () => {
        this.formError.set(this.buildFormError());
      },
    });
  }

  private buildFormError(): string {
    const errors = this.procedureForm().errorSummary();
    if (!errors.length) {
      return 'Le formulaire contient des erreurs. Veuillez vérifier les champs.';
    }
    return errors
      .map((issue) => {
        const key = String(issue.fieldTree().keyInParent() ?? '');
        const label = this._fieldLabels[key];
        if (issue.kind === 'required') {
          return label
            ? `${label} est obligatoire.`
            : 'Un champ obligatoire est vide.';
        }
        return label
          ? `${label} : ${issue.message ?? 'invalide'}.`
          : (issue.message ?? 'Un champ est invalide.');
      })
      .join(' ');
  }

  clearFormError() {
    this.formError.set('');
  }

  async createProcedure() {
    try {
      this.loadingSubmit.set(true);
      const payload = {
        ...this.procedureModel(),
        documents: this.documents(),
      };
      await this._procedureGateway.createProcedureWithDocuments(payload);
      this._router.navigateByUrl('/procedure');
    } catch (error) {
      console.error(error);
    } finally {
      this.loadingSubmit.set(false);
    }
  }
}
