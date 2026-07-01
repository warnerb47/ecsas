import { Applicant } from '@org/models';
import { closeConnection, openConnection } from '../db.utils';
import { SEARCH_APPLICANT } from './query';

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
}
