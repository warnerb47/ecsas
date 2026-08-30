import { Component, input, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormValueControl,
  ValidationError,
  WithOptionalFieldTree,
} from '@angular/forms/signals';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'lib-toggle-input',
  standalone: true,
  imports: [CommonModule, ToggleSwitchModule, FormsModule],
  templateUrl: './toggle-input.component.html'
})
export class ToggleInputComponent implements FormValueControl<boolean>{
  label = input('');
  value = model(false);

  // Interaction state (touched)
  readonly touched = model<boolean>(false);

  // State inputs automatically populated by [formField]
  readonly invalid = input<boolean>(false);
  readonly errors = input<readonly WithOptionalFieldTree<ValidationError>[]>([]);
  readonly disabled = input<boolean>(false);

  setValue(checked: boolean) {
    this.value.set(checked);
  }
}
