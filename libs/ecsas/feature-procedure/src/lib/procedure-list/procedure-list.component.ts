import { Component, inject, OnInit, signal } from '@angular/core';
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

@Component({
  selector: 'lib-procedure-list-component',
  imports: [
    RouterLink,
    TopbarComponent,
    TabsComponent,
    ProcedureCardComponent,
    ButtonComponent,
  ],
  templateUrl: './procedure-list.component.html',
})
export class ProcedureListComponent implements OnInit {
  private readonly _router = inject(Router);
  private readonly _procedureGateway = inject(ProcedureGateway);
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

  ngOnInit(): void {
    this.initState();
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
    const procedureType = this.procedureTypes().find((type) => type.label === tab);
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
      })
    );

  }

  onProcedureSelected(procedure: Partial<Procedure>) {
    this._router.navigate(['/procedure/detail', procedure.id]);
  }
}
