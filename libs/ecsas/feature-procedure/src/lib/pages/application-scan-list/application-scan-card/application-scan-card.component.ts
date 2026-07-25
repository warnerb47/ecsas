import { Component, inject } from '@angular/core';
import { ButtonComponent } from '@org/ecsas/shared-ui';
import { ActivatedRoute, RouterLink } from "@angular/router";
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Component({
  selector: 'lib-application-scan-card',
  standalone: true,
  imports: [ButtonComponent, RouterLink],
  templateUrl: './application-scan-card.component.html',
})
export class ApplicationScanCardComponent {
  private readonly _activatedRoute = inject(ActivatedRoute);
  procedureId = toSignal(
    this._activatedRoute.paramMap.pipe(map((p) => p.get('procedureId'))),
    { initialValue: null },
  );

}
