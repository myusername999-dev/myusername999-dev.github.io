# HOME Mobile/Desktop Design Checklist

Status key: `[ ]` not started, `[-]` in progress, `[x]` complete, `[!]` blocked

## Planning

- [x] Investigate current desktop/mobile state separation.
- [x] Confirm that current mobile logo moves and resizes can alter desktop.
- [x] Choose mobile override architecture with desktop fallback.
- [x] Choose independent mobile settings: layout, logos, typography, buttons, colors, content, and links.
- [x] Choose folder direction: `js/mobile/` and `css/mobile/`.

## State And Migration

- [x] Define versioned `state.mobile` schema.
- [x] Define desktop fallback behavior for implemented layout and logo overrides.
- [x] Add legacy-draft normalization for existing mobile layout values.
- [x] Migrate existing mobile layout and font fields.
- [x] Add mobile logo position and size overrides.
- [-] Add independent mobile theme, button, content, and link overrides. Typography, CTA layout, and colors are complete; content and links remain pending.
- [ ] Update state fixtures.

## JavaScript Structure

- [x] Create `js/mobile/`.
- [x] Move `mobile-layout.js` to `js/mobile/`.
- [x] Move `mobile-bridge.js` to `js/mobile/`.
- [x] Update configurator script references and test imports.
- [x] Centralize device normalization and override resolution.
- [x] Centralize mobile preview transformation.
- [x] Centralize device-aware drag and resize writes for layout and logos.
- [ ] Add reset-to-desktop helper behavior.
- [ ] Remove duplicated inline mobile decision logic from the main runtime.

## Configurator Controls

- [x] Add or update mobile controls for logo position and size.
- [x] Add mobile typography controls, including button text size.
- [x] Add mobile button padding, gap, and width controls.
- [x] Add mobile colors and visual-style controls.
- [ ] Add mobile HOME content and link controls.
- [ ] Add reset-to-desktop controls for each override group.
- [ ] Verify desktop controls write only base state.
- [ ] Verify mobile controls write only `state.mobile` overrides.

## CSS Structure

- [x] Create `css/mobile/`.
- [x] Move HOME mobile breakpoint rules to `css/mobile/home.css`.
- [x] Preserve base-first, mobile-second CSS load order.
- [-] Add mobile variables for logos, typography, buttons, colors, content, and links. Logo, typography, and CTA layout variables are complete; remaining groups are pending.
- [ ] Verify desktop CSS output remains unchanged without mobile overrides.

## Rendering And Publishing

- [x] Resolve implemented mobile layout, logo, typography, and CTA layout overrides in configurator preview rendering.
- [x] Emit mobile logo, typography, and CTA layout CSS variables in generated HOME markup.
- [x] Preserve desktop rules outside `max-width: 760px`.
- [x] Emit implemented mobile logo overrides within `max-width: 760px`.
- [ ] Update HOME-only publishing.
- [ ] Update ALL-pages publishing.
- [ ] Update draft export/import.
- [ ] Update repo draft save/load.
- [ ] Update live-page initialization compatibility.

## Tests

- [x] Update `tests/unit/mobile-layout.test.js`.
- [x] Update `tests/unit/mobile-bridge.test.js`.
- [x] Update `tests/unit/state-bridge.test.js`.
- [x] Add legacy-draft migration tests.
- [x] Add desktop fallback tests for absent mobile logo overrides.
- [ ] Add mobile-to-desktop isolation tests for every independent setting group.
- [x] Add logo desktop-mobile-desktop regression test.
- [ ] Add draft export/import round-trip tests.
- [ ] Add published HOME mobile CSS tests.
- [x] Run focused unit and integration tests.
- [x] Run `npm test`.

## Documentation And Manual Verification

- [x] Update `docs/configurator-operations.md`.
- [x] Create `docs/mobile-responsive-architecture.md`.
- [x] Document shared versus mobile-independent settings.
- [ ] Document reset-to-desktop behavior.
- [ ] Document draft and publish migration behavior.
- [ ] Start the configurator server successfully.
- [ ] Verify each mobile control does not alter desktop in localhost configurator.
- [ ] Publish HOME and inspect desktop output.
- [ ] Publish HOME and inspect output at viewport <=760px.
