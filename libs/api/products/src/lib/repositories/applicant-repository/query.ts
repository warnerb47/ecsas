export const SEARCH_APPLICANT = `
SELECT
  id,
  full_name as fullName,
  nin,
  phone_number as phoneNumber,
  address,
  status,
  created_at
FROM
  core_applicant
WHERE
  full_name LIKE ?1
  OR nin LIKE ?1
  OR phone_number LIKE ?1
`;


export const GET_APPLICANT_BY_ID = `
SELECT
  core_applicant.id,
  core_applicant.full_name as fullName,
  core_applicant.nin,
  core_applicant.phone_number as phoneNumber,
  core_applicant.address,
  core_applicant.status,
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
  ) as sources
FROM core_applicant
LEFT JOIN core_applicant_source ON core_applicant.id = core_applicant_source.applicant_id
LEFT JOIN core_source ON core_applicant_source.source_id = core_source.id
WHERE core_applicant.id = ?1
GROUP BY core_applicant.id
`;
