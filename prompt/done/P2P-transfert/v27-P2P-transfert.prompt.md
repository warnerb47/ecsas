# Goal:
Implement a local file transfer feature in an existing Nx + Angular 21 + Tauri desktop application. The feature allows a user to scan a QR code displayed in the desktop app with their phone, then take/upload photos of documents from the phone to the desktop app over the local network. This is used on the "Create Application" page (`libs\ecsas\feature-procedure\src\lib\pages\new-application`) where users need to upload scanned documents. The transfer must work fully offline (no cloud, no internet).

# Architecture to implement:
The desktop app runs a short-lived local HTTP server (on the Rust/Tauri side). The QR code displayed in the Angular UI encodes the URL of this local server. When the phone scans the QR, the browser opens a simple HTML page served by that local server. That page lets the user pick/take photos and upload them via HTTP POST to the desktop server. The server saves the files to disk and notifies the Angular frontend via Tauri events.

# Instructions:
1. Rust side (Tauri backend):
- Add a Tauri command that starts a local HTTP server on a fixed port (e.g. 34567) bound to the machine's LAN IP.
- The server must expose:
  - GET / → returns a minimal HTML page (served as a string) that includes a file input with accept="image/*" capture="environment" multiple and a button to POST the file.
  - POST /upload → accepts a multipart form with image files, saves them to the app's data directory, and emits a Tauri event (e.g. file-received) to the frontend with the saved file path.
- The server must be stoppable (add a second Tauri command to shut it down).
- Use axum with the multipart feature. Use local-ip-address to get the LAN IP. Use tokio for async.
- The server should bind to 0.0.0.0 (all interfaces) so the phone can reach it.
2. Angular side (frontend):
- On the "Create Application" page, add a "Transfer from phone" button.
- When clicked, invoke the Tauri command to start the server and get back the full URL (e.g. http://192.168.x.x:34567).
- Display a QR code encoding that URL. Use angularx-qrcode (or similar lightweight library).
- Listen for the file-received Tauri event and add the received file to the document list on the page.
- Show a "stop transfer" button that invokes the stop command and hides the QR code.
- Handle edge cases: server already running, no LAN IP found, port already in use.
3. Mobile HTML page (served by the Rust server):
- Keep it minimal: a title, a file input, an upload button, and a status message.
- Use fetch to POST the file as multipart form data.
- After a successful upload, show a success message and allow selecting another file.
- No external dependencies — inline CSS and JS only.
# Tech stack to use:
| Layer | Technology |
|-------|-----------|
| HTTP server (Rust) | `axum` 0.7+ with `multipart` feature |
| Async runtime | `tokio` |
| LAN IP detection | `local-ip-address` crate |
| QR code generation (Angular) | `angularx-qrcode` |
| File saving | Tauri `app_data_dir` path API |
| Frontend ↔ Backend comms | Tauri commands + events (`invoke`, `listen`) |
I am open mind in the tech stack if you have suggestions go ahead and used them

# Constraints & recommendations:
- Do NOT create a separate mobile app or Nx mobile target. The phone uses its native browser.
- The HTTP server is ephemeral — it starts only when the user initiates a transfer and stops when done.
- Add a simple one-time token (random string appended to the URL) to prevent other devices on the LAN from accidentally uploading. Validate it on the server side.
- The server should auto-shutdown after a timeout (e.g. 5 minutes of inactivity) as a safety net.
- Ensure the firewall allows the port on Windows (document this or use a Tauri shell plugin to add a rule).
- Keep the mobile HTML page under 50 lines — it's a utility page, not an app.
- All file I/O should happen in the Rust layer, not in Angular.
- Emit events with the absolute file path so the Angular side can immediately attach the file to the application form.

# Definition of done:
- User clicks "Transfer from phone" on the Create Application page.
- A QR code appears.
- User scans it with their phone camera.
- Phone browser opens the upload page.
- User takes a photo or selects an image.
- File appears in the desktop app's document list within 1–2 seconds.
- User can repeat for multiple files.
- User clicks "Stop" and the server shuts down.
- No internet connection required at any point.
