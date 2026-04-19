import { Component } from '@angular/core';
import { PendingProcedureCardComponent } from './pending-procedure-card/pending-procedure-card.component';

@Component({
  selector: 'lib-pending-procedure',
  imports: [PendingProcedureCardComponent],
  templateUrl: './pending-procedure.component.html',
})
export class PendingProcedureComponent {}
