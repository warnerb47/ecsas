export interface Procedure {
  id: string;
  name: string;
  description: string;
  icon: string;
  applicationCount?: number;
  documents?: Partial<ProcedureDocument>[];
  deleted?: boolean;
}


export interface ProcedureDocument {
  id: string;
  name: string;
  required: boolean;
  procedureId?: string;
}
