import { Component, input, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormValueControl} from '@angular/forms/signals';

@Component({
  selector: 'lib-text-input',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './text-input.component.html'
})
export class TextInputComponent implements FormValueControl<string>{
  label = input('');
  type = input<'text' | 'email' | 'password' | 'number' | 'date'>('text');
  placeholder = input<string>('');
  value = model('');
}
