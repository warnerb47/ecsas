import { Workbook } from 'exceljs';
import {
  ApplicationImportRow,
  ExcelColumnInfo,
  ExcelColumnMapping,
  ExcelFileStructure,
  ExcelImportRowKey,
} from '@org/models';

export type { ExcelImportRowKey } from '@org/models';
export type { ExcelColumnMapping } from '@org/models';
export type { ExcelColumnInfo } from '@org/models';
export type { ExcelFileStructure } from '@org/models';

type CellValue = string | number | Date | boolean | null | undefined;

type RowKey = ExcelImportRowKey;

const DATA_ROW_SAMPLE_LIMIT = 5;

const HEADERS: Record<string, RowKey> = {
  nom: 'lastName',
  prénom: 'firstName',
  prenom: 'firstName',
  'date de naissance': 'birthdate',
  nin: 'nin',
  adresse: 'address',
  telephone: 'phoneNumber',
  'numéro courrier': 'mailRef',
  'numero courrier': 'mailRef',
};

export class ExcelImportService {
  async parseApplicationsFile(
    file: File,
    mapping?: ExcelColumnMapping,
  ): Promise<ApplicationImportRow[]> {
    const fileName = file.name.toLowerCase();
    if (fileName.endsWith('.xlsx')) {
      const buffer = await file.arrayBuffer();
      return this.parseXlsx(buffer, mapping);
    }
    if (fileName.endsWith('.csv')) {
      const content = await this.readText(file);
      return this.parseCsv(content, mapping);
    }
    throw new Error(
      'Format de fichier non supporté. Utilisez un fichier .csv ou .xlsx.',
    );
  }

  async inspectFile(file: File): Promise<ExcelFileStructure> {
    const fileName = file.name.toLowerCase();
    if (fileName.endsWith('.xlsx')) {
      const buffer = await file.arrayBuffer();
      return this.inspectXlsx(buffer);
    }
    if (fileName.endsWith('.csv')) {
      const content = await this.readText(file);
      return this.inspectCsv(content);
    }
    throw new Error(
      'Format de fichier non supporté. Utilisez un fichier .csv ou .xlsx.',
    );
  }

  async parseXlsx(
    buffer: ArrayBuffer,
    mapping?: ExcelColumnMapping,
  ): Promise<ApplicationImportRow[]> {
    const workbook = new Workbook();
    await workbook.xlsx.load(
      buffer as Parameters<typeof workbook.xlsx.load>[0],
    );
    const worksheet = workbook.worksheets[0];
    if (!worksheet) {
      return [];
    }
    const rows: ApplicationImportRow[] = [];
    let headers: (RowKey | null)[] = [];
    worksheet.eachRow((row, rowNumber) => {
      const values: CellValue[] = [];
      row.eachCell({ includeEmpty: true }, (cell) => {
        values.push(cell.value as CellValue);
      });
      if (rowNumber === 1) {
        headers = this.mapHeaders(values, mapping);
        return;
      }
      const mapped = this.mapRow(values, headers, rowNumber - 1);
      if (mapped) {
        rows.push(mapped);
      }
    });
    return rows;
  }

