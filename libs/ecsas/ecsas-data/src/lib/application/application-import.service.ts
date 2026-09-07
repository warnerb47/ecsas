import { Injectable, inject } from '@angular/core';
import {
  ApplicationImportIssue,
  ApplicationImportPreviewRow,
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

  async previewApplications(
    rows: ApplicationImportRow[],
    procedureId: string,
  ): Promise<ApplicationImportPreviewRow[]> {
    const existingMailRefs =
      await this._applicationGateway.getMailRefsByProcedureId(procedureId);
    const mailRefCounts = new Map<string, number>();
    for (const row of rows) {
      if (!row.mailRef) {
        continue;
      }
      mailRefCounts.set(row.mailRef, (mailRefCounts.get(row.mailRef) ?? 0) + 1);
    }

    const previewRows: ApplicationImportPreviewRow[] = [];
    for (const row of rows) {
      const issues: ApplicationImportIssue[] = [];

      if (!row.nin) {
        issues.push({
          type: 'error',
          message: 'NIN manquant, la ligne ne peut pas être importée',
        });
      }

      if (row.mailRef) {
        if ((mailRefCounts.get(row.mailRef) ?? 0) > 1) {
          issues.push({
            type: 'warning',
            message: `Doublon dans le fichier : le numéro de courrier "${row.mailRef}" apparaît plusieurs fois`,
          });
        }
        if (existingMailRefs.includes(row.mailRef)) {
          issues.push({
            type: 'warning',
            message: `Conflit : une demande avec le numéro de courrier "${row.mailRef}" existe déjà pour cette procédure`,
          });
        }
      }

      const existing =
        row.nin && (await this._applicantGateway.getApplicantByNin(row.nin));
      const existingApplicant = Boolean(existing);
      if (existingApplicant && issues.length === 0) {
        issues.push({
          type: 'info',
          message: 'Demandeur existant, il sera réutilisé',
        });
      }

      previewRows.push({
        row,
        selected: issues.some(
          (issue) => issue.type === 'error' || issue.type === 'warning',
        )
          ? false
          : true,
        existingApplicant,
        safe: !issues.some(
          (issue) => issue.type === 'error' || issue.type === 'warning',
        ),
        issues,
      });
    }
    return previewRows;
  }

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