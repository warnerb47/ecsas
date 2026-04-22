import { Component, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-dropdown-input',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dropdown-input.component.html'
})
export class DropdownComponent {
  label = input('');
  placeholder = input<string>('');
  options = input<{label: string; value: string}[]>([]);
  phonePrefix = signal(+221);
}
