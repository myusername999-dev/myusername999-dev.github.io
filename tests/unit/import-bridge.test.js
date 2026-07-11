import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import vm from "node:vm";

describe("import bridge", () => {
  function loadBridge() {
    const code = readFileSync(resolve("tools/configurator/import/import-bridge.js"), "utf8");
    const sandbox = { window: {} };
    vm.createContext(sandbox);
    vm.runInContext(code, sandbox);
    return sandbox.window.ConfiguratorImportBridge;
  }

  it("extracts home patch including desktop and mobile layout", () => {
    const bridge = loadBridge();
    const html = [
      "<html><head><title>VINATECH - HOME</title></head><body>",
      "<main class=\"home-root\" style=\"--preview-bg:#0f0f0f;--preview-text:#ededed;--preview-accent:#28a745;--preview-muted:#737373;--preview-surface:#1f1f1f;--preview-button-text:#ffffff;--preview-heading-size:62px;--preview-body-size:21px;--mobile-nav-x:12px;--mobile-nav-y:24px;--mobile-hero-title-x:10px;--mobile-hero-title-y:20px;--mobile-hero-subtitle-x:8px;--mobile-hero-subtitle-y:16px;--mobile-cta-x:14px;--mobile-cta-y:28px;font-family:'Montserrat',sans-serif\">",
      "<div data-drag-key=\"nav\" style=\"transform: translate(11px, 22px);\"></div>",
      "<div data-drag-key=\"heroTitle\" style=\"transform: translate(33px, 44px);\"></div>",
      "<div data-drag-key=\"heroSubtitle\" style=\"transform: translate(55px, 66px);\"></div>",
      "<div data-drag-key=\"cta\" style=\"transform: translate(77px, 88px);\"></div>",
      "<section class=\"hero-title-slot\"><h1>Build Faster</h1></section>",
      "<section class=\"hero-subtitle-slot\"><p>Ship with confidence</p></section>",
      "</main></body></html>"
    ].join("");

    const result = bridge.extractHomePatch(html);

    expect(result.patch.brand.name).toBe("VINATECH");
    expect(result.patch.hero.title).toBe("Build Faster");
    expect(result.patch.hero.subtitle).toBe("Ship with confidence");
    expect(result.patch.theme.bgColor).toBe("#0f0f0f");
    expect(result.patch.theme.fontFamily).toBe("Montserrat");
    expect(result.patch.layout.nav).toEqual({ x: 11, y: 22 });
    expect(result.patch.layout.mobileHeroSubtitle).toEqual({ x: 8, y: 16 });
    expect(result.patch.layout.mobileCta).toEqual({ x: 14, y: 28 });
    expect(result.importedFields.length).toBeGreaterThan(10);
    expect(result.warnings).toEqual([]);
  });

  it("merges nested patches and builds report summary", () => {
    const bridge = loadBridge();

    const merged = bridge.mergeImportPatches(
      { hero: { title: "Old", subtitle: "Base" }, theme: { bgColor: "#111" } },
      { hero: { title: "New" }, theme: { textColor: "#eee" } }
    );

    expect(merged).toEqual({
      hero: { title: "New", subtitle: "Base" },
      theme: { bgColor: "#111", textColor: "#eee" }
    });

    const report = bridge.buildImportReport({
      home: { success: true, importedFields: ["hero.title"], warnings: [] },
      contact: { success: false, importedFields: [], warnings: ["fetch failed"] },
      privacy: { success: true, importedFields: ["privacy.title", "privacy.intro"], warnings: ["fallback"] }
    });

    expect(report.importedFieldsCount).toBe(3);
    expect(report.warningsCount).toBe(2);
    expect(report.failedPages).toEqual(["contact"]);
    expect(report.message).toContain("with issues");
  });
});
