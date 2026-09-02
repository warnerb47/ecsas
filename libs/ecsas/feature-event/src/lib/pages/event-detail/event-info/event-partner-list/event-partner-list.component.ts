import { Component, input, output } from '@angular/core';
import { ButtonComponent } from '@org/ecsas/shared-ui';
import { EventPartner } from '@org/models';

@Component({
  selector: 'lib-event-partner-list',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './event-partner-list.component.html',
})
export class EventPartnerListComponent {
  partners = input<Partial<EventPartner>[]>([]);

  addPartner = output<void>();
  deletePartner = output<Partial<EventPartner>>();
}