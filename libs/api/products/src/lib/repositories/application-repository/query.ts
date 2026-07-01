export const GET_APPLICATIONS_BY_PROCEDURE_ID = `
SELECT
  a.id,
  json_object(
    'id', apt.id, 'fullName', apt.full_name, 'nin', apt.nin, 'phoneNumber', apt.phone_number, 'address', apt.address, 'status', apt.status
  ) as applicant,
  a.mail_ref as mailRef,
  a.created_at as createdAt,
  a.status,
  a.state,
  a.amount
FROM
  core_application a
  JOIN core_applicant apt ON a.applicant_id = apt.id
  JOIN core_procedure p ON a.procedure_id = p.id
WHERE
  p.id = ?1
`;
