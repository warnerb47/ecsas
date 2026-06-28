/* Enable foreign key enforcement - MUST be first */
PRAGMA foreign_keys = ON;

/* Create ecsas database schema tables */

CREATE TABLE IF NOT EXISTS core_user (
    id         TEXT                        NOT NULL PRIMARY KEY,
    login      TEXT                        NOT NULL UNIQUE,
    password   TEXT                        NOT NULL,
    created_at TEXT                        NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS core_applicant (
    id         TEXT                        NOT NULL PRIMARY KEY,
    full_name  TEXT                        NOT NULL,
    nin        TEXT                        NOT NULL UNIQUE,
    address    TEXT,
    status     TEXT                        NOT NULL,
    created_at TEXT                        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT                        NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS core_procedure (
    id          TEXT                        NOT NULL PRIMARY KEY,
    name        TEXT                        NOT NULL,
    description TEXT,
    start_date  TEXT,                      -- Renamed from 'begin' (reserved keyword)
    end_date    TEXT,                      -- Renamed from 'end' (reserved keyword)
    status      TEXT                        NOT NULL,
    type        TEXT                        NOT NULL,
    created_at  TEXT                        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TEXT                        NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS core_application (
    id           TEXT                        NOT NULL PRIMARY KEY,
    applicant_id TEXT                        NOT NULL,
    procedure_id TEXT                        NOT NULL,
    mail_ref     TEXT,
    status       TEXT                        NOT NULL,
    state        TEXT                        NOT NULL,
    amount       REAL,                       -- Changed from numeric(12,2); SQLite ignores precision
    created_at   TEXT                        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at   TEXT                        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (applicant_id) REFERENCES core_applicant(id) ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY (procedure_id) REFERENCES core_procedure(id) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS core_application_file (
    id             TEXT                        NOT NULL PRIMARY KEY,
    application_id TEXT                        NOT NULL,
    file_name      TEXT                        NOT NULL,
    file_path      TEXT                        NOT NULL,
    mime_type      TEXT,
    uploaded_at    TEXT                        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (application_id) REFERENCES core_application(id) ON DELETE CASCADE
);

/* Create indexes for better query performance */
CREATE INDEX IF NOT EXISTS idx_application_applicant_id ON core_application(applicant_id);
CREATE INDEX IF NOT EXISTS idx_application_procedure_id ON core_application(procedure_id);
CREATE INDEX IF NOT EXISTS idx_application_file_application_id ON core_application_file(application_id);
CREATE INDEX IF NOT EXISTS idx_applicant_nin ON core_applicant(nin);
CREATE INDEX IF NOT EXISTS idx_user_login ON core_user(login);

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
