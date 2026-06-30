import { Injectable } from '@angular/core';
import { ProcedureRepository } from '@org/api/products';

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
}
