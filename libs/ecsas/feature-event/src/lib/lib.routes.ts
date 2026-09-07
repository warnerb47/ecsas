import { Route } from '@angular/router';
import { EventCalendarComponent } from './pages/event-calendar/event-calendar.component';
import { EventListComponent } from './pages/event-list/event-list.component';
import { EventDetailComponent } from './pages/event-detail/event-detail.component';

export const featureEventRoutes: Route[] = [
  { path: '', component: EventCalendarComponent, pathMatch: 'full' },
  { path: 'list', component: EventListComponent },
  { path: 'detail/:eventId', component: EventDetailComponent },
];
