import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-text-area',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './text-area.component.html'
})
export class TextAreaComponent {
  label = input('');
  placeholder = input<string>('');
}
