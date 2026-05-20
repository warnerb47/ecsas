export interface Procedure {
  id: string;
  name: string;
  description: string;
  begin: string;
  end: string;
  status: 'IN_PROGRESS' | 'COMPLETED';
  type: 'MEDICAL' | 'TABASKI' | 'LAYENNES' | 'PAQUE';
  applicationCount?: number;
}
