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

export const GET_APPLICATION_BY_ID = `
SELECT
  a.id,
  json_object(
    'id', apt.id, 'fullName', apt.full_name, 'nin', apt.nin, 'phoneNumber', apt.phone_number, 'address', apt.address, 'status', apt.status
  ) as applicant,
  COALESCE(
      json_group_array(
          json_object(
              'id', core_source.id,
              'name', core_source.name,
              'path', core_source.path,
              'mimeType', core_source.mime_type,
              'uploadedAt', core_source.uploaded_at
          )
      ) FILTER (WHERE core_source.id IS NOT NULL),
      '[]'
  ) as sources,
  a.mail_ref as mailRef,
  a.created_at as createdAt,
  a.status,
  a.state,
  a.amount
FROM
  core_application a
  JOIN core_applicant apt ON a.applicant_id = apt.id
  LEFT JOIN core_application_source ON a.id = core_application_source.application_id
  LEFT JOIN core_source ON core_application_source.source_id = core_source.id
WHERE
  a.id = ?1
GROUP BY a.id
`;
