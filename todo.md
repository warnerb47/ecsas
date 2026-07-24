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
✅ add btn to manage category
  ✅ refactoring: update migrations
  ✅ refactoring: remove category keep only procedure and add filter by date
  ✅ refactoring: remove procedure.endDate, procedure.startDate, procedure.type, procedure.status


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
✅ add update applicant
✅ add update application status and state
✅ add update application comment
✅ add application status filter
✅ add application-table search
✅ add application-table advance filter
- add application-table pagination
- fix: set dropdown option label to '' when value is null (it is selecting the first option label)
- update detail-application design (add demande section edit btn like for applicant)
- update detail-application design (use badge for status and state)
- update detail-application design (add label for applicant.status)

# Refactoring
✅- add applicant.birthDate 
- update applicant.sources to applicant.source (applicant have only one source the CNI)
- add error handling for all shared-ui input

# Database
- use transaction for commands
- add full text search with FTS5 for application.comment, applicant.address

# Module Dashboard

# Module Setting

# PoC
✅ excel export
- Backup
 ✅ add create_backup command
 ✅ add restore_backup command
 ✅ init backup-service
 ✅ plug setting/backup card UI
 ✅ add setting/restore card UI
- OCR & LLM
  ✅ configure llama-server binaries
  ✅ handle llama-server lifecycle with rust backend
  ✅ start and stop llama-server from UI
  - Improve response timing (current 11s)
  - Configure respone JSON format with the initial prompt
  - Init page design for image integration
  - Extract image information and initialize form
- Integrate Typesense
- Qrcode mobile transferring 
- P2P transfert
