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

  async updateCoreSource(params: { id: string; file?: File }) {
    const { id, file } = params;
    let fullPath: string | undefined;
    let mimeType: string | undefined;
    let fileName: string | undefined;

    if (file) {
      fileName = file.name;
      mimeType = file.type;
      fullPath = `${this._documentManager.appDataConfig.applicantFolder.path}/${file.name}`;

      const uploaded = await this._documentManager.uploadFile({
        file,
        fullPath,
      });
      if (!uploaded) {
        throw new Error('File upload failed during update');
      }
    }

    const db = await openConnection();
    if (!db) {
      throw new Error('No database connection');
    }

    try {
      let result;

      if (file) {
        result = await db.execute(
          `UPDATE core_source
         SET name = $1, path = $2, mime_type = $3
         WHERE id = $4`,
          [fileName, fullPath, mimeType, id],
        );
      } else {
        throw new Error(
          'No file provided for update. Implement logic for metadata-only updates if needed.',
        );
      }

      if (result.rowsAffected === 0) {
        throw new Error(
          'core_source update failed: No rows affected (ID may not exist)',
        );
      }

      return id;
    } catch (error) {
      console.error('Error updating core_source:', error);
      throw error;
    }
  }

  async createCoreApplicant(applicant: ApplicantPayload) {
    const applicantId = uuidv4();
    const db = await openConnection();
    if (!db) {
      throw new Error('No database connection');
    }

    const result = await db.execute(
      `INSERT INTO core_applicant (id, full_name, nin, phone_number, address, status, birthdate)
      VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        applicantId,
        applicant.fullName,
        applicant.nin,
        applicant.phoneNumber,
        applicant.address,
        applicant.status,
        applicant.birthdate,
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

  async updateCoreApplicant(params: {
    id: string;
    applicant: ApplicantPayload;
  }) {
    const { id, applicant } = params;
    const db = await openConnection();
    if (!db) {
      throw new Error('No database connection');
    }

    const result = await db.execute(
      `UPDATE core_applicant
     SET full_name = $1, nin = $2, phone_number = $3, address = $4, status = $5, birthdate = $6
     WHERE id = $7`,
      [
        applicant.fullName,
        applicant.nin,
        applicant.phoneNumber,
        applicant.address,
        applicant.status,
        applicant.birthdate,
        id,
      ],
    );

    if (result.rowsAffected === 0) {
      throw new Error(
        'core_applicant update failed: No rows affected (ID may not exist)',
      );
    }

    return id;
  }

  async updateApplicant(params: {
    applicant: ApplicantPayload;
    sourceId: string;
  }) {
    const { applicant, sourceId } = params;
    try {
      if (applicant?.source && sourceId) {
        await this.updateCoreSource({ id: sourceId, file: applicant.source });
      }
      if (applicant.id) {
        await this.updateCoreApplicant({ id: applicant.id, applicant });
      }
      return {
        id: applicant.id,
        sourceId,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