  parseCsv(content: string, mapping?: ExcelColumnMapping): ApplicationImportRow[] {
    const lines = this.splitCsvLines(content);
    if (!lines.length) {
      return [];
    }
    const headerValues = this.splitCsvLine(lines[0], content);
    const headers = this.mapHeaders(headerValues, mapping);
    const rows: ApplicationImportRow[] = [];
    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) {
        continue;
      }
      const mapped = this.mapRow(
        this.splitCsvLine(lines[i], content),
        headers,
        i,
      );
      if (mapped) {
        rows.push(mapped);
      }
    }
    return rows;
  }

  private async readText(file: File): Promise<string> {
    const buffer = await file.arrayBuffer();
    try {
      return new TextDecoder('utf-8', { fatal: true }).decode(buffer);
    } catch {
      return new TextDecoder('windows-1252').decode(buffer);
    }
  }

  private mapHeaders(
    values: CellValue[],
    mapping?: ExcelColumnMapping,
  ): (RowKey | null)[] {
    if (mapping) {
      return this.buildHeadersFromMapping(mapping, values.length);
    }
    return values.map((value) => {
      const normalized = this.normalize(value);
      return HEADERS[normalized] ?? null;
    });
  }

  private buildHeadersFromMapping(
    mapping: ExcelColumnMapping,
    columnCount: number,
  ): (RowKey | null)[] {
    const headers: (RowKey | null)[] = new Array(columnCount).fill(null);
    (Object.entries(mapping) as [RowKey, number | null | undefined][]).forEach(
      ([key, index]) => {
        if (
          typeof index === 'number' &&
          index >= 0 &&
          index < columnCount
        ) {
          headers[index] = key;
        }
      },
    );
    return headers;
  }

  private autoDetectMapping(columns: string[]): ExcelColumnMapping {
    const mapping: ExcelColumnMapping = {};
    columns.forEach((column, index) => {
      const key = HEADERS[this.normalize(column)];
      if (key) {
        mapping[key] = index;
      }
    });
    return mapping;
  }

  async inspectXlsx(buffer: ArrayBuffer): Promise<ExcelFileStructure> {
    const workbook = new Workbook();
    await workbook.xlsx.load(
      buffer as Parameters<typeof workbook.xlsx.load>[0],
    );
    const worksheet = workbook.worksheets[0];
    if (!worksheet) {
      return { columns: [], detectedMapping: {} };
    }
    const columns: string[] = [];
    const dataRows: CellValue[][] = [];
    worksheet.eachRow((row, rowNumber) => {
      const values: CellValue[] = [];
      row.eachCell({ includeEmpty: true }, (cell) => {
        values.push(cell.value as CellValue);
      });
      if (rowNumber === 1) {
        values.forEach((value) => columns.push(this.asString(value)));
      } else {
        dataRows.push(values);
      }
    });
    const sampleRows = dataRows.slice(0, DATA_ROW_SAMPLE_LIMIT);
    const columnInfos: ExcelColumnInfo[] = columns.map((name, index) => ({
      name,
      sampleValues: sampleRows.map((row) => this.asString(row[index])),
    }));
    return {
      columns: columnInfos,
      detectedMapping: this.autoDetectMapping(columns),
    };
  }

  inspectCsv(content: string): ExcelFileStructure {
    const lines = this.splitCsvLines(content);
    if (!lines.length) {
      return { columns: [], detectedMapping: {} };
    }
    const columns = this.splitCsvLine(lines[0], content).map((value) =>
      this.asString(value),
    );
    const dataRows = lines
      .slice(1)
      .filter((line) => line.trim())
      .slice(0, DATA_ROW_SAMPLE_LIMIT)
      .map((line) => this.splitCsvLine(line, content));
    const columnInfos: ExcelColumnInfo[] = columns.map((name, index) => ({
      name,
      sampleValues: dataRows.map((row) => this.asString(row[index])),
    }));
    return {
      columns: columnInfos,
      detectedMapping: this.autoDetectMapping(columns),
    };
  }

  private mapRow(
    values: CellValue[],
    headers: (RowKey | null)[],
    index: number,
  ): ApplicationImportRow | null {
    const cell = (key: RowKey): CellValue => {
      const column = headers.indexOf(key);
      return column >= 0 ? values[column] : undefined;
    };

    const lastName = this.asString(cell('lastName'));
    const firstName = this.asString(cell('firstName'));
    const nin = this.asString(cell('nin'));
    const address = this.asString(cell('address'));
    const phoneNumber = this.asString(cell('phoneNumber'));
    const mailRef = this.asString(cell('mailRef'));
    const birthdate = this.toIsoDate(cell('birthdate'));

    if (!lastName && !firstName && !nin && !mailRef) {
      return null;
    }

    return {
      index,
      lastName,
      firstName,
      birthdate,
      nin,
      address,
      phoneNumber,
      mailRef,
    };
  }

  private asString(value: CellValue): string {
    if (value === null || value === undefined) {
      return '';
    }
    return String(value).trim();
  }

  private normalize(value: CellValue): string {
    return this.asString(value)
      .toLowerCase()
      .replace(/^\uFEFF/, '');
  }

  private toIsoDate(value: CellValue): string | null {
    if (value === null || value === undefined) {
      return null;
    }
    if (value instanceof Date && !isNaN(value.getTime())) {
      return this.formatIso(value);
    }
    if (typeof value === 'number' && isFinite(value)) {
      return this.formatIso(this.excelSerialToDate(value));
    }
    const text = this.asString(value);
    if (!text) {
      return null;
    }

    let match = text.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (match) {
      return `${match[3]}-${this.pad(match[2])}-${this.pad(match[1])}`;
    }

    match = text.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
    if (match) {
      return `${match[1]}-${this.pad(match[2])}-${this.pad(match[3])}`;
    }

    const parsed = new Date(text);
    if (!isNaN(parsed.getTime())) {
      return this.formatIso(parsed);
    }
    return null;
  }

  private formatIso(date: Date): string {
    return date.toISOString().slice(0, 10);
  }

  private excelSerialToDate(serial: number): Date {
    const epoch = Date.UTC(1899, 11, 30);
    return new Date(epoch + Math.round(serial) * 86400000);
  }

  private pad(value: string): string {
    return value.length < 2 ? `0${value}` : value;
  }

  private splitCsvLines(content: string): string[] {
    return content
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .split('\n');
  }

  private splitCsvLine(line: string, fullContent: string): string[] {
    const delimiter = this.detectDelimiter(fullContent);
    const fields: string[] = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (inQuotes) {
        if (char === '"') {
          if (line[i + 1] === '"') {
            current += '"';
            i++;
          } else {
            inQuotes = false;
          }
        } else {
          current += char;
        }
      } else if (char === '"') {
        inQuotes = true;
      } else if (char === delimiter) {
        fields.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    fields.push(current);
    return fields;
  }

  private detectDelimiter(content: string): string {
    const firstLineEnd = content.indexOf('\n');
    const firstLine =
      firstLineEnd === -1 ? content : content.slice(0, firstLineEnd);
    const counts: Record<string, number> = {};
    for (const char of firstLine) {
      if (char === ';' || char === ',' || char === '\t') {
        counts[char] = (counts[char] ?? 0) + 1;
      }
    }
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    return sorted.length ? sorted[0][0] : ';';
  }
}