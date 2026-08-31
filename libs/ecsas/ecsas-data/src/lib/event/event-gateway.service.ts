import { Injectable } from '@angular/core';
import { EventRepository } from '@org/api/products';
import {
  EventExpense,
  EventFilters,
  EventPartner,
  EventPayload,
  EventUsefulLink,
} from '@org/models';

@Injectable({
  providedIn: 'root',
})
export class EventGateway {
  private readonly _eventRepository = new EventRepository();

  getEvents() {
    return this._eventRepository.getEvents();
  }

  filterEvents(filters: EventFilters) {
    return this._eventRepository.filterEvents(filters);
  }

  getEventStats() {
    return this._eventRepository.getEventStats();
  }

  getEventById(eventId: string) {
    return this._eventRepository.getEventById(eventId);
  }

  createEvent(payload: EventPayload) {
    return this._eventRepository.createEvent(payload);
  }

  updateEvent(payload: EventPayload) {
    return this._eventRepository.updateEvent(payload);
  }

  deleteEvent(eventId: string) {
    return this._eventRepository.deleteEvent(eventId);
  }

  addExpense(payload: EventExpense) {
    return this._eventRepository.addExpense(payload);
  }

  updateExpense(payload: EventExpense) {
    return this._eventRepository.updateExpense(payload);
  }

  deleteExpense(params: { eventId: string; expenseId: string }) {
    return this._eventRepository.deleteExpense(params);
  }

  addPartner(payload: EventPartner) {
    return this._eventRepository.addPartner(payload);
  }

  deletePartner(params: { eventId: string; partnerId: string }) {
    return this._eventRepository.deletePartner(params);
  }

  addUsefulLink(payload: EventUsefulLink) {
    return this._eventRepository.addUsefulLink(payload);
  }

  deleteUsefulLink(params: { eventId: string; linkId: string }) {
    return this._eventRepository.deleteUsefulLink(params);
  }

  upsertDocument(params: {
    eventId: string;
    type: string;
    status: string;
    fileName?: string;
  }) {
    return this._eventRepository.upsertDocument(params);
  }
}
