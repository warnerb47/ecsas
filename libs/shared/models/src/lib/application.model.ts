import { Applicant } from "./applicant.model";
import { Procedure } from "./procedure.model";
import { Source } from "./source.model";

export interface Application {
  id: string;
  applicant: Partial<Applicant>;
  sources: Partial<Source>[];
  procedure: Partial<Procedure>;
  mailRef: string;
  createdAt: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  state: 'OUT_OF_ZONE' | 'INCOMPLETE' | 'MAYOR_REQUEST';
  amount: number;
}
