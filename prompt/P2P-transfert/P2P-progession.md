# P2P Transfer — Progress Tracker

Spec: `prompt\P2P-transfert\v27-P2P-transfert.prompt.md`
Status: **IMPLEMENTED** (backend + frontend). Not yet manually end-to-end tested on devices.

## Rust side (Tauri backend) — DONE
- New module `src-tauri/src/server/transfer.rs`, registered in `src/server/mod.rs`, wired in `src/lib.rs` (`.manage(TransferState {...})` + `start_transfer_server` / `stop_transfer_server` in the invoke handler).
- Commands:
  - `start_transfer_server` → returns `http://<lan-ip>:34567/?token=<hex>`. Gets LAN IP via `local-ip-address`, binds `0.0.0.0:34567`, saves files to `app_local_data_dir()/transfers`. Idempotent: returns existing URL if already running. Errors surfaced for "no LAN IP" and "port in use".
  - `stop_transfer_server` → graceful shutdown via `oneshot`, returns a status string.
- Endpoints:
  - `GET /` → minimal inline HTML/mobile page (under 50 lines, no external deps, French UI): file input `accept="image/*,application/pdf" capture="environment" multiple`, upload button, fetch-based multipart POST, status message.
  - `POST /upload` → validates token, saves multipart fields to the transfers dir (filename-sanitized, collision-safe), emits `file-received` event (payload: `string[]` absolute paths), returns `ok`.
- Security/robustness:
  - One-time random 16-byte token appended to the URL, validated on both routes.
  - Auto-shutdown after 5 min inactivity (idle watchdog + `oneshot` stop, via `tokio::select!`).
  - `DefaultBodyLimit` 200 MB.
  - Watches: server running state, url, shutdown handle in `TransferState`. Emits `transfer-stopped` when it stops.
- File I/O entirely in Rust (Angular only reads saved files for attachment).
- Firewall: documented in `transfer.rs:18` (inbound TCP 34567 must be allowed on Windows).
- Deps added: `axum` (multipart, 0.7), `tokio` (full), `futures-util`, `local-ip-address`, `rand`.
- `cargo check` clean (only pre-existing build.rs warning).

## Angular side — DONE
- Dep: `angularx-qrcode@21.0.5` (pnpm).
- New service `libs/ecsas/feature-procedure/src/lib/state/transfer-file.service.ts`:
  - `url` signal; `start()`, `stop()`, `listenForFiles()`, `listenForStopped()`, `readAsFile(path)` → `File`, `dispose()`.
  - Uses `invoke` (`@tauri-apps/api/core`), `listen` (`@tauri-apps/api/event`), `readFile` (`@tauri-apps/plugin-fs`).
- `new-application/page` (`new-application.component.ts` + `.html`):
  - New section "3. Transfert depuis le téléphone": start button, QR code (`<qrcode [qrdata]="transferUrl() ?? ''">`) + URL text, stop button, error display, "Fichiers reçus" list.
  - `file-received` files are appended to the document list (`applicationModel().sources`) as `ApplicationDocument { document: Partial<ProcedureDocument>, file: File }` with `required: false`.
  - `removeReceivedSource(index)` removes from both the received list and the application sources.
  - `ngOnDestroy` disposes listeners.
  - `transfer-stopped` event clears the QR/UI.

## Capabilities
- No `capabilities/default.json` change needed: `fs:default` already grants recursive read under AppLocalData (`read-app-specific-dirs-recursive` in `tauri-plugin-fs`). Custom commands/events require no ACL.

## Verification
- [x] `nx typecheck ecsas` — pass
- [x] `nx build ecsas` — pass (warnings pre-existing: bundle budget, CommonJS `qrcode`/`exceljs`)
- [x] `cargo check` (src-tauri) — pass
- [ ] `nx test feature-procedure` — FAILS but **pre-existing** (specs missing `ActivatedRoute`/`DynamicDialogRef` providers; failed before this feature)
- [x] `nx lint feature-procedure` — 2 errors, **pre-existing** in untouched files (`update-applicant`, `application-table` module boundaries)
- [ ] Manual E2E on real hardware (phone ↔ desktop on same LAN, Windows firewall rule)

## Remaining / follow-ups
1. Manual device test (firewall prompt appears on first bind; authorise and confirm phone→desktop flow, multi-file, stop).
2. Optional: auto-firewall rule via Tauri shell plugin or `netsh` (currently only documented).