import { Source } from './source.model';
import { ExcelColumnInfo } from './application.model';

export type EventType =
  | 'SOCIAL_CARE'
  | 'HEALTH'
  | 'MEETING'
  | 'CEREMONY'
  | 'COMMUNITY';

export type EventStatus = 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export type EventDocumentType =
  | 'INVITATION_LETTER'
  | 'SPONSORSHIP_LETTER'
  | 'BUDGET'
  | 'ATTENDANCE_SHEET'
  | 'EVENT_REPORT';

export type EventDocumentStatus = 'GENERATED' | 'UPLOADED' | 'MISSING';

export interface EventUsefulLink {
  id: string;
  eventId?: string;
  label: string;
  url: string;
}

export interface EventPartner {
  id: string;
  eventId?: string;
  name: string;
  role: string;
  contact?: string;
  color?: string;
}

export interface EventExpense {
  id: string;
  eventId?: string;
  label: string;
  category: string;
  planned: number;
  spent: number;
  date: string;
}

export interface EventDocument {
  id: string;
  type: EventDocumentType;
  status: EventDocumentStatus;
  fileName?: string;
  source?: Partial<Source>;
}

export interface Event {
  id: string;
  name: string;
  type: EventType;
  status: EventStatus;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  location: string;
  expectedParticipants: number;
  description?: string;
  budget: number;
  procedureId?: string;
  usefulLinks?: Partial<EventUsefulLink>[];
  partners?: Partial<EventPartner>[];
  expenses?: Partial<EventExpense>[];
  documents?: Partial<EventDocument>[];
  createdAt?: string;
  updatedAt?: string;
  spent?: number;
}

export interface EventPayload {
  id?: string;
  name: string;
  type: EventType;
  status: EventStatus;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  location: string;
  expectedParticipants: number | null;
  description: string;
  budget: number | null;
  procedureId?: string | null;
}

export interface EventFilters {
  name: string | null;
  type: EventType | null;
  status: EventStatus | null;
  dateFrom: string | null;
  dateTo: string | null;
  page: number;
  pageSize: number;
}

export interface EventStats {
  total: number;
  planned: number;
  inProgress: number;
  completed: number;
  cancelled: number;
}

export interface EventImportRow {
  index: number;
  name: string;
  type: string;
  status: string;
  location: string;
  startDate: string | null; // ISO yyyy-MM-dd
  endDate: string | null; // ISO yyyy-MM-dd
  startTime: string;
  endTime: string;
  expectedParticipants: number | null;
  budget: number | null;
  description: string;
}

export type EventImportRowKey = keyof Omit<EventImportRow, 'index'>;

/** Maps each event attribute to a zero-based excel column index, or 'ignore' (null). */
export type EventExcelColumnMapping = Partial<
  Record<EventImportRowKey, number | null>
>;

export interface EventExcelFileStructure {
  columns: ExcelColumnInfo[];
  detectedMapping: EventExcelColumnMapping;
}

export type EventImportIssueType = 'error' | 'warning' | 'info';

export interface EventImportIssue {
  type: EventImportIssueType;
  message: string;
}

export interface EventImportPreviewRow {
  row: EventImportRow;
  selected: boolean;
  existing: boolean;
  safe: boolean;
  issues: EventImportIssue[];
}

export interface EventImportResult {
  total: number;
  eventsCreated: number;
  failed: number;
}
