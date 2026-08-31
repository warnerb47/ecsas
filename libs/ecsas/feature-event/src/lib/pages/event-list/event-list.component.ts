import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  BreadcrumbItem,
  ButtonComponent,
  TopbarComponent,
} from '@org/ecsas/shared-ui';
import { Event, EventFilters, EventStatus, EventType } from '@org/models';
import { EventGateway } from '@org/ecsas/ecsas-data';
import { DialogService } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { EventCreateDialogComponent } from '../../components/event-create-dialog/event-create-dialog.component';

@Component({
  selector: 'lib-event-list-component',
  imports: [
    RouterLink,
    TopbarComponent,
    ButtonComponent,
  ],
  providers: [DialogService],
  templateUrl: './event-list.component.html',
})
export class EventListComponent implements OnInit, OnDestroy {
  private readonly _eventGateway = inject(EventGateway);
  private readonly _dialogService = inject(DialogService);
  private readonly _unsubscribe = new Subject<void>();

  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Événements', route: '/event' },
    { label: 'Liste', route: '/event/list' },
  ];

  typeOptions = [
    { label: 'Secours social', value: 'SOCIAL_CARE' },
    { label: 'Santé', value: 'HEALTH' },
    { label: 'Réunion', value: 'MEETING' },
    { label: 'Cérémonie', value: 'CEREMONY' },
    { label: 'Communautaire', value: 'COMMUNITY' },
  ];

  statusOptions = [
    { label: 'Planifié', value: 'PLANNED' },
    { label: 'En cours', value: 'IN_PROGRESS' },
    { label: 'Terminé', value: 'COMPLETED' },
    { label: 'Annulé', value: 'CANCELLED' },
  ];

  filters = signal<EventFilters>({
    name: null,
    type: null,
    status: null,
    dateFrom: null,
    dateTo: null,
    page: 1,
    pageSize: 10,
  });

  events = signal<Partial<Event>[]>([]);
  total = signal(0);
  loading = signal(false);

  ngOnInit(): void {
    this.fetchEvents();
  }

  ngOnDestroy(): void {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

  async fetchEvents() {
    try {
      this.loading.set(true);
      const result = await this._eventGateway.filterEvents(this.filters());
      this.events.set(result);
      const stats = await this._eventGateway.getEventStats();
      this.total.set(stats.total);
    } catch (error) {
      console.error(error);
    } finally {
      this.loading.set(false);
    }
  }

  onFilterChange(key: keyof EventFilters, value: string | number | null) {
    this.filters.update((f) => ({ ...f, [key]: value as never, page: 1 }));
    this.fetchEvents();
  }

  goToPage(page: number) {
    if (page < 1) return;
    this.filters.update((f) => ({ ...f, page }));
    this.fetchEvents();
  }

  onCreate() {
    this._dialogService
      .open(EventCreateDialogComponent, {
        header: 'Nouvel évènement',
        width: '50vw',
        focusOnShow: false,
        closable: true,
        closeOnEscape: true,
      })
      ?.onClose.pipe(takeUntil(this._unsubscribe))
      .subscribe(async (result) => {
        if (!result) return;
        await this._eventGateway.createEvent(result);
        this.fetchEvents();
      });
  }

  getStatusLabel(status: EventStatus | undefined): string {
    const map: Record<string, string> = {
      PLANNED: 'Planifié',
      IN_PROGRESS: 'En cours',
      COMPLETED: 'Terminé',
      CANCELLED: 'Annulé',
    };
    return status ? (map[status] ?? 'Planifié') : 'Planifié';
  }

  getStatusClasses(status: EventStatus | undefined): string {
    const map: Record<string, string> = {
      PLANNED: 'bg-blue-50 text-blue-700 border-blue-100',
      IN_PROGRESS: 'bg-emerald-50 text-emerald-700 border-emerald-100',
      COMPLETED: 'bg-violet-50 text-violet-700 border-violet-100',
      CANCELLED: 'bg-red-50 text-red-700 border-red-100',
    };
    return status ? (map[status] ?? 'bg-blue-50 text-blue-700 border-blue-100') : 'bg-blue-50 text-blue-700 border-blue-100';
  }

  getTypeLabel(type: EventType | undefined): string {
    const map: Record<string, string> = {
      SOCIAL_CARE: 'Secours social',
      HEALTH: 'Santé',
      MEETING: 'Réunion',
      CEREMONY: 'Cérémonie',
      COMMUNITY: 'Communautaire',
    };
    return type ? (map[type] ?? type) : '';
  }

  getTypeIcon(type: EventType | undefined): string {
    const map: Record<string, string> = {
      SOCIAL_CARE: 'pi-heart',
      HEALTH: 'pi-heartbeat',
      MEETING: 'pi-users',
      CEREMONY: 'pi-gift',
      COMMUNITY: 'pi-star',
    };
    return type ? (map[type] ?? 'pi-calendar') : 'pi-calendar';
  }

  formatAmount(value: number | undefined): string {
    if (value === null || value === undefined) return '—';
    return new Intl.NumberFormat('fr-FR').format(value) + ' FCFA';
  }

  formatDate(value: string | undefined): string {
    if (!value) return '—';
    const date = new Date(value);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  }
}
