import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

export interface BreadcrumbItem {
  label: string;
  route: string;
}

@Component({
  selector: 'lib-breadcum',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './breadcum.component.html'
})
export class BreadcumComponent {
  items = input.required<BreadcrumbItem[]>();
}
