import { Injectable } from '@angular/core';
import { ProcedureRepository } from '@org/api/products';
import { ProcedureDocument, ProcedurePayload } from '@org/models';

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

  getProcedureTypes() {
    return this._procedureRepository.getProcedureTypes();
  }

  updateProcedure(payload: ProcedurePayload) {
    return this._procedureRepository.updateProcedure(payload);
  }

  createProcedureWithDocuments(payload: ProcedurePayload) {
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
