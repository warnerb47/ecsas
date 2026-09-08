import { Injectable, inject } from '@angular/core';
import {
  EventImportIssue,
  EventImportPreviewRow,
  EventImportResult,
  EventImportRow,
  EventPayload,
  EventStatus,
  EventType,
} from '@org/models';
import { EventGateway } from './event-gateway.service';

const TYPE_CODES: Record<string, EventType> = {
  'secours social': 'SOCIAL_CARE',
  'social care': 'SOCIAL_CARE',
  santé: 'HEALTH',
  sante: 'HEALTH',
  réunion: 'MEETING',
  reunion: 'MEETING',
  cérémonie: 'CEREMONY',
  ceremonie: 'CEREMONY',
  communautaire: 'COMMUNITY',
  SOCIAL_CARE: 'SOCIAL_CARE',
  HEALTH: 'HEALTH',
  MEETING: 'MEETING',
  CEREMONY: 'CEREMONY',
  COMMUNITY: 'COMMUNITY',
};

const STATUS_CODES: Record<string, EventStatus> = {
  'planifié': 'PLANNED',
  planifie: 'PLANNED',
  'en cours': 'IN_PROGRESS',
  terminé: 'COMPLETED',
  termine: 'COMPLETED',
  annulé: 'CANCELLED',
  annule: 'CANCELLED',
  PLANNED: 'PLANNED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
};

@Injectable({
  providedIn: 'root',
})
export class EventImportService {
  private readonly _eventGateway = inject(EventGateway);

  async previewEvents(rows: EventImportRow[]): Promise<EventImportPreviewRow[]> {
    const existing = await this._eventGateway.getEvents();
    const existingKeys = new Set(
      existing.map((event) =>
        this.eventKey(event.name ?? '', event.startDate ?? ''),
      ),
    );

    const fileCounts = new Map<string, number>();
    for (const row of rows) {
      const key = this.eventKey(row.name, row.startDate ?? '');
      fileCounts.set(key, (fileCounts.get(key) ?? 0) + 1);
    }

    const previewRows: EventImportPreviewRow[] = [];
    for (const row of rows) {
      const issues: EventImportIssue[] = [];
      const key = this.eventKey(row.name, row.startDate ?? '');

      if (!row.name.trim()) {
        issues.push({
          type: 'error',
          message: 'Nom manquant, la ligne ne peut pas être importée',
        });
      }

      if (!row.startDate) {
        issues.push({
          type: 'error',
          message: 'Date de début manquante',
        });
      }

      if (row.type.trim() && !TYPE_CODES[row.type.trim().toLowerCase()]) {
        issues.push({
          type: 'error',
          message: `Type d'événement inconnu : "${row.type}"`,
        });
      }

      if (row.status.trim() && !STATUS_CODES[row.status.trim().toLowerCase()]) {
        issues.push({
          type: 'error',
          message: `Statut inconnu : "${row.status}"`,
        });
      }

      if ((fileCounts.get(key) ?? 0) > 1) {
        issues.push({
          type: 'warning',
          message:
            'Doublon dans le fichier : même nom et même date de début',
        });
      }

      const isExisting = existingKeys.has(key);
      if (isExisting) {
        issues.push({
          type: 'warning',
          message:
            'Conflit : un événement avec le même nom et la même date de début existe déjà',
        });
      }

      previewRows.push({
        row,
        selected: !issues.some(
          (issue) => issue.type === 'error' || issue.type === 'warning',
        ),
        existing: isExisting,
        safe: !issues.some(
          (issue) => issue.type === 'error' || issue.type === 'warning',
        ),
        issues,
      });
    }
    return previewRows;
  }

  async importEvents(rows: EventImportRow[]): Promise<EventImportResult> {
    let eventsCreated = 0;
    let failed = 0;

    for (const row of rows) {
      if (!row.name.trim() || !row.startDate) {
        failed++;
        continue;
      }
      try {
        const payload: EventPayload = {
          name: row.name,
          type: TYPE_CODES[row.type.trim().toLowerCase()] ?? 'MEETING',
          status: STATUS_CODES[row.status.trim().toLowerCase()] ?? 'PLANNED',
          startDate: row.startDate,
          endDate: row.endDate ?? row.startDate,
          startTime: row.startTime,
          endTime: row.endTime,
          location: row.location,
          expectedParticipants: row.expectedParticipants,
          description: row.description,
          budget: row.budget,
        };
        await this._eventGateway.createEvent(payload);
        eventsCreated++;
      } catch (error) {
        console.error('Import event failed:', error);
        failed++;
      }
    }

    return {
      total: rows.length,
      eventsCreated,
      failed,
    };
  }

  private eventKey(name: string, startDate: string): string {
    return `${name.trim().toLowerCase()}|${startDate}`;
  }
}