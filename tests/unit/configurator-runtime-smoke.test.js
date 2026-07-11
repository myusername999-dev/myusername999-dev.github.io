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
  });
});
