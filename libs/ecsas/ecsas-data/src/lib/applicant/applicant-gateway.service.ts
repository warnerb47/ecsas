import { Injectable } from '@angular/core';
import { ApplicantRepository } from '@org/api/products';

@Injectable({
  providedIn: 'root',
})
export class ApplicantGateway {
  private readonly _applicantRepository = new ApplicantRepository();

  searchApplicant(query: string) {
    return this._applicantRepository.searchApplicant(query);
  }
}
