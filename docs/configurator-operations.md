## Configurator Operations Guide

### 1. Start local web server
1. Install dependencies:
   - `npm install`
2. Run server:
   - `npm run serve:configurator`
3. Open:
   - `http://127.0.0.1:8080/tools/configurator/index.html`

### 2. Why localhost is required
1. Localhost provides a secure context for reliable file system picker operations.
2. Avoid testing configurator through `file://` paths.

### 3. Configurator locations
1. Main configurator entry: `tools/configurator/index.html`
2. Mobile runtime modules: `js/mobile/`
3. Publish services: `tools/configurator/publish/`
4. Test suites: `tests/`

### 3.1 Focused module pages
1. Colors page: `tools/configurator/settings/colors.html`
2. Fonts page: `tools/configurator/settings/fonts.html`
3. Buttons page: `tools/configurator/settings/buttons.html`
4. Logos page: `tools/configurator/settings/logos.html`
5. Publish page: `tools/configurator/publish/index.html`

These pages route into the same configurator runtime with panel focus, so behavior stays consistent while editing becomes more manageable.

### 4. Working with page edit modes
1. Switch editor mode between Home, Privacy, and Contact.
2. Apply settings in separated sections:
   - Colors
   - Fonts
   - Button Titles
   - Logos
3. Settings must apply to the currently active page scope only.

### 5. Desktop and mobile verification
1. Desktop:
   - Use desktop preview and verify layout positions.
2. Mobile:
   - Use mobile preview and verify mobile override positions.
3. Confirm changes in one environment do not unintentionally alter the other.
4. HOME logo safety:
   - In mobile preview, logo position and size changes are saved as mobile overrides.
   - Switch back to desktop after each logo edit and confirm desktop position and size are unchanged.
   - Logo files, rotation, and transparency remain shared between desktop and mobile.
5. HOME typography safety:
   - Mobile heading, body, and button text size controls are independent from desktop values.
   - Switch back to desktop after each typography edit and confirm desktop text sizes are unchanged.
6. HOME CTA layout safety:
   - Mobile CTA padding, gap, and width controls are independent from desktop values.
   - Switch back to desktop after each CTA layout edit and confirm desktop buttons are unchanged.
7. HOME color safety:
   - Mobile background, text, accent, muted, surface, and button-text colors are independent from desktop values.
   - Switch back to desktop after each color edit and confirm desktop colors are unchanged.
8. Mobile stylesheet:
   - HOME mobile rules are stored in `css/mobile/home.css` and apply at `max-width: 760px`.
9. Reset to desktop:
   - Typography and CTA layout resets remove their mobile override group instead of copying desktop values into it.
   - After resetting, the mobile preview resolves that group from the desktop values again.

### 6. Publish and draft workflows
1. Publish scopes:
   - HOME only
   - PRIVACY only
   - CONTACT only
   - ALL pages
2. Draft operations:
   - Export Draft JSON
   - Import Draft JSON
   - Save Draft to Repo File
   - Load Draft from Repo File
   - Initialize Draft from Live Pages (HOME/CONTACT/PRIVACY)

### 6.2 Under-construction page workflow
1. Use the **Under Construction** panel in `tools/configurator/index.html` to configure temporary associated pages.
2. Fixed pages are intentionally excluded from substitution:
   - `index.html`
   - `privacy.html`
   - `contact.html`
3. Select target pages manually from the panel list (for example `news.html`, `solutions.html`, `about.html`).
4. Configure desktop image and mobile image independently:
   - Desktop image applies to desktop layout.
   - Mobile image applies on mobile view (`max-width: 760px`).
   - Optional fallback: use desktop image for mobile when same-image mode is enabled.
5. Publish behavior:
   - **Publish ALL pages** generates selected non-fixed pages in under-construction mode.
   - HOME/PRIVACY/CONTACT publish behavior remains unchanged.
6. Draft persistence:
   - Under-construction settings are saved with the same draft flow (local storage, export/import JSON, and repo draft file).

### 6.1 Initialize from live pages
1. Use `Initialize Draft from Live Pages` before editing when you want to start from current published content.
2. Import currently reads:
   - `index.html`
   - `contact.html`
   - `privacy.html`
3. The importer merges detected values into current draft state instead of replacing the full draft object.
4. Desktop and mobile layout values are both imported when present in HOME page style variables.
5. Draft export/import, repo draft save/load, HOME-only publish, and ALL-pages publish preserve sparse `mobile` overrides, including mobile hero copy and CTA links.
6. Import report now includes diagnostics:
   - confidence by page (`high` / `medium` / `low`)
   - unresolved field list (`page:field`)
   - preserved-by-policy list for fields intentionally left to existing draft state
7. Known preservation-first limitations:
   - mobile layout overrides are preserved unless explicit mobile CSS vars are found
   - detailed tab/gallery structures are preserved from existing draft unless reliably inferable
   - contact field schema is preserved unless explicit form structure extraction is added

