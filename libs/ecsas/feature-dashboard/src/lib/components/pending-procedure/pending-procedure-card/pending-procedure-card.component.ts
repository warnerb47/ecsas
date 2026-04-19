import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-pending-procedure-card',
  imports: [CommonModule],
  templateUrl: './pending-procedure-card.component.html'
})
export class PendingProcedureCardComponent {
  @Input() icon: string = '';
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() status: string = '';
  @Input() count: number = 0;
}
