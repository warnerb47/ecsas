import { Component, input, model, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormValueControl, ValidationError, WithOptionalFieldTree} from '@angular/forms/signals';

@Component({
  selector: 'lib-text-input',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './text-input.component.html'
})
export class TextInputComponent implements FormValueControl<string>{
  label = input('');
  type = input<'text' | 'email' | 'password' | 'number' | 'date'>('text');
  placeholder = input<string>('');
  value = model('');

  // Interaction state (touched)
  readonly touched = model<boolean>(false);

  // State inputs automatically populated by [formField]
  readonly invalid = input<boolean>(false);
  readonly errors = input<readonly WithOptionalFieldTree<ValidationError>[]>([]);
  readonly disabled = input<boolean>(false);
}
