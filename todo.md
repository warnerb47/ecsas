# Module procedure
✅ update procedure schema add documents field
✅ add migrations for mock procedures with documents field
✅ update procedure interface
✅ update database repository with the new procedure schema
✅ Fix category types
✅ implement category filter
✅ add migrations for category (color, icon, label)
✅ implement modal to add required documents for procedure
- update procedureGateway: add CRUD
✅ C
✅ R
✅ U
- D
- add btn to manage category
  - refactoring: remove category keep only procedure and add filter by date
  - refactoring: remove procedure.endDate, procedure.startDate, procedure.type, procedure.status


# Module application
✅ add migration for application
✅ init applicationRepository
✅ init applicationGateway
✅ Get applications on detail-procedure pages
✅ plug new-application-form:
 ✅ create applicant
 ✅ search applicant
 ✅ remove selected applicant
✅ create application
✅ plug detail application
- add update application status and state
- add update applicant
- add application status filter
- add application-table pagination
- add application-table search
- add application-table advance filter


# Module Dashboard

# Module Setting

# PoC
- OCR & LLM
  ✅ configure llama-server binaries
  - handle llama-server lifecycle with rust backend
  - start and stop llama-server from UI
  - Init page design for image integration
  - Extract image information and initialize form
- excel export
- Backup
- Integrate Typesense
- Qrcode mobile transferring 
- P2P transfert
