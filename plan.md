## HOME Mobile/Desktop Design Separation Plan

### Goal

Make HOME desktop and mobile design independently editable in the configurator, while preserving a shared desktop base and reliable publishing. Mobile settings override desktop only when explicitly changed.

### Architecture

- Desktop/base settings remain the canonical HOME configuration.
- `state.mobile` stores sparse mobile overrides with desktop fallback.
- Add reusable device-resolution code in `js/mobile/`.
- Move HOME breakpoint-only styling to `css/mobile/home.css`.
- Keep shared assets, file metadata, accessibility defaults, publish routing, and draft metadata in the existing shared state.

### Mobile-Independent Settings

- Layout positions
- Logo positions and sizes
- Heading, body, and button typography
- Button padding, gap, and width behavior
- Colors and visual styling
- HOME title, subtitle, button labels, and links

### Implementation Phases

1. Define the versioned `state.mobile` schema for layout, logos, theme, hero content, buttons, and navigation.
2. Extend state normalization so legacy drafts preserve current desktop values and migrate existing mobile layout/font values safely.
3. Move and expand mobile helpers from `tools/configurator/mobile/` to `js/mobile/`; retain bridge-before-app script loading in the configurator.
4. Rewire preview, drag, resize, controls, and input synchronization in `js/configurator.app.js` to use device-aware helper APIs.
5. Add mobile controls and reset-to-desktop actions for all independent HOME settings.
6. Move HOME breakpoint styles into `css/mobile/home.css` and emit resolved mobile CSS variables in generated HOME markup.
7. Update draft import/export, repo draft save/load, live-page initialization, HOME-only publish, and ALL publish so both device layers round-trip safely.
8. Add unit and integration tests for fallback, isolation, migration, draft persistence, and published mobile CSS.
9. Update configurator operations documentation and add a dedicated responsive architecture document.
10. Run automated tests and manual localhost verification at desktop and mobile breakpoints.

### Primary Files

- `js/configurator.app.js`
- `js/mobile/` (new)
- `css/pages/home.css`
- `css/mobile/home.css` (new)
- `tools/configurator/index.html`
- `tools/configurator/core/state-bridge.js`
- `tools/configurator/publish/publish-bridge.js`
- `tests/unit/mobile-layout.test.js`
- `tests/unit/mobile-bridge.test.js`
- `tests/unit/state-bridge.test.js`
- `tests/integration/`
- `docs/configurator-operations.md`
- `docs/mobile-responsive-architecture.md` (new)

### Verification

1. A mobile edit never changes the desktop/base counterpart.
2. An unset mobile value inherits the desktop/base value.
3. Legacy drafts normalize without changing their desktop appearance.
4. Export/import and repo draft workflows retain both layers.
5. Published HOME output contains base rules plus mobile overrides inside `max-width: 760px`.
6. `npm test` passes.
7. Manual configurator and published-page checks pass at desktop and mobile viewports.

### Scope Boundary

This change applies to HOME only. Privacy, Contact, and under-construction pages retain their current responsive behavior and may use this model in a later migration.
