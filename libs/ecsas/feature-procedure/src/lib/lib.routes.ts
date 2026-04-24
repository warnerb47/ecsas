import { Route } from '@angular/router';
import { ProcedureListComponent } from './procedure-list/procedure-list.component';
import { DetailProcedureComponent } from './pages/detail-procedure/detail-procedure.component';
import { NewProcedureComponent } from './pages/new-procedure/new-procedure.component';
import { NewApplicationComponent } from './pages/new-application/new-application.component';

export const featureProcedureRoutes: Route[] = [
  { path: '', component: ProcedureListComponent, pathMatch: 'full' },
  { path: 'detail/:id', component: DetailProcedureComponent },
  { path: 'new-procedure', component: NewProcedureComponent },
  { path: 'new-application', component: NewApplicationComponent },
];
