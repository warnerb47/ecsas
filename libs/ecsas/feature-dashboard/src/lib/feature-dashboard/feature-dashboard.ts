import { Component } from '@angular/core';
import { SidebarComponent } from '@ord/ecsas/shared-ui';

@Component({
  selector: 'lib-feature-dashboard',
  imports: [SidebarComponent],
  templateUrl: './feature-dashboard.html',
  styleUrl: './feature-dashboard.css',
})
export class FeatureDashboard {}
