import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

describe("configurator runtime smoke", () => {
  it("keeps preview selection helper wired for normalizePreviewPage", () => {
    const code = readFileSync(resolve("js/configurator.app.js"), "utf8");
    expect(code).toContain("function selectPreviewPage(options, selectedValue)");
    expect(code).toContain("selectPreviewPage: selectPreviewPage");
  });

  it("rewrites root images paths for draggable preview rendering", () => {
    const code = readFileSync(resolve("js/configurator.app.js"), "utf8");
    expect(code).toContain("function resolvePreviewAssetPath(src, draggable)");
    expect(code).toContain("if (/^images\\//i.test(value))");
    expect(code).toContain("return \"../../\" + value;");
  });

  it("rewrites draggable preview page links to site root", () => {
    const code = readFileSync(resolve("js/configurator.app.js"), "utf8");
    expect(code).toContain("function resolvePreviewSiteHref(hrefValue)");
    expect(code).toContain("return \"../../\" + href;");
    expect(code).toContain("href = resolvePreviewSiteHref(href);");
  });

  it("rewrites privacy/contact preview iframe page hrefs to site root", () => {
    const code = readFileSync(resolve("js/configurator.app.js"), "utf8");
    expect(code).toContain("function resolvePreviewPageHref(fileHref)");
    expect(code).toContain("var href = resolvePreviewPageHref(fileHref);");
    expect(code).toContain("return \"../../\" + href;");
  });

  it("uses contrast-safe CTA color when buttons are text-only", () => {
    const code = readFileSync(resolve("js/configurator.app.js"), "utf8");
    expect(code).toContain("function resolveVisibleCtaTextColor()");
    expect(code).toContain("contrastRatio(desired, background)");
    expect(code).toContain("color:\" + escapeAttr(visibleCtaTextColor)");
    expect(code).toContain("desired.toLowerCase() === \"#ffffff\"");
    expect(code).toContain("hasBackgroundImage");
  });

  it("clamps imported CTA offsets to visible range", () => {
    const code = readFileSync(resolve("js/configurator.app.js"), "utf8");
    expect(code).toContain("function clampImportedCtaOffsetsToVisibleArea()");
    expect(code).toContain("clampCtaAxis(state.layout.cta, \"y\", -220, 80)");
    expect(code).toContain("clampCtaAxis(state.layout.mobileCta, \"y\", -140, 160)");
    expect(code).toContain("var visibilityClamp = clampImportedCtaOffsetsToVisibleArea();");
  });

  it("provides granular reset helpers and center-visible reset", () => {
    const code = readFileSync(resolve("js/configurator.app.js"), "utf8");
    expect(code).toContain("function resetHomeToCenterVisibleDefaults()");
    expect(code).toContain("function resetLayoutDefaults(options)");
    expect(code).toContain("function resetFontsDefaults()");
    expect(code).toContain("function resetButtonsDefaults()");
    expect(code).toContain("function resetLogosDefaults()");
    expect(code).toContain("function resetColorsDefaults()");
    expect(code).toContain("state.layout.cta.y = 0;");
    expect(code).toContain("delete state.mobile.theme;");
    expect(code).toContain("delete state.mobile.buttons;");
  });

  it("renders CTA row only when buttons exist", () => {
    const code = readFileSync(resolve("js/configurator.app.js"), "utf8");
    expect(code).toContain("var ctaMarkup = buttonLinks");
    expect(code).toContain("ctaMarkup,");
  });

  it("publishes HOME with the mobile stylesheet and logo override variables", () => {
    const code = readFileSync(resolve("js/configurator.app.js"), "utf8");
    expect(code).toContain("css/mobile/home.css");
    expect(code).toContain("--mobile-logo-0-x:");
    expect(code).toContain("--mobile-logo-1-size:");
    expect(code).toContain("--mobile-heading-size:");
    expect(code).toContain("--mobile-button-text-size:");
    expect(code).toContain("--mobile-button-padding-y:");
    expect(code).toContain("--mobile-button-width:");
    expect(code).toContain("--mobile-accent:");
    expect(code).toContain("--mobile-button-text:");
  });

  it("renders independent mobile hero content and CTA links", () => {
    const code = readFileSync(resolve("js/configurator.app.js"), "utf8");
    const mobileCss = readFileSync(resolve("css/mobile/home.css"), "utf8");
    expect(code).toContain("function getMobileHero()");
    expect(code).toContain("function renderMobileButtonsEditor()");
    expect(code).toContain("var mobileHeroOverrides = config.mobile && config.mobile.hero");
    expect(code).toContain("hero-content-mobile");
    expect(mobileCss).toContain(".hero-content-desktop");
    expect(mobileCss).toContain(".cta-slot a.hero-content-mobile");
    const baseCss = readFileSync(resolve("css/components/home/hero-cta.css"), "utf8");
    const configuratorCss = readFileSync(resolve("css/configurator.css"), "utf8");
    expect(baseCss).toContain(".cta-slot a.hero-content-mobile");
    expect(baseCss).toContain(".hero-title-slot .hero-content-mobile");
    expect(configuratorCss).toContain(".preview-viewport .hero-title-slot .hero-content-mobile");
    expect(configuratorCss).toContain(".preview-viewport.preview-mobile .hero-content-desktop");
  });

  it("keeps mobile overrides when drafts are merged", () => {
    const code = readFileSync(resolve("js/configurator.app.js"), "utf8");
    expect(code).toContain("merged.mobile = deepClone(incoming.mobile || merged.mobile || {});");
  });

  it("uses sparse mobile layout state for mobile position controls", () => {
    const code = readFileSync(resolve("js/configurator.app.js"), "utf8");
    expect(code).toContain('ensureMobileLayout().nav = Object.assign({}, getMobileLayout("nav"), { x: value });');
    expect(code).toContain('dom.mobileNavX.value = String(getMobileLayout("nav").x);');
    expect(code).toContain('dom.mobileCtaY.value = String(getMobileLayout("cta").y);');
    expect(code).not.toContain("state.layout.mobileNav.x = value;");
  });

  it("uses matching desktop fallbacks for legacy mobile typography", () => {
    const code = readFileSync(resolve("js/configurator.app.js"), "utf8");
    expect(code).toContain("mobileBodySize: state.theme.bodySize");
    expect(code).toContain("mobileButtonTextSize: state.theme.buttonTextSize");
  });

  it("keeps mobile CSS safe for published pages without generated mobile variables", () => {
    const css = readFileSync(resolve("css/mobile/home.css"), "utf8");
    expect(css).toContain("var(--mobile-accent, var(--preview-accent))");
    expect(css).toContain("var(--mobile-button-text, var(--preview-button-text))");
    expect(css).toContain("var(--mobile-surface, var(--preview-surface))");
    expect(css).not.toContain("--preview-bg: var(--mobile-bg);");
  });

  it("wires under-construction controls and generation branch", () => {
    const code = readFileSync(resolve("js/configurator.app.js"), "utf8");
    expect(code).toContain("UNDER_CONSTRUCTION_DEFAULT_IMAGE");
    expect(code).toContain("function renderUnderConstructionPagesEditor()");
    expect(code).toContain("function addCustomUnderConstructionPage()");
    expect(code).toContain("function normalizeUnderConstructionConfig(value)");
    expect(code).toContain("function shouldUseUnderConstructionPage(tab, config)");
    expect(code).toContain("function buildUnderConstructionPageMarkup(tab, config, draggable)");
    expect(code).toContain("under-construction-picture");
    expect(code).toContain("handleUnderConstructionPublish()");
  });
});
