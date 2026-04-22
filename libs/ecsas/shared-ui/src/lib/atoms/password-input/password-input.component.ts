import { Component, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-password-input',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './password-input.component.html'
})
export class PasswordInputComponent {
  label = input('');
  placeholder = input<string>('');
  visible = signal(false);
  
  toggleVisibility() {
    this.visible.update(value => !value);
  }
}
