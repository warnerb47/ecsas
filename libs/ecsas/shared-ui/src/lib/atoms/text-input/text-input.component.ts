import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-text-input',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './text-input.component.html'
})
export class TextInputComponent {
  label = input('');
  type = input<'text' | 'email' | 'password' | 'number'>('text');
  placeholder = input<string>('');
}
