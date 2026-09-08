# Context
The event module has **no** metrics/statistics visualization, even though the backend already computes them:
- `EventStats` interface exists in `libs\shared\models\src\lib\event.model.ts` (lines 104-110): `total`, `planned`, `inProgress`, `completed`, `cancelled`.
- `EventRepository.getEventStats()` (`libs\api\products\src\lib\repositories\event-repository\event-repository.ts`, lines 118-142) runs a SQL query counting events by status.
- `EventGateway.getEventStats()` (`libs\ecsas\ecsas-data\src\lib\event\event-gateway.service.ts`, lines 25-27) exposes it.
- It is currently only used in `event-list.component.ts` (line 77) for `stats.total` (pagination); the per-status breakdown is fetched but discarded.

The dashboard (`libs\ecsas\feature-dashboard`) only shows application/procedure statistics, not events.

# Instruction
Add event metrics visualization.

Requirements:
- **Event list page:** Display the `getEventStats()` breakdown (total, planned, inProgress, completed, cancelled) as stat cards/badges at the top of the event list page (`libs\ecsas\feature-event\src\lib\pages\event-list\event-list.component.ts` / `.html`), similar to how `formatAmount`/stat pills are styled.
- Ensure `getEventStats()` is called once (reuse for both pagination total and the breakdown) rather than fetching twice.
- Optionally add a small metrics summary on the event detail page showing key figures (budget, spent, participants) — keep minimal and consistent with existing style.
- Follow the visual conventions of existing stat components (see `libs\ecsas\feature-dashboard\src\lib\components\statistic\statistic.component.ts` / `.html`).
