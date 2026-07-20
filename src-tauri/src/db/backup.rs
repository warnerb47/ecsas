use std::fs::{self, File};
use std::io::{Read, Write};
use std::path::PathBuf;
use zip::write::ZipWriter;
use tauri::{AppHandle, Manager};


#[tauri::command]
pub async fn create_backup(app: AppHandle) -> Result<String, String> {
    // Get app local data directory
    let app_local_data_dir = app.path()
        .app_local_data_dir()
        .map_err(|e| e.to_string())?;

    let app_data_dir = app.path()
        .app_data_dir()
        .map_err(|e| e.to_string())?;

    let db_path = app_data_dir.join("ecsas.db");
    let documents_dir = app_local_data_dir.join("Documents");

    // Verify database exists
    if !db_path.exists() {
        return Err("Database file not found".to_string());
    }

    // Create backup directory if it doesn't exist
    let backup_dir = app_local_data_dir.join("backups");
    fs::create_dir_all(&backup_dir)
        .map_err(|e| format!("Failed to create backup directory: {}", e))?;

    // Create zip file
    let timestamp = chrono::Local::now().format("%Y%m%d_%H%M%S");
    let zip_filename = format!("ecsas_backup_{}.zip", timestamp);
    let zip_path = backup_dir.join(&zip_filename);

    let zip_file = File::create(&zip_path)
        .map_err(|e| format!("Failed to create zip file: {}", e))?;

    let mut zip = ZipWriter::new(zip_file);

    // Add database file to zip
    zip.start_file("ecsas.db", zip::write::FileOptions::<()>::default())
        .map_err(|e| e.to_string())?;

    let mut db_buffer = Vec::new();
    fs::File::open(&db_path)
        .map_err(|e| e.to_string())?
        .read_to_end(&mut db_buffer)
        .map_err(|e| e.to_string())?;

    zip.write_all(&db_buffer)
        .map_err(|e| e.to_string())?;

    // Add documents directory if it exists
    if documents_dir.exists() {
        add_directory_to_zip(&mut zip, &documents_dir, "Documents")
            .map_err(|e| e.to_string())?;
    }

    zip.finish()
        .map_err(|e| e.to_string())?;

    Ok(zip_path.to_string_lossy().to_string())
}

fn add_directory_to_zip(
    zip: &mut ZipWriter<File>,
    dir: &PathBuf,
    prefix: &str,
) -> std::io::Result<()> {
    for entry in fs::read_dir(dir)? {
        let entry = entry?;
        let path = entry.path();

        if path.is_file() {
            let relative_path = format!("{}/{}", prefix, path.file_name().unwrap().to_string_lossy());
            zip.start_file(relative_path, zip::write::FileOptions::<()>::default())?;

            let mut buffer = Vec::new();
            fs::File::open(&path)?.read_to_end(&mut buffer)?;
            zip.write_all(&buffer)?;
        } else if path.is_dir() {
            add_directory_to_zip(zip, &path, &format!("{}/{}", prefix, path.file_name().unwrap().to_string_lossy()))?;
        }
    }
    Ok(())
}
