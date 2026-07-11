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
2. Mobile-manageable modules: `tools/configurator/mobile/`
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

### 7. Run automated tests
1. Run all tests:
   - `npm test`
2. Watch mode:
   - `npm run test:watch`
3. Test policy:
   - All test code lives under `tests/`.

### 9. Current migration status
1. Folder structure and module entry pages are in place.
2. Desktop and mobile baseline tests are passing.
3. Publish and mobile helper extraction is active through runtime bridge modules:
   - `tools/configurator/publish/publish-bridge.js`
   - `tools/configurator/mobile/mobile-bridge.js`
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
   - state validation (`validateStateFromConfig`)
   - preserve-existing-home decision (`shouldPreserveExistingHomeOnPublish`)
7. Draft preference/script extraction is active through:
   - `tools/configurator/draft/draft-bridge.js`
8. Publish/save/restore deep logic extraction from legacy runtime remains incremental and continues in next phases.

### 10. Remaining 3-phase plan
1. Phase 1 (completed): Extract preview-window open decision logic into preview bridge.
2. Phase 2 (in progress): Extract publish orchestration core flow from legacy runtime into publish modules while keeping wrapper fallbacks.
3. Phase 3 (final): Extract draft save/load orchestration and finish fallback cleanup with stabilization tests.

### 8. Troubleshooting
1. Folder picker does not open:
   - Verify configurator is opened from localhost URL.
2. Publish falls back to downloads:
   - Browser permissions may block write access to selected folder.
3. Missing assets after publish:
   - Check copied files in `images/` and verify selected project root.
