import { Component, inject, signal } from '@angular/core';
import { ButtonComponent } from '@org/ecsas/shared-ui';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import {
  EventExcelColumnMapping,
  EventImportRowKey,
  ExcelColumnInfo,
} from '@org/models';

interface EventAttributeOption {
  key: EventImportRowKey;
  label: string;
}

interface EventColumnMappingData {
  columns: ExcelColumnInfo[];
  detectedMapping: EventExcelColumnMapping;
}

const ATTRIBUTES: EventAttributeOption[] = [
  { key: 'name', label: 'Nom' },
  { key: 'type', label: 'Type' },
  { key: 'status', label: 'Statut' },
  { key: 'location', label: 'Lieu' },
  { key: 'startDate', label: 'Date de début' },
  { key: 'endDate', label: 'Date de fin' },
  { key: 'startTime', label: 'Heure début' },
  { key: 'endTime', label: 'Heure fin' },
  { key: 'expectedParticipants', label: 'Participants attendus' },
  { key: 'budget', label: 'Budget (FCFA)' },
  { key: 'description', label: 'Description' },
];

@Component({
  selector: 'lib-event-column-mapping',
  imports: [ButtonComponent],
  templateUrl: './event-column-mapping.component.html',
})
export class EventColumnMappingComponent {
  private readonly _dialogRef = inject(DynamicDialogRef);
  private readonly _dialogConfig =
    inject(DynamicDialogConfig<EventColumnMappingData>);

  columns: ExcelColumnInfo[] = this._dialogConfig.data?.columns ?? [];
  attributes = ATTRIBUTES;

  mapping = signal<EventExcelColumnMapping>(
    this._dialogConfig.data?.detectedMapping ?? {},
  );

  optionLabel(index: number): string {
    const name = this.columns[index]?.name;
    return name ? `${name} (colonne ${index + 1})` : `Colonne ${index + 1}`;
  }

  selectedValue(key: EventImportRowKey): string {
    const value = this.mapping()[key];
    return typeof value === 'number' && value >= 0 ? String(value) : '';
  }

  setMapping(key: EventImportRowKey, rawIndex: string) {
    this.mapping.update((mapping) => ({
      ...mapping,
      [key]: rawIndex === '' ? null : Number(rawIndex),
    }));
  }

  sampleFor(key: EventImportRowKey): string[] {
    const value = this.mapping()[key];
    if (typeof value !== 'number' || value < 0) {
      return [];
    }
    return this.columns[value]?.sampleValues ?? [];
  }

  confirm() {
    this._dialogRef.close(this.mapping());
  }

  cancel() {
    this._dialogRef.close();
  }
}