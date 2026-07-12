import { Injectable } from '@angular/core';
import { ProcedureRepository } from '@org/api/products';
import { Procedure, ProcedureDocument } from '@org/models';

@Injectable({
  providedIn: 'root',
})
export class ProcedureGateway {
  private readonly _procedureRepository = new ProcedureRepository();

  getProcedures() {
    return this._procedureRepository.getProcedures();
  }

  getProcedureById(procedureId: string) {
    return this._procedureRepository.getProcedureById(procedureId);
  }

  updateProcedure(payload: Procedure) {
    return this._procedureRepository.updateProcedure(payload);
  }

  createProcedureWithDocuments(payload: Procedure) {
    return this._procedureRepository.createProcedureWithDocuments(payload);
  }

  createProcedureDocument(payload: ProcedureDocument) {
    return this._procedureRepository.createProcedureDocument(payload);
  }

  updateProcedureDocument(payload: ProcedureDocument) {
    return this._procedureRepository.updateProcedureDocument(payload);
  }

  deleteProcedureDocument(payload: {procedureId: string; documentId: string}) {
    return this._procedureRepository.deleteProcedureDocument(payload);
  }
}
