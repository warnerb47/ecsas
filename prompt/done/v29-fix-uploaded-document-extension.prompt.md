# Context
Uploaded documents from the new-application-form lose their file extension when saved to disk.

**Root cause:** `libs\ecsas\feature-procedure\src\lib\pages\new-application\new-application.component.ts` line 250:
```ts
const fileName = document?.name ?? file.name;
```
This renames the file to the bare procedure-document label (e.g. `Certificat de domicile`) without appending the original file extension (e.g. `.pdf`). The file lands on disk as `Certificat de domicile` instead of `Certificat de domicile.pdf`.

# Instruction
- In `addDocument` method, extract the extension from the original `file.name` and append it to the procedure document name.
- Preserve the extension from the original uploaded file (e.g. if user uploads `scan.pdf`, store as `Certificat de domicile.pdf`).
- Handle edge cases: file with no extension, file with multiple dots in name.
