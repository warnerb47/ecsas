import { Component, input, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormValueControl, ValidationError, WithOptionalFieldTree } from '@angular/forms/signals';

@Component({
  selector: 'lib-date-input',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './date-input.component.html'
})
export class DateInputComponent implements FormValueControl<string | null> {
  label = input('');
  placeholder = input<string>('');
  value = model<string | null>(null);

  // Interaction state (touched)
  readonly touched = model<boolean>(false);

  // State inputs automatically populated by [formField]
  readonly invalid = input<boolean>(false);
  readonly errors = input<readonly WithOptionalFieldTree<ValidationError>[]>([]);
  readonly disabled = input<boolean>(false);


  setValue(value: string): void {
    this.value.set(value);
  }

}
