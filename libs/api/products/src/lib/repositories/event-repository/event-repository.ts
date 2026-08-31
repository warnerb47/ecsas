import {
  Event,
  EventExpense,
  EventFilters,
  EventPartner,
  EventPayload,
  EventStats,
  EventUsefulLink,
} from '@org/models';
import { v4 as uuidv4 } from 'uuid';
import { closeConnection, openConnection, parseKey } from '../db.utils';
import { GET_EVENT_BY_ID } from './queries';

export class EventRepository {
  async getEvents() {
    const db = await openConnection();
    if (!db) {
      throw new Error('No database connection');
    }
    const events: Partial<Event>[] = await db.select(
      `SELECT
        e.id,
        e.name,
        e.type,
        e.status,
        e.start_date as startDate,
        e.end_date as endDate,
        e.start_time as startTime,
        e.end_time as endTime,
        e.location,
        e.expected_participants as expectedParticipants,
        e.budget
      FROM core_event e
      ORDER BY e.start_date ASC`,
    );
    await closeConnection(db);
    return events ?? [];
  }

  async filterEvents(filters: EventFilters): Promise<Partial<Event>[]> {
    const db = await openConnection();
    if (!db) {
      throw new Error('No database connection');
    }

    const {
      name,
      type,
      status,
      dateFrom,
      dateTo,
      page = 1,
      pageSize = 10,
    } = filters;

    let sql = `
    SELECT
      e.id,
      e.name,
      e.type,
      e.status,
      e.start_date as startDate,
      e.end_date as endDate,
      e.start_time as startTime,
      e.end_time as endTime,
      e.location,
      e.expected_participants as expectedParticipants,
      e.budget,
      COALESCE(SUM(exp.spent), 0) as spent
    FROM
      core_event e
      LEFT JOIN core_event_expense exp ON e.id = exp.event_id
    WHERE
      1 = 1
    `;

    const params: unknown[] = [];

    const addCondition = (condition: string, value: unknown) => {
      sql += ` AND ${condition}`;
      params.push(value);
    };

    if (name) {
      addCondition('e.name LIKE ?', `%${name}%`);
    }
    if (type) {
      addCondition('e.type = ?', type);
    }
    if (status) {
      addCondition('e.status = ?', status);
    }
    if (dateFrom) {
      addCondition('e.start_date >= ?', dateFrom);
    }
    if (dateTo) {
      addCondition('e.end_date <= ?', dateTo);
    }

    sql += ' GROUP BY e.id';
    sql += ' ORDER BY e.start_date DESC';

    const offset = (page - 1) * pageSize;
    sql += ` LIMIT ? OFFSET ?`;
    params.push(pageSize, offset);

    try {
      const events = (await db.select(sql, params)) as unknown as Partial<Event>[];
      return events ?? [];
    } finally {
      await closeConnection(db);
    }
  }

  async getEventStats(): Promise<EventStats> {
    const db = await openConnection();
    if (!db) {
      throw new Error('No database connection');
    }
    const stats: EventStats[] = await db.select(`
      SELECT
        COUNT(*) AS total,
        COALESCE(SUM(CASE WHEN status = 'PLANNED' THEN 1 ELSE 0 END), 0) AS planned,
        COALESCE(SUM(CASE WHEN status = 'IN_PROGRESS' THEN 1 ELSE 0 END), 0) AS inProgress,
        COALESCE(SUM(CASE WHEN status = 'COMPLETED' THEN 1 ELSE 0 END), 0) AS completed,
        COALESCE(SUM(CASE WHEN status = 'CANCELLED' THEN 1 ELSE 0 END), 0) AS cancelled
      FROM core_event
    `);
    await closeConnection(db);
    return (
      stats[0] ?? {
        total: 0,
        planned: 0,
        inProgress: 0,
        completed: 0,
        cancelled: 0,
      }
    );
  }

