import { Injectable, inject } from '@angular/core';
import {
  ApplicationImportResult,
  ApplicationImportRow,
  ApplicantPayload,
} from '@org/models';
import { ApplicantGateway } from '../applicant/applicant-gateway.service';
import { ApplicationGateway } from './application-gateway.service';

@Injectable({
  providedIn: 'root',
})
export class ApplicationImportService {
  private readonly _applicantGateway = inject(ApplicantGateway);
  private readonly _applicationGateway = inject(ApplicationGateway);

  async importApplications(
    rows: ApplicationImportRow[],
    procedureId: string,
  ): Promise<ApplicationImportResult> {
    let applicantsCreated = 0;
    let applicationsCreated = 0;
    let failed = 0;

    for (const row of rows) {
      if (!row.nin) {
        failed++;
        continue;
      }
      try {
        const existing = await this._applicantGateway.getApplicantByNin(
          row.nin,
        );
        let applicantId = existing?.id;
        if (!applicantId) {
          const payload: ApplicantPayload = {
            fullName: [row.firstName, row.lastName].filter(Boolean).join(' '),
            nin: row.nin,
            phoneNumber: row.phoneNumber,
            address: row.address,
            status: 'DEFAULT',
            source: null,
            birthdate: row.birthdate,
          };
          applicantId =
            await this._applicantGateway.createImportApplicant(payload);
          applicantsCreated++;
        }
        await this._applicationGateway.createImportApplication({
          applicantId,
          procedureId,
          mailRef: row.mailRef,
        });
        applicationsCreated++;
      } catch (error) {
        console.error('Import application failed:', error);
        failed++;
      }
    }

    return {
      total: rows.length,
      applicantsCreated,
      applicationsCreated,
      failed,
    };
  }
}