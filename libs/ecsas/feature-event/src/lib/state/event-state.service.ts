import { Injectable, signal } from '@angular/core';
import { Event } from '@org/models';

@Injectable({
  providedIn: 'root',
})
export class EventStateService {
  event = signal<Partial<Event> | null>(null);

  reset() {
    this.event.set(null);
  }
}
