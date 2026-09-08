# Context
The Excel import currently works only with a fixed, hard-coded set of column headers. In `libs\api\products\src\lib\excel-import\excel-import.ts`, the `HEADERS` record maps a fixed list of normalized header names to `ApplicationImportRow` fields:

```ts
const HEADERS: Record<string, RowKey> = {
  nom: 'lastName',
  prénom: 'firstName',
  prenom: 'firstName',
  'date de naissance': 'birthdate',
  nin: 'nin',
  adresse: 'address',
  telephone: 'phoneNumber',
  'numéro courrier': 'mailRef',
  'numero courrier': 'mailRef',
};
```

This means the importer breaks whenever a spreadsheet uses different column names or column order. We want to support ANY excel file by letting the user manually assign each excel column to the corresponding application attribute.

The import pipeline is: `ExcelImportService.parseApplicationsFile` (`excel-import.ts`) → `ApplicationImportService.previewApplications` → `ApplicationImportPreviewComponent` (preview modal) → `ApplicationImportService.importApplications`. Preview component: `libs\ecsas\feature-procedure\src\lib\pages\detail-procedure\application-table\application-import-preview\application-import-preview.component.ts` / `.html`. Host: `application-table.component.ts` (`openImportDialog`, `onImportFileSelected`).

The `ApplicationImportRow` model fields (from `libs\shared\models\src\lib\application.model.ts`) are: `index`, `lastName`, `firstName`, `birthdate`, `nin`, `address`, `phoneNumber`, `mailRef`.

# Instruction
Make the Excel import support any excel column by allowing the user to specify which column maps to each attribute.

Requirements:
- **Auto-detection first:** keep the current automatic `HEADERS` mapping as a default so the same-format file still works with zero configuration.
- **Manual mapping step:** when parsing, if some columns are unknown/unmapped (or always, for flexibility), show an interface (modal) letting the user assign each application attribute to one of the excel columns.
- For each attribute the user should be able to pick an excel column from the detected headers, or mark it as "not present / ignore".
- Update the parsing flow so the user-provided mapping is passed into the parser (`ExcelImportService`) to replace/augment the fixed `HEADERS`.
- Show a preview of the mapped columns (sample values) so the user can verify the assignment is correct before importing.
- Keep the existing preview and import logic (`previewApplications`, `importApplications`, the preview modal) working unchanged once mapping is done.
