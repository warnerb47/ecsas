import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';

export interface StatCard {
  label: string;
  value: string;
  iconClass: string;
  iconBgColor: string;
  iconTextColor: string;
}

@Component({
  selector: 'lib-application-statistics-card',
  standalone: true,
  imports: [NgClass],
  templateUrl: './application-statistics-card.component.html',
})
export class ApplicationStatisticsCardComponent {
  @Input() card!: StatCard;
}
