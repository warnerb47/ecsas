import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Procedure } from '@org/models';
import { BadgeComponent } from '../../atoms';
import { ButtonComponent } from '../../atoms';

@Component({
  selector: 'lib-procedure-card',
  standalone: true,
  imports: [CommonModule, BadgeComponent, ButtonComponent],
  templateUrl: './procedure-card.component.html'
})
export class ProcedureCardComponent {
  procedure = input.required<Partial<Procedure>>();
  procedureSelected = output<Partial<Procedure>>();

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
