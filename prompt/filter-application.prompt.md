# prompt 1
I am using angular with tauri and sqlite. Here is my init_migration:
`
/* Enable foreign key enforcement - MUST be first */
PRAGMA foreign_keys = ON;

/* Create ecsas database schema tables */

CREATE TABLE IF NOT EXISTS core_user (
    id         TEXT                        NOT NULL PRIMARY KEY,
    login      TEXT                        NOT NULL UNIQUE,
    password   TEXT                        NOT NULL,
    created_at TEXT                        NOT NULL DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS core_procedure (
    id          TEXT                        NOT NULL PRIMARY KEY,
    name        TEXT                        NOT NULL,
    description TEXT,
    icon        TEXT                        DEFAULT 'pi pi-tag',
    color       TEXT,
    deleted     INTEGER                     NOT NULL DEFAULT 0,
    created_at  TEXT                        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TEXT                        NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS core_procedure_document (
  id TEXT NOT NULL PRIMARY KEY,
  procedure_id TEXT NOT NULL,
  name TEXT NOT NULL,
  required INTEGER NOT NULL DEFAULT 0,
  CONSTRAINT fk_procedure
    FOREIGN KEY (procedure_id)
    REFERENCES core_procedure(id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
);

CREATE INDEX IF NOT EXISTS idx_procedure_document_procedure_id ON core_procedure_document(procedure_id);

CREATE TABLE IF NOT EXISTS core_source (
    id             TEXT                        NOT NULL PRIMARY KEY,
    name           TEXT                        NOT NULL,
    path           TEXT                        NOT NULL,
    mime_type      TEXT,
    uploaded_at    TEXT                        NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS core_applicant (
    id             TEXT                        NOT NULL PRIMARY KEY,
    full_name      TEXT                        NOT NULL,
    nin            TEXT                        NOT NULL,
    phone_number   TEXT,
    address        TEXT,
    status         TEXT,
    created_at     TEXT                        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    TEXT                        NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS core_applicant_source (
    applicant_id TEXT NOT NULL,
    source_id    TEXT NOT NULL,
    PRIMARY KEY (applicant_id, source_id),
    CONSTRAINT fk__core_applicant_source__applicant_id
        FOREIGN KEY (applicant_id)
        REFERENCES core_applicant(id)
        ON DELETE CASCADE
        ON UPDATE NO ACTION,
    CONSTRAINT fk__core_applicant_source__source_id
        FOREIGN KEY (source_id)
        REFERENCES core_source(id)
        ON DELETE CASCADE
        ON UPDATE NO ACTION
);


CREATE TABLE IF NOT EXISTS core_application (
    id               TEXT                        NOT NULL PRIMARY KEY,
    applicant_id     TEXT                        NOT NULL,
    procedure_id     TEXT                        NOT NULL,
    mail_ref         TEXT,
    created_at       TEXT                        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at       TEXT                        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status           TEXT,
    state            TEXT,
    comment          TEXT,
    requested_amount REAL,
    received_amount  REAL,
    CONSTRAINT fk__core_application__applicant_id
        FOREIGN KEY (applicant_id)
        REFERENCES core_applicant(id)
        ON DELETE CASCADE
        ON UPDATE NO ACTION,
    CONSTRAINT fk__core_application__procedure_id
        FOREIGN KEY (procedure_id)
        REFERENCES core_procedure(id)
        ON DELETE CASCADE
        ON UPDATE NO ACTION
);

CREATE TABLE IF NOT EXISTS core_application_source (
    application_id TEXT NOT NULL,
    source_id      TEXT NOT NULL,
    PRIMARY KEY (application_id, source_id),
    CONSTRAINT fk__core_application_source__application_id
        FOREIGN KEY (application_id)
        REFERENCES core_application(id)
        ON DELETE CASCADE
        ON UPDATE NO ACTION,
    CONSTRAINT fk__core_application_source__source_id
        FOREIGN KEY (source_id)
        REFERENCES core_source(id)
        ON DELETE CASCADE
        ON UPDATE NO ACTION
);

/* Create indexes for better query performance */

-- core_application
CREATE INDEX IF NOT EXISTS idx_application_applicant_id ON core_application(applicant_id);
CREATE INDEX IF NOT EXISTS idx_application_procedure_id ON core_application(procedure_id);
CREATE INDEX IF NOT EXISTS idx_application_status ON core_application(status);
CREATE INDEX IF NOT EXISTS idx_application_state ON core_application(state);
CREATE INDEX IF NOT EXISTS idx_application_created_at ON core_application(created_at DESC);

-- core_applicant
CREATE INDEX IF NOT EXISTS idx_applicant_full_name ON core_applicant(full_name);
CREATE INDEX IF NOT EXISTS idx_applicant_status ON core_applicant(status);
CREATE INDEX IF NOT EXISTS idx_applicant_phone_number ON core_applicant(phone_number);
CREATE INDEX IF NOT EXISTS idx_applicant_nin ON core_applicant(nin);


/* Triggers for auto-updating updated_at timestamps */

CREATE TRIGGER IF NOT EXISTS update_core_applicant_timestamp
AFTER UPDATE ON core_applicant
FOR EACH ROW
BEGIN
    UPDATE core_applicant SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_core_procedure_timestamp
AFTER UPDATE ON core_procedure
FOR EACH ROW
BEGIN
    UPDATE core_procedure SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_core_application_timestamp
AFTER UPDATE ON core_application
FOR EACH ROW
BEGIN
    UPDATE core_application SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

`
# prompt 2
Here is my query string to get applications by procedure Id:
`
export const GET_APPLICATIONS_BY_PROCEDURE_ID = `
SELECT
  a.id,
  json_object(
    'id', apt.id, 'fullName', apt.full_name, 'nin', apt.nin, 'phoneNumber', apt.phone_number, 'address', apt.address, 'status', apt.status
  ) as applicant,
  a.mail_ref as mailRef,
  a.created_at as createdAt,
  a.status,
  a.state,
  a.requested_amount as requestedAmount,
  a.received_amount as receivedAmount,
  a.comment
