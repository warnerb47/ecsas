import { Component, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-phone-input',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './phone-input.component.html'
})
export class PhoneInputComponent {
  label = input('');
  placeholder = input<string>('');
  phonePrefix = signal(+221);
}
