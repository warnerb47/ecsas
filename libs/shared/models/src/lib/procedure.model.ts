export interface Procedure {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: ProcedureStatus;
  type?: Partial<ProcedureType>;
  applicationCount?: number;
  documents?: Partial<ProcedureDocument>[];
}

export type ProcedureStatus = 'IN_PROGRESS' | 'COMPLETED';

export interface ProcedureDocument {
  id: string;
  name: string;
  required: boolean;
  procedureId?: string;
}

export interface ProcedureType {
  id: string;
  label: string;
  value: string;
  color: string;
  icon: string;
  isEditing?: boolean;
}

export interface ProcedurePayload {
  id?: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: ProcedureStatus;
  type: string;
  applicationCount?: number;
  documents?: Partial<ProcedureDocument>[];
}
