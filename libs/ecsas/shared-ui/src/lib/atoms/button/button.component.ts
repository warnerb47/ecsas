import { Component, Input } from '@angular/core';

@Component({
  selector: 'lib-button',
  standalone: true,
  imports: [],
  templateUrl: './button.component.html'
})
export class ButtonComponent {
  @Input() type: 'primary' = 'primary';
  @Input() disabled: boolean = false;
}
