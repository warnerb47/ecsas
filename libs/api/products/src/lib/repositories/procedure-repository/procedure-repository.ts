import { Procedure, ProcedureType } from '@org/models';
import Database from '@tauri-apps/plugin-sql';
import { GET_PROCEDURE_TYPE_QUERY, GET_PROCEDURES_QUERY } from './queries';

export class ProcedureRepository {
  db: Database | null = null;

  async openConnection() {
    const db = await Database.load('sqlite:ecsas.db');
    return db;
  }

  async closeConnection(db: Database) {
    await db.close();
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
    const procedureTypes: Partial<ProcedureType>[] =
      await db.select(GET_PROCEDURE_TYPE_QUERY);
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

  // async createProcedure(procedure: Procedure) {
  //   if (!this.db) {
  //     return null;
  //   }
  //   const result = await this.db.execute(
  //     'INSERT into procedures (id, name, description, status, type, begin, end) VALUES ($1, $2, $3, $4, $5, $6, $7)',
  //     [
  //       procedure.id,
  //       procedure.name,
  //       procedure.description,
  //       procedure.status,
  //       procedure.type,
  //       procedure.begin,
  //       procedure.end,
  //     ],
  //   );
  //   return result;
  // }
}
