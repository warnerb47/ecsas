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
  status: ApplicationStatus | null | null;
  state: ApplicationState | null;
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
