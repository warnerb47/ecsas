import { Applicant, ApplicantPayload } from '@org/models';
import { closeConnection, openConnection, parseKey } from '../db.utils';
import { GET_APPLICANT_BY_ID, SEARCH_APPLICANT } from './query';
import { v4 as uuidv4 } from 'uuid';
import { DocumentManager } from '@org/api/products';

export class ApplicantRepository {
  private readonly _documentManager = new DocumentManager();
  async searchApplicant(query: string) {
    const db = await openConnection();
    if (!db) {
      throw new Error('No database connection');
    }
    const applications: Partial<Applicant>[] = await db.select(
      SEARCH_APPLICANT,
      [`%${query}%`],
    );
    await closeConnection(db);
    return applications;
  }

  async getApplicantById(applicantId: string) {
    const db = await openConnection();
    if (!db) {
      throw new Error('No database connection');
    }
    const applications: Partial<Applicant>[] = await db.select(
      GET_APPLICANT_BY_ID,
      [applicantId],
    );
    const results =
      (applications.map((application) => {
        return {
          ...application,
          ...parseKey({ entity: application, key: 'sources' }),
        };
      }) as Partial<Applicant>[]) ?? [];
    await closeConnection(db);
    return results[0];
  }

  async createCoreSource(file: File) {
    const sourceId = uuidv4();
    const mimeType = file.type;
    const fullPath = `${this._documentManager.appDataConfig.applicantFolder.path}/${file.name}`;
    const db = await openConnection();
    if (!db) {
      throw new Error('No database connection');
    }
    const uploaded = await this._documentManager.uploadFile({
      file,
      fullPath,
    });
    if (!uploaded) {
      throw new Error('File upload failed');
    }

    const result = await db.execute(
      `INSERT INTO core_source (id, name, path, mime_type)
      VALUES ($1, $2, $3, $4)`,
      [sourceId, file.name, fullPath, mimeType],
    );
    if (!result.rowsAffected) {
      throw new Error('core_source creation failed');
    }
    return sourceId;
  }

  async createCoreApplicant(applicant: ApplicantPayload) {
    const applicantId = uuidv4();
    const db = await openConnection();
    if (!db) {
      throw new Error('No database connection');
    }

    const result = await db.execute(
      `INSERT INTO core_applicant (id, full_name, nin, phone_number, address, status)
      VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        applicantId,
        applicant.fullName,
        applicant.nin,
        applicant.phoneNumber,
        applicant.address,
        applicant.status,
      ],
    );
    if (!result.rowsAffected) {
      throw new Error('core_applicant creation failed');
    }
    return applicantId;
  }

  async createCoreApplicantSource(params: {
    applicantId: string;
    sourceId: string;
  }) {
    const { applicantId, sourceId } = params;
    const db = await openConnection();
    if (!db) {
      throw new Error('No database connection');
    }

    const result = await db.execute(
      `INSERT INTO core_applicant_source (applicant_id, source_id)
      VALUES ($1, $2)`,
      [applicantId, sourceId],
    );
    if (!result.rowsAffected) {
      throw new Error('core_applicant_source creation failed');
    }
    return params;
  }

  async createApplicant(payload: ApplicantPayload) {
    try {
      if (!payload?.source) {
        throw new Error('No source provided');
      }
      const sourceId = await this.createCoreSource(payload?.source);
      const applicantId = await this.createCoreApplicant(payload);
      await this.createCoreApplicantSource({ applicantId, sourceId });
      return applicantId;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
