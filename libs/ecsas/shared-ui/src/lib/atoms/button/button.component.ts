import { Component, input, output, signal } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'lib-button',
  standalone: true,
  imports: [NgClass],
  templateUrl: './button.component.html'
})
export class ButtonComponent {
  type = input<'primary' | 'secondary'>();
}
