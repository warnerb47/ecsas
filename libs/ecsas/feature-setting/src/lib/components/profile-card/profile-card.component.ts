import { Component } from '@angular/core';
import { ButtonComponent, PasswordInputComponent, TextInputComponent } from '@org/ecsas/shared-ui';

@Component({
  selector: 'lib-profile-card',
  imports: [TextInputComponent, PasswordInputComponent, ButtonComponent],
  templateUrl: './profile-card.component.html',
})
export class ProfileCardComponent {}
