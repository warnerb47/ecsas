import { Route } from '@angular/router';
import { ProcedureListComponent } from './procedure-list/procedure-list.component';
import { DetailProcedureComponent } from './pages/detail-procedure/detail-procedure.component';
import { NewProcedureComponent } from './pages/new-procedure/new-procedure.component';
import { NewApplicationComponent } from './pages/new-application/new-application.component';
import { DetailApplicationComponent } from './pages/detail-application/detail-application.component';
import { UpdateProcedureComponent } from './pages/update-procedure/update-procedure.component';
import { ApplicationScanListComponent } from './pages/application-scan-list/application-scan-list.component';
import { DetailApplicationScanComponent } from './pages/detail-application-scan/detail-application-scan.component';
import { CreateApplicationScanComponent } from './pages/create-application-scan/create-application-scan.component';

export const featureProcedureRoutes: Route[] = [
  { path: '', component: ProcedureListComponent, pathMatch: 'full' },
  { path: 'detail/:procedureId', component: DetailProcedureComponent },
  { path: 'detail/:procedureId/update', component: UpdateProcedureComponent },
  { path: 'new-procedure', component: NewProcedureComponent },
  { path: 'detail/:procedureId/new-application', component: NewApplicationComponent },
  { path: 'detail/:procedureId/application-scan-list', component: ApplicationScanListComponent },
  { path: 'detail/:procedureId/application-scan-list/detail/:applicationScanId', component: DetailApplicationScanComponent },
  { path: 'detail/:procedureId/application-scan-list/create', component: CreateApplicationScanComponent },
  { path: 'detail/:procedureId/detail-application/:applicationId', component: DetailApplicationComponent },
];
