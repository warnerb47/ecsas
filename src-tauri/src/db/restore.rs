use sqlx::SqlitePool;
use std::fs::{self, File};
use std::io::{Read, Write};
use std::path::PathBuf;
use tauri::{AppHandle, Manager};
use zip::ZipArchive;

#[tauri::command]
pub async fn restore_backup(
    app: AppHandle,
    backup_path: String,
    merge_mode: bool,
) -> Result<String, String> {
    // Get app local data directory
    let app_local_data_dir = app.path().app_local_data_dir().map_err(|e| e.to_string())?;

    let app_data_dir = app.path().app_data_dir().map_err(|e| e.to_string())?;

    let db_path = app_data_dir.join("ecsas.db");
    let documents_dir = app_local_data_dir.join("Documents");

    // Extract zip file
    let zip_file =
        File::open(&backup_path).map_err(|e| format!("Failed to open backup file: {}", e))?;

    let mut archive = ZipArchive::new(zip_file).map_err(|e| format!("Invalid zip file: {}", e))?;

    let  temp_db_path = app_data_dir.join("ecsas_restore_temp.db");

    // Extract database file
    let mut db_file = File::create(&temp_db_path).map_err(|e| e.to_string())?;

    let mut db_zip_file = archive
        .by_name("ecsas.db")
        .map_err(|e| format!("Database file not found in backup: {}", e))?;

    let mut db_buffer = Vec::new();
    db_zip_file
        .read_to_end(&mut db_buffer)
        .map_err(|e| e.to_string())?;

    db_file.write_all(&db_buffer).map_err(|e| e.to_string())?;

    drop(db_file);
    drop(db_zip_file);

    if merge_mode {
        // Merge strategy: import data from backup into existing database
        merge_databases(&db_path, &temp_db_path)
            .await
            .map_err(|e| format!("Merge failed: {}", e))?;

        fs::remove_file(&temp_db_path).map_err(|e| e.to_string())?;
    } else {
        // Overwrite strategy: replace database file
        if db_path.exists() {
            // Create backup of current database before overwrite
            let backup_before = app_data_dir.join("ecsas_pre_restore_backup.db");
            fs::copy(&db_path, &backup_before).map_err(|e| e.to_string())?;
        }

        fs::rename(&temp_db_path, &db_path)
            .map_err(|e| format!("Failed to replace database: {}", e))?;
    }

    // Extract assets
    if documents_dir.exists() {
        fs::remove_dir_all(&documents_dir).map_err(|e| e.to_string())?;
    }
    fs::create_dir_all(&documents_dir).map_err(|e| e.to_string())?;

    for i in 0..archive.len() {
        let mut file = archive.by_index(i).map_err(|e| e.to_string())?;

        let filepath = file.enclosed_name().ok_or("Invalid file path in zip")?;

        if filepath.starts_with("Documents/") {
            let relative_path = filepath
                .strip_prefix("Documents/")
                .map_err(|e| e.to_string())?;

            let target_path = documents_dir.join(relative_path);

            if relative_path.parent().is_some() {
                fs::create_dir_all(target_path.parent().unwrap()).map_err(|e| e.to_string())?;
            }

            let mut outfile = File::create(&target_path).map_err(|e| e.to_string())?;

            let mut buffer = Vec::new();
            file.read_to_end(&mut buffer).map_err(|e| e.to_string())?;

            outfile.write_all(&buffer).map_err(|e| e.to_string())?;
        }
    }

    Ok("Restore completed successfully".to_string())
}

pub async fn merge_databases(target_path: &PathBuf, source_path: &PathBuf) -> Result<(), String> {
    // Create connection pool to target database
    let pool = SqlitePool::connect(&format!("sqlite:{}", target_path.display()))
        .await
        .map_err(|e| format!("Failed to connect to target database: {}", e))?;

    // Enable foreign keys (must be done per connection in SQLite)
    sqlx::query("PRAGMA foreign_keys = ON")
        .execute(&pool)
        .await
        .map_err(|e| format!("Failed to enable foreign keys: {}", e))?;

    // Attach the source database
    let attach_sql = format!("ATTACH DATABASE '{}' AS backup_db", source_path.display());

    sqlx::query(&attach_sql)
        .execute(&pool)
        .await
        .map_err(|e| format!("Failed to attach source database: {}", e))?;

    // Begin transaction for atomic merge
    let mut tx = pool
        .begin()
        .await
        .map_err(|e| format!("Failed to begin transaction: {}", e))?;

    // List of tables to merge (respecting foreign key order)
    let tables = vec![
        "core_user",
        "core_procedure",
        "core_procedure_document",
        "core_source",
        "core_applicant",
        "core_applicant_source",
        "core_application",
        "core_application_source",
    ];

    // Merge each table using INSERT OR IGNORE to avoid duplicates
    for table in tables {
        let merge_sql = format!(
            "INSERT OR IGNORE INTO {} SELECT * FROM backup_db.{}",
            table, table
        );

        sqlx::query(&merge_sql)
            .execute(&mut *tx)
            .await
            .map_err(|e| format!("Failed to merge table {}: {}", table, e))?;
    }

    // Commit transaction
    tx.commit()
        .await
        .map_err(|e| format!("Failed to commit transaction: {}", e))?;

    // Detach source database
    sqlx::query("DETACH DATABASE backup_db")
        .execute(&pool)
        .await
        .map_err(|e| format!("Failed to detach source database: {}", e))?;

    Ok(())
}
