import { Component, computed, inject, signal } from '@angular/core';
import { ButtonComponent } from '@org/ecsas/shared-ui';
import {
  ApplicationImportIssue,
  ApplicationImportPreviewRow,
} from '@org/models';
import {
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';

interface ApplicationImportPreviewData {
  procedureName?: string;
  rows: ApplicationImportPreviewRow[];
}

@Component({
  selector: 'lib-application-import-preview',
  imports: [ButtonComponent],
  templateUrl: './application-import-preview.component.html',
})
export class ApplicationImportPreviewComponent {
  private readonly _dialogRef = inject(DynamicDialogRef);
  private readonly _dialogConfig =
    inject(DynamicDialogConfig<ApplicationImportPreviewData>);

  procedureName = this._dialogConfig.data?.procedureName ?? '';
  rows = signal<ApplicationImportPreviewRow[]>(
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

  fullName(item: ApplicationImportPreviewRow): string {
    return [item.row.firstName, item.row.lastName].filter(Boolean).join(' ');
  }

  displayBirthdate(iso: string | null): string {
    if (!iso) {
      return '';
    }
    const [year, month, day] = iso.split('-');
    if (!year || !month || !day) {
      return iso;
    }
    return `${day}/${month}/${year}`;
  }

  applicantTagLabel(item: ApplicationImportPreviewRow): string {
    return item.existingApplicant ? 'existant' : 'nouveau';
  }

  applicantTagClass(item: ApplicationImportPreviewRow): string {
    return item.existingApplicant
      ? 'bg-slate-200 text-slate-600 border-slate-300'
      : 'bg-sky-50 text-sky-700 border-sky-100';
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

  issueIconClass(issue: ApplicationImportIssue): string {
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