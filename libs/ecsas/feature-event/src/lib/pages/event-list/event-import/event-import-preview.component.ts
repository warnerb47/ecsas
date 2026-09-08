import { Component, computed, inject, signal } from '@angular/core';
import { ButtonComponent } from '@org/ecsas/shared-ui';
import {
  EventImportIssue,
  EventImportPreviewRow,
} from '@org/models';
import {
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';

interface EventImportPreviewData {
  rows: EventImportPreviewRow[];
}

@Component({
  selector: 'lib-event-import-preview',
  imports: [ButtonComponent],
  templateUrl: './event-import-preview.component.html',
})
export class EventImportPreviewComponent {
  private readonly _dialogRef = inject(DynamicDialogRef);
  private readonly _dialogConfig =
    inject(DynamicDialogConfig<EventImportPreviewData>);

  rows = signal<EventImportPreviewRow[]>(
    this._dialogConfig.data?.rows ?? [],
  );

  selectedCount = computed(
    () => this.rows().filter((row) => row.selected).length,
  );
  safeCount = computed(() => this.rows().filter((row) => row.safe).length);
  conflictCount = computed(() =>
    this.rows().filter((row) =>
      row.issues.some((issue) => issue.type === 'warning'),
    ).length,
  );
  errorCount = computed(() =>
    this.rows().filter((row) =>
      row.issues.some((issue) => issue.type === 'error'),
    ).length,
  );

  displayDate(iso: string | null): string {
    if (!iso) {
      return '';
    }
    const [year, month, day] = iso.split('-');
    if (!year || !month || !day) {
      return iso;
    }
    return `${day}/${month}/${year}`;
  }

  tagLabel(item: EventImportPreviewRow): string {
    return item.existing ? 'existant' : 'nouveau';
  }

  tagClass(item: EventImportPreviewRow): string {
    return item.existing
      ? 'bg-slate-200 text-slate-600 border-slate-300'
      : 'bg-sky-50 text-sky-700 border-sky-100';
  }

  displayNumber(value: number | null): string {
    if (value === null || value === undefined) {
      return '—';
    }
    return new Intl.NumberFormat('fr-FR').format(value);
  }

  toggle(index: number, checked: boolean) {
    this.rows.update((rows) =>
      rows.map((row, i) => (i === index ? { ...row, selected: checked } : row)),
    );
  }

  toggleAll(checked: boolean) {
    this.rows.update((rows) =>
      rows.map((row) => ({ ...row, selected: checked })),
    );
  }

  issueIconClass(issue: EventImportIssue): string {
    const color =
      issue.type === 'error'
        ? 'text-red-600'
        : issue.type === 'warning'
          ? 'text-amber-600'
          : 'text-sky-600';
    const icon =
      issue.type === 'error'
        ? 'pi-times-circle'
        : issue.type === 'warning'
          ? 'pi-exclamation-triangle'
          : 'pi-info-circle';
    return `pi text-lg ${icon} ${color}`;
  }

  importSelected() {
    this._dialogRef.close(
      this.rows()
        .filter((row) => row.selected)
        .map((row) => row.row),
    );
  }

  cancel() {
    this._dialogRef.close();
  }
}