export interface Application {
  id: string;
  applicant: string;
  files: string[];
  procedure: string;
  mailRef: string;
  createdAt: Date;
  status: string;
  state: string;
  amount: number;
}
