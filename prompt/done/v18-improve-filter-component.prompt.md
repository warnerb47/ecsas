# Context
Application table have status filter and state filter. DropdownComponent is used for these attributes. But we want to improve the filter to allow user to multiselect status or state. The goal is to add a new component multiselect in `libs\ecsas\shared-ui\src\lib\atoms\`. and update `filterApplications` in `libs\api\products\src\lib\repositories\application-repository\application-repository.ts` to allow filter on multiple status and multiple state

# Instruction
- Read `libs\ecsas\feature-procedure\src\lib\pages\detail-procedure\application-table` to see appliction table
- Read `libs\api\products\src\lib\repositories\application-repository\application-repository.ts` to see application-repository
- Read `libs\shared\models\src\lib\application.model.ts` to see `ApplicationFilters` interface and `ApplicationFilters.status` should be and array of `ApplicationStatus` the same goes for `ApplicagtionFilters.state`.
- `filterApplications` should handle the list of status and state in the sqlite request
