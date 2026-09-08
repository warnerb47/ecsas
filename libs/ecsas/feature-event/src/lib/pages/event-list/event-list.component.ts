import { formatDate, NgClass } from '@angular/common';
import {
  Component,
  computed,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  BreadcrumbItem,
  ButtonComponent,
  TopbarComponent,
} from '@org/ecsas/shared-ui';
import {
  Event,
  EventExcelColumnMapping,
  EventExcelFileStructure,
  EventFilters,
  EventImportPreviewRow,
  EventImportRow,
  EventStats,
  EventStatus,
  EventType,
} from '@org/models';
import {
  EventGateway,
  EventImportService,
} from '@org/ecsas/ecsas-data';
import { EventExcelImportService, ExcelExportService } from '@org/api/products';
import { DialogService } from 'primeng/dynamicdialog';
import { Message } from 'primeng/message';
import { Subject, takeUntil } from 'rxjs';
import { EventCreateDialogComponent } from '../../components/event-create-dialog/event-create-dialog.component';
import { EventColumnMappingComponent } from './event-import/event-column-mapping.component';
import { EventImportPreviewComponent } from './event-import/event-import-preview.component';

@Component({
  selector: 'lib-event-list-component',
  imports: [
    RouterLink,
    TopbarComponent,
    ButtonComponent,
    Message,
    NgClass,
  ],
  providers: [DialogService],
  templateUrl: './event-list.component.html',
})
export class EventListComponent implements OnInit, OnDestroy {
  private readonly _eventGateway = inject(EventGateway);
  private readonly _eventImportService = inject(EventImportService);
  private readonly _dialogService = inject(DialogService);
  private readonly _excelExportService = new ExcelExportService();
  private readonly _excelImportService = new EventExcelImportService();
  private readonly _unsubscribe = new Subject<void>();

  @ViewChild('importFileInput', { static: false })
  importFileInput: ElementRef<HTMLInputElement> | undefined;

  importMessage = signal('');
  importMessageSeverity = signal<'success' | 'info' | 'error'>('success');
  importMessageKey = signal(0);

  private setImportMessage(
    message: string,
    severity: 'success' | 'info' | 'error' = 'success',
  ) {
    this.importMessage.set(message);
    this.importMessageSeverity.set(severity);
    this.importMessageKey.update((key) => key + 1);
  }

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

  stats = signal<EventStats | null>(null);

  statCards = computed(() => [
    {
      label: "Total d'événements",
      value: this.stats()?.total ?? 0,
      color: 'text-[#1A365D]',
      icon: 'pi pi-calendar text-sm text-slate-300',
    },
    {
      label: 'Planifiés',
      value: this.stats()?.planned ?? 0,
      color: 'text-blue-600',
      icon: 'pi pi-clock text-sm text-slate-300',
    },
    {
      label: 'En cours',
      value: this.stats()?.inProgress ?? 0,
      color: 'text-emerald-600',
      icon: 'pi pi-spinner text-sm text-slate-300',
    },
    {
      label: 'Terminés',
      value: this.stats()?.completed ?? 0,
      color: 'text-violet-600',
      icon: 'pi pi-check text-sm text-slate-300',
    },
    {
      label: 'Annulés',
      value: this.stats()?.cancelled ?? 0,
      color: 'text-red-600',
      icon: 'pi pi-times text-sm text-slate-300',
    },
  ]);

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
      this.stats.set(stats);
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
    return status
      ? (map[status] ?? 'bg-blue-50 text-blue-700 border-blue-100')
      : 'bg-blue-50 text-blue-700 border-blue-100';
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

