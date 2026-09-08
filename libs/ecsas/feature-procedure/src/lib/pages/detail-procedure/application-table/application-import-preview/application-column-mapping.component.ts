import { Component, inject, signal } from '@angular/core';
import { ButtonComponent } from '@org/ecsas/shared-ui';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import {
  ExcelColumnInfo,
  ExcelColumnMapping,
  ExcelImportRowKey,
} from '@org/models';

interface AttributeOption {
  key: ExcelImportRowKey;
  label: string;
}

interface ApplicationColumnMappingData {
  columns: ExcelColumnInfo[];
  detectedMapping: ExcelColumnMapping;
}

const ATTRIBUTES: AttributeOption[] = [
  { key: 'lastName', label: 'Nom' },
  { key: 'firstName', label: 'Prénom' },
  { key: 'birthdate', label: 'Date de naissance' },
  { key: 'nin', label: 'NIN' },
  { key: 'address', label: 'Adresse' },
  { key: 'phoneNumber', label: 'Téléphone' },
  { key: 'mailRef', label: 'Numéro courrier' },
];

@Component({
  selector: 'lib-application-column-mapping',
  imports: [ButtonComponent],
  templateUrl: './application-column-mapping.component.html',
})
export class ApplicationColumnMappingComponent {
  private readonly _dialogRef = inject(DynamicDialogRef);
  private readonly _dialogConfig =
    inject(DynamicDialogConfig<ApplicationColumnMappingData>);

  columns: ExcelColumnInfo[] = this._dialogConfig.data?.columns ?? [];
  attributes = ATTRIBUTES;

  mapping = signal<ExcelColumnMapping>(
    this._dialogConfig.data?.detectedMapping ?? {},
  );

  optionLabel(index: number): string {
    const name = this.columns[index]?.name;
    return name ? `${name} (colonne ${index + 1})` : `Colonne ${index + 1}`;
  }

  selectedValue(key: ExcelImportRowKey): string {
    const value = this.mapping()[key];
    return typeof value === 'number' && value >= 0 ? String(value) : '';
  }

  setMapping(key: ExcelImportRowKey, rawIndex: string) {
    this.mapping.update((mapping) => ({
      ...mapping,
      [key]: rawIndex === '' ? null : Number(rawIndex),
    }));
  }

  sampleFor(key: ExcelImportRowKey): string[] {
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
