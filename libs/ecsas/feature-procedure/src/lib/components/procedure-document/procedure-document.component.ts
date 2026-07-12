import { Component, inject, signal } from '@angular/core';
import { form, required, FormField, submit } from '@angular/forms/signals';
import {
  ButtonComponent,
  TextInputComponent,
  ToggleInputComponent,
} from '@org/ecsas/shared-ui';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';


@Component({
  selector: 'lib-procedure-document-component',
  imports: [TextInputComponent, ButtonComponent, ToggleInputComponent, FormField],
  templateUrl: './procedure-document.component.html',
  providers: [DialogService]
})
export class ProcedureDocumentComponent {
    private readonly _dialogRef = inject(DynamicDialogRef);

  documentModel = signal({
    name: '',
    required: false
  });

   docForm = form(this.documentModel, (f) => {
    required(f.name, { message: 'Le nom du document est requis' });
  });

  async addDocument() {
    await submit(this.docForm, async () => {
      if(this.docForm().valid()) {
        this._dialogRef?.close(this.documentModel());
      }
    });
  }
}
