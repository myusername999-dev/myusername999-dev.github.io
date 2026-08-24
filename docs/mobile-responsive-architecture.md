# HOME Responsive Design Architecture

## Scope

The HOME configurator uses a desktop/base design and mobile overrides. This migration currently isolates HOME layout coordinates, logo position/size, and heading/body/button text sizes. Privacy, Contact, and under-construction pages keep their existing responsive behavior.

## Ownership

- `js/configurator.app.js` coordinates controls, preview rendering, state persistence, and publishing.
- `js/mobile/mobile-layout.js` contains testable device normalization, preview resolution, and device-aware layout/logo mutations.
- `js/mobile/mobile-bridge.js` exposes mobile preview resolution to the non-module configurator runtime.
- `css/mobile/home.css` contains HOME rules that apply only at `max-width: 760px`.
- `tools/configurator/core/state-bridge.js` normalizes mobile overrides and migrates legacy mobile layout coordinates.

## State Contract

Desktop values remain in `layout` and `brand.logos`.

Mobile values are stored in `mobile`:

```js
{
  mobile: {
    layout: {
      nav: { x, y },
      heroTitle: { x, y },
      heroSubtitle: { x, y },
      cta: { x, y }
    },
    brand: {
      logos: [{ x, y, size }, { x, y, size }]
    },
    theme: {
      headingSize,
      bodySize,
      buttonTextSize
    },
    buttons: {
      paddingY,
      paddingX,
      gap,
      width: "auto" | "full"
    },
    hero: {
      title,
      subtitle,
      buttons: [{ label, href }]
    }
  }
}
```

During migration, legacy `layout.mobileNav`, `layout.mobileHeroTitle`, `layout.mobileHeroSubtitle`, `layout.mobileCta`, `theme.mobileHeadingSize`, and `theme.mobileBodySize` values seed the new mobile values. Missing mobile logo and typography values fall back to desktop values. Explicit zero values for layout coordinates and CTA spacing are preserved during normalization.

Mobile state is sparse: only fields deliberately changed in mobile mode are persisted. Renderers and controls resolve missing mobile values from the desktop base state. Group reset removes the corresponding mobile override (`mobile.theme` or `mobile.buttons`), restoring the desktop values without writing duplicate fallback data.

## Current Editing Behavior

In mobile preview mode, logo position and size controls, plus direct logo dragging, modify `mobile.brand.logos`. Mobile heading, body, button text, and theme color controls modify `mobile.theme`. Mobile CTA padding, gap, and width controls modify `mobile.buttons`. Mobile hero title, subtitle, CTA labels, and CTA links modify `mobile.hero`. Published HOME markup includes desktop and mobile content variants and the mobile stylesheet selects the correct variant at the breakpoint. Desktop logo, typography, CTA layout, colors, content, and links remain unchanged. Logo image files, rotation, and transparency remain shared in this phase. The existing typography and CTA resets remove their complete mobile group and therefore revert it to desktop; dedicated per-group reset controls remain future UI work.

## Stylesheet Order

Published HOME HTML loads the base HOME component stylesheets first and `css/mobile/home.css` last. The mobile stylesheet applies the mobile logo variables only at the mobile breakpoint.

## Verification

Run focused checks while changing responsive behavior:

```powershell
npm test -- tests/unit/state-bridge.test.js tests/unit/mobile-layout.test.js tests/unit/mobile-bridge.test.js tests/integration/environment-support.test.js
```

Run the full suite before publishing:

```powershell
npm test
```

In the configurator, change a logo position and size in mobile preview, switch back to desktop, and confirm the desktop logo remains unchanged. Publish HOME and inspect both a desktop viewport and a viewport at or below 760px.
