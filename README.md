# myusername999-dev.github.io

## Homepage Configurator

Canonical configurator location:

- `tools/configurator/index.html`

Compatibility entry still exists at `configurator.html` and redirects to the canonical location.

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

Publish behavior:

- Publish requires selecting the project root folder (the one containing `index.html`).
- Uploaded images are copied into `images/` in that selected project folder.
- If folder selection/write is canceled or blocked, it downloads `index.html` and all image files so you can move the images into `images/` manually.

## Directory Policy

- Configurator modules: `tools/configurator/`
- Mobile-manageable modules: `tools/configurator/mobile/`
- Local mini web server: `tools/webserver/`
- All tests (unit/integration/fixtures/helpers): `tests/`
- Operations documentation: `docs/configurator-operations.md`

## Test Commands

- Run all tests: `npm test`
- Watch mode: `npm run test:watch`