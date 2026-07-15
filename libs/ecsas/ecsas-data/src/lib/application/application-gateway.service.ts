import { Injectable } from '@angular/core';
import { ApplicationRepository } from '@org/api/products';
import { ApplicationFilters, ApplicationPayload } from '@org/models';

@Injectable({
  providedIn: 'root',
})
export class ApplicationGateway {
  private readonly _applicationRepository = new ApplicationRepository();

  getApplicationsByProcedureId(procedureId: string) {
    return this._applicationRepository.getApplicationsByProcedureId(
      procedureId,
    );
  }

  createApplication(application: ApplicationPayload) {
    return this._applicationRepository.createApplication(application);
  }

  getApplicationById(applicationId: string) {
    return this._applicationRepository.getApplicationById(applicationId);
  }

  updateApplication(params: {
    applicationId: string;
    application: Partial<ApplicationPayload>;
  }) {
    return this._applicationRepository.updateApplication(params);
  }

  filterApplications(filters: ApplicationFilters) {
    return this._applicationRepository.filterApplications(filters);
  }
}
