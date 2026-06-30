use tauri_plugin_sql::{Migration, MigrationKind};
pub fn get_migrations() -> Vec<Migration> {
    vec![
        Migration {
            version: 1,
            description: "V1.0.0__init.sql",
            sql: include_str!("../../migrations/V1.0.0__init.sql"),
            kind: MigrationKind::Up,
        },
        Migration {
            version: 2,
            description: "V1.0.1__insert_procedures.sql",
            sql: include_str!("../../migrations/V1.0.1__insert_procedures.sql"),
            kind: MigrationKind::Up,
        },
        Migration {
            version: 3,
            description: "V1.2.0__create_table_core_procedure_document.sql",
            sql: include_str!("../../migrations/V1.2.0__create_table_core_procedure_document.sql"),
            kind: MigrationKind::Up,
        },
        Migration {
            version: 4,
            description: "V1.2.1__insert_core_procedure_document.sql",
            sql: include_str!("../../migrations/V1.2.1__insert_core_procedure_document.sql"),
            kind: MigrationKind::Up,
        },
        Migration {
            version: 5,
            description: "V1.3.0__create_table_core_procedure_type.sql",
            sql: include_str!("../../migrations/V1.3.0__create_table_core_procedure_type.sql"),
            kind: MigrationKind::Up,
        },
        Migration {
            version: 6,
            description: "V1.3.1__insert_core_procedure_type.sql",
            sql: include_str!("../../migrations/V1.3.1__insert_core_procedure_type.sql"),
            kind: MigrationKind::Up,
        },
        Migration {
            version: 7,
            description: "V1.4.1__alter_table_core_procedure.sql",
            sql: include_str!("../../migrations/V1.4.1__alter_table_core_procedure.sql"),
            kind: MigrationKind::Up,
        },
        Migration {
            version: 8,
            description: "V1.4.2__insert_core_procedure_document.sql",
            sql: include_str!("../../migrations/V1.4.2__insert_core_procedure_document.sql"),
            kind: MigrationKind::Up,
        },
    ]
}
