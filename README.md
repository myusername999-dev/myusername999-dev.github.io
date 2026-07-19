# myusername999-dev.github.io

## Homepage Configurator

Canonical configurator location:

- `tools/configurator/index.html`

Focused module pages:

- `tools/configurator/settings/colors.html`
- `tools/configurator/settings/fonts.html`
- `tools/configurator/settings/buttons.html`
- `tools/configurator/settings/logos.html`
- `tools/configurator/publish/index.html`

Run local server for testing:

1. `npm install`
2. `npm run serve:configurator`
3. Open `http://127.0.0.1:8080/tools/configurator/index.html`

Use the configurator to design the homepage before publishing:

1. Upload logo and background images.
2. Adjust background transparency live in preview.
3. Change fonts, heading/body sizes, and colors.
4. Configure button text size and manage multiple action buttons.
5. Drag logo, nav, hero text, and CTA button group positions in preview.
6. Manage tabs and linked section blocks, including per-tab font, colors, background image, tab image transparency controls, and up to 4 gallery images with selectable layout.
7. Click **Preview HOME** for a full-page preview.
8. Approve and click **Publish to index.html**.
9. Configure **Under Construction** pages for non-fixed associated pages using manual selection and separate desktop/mobile images when needed.

Publish behavior:

- Publish requires selecting the project root folder (the one containing `index.html`).
- Uploaded images are copied into `images/` in that selected project folder.
- If folder selection/write is canceled or blocked, it downloads `index.html` and all image files so you can move the images into `images/` manually.
- Under-construction substitution applies only to manually selected non-fixed associated pages.
- Fixed pages `index.html`, `privacy.html`, and `contact.html` stay on their existing generation paths.

## Directory Policy

- Configurator modules: `tools/configurator/`
- Mobile-manageable modules: `tools/configurator/mobile/`
- Local mini web server: `tools/webserver/`
- All tests (unit/integration/fixtures/helpers): `tests/`
- Operations documentation: `docs/configurator-operations.md`

## Test Commands

- Run all tests: `npm test`
- Watch mode: `npm run test:watch`
- Under-construction tests live in unit bridge/runtime suites under `tests/unit/` and publish routing coverage under `tests/integration/`.

## Migration Notes

- Legacy runtime `js/configurator.app.js` now incrementally delegates selected publish and mobile helpers to bridge modules under `tools/configurator/`.
- Full extraction remains phased to preserve behavior stability.