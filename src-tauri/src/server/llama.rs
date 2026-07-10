use tauri::{AppHandle, Manager, State};
use tauri_plugin_shell::{ShellExt, process::CommandChild};
use std::sync::Mutex;

// 1. Define a state struct to hold the running process
pub struct LlamaState {
    pub process: Mutex<Option<CommandChild>>,
}

// 2. Command to Start the Server
#[tauri::command]
pub async fn start_llama_server(
    app: AppHandle,
    state: State<'_, LlamaState>,
) -> Result<String, String> {
    // Check if already running
    {
        let proc = state.process.lock().map_err(|e| e.to_string())?;
        if proc.is_some() {
            return Ok("Llama Server already running on port 8080".to_string());
        }
    }

    let sidecar = "llama-server";
    let args = [
        "-m", "./resources/Qwen3VL-2B-Instruct-Q8_0.gguf",
        "--mmproj", "./resources/mmproj-Qwen3VL-2B-Instruct-F16.gguf",
        "--port", "8080",
        "-t", "8",
        "--ctx-size", "4096",
        "--mlock",
    ];

    // Spawn the sidecar using the AppHandle
    let command = app.shell().sidecar(sidecar).map_err(|e| e.to_string())?;
    let (_rx, child) = command.args(&args).spawn().map_err(|e| e.to_string())?;

    // Store the process in state
    let mut proc = state.process.lock().map_err(|e| e.to_string())?;
    *proc = Some(child);

    Ok("Llama Server running on port 8080".to_string())
}

// 3. Command to Stop the Server
#[tauri::command]
pub async fn stop_llama_server(state: State<'_, LlamaState>) -> Result<String, String> {
    let mut proc = state.process.lock().map_err(|e| e.to_string())?;

    if let Some(child) = proc.take() {
        child.kill().map_err(|e| e.to_string())?;
        Ok("Llama Server stopped".to_string())
    } else {
        Ok("Llama Server was not running".to_string())
    }
}
