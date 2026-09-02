import { Component, input, output } from '@angular/core';
import { ButtonComponent } from '@org/ecsas/shared-ui';
import { EventUsefulLink } from '@org/models';

@Component({
  selector: 'lib-event-link-list',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './event-link-list.component.html',
})
export class EventLinkListComponent {
  links = input<Partial<EventUsefulLink>[]>([]);

  addLink = output<void>();
  deleteLink = output<Partial<EventUsefulLink>>();
}