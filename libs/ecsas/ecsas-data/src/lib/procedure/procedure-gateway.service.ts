import { Injectable } from '@angular/core';
import { ProcedureRepository } from '@org/api/products';
import { ProcedurePayload } from '@org/models';

@Injectable({
  providedIn: 'root',
})
export class ProcedureGateway {
  private readonly _procedureRepository = new ProcedureRepository();

  getProcedures() {
    return this._procedureRepository.getProcedures();
  }

  getProcedureTypes() {
    return this._procedureRepository.getProcedureTypes();
  }

  createProcedureWithDocuments(payload: ProcedurePayload) {
    return this._procedureRepository.createProcedureWithDocuments(payload);
  }
}
