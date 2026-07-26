# Prompt 1
I am using angular with tauriv2 and llama-server as sidecar. Here is my llama commands:
`
use std::sync::Mutex;
use tauri::{AppHandle, State};
use tauri_plugin_shell::{process::CommandChild, ShellExt};

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
        "-m",
        "./resources/Qwen3VL-2B-Instruct-Q8_0.gguf",
        "--mmproj",
        "./resources/mmproj-Qwen3VL-2B-Instruct-F16.gguf",
        "--port",
        "8080",
        "-t",
        "8",
        "--ctx-size",
        "4096",
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

`
The LlamaState struc is used to check if an instance is running how can I acception from my angular compenent to display the llama-serve state in UI (ON or OFF).

# Prompt 2
How can I stop llama-server on app closed

# Prompt 3
I am using angular with tauriv2 and llama-server as sidecar. Here is the model used:
- Qwen3VL-2B-Instruct-Q4_K_M.gguf
- mmproj-Qwen3VL-2B-Instruct-F16.gguf

I pass cardId to this model and it returns me information in json format but request takes about 40s which too long how can I improve it. This LLM will be packed into my desktop app and should run smoothly even in limited ressource PC.
Here is my llama-server sidecar:
`
use std::sync::Mutex;
use tauri::{AppHandle, State};
use tauri_plugin_shell::{process::CommandChild, ShellExt};

// https://huggingface.co/Qwen/Qwen3-VL-2B-Instruct-GGUF
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
        "-m",
        "./resources/Qwen3VL-2B-Instruct-Q4_K_M.gguf",
        "--mmproj",
        "./resources/mmproj-Qwen3VL-2B-Instruct-F16.gguf",
        "--port",
        "8080",
        "-t",
        "8",
        "--ctx-size",
        "4096",
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

#[tauri::command]
pub fn get_llama_status(state: State<'_, LlamaState>) -> Result<bool, String> {
    // Lock the state to read the process status
    let proc = state.process.lock().map_err(|e| e.to_string())?;

    // Return true if process exists (Some), false if None
    Ok(proc.is_some())
}

`

# Prompt 4
I want to enable GPU Acceleration (Vulkan/CUDA) what should I use.


# Prompt 5
I think about using an OCR like tesseract to extrat text and pass it to my Qwen3VL-2B-Instruct-Q4_K_M.gguf model to format JSON from text. What do you think will it improve performance or should I keep my Qwen3VL-2B-Instruct-Q4_K_M.gguf with image processing throw mmproj-Qwen3VL-2B-Instruct-F16.gguf


# Prompt 6
I am using angular with tauriv2 and llama-server as sidecar. Here is my method in my angular LlamaService to contact llama-server:
`
  async fetchApplicantInfo(base64Image: string): Promise<unknown> {
    const prompt = `
    You are a data extractor. Given a ID card image, return ONLY valid JSON:
        interface Applicant {
        fullName: string;
        nin: string;
        phoneNumber: string;
        birthdate: string;
        address: string;
    };
    `;
    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'Qwen3VL-2B-Instruct-Q8_0',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image_url',
                image_url: { url: base64Image },
              },
              {
                type: 'text',
                text: prompt,
              },
            ],
          },
        ],
        temperature: 0.1,
        top_k: 1,
      }),
    });

    const data = await response.json();
    console.log(data);
    return this.parseLlamaResponse(data);
  }

`
I want to add progression bar to display on UI file scan progression. Create another method based on fetchApplicantInfo which return on observable so that the ui component can subscribe and display progression
