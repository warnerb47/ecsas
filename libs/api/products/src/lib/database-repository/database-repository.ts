import { Procedure } from '@org/models';
import Database from '@tauri-apps/plugin-sql';
import { GET_PROCEDURES_QUERY } from './queries';

export class DatabaseRepository {
  db: Database | null = null;

  async initDB() {
    const db = await Database.load('sqlite:ecsas.db');
    this.db = db;
  }

  async closeDB() {
    if (this.db) {
      await this.db.close();
      this.db = null;
    }
  }

  async getProcedures() {
    if (!this.db) {
      return null;
    }
    const procedures: Partial<Procedure>[] = await this.db.select(GET_PROCEDURES_QUERY);
    return procedures.map((procedure) => this.parseProcedure(procedure));
  }

  async seedQuery(query: string) {
    if (!this.db) {
      return null;
    }
    return await this.db.select(query);
  }

  parseProcedure(procedure: Partial<Procedure>) {
    const documents = JSON.parse(procedure?.documents as unknown as string);
    const parsedProcedures = { ...procedure, documents };
    return parsedProcedures;
  }

  async createProcedure(procedure: Procedure) {
    if (!this.db) {
      return null;
    }
    const result = await this.db.execute(
      'INSERT into procedures (id, name, description, status, type, begin, end) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [
        procedure.id,
        procedure.name,
        procedure.description,
        procedure.status,
        procedure.type,
        procedure.begin,
        procedure.end,
      ],
    );
    return result;
  }
}
