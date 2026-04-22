import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'lib-button-link',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './button-link.component.html'
})
export class ButtonLinkComponent {
  @Input() routerLink: string = '';
}
