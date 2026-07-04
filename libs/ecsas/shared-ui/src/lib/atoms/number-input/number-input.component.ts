import { Component, input, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormValueControl, ValidationError, WithOptionalFieldTree} from '@angular/forms/signals';

@Component({
  selector: 'lib-number-input',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './number-input.component.html'
})
export class NumberInputComponent implements FormValueControl<number | null>{
  label = input('');
  placeholder = input<string>('');
  value = model<number | null>(null);

  // Interaction state (touched)
  readonly touched = model<boolean>(false);

  // State inputs automatically populated by [formField]
  readonly invalid = input<boolean>(false);
  readonly errors = input<readonly WithOptionalFieldTree<ValidationError>[]>([]);
  readonly disabled = input<boolean>(false);

  setValue(value: string) {
    if (value) {
      this.value.set(Number(value));
    } else {
      this.value.set(null);
    }
  }
}