  async getEventById(eventId: string) {
    const db = await openConnection();
    if (!db) {
      throw new Error('No database connection');
    }
    const events: Partial<Event>[] = await db.select(GET_EVENT_BY_ID, [eventId]);
    const results =
      (events.map((event) => {
        return {
          ...event,
          ...parseKey({ entity: event, key: 'expenses' }),
          ...parseKey({ entity: event, key: 'partners' }),
          ...parseKey({ entity: event, key: 'usefulLinks' }),
          ...parseKey({ entity: event, key: 'documents' }),
        };
      }) as Partial<Event>[]) ?? [];
    await closeConnection(db);
    return results[0];
  }

  async createEvent(payload: EventPayload) {
    const db = await openConnection();
    if (!db) {
      throw new Error('No database connection');
    }
    const eventId = payload.id ?? uuidv4();

    try {
      const result = await db.execute(
        `INSERT INTO core_event (
          id, name, type, status, start_date, end_date, start_time, end_time,
          location, expected_participants, description, budget, procedure_id
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
        [
          eventId,
          payload.name,
          payload.type,
          payload.status,
          payload.startDate,
          payload.endDate,
          payload.startTime,
          payload.endTime,
          payload.location,
          payload.expectedParticipants,
          payload.description,
          payload.budget,
          payload.procedureId ?? null,
        ],
      );
      if (!result.rowsAffected) {
        throw new Error('core_event creation failed');
      }
      return eventId;
    } finally {
      await closeConnection(db);
    }
  }

  async updateEvent(payload: EventPayload) {
    const db = await openConnection();
    if (!db) {
      throw new Error('No database connection');
    }

    try {
      const result = await db.execute(
        `UPDATE core_event SET
          name = $1,
          type = $2,
          status = $3,
          start_date = $4,
          end_date = $5,
          start_time = $6,
          end_time = $7,
          location = $8,
          expected_participants = $9,
          description = $10,
          budget = $11,
          procedure_id = $12
        WHERE id = $13`,
        [
          payload.name,
          payload.type,
          payload.status,
          payload.startDate,
          payload.endDate,
          payload.startTime,
          payload.endTime,
          payload.location,
          payload.expectedParticipants,
          payload.description,
          payload.budget,
          payload.procedureId ?? null,
          payload.id,
        ],
      );
      if (!result.rowsAffected || result.rowsAffected === 0) {
        throw new Error('core_event update failed - no rows affected');
      }
      return payload.id;
    } finally {
      await closeConnection(db);
    }
  }

  async deleteEvent(eventId: string) {
    const db = await openConnection();
    if (!db) {
      throw new Error('No database connection');
    }
    try {
      const result = await db.execute(
        `DELETE FROM core_event WHERE id = $1`,
        [eventId],
      );
      if (result.rowsAffected === 0) {
        throw new Error('Event not found');
      }
      return { success: true, id: eventId };
    } finally {
      await closeConnection(db);
    }
  }

  async addExpense(payload: EventExpense) {
    const db = await openConnection();
    if (!db) {
      throw new Error('No database connection');
    }
    const expenseId = payload.id ?? uuidv4();
    try {
      if (!payload.eventId) {
        throw new Error('Event ID is required');
      }
      const result = await db.execute(
        `INSERT INTO core_event_expense (id, event_id, label, category, planned, spent, date)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          expenseId,
          payload.eventId,
          payload.label,
          payload.category ?? null,
          payload.planned ?? 0,
          payload.spent ?? 0,
          payload.date ?? null,
        ],
      );
      if (!result.rowsAffected) {
        throw new Error('core_event_expense creation failed');
      }
      return expenseId;
    } finally {
      await closeConnection(db);
    }
  }

  async updateExpense(payload: EventExpense) {
    const db = await openConnection();
    if (!db) {
      throw new Error('No database connection');
    }
    try {
      const result = await db.execute(
        `UPDATE core_event_expense SET
          label = $1, category = $2, planned = $3, spent = $4, date = $5
        WHERE id = $6`,
        [
          payload.label,
          payload.category ?? null,
          payload.planned ?? 0,
          payload.spent ?? 0,
          payload.date ?? null,
          payload.id,
        ],
      );
      if (result.rowsAffected === 0) {
        throw new Error('Expense not found');
      }
      return payload.id;
    } finally {
      await closeConnection(db);
    }
  }

  async deleteExpense(params: { eventId: string; expenseId: string }) {
    const { eventId, expenseId } = params;
    const db = await openConnection();
    if (!db) {
      throw new Error('No database connection');
    }
    try {
      const result = await db.execute(
        `DELETE FROM core_event_expense WHERE id = $1 AND event_id = $2`,
        [expenseId, eventId],
      );
      if (result.rowsAffected === 0) {
        throw new Error('Expense not found');
      }
      return { success: true, id: expenseId };
    } finally {
      await closeConnection(db);
    }
  }

  async addPartner(payload: EventPartner) {
    const db = await openConnection();
    if (!db) {
      throw new Error('No database connection');
    }
    const partnerId = payload.id ?? uuidv4();
    try {
      if (!payload.eventId) {
        throw new Error('Event ID is required');
      }
      const result = await db.execute(
        `INSERT INTO core_event_partner (id, event_id, name, role, contact, color)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          partnerId,
          payload.eventId,
          payload.name,
          payload.role ?? null,
          payload.contact ?? null,
          payload.color ?? null,
        ],
      );
      if (!result.rowsAffected) {
        throw new Error('core_event_partner creation failed');
      }
      return partnerId;
    } finally {
      await closeConnection(db);
    }
  }

  async deletePartner(params: { eventId: string; partnerId: string }) {
    const { eventId, partnerId } = params;
    const db = await openConnection();
    if (!db) {
      throw new Error('No database connection');
    }
    try {
      const result = await db.execute(
        `DELETE FROM core_event_partner WHERE id = $1 AND event_id = $2`,
        [partnerId, eventId],
      );
      if (result.rowsAffected === 0) {
        throw new Error('Partner not found');
      }
      return { success: true, id: partnerId };
    } finally {
      await closeConnection(db);
    }
  }

  async addUsefulLink(payload: EventUsefulLink) {
    const db = await openConnection();
    if (!db) {
      throw new Error('No database connection');
    }
    const linkId = payload.id ?? uuidv4();
    try {
      if (!payload.eventId) {
        throw new Error('Event ID is required');
      }
      const result = await db.execute(
        `INSERT INTO core_event_link (id, event_id, label, url)
         VALUES ($1, $2, $3, $4)`,
        [linkId, payload.eventId, payload.label, payload.url ?? null],
      );
      if (!result.rowsAffected) {
        throw new Error('core_event_link creation failed');
      }
      return linkId;
    } finally {
      await closeConnection(db);
    }
  }

  async deleteUsefulLink(params: { eventId: string; linkId: string }) {
    const { eventId, linkId } = params;
    const db = await openConnection();
    if (!db) {
      throw new Error('No database connection');
    }
    try {
      const result = await db.execute(
        `DELETE FROM core_event_link WHERE id = $1 AND event_id = $2`,
        [linkId, eventId],
      );
      if (result.rowsAffected === 0) {
        throw new Error('Useful link not found');
      }
      return { success: true, id: linkId };
    } finally {
      await closeConnection(db);
    }
  }

  async upsertDocument(params: {
    eventId: string;
    type: string;
    status: string;
    fileName?: string;
  }) {
    const { eventId, type, status, fileName } = params;
    const db = await openConnection();
    if (!db) {
      throw new Error('No database connection');
    }
    try {
      const existing: { id: string }[] = await db.select(
        `SELECT id FROM core_event_document WHERE event_id = $1 AND type = $2`,
        [eventId, type],
      );
      if (existing[0]) {
        await db.execute(
          `UPDATE core_event_document SET status = $1, file_name = $2 WHERE id = $3`,
          [status, fileName ?? null, existing[0].id],
        );
        return existing[0].id;
      }
      const docId = uuidv4();
      await db.execute(
        `INSERT INTO core_event_document (id, event_id, type, status, file_name)
         VALUES ($1, $2, $3, $4, $5)`,
        [docId, eventId, type, status, fileName ?? null],
      );
      return docId;
    } finally {
      await closeConnection(db);
    }
  }
}
