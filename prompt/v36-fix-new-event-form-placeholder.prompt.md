# Context
In the new-event form (`libs\ecsas\feature-event\src\lib\components\event-create-dialog\event-create-dialog.component.html` line 2), the event name input uses an inappropriate/dated placeholder:

```html
<lib-text-input [formField]="eventForm.name" label="Nom de l'evenement" placeholder="Ex: Secours Tabaski Octobre 2026"></lib-text-input>
```

`Secours Tabaski Octobre 2026` is a specific, dated example. A more appropriate and generic placeholder is desired.

# Instruction
Fix the placeholder for the event name in the new-event form.

Requirements:
- Replace the placeholder `Ex: Secours Tabaski Octobre 2026` with a more appropriate, generic example such as `Ex: Octobre Rose` (a campaign-style example without a specific year).
- Read `libs\ecsas\feature-event\src\lib\components\event-create-dialog\event-create-dialog.component.html` and update it.
