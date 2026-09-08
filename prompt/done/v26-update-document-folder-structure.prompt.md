# Context
App uploaded file are stored in APP_LOCAL_DATA/Documents directory. I want to use this following file structure for upload documents. This is an exemple of how file should be structure the goal is to let user navigate through this:
- Demandeurs:
 • nomDemaneur_NIN:
   - CNI
   - and all document upload on applicant creation
- Demandes:
  • nomProcedure_NuméroCourrier_creationDate
    - demande manuscrite 
    - Certificat de domicile 
    - and all document upload on application creation
- Événements:
  • nomÉvénements_creationDate
    - demande manuscrite 
    - and all document upload on event creation

# Instruction
- update `libs\api\products\src\lib\document-manager` to implement this folder structure
