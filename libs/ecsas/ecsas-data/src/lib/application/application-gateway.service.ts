import { Injectable } from '@angular/core';
import { ApplicationRepository } from '@org/api/products';
import { ApplicationPayload } from '@org/models';

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
}
