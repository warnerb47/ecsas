# Context
In the event calendar (`libs\ecsas\feature-event\src\lib\pages\event-calendar\event-calendar.component.ts`, lines 74-87), an event card is displayed **only on its `startDate`**. Multi-day events do not span the period between `startDate` and `endDate`.

The current logic keys each event into a map by its `startDate` ISO string only:
```ts
const key = event.startDate;           // startDate ONLY
eventMap.set(key, list);
```
and each calendar day is matched by exact ISO date:
```ts
const iso = date.toISOString().slice(0, 10);
days.push({ ..., events: eventMap.get(iso) ?? [] });
```
The `endDate` is stored on the model and form but completely ignored by the calendar.

# Instruction
Make the event calendar span the full period of an event, not just the start date.

Requirements:
- Update the calendar logic in `event-calendar.component.ts` so an event is displayed on **every day** from `startDate` through `endDate` (inclusive). On the start date it should appear as today's card; on intermediate/end days it should render (e.g. as a muted or continued span) so the user can see the event occupies the whole window.
- Preserve the existing click-to-navigate behavior (`onDayEvent` → `/event/detail/{eventId}`) and the per-type color classes (`getEventClasses`).
- Handle events without an `endDate` (treat as single-day on `startDate`).
- Keep the month navigation and "Aujourd'hui" behavior intact.
