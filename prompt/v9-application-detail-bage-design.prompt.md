# Context
In application detail component I want to add badge for somme information like applicant status, appliction status and application state.

# Instruction
- Read `libs\ecsas\feature-procedure\src\lib\pages\detail-application` to check application detail component
- There is an exemple on `libs\ecsas\feature-procedure\src\lib\pages\detail-procedure\application-table` with getStatusClasses and getStatusLabel
- Read `libs\shared\models\src\lib\application.model.ts` and `libs\shared\models\src\lib\applicant.model.ts` to see possible values for applicant.status, application.status and application.state
- Use the same the same pattern in application-table to display applicant.status, application.status and application.state as badge
