import { Source } from "./source.model";

export interface Applicant {
  id: string;
  fullName: string;
  nin: string;
  phoneNumber: string;
  address: string;
  status: 'SOCIAL_CASE' | 'NON_ESSENTIAL' | 'RECENTLY_SUPPORTED' | 'INAPPROPRIATE_AGE' | 'DEFAULT';
  sources: Partial<Source>[];
}

export interface ApplicantPayload {
  fullName: string;
  nin: string;
  phoneNumber: string;
  address: string;
  status: 'SOCIAL_CASE' | 'NON_ESSENTIAL' | 'RECENTLY_SUPPORTED' | 'INAPPROPRIATE_AGE' | 'DEFAULT';
  source: File | null;
}
