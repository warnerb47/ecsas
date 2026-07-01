import { Application } from "@org/models";
import { closeConnection, openConnection, parseKey } from "../db.utils";
import { GET_APPLICATIONS_BY_PROCEDURE_ID } from "./query";

export class ApplicationRepository {


    async getApplicationsByProcedureId(procedureId: string) {
      const db = await openConnection();
      if (!db) {
        throw new Error('No database connection');
      }
      const applications: Partial<Application>[] =
        await db.select(GET_APPLICATIONS_BY_PROCEDURE_ID, [procedureId]);
      const results =
        (applications.map((application) => {
          return {
            ...application,
            ...parseKey({ entity: application, key: 'applicant' }),
          };
        })) ?? [];
      await closeConnection(db);
      return results;
    }

}
