import { Application, ApplicationDocument, ApplicationPayload } from '@org/models';
import { closeConnection, openConnection, parseKey } from '../db.utils';
import { GET_APPLICATION_BY_ID, GET_APPLICATIONS_BY_PROCEDURE_ID } from './query';
import { v4 as uuidv4 } from 'uuid';
import { DocumentManager } from '@org/api/products';

export class ApplicationRepository {
  private readonly _documentManager = new DocumentManager();

  async getApplicationsByProcedureId(procedureId: string) {
    const db = await openConnection();
    if (!db) {
      throw new Error('No database connection');
    }
    const applications: Partial<Application>[] = await db.select(
      GET_APPLICATIONS_BY_PROCEDURE_ID,
      [procedureId],
    );
    const results =
      applications.map((application) => {
        return {
          ...application,
          ...parseKey({ entity: application, key: 'applicant' }),
        };
      }) ?? [];
    await closeConnection(db);
    return results;
  }

  async getApplicationById(applicationId: string) {
    const db = await openConnection();
    if (!db) {
      throw new Error('No database connection');
    }
    const applications: Partial<Application>[] = await db.select(
      GET_APPLICATION_BY_ID,
      [applicationId],
    );
    const results =
      applications.map((application) => {
        return {
          ...application,
          ...parseKey({ entity: application, key: 'applicant' }),
          ...parseKey({ entity: application, key: 'sources' }),
        };
      }) ?? [];
    await closeConnection(db);
    return results[0];
  }

  async createCoreSources(documents: ApplicationDocument[]) {
    if (!documents.length) {
      return [];
    }
    const db = await openConnection();
    if (!db) {
      throw new Error('No database connection');
    }
    const sourceIds: string[] = [];
    for (const document of documents) {
      const file = document.file;
      const sourceId = uuidv4();
      const mimeType = file.type;
      const fullPath = `${this._documentManager.appDataConfig.applicationFolder.path}/${file.name}`;

      const uploaded = await this._documentManager.uploadFile({
        file,
        fullPath,
      });
      if (!uploaded) {
        throw new Error('File upload failed');
      }

      const result = await db.execute(
        `INSERT INTO
          core_source (id, name, path, mime_type)
        VALUES
          ($1, $2, $3, $4)`,
        [sourceId, file.name, fullPath, mimeType],
      );
      if (!result.rowsAffected) {
        throw new Error('core_source creation failed');
      }
      sourceIds.push(sourceId);
    }
    await closeConnection(db);
    return sourceIds;
  }

  async createCoreApplication(application: ApplicationPayload) {
    const db = await openConnection();
    if (!db) {
      throw new Error('No database connection');
    }
    const applicationId = uuidv4();

    const result = await db.execute(
      `INSERT INTO
      core_application (
        id,
        applicant_id,
        procedure_id,
        mail_ref,
        status,
        state,
        amount
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        applicationId,
        application.applicant,
        application.procedure,
        application.mailRef,
        application.status,
        application.state,
        application.amount,
      ],
    );
    if (!result.rowsAffected) {
      throw new Error('core_applicant_source creation failed');
    }
    await closeConnection(db);
    return applicationId;
  }

  async createCoreApplicationSource(params: {
    applicationId: string;
    sourceIds: string[];
  }) {
    const { applicationId, sourceIds } = params;
    const db = await openConnection();
    if (!db) {
      throw new Error('No database connection');
    }

    for (const sourceId of sourceIds) {
      const result = await db.execute(
        `INSERT INTO core_application_source (application_id, source_id)
        VALUES ($1, $2)`,
        [applicationId, sourceId],
      );
      if (!result.rowsAffected) {
        throw new Error('core_application_source creation failed');
      }
    }
    await closeConnection(db);
    return params;
  }

  async createApplication(payload: ApplicationPayload) {
    try {
      if (!payload?.sources.length) {
        throw new Error('No source provided');
      }
      const sourceIds = await this.createCoreSources(payload?.sources);
      const applicationId = await this.createCoreApplication(payload);
      await this.createCoreApplicationSource({ applicationId, sourceIds });
      return applicationId;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
