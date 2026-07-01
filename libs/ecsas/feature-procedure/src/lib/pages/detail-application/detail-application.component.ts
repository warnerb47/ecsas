import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  BreadcrumbItem,
  TopbarComponent,
  DropdownComponent,
  ButtonComponent,
  TextAreaComponent,
} from '@org/ecsas/shared-ui';
import { map } from 'rxjs';

@Component({
  selector: 'lib-detail-application-component',
  imports: [
    RouterLink,
    TopbarComponent,
    DropdownComponent,
    ButtonComponent,
    TextAreaComponent,
  ],
  templateUrl: './detail-application.component.html',
})
export class DetailApplicationComponent {
  private readonly _activatedRoute = inject(ActivatedRoute);
  procedureId = toSignal(
    this._activatedRoute.paramMap.pipe(map((p) => p.get('procedureId'))),
    { initialValue: null },
  );
  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Procédures', route: '/procedure' },
    {
      label: 'Détail procedure',
      route: `/procedure/detail/${this.procedureId()}`,
    },
    { label: 'Détail demande', route: '/procedure/detail-application' },
  ];

  statuts = [
    { label: 'En cours', value: 'en_cours' },
    { label: 'Acceptée', value: 'acceptee' },
    { label: 'Refusée', value: 'refusee' },
  ];

  conformities = [
    { label: 'En cours de validation', value: 'en_cours' },
    { label: 'Hors zone', value: 'hors_zone' },
    { label: 'Dossier incomplet', value: 'incomplete' },
    { label: 'Demande du Maire', value: 'maire_request' },
  ];
}
