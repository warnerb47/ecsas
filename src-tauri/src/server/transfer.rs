use std::net::IpAddr;
use std::path::{Path, PathBuf};
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::{Arc, Mutex};
use std::time::{Duration, Instant, SystemTime, UNIX_EPOCH};

use axum::extract::{DefaultBodyLimit, Multipart, Query, Request, State as AxumState};
use axum::http::StatusCode;
use axum::middleware::{self, Next};
use axum::response::{Html, IntoResponse, Response};
use axum::routing::{get, post};
use axum::Router;
use rand::Rng;
use serde::Deserialize;
use tauri::{AppHandle, Emitter, Manager, State as TauriState};
use tokio::net::TcpListener;
use tokio::sync::oneshot;

// Windows Firewall: inbound TCP on this port must be allowed for the phone to
// reach the desktop app. If left blocked, the QR page will not load from the
// phone (firewall prompt appears on first bind for interactive runs).
const TRANSFER_PORT: u16 = 34567;
const INACTIVITY_TIMEOUT: Duration = Duration::from_secs(5 * 60);
const MAX_BODY_SIZE: usize = 200 * 1024 * 1024;

const MOBILE_PAGE: &str = r#"<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Transfert de documents</title>
<style>
body{font-family:system-ui,-apple-system,sans-serif;background:#f1f5f9;color:#0f172a;margin:0;padding:1.5rem;display:flex;flex-direction:column;align-items:center;min-height:100vh}
.card{background:#fff;border-radius:1rem;padding:2rem;max-width:24rem;width:100%;text-align:center;box-shadow:0 10px 25px rgba(0,0,0,.08)}
h1{font-size:1.1rem;margin:0 0 1rem}
input[type=file]{margin:1rem 0;width:100%}
button{width:100%;padding:.8rem;border:0;border-radius:.6rem;background:#2563eb;color:#fff;font-size:1rem;font-weight:600}
button:disabled{opacity:.5}
#status{margin-top:1rem;font-weight:600;white-space:pre-line}
</style>
</head>
<body>
<div class="card">
<h1>Envoyer des documents</h1>
<input type="file" id="file" accept="image/*,application/pdf" capture="environment" multiple>
<button type="button" id="btn">Envoyer</button>
<p id="status"></p>
</div>
<script>
var token="__TOKEN__";
var btn=document.getElementById('btn');
function setStatus(msg,ok){var s=document.getElementById('status');s.textContent=msg;s.style.color=ok?'#059669':'#dc2626';}
window.addEventListener('error',function(e){setStatus('Erreur JS: '+e.message,false);});
btn.addEventListener('click',async function(){
var input=document.getElementById('file');
if(!input.files.length){setStatus('Choisissez au moins une photo.',false);return;}
var fd=new FormData();
for(var i=0;i<input.files.length;i++){fd.append('files',input.files[i]);}
btn.disabled=true;setStatus('Envoi en cours...',true);
try{
var res=await fetch('upload?token='+encodeURIComponent(token),{method:'POST',body:fd});
if(res.ok){setStatus(input.files.length+' fichier(s) envoyé(s) avec succès.',true);input.value='';}
else{setStatus('Erreur: '+await res.text(),false);}
}catch(e){setStatus('Échec de connexion. Vérifiez le réseau.',false);}
btn.disabled=false;
});
</script>
</body>
</html>"#;

pub struct TransferState {
    pub server_running: AtomicBool,
    pub shutdown: Mutex<Option<oneshot::Sender<()>>>,
    pub url: Mutex<Option<String>>,
}

struct TransferServerState {
    app: AppHandle,
    upload_dir: PathBuf,
    token: String,
    last_activity: Arc<Mutex<Instant>>,
}

#[derive(Deserialize)]
struct TokenParams {
    token: String,
}

fn generate_token() -> String {
    let token: [u8; 16] = rand::thread_rng().gen();
    token.iter().map(|b| format!("{:02x}", b)).collect::<String>()
}

fn sanitize_file_name(name: &str) -> String {
    let base = name.rsplit(['/', '\\']).next().unwrap_or(name).trim();
    if base.is_empty() || base == "." {
        "upload".to_string()
    } else {
        base.to_string()
    }
}

fn save_file(upload_dir: &Path, file_name: &str, data: &[u8]) -> Result<PathBuf, String> {
    let base = sanitize_file_name(file_name);
    let mut final_path = upload_dir.join(&base);
    if final_path.exists() {
        let millis = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .map_err(|e| e.to_string())?
            .as_millis();
        final_path = upload_dir.join(format!("{}-{}", millis, base));
    }
    std::fs::write(&final_path, data).map_err(|e| e.to_string())?;
    Ok(final_path)
}

async fn handle_index(
    AxumState(state): AxumState<Arc<TransferServerState>>,
    Query(params): Query<TokenParams>,
) -> Response {
    if params.token != state.token {
        return (StatusCode::FORBIDDEN, "Invalid token").into_response();
    }
    let page = MOBILE_PAGE.replace("__TOKEN__", &state.token);
    Html(page).into_response()
}

async fn handle_upload(
    AxumState(state): AxumState<Arc<TransferServerState>>,
    Query(params): Query<TokenParams>,
    mut multipart: Multipart,
) -> Response {
    if params.token != state.token {
        return (StatusCode::FORBIDDEN, "Invalid token").into_response();
    }

    let mut saved_paths: Vec<String> = Vec::new();
    let mut error: Option<String> = None;

    loop {
        let field = match multipart.next_field().await {
            Ok(Some(field)) => field,
            Ok(None) => break,
            Err(e) => {
                error = Some(e.to_string());
                break;
            }
        };

        let file_name = field
            .file_name()
            .map(|s| s.to_string())
            .unwrap_or_else(|| format!("photo-{}.img", saved_paths.len()));

        match field.bytes().await {
            Ok(data) if !data.is_empty() => match save_file(&state.upload_dir, &file_name, &data) {
                Ok(path) => saved_paths.push(path.to_string_lossy().to_string()),
                Err(e) => {
                    error = Some(e);
                    break;
                }
            },
            Ok(_) => {}
            Err(e) => {
                error = Some(e.to_string());
                break;
            }
        }
    }

    if let Some(e) = error {
        return (StatusCode::INTERNAL_SERVER_ERROR, e).into_response();
    }

    if saved_paths.is_empty() {
        return (StatusCode::BAD_REQUEST, "No files received").into_response();
    }

    *state.last_activity.lock().map_err(|e| e.to_string()).unwrap() = Instant::now();

    if let Err(e) = state.app.emit("file-received", &saved_paths) {
        return (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()).into_response();
    }

    (StatusCode::OK, "ok").into_response()
}

async fn log_requests(
    req: Request,
    next: Next,
) -> Response {
    let method = req.method().clone();
    let uri = req.uri().clone();
    let res = next.run(req).await;
    eprintln!("transfer: {method} {uri} -> {}", res.status());
    res
}

#[tauri::command]
pub async fn start_transfer_server(
    app: AppHandle,
    state: TauriState<'_, TransferState>,
) -> Result<String, String> {
    if state.server_running.load(Ordering::SeqCst) {
        return state
            .url
            .lock()
            .map_err(|e| e.to_string())?
            .clone()
            .ok_or_else(|| "Transfer server is already starting".to_string());
    }

    let lan_ip: IpAddr = local_ip_address::local_ip().map_err(|e| format!("Aucune adresse IP locale trouvée ({e})"))?;

    let token = generate_token();

    let upload_dir = app
        .path()
        .app_local_data_dir()
        .map_err(|e| e.to_string())?
        .join("transfers");
    std::fs::create_dir_all(&upload_dir).map_err(|e| e.to_string())?;

    let addr = format!("0.0.0.0:{TRANSFER_PORT}");
    let listener = TcpListener::bind(&addr)
        .await
        .map_err(|e| format!("Port {TRANSFER_PORT} déjà utilisé ({e})"))?;

    let url = format!("http://{lan_ip}:{TRANSFER_PORT}/?token={token}");
    *state.url.lock().map_err(|e| e.to_string())? = Some(url.clone());

    let (tx, rx) = oneshot::channel::<()>();
    *state.shutdown.lock().map_err(|e| e.to_string())? = Some(tx);
    state.server_running.store(true, Ordering::SeqCst);

    let server_state = Arc::new(TransferServerState {
        app: app.clone(),
        upload_dir,
        token,
        last_activity: Arc::new(Mutex::new(Instant::now())),
    });

    let server = Router::new()
        .route("/", get(handle_index))
        .route("/upload", post(handle_upload))
        .layer(DefaultBodyLimit::max(MAX_BODY_SIZE))
        .layer(middleware::from_fn(log_requests))
        .with_state(server_state.clone());

    let app_handle = app.clone();
    tauri::async_runtime::spawn(async move {
        let idle_state = server_state.clone();
        let shutdown_signal = async move {
            let idle = async move {
                loop {
                    tokio::time::sleep(Duration::from_secs(5)).await;
                    let idle_for = idle_state
                        .last_activity
                        .lock()
                        .map(|g| g.elapsed())
                        .unwrap_or(Duration::ZERO);
                    if idle_for >= INACTIVITY_TIMEOUT {
                        break;
                    }
                }
            };

            tokio::select! {
                _ = rx => {}
                _ = idle => {}
            }
        };

        if let Err(e) = axum::serve(listener, server)
            .with_graceful_shutdown(shutdown_signal)
            .await
        {
            eprintln!("transfer server error: {e}");
        }

        let _ = server_state.app.emit("transfer-stopped", ());
        let app_state = app_handle.state::<TransferState>();
        app_state.server_running.store(false, Ordering::SeqCst);
        *app_state.url.lock().unwrap() = None;
        *app_state.shutdown.lock().unwrap() = None;
    });

    Ok(url)
}

#[tauri::command]
pub async fn stop_transfer_server(state: TauriState<'_, TransferState>) -> Result<String, String> {
    let mut shutdown = state.shutdown.lock().map_err(|e| e.to_string())?;
    let was_running = state.server_running.swap(false, Ordering::SeqCst);
    *state.url.lock().map_err(|e| e.to_string())? = None;

    if let Some(tx) = shutdown.take() {
        let _ = tx.send(());
        Ok("Serveur de transfert arrêté".to_string())
    } else if was_running {
        Ok("Serveur de transfert arrêté".to_string())
    } else {
        Ok("Le serveur de transfert n'était pas actif".to_string())
    }
}