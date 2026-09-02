# Context
I have the following error when I create application whithout running `initAppFolder` in `libs\api\products\src\lib\document-manager\document-manager.ts` when app is freshly installed:
`
failed to open file at path: C:\Users\SNGAYEM\AppData\Local\ecsas\Documents/Demandes/certificat de domicile with error: Le chemin d’accès spécifié est introuvable.
`
Whe two solutions:
1. run `initAppFolder` on app first open this should be done at least one time after installation
2. update `uploadFile` method to create file event if folder was not yet initialize

# Instruction
- Read `libs\api\products\src\lib\document-manager\document-manager.ts`
- Pick the best solution and implement it
