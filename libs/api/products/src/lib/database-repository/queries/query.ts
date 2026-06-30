export const GET_PROCEDURES_QUERY = `
      SELECT
          p.id,
          p.name,
          p.description,
          p.start_date,
          p.end_date,
          p.status,
          json_object('id', pt.id, 'label', pt.label, 'value', pt.value, 'color', pt.color, 'icon', pt.icon) as type,
          p.created_at,
          p.updated_at,
          -- Aggregate documents into a JSON array
          COALESCE(
              json_group_array(
                  json_object(
                      'name', d.name,
                      'required', d.required
                  )
              ) FILTER (WHERE d.id IS NOT NULL),
              '[]'
          ) as documents
      FROM core_procedure p
      LEFT JOIN core_procedure_document d ON p.id = d.procedure_id
      LEFT JOIN core_procedure_type pt ON p.type = pt.id
      GROUP BY p.id;
    `;
