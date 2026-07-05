mod db;

use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::Arc;
use tauri::Manager;
use tauri_plugin_shell::ShellExt;

// État global pour suivre si le serveur OCR est déjà lancé
struct AppState {
    server_running: AtomicBool,
}

#[tauri::command]
async fn start_ocr_server(app: tauri::AppHandle) -> Result<String, String> {
    let state = app.state::<AppState>();

    // Vérifier si déjà lancé pour éviter les doublons
    if state.server_running.load(Ordering::Relaxed) {
        return Ok("Serveur OCR déjà en cours d'exécution".to_string());
    }

    let shell = app.shell();

    // Configuration du sidecar avec vos arguments spécifiques
    let sidecar_command = shell
        .sidecar("llama-server")
        .map_err(|e| format!("Échec initialisation sidecar: {}", e))?;

    let (_rx, _child) = sidecar_command
        .args([
            "-m", "../resources/Qwen3VL-2B-Instruct-Q8_0.gguf",
            "--mmproj", "../resources/mmproj-Qwen3VL-2B-Instruct-F16.gguf",
            "--port", "8080",
            "-t", "8",
            "--ctx-size", "4096",
            "--mlock"
        ])
        .spawn()
        .map_err(|e| format!("Échec démarrage serveur: {}", e))?;

    // Marquer comme lancé
    state.server_running.store(true, Ordering::Relaxed);

    Ok("Serveur OCR démarré avec succès sur le port 8080".to_string())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(
            tauri_plugin_sql::Builder::new()
                .add_migrations("sqlite:ecsas.db", db::migrations::get_migrations())
                .build(),
        )
        .manage(AppState {
            server_running: AtomicBool::new(false)
        })
        .invoke_handler(tauri::generate_handler![start_ocr_server])
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
