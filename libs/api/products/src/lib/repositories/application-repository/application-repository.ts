import {
  Application,
  ApplicationDocument,
  ApplicationFilters,
  ApplicationPayload,
} from '@org/models';
import { closeConnection, openConnection, parseKey } from '../db.utils';
import {
  GET_APPLICATION_BY_ID,
  GET_APPLICATIONS_BY_PROCEDURE_ID,
} from './query';
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
        requested_amount,
        comment
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        applicationId,
        application.applicant,
        application.procedure,
        application.mailRef,
        application.status,
        application.state,
        application.requestedAmount,
        application.comment,
      ],
    );
    if (!result.rowsAffected) {
      throw new Error('core_applicant creation failed');
    }
    await closeConnection(db);
    return applicationId;
  }

  async updateApplication(params: {
    applicationId: string;
    application: Partial<ApplicationPayload>;
  }) {
    const { applicationId, application } = params;
    const db = await openConnection();
    if (!db) {
      throw new Error('No database connection');
    }

    try {
      const result = await db.execute(
        `
      UPDATE core_application
      SET
        applicant_id = $1,
        procedure_id = $2,
        mail_ref = $3,
        status = $4,
        state = $5,
        requested_amount = $6,
        received_amount = $7,
        comment = $8
      WHERE id = $9`,
        [
          application.applicant,
          application.procedure,
          application.mailRef,
          application.status,
          application.state,
          application.requestedAmount,
          application.receivedAmount,
          application.comment,
          applicationId,
        ],
      );

      if (!result.rowsAffected || result.rowsAffected === 0) {
        throw new Error('core_application update failed - no rows affected');
      }

      return applicationId;
    } finally {
      await closeConnection(db);
    }
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

  async filterApplications(filters: ApplicationFilters) {
    const db = await openConnection();
    if (!db) {
      throw new Error('No database connection');
    }

    const {
      procedureId,
      status,
      state,
      fullName,
      nin,
      phoneNumber,
      requestedAmount,
      receivedAmount,
      createdAtFrom,
      createdAtTo,
      address,
      applicantStatus,
      mailRef,
      page = 1,
      pageSize = 10,
    } = filters;

    // Base query parts
    let sql = `
    SELECT
      a.id,
      json_object(
        'id', apt.id,
        'fullName', apt.full_name,
        'nin', apt.nin,
        'phoneNumber', apt.phone_number,
        'address', apt.address,
        'status', apt.status
      ) as applicant,
      a.mail_ref as mailRef,
      a.created_at as createdAt,
      a.status,
      a.state,
      a.requested_amount as requestedAmount,
      a.received_amount as receivedAmount,
      a.comment
    FROM
      core_application a
      JOIN core_applicant apt ON a.applicant_id = apt.id
      JOIN core_procedure p ON a.procedure_id = p.id
    WHERE
      p.id = ?
  `;

    const params: unknown[] = [procedureId];

    // Helper to add conditions safely
    const addCondition = (condition: string, value: any) => {
      sql += ` AND ${condition}`;
      params.push(value);
    };

    // Apply filters
    if (status) {
      addCondition('a.status = ?', status);
    }
    if (state) {
      addCondition('a.state = ?', state);
    }
    if (mailRef) {
      addCondition('a.mail_ref LIKE ?', `%${mailRef}%`);
    }
    if (fullName) {
      addCondition('apt.full_name LIKE ?', `%${fullName}%`);
    }
    if (nin) {
      addCondition('apt.nin LIKE ?', `%${nin}%`);
    }
    if (phoneNumber) {
      addCondition('apt.phone_number LIKE ?', `%${phoneNumber}%`);
    }
    if (address) {
      addCondition('apt.address LIKE ?', `%${address}%`);
    }
    if (applicantStatus) {
      addCondition('apt.status = ?', applicantStatus);
    }
    if (requestedAmount) {
      addCondition('a.requested_amount = ?', requestedAmount);
    }
    if (receivedAmount) {
      addCondition('a.received_amount = ?', receivedAmount);
    }
    if (createdAtFrom) {
      addCondition('a.created_at >= ?', createdAtFrom);
    }
    if (createdAtTo) {
      addCondition('a.created_at <= ?', createdAtTo);
    }

    // Pagination
    const offset = (page - 1) * pageSize;
    sql += ' ORDER BY a.created_at DESC';
    sql += ` LIMIT ? OFFSET ?`;
    params.push(pageSize, offset);

    try {
      const applications: Partial<Application>[] = await db.select(sql, params);

      // Parse the JSON 'applicant' field into a flat object
      const results = applications.map((application) => {
        return {
          ...application,
          ...parseKey({ entity: application, key: 'applicant' }),
        };
      });

      return results;
    } finally {
      await closeConnection(db);
    }
  }
}
