import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  BreadcrumbItem,
  ButtonComponent,
  TopbarComponent,
} from '@org/ecsas/shared-ui';
import { Event, EventType } from '@org/models';
import { EventGateway } from '@org/ecsas/ecsas-data';
import { DialogService } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { EventCreateDialogComponent } from '../../components/event-create-dialog/event-create-dialog.component';

interface CalendarDay {
  date: Date;
  inMonth: boolean;
  isToday: boolean;
  events: Partial<Event>[];
}

@Component({
  selector: 'lib-event-calendar-component',
  imports: [RouterLink, TopbarComponent, ButtonComponent],
  providers: [DialogService],
  templateUrl: './event-calendar.component.html',
})
export class EventCalendarComponent implements OnInit, OnDestroy {
  private readonly _router = inject(Router);
  private readonly _eventGateway = inject(EventGateway);
  private readonly _dialogService = inject(DialogService);
  private readonly _unsubscribe = new Subject<void>();

  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Événements', route: '/event' },
    { label: 'Calendrier', route: '/event' },
  ];

  viewDate = signal(new Date());
  events = signal<Partial<Event>[]>([]);
  loading = signal(false);

  weekdays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

  monthLabel = computed(() =>
    this.viewDate().toLocaleDateString('fr-FR', {
      month: 'long',
      year: 'numeric',
    }),
  );

  today = () => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return now.getTime();
  };

  calendarDays = computed<CalendarDay[]>(() => {
    const current = this.viewDate();
    const firstOfMonth = new Date(current.getFullYear(), current.getMonth(), 1);
    const daysInMonth = new Date(
      current.getFullYear(),
      current.getMonth() + 1,
      0,
    ).getDate();
    const startOffset = (firstOfMonth.getDay() + 6) % 7; // Monday first

    const days: CalendarDay[] = [];
    const prevMonthDays = new Date(
      current.getFullYear(),
      current.getMonth(),
      0,
    ).getDate();

    const eventMap = new Map<string, Partial<Event>[]>();
    for (const event of this.events()) {
      if (!event.startDate) continue;
      const key = event.startDate;
      const list = eventMap.get(key) ?? [];
      list.push(event);
      eventMap.set(key, list);
    }

    const todayStart = this.today();

    const pushDay = (date: Date, inMonth: boolean) => {
      const iso = date.toISOString().slice(0, 10);
      days.push({
        date,
        inMonth,
        isToday: date.getTime() === todayStart,
        events: eventMap.get(iso) ?? [],
      });
    };

    for (let i = 0; i < startOffset; i++) {
      pushDay(
        new Date(current.getFullYear(), current.getMonth() - 1, prevMonthDays - startOffset + i + 1),
        false,
      );
    }
    for (let d = 1; d <= daysInMonth; d++) {
      pushDay(new Date(current.getFullYear(), current.getMonth(), d), true);
    }
    const remaining = (7 - (days.length % 7)) % 7;
    for (let i = 1; i <= remaining; i++) {
      pushDay(new Date(current.getFullYear(), current.getMonth() + 1, i), false);
    }
    return days;
  });

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
      const events = await this._eventGateway.getEvents();
      this.events.set(events);
    } catch (error) {
      console.error(error);
    } finally {
      this.loading.set(false);
    }
  }

  prevMonth() {
    this.viewDate.update(
      (d) => new Date(d.getFullYear(), d.getMonth() - 1, 1),
    );
  }

  nextMonth() {
    this.viewDate.update(
      (d) => new Date(d.getFullYear(), d.getMonth() + 1, 1),
    );
  }

  goToToday() {
    this.viewDate.set(new Date());
  }

  prettyDay(day: CalendarDay): string {
    return String(day.date.getDate());
  }

  onDayEvent(event: Partial<Event>) {
    this._router.navigate(['/event/detail', event.id]);
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

  getEventClasses(type: EventType | undefined): string {
    const map: Record<string, string> = {
      SOCIAL_CARE: 'text-rose-800 bg-rose-100',
      HEALTH: 'text-emerald-800 bg-emerald-100',
      MEETING: 'text-blue-800 bg-blue-100',
      CEREMONY: 'text-violet-800 bg-violet-100',
      COMMUNITY: 'text-amber-800 bg-amber-100',
    };
    return type ? (map[type] ?? 'text-slate-800 bg-slate-100') : 'text-slate-800 bg-slate-100';
  }
}
