import { Component, inject, OnInit, signal } from '@angular/core';
import { ButtonComponent } from '@org/ecsas/shared-ui';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import {
  AutoCompleteCompleteEvent,
  AutoCompleteModule,
} from 'primeng/autocomplete';
import { FormsModule } from '@angular/forms';
import { ApplicantGateway } from '@org/ecsas/ecsas-data';
import { Applicant } from '@org/models';

@Component({
  selector: 'lib-search-applicant-component',
  imports: [ButtonComponent, AutoCompleteModule, FormsModule],
  templateUrl: './search-applicant.component.html',
  providers: [DialogService],
})
export class SearchApplicantComponent implements OnInit {
  private readonly _dialogRef = inject(DynamicDialogRef);
  private readonly _applicantGateway = inject(ApplicantGateway);

  items: any[] = [];
  value: any;
  loadingApplicants = signal(false);
  applicants = signal<Partial<Applicant>[]>([]);
  selectedApplicant = signal<Partial<Applicant> | null>(null);

  ngOnInit() {
    this.fetchApplicants();
  }

  async fetchApplicants() {
    try {
      this.loadingApplicants.set(true);
      const applicants = await this._applicantGateway.searchApplicant('Fall');
      this.applicants.set(applicants);
      console.log({ applicants });
    } catch (error) {
      console.error(error);
    } finally {
      this.loadingApplicants.set(false);
    }
  }

  search(event: AutoCompleteCompleteEvent) {
    this.items = [...Array(10).keys()].map((item) => event.query + '-' + item);
  }

  async addDocument() {
    this._dialogRef?.close(this.value);
    console.log('add document');
  }
}
