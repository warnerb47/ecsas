import { Component, computed, signal } from '@angular/core';
import {
  BadgeComponent,
  ButtonComponent,
  TextInputComponent,
  ToggleInputComponent,
} from '@org/ecsas/shared-ui';

@Component({
  selector: 'lib-procedure-document-component',
  imports: [TextInputComponent, BadgeComponent, ButtonComponent, ToggleInputComponent],
  templateUrl: './procedure-document.component.html',
})
export class ProcedureDocumentComponent {
  required = signal(false);

  badgeType = computed<'primary' | 'secondary'>(() =>
    this.required() ? 'primary' : 'secondary',
  );
  toggleActive() {
    this.required.update((value) => !value);
  }

  addDocument() {
    console.log('add document');
  }
}
