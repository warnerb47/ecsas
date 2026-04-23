import { Component, input } from '@angular/core';
import { SearchInputComponent, BreadcumComponent, BreadcrumbItem } from '../atoms';

@Component({
  selector: 'lib-topbar',
  imports: [SearchInputComponent, BreadcumComponent],
  templateUrl: './topbar.component.html',
})
export class TopbarComponent {
  breadcrumbItems = input<BreadcrumbItem[] | undefined>();
  searchPlaceholder = input<string>('Rechercher une demande ou un bénéficiaire...');
}
