import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  TopbarComponent,
  ProcedureCardComponent,
  BreadcrumbItem,
  ButtonComponent,
} from '@org/ecsas/shared-ui';
import { Procedure } from '@org/models';
import { ProcedureGateway } from '@org/ecsas/ecsas-data';
import { Subject } from 'rxjs';

@Component({
  selector: 'lib-procedure-list-component',
  imports: [
    RouterLink,
    TopbarComponent,
    ProcedureCardComponent,
    ButtonComponent,
  ],
  templateUrl: './procedure-list.component.html',
})
export class ProcedureListComponent implements OnInit, OnDestroy {
  private readonly _router = inject(Router);
  private readonly _procedureGateway = inject(ProcedureGateway);
  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Accueil', route: '/' },
    { label: 'Procédures', route: '/procedure' },
  ];

  procedures = signal<Partial<Procedure>[]>([]);
  loadingProcudres = signal(false);

  unsubscribe = new Subject<void>();

  ngOnInit(): void {
    this.initState();
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  async initState() {
    this.fetchProcedures();
  }

  async fetchProcedures() {
    try {
      this.loadingProcudres.set(true);
      const procedures = await this._procedureGateway.getProcedures();
      this.procedures.set(procedures);
    } catch (error) {
      console.error(error);
    } finally {
      this.loadingProcudres.set(false);
    }
  }

  onProcedureSelected(procedure: Partial<Procedure>) {
    this._router.navigate(['/procedure/detail', procedure.id]);
  }

}
