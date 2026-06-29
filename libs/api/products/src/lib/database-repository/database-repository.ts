
import { Procedure } from '@org/models';
import Database from '@tauri-apps/plugin-sql';

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
    const query= `
      SELECT
          p.id,
          p.name,
          p.description,
          p.start_date,
          p.end_date,
          p.status,
          p.type,
          p.created_at,
          p.updated_at,
          -- Aggregate documents into a JSON array
          COALESCE(
              json_group_array(
                  json_object(
                      'name', d.name,
                      'required', d.required
                  )
              ) FILTER (WHERE d.id IS NOT NULL),
              '[]'
          ) as documents
      FROM core_procedure p
      LEFT JOIN core_procedure_document d ON p.id = d.procedure_id
      GROUP BY p.id;
    `;
    const procedures = await this.db.select(query);
    return procedures;
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
