import { Component, inject, OnInit, signal } from '@angular/core';
import { ButtonComponent } from '@org/ecsas/shared-ui';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { FormsModule } from '@angular/forms';
import { ApplicantGateway } from '@org/ecsas/ecsas-data';
import { SelectFilterEvent, SelectModule } from 'primeng/select';
import { Applicant } from '@org/models';

@Component({
  selector: 'lib-search-applicant-component',
  imports: [ButtonComponent, AutoCompleteModule, FormsModule, SelectModule],
  templateUrl: './search-applicant.component.html',
  providers: [DialogService],
})
export class SearchApplicantComponent implements OnInit {
  private readonly _dialogRef = inject(DynamicDialogRef);
  private readonly _applicantGateway = inject(ApplicantGateway);

  loadingApplicants = signal(false);
  applicants = signal<Partial<Applicant>[]>([]);
  selectedApplicant: Partial<Applicant> | null = null;
  payload = signal<Partial<Applicant> | null>(null);

  ngOnInit() {
    this.fetchApplicants('');
  }

  async fetchApplicants(query: string | null) {
    try {
      this.loadingApplicants.set(true);
      const applicants = await this._applicantGateway.searchApplicant(
        query ?? '',
      );
      this.applicants.set(applicants);
    } catch (error) {
      console.error(error);
    } finally {
      this.loadingApplicants.set(false);
    }
  }

  async fetchApplicantById(applicantId: string | null) {
    try {
      this.loadingApplicants.set(true);
      const applicant = await this._applicantGateway.getApplicantById(
        applicantId ?? '',
      );
      this.payload.set(applicant);
    } catch (error) {
      console.error(error);
    } finally {
      this.loadingApplicants.set(false);
    }
  }

  onFilter(event: SelectFilterEvent) {
    this.fetchApplicants(event.filter ?? '');
  }

  async addDocument() {
    if (!this.selectedApplicant?.id) {
      return;
    }
    await this.fetchApplicantById(this.selectedApplicant.id);
    this._dialogRef?.close(this.payload() ?? null);
  }
}
