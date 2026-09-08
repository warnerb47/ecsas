# Context
The `event-list` table has two bugs:

1. **No link to event-detail page.** In `libs\ecsas\feature-event\src\lib\pages\event-list\event-list.component.html`, each `<tr>` (around line 93) has no `routerLink`/click handler, so there's no way to navigate to the event detail page from the list. We want an eye icon per row linking to `/event/detail/{event.id}`.

2. **Event type icon not showing.** In `event-list.component.ts`, `getTypeIcon()` (lines 147-156) maps `event.type` to an icon class, applied in the template (lines 96-98) as `<i [class]="getTypeIcon(event.type)" class="pi"></i>`. The icon apparently does not render. Possible causes: the `pi` class combined with `[class]` binding conflicting with each other, or the `i` element needing the `pi` base class applied correctly. The browser may be stripping/resetting classes because `[class]` overrides static `class`.

# Instruction
Fix the event list table.

Requirements:
- **Add an eye icon** to each row (e.g. in a last "Action" column) that navigates to the event detail page at `/event/detail/{eventId}`.
- **Fix the event type icon** so the correct type icon displays. The current `<i [class]="getTypeIcon(event.type)" class="pi"></i>` binding conflicts between `[class]` and static `class="pi"`. Refactor to combine them reliably (e.g. use a single bound class string including the `pi` base, or a dedicated bound attribute) so both the `pi` base style and the type-specific icon class render.
- Verify the icon appears for all event types using `getTypeIcon()`'s mapping.

