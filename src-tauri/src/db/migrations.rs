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
            description: "V1.0.7__insert_core_event.sql",
            sql: include_str!("../../migrations/V1.0.7__init_core_event.sql"),
            kind: MigrationKind::Up,
        },
    ]
}
