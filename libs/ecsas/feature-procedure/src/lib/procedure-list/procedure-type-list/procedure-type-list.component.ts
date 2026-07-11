import { Component, inject, OnInit, signal } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ProcedureGateway } from '@org/ecsas/ecsas-data';
import { ProcedureType } from '@org/models';

@Component({
  selector: 'lib-procedure-type-list-component',
  imports: [],
  templateUrl: './procedure-type-list.component.html',
  providers: [DialogService],
})
export class ProcedureTypeListComponent implements OnInit {
  private readonly _dialogRef = inject(DynamicDialogRef);
  private readonly _procedureGateway = inject(ProcedureGateway);

  procedureTypes = signal<Partial<ProcedureType>[]>([]);
  loadingProcudreTypes = signal(false);

  ngOnInit() {
    this.fetchProcedureTypes();
  }

  async fetchProcedureTypes() {
    try {
      this.loadingProcudreTypes.set(true);
      const procedureTypes = await this._procedureGateway.getProcedureTypes();
      this.procedureTypes.set(procedureTypes);
    } catch (error) {
      console.error(error);
    } finally {
      this.loadingProcudreTypes.set(false);
    }
  }

}
