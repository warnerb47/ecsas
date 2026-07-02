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
