-- Migration V1.0.1: Insert initial procedures into core_procedure table

INSERT INTO core_procedure (id, name, description, start_date, end_date, status, type, created_at, updated_at) VALUES
(
    '4429d93b-2a7e-46b2-bcd9-e42461539e65',
    'Permis de Construire',
    'Demande de permis de construire pour travaux de construction ou extension',
    '2024-01-01',
    NULL,
    'active',
    'building',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),
(
    '25a9432a-ffe2-460f-9b20-b36ea498dcf0',
    'Demande de Subvention',
    'Demande de subvention pour projet économique ou social',
    '2024-01-15',
    NULL,
    'active',
    'funding',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),
(
    '82f2a051-f80b-4375-8b1e-1648dcccb4b8',
    'Certificat d''Conformité',
    'Obtention d''un certificat de conformité aux normes nationales',
    '2024-02-01',
    NULL,
    'active',
    'certification',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),
(
    '4cb4ceec-c1e5-48f7-ab22-15af45bf4388',
    'Enregistrement Commercial',
    'Enregistrement d''une nouvelle entreprise au registre commercial',
    '2024-01-10',
    NULL,
    'active',
    'business',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),
(
    'd9789b6a-046c-48d3-8e00-5b5e51f567d6',
    'Demande de Carte d''Identité',
    'Renouvellement ou obtention de carte d''identité nationale',
    '2024-03-01',
    NULL,
    'active',
    'identity',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),
(
    'c4d43342-a742-4fdd-8fc2-94f5e8f25e5c',
    'Licence d''Exploitation',
    'Demande de licence pour exploitation commerciale',
    '2024-01-20',
    NULL,
    'active',
    'license',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),
(
    '286bf91a-0cff-43a4-825b-4084cefd9d1b',
    'Appel d''Offres Public',
    'Soumission de candidature pour appel d''offres',
    '2024-02-15',
    '2024-06-30',
    'active',
    'tender',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),
(
    '74fcf20d-fd8d-4f82-a89e-ebb6633af80d',
    'Allocation Sociale',
    'Demande d''allocation d''aide sociale',
    '2024-01-05',
    NULL,
    'active',
    'welfare',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);
