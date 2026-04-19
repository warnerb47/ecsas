import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-statistic-card',
  imports: [CommonModule],
  templateUrl: './statistic-card.component.html'
})
export class StatisticCardComponent {
  @Input() title: string = '';
  @Input() value: string = '';
  @Input() description: string = '';
  @Input() valueColor: string = '';
  @Input() descriptionColor: string = '';
}
