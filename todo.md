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
✅ add procedure metrics
- new procedure form: add error message alert when form is invalid

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
✅ Créer des demandes à partir d'un fichier excel
✅ Keep a specific folder structure for applicant and application on local machine
- fix: uploaded document from new-application-form have no extensions
- new-application-form: use tabs for documents upload:
  - select from machine
  - use qrcode
  - use cable
  - use bluetooth
- excel import: make it support all excel column user should specify column for each attributes


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
✅ Add delay do data fetch
- Add animation transition to statistics and procedure cards
- add recent events on dashboard

# Module Setting
✅ Remove profile card
✅ Let user select where to save backup

# Module event
✅ visualize / create event on calendar
✅ add event table with filters and pagination
✅ add detail event page
  ✅ detail page info: lien utils, Budget / dépenses, Description, Partenaires
  ✅ add `lettre d'invitation`
  ✅ add `lettre de demande de sponsoring`
  ✅ add `budgetisation évènement`
  ✅ add `feuille de présence`
  ✅ add `raport d'évènement`
- update document design
  - let user define document name
  - let user upload document
- add import from excel format
- add export to excel format
- fix event list table: add detail page link, and fix icon not showing
- new-event form: fix placeholder for event name `Secours tabaski 2026`
- event-calendar: event card is display only on startDate it should span all the period
- add event metrics

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
