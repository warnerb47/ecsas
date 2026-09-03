import {
  Component,
  computed,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbItem, TopbarComponent } from '@org/ecsas/shared-ui';
import {
  Event,
  EventExpense,
  EventPartner,
  EventUsefulLink,
} from '@org/models';
import { EventGateway } from '@org/ecsas/ecsas-data';
import { DialogService } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { EventCreateDialogComponent } from '../../components/event-create-dialog/event-create-dialog.component';
import { EventExpenseFormComponent } from '../../components/event-expense-form/event-expense-form.component';
import { EventPartnerFormComponent } from '../../components/event-partner-form/event-partner-form.component';
import { EventLinkFormComponent } from '../../components/event-link-form/event-link-form.component';
import { EventDocumentGenerateComponent } from '../../components/event-document-generate/event-document-generate.component';
import { EventHeaderComponent } from './event-header/event-header.component';
import { EventInfoComponent } from './event-info/event-info.component';
import {
  EventDocumentComponent,
  GenerateDocumentEvent,
  UploadDocumentEvent,
} from './event-document/event-document.component';

@Component({
  selector: 'lib-event-detail-component',
  imports: [
    TopbarComponent,
    EventHeaderComponent,
    EventInfoComponent,
    EventDocumentComponent,
  ],
  providers: [DialogService],
  templateUrl: './event-detail.component.html',
})
export class EventDetailComponent implements OnInit, OnDestroy {
  private readonly _router = inject(Router);
  private readonly _route = inject(ActivatedRoute);
  private readonly _eventGateway = inject(EventGateway);
  private readonly _dialogService = inject(DialogService);
  private readonly _unsubscribe = new Subject<void>();

  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Événements', route: '/event' },
    { label: 'Détail', route: '' },
  ];

  event = signal<Partial<Event> | null>(null);
  activeTab = signal("Vue d'ensemble");

  tabs = ["Vue d'ensemble", 'Documents'];

  expenses = computed(() => this.event()?.expenses ?? []);
  partners = computed(() => this.event()?.partners ?? []);
  usefulLinks = computed(() => this.event()?.usefulLinks ?? []);

  totalSpent = computed(() =>
    (this.event()?.expenses ?? []).reduce((sum, e) => sum + (e.spent ?? 0), 0),
  );

  remaining = computed(() => {
    const budget = this.event()?.budget ?? 0;
    return budget - this.totalSpent();
  });

  executionRate = computed(() => {
    const budget = this.event()?.budget ?? 0;
    if (budget <= 0) return 0;
    return Math.round((this.totalSpent() / budget) * 100);
  });

  ngOnInit(): void {
    this._route.params
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((params) => {
        const eventId = params['eventId'];
        if (eventId) {
          this.fetchEvent(eventId);
        }
      });
  }

  ngOnDestroy(): void {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

  async fetchEvent(eventId: string) {
    try {
      const event = await this._eventGateway.getEventById(eventId);
      this.event.set(event ?? null);
    } catch (error) {
      console.error(error);
    }
  }

  onTabChange(tab: string) {
    this.activeTab.set(tab);
  }

  goBack() {
    this._router.navigate(['/event']);
  }

  onEdit() {
    const current = this.event();
    if (!current) return;
    this._dialogService
      .open(EventCreateDialogComponent, {
        header: "Modifier l'évènement",
        width: '50vw',
        focusOnShow: false,
        closable: true,
        closeOnEscape: true,
        data: { event: current },
      })
      ?.onClose.pipe(takeUntil(this._unsubscribe))
      .subscribe(async (result) => {
        if (!result) return;
        if (result.id) {
          await this._eventGateway.updateEvent(result);
        } else {
          await this._eventGateway.createEvent(result);
        }
        if (current.id) {
          this.fetchEvent(current.id);
        }
      });
  }

  onAddExpense() {
    const eventId = this.event()?.id;
    if (!eventId) return;
    this._dialogService
      .open(EventExpenseFormComponent, {
        header: 'Nouvelle dépense',
        width: '40vw',
        focusOnShow: false,
        closable: true,
        closeOnEscape: true,
      })
      ?.onClose.pipe(takeUntil(this._unsubscribe))
      .subscribe(async (result) => {
        if (!result) return;
        await this._eventGateway.addExpense({ ...result, eventId });
        this.fetchEvent(eventId);
      });
  }

  onEditExpense(expense: Partial<EventExpense>) {
    const eventId = this.event()?.id;
    if (!eventId) return;
    this._dialogService
      .open(EventExpenseFormComponent, {
        header: 'Modifier la dépense',
        width: '40vw',
        focusOnShow: false,
        closable: true,
        closeOnEscape: true,
        data: expense,
      })
      ?.onClose.pipe(takeUntil(this._unsubscribe))
      .subscribe(async (result) => {
        if (!result) return;
        await this._eventGateway.updateExpense({ ...result, eventId });
        this.fetchEvent(eventId);
      });
  }

  async onDeleteExpense(expense: Partial<EventExpense>) {
    const eventId = this.event()?.id;
    if (!eventId || !expense.id) return;
    await this._eventGateway.deleteExpense({ eventId, expenseId: expense.id });
    this.fetchEvent(eventId);
  }

  onAddPartner() {
    const eventId = this.event()?.id;
    if (!eventId) return;
    this._dialogService
      .open(EventPartnerFormComponent, {
        header: 'Ajouter un partenaire',
        width: '40vw',
        focusOnShow: false,
        closable: true,
        closeOnEscape: true,
      })
      ?.onClose.pipe(takeUntil(this._unsubscribe))
      .subscribe(async (result) => {
        if (!result) return;
        await this._eventGateway.addPartner({
          ...result,
          eventId,
          color: this.getPartnerColor(),
        });
        this.fetchEvent(eventId);
      });
  }

  async onDeletePartner(partner: Partial<EventPartner>) {
    const eventId = this.event()?.id;
    if (!eventId || !partner.id) return;
    await this._eventGateway.deletePartner({ eventId, partnerId: partner.id });
    this.fetchEvent(eventId);
  }

  onAddLink() {
    const eventId = this.event()?.id;
    if (!eventId) return;
    this._dialogService
      .open(EventLinkFormComponent, {
        header: 'Ajouter un lien utile',
        width: '40vw',
        focusOnShow: false,
        closable: true,
        closeOnEscape: true,
      })
      ?.onClose.pipe(takeUntil(this._unsubscribe))
      .subscribe(async (result) => {
        if (!result) return;
        await this._eventGateway.addUsefulLink({ ...result, eventId });
        this.fetchEvent(eventId);
      });
  }

  async onDeleteLink(link: Partial<EventUsefulLink>) {
    const eventId = this.event()?.id;
    if (!eventId || !link.id) return;
    await this._eventGateway.deleteUsefulLink({ eventId, linkId: link.id });
    this.fetchEvent(eventId);
  }

  onGenerateDocument(params: GenerateDocumentEvent) {
    const eventId = this.event()?.id;
    if (!eventId) return;
    this._dialogService
      .open(EventDocumentGenerateComponent, {
        header: params.label,
        width: '40vw',
        focusOnShow: false,
        closable: true,
        closeOnEscape: true,
        data: { documentType: params.type },
      })
      ?.onClose.pipe(takeUntil(this._unsubscribe))
      .subscribe(async (result) => {
        if (!result) return;
        await this._eventGateway.upsertDocument({ eventId, ...result });
        this.fetchEvent(eventId);
      });
  }

  onUploadDocument(params: UploadDocumentEvent) {
    const eventId = this.event()?.id;
    if (!eventId) return;
    // Upload persistence would stream the file; here we record the document.
    this._eventGateway
      .upsertDocument({
        eventId,
        type: params.type,
        status: 'UPLOADED',
        fileName: params.file.name,
      })
      .then(() => this.fetchEvent(eventId));
  }

  private getPartnerColor(): string {
    const colors = ['#FDE68A', '#BBF7D0', '#BFDBFE', '#FBCFE8', '#E9D5FF'];
    const index = this.partners().length % colors.length;
    return colors[index];
  }
}
