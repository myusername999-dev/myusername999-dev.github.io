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
});
