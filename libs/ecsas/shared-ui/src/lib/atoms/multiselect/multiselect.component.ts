import { Component, input, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormValueControl,
  ValidationError,
  WithOptionalFieldTree,
} from '@angular/forms/signals';

@Component({
  selector: 'lib-multiselect',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './multiselect.component.html',
})
export class MultiselectComponent
  implements FormValueControl<string | number | null | (string | number | null)[]>
{
  label = input('');
  placeholder = input<string>('');
  options = input<{ label: string; value: string | number | null }[]>([]);
  value = model<string | number | (string | number | null)[] | null>([]);

  // Interaction state (touched)
  readonly touched = model<boolean>(false);

  // State inputs automatically populated by [formField]
  readonly invalid = input<boolean>(false);
  readonly errors = input<readonly WithOptionalFieldTree<ValidationError>[]>(
    [],
  );
  readonly disabled = input<boolean>(false);

  open = false;

  private currentValues(): (string | number | null)[] {
    const value = this.value();
    return Array.isArray(value) ? value : [];
  }

  selectedCount(): number {
    return this.currentValues().length;
  }

  isSelected(optionValue: string | number | null): boolean {
    return optionValue !== null && this.currentValues().includes(optionValue);
  }

  toggle(optionValue: string | number | null) {
    if (optionValue === null) return;
    const current = this.currentValues();
    const next = current.includes(optionValue)
      ? current.filter((value) => value !== optionValue)
      : [...current, optionValue];
    this.value.set(next);
  }

  toggleOpen() {
    this.open = !this.open;
  }

  onBlur() {
    this.touched.set(true);
    this.open = false;
  }
}
