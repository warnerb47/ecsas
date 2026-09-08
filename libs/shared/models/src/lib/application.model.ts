import { Applicant, ApplicantStatus } from './applicant.model';
import { Procedure, ProcedureDocument } from './procedure.model';
import { Source } from './source.model';

export interface Application {
  id: string;
  applicant: Partial<Applicant>;
  sources: Partial<Source>[];
  procedure: Partial<Procedure>;
  mailRef: string;
  createdAt: string;
  status: ApplicationStatus;
  state: ApplicationState;
  requestedAmount: number;
  receivedAmount: number;
  comment?: string;
}

export interface ApplicationPayload {
  id?: string;
  applicant: string;
  sources: ApplicationDocument[];
  procedure: string;
  mailRef: string;
  status: ApplicationStatus | null;
  state: ApplicationState | null;
  requestedAmount: number | null;
  receivedAmount: number | null;
  comment: string;
}

export interface ApplicationDocument {
  document: Partial<ProcedureDocument>;
  file: File;
}

export type ApplicationState =
  | 'COMPLIANT'
  | 'OUT_OF_ZONE'
  | 'INCOMPLETE'
  | 'MAYOR_REQUEST';

export type ApplicationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface ApplicationFilters {
  procedureId: string | null;
  status: ApplicationStatus[] | null;
  state: ApplicationState[] | null;
  fullName: string | null;
  nin: string | null;
  phoneNumber: string | null;
  requestedAmount: number | null;
  receivedAmount: number | null;
  createdAtFrom: string | null; // ISO date string
  createdAtTo: string | null; // ISO date string
  page: number; // 1-based page number
  pageSize: number ; // Items per page
  address: string | null;
  applicantStatus: ApplicantStatus | null;
  mailRef: string | null;
}

export interface ApplicationStatistics {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

export interface ApplicationImportRow {
  index: number;
  lastName: string;
  firstName: string;
  birthdate: string | null; // ISO yyyy-MM-dd
  nin: string;
  address: string;
  phoneNumber: string;
  mailRef: string;
}

export interface ApplicationImportResult {
  total: number;
  applicantsCreated: number;
  applicationsCreated: number;
  failed: number;
}

export type ApplicationImportIssueType = 'error' | 'warning' | 'info';

export interface ApplicationImportIssue {
  type: ApplicationImportIssueType;
  message: string;
}

export interface ApplicationImportPreviewRow {
  row: ApplicationImportRow;
  selected: boolean;
  existingApplicant: boolean;
  safe: boolean;
  issues: ApplicationImportIssue[];
}

export type ExcelImportRowKey = keyof Omit<ApplicationImportRow, 'index'>;

/** Maps each application attribute to a zero-based excel column index, or 'ignore' (null). */
export type ExcelColumnMapping = Partial<
  Record<ExcelImportRowKey, number | null>
>;

export interface ExcelColumnInfo {
  name: string;
  sampleValues: string[];
}

export interface ExcelFileStructure {
  columns: ExcelColumnInfo[];
  detectedMapping: ExcelColumnMapping;
}
