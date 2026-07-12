import { Procedure, ProcedureDocument } from '@org/models';
import { GET_PROCEDURE_QUERY_BY_ID, GET_PROCEDURES_QUERY } from './queries';
import { v4 as uuidv4 } from 'uuid';
import { closeConnection, openConnection, parseKey } from '../db.utils';

export class ProcedureRepository {

  async getProcedureById(procedureId: string) {
    const db = await openConnection();
    if (!db) {
      throw new Error('No database connection');
    }
    const procedures: Partial<Procedure>[] =
      await db.select(GET_PROCEDURE_QUERY_BY_ID, [procedureId]);
    const results =
      (procedures.map((procedure) => {
        return {
          ...procedure,
          ...parseKey({ entity: procedure, key: 'documents' }),
          ...parseKey({ entity: procedure, key: 'type' }),
        };
      }) as Partial<Procedure>[]) ?? [];
    await closeConnection(db);
    return results[0];
  }
  async getProcedures() {
    const db = await openConnection();
    if (!db) {
      throw new Error('No database connection');
    }
    const procedures: Partial<Procedure>[] =
      await db.select(GET_PROCEDURES_QUERY);
    const results =
      (procedures.map((procedure) => {
        return {
          ...procedure,
          ...parseKey({ entity: procedure, key: 'documents' }),
          ...parseKey({ entity: procedure, key: 'type' }),
        };
      }) as Partial<Procedure>[]) ?? [];
    await closeConnection(db);
    return results;
  }

  async createProcedureWithDocuments(procedure: Procedure) {
    const db = await openConnection();
    if (!db) {
      throw new Error('No database connection');
    }
    const p = procedure;
    // Utilise l'ID fourni ou en génère un nouveau
    const procedureId = uuidv4();

    try {
      // 1. Insertion de la procédure parente
      const procedureResult = await db.execute(
        `INSERT INTO core_procedure (id, name, description)
       VALUES ($1, $2, $3)`,
        [
          procedureId,
          p.name,
          p.description
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

    async updateProcedure(procedure: Procedure) {
    const db = await openConnection();
    if (!db) {
      throw new Error('No database connection');
    }

    const p = procedure;

    try {
      // 1. Update the parent procedure
      await db.execute(
        `UPDATE core_procedure
         SET name = $1, description = $2
         WHERE id = $3`,
        [
          p.name,
          p.description,
          p.id,
        ],
      );

      return { success: true, id: procedure.id };
    } catch (error) {
      console.error('Error updating procedure:', error);
      throw error;
    }
  }

  async createProcedureDocument(payload: ProcedureDocument) {
    const db = await openConnection();
    if (!db) {
      throw new Error('No database connection');
    }
    if (!payload.procedureId) {
      throw new Error('Procedure ID is required');
    }

    const documentId = uuidv4();
    const isRequired = payload.required ? 1 : 0;

    try {
      await db.execute(
        `INSERT INTO core_procedure_document (id, procedure_id, name, required)
         VALUES ($1, $2, $3, $4)`,
        [documentId, payload.procedureId, payload.name, isRequired]
      );

      return { success: true, id: documentId };
    } catch (error) {
      console.error('Error adding document:', error);
      throw error;
    }
  }

  async updateProcedureDocument(payload: ProcedureDocument) {
    const db = await openConnection();
    if (!db) {
      throw new Error('No database connection');
    }
    if (!payload.procedureId) {
      throw new Error('Procedure ID is required');
    }

    const isRequired = payload.required ? 1 : 0;

    try {
      const result = await db.execute(
        `UPDATE core_procedure_document
         SET name = $1, required = $2
         WHERE id = $3 AND procedure_id = $4`,
        [payload.name, isRequired, payload.id, payload.procedureId]
      );

      // Optional: Check if a row was actually updated
      if (result.rowsAffected === 0) {
        throw new Error('Document not found or belongs to a different procedure');
      }

      return { success: true, id: payload.id };
    } catch (error) {
      console.error('Error updating document:', error);
      throw error;
    }
  }

  async deleteProcedureDocument(params: {procedureId: string; documentId: string}) {
    const { procedureId, documentId } = params;
    const db = await openConnection();
    if (!db) {
      throw new Error('No database connection');
    }

    try {
      const result = await db.execute(
        `DELETE FROM core_procedure_document
         WHERE id = $1 AND procedure_id = $2`,
        [documentId, procedureId]
      );

      if (result.rowsAffected === 0) {
        throw new Error('Document not found or already deleted');
      }

      return { success: true, id: documentId };
    } catch (error) {
      console.error('Error deleting document:', error);
      throw error;
    }
  }
}
