import { Component, input, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormValueControl,
  ValidationError,
  WithOptionalFieldTree,
} from '@angular/forms/signals';

@Component({
  selector: 'lib-text-area',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './text-area.component.html'
})
export class TextAreaComponent implements FormValueControl<string> {
  label = input('');
  placeholder = input<string>('');
  value = model('');

  // Interaction state (touched)
  readonly touched = model<boolean>(false);

  // State inputs automatically populated by [formField]
  readonly invalid = input<boolean>(false);
  readonly errors = input<readonly WithOptionalFieldTree<ValidationError>[]>([]);
  readonly disabled = input<boolean>(false);

  setValue(event: Event) {
    const selectedValue = (event.target as HTMLTextAreaElement).value;
    this.value.set(selectedValue);
  }
}
