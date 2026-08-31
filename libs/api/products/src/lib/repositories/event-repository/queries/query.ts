export const GET_EVENT_BY_ID = `
SELECT
  e.id,
  e.name,
  e.type,
  e.status,
  e.start_date as startDate,
  e.end_date as endDate,
  e.start_time as startTime,
  e.end_time as endTime,
  e.location,
  e.expected_participants as expectedParticipants,
  e.description,
  e.budget,
  e.procedure_id as procedureId,
  e.created_at as createdAt,
  e.updated_at as updatedAt,
  COALESCE(
    json_group_array(DISTINCT json_object(
      'id', exp.id,
      'label', exp.label,
      'category', exp.category,
      'planned', exp.planned,
      'spent', exp.spent,
      'date', exp.date
    )) FILTER (WHERE exp.id IS NOT NULL),
    '[]'
  ) as expenses,
  COALESCE(
    json_group_array(DISTINCT json_object(
      'id', p.id,
      'name', p.name,
      'role', p.role,
      'contact', p.contact,
      'color', p.color
    )) FILTER (WHERE p.id IS NOT NULL),
    '[]'
  ) as partners,
  COALESCE(
    json_group_array(DISTINCT json_object(
      'id', l.id,
      'label', l.label,
      'url', l.url
    )) FILTER (WHERE l.id IS NOT NULL),
    '[]'
  ) as usefulLinks,
  COALESCE(
    json_group_array(DISTINCT json_object(
      'id', d.id,
      'type', d.type,
      'status', d.status,
      'fileName', d.file_name
    )) FILTER (WHERE d.id IS NOT NULL),
    '[]'
  ) as documents
FROM
  core_event e
  LEFT JOIN core_event_expense exp ON e.id = exp.event_id
  LEFT JOIN core_event_partner p ON e.id = p.event_id
  LEFT JOIN core_event_link l ON e.id = l.event_id
  LEFT JOIN core_event_document d ON e.id = d.event_id
WHERE
  e.id = ?1
GROUP BY e.id
`;
