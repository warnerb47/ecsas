import { Applicant } from '@org/models';
import { closeConnection, openConnection, parseKey } from '../db.utils';
import { GET_APPLICANT_BY_ID, SEARCH_APPLICANT } from './query';

export class ApplicantRepository {
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
}
