import { Route } from '@angular/router';
import { ProcedureListComponent } from './procedure-list/procedure-list.component';

export const featureProcedureRoutes: Route[] = [
  { path: '', component: ProcedureListComponent},  
  {
    path: 'detail/:id',
    loadChildren: () =>
      import('./pages/pages.routes').then(m => m.featureProcedurePagesRoutes),
  },
];
