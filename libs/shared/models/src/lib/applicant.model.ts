import { Source } from "./source.model";

export interface Applicant {
  id: string;
  fullName: string;
  nin: string;
  phoneNumber: string;
  address: string;
  status: ApplicantStatus;
  sources: Partial<Source>[];
}

export interface ApplicantPayload {
  id?: string;
  fullName: string;
  nin: string;
  phoneNumber: string;
  address: string;
  status: ApplicantStatus;
  source: File | null;
}

export type ApplicantStatus = 'SOCIAL_CASE' | 'NON_ESSENTIAL' | 'RECENTLY_SUPPORTED' | 'INAPPROPRIATE_AGE' | 'DEFAULT';
