/* Enable foreign key enforcement */
PRAGMA foreign_keys = ON;

/* 1. Insert Additional Test Applicants */
/* Designed to test: fullName (LIKE), nin (exact), phoneNumber (LIKE), status */
INSERT INTO core_applicant (id, full_name, nin, phone_number, address, status, birthdate, created_at, updated_at) VALUES
(
    'a1111111-1111-1111-1111-111111111111',
    'Moussa Diarra',
    '987654321',
    '+221 78 100 10 10',
    'Yoff Virage, Dakar',
    'PENDING',
    '2006-01-10 08:00:00',
    '2026-01-10 08:00:00',
    '2026-01-10 08:00:00'
),
(
    'a2222222-2222-2222-2222-222222222222',
    'Aminata Fall',
    '112233445',
    '+221 77 200 20 20',
    'Yoff Tonghor, Dakar',
    'REJECTED',
    '2016-02-15 10:30:00',
    '2026-02-15 10:30:00',
    '2026-02-16 09:00:00'
),
(
    'a3333333-3333-3333-3333-333333333333',
    'Cheikh Tidiane Baye',
    '556677889',
    '+221 76 300 30 30',
    'Yoff Cap Manuel, Dakar',
    'SOCIAL_CASE',
    '2000-03-20 14:15:00',
    '2026-03-20 14:15:00',
    '2026-03-20 14:15:00'
),
(
    'a4444444-4444-4444-4444-444444444444',
    'Fatou Diop',
    '998877665',
    '+221 70 400 40 40',
    'Yoff Golf Sud, Dakar',
    'PENDING',
    '2001-04-05 11:00:00',
    '2026-04-05 11:00:00',
    '2026-04-05 11:00:00'
),
(
    'a5555555-5555-5555-5555-555555555555',
    'Oumar Sy',
    '443322110',
    '+221 75 500 50 50',
    'Yoff Ndiareme, Dakar',
    'APPROVED',
    '2003-05-12 16:45:00',
    '2026-05-12 16:45:00',
    '2026-05-13 10:00:00'
);

/* 2. Insert Additional Test Sources */
INSERT INTO core_source (id, name, path, mime_type, uploaded_at) VALUES
(
    's1111111-1111-1111-1111-111111111111',
    'cni_moussa.pdf',
    'file:///C:/Users/SNGAYEM/AppData/Local/ecsas/Documents/Demandes/cni_moussa.pdf',
    'application/pdf',
    '2026-01-10 08:00:00'
),
(
    's2222222-2222-2222-2222-222222222222',
    'certificat_aminata.pdf',
    'file:///C:/Users/SNGAYEM/AppData/Local/ecsas/Documents/Demandes/certificat_aminata.pdf',
    'application/pdf',
    '2026-02-15 10:30:00'
);

/* Link sources to applicants */
INSERT INTO core_applicant_source (applicant_id, source_id) VALUES
('a1111111-1111-1111-1111-111111111111', 's1111111-1111-1111-1111-111111111111'),
('a2222222-2222-2222-2222-222222222222', 's2222222-2222-2222-2222-222222222222');

/* 3. Insert Multiple Applications */
/* Designed to test: status, state, requested_amount, received_amount, created_at range, procedure_id */

/* Application 1: PENDING, High Amount, Recent */
INSERT INTO core_application (id, applicant_id, procedure_id, mail_ref, status, state, requested_amount, received_amount, created_at, updated_at) VALUES
(
    'app11111-1111-1111-1111-111111111111',
    'a1111111-1111-1111-1111-111111111111', -- Moussa Diarra
    '4cb4ceec-c1e5-48f7-ab22-15af45bf4388', -- Secours Tabaski
    'REF-TAB-001',
    'PENDING',
    'SUBMITTED',
    50000,
    NULL,
    '2026-06-01 09:00:00',
    '2026-06-01 09:00:00'
);

/* Application 2: REJECTED, Low Amount, Old */
INSERT INTO core_application (id, applicant_id, procedure_id, mail_ref, status, state, requested_amount, received_amount, created_at, updated_at) VALUES
(
    'app22222-2222-2222-2222-222222222222',
    'a2222222-2222-2222-2222-222222222222', -- Aminata Fall
    -- '25a9432a-ffe2-460f-9b20-b36ea498dcf0', -- Prise en charge médicale
    '4cb4ceec-c1e5-48f7-ab22-15af45bf4388', -- Secours Tabaski
    'REF-MED-002',
    'REJECTED',
    'VALIDATED',
    10000,
    0,
    '2026-01-20 11:00:00',
    '2026-01-21 15:00:00'
);

/* Application 3: APPROVED, Partial Payment, Medium Date */
INSERT INTO core_application (id, applicant_id, procedure_id, mail_ref, status, state, requested_amount, received_amount, created_at, updated_at) VALUES
(
    'app33333-3333-3333-3333-333333333333',
    'a3333333-3333-3333-3333-333333333333', -- Cheikh Tidiane Baye
    '4cb4ceec-c1e5-48f7-ab22-15af45bf4388', -- Secours Tabaski
    'REF-TAB-003',
    'APPROVED',
    'PAYMENT_PARTIAL',
    30000,
    15000,
    '2026-03-25 10:00:00',
    '2026-04-01 12:00:00'
);

/* Application 4: PENDING, Different Procedure, Medium Amount */
INSERT INTO core_application (id, applicant_id, procedure_id, mail_ref, status, state, requested_amount, received_amount, created_at, updated_at) VALUES
(
    'app44444-4444-4444-4444-444444444444',
    'a4444444-4444-4444-4444-444444444444', -- Fatou Diop
    -- '525361e1-4525-44ff-ae9a-267a238e4d3b', -- Secours pâque
    '4cb4ceec-c1e5-48f7-ab22-15af45bf4388', -- Secours Tabaski
    'REF-PAQ-004',
    'PENDING',
    'SUBMITTED',
    20000,
    NULL,
    '2026-04-10 14:30:00',
    '2026-04-10 14:30:00'
);

/* Application 5: APPROVED, Full Payment, Recent */
INSERT INTO core_application (id, applicant_id, procedure_id, mail_ref, status, state, requested_amount, received_amount, created_at, updated_at) VALUES
(
    'app55555-5555-5555-5555-555555555555',
    'a5555555-5555-5555-5555-555555555555', -- Oumar Sy
    -- '4429d93b-2a7e-46b2-bcd9-e42461539e65', -- Secours appelle des layennes
    '4cb4ceec-c1e5-48f7-ab22-15af45bf4388', -- Secours Tabaski
    'REF-LAY-005',
    'APPROVED',
    'PAYMENT_COMPLETE',
    75000,
    75000,
    '2026-05-15 09:15:00',
    '2026-05-20 11:00:00'
);

/* Application 6: Same Applicant as #1, Different Status (to test duplicates) */
INSERT INTO core_application (id, applicant_id, procedure_id, mail_ref, status, state, requested_amount, received_amount, created_at, updated_at) VALUES
(
    'app66666-6666-6666-6666-666666666666',
    'a1111111-1111-1111-1111-111111111111', -- Moussa Diarra
    -- '25a9432a-ffe2-460f-9b20-b36ea498dcf0', -- Prise en charge médicale
    '4cb4ceec-c1e5-48f7-ab22-15af45bf4388', -- Secours Tabaski
    'REF-MED-006',
    'VALIDATED',
    'REVIEW',
    45000,
    NULL,
    '2026-06-10 16:00:00',
    '2026-06-10 16:00:00'
);
