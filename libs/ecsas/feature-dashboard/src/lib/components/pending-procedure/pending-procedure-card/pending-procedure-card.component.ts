import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Procedure } from '@org/models';
import { BadgeComponent } from '@org/ecsas/shared-ui';
import { ButtonComponent } from '@org/ecsas/shared-ui';

@Component({
  selector: 'lib-pending-procedure-card',
  imports: [CommonModule, BadgeComponent, ButtonComponent],
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
