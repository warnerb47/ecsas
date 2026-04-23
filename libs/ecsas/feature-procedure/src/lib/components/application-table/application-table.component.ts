import { Component } from '@angular/core';
import { ButtonComponent } from '@org/ecsas/shared-ui';

@Component({
  selector: 'lib-application-table',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './application-table.component.html',
})
export class ApplicationTableComponent {
}
