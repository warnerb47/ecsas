import { Component, input, output } from '@angular/core';
import { EventExpense, EventPartner, EventUsefulLink } from '@org/models';
import { EventExpenseListComponent } from './event-expense-list/event-expense-list.component';
import { EventLinkListComponent } from './event-link-list/event-link-list.component';
import { EventPartnerListComponent } from './event-partner-list/event-partner-list.component';

@Component({
  selector: 'lib-event-info',
  standalone: true,
  imports: [
    EventExpenseListComponent,
    EventLinkListComponent,
    EventPartnerListComponent,
  ],
  templateUrl: './event-info.component.html',
})
export class EventInfoComponent {
  expenses = input<Partial<EventExpense>[]>([]);
  partners = input<Partial<EventPartner>[]>([]);
  links = input<Partial<EventUsefulLink>[]>([]);
  budget = input<number | undefined>(0);
  totalSpent = input(0);
  remaining = input(0);
  executionRate = input(0);

  addExpense = output<void>();
  editExpense = output<Partial<EventExpense>>();
  deleteExpense = output<Partial<EventExpense>>();

  addLink = output<void>();
  deleteLink = output<Partial<EventUsefulLink>>();

  addPartner = output<void>();
  deletePartner = output<Partial<EventPartner>>();
}