# Context
In the new-procedure-form (`libs\ecsas\feature-procedure\src\lib\pages\new-procedure\new-procedure.component.ts` / `.html`) there is no user feedback when the form is invalid. The name field has a required validation rule, but submitting an empty form does nothing visible — the user clicks "Créer procédure" and nothing happens.

Currently:
- `procedureForm` has `required(procedureForm.name, ...)` validation (line 46).
- `onSubmit()` calls `submit(this.procedureForm, ...)` which only proceeds to `createProcedure()` when the form is valid — but there's no alert / error message shown to the user when it's invalid.

# Instruction
Add an error message alert when the new procedure form is submitted while invalid.

Requirements:
- When the user clicks "Créer procédure" and the form is invalid, show a clear error alert/message.
- Use an appropriate notification pattern consistent with the rest of the app. Check how other modules surface form validation errors (e.g. PrimeNG `Toast`, `Message`, or a banner/alert).
- The alert should indicate which field(s) are missing / invalid (e.g. "Le nom de la procédure est obligatoire").
- Do not modify the existing validation rules or the valid-submission flow.
