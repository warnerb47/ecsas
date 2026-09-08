# Context
Dashboard page is static We have to make it dynamic. Dashboard page have 3 sections:
- statistics
- Recent Procedures
- Recent Applications

# Usefull information
- Read `libs\ecsas\feature-dashboard\src\lib\dashboard` to see dashboard page
- Read `libs\ecsas\feature-dashboard\src\lib\components` to see dashboard components
- Read `libs\shared\models\src\lib` to see app models
- Read `src-tauri\migrations` to see sqlite migrations 
- Read `libs\ecsas\ecsas-data\src\lib` to see gateway abstraction used by the frontend components
- Read `libs\api\products\src\lib\repositories` to see repositories that implements gateways

# Instruction
## statistics:
 - keep `Total Demandes`, `En Traitement` and `Approuvées` card but replace `Montant Distribué` card by `Rejetées`
 - For `En Traitement`, `Approuvées` and `Rejetées` card add the percentage as description
 - handle error and loading state
## Recent Procedures:
 - Get procedures which applications created in this last 6 mounths update repository and gateway if needed
 - remove commented mockdata in `libs\ecsas\feature-dashboard\src\lib\components\pending-procedure\pending-procedure.component.ts`
 - update pending-procedure component to fetch data from procedure gateway handle error and loading state
 ## Recent Applications:
  - Get applications created in this mounth update repository and gateway if needed
  - remove hard coded html and make it dynamic using for lopp in template handle error and loading state
  - Application table should have the following column: Demandeur(applicant), Procédure(procedure.name), Date soummission (application.createdAt), statut(application.status) you can inspire from `libs\ecsas\feature-procedure\src\lib\pages\detail-procedure\application-table` include filters and pagination
