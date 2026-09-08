# Context
In the event module, the event document upload lets the user pick a file but the document name is **always** the original file name. The user cannot define a custom document name. This happens in `libs\ecsas\feature-event\src\lib\pages\event-detail\event-detail.component.ts` line 283:

```ts
fileName: params.file?.name
```

# Instruction
Update the event document design so the user can define the document name **and** upload the document.

Requirements:
- Read `libs\ecsas\feature-event\src\lib\pages\event-detail\event-document\event-document-card\event-document-card.component.ts` / `.html` (uses `<lib-upload-document-card>`) and `libs\ecsas\feature-event\src\lib\pages\event-detail\event-detail.component.ts`.
- When uploading a document, let the user specify a custom document name (editable field) in addition to picking the file.
- Use the user-defined name as `fileName` when persisting (replacing the hardcoded `params.file?.name` fallback). Fall back to the original file name if the user leaves the field empty.
- Keep the existing upload/replace logic (`onUploadDocument`) and the preview (`pi-eye` → `PdfViewerComponent`) working.
- Follow the visual style of the existing event document cards.
