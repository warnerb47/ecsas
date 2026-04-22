import { Component } from '@angular/core';
import { ButtonComponent, PasswordInputComponent, TextInputComponent } from '@org/ecsas/shared-ui';

@Component({
  selector: 'lib-export-zip-card',
  imports: [TextInputComponent, PasswordInputComponent, ButtonComponent],
  templateUrl: './export-zip-card.component.html',
})
export class ExportZipCardComponent {}
