import { Component, input, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormValueControl } from '@angular/forms/signals';

@Component({
  selector: 'lib-date-input',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './date-input.component.html'
})
export class DateInputComponent implements FormValueControl<string> {
  label = input('');
  placeholder = input<string>('');
  value = model<string>('');

  setValue(value: string): void {
    this.value.set(value);
  }

}
