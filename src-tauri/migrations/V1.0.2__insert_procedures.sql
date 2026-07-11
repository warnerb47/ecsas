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
