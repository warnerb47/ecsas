# Context
The event module has **no** Excel import/export functionality. The application/procedure module already has:
- `ExcelImportService` in `libs\api\products\src\lib\excel-import\excel-import.ts` (parses `.xlsx`/`.csv` for `ApplicationImportRow`)
- `ExcelExportService` in `libs\api\products\src\lib\excel-export\excel-export.ts` (generic export: `any[]` data + filename → `.xlsx` via Tauri save dialog)

The event model (`libs\shared\models\src\lib\event.model.ts`) and the event repository/gateway exist. We want the same import/export capability for events.

# Instruction
Add Excel import and export for the event module.

Requirements:
- **Export:** Add a feature to export events to an Excel file. Reuse the existing `ExcelExportService` (`libs\api\products\src\lib\excel-export\excel-export.ts`) with an event-specific payload builder that maps event fields (name, type, status, location, startDate, endDate, budget, spent, expectedParticipants, description, etc.) to readable column headers (French labels), consistent with how the applications export works. Add an "Exporter (Excel)" button in the event list page (`libs\ecsas\feature-event\src\lib\pages\event-list\event-list.component.ts` / `.html`).
- **Import:** Add a feature to import events from an Excel file (`Liste des evènements` format). Follow the same pattern as `ExcelImportService` (parse `.xlsx`/`.csv` into a row model, preview in a modal with validation/conflict detection, then persist via `EventGateway`/`EventRepository`). Let the column mapping match the exported format and handle common French header variations (like the application importer's `HEADERS` mapping).
- Follow the existing code patterns from the application excel import/export (`application-table.component.ts` `openImportDialog`/preview, `application-import-preview` component, `ExcelImportService`, `ExcelExportService`).
