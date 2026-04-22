import { Component, signal } from '@angular/core';

@Component({
  selector: 'lib-button',
  standalone: true,
  imports: [],
  templateUrl: './button.component.html'
})
export class ButtonComponent {
  type = signal<'primary'>('primary');
  disabled = signal(false);
}
