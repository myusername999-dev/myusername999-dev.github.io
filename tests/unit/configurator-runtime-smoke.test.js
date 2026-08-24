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
    const baseCss = readFileSync(resolve("css/components/home/hero-cta.css"), "utf8");
    const configuratorCss = readFileSync(resolve("css/configurator.css"), "utf8");
    expect(baseCss).toContain(".cta-slot a.hero-content-mobile");
    expect(baseCss).toContain(".hero-title-slot .hero-content-mobile");
    expect(configuratorCss).toContain(".preview-viewport .hero-title-slot .hero-content-mobile");
    expect(configuratorCss).toContain(".preview-viewport.preview-mobile .hero-content-desktop");
    expect(configuratorCss).toContain(".preview-viewport.preview-mobile .hero-subtitle-slot p");
    expect(configuratorCss).toContain("font-size: var(--mobile-body-size) !important;");
    expect(configuratorCss).toContain(".preview-viewport.preview-mobile .home-nav a");
    expect(configuratorCss).toContain("color: var(--mobile-text);");
    expect(configuratorCss).toContain("background: var(--mobile-surface);");
    expect(mobileCss).toContain(".home-nav a {");
    expect(mobileCss).toContain("color: var(--mobile-text, var(--preview-text));");
    expect(mobileCss).not.toContain(".hero-content-desktop");
    expect(mobileCss).not.toContain(".cta-slot a.hero-content-mobile {");
    expect(mobileCss).not.toContain(".cta-slot {\n    display: flex !important;");
    expect(mobileCss).not.toContain("background: var(--mobile-accent, var(--preview-accent)) !important;");
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

  it("uses sparse mobile layout state for mobile dragging", () => {
    const code = readFileSync(resolve("js/configurator.app.js"), "utf8");
    expect(code).toContain("return getMobileLayout(dragKey);");
    expect(code).toContain("ensureMobileLayout()[dragKey] = { x: x, y: y };");
    expect(code).not.toContain("state.layout.mobileHeroSubtitle.x = x;");
  });

  it("merges sparse mobile logo geometry before emitting HOME styles", () => {
    const code = readFileSync(resolve("js/configurator.app.js"), "utf8");
    expect(code).toContain("var mobileLogo0 = Object.assign({}, config.brand.logos[0], mobileLogos[0] || {});");
    expect(code).toContain("var mobileLogo1 = Object.assign({}, config.brand.logos[1], mobileLogos[1] || {});");
  });

  it("uses resolved mobile logo geometry during direct dragging", () => {
    const code = readFileSync(resolve("js/configurator.app.js"), "utf8");
    expect(code).toContain("node.style.transform = logoTransform(getEditableLogo(logoIndex));");
    expect(code).not.toContain("node.style.transform = logoTransform(state.brand.logos[logoIndex]);");
  });

  it("uses matching desktop fallbacks for legacy mobile typography", () => {
    const code = readFileSync(resolve("js/configurator.app.js"), "utf8");
    expect(code).toContain("mobileBodySize: state.theme.bodySize");
    expect(code).toContain("mobileButtonTextSize: state.theme.buttonTextSize");
  });

  it("labels subtitle-only typography controls explicitly", () => {
    const markup = readFileSync(resolve("tools/configurator/index.html"), "utf8");
    expect(markup).toContain("Hero Subtitle Size (px)");
    expect(markup).toContain("Mobile Hero Subtitle Size (px)");
  });

  it("routes the primary subtitle size control to the selected preview device", () => {
    const code = readFileSync(resolve("js/configurator.app.js"), "utf8");
    expect(code).toContain('if (normalizePreviewDevice(state.display && state.display.previewDevice) === "mobile") {');
    expect(code).toContain("ensureMobileTheme().bodySize = normalized;");
    expect(code).toContain("var bodySizeForControls = normalizePreviewDevice(state.display && state.display.previewDevice) === \"mobile\"");
  });

  it("routes Colors panel changes to mobile overrides when Mobile is selected", () => {
    const code = readFileSync(resolve("js/configurator.app.js"), "utf8");
    expect(code).toContain("ensureMobileTheme().textColor = value;");
    expect(code).toContain("ensureMobileTheme().surfaceColor = value;");
    expect(code).toContain("var themeForColorControls = normalizePreviewDevice(state.display && state.display.previewDevice) === \"mobile\"");
    expect(code).toContain("syncInputsFromState();");
  });

  it("anchors the mobile menu beside its close button and keeps its links interactive", () => {
    const code = readFileSync(resolve("js/configurator.app.js"), "utf8");
    const configuratorCss = readFileSync(resolve("css/configurator.css"), "utf8");
    const mobileCss = readFileSync(resolve("css/mobile/home.css"), "utf8");
    expect(code).toContain("function enablePreviewNavigation()");
    expect(code).toContain('state.display.previewPage = fileName === "index.html"');
    expect(code).toContain('? "home"');
    expect(code).toContain(': normalizePreviewPageValue("page:" + fileName, state);');
    expect(code).toContain('if (dragKey === "nav" && event.target.closest("a")) {');
    expect(configuratorCss).toContain("top: 16px;");
    expect(configuratorCss).toContain("right: 68px;");
    expect(mobileCss).toContain("right: 68px;");
  });

  it("keeps mobile CSS safe for published pages without generated mobile variables", () => {
    const css = readFileSync(resolve("css/mobile/home.css"), "utf8");
    expect(css).toContain("var(--mobile-surface, var(--preview-surface))");
    expect(css).toContain("var(--mobile-text, var(--preview-text))");
    expect(css).not.toContain(".cta-slot a {\n    background:");
    expect(css).not.toContain("--preview-bg: var(--mobile-bg);");
  });

  it("allows the remembered publish folder to be changed and verifies HOME writes", () => {
    const code = readFileSync(resolve("js/configurator.app.js"), "utf8");
    const markup = readFileSync(resolve("tools/configurator/index.html"), "utf8");
    expect(markup).toContain('id="changePublishFolder"');
    expect(code).toContain("await clearRememberedProjectDirectory();");
    expect(code).toContain("var writtenHtml = await writtenFile.text();");
    expect(code).toContain('throw new Error("index.html write verification failed.");');
  });

  it("provides device-aware CTA styling and position controls in Buttons", () => {
    const code = readFileSync(resolve("js/configurator.app.js"), "utf8");
    const markup = readFileSync(resolve("tools/configurator/index.html"), "utf8");
    expect(markup).toContain('id="ctaBackgroundColor"');
    expect(markup).toContain('id="buttonCtaX"');
    expect(code).toContain('setDragPosition("cta", value, position.y);');
    expect(code).toContain("ensureMobileTheme().accentColor = value;");
    expect(code).toContain("var ctaPositionForControls = getDragPosition(\"cta\");");
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
