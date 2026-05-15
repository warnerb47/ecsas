export interface Procedure {
  id: string;
  name: string;
  description: string;
  begin: Date | null;
  end: Date | null;
  status: 'IN_PROGRESS' | 'COMPLETED';
  type: 'MEDICAL' | 'TABASKI' | 'LAYENNES' | 'PAQUE';
  applicationCount?: number;
}
