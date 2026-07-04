export const GET_PROCEDURES_QUERY = `
      SELECT
          p.id,
          p.name,
          p.description,
          strftime('%Y-%m-%dT%H:%M:%S.000Z', p.start_date) as startDate,
          strftime('%Y-%m-%dT%H:%M:%S.000Z', p.end_date) as endDate,
          p.status,
          json_object('id', pt.id, 'label', pt.label, 'value', pt.value, 'color', pt.color, 'icon', pt.icon) as type,
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
      GROUP BY p.id
      ORDER BY p.start_date DESC;
    `;

export const GET_PROCEDURE_TYPE_QUERY = `SELECT id, label, value, color, icon FROM core_procedure_type;`;


export const GET_PROCEDURE_QUERY_BY_ID = `
      SELECT
          p.id,
          p.name,
          p.description,
          strftime('%Y-%m-%dT%H:%M:%S.000Z', p.start_date) as startDate,
          strftime('%Y-%m-%dT%H:%M:%S.000Z', p.end_date) as endDate,
          p.status,
          json_object('id', pt.id, 'label', pt.label, 'value', pt.value, 'color', pt.color, 'icon', pt.icon) as type,
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
      WHERE p.id = ?1
      GROUP BY p.id
    `;
