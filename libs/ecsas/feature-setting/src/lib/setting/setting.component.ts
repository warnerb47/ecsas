import { Component } from '@angular/core';
import { ButtonComponent, PasswordInputComponent, TextInputComponent } from '@org/ecsas/shared-ui';
import { ExportZipCardComponent } from '../components/export-zip-card/export-zip-card.component';
import { ProfileCardComponent } from '../components/profile-card/profile-card.component';

@Component({
  selector: 'lib-setting',
  imports: [TextInputComponent, PasswordInputComponent, ButtonComponent, ProfileCardComponent, ExportZipCardComponent],
  templateUrl: './setting.component.html',
})
export class SettingComponent {}
