import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  TopbarComponent,
  TabsComponent,
  ProcedureCardComponent,
  BreadcrumbItem,
  ButtonComponent,
} from '@org/ecsas/shared-ui';
import { Procedure, ProcedureType } from '@org/models';
import { ProcedureGateway } from '@org/ecsas/ecsas-data';
import { Subject, takeUntil } from 'rxjs';
import { DialogService } from 'primeng/dynamicdialog';
import { ProcedureTypeListComponent } from './procedure-type-list/procedure-type-list.component';

@Component({
  selector: 'lib-procedure-list-component',
  imports: [
    RouterLink,
    TopbarComponent,
    TabsComponent,
    ProcedureCardComponent,
    ButtonComponent,
  ],
  providers: [DialogService],
  templateUrl: './procedure-list.component.html',
})
export class ProcedureListComponent implements OnInit, OnDestroy {
  private readonly _router = inject(Router);
  private readonly _procedureGateway = inject(ProcedureGateway);
  private readonly _dialogService = inject(DialogService);
  tabs = signal<string[]>([]);
  activeTab = signal('Touts');
  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Accueil', route: '/' },
    { label: 'Procédures', route: '/procedure' },
  ];

  procedures = signal<Partial<Procedure>[]>([]);
  filteredProcedures = signal<Partial<Procedure>[]>([]);
  loadingProcudres = signal(false);

  procedureTypes = signal<Partial<ProcedureType>[]>([]);
  loadingProcudreTypes = signal(false);
  unsubscribe = new Subject<void>();

  ngOnInit(): void {
    this.initState();
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  async initState() {
    this.fetchProcedureTypes();
    this.fetchProcedures();
  }

  async fetchProcedures() {
    try {
      this.loadingProcudres.set(true);
      const procedures = await this._procedureGateway.getProcedures();
      this.procedures.set(procedures);
      this.filteredProcedures.set(procedures);
    } catch (error) {
      console.error(error);
    } finally {
      this.loadingProcudres.set(false);
    }
  }

  async fetchProcedureTypes() {
    try {
      this.loadingProcudreTypes.set(true);
      const procedureTypes = await this._procedureGateway.getProcedureTypes();
      this.procedureTypes.set(procedureTypes);
      const tabs: string[] = ['Touts'];
      procedureTypes.forEach((type) => {
        if (type.label) {
          tabs.push(type.label);
        }
      });
      this.tabs.set(tabs);
      this.activeTab.set(tabs[0]);
    } catch (error) {
      console.error(error);
    } finally {
      this.loadingProcudreTypes.set(false);
    }
  }

  onTabChange(tab: string) {
    this.activeTab.set(tab);
    const procedureType = this.procedureTypes().find(
      (type) => type.label === tab,
    );
    if (procedureType) {
      this.filterByProcedureType(procedureType);
    } else {
      this.filteredProcedures.set(this.procedures());
    }
  }

  filterByProcedureType(procedureType: Partial<ProcedureType>) {
    this.filteredProcedures.set(
      this.procedures().filter((procedure) => {
        return procedure.type?.id === procedureType.id;
      }),
    );
  }

  onProcedureSelected(procedure: Partial<Procedure>) {
    this._router.navigate(['/procedure/detail', procedure.id]);
  }

  openProcedureTypes() {
    this._dialogService
      .open(ProcedureTypeListComponent, {
        header: 'Types de procédure',
        width: '40vw',
        height: '70vh',
        focusOnShow: false,
        closable: true,
        closeOnEscape: true,
      })
      ?.onClose.pipe(takeUntil(this.unsubscribe))
      .subscribe(() => {
        this.fetchProcedureTypes();
      });
  }
}
