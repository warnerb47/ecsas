# Context
The event-detail page (`libs\ecsas\feature-event\src\lib\pages\event-detail\event-detail.component.ts` / `.html`) currently uses **custom hand-rolled tabs** to split content into two views:
- `activeTab` signal (line 63), `tabs = ["Vue d'ensemble", 'Documents']` (line 65), `onTabChange()` (lines 111-113)
- A button-based tab bar in the template (HTML lines 13-23)
- `@if` blocks rendering `<lib-event-info>` only when `activeTab() === 'Vue d\'ensemble'` (lines 27-42) and `<lib-event-document>` only when `activeTab() === 'Documents'` (lines 46-52)

We want to remove the tabs entirely and keep everything on one page: event-info becomes the main content and event-document is included within it.

The `event-document` component (`libs\ecsas\feature-event\src\lib\pages\event-detail\event-document\event-document.component.*`) is more complex than the small section components. The rest of the page already uses a **small, modular section pattern**: `event-partner-list` and `event-link-list` are minimal standalone components (15-line `.ts`, no imports, `input` + `output`s, all rendering in the template) under `event-detail\event-info\`. We want event-document refactored to follow that same pattern.

# Instruction
Refactor the event-detail page to remove tabs.

Requirements:
- **Remove the document tabs** in `event-detail.component.html`: delete the tab bar (lines 13-23) and both `@if (activeTab())` wrappers so the page always shows the content.
- **Merge into one page:** show `event-info` as the primary content, and include `event-document` as a section **inside** event-info (like the partners/links sections already are). Keep the current event header on top.
- Clean up now-unused state in `event-detail.component.ts`: remove `activeTab`, `tabs`, and `onTabChange` if no longer referenced.

Requirements for refactoring `event-document` to follow the small section pattern (like `event-partner-list` / `event-link-list`):
- Read `libs\ecsas\feature-event\src\lib\pages\event-detail\event-document\event-document.component.ts` / `.html` and `...\event-document-card\event-document-card.component.*`.
- Keep the existing behavior (5 document cards, upload, visualize, generate, "Ouvrir le dossier") but restructure the component so it is lightweight and composable like the other `*-list` sections.
- Preserve the existing event interfaces (`GenerateDocumentEvent`, `UploadDocumentEvent`, `VisualizeDocumentEvent`) and the `DOCUMENTS` config so the parent's `onGenerateDocument` / `onUploadDocument` / `onVisualizeDocument` / `openFolder` handlers keep working unchanged.
- Follow the same card shell visual conventions as `event-partner-list` / `event-link-list` (`bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden`, `bg-slate-50 border-b`, `px-6 py-4`/`px-6 py-5` header/body).
- Wire `<lib-event-document>` into `event-info` (mirroring how `event-link-list`/`event-partner-list` are composed in `event-info.component.html`), passing the event documents and forwarding the same outputs up to `event-detail` (generate/upload/visualize/openFolder).
