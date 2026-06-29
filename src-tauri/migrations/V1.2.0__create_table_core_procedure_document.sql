-- Create the new child table with a Foreign Key
CREATE TABLE IF NOT EXISTS core_procedure_document (
  id TEXT NOT NULL PRIMARY KEY,
  procedure_id TEXT NOT NULL,
  name TEXT NOT NULL,
  required INTEGER NOT NULL DEFAULT 0,
  -- Define Foreign Key Constraint
  CONSTRAINT fk_procedure FOREIGN KEY (procedure_id) REFERENCES core_procedure(id) ON DELETE CASCADE ON UPDATE NO ACTION
);

-- Create an index on the foreign key column for faster lookups
CREATE INDEX IF NOT EXISTS idx_procedure_document_procedure_id ON core_procedure_document(procedure_id);
