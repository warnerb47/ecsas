import { Component, input, signal, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormValueControl,
  ValidationError,
  WithOptionalFieldTree,
} from '@angular/forms/signals';

@Component({
  selector: 'lib-phone-input',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './phone-input.component.html'
})
export class PhoneInputComponent implements FormValueControl<string>{
  label = input('');
  placeholder = input<string>('');
  phonePrefix = signal(+221);
  value = model('');

  // Interaction state (touched)
  readonly touched = model<boolean>(false);

  // State inputs automatically populated by [formField]
  readonly invalid = input<boolean>(false);
  readonly errors = input<readonly WithOptionalFieldTree<ValidationError>[]>([]);
  readonly disabled = input<boolean>(false);
}
