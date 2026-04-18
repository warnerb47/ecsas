import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('@org/ecsas/feature-dashboard').then(m => m.featureDashboardRoutes),
  },
  {
    path: 'procedure',
    loadChildren: () =>
      import('@org/ecsas/feature-procedure').then(m => m.featureProcedureRoutes),
  },
  {
    path: 'setting',
    loadChildren: () =>
      import('@org/ecsas/feature-setting').then(m => m.featureSettingRoutes),
  },
];
