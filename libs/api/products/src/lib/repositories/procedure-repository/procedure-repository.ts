import { Procedure, ProcedurePayload, ProcedureType } from '@org/models';
import Database from '@tauri-apps/plugin-sql';
import { GET_PROCEDURE_QUERY_BY_ID, GET_PROCEDURE_TYPE_QUERY, GET_PROCEDURES_QUERY } from './queries';
import { v4 as uuidv4 } from 'uuid';

export class ProcedureRepository {
  db: Database | null = null;

  async openConnection() {
    const db = await Database.load('sqlite:ecsas.db');
    return db;
  }

  async closeConnection(db: Database) {
    await db.close();
  }

  async getProcedureById(procedureId: string) {
    const db = await this.openConnection();
    if (!db) {
      throw new Error('No database connection');
    }
    const procedures: Partial<Procedure>[] =
      await db.select(GET_PROCEDURE_QUERY_BY_ID, [procedureId]);
    const results =
      (procedures.map((procedure) => {
        return {
          ...procedure,
          ...this.parseKey({ entity: procedure, key: 'documents' }),
          ...this.parseKey({ entity: procedure, key: 'type' }),
        };
      }) as Partial<Procedure>[]) ?? [];
    await this.closeConnection(db);
    return results[0];
  }
  async getProcedures() {
    const db = await this.openConnection();
    if (!db) {
      throw new Error('No database connection');
    }
    const procedures: Partial<Procedure>[] =
      await db.select(GET_PROCEDURES_QUERY);
    const results =
      (procedures.map((procedure) => {
        return {
          ...procedure,
          ...this.parseKey({ entity: procedure, key: 'documents' }),
          ...this.parseKey({ entity: procedure, key: 'type' }),
        };
      }) as Partial<Procedure>[]) ?? [];
    await this.closeConnection(db);
    return results;
  }

  async getProcedureTypes() {
    const db = await this.openConnection();
    if (!db) {
      throw new Error('No database connection');
    }
    const procedureTypes: Partial<ProcedureType>[] = await db.select(
      GET_PROCEDURE_TYPE_QUERY,
    );
    await this.closeConnection(db);
    return procedureTypes;
  }

  async seedQuery(query: string) {
    const db = await this.openConnection();
    if (!db) {
      throw new Error('No database connection');
    }
    const result = await db.select(query);
    await this.closeConnection(db);
    return result;
  }

  private parseKey(params: { entity: Record<string, unknown>; key: string }) {
    const { entity, key } = params;
    if (key in entity) {
      const pasedValue = JSON.parse(entity[key] as unknown as string);
      const parsedResult = { [key]: pasedValue };
      return parsedResult;
    }
    return {};
  }

  async createProcedureWithDocuments(procedure: ProcedurePayload) {
    const db = await this.openConnection();
    if (!db) {
      throw new Error('No database connection');
    }
    const p = procedure;
    // Utilise l'ID fourni ou en génère un nouveau
    const procedureId = uuidv4();

    try {
      // 1. Insertion de la procédure parente
      const procedureResult = await db.execute(
        `INSERT INTO core_procedure (id, name, description, start_date, end_date, status, type)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          procedureId,
          p.name,
          p.description,
          p.startDate,
          p.endDate,
          p.status,
          p.type,
        ],
      );

      // 2. Insertion des documents enfants s'ils existent
      if (p.documents && Array.isArray(p.documents)) {
        for (const doc of p.documents) {
          const docId = uuidv4();
          // SQLite ne stocke pas les booléens, on transforme true/false en 1/0
          const isRequired = doc.required ? 1 : 0;

          await db.execute(
            `INSERT INTO core_procedure_document (id, procedure_id, name, required)
           VALUES ($1, $2, $3, $4)`,
            [
              docId,
              procedureId, // Clé étrangère liée à la procédure créée juste au-dessus
              doc.name,
              isRequired,
            ],
          );
        }
      }

      return procedureResult;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
