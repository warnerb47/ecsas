PRAGMA foreign_keys = ON;

/* Core event */
CREATE TABLE IF NOT EXISTS core_event (
    id                      TEXT NOT NULL PRIMARY KEY,
    name                    TEXT NOT NULL,
    type                    TEXT NOT NULL DEFAULT 'MEETING',
    status                  TEXT NOT NULL DEFAULT 'PLANNED',
    start_date              TEXT NOT NULL,
    end_date                TEXT NOT NULL,
    start_time              TEXT,
    end_time                TEXT,
    location                TEXT,
    expected_participants   INTEGER,
    description             TEXT,
    budget                  REAL NOT NULL DEFAULT 0,
    procedure_id            TEXT,
    created_at              TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at              TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_event_procedure
        FOREIGN KEY (procedure_id)
        REFERENCES core_procedure(id)
        ON DELETE SET NULL
        ON UPDATE NO ACTION
);

CREATE INDEX IF NOT EXISTS idx_event_start_date ON core_event(start_date);
CREATE INDEX IF NOT EXISTS idx_event_status ON core_event(status);
CREATE INDEX IF NOT EXISTS idx_event_type ON core_event(type);

/* Event expense */
CREATE TABLE IF NOT EXISTS core_event_expense (
    id          TEXT NOT NULL PRIMARY KEY,
    event_id    TEXT NOT NULL,
    label       TEXT NOT NULL,
    category    TEXT,
    planned     REAL NOT NULL DEFAULT 0,
    spent       REAL NOT NULL DEFAULT 0,
    date        TEXT,
    CONSTRAINT fk_event_expense_event
        FOREIGN KEY (event_id)
        REFERENCES core_event(id)
        ON DELETE CASCADE
        ON UPDATE NO ACTION
);

CREATE INDEX IF NOT EXISTS idx_event_expense_event_id ON core_event_expense(event_id);

/* Event partner */
CREATE TABLE IF NOT EXISTS core_event_partner (
    id          TEXT NOT NULL PRIMARY KEY,
    event_id    TEXT NOT NULL,
    name        TEXT NOT NULL,
    role        TEXT,
    contact     TEXT,
    color       TEXT,
    CONSTRAINT fk_event_partner_event
        FOREIGN KEY (event_id)
        REFERENCES core_event(id)
        ON DELETE CASCADE
        ON UPDATE NO ACTION
);

CREATE INDEX IF NOT EXISTS idx_event_partner_event_id ON core_event_partner(event_id);

/* Event useful link */
CREATE TABLE IF NOT EXISTS core_event_link (
    id          TEXT NOT NULL PRIMARY KEY,
    event_id    TEXT NOT NULL,
    label       TEXT NOT NULL,
    url         TEXT,
    CONSTRAINT fk_event_link_event
        FOREIGN KEY (event_id)
        REFERENCES core_event(id)
        ON DELETE CASCADE
        ON UPDATE NO ACTION
);

CREATE INDEX IF NOT EXISTS idx_event_link_event_id ON core_event_link(event_id);

/* Event document */
CREATE TABLE IF NOT EXISTS core_event_document (
    id          TEXT NOT NULL PRIMARY KEY,
    event_id    TEXT NOT NULL,
    type        TEXT NOT NULL,
    status      TEXT NOT NULL DEFAULT 'MISSING',
    file_name   TEXT,
    source_id   TEXT,
    CONSTRAINT fk_event_document_event
        FOREIGN KEY (event_id)
        REFERENCES core_event(id)
        ON DELETE CASCADE
        ON UPDATE NO ACTION,
    CONSTRAINT fk_event_document_source
        FOREIGN KEY (source_id)
        REFERENCES core_source(id)
        ON DELETE SET NULL
        ON UPDATE NO ACTION
);

CREATE INDEX IF NOT EXISTS idx_event_document_event_id ON core_event_document(event_id);

/* Trigger for auto-updating event updated_at */
CREATE TRIGGER IF NOT EXISTS update_core_event_timestamp
AFTER UPDATE ON core_event
FOR EACH ROW
BEGIN
    UPDATE core_event SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;
