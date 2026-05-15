import { Component, input, signal, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormValueControl} from '@angular/forms/signals';

@Component({
  selector: 'lib-password-input',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './password-input.component.html'
})
export class PasswordInputComponent implements FormValueControl<string>{
  label = input('');
  placeholder = input<string>('');
  visible = signal(false);
  value = model('');
  
  toggleVisibility() {
    this.visible.update(value => !value);
  }
}
