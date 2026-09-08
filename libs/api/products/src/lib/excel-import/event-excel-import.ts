import { Workbook } from 'exceljs';
import {
  EventExcelColumnMapping,
  EventExcelFileStructure,
  EventImportRow,
  EventImportRowKey,
  ExcelColumnInfo,
} from '@org/models';

type CellValue = string | number | Date | boolean | null | undefined;

const DATA_ROW_SAMPLE_LIMIT = 5;

const HEADERS: Record<string, EventImportRowKey> = {
  nom: 'name',
  "nom de l'événement": 'name',
  "nom de l'evenement": 'name',
  "nom de l'évènement": 'name',
  'nom evenement': 'name',
  'nom événement': 'name',
  'nom évènement': 'name',
  type: 'type',
  "type d'événement": 'type',
  'type evenement': 'type',
  statut: 'status',
  état: 'status',
  etat: 'status',
  lieu: 'location',
  'date de début': 'startDate',
  'date debut': 'startDate',
  'date evenement': 'startDate',
  'date de fin': 'endDate',
  'date fin': 'endDate',
  'heure début': 'startTime',
  'heure debut': 'startTime',
  'heure de début': 'startTime',
  'heure fin': 'endTime',
  'heure de fin': 'endTime',
  'participants attendus': 'expectedParticipants',
  participants: 'expectedParticipants',
  'nb participants': 'expectedParticipants',
  budget: 'budget',
  description: 'description',
};

export class EventExcelImportService {
  async parseEventsFile(
    file: File,
    mapping?: EventExcelColumnMapping,
  ): Promise<EventImportRow[]> {
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

  async inspectFile(file: File): Promise<EventExcelFileStructure> {
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
    mapping?: EventExcelColumnMapping,
  ): Promise<EventImportRow[]> {
    const workbook = new Workbook();
    await workbook.xlsx.load(
      buffer as Parameters<typeof workbook.xlsx.load>[0],
    );
    const worksheet = workbook.worksheets[0];
    if (!worksheet) {
      return [];
    }
    const rows: EventImportRow[] = [];
    let headers: (EventImportRowKey | null)[] = [];
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

  parseCsv(content: string, mapping?: EventExcelColumnMapping): EventImportRow[] {
    const lines = this.splitCsvLines(content);
    if (!lines.length) {
      return [];
    }
    const headerValues = this.splitCsvLine(lines[0], content);
    const headers = this.mapHeaders(headerValues, mapping);
    const rows: EventImportRow[] = [];
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
    mapping?: EventExcelColumnMapping,
  ): (EventImportRowKey | null)[] {
    if (mapping) {
      return this.buildHeadersFromMapping(mapping, values.length);
    }
    return values.map((value) => {
      const normalized = this.normalize(value);
      return HEADERS[normalized] ?? null;
    });
  }

  private buildHeadersFromMapping(
    mapping: EventExcelColumnMapping,
    columnCount: number,
  ): (EventImportRowKey | null)[] {
    const headers: (EventImportRowKey | null)[] = new Array(columnCount).fill(
      null,
    );
    (
      Object.entries(mapping) as [EventImportRowKey, number | null | undefined][]
    ).forEach(([key, index]) => {
      if (typeof index === 'number' && index >= 0 && index < columnCount) {
        headers[index] = key;
      }
    });
    return headers;
  }

  private autoDetectMapping(columns: string[]): EventExcelColumnMapping {
    const mapping: EventExcelColumnMapping = {};
    columns.forEach((column, index) => {
      const key = HEADERS[this.normalize(column)];
      if (key) {
        mapping[key] = index;
      }
    });
    return mapping;
  }

  async inspectXlsx(buffer: ArrayBuffer): Promise<EventExcelFileStructure> {
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

  inspectCsv(content: string): EventExcelFileStructure {
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
    headers: (EventImportRowKey | null)[],
    index: number,
  ): EventImportRow | null {
    const cell = (key: EventImportRowKey): CellValue => {
      const column = headers.indexOf(key);
      return column >= 0 ? values[column] : undefined;
    };

    const name = this.asString(cell('name'));
    const type = this.asString(cell('type'));
    const status = this.asString(cell('status'));
    const location = this.asString(cell('location'));
    const startDate = this.toIsoDate(cell('startDate'));
    const endDate = this.toIsoDate(cell('endDate'));
    const startTime = this.asString(cell('startTime'));
    const endTime = this.asString(cell('endTime'));
    const expectedParticipants = this.toNumber(cell('expectedParticipants'));
    const budget = this.toNumber(cell('budget'));
    const description = this.asString(cell('description'));

    if (!name && !type && !status && !location) {
      return null;
    }

    return {
      index,
      name,
      type,
      status,
      location,
      startDate,
      endDate,
      startTime,
      endTime,
      expectedParticipants,
      budget,
      description,
    };
  }

  private asString(value: CellValue): string {
    if (value === null || value === undefined) {
      return '';
    }
    return String(value).trim();
  }

  private toNumber(value: CellValue): number | null {
    if (value === null || value === undefined || value === '') {
      return null;
    }
    if (typeof value === 'number') {
      return isFinite(value) ? value : null;
    }
    const text = this.asString(value).replace(/\s/g, '').replace(/,/g, '.');
    if (!text) {
      return null;
    }
    const parsed = Number.parseFloat(text);
    return Number.isNaN(parsed) ? null : parsed;
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