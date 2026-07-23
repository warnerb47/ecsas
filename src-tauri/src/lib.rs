mod db;
mod server;
use std::sync::Mutex;
use tauri::{Manager, State, WindowEvent};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(
            tauri_plugin_sql::Builder::new()
                .add_migrations("sqlite:ecsas.db", db::migrations::get_migrations())
                .build(),
        )
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
        .manage(server::llama::LlamaState {
            process: Mutex::new(None),
        })
        .invoke_handler(tauri::generate_handler![
            server::llama::start_llama_server,
            server::llama::stop_llama_server,
            server::llama::get_llama_status,
            db::backup::create_backup,
            db::restore::restore_backup,
        ])
        .on_window_event(|window, event| match event {
            WindowEvent::Destroyed => {
                // Access the state from the window
                let state: State<server::llama::LlamaState> = window.state();
                let mut proc = state.process.lock().unwrap();

                if let Some(child) = proc.take() {
                    if let Err(e) = child.kill() {
                        eprintln!("Failed to kill llama-server on exit: {}", e);
                    } else {
                        println!("Llama server stopped successfully on app close.");
                    }
                }
            }
            _ => {}
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