FROM
  core_application a
  JOIN core_applicant apt ON a.applicant_id = apt.id
  JOIN core_procedure p ON a.procedure_id = p.id
WHERE
  p.id = ?1
`;
`
Here is my method get applications by procedure ID:
`
  async getApplicationsByProcedureId(procedureId: string) {
    const db = await openConnection();
    if (!db) {
      throw new Error('No database connection');
    }
    const applications: Partial<Application>[] = await db.select(
      GET_APPLICATIONS_BY_PROCEDURE_ID,
      [procedureId],
    );
    const results =
      applications.map((application) => {
        return {
          ...application,
          ...parseKey({ entity: application, key: 'applicant' }),
        };
      }) ?? [];
    await closeConnection(db);
    return results;
  }
`
Give me a method to filter applicaions by status, state,created_at, received_amount, requested_amount and applicant.full_name, applicant.nin, applicant.phone_number. Integrate pagination for the ui applications table.

# prompt 3
Here is my migration to create core_procedure:
`
-- Migration V1.0.1: Insert initial procedures into core_procedure table

INSERT INTO core_procedure (id, name, description, icon, created_at, updated_at, deleted) VALUES
(
    '4429d93b-2a7e-46b2-bcd9-e42461539e65',
    'Secours appelle des layennes',
    'Aide sociale exceptionnelle destinée aux pèlerins et résidents pour la célébration annuelle.',
    'pi pi-users',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    0
),
(
    '25a9432a-ffe2-460f-9b20-b36ea498dcf0',
    'Prise en charge médicale',
    'Prise en charge des frais d''hospitalisation et d''achat de médicaments pour les nécessiteux.',
    'pi pi-heart',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    0
),
(
    '4cb4ceec-c1e5-48f7-ab22-15af45bf4388',
    'Secours Tabaski',
    'Soutien aux familles vulnérables pour l''achat du bélier de la Tabaski.',
    'pi pi-calendar',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    0
),
(
    '525361e1-4525-44ff-ae9a-267a238e4d3b',
    'Secours pâque',
    'Soutien aux familles pour les fêtes de Pâque.',
    'pi pi-gift',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    0
);

INSERT INTO
  core_procedure_document (id, name, required, procedure_id)
VALUES
  (
    '95c988e1-dd0b-439d-8c22-b6d0872eefc6',
    'Demande manuscrite adressée au Maire',
    1,
    '4cb4ceec-c1e5-48f7-ab22-15af45bf4388'
  ),
  (
    '4f631321-448f-4309-9f14-8db6e1c84fdd',
    'Certificat de résidence à Yoff',
    1,
    '4cb4ceec-c1e5-48f7-ab22-15af45bf4388'
  );

`


