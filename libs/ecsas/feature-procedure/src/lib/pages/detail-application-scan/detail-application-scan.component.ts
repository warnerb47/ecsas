import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbItem, TopbarComponent } from '@org/ecsas/shared-ui';
import { map } from 'rxjs';

@Component({
  selector: 'lib-detail-application-scan',
  standalone: true,
  imports: [TopbarComponent],
  templateUrl: './detail-application-scan.component.html',
})
export class DetailApplicationScanComponent {

  private readonly _activatedRoute = inject(ActivatedRoute);

  procedureId = toSignal(
    this._activatedRoute.paramMap.pipe(map((p) => p.get('procedureId'))),
    { initialValue: null },
  );

  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Procédures', route: '/procedure' },
    { label: 'Détail', route: `/procedure/detail/${this.procedureId()}` },
    { label: 'Nouvelle demande', route: '.' },
  ];
}
