import { Injectable, signal } from '@angular/core';
import { Procedure } from '@org/models';

@Injectable({
  providedIn: 'root',
})
export class ProcedureStateService {
  procedure = signal<Partial<Procedure> | null>(null);

  reset() {
    this.procedure.set(null);
  }

}