# prompt 4
Here is my migration to create core_applicant:
`
/* Enable foreign key enforcement - MUST be first */
PRAGMA foreign_keys = ON;

INSERT INTO
  core_source (id, name, path, mime_type)
VALUES
  (
    '10a1855d-59da-4051-b57c-2754266713c3',
    'certificat_de_residence.pdf',
    'file:///C:/Users/SNGAYEM/AppData/Local/ecsas/Documents/Demandes/certificat_de_residence.pdf',
    'application/pdf'
  ),
  (
    '86ea06ca-77b7-474b-8005-5928b8d51bfd',
    'demande_adresse_au_maire.pdf',
    'file:///C:/Users/SNGAYEM/AppData/Local/ecsas/Documents/Demandes/demande_adresse_au_maire.pdf',
    'application/pdf'
  ),
  (
    '1744e044-5c9f-428b-9fcf-ae5619c0a2fd',
    'photocopie_CNI.png',
    'file:///C:/Users/SNGAYEM/AppData/Local/ecsas/Documents/Demandes/photocopie_CNI.png',
    'image/png'
  );


INSERT INTO
  core_applicant (id, full_name, nin, phone_number, address, status)
VALUES
  (
    'ab227af7-1fdf-4e64-8f3a-f45958a711b8',
    'Amidou Fall',
    '123456789',
    '+221 77 777 77 77',
    'Yoff dagoudane, Dakar, Senegal',
    'SOCIAL_CASE'
  ),
  (
    '79035fdc-82c7-485e-a08d-7827e2a7f0f5',
    'Pape Diop',
    '123456710',
    '+221 17 177 17 17',
    'Yoff Layenne, Dakar, Senegal',
    Null
  ),
  (
    '00e70afe-f876-4ac9-be8f-0c4f5c56ca14',
    'Fatoumata Sow',
    '223456740',
    '+221 49 497 49 49',
    'Yoff Apecsy 3, Dakar, Senegal',
    'NON_ESSENTIAL'
  );


INSERT INTO
  core_applicant_source (applicant_id, source_id)
VALUES
  (
    'ab227af7-1fdf-4e64-8f3a-f45958a711b8',
    '1744e044-5c9f-428b-9fcf-ae5619c0a2fd'
  );

`

# prompt5
Here is my migration to create core_application:
`
INSERT INTO
  core_application (
    id,
    applicant_id,
    procedure_id,
    mail_ref,
    status,
    state,
    requested_amount,
    received_amount
  )
VALUES
  (
    'ccb69e44-f55e-4a11-b365-ff882b2ad6dc',
    'ab227af7-1fdf-4e64-8f3a-f45958a711b8',
    '4cb4ceec-c1e5-48f7-ab22-15af45bf4388',
    'REF-767G56',
    'APPROVED',
    NULL,
    25000,
    15000
  );

`
Create another migration to create multiple application so that we can test application filter

# result
How to Test Your Filters with This Data
Once this migration runs, you can verify your TypeScript method with these scenarios:

Filter by Status:
status: 'PENDING' → Should return 2 items (Moussa Tabaski, Fatou Pâque).
status: 'APPROVED' → Should return 2 items (Cheikh, Oumar).
Filter by State:
state: 'SUBMITTED' → Should return 2 items.
state: 'PAYMENT_PARTIAL' → Should return 1 item.
Filter by Applicant Name:
fullName: 'Fall' → Should return 1 item (Aminata).
fullName: 'Di' → Should return 3 items (Moussa Diarra, Aminata Diop, Fatou Diop).
Filter by Amount:
requestedAmount: 50000 → Should return 1 item.
receivedAmount: 75000 → Should return 1 item.
Filter by Date Range:
createdAtFrom: '2026-04-01', createdAtTo: '2026-05-31' → Should return 3 items (Cheikh, Fatou, Oumar).
Pagination:
page: 1, pageSize: 2 → Should return the first 2 sorted results.
page: 2, pageSize: 2 → Should return the next 2.
