import { Injectable } from '@angular/core';
import { Procedure } from '@org/models';
import Database from '@tauri-apps/plugin-sql';

@Injectable({
  providedIn: 'root',
})
export class RepositoryService {
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
    const procedures = await this.db.select("SELECT * FROM core_procedure");
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
