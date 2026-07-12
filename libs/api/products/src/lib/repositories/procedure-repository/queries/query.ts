export const GET_PROCEDURES_QUERY = `
      SELECT
          p.id,
          p.name,
          p.description,
          p.icon,
          p.deleted,
          -- Aggregate documents into a JSON array
          COALESCE(
              json_group_array(
                  json_object(
                      'id', d.id,
                      'name', d.name,
                      'required', d.required
                  )
              ) FILTER (WHERE d.id IS NOT NULL),
              '[]'
          ) as documents
      FROM core_procedure p
      LEFT JOIN core_procedure_document d ON p.id = d.procedure_id
      GROUP BY p.id
      ORDER BY p.name ASC;
    `;

export const GET_PROCEDURE_QUERY_BY_ID = `
      SELECT
          p.id,
          p.name,
          p.description,
          p.icon,
          p.deleted,
          -- Aggregate documents into a JSON array
          COALESCE(
              json_group_array(
                  json_object(
                      'id', d.id,
                      'name', d.name,
                      'required', d.required
                  )
              ) FILTER (WHERE d.id IS NOT NULL),
              '[]'
          ) as documents
      FROM core_procedure p
      LEFT JOIN core_procedure_document d ON p.id = d.procedure_id
      WHERE p.id = ?1
      GROUP BY p.id
    `;
