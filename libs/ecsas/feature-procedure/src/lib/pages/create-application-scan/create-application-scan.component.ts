import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbItem, TopbarComponent } from '@org/ecsas/shared-ui';
import { map, Subject } from 'rxjs';
import { ApplicationScanDocumentComponent } from './application-scan-document/application-scan-document.component';
import { ProcedureGateway } from '@org/ecsas/ecsas-data';
import { form } from '@angular/forms/signals';
import {
  Applicant,
  Procedure,
  ApplicationPayload,
  ApplicationDocument,
} from '@org/models';

@Component({
  selector: 'lib-create-application-scan',
  standalone: true,
  imports: [TopbarComponent, ApplicationScanDocumentComponent],
  templateUrl: './create-application-scan.component.html',
})
export class CreateApplicationScanComponent implements OnInit, OnDestroy {
  private readonly _unsubscribe = new Subject<void>();
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _procedureGateway = inject(ProcedureGateway);

  procedureId = toSignal(
    this._activatedRoute.paramMap.pipe(map((p) => p.get('procedureId'))),
    { initialValue: null },
  );

  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Procédures', route: '/procedure' },
    { label: 'Détail', route: `/procedure/detail/${this.procedureId()}` },
    { label: 'Nouvelle demande', route: '.' },
  ];
  applicant = signal<Partial<Applicant> | null>(null);
  procedure = signal<Partial<Procedure> | null>(null);
  loadingProcedure = signal(false);

  applicationModel = signal<ApplicationPayload>({
    applicant: '',
    procedure: '',
    sources: [] as ApplicationDocument[],
    status: null,
    state: null,
    mailRef: '',
    comment: '',
    receivedAmount: null,
    requestedAmount: null,
  });
  applicationForm = form(this.applicationModel);

  ngOnInit() {
    this.initState();
  }

  ngOnDestroy() {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

  async initState() {
    if (!this.procedureId()) {
      return;
    }
    this.loadingProcedure.set(true);
    await this.fetchProcedureById();
    this.loadingProcedure.set(false);
  }

  async fetchProcedureById() {
    try {
      const procedure = await this._procedureGateway.getProcedureById(
        this.procedureId() ?? '',
      );
      this.procedure.set(procedure);
    } catch (error) {
      console.error(error);
    }
  }
}
