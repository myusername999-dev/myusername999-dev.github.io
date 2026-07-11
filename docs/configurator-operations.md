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

### 8. Troubleshooting
1. Folder picker does not open:
   - Verify configurator is opened from localhost URL.
2. Publish falls back to downloads:
   - Browser permissions may block write access to selected folder.
3. Missing assets after publish:
   - Check copied files in `images/` and verify selected project root.
