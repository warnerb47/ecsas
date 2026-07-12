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
