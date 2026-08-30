import { Component, inject, OnInit, signal } from '@angular/core';
import { Procedure } from '@org/models';
import { ProcedureGateway } from '@org/ecsas/ecsas-data';
import {
  ButtonComponent,
  ButtonLinkComponent,
  ProcedureCardComponent,
} from '@org/ecsas/shared-ui';
import { Router, RouterLink } from '@angular/router';
import { firstValueFrom, of, delay } from 'rxjs';

@Component({
  selector: 'lib-pending-procedure',
  imports: [
    RouterLink,
    ButtonLinkComponent,
    ButtonComponent,
    ProcedureCardComponent,
  ],
  templateUrl: './pending-procedure.component.html',
})
export class PendingProcedureComponent implements OnInit {
  private readonly _procedureGateway = inject(ProcedureGateway);
  private readonly _router = inject(Router);

  procedures = signal<Partial<Procedure>[]>([]);
  loading = signal(true);
  error = signal(false);

  ngOnInit() {
    this.fetchRecentProcedures();
  }

  private isMissingTableError(error: unknown): boolean {
    const message =
      error instanceof Error ? error.message : String(error ?? '');
    return message.includes('no such table');
  }

  async fetchRecentProcedures() {
    this.loading.set(true);
    this.error.set(false);
    try {
      const procedures = await this._procedureGateway.getRecentProcedures();
      this.procedures.set(procedures);
    } catch (error) {
      if (this.isMissingTableError(error)) {
        this.procedures.set([]);
        return;
      }
      console.error(error);
      this.error.set(true);
    } finally {
      this.loading.set(false);
    }
  }

  async retry() {
    this.loading.set(true);
    await firstValueFrom(of('wait').pipe(delay(1000)));
    await this.fetchRecentProcedures();
    this.loading.set(false);
  }

  viewProcedure(procedure: Partial<Procedure>) {
    this._router.navigate(['/procedure/detail', procedure.id]);
  }
}
