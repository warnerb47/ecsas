import { Component, input, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormValueControl } from '@angular/forms/signals';

@Component({
  selector: 'lib-dropdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dropdown.component.html'
})
export class DropdownComponent implements FormValueControl<string> {
  label = input('');
  placeholder = input<string>('');
  options = input<{ label: string; value: string }[]>([]);
  value = model('');

  setValue(event: Event) {
    const selectedValue = (event.target as HTMLSelectElement).value;
    console.log(selectedValue);
    this.value.set(selectedValue);
  }
}