### 7. Run automated tests
1. Run all tests:
   - `npm test`
2. Watch mode:
   - `npm run test:watch`
3. Test policy:
   - All test code lives under `tests/`.

### 7.1 Unit testing focus
1. Import parser/merge logic is covered by:
   - `tests/unit/import-bridge.test.js`
2. Live import orchestration and failure handling is covered by:
   - `tests/unit/live-importer.test.js`
3. End-to-end bridge/importer cooperation is covered by:
   - `tests/integration/live-page-import.test.js`
4. Environment-preservation behavior after import is covered by:
   - `tests/integration/environment-support.test.js`
5. Importer test matrix should include:
   - full success import across HOME/CONTACT/PRIVACY
   - partial fetch failure fallback
   - unresolved-fields diagnostics emission
   - mobile override preservation when mobile coordinates are absent
6. Under-construction feature coverage should include:
   - state normalization and legacy default migration
   - fixed-page exclusion (`index.html`, `privacy.html`, `contact.html`)
   - desktop/mobile image fallback behavior
   - associated-page generation branch behavior for selected pages

### 7.2 Import failure triage
1. Parser failure indicators:
   - `unresolvedFields` grows unexpectedly for one page while fetch succeeds.
2. Fetch/input failure indicators:
   - page listed in `failedPages` with warning containing non-200 status.
3. Merge-policy regression indicators:
   - mobile overrides change even when importer patch lacks mobile fields.
4. Suggested triage flow:
   - run `npm test`
   - inspect `tests/unit/import-bridge.test.js` first for selector/parser issues
   - inspect `tests/unit/live-importer.test.js` for diagnostics/flow issues
   - inspect `tests/integration/environment-support.test.js` for preservation regressions

### 8. Current migration status
1. Folder structure and module entry pages are in place.
2. Desktop and mobile baseline tests are passing.
3. Publish and mobile helper extraction is active through runtime bridge modules:
   - `tools/configurator/publish/publish-bridge.js`
   - `js/mobile/mobile-bridge.js`
4. State normalization extraction is active through:
   - `tools/configurator/core/state-bridge.js`
   - includes page/tab/preview normalization, text-align/contact-field normalization, and logo/gallery helper normalization
5. Preview descriptor/selection extraction is active through:
   - `tools/configurator/core/preview-bridge.js`
   - includes privacy/contact descriptor detection, fixed-page filename detection, selected preview option resolution, full preview selection resolution from config/value, preview page option construction, preview page value normalization, preview page options refresh orchestration, page href normalization, associated page descriptor derivation, associated tab-page list generation, associated tab-page HTML shell building, associated page markup composition, associated published-page HTML shell building, and preview-window open plan resolution (direct URL vs generated HTML)
6. Publish decision extraction now includes:
   - scoped target derivation (`getPublishTargets`)
   - validation gating (`shouldValidateState`)
   - associated-page inclusion gating (`shouldIncludeAssociatedPages`)
   - execution planning (`getPublishExecutionPlan`)
   - transport branching (`resolvePublishFlowContext`, `shouldUseDirectoryPublishing`)
   - outcome status resolution (`resolvePublishOutcomeStatus`)
   - error classification/status composition (`classifyPublishError`, `buildPublishAbortStatus`, `buildPublishFailureStatus`)
   - fallback trigger policy (`resolvePublishErrorPolicy`)
   - state validation (`validateStateFromConfig`)
   - preserve-existing-home decision (`shouldPreserveExistingHomeOnPublish`)
7. Draft preference/script extraction is active through:
   - `tools/configurator/draft/draft-bridge.js`
   - includes save-plan resolution (`resolveDraftSavePlan`), draft-save error classification (`classifyDraftSaveError`), draft save/load/import status composition (`buildDraftSaveStatus`, `buildDraftLoadStatus`, `buildDraftImportStatus`), plus repo draft script/candidate/preference helpers
8. Publish/save/restore deep logic extraction from legacy runtime has been completed through bridge modules and compatibility wrappers.
9. Live-page import extraction is active through:
   - `tools/configurator/import/import-bridge.js`
   - `tools/configurator/import/live-importer.js`

### 9. Completed 3-phase plan
1. Phase 1 (completed): Extract preview-window open decision logic into preview bridge.
2. Phase 2 (completed): Extract publish orchestration core flow from legacy runtime into publish modules while keeping wrapper fallbacks.
3. Phase 3 (completed/final): Extract draft save/load orchestration and finish fallback cleanup with stabilization tests.

### 10. Troubleshooting
1. Folder picker does not open:
   - Verify configurator is opened from localhost URL.
2. Publish falls back to downloads:
   - Browser permissions may block write access to selected folder.
3. Missing assets after publish:
   - Check copied files in `images/` and verify selected project root.
