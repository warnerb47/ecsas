import { Component, input, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormValueControl } from '@angular/forms/signals';

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

  setValue(event: Event) {
    const selectedValue = (event.target as HTMLTextAreaElement).value;
    this.value.set(selectedValue);
  }
}