  export() {
    const data = this.events().map((event, index) => ({
      'N°': index + 1,
      Nom: event.name ?? '',
      Type: this.getTypeLabel(event.type),
      Statut: this.getStatusLabel(event.status),
      Lieu: event.location ?? '',
      'Date de début': event.startDate
        ? formatDate(event.startDate, 'dd/MM/yyyy', 'fr-FR')
        : '',
      'Date de fin': event.endDate
        ? formatDate(event.endDate, 'dd/MM/yyyy', 'fr-FR')
        : '',
      'Heure début': event.startTime ?? '',
      'Heure fin': event.endTime ?? '',
      'Participants attendus': event.expectedParticipants ?? '',
      'Budget (FCFA)': event.budget ?? '',
      'Dépenses (FCFA)': event.spent ?? '',
      Description: event.description ?? '',
    }));
    this._excelExportService.exportToExcel(data, 'liste_des_evenements');
  }

  openImportDialog() {
    this.importFileInput?.nativeElement.click();
  }

  async onImportFileSelected(event: globalThis.Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (!file) {
      return;
    }
    try {
      this.loading.set(true);
      const structure = await this._excelImportService.inspectFile(file);
      this.openColumnMapping(structure, file);
    } catch (error) {
      console.error(error);
      this.loading.set(false);
      this.setImportMessage(
        "Impossible de lire le fichier. Vérifiez qu'il s'agit d'un fichier .csv ou .xlsx.",
        'error',
      );
    }
  }

  private openColumnMapping(structure: EventExcelFileStructure, file: File) {
    this._dialogService
      .open(EventColumnMappingComponent, {
        header: 'Correspondance des colonnes (Excel)',
        width: '70vw',
        focusOnShow: false,
        closable: true,
        closeOnEscape: true,
        maximizable: true,
        data: {
          columns: structure.columns,
          detectedMapping: structure.detectedMapping,
        },
      })
      ?.onClose.pipe(takeUntil(this._unsubscribe))
      .subscribe(async (mapping: EventExcelColumnMapping | undefined) => {
        if (!mapping) {
          this.loading.set(false);
          return;
        }
        try {
          const rows = await this._excelImportService.parseEventsFile(
            file,
            mapping,
          );
          if (!rows.length) {
            this.loading.set(false);
            this.setImportMessage(
              'Aucune ligne à importer dans le fichier.',
              'info',
            );
            return;
          }
          const previewRows =
            await this._eventImportService.previewEvents(rows);
          this.loading.set(false);
          this.openImportPreview(previewRows);
        } catch (error) {
          console.error(error);
          this.loading.set(false);
          this.setImportMessage(
            "L'import a échoué. Vérifiez la correspondance des colonnes.",
            'error',
          );
        }
      });
  }

  private openImportPreview(previewRows: EventImportPreviewRow[]) {
    this._dialogService
      .open(EventImportPreviewComponent, {
        header: "Aperçu de l'import (Excel)",
        width: '90vw',
        height: '85vh',
        focusOnShow: false,
        closable: true,
        closeOnEscape: true,
        maximizable: true,
        data: { rows: previewRows },
      })
      ?.onClose.pipe(takeUntil(this._unsubscribe))
      .subscribe(async (selectedRows: EventImportRow[] | undefined) => {
        if (!selectedRows?.length) {
          return;
        }
        this.loading.set(true);
        try {
          const result = await this._eventImportService.importEvents(
            selectedRows,
          );
          this.setImportMessage(
            `Import terminé : ${result.eventsCreated} événement(s) créé(s)` +
              (result.failed ? `, ${result.failed} échec(s).` : '.'),
          );
          this.fetchEvents();
        } catch (error) {
          console.error(error);
          this.setImportMessage(
            "L'import a échoué pendant l'enregistrement des événements.",
            'error',
          );
        } finally {
          this.loading.set(false);
        }
      });
  }

  getTypeIcon(type: EventType | undefined): string {
    const map: Record<string, string> = {
      SOCIAL_CARE: 'pi pi-heart',
      HEALTH: 'pi pi-heart',
      MEETING: 'pi pi-users',
      CEREMONY: 'pi pi-gift',
      COMMUNITY: 'pi pi-star',
    };
    return type ? (map[type] ?? 'pi pi-calendar') : 'pi pi-calendar';
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
