import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbItem, TopbarComponent } from '@org/ecsas/shared-ui';
import { map } from 'rxjs';
import { ApplicationScanCardComponent } from './application-scan-card/application-scan-card.component';

@Component({
  selector: 'lib-application-scan-list',
  standalone: true,
  imports: [TopbarComponent, ApplicationScanCardComponent],
  templateUrl: './application-scan-list.component.html',
})
export class ApplicationScanListComponent {
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
