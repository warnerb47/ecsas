// src-tauri/src/db/migrations.rs
use tauri_plugin_sql::{Migration, MigrationKind};

/// Returns the list of all database migrations.
/// Add new migrations to this vector as you create them.
pub fn get_migrations() -> Vec<Migration> {
    vec![
        Migration {
            version: 1,
            description: "create_initial_tables",
            sql: include_str!("../../migrations/V1.0.0__init.sql"),
            kind: MigrationKind::Up,
        },
        Migration {
            version: 2,
            description: "create_initial_tables",
            sql: include_str!("../../migrations/V1.0.1__insert_procedures.sql"),
            kind: MigrationKind::Up,
        },
    ]
}
