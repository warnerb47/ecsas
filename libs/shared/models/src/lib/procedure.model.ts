export interface Procedure {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'IN_PROGRESS' | 'COMPLETED';
  type?: Partial<ProcedureType>;
  applicationCount?: number;
  documents?: ProcedureDocument[];
}

export interface ProcedureDocument {
  name: string;
  required: boolean;
}

export interface ProcedureType {
  id: string;
  label: string;
  value: string;
  color: string;
  icon: string;
}

export interface ProcedurePayload {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'IN_PROGRESS' | 'COMPLETED';
  type: string;
  applicationCount?: number;
  documents?: ProcedureDocument[];
}
