# Prompt 1
I am using angular with tauri v2 and sqlite. Here is my init_migration:
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
    birthdate      TEXT,
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

This app work offline so I want to integrate a backup to export sqlite data and assets in AppLocalData as zip file. How can I handle this backup functionnality ?
I want to implement backup import to overwirte or merge with existing data. How can I handle this ?
