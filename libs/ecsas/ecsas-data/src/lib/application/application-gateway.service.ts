import { Injectable } from '@angular/core';
import { ApplicationRepository } from '@org/api/products';

@Injectable({
  providedIn: 'root',
})
export class ApplicationGateway {
  private readonly _applicationRepository = new ApplicationRepository();

  getApplicationsByProcedureId(procedureId: string) {
    return this._applicationRepository.getApplicationsByProcedureId(procedureId);
  }
}
