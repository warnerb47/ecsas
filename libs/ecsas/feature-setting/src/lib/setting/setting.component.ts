import { Component } from '@angular/core';
import { PasswordInputComponent, TextInputComponent } from '@org/ecsas/shared-ui';

@Component({
  selector: 'lib-setting',
  imports: [TextInputComponent, PasswordInputComponent],
  templateUrl: './setting.component.html',
})
export class SettingComponent {}
