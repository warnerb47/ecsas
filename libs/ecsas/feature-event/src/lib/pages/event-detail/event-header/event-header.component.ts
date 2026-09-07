import { Component, input, output } from '@angular/core';
import { Event, EventStatus, EventType } from '@org/models';

const EVENT_STATUS_LABELS: Record<EventStatus, string> = {
  PLANNED: 'Planifié',
  IN_PROGRESS: 'En cours',
  COMPLETED: 'Terminé',
  CANCELLED: 'Annulé',
};

const EVENT_STATUS_CLASSES: Record<EventStatus, string> = {
  PLANNED: 'bg-blue-50 text-blue-700 border-blue-100',
  IN_PROGRESS: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  COMPLETED: 'bg-violet-50 text-violet-700 border-violet-100',
  CANCELLED: 'bg-red-50 text-red-700 border-red-100',
};

const EVENT_TYPE_ICONS: Record<EventType, string> = {
  SOCIAL_CARE: 'pi-heart',
  HEALTH: 'pi-heartbeat',
  MEETING: 'pi-users',
  CEREMONY: 'pi-gift',
  COMMUNITY: 'pi-star',
};

const EVENT_TYPE_LABELS: Record<EventType, string> = {
  SOCIAL_CARE: 'Secours social',
  HEALTH: 'Santé',
  MEETING: 'Réunion',
  CEREMONY: 'Cérémonie',
  COMMUNITY: 'Communautaire',
};

const EVENT_TYPE_CLASSES: Record<EventType, string> = {
  SOCIAL_CARE: 'bg-rose-50 text-rose-700 border-rose-100',
  HEALTH: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  MEETING: 'bg-blue-50 text-blue-700 border-blue-100',
  CEREMONY: 'bg-violet-50 text-violet-700 border-violet-100',
  COMMUNITY: 'bg-amber-50 text-amber-700 border-amber-100',
};

@Component({
  selector: 'lib-event-header',
  standalone: true,
  imports: [],
  templateUrl: './event-header.component.html',
})
export class EventHeaderComponent {
  event = input.required<Partial<Event>>();

  edit = output<void>();

  getStatusLabel(status: EventStatus | undefined): string {
    return EVENT_STATUS_LABELS[status ?? 'PLANNED'];
  }

  getStatusClasses(status: EventStatus | undefined): string {
    return EVENT_STATUS_CLASSES[status ?? 'PLANNED'];
  }

  getTypeIcon(type: EventType | undefined): string {
    return EVENT_TYPE_ICONS[type ?? 'MEETING'];
  }

  getTypeLabel(type: EventType | undefined): string {
    return EVENT_TYPE_LABELS[type ?? 'MEETING'];
  }

  getTypeClasses(type: EventType | undefined): string {
    return EVENT_TYPE_CLASSES[type ?? 'MEETING'];
  }

  formatTime(value: string | undefined): string {
    if (!value) return '—';
    return new Date(`1970-01-01T${value}`).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  formatDate(value: string | undefined): string {
    if (!value) return '—';
    return new Date(value).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  }

  formatAmount(value: number | undefined): string {
    if (value === null || value === undefined) return '—';
    return new Intl.NumberFormat('fr-FR').format(value) + ' FCFA';
  }
}
