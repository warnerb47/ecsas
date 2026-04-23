import { Component, input } from '@angular/core';
import { RouterLink } from "@angular/router";
import { ButtonComponent, SearchInputComponent, BreadcumComponent, BreadcrumbItem } from '../atoms';

@Component({
  selector: 'lib-topbar',
  imports: [RouterLink, ButtonComponent, SearchInputComponent, BreadcumComponent],
  templateUrl: './topbar.component.html',
})
export class TopbarComponent {
  breadcrumbItems = input<BreadcrumbItem[] | undefined>();
  searchPlaceholder = input<string>('Rechercher une demande ou un bénéficiaire...');
}
