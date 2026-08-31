import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  BreadcrumbItem,
  ButtonComponent,
  TopbarComponent,
} from '@org/ecsas/shared-ui';
import {
  Event,
  EventDocument,
  EventDocumentType,
  EventExpense,
  EventPartner,
  EventStatus,
  EventType,
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

interface DocumentDef {
  type: EventDocumentType;
  label: string;
  icon: string;
  description: string;
}

const DOCUMENTS: DocumentDef[] = [
  {
    type: 'INVITATION_LETTER',
    label: "Lettre d'invitation",
    icon: 'pi pi-file-pdf',
    description: "Invitation officielle à l'événement",
  },
  {
    type: 'SPONSORSHIP_LETTER',
    label: 'Lettre de demande de sponsoring',
    icon: 'pi pi-money-bill',
    description: 'Demande de soutien financier',
  },
  {
    type: 'BUDGET',
    label: "Budgetisation de l'évènement",
    icon: 'pi pi-chart-bar',
    description: 'Budget prévisionnel détaillé',
  },
  {
    type: 'ATTENDANCE_SHEET',
    label: 'Feuille de présence',
    icon: 'pi pi-users',
    description: 'Émargement des participants',
  },
  {
    type: 'EVENT_REPORT',
    label: "Rapport d'évènement",
    icon: 'pi pi-file-word',
    description: 'Compte-rendu final de la manifestation',
  },
];

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

const EXPENSE_CATEGORY_CLASSES: Record<string, string> = {
  Logistique: 'bg-slate-100 text-slate-500',
  Restauration: 'bg-amber-100 text-amber-700',
  Communication: 'bg-blue-100 text-blue-700',
  Distribution: 'bg-violet-100 text-violet-700',
  Autre: 'bg-slate-100 text-slate-500',
};

@Component({
  selector: 'lib-event-detail-component',
  imports: [
    RouterLink,
    TopbarComponent,
    ButtonComponent,
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
  activeTab = signal('Vue d\'ensemble');

  tabs = ['Vue d\'ensemble', 'Documents'];
  documentDefs = DOCUMENTS;

  expenses = computed(() => this.event()?.expenses ?? []);
  partners = computed(() => this.event()?.partners ?? []);
  usefulLinks = computed(() => this.event()?.usefulLinks ?? []);

  totalSpent = computed(() =>
    (this.event()?.expenses ?? []).reduce((sum, e) => sum + (e.spent ?? 0), 0),
  );

  totalPlanned = computed(() =>
    (this.event()?.expenses ?? []).reduce(
      (sum, e) => sum + (e.planned ?? 0),
      0,
    ),
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
    this._route.params.pipe(takeUntil(this._unsubscribe)).subscribe((params) => {
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
        header: 'Modifier l\'évènement',
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
        data: { expense },
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

  onGenerateDocument(type: EventDocumentType) {
    const eventId = this.event()?.id;
    if (!eventId) return;
    this._dialogService
      .open(EventDocumentGenerateComponent, {
        header: DOCUMENTS.find((d) => d.type === type)?.label ?? 'Document',
        width: '40vw',
        focusOnShow: false,
        closable: true,
        closeOnEscape: true,
        data: { documentType: type },
      })
      ?.onClose.pipe(takeUntil(this._unsubscribe))
      .subscribe(async (result) => {
        if (!result) return;
        await this._eventGateway.upsertDocument({ eventId, ...result });
        this.fetchEvent(eventId);
      });
  }

  onUploadDocument(type: EventDocumentType, inputEvent: { target: EventTarget | null }) {
    const eventId = this.event()?.id;
    const file = (inputEvent.target as HTMLInputElement | null)?.files?.[0] ?? null;
    if (!eventId) return;
    // Upload persistence would stream the file; here we record the document.
    this._eventGateway
      .upsertDocument({
        eventId,
        type,
        status: 'UPLOADED',
        fileName: file?.name ?? '',
      })
      .then(() => this.fetchEvent(eventId));
  }

  getDocument(def: DocumentDef): Partial<EventDocument> | undefined {
    return (this.event()?.documents ?? []).find((d) => d.type === def.type);
  }

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

  getCategoryClasses(category: string | undefined): string {
    if (!category) return 'bg-slate-100 text-slate-500';
    return EXPENSE_CATEGORY_CLASSES[category] ?? 'bg-slate-100 text-slate-500';
  }

  formatTime(value: string | undefined): string {
    if (!value) return '—';
    return new Date(`1970-01-01T${value}`).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  formatEcart(planned: number | undefined, spent: number | undefined): string {
    if (planned === null || planned === undefined) return '—';
    const diff = planned - (spent ?? 0);
    if (diff === 0) return '—';
    const formatted = new Intl.NumberFormat('fr-FR').format(Math.abs(diff));
    return diff > 0 ? `+${formatted} FCFA` : `-${formatted} FCFA`;
  }

  isEcartPositive(planned: number | undefined, spent: number | undefined): boolean {
    if (planned === null || planned === undefined) return false;
    return planned - (spent ?? 0) > 0;
  }

  formatDayMonth(value: string | undefined): string {
    if (!value) return '—';
    const parts = value.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}`;
    }
    return value;
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

  private getPartnerColor(): string {
    const colors = ['#FDE68A', '#BBF7D0', '#BFDBFE', '#FBCFE8', '#E9D5FF'];
    const index = this.partners().length % colors.length;
    return colors[index];
  }
}
