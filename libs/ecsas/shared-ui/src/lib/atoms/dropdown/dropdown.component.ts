import { Component, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-dropdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dropdown.component.html'
})
export class DropdownComponent {
  label = input('');
  placeholder = input<string>('');
  options = input<{label: string; value: string}[]>([]);
}
