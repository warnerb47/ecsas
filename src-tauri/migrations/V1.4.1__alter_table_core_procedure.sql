PRAGMA foreign_keys=off;

-- 1. Update existing data: Replace string values with UUIDs from core_procedure_type
UPDATE core_procedure
SET type = (
    SELECT id FROM core_procedure_type
    WHERE core_procedure_type.value = core_procedure.type
);

-- 2. Rename the old table
ALTER TABLE core_procedure RENAME TO _core_procedure_old;

-- 3. Create the new table with the Foreign Key constraint pointing to core_procedure_type.id
CREATE TABLE core_procedure (
    id          TEXT                        NOT NULL PRIMARY KEY,
    name        TEXT                        NOT NULL,
    description TEXT,
    start_date  TEXT,
    end_date    TEXT,
    status      TEXT                        NOT NULL,
    type        TEXT                        NOT NULL,
    created_at  TEXT                        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TEXT                        NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_procedure_type
        FOREIGN KEY (type)
        REFERENCES core_procedure_type(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

-- 4. Copy data back (type is now a UUID)
INSERT INTO core_procedure (id, name, description, start_date, end_date, status, type, created_at, updated_at)
SELECT id, name, description, start_date, end_date, status, type, created_at, updated_at
FROM _core_procedure_old;

-- 5. Drop the old table
DROP TABLE IF EXISTS _core_procedure_old;

PRAGMA foreign_keys=on;
