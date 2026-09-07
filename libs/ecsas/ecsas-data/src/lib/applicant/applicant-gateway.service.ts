import { Injectable } from '@angular/core';
import { ApplicantRepository } from '@org/api/products';
import { ApplicantPayload } from '@org/models';

@Injectable({
  providedIn: 'root',
})
export class ApplicantGateway {
  private readonly _applicantRepository = new ApplicantRepository();

  searchApplicant(query: string) {
    return this._applicantRepository.searchApplicant(query);
  }

  getApplicantById(applicantId: string) {
    return this._applicantRepository.getApplicantById(applicantId);
  }

  getApplicantByNin(nin: string) {
    return this._applicantRepository.getApplicantByNin(nin);
  }

  createApplicant(applicant: ApplicantPayload) {
    return this._applicantRepository.createApplicant(applicant);
  }

  createImportApplicant(applicant: ApplicantPayload) {
    return this._applicantRepository.createImportApplicant(applicant);
  }

  updateApplicant(params: { applicant: ApplicantPayload; sourceId: string }) {
    return this._applicantRepository.updateApplicant(params);
  }
}
