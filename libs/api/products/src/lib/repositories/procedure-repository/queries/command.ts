export const CREATE_PRODUCT_COMMAND = `
-- 1. Start a transaction to ensure all or nothing is saved
BEGIN TRANSACTION;

-- 2. Insert the main procedure record
INSERT INTO core_procedure (
    id,
    name,
    description,
    start_date,
    end_date,
    status,
    type
) VALUES (
    'GENERATE_PROCEDURE_UUID_HERE',  -- Replace with generated UUID string
    'Secours Tabaski 2026',
    'Soutien aux familles vulnérables pour la fête de Tabaski.',
    '2026-06-30T23:41:37.705Z',
    '2026-07-30T00:00:00.000Z',
    'IN_PROGRESS',
    '6cba9055-735e-4909-b345-466c590696d9'
);

-- 3. Insert Document 1 (required: true -> 1)
INSERT INTO core_procedure_document (id, procedure_id, name, required)
VALUES ('GENERATE_DOC_UUID_1', 'GENERATE_PROCEDURE_UUID_HERE', 'Demande adressée au maire', 1);

-- 4. Insert Document 2 (required: true -> 1)
INSERT INTO core_procedure_document (id, procedure_id, name, required)
VALUES ('GENERATE_DOC_UUID_2', 'GENERATE_PROCEDURE_UUID_HERE', 'Photocopie carte d\'identité', 1);

-- 5. Insert Document 3 (required: false -> 0)
INSERT INTO core_procedure_document (id, procedure_id, name, required)
VALUES ('GENERATE_DOC_UUID_3', 'GENERATE_PROCEDURE_UUID_HERE', 'Certificat de domicile', 0);

-- 6. Commit the transaction to write to disk permanently
COMMIT;


`;
