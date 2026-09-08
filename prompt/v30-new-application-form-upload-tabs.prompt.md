# Context
In the new-application-form, documents can currently be uploaded through two independent features:
1. an `<lib-upload-document-card>` rendered per procedure document (direct file picker from machine) — section 2. Demande
2. a phone transfer section using a QR code / LAN server — section 3. Transfert depuis le téléphone

These are separated into two distinct sections of the page (`libs\ecsas\feature-procedure\src\lib\pages\new-application\new-application.component.html`). We want to unify them into a single "documents upload" block organized as tabs.

# Instruction
Refactor the new-application-form to use tabs for documents upload, with the following tabs:
- **select from machine** (the current upload-document-card / direct file picker)
- **use qrcode** (the current phone transfer via QR code / LAN server)
- **use cable** (transfer document over a physical connection)
- **use bluetooth** (transfer document wirelessly)

Requirements:
- Read `libs\ecsas\feature-procedure\src\lib\pages\new-application\new-application.component.*` to understand the current layout.
- Group sections 2 (Demande documents) and 3 (Transfert) into a single unified panel.
- Use a PrimeNG `TabView` (or equivalent) to switch between the four upload modes.
- For `use cable` and `use bluetooth`: if the mechanism is not yet implemented (only the QR/LAN transfer exists in `src-tauri\src\server\transfer.rs` and `libs\ecsas\feature-procedure\src\lib\state\transfer-file.service.ts`), add the tab with a placeholder UI and a clear "not yet available" state. Prefer keeping existing working features intact.
- Keep the received-files / matching logic that already exists for the QR transfer.
