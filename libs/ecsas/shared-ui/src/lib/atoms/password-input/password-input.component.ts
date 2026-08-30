import { Component, input, signal, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormValueControl,
  ValidationError,
  WithOptionalFieldTree,
} from '@angular/forms/signals';

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

  // Interaction state (touched)
  readonly touched = model<boolean>(false);

  // State inputs automatically populated by [formField]
  readonly invalid = input<boolean>(false);
  readonly errors = input<readonly WithOptionalFieldTree<ValidationError>[]>([]);
  readonly disabled = input<boolean>(false);

  toggleVisibility() {
    this.visible.update(value => !value);
  }
}
