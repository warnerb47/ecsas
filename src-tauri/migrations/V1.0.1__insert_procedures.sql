-- Migration V1.0.1: Insert initial procedures into core_procedure table

INSERT INTO core_procedure (id, name, description, start_date, end_date, status, type, created_at, updated_at) VALUES
(
    '4429d93b-2a7e-46b2-bcd9-e42461539e65',
    'Appel des Layennes 2025',
    'Aide sociale exceptionnelle destinée aux pèlerins et résidents pour la célébration annuelle.',
    '2025-01-15',
    NULL,
    'IN_PROGRESS',
    'LAYENNES',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),
(
    '25a9432a-ffe2-460f-9b20-b36ea498dcf0',
    'Secours Médical',
    'Prise en charge des frais d''hospitalisation et d''achat de médicaments pour les nécessiteux.',
    '2025-02-01',
    NULL,
    'IN_PROGRESS',
    'MEDICAL',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),
(
    '4cb4ceec-c1e5-48f7-ab22-15af45bf4388',
    'Aide Tabaski 2024',
    'Soutien aux familles vulnérables pour l''achat du bélier de la Tabaski.',
    '2024-01-10',
    '2024-06-30',
    'COMPLETED',
    'TABASKI',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);
