import { Component, input, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormValueControl} from '@angular/forms/signals';

@Component({
  selector: 'lib-search-input',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './search-input.component.html'
})
export class SearchInputComponent implements FormValueControl<string>{
  placeholder = input<string>('');
  value = model('');
}
