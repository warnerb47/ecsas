import { Component, input, output } from '@angular/core';
import { EventPartner } from '@org/models';

@Component({
  selector: 'lib-event-partner-list',
  standalone: true,
  imports: [],
  templateUrl: './event-partner-list.component.html',
})
export class EventPartnerListComponent {
  partners = input<Partial<EventPartner>[]>([]);

  addPartner = output<void>();
  deletePartner = output<Partial<EventPartner>>();
}
