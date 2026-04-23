import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-search-input',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './search-input.component.html'
})
export class SearchInputComponent {
  placeholder = input<string>('');
}
