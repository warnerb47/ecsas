import { Applicant } from './applicant.model';
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
  amount: number;
}

export interface ApplicationPayload {
  applicant: string;
  sources: ApplicationDocument[];
  procedure: string;
  mailRef: string;
  status: ApplicationStatus;
  state: ApplicationState;
  amount: number | null;
}

export interface ApplicationDocument {
  document: Partial<ProcedureDocument>;
  file: File;
}

export type ApplicationState =
  | 'DEFAULT'
  | 'OUT_OF_ZONE'
  | 'INCOMPLETE'
  | 'MAYOR_REQUEST';

export type ApplicationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
