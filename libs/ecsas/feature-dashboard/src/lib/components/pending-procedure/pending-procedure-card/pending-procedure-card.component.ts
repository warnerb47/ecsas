import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Procedure } from '@org/models';

@Component({
  selector: 'lib-pending-procedure-card',
  imports: [CommonModule],
  templateUrl: './pending-procedure-card.component.html'
})
export class PendingProcedureCardComponent {
  procedure = input.required<Procedure>();
  count = input<number>(0);
  procedureSelected = output<Procedure>();

  icons = signal({
    'MEDICAL': 'pi pi-heart',
    'TABASKI': 'pi pi-calendar',
    'LAYENNES': 'pi pi-users',
    'PAQUE': 'pi pi-gift'
  });

  onProcedureSelected() {
    this.procedureSelected.emit(this.procedure());
  }
}
