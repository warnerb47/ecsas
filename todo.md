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
- add procedure metrics

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
✅ add application-table pagination
✅ update detail-application design (add demande section edit btn like for applicant)
✅ fix applicant filter by phonenumber or nin
✅ update detail-application design (use badge for status and state)
✅ update detail-application design (add label for applicant.status)
✅ fix dropdown value not applied on render (add [selected] binding on options)

# Refactoring
✅ add applicant.birthDate 
✅ add error handling for all shared-ui input
- update applicant.sources to applicant.source (applicant have only one source the CNI)

# Database
- use transaction for commands
- add full text search with FTS5 for application.comment, applicant.address

# Module Dashboard
✅ plug statistics (total, pending, approved, rejected with percentage) with error/loading states
✅ plug recent procedures (last 6 months) card list with error/loading states
✅ plug recent applications (this month) table with filters, pagination and error/loading states
✅ add application statistics query in application repository + gateway
✅ add recent procedures query in procedure repository + gateway
✅ make filterApplications procedureId optional with procedure name

# Module Setting

# Sidebar / Shell
✅ display app version on sidebar bottom (imported from package.json, assert against imported value in spec)

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
  - handle llama-server lifecycle with rust backend
  - start and stop llama-server from UI
  - Init page design for image integration
  - Extract image information and initialize form
- Integrate Typesense
- Qrcode mobile transferring 
- P2P transfert
