import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import vm from "node:vm";

describe("live importer", () => {
  function loadImporter() {
    const bridgeCode = readFileSync(resolve("tools/configurator/import/import-bridge.js"), "utf8");
    const importerCode = readFileSync(resolve("tools/configurator/import/live-importer.js"), "utf8");
    const sandbox = { window: {} };
    vm.createContext(sandbox);
    vm.runInContext(bridgeCode, sandbox);
    vm.runInContext(importerCode, sandbox);
    return sandbox.window.ConfiguratorLiveImporter;
  }

  it("imports patches from all configured pages", async () => {
    const importer = loadImporter();
    const pageHtml = {
      "../../index.html": "<title>VINATECH - HOME</title><main class=\"home-root\" style=\"--preview-bg:#112233\"><h1>Main Title</h1><p>Main Subtitle</p></main>",
      "../../contact.html": "<h1>Contact VINATECH Limited</h1><p>Contact intro text.</p>",
      "../../privacy.html": "<h1>Privacy Policy</h1><p>Privacy intro text.</p>"
    };

    const fetchFn = async (url) => ({
      ok: true,
      status: 200,
      text: async () => pageHtml[url] || ""
    });

    const result = await importer.importFromLivePages({ fetchFn });

    expect(result.ok).toBe(true);
    expect(result.patch.brand.name).toBe("VINATECH");
    expect(result.patch.hero.title).toBe("Main Title");
    expect(result.patch.contact.title).toBe("Contact VINATECH Limited");
    expect(result.patch.privacy.title).toBe("Privacy Policy");
    expect(result.report.failedPages).toEqual([]);
    expect(result.diagnostics).toBeTruthy();
    expect(result.diagnostics.confidenceByPage.home).toMatch(/high|medium|low/);
    expect(Array.isArray(result.diagnostics.unresolvedFields)).toBe(true);
    expect(result.diagnostics.preservedByPolicy).toContain("layout.mobileNav");
  });

  it("reports failed pages while preserving successful imports", async () => {
    const importer = loadImporter();
    const fetchFn = async (url) => {
      if (url.includes("privacy")) {
        return { ok: false, status: 404, text: async () => "" };
      }
      return {
        ok: true,
        status: 200,
        text: async () => "<h1>Loaded</h1><p>Intro</p>"
      };
    };

    const result = await importer.importFromLivePages({ fetchFn });

    expect(result.ok).toBe(true);
    expect(result.report.failedPages).toEqual(["privacy"]);
    expect(result.report.message).toContain("with issues");
    expect(result.patch.contact.title).toBe("Loaded");
    expect(result.diagnostics.confidenceByPage.privacy).toBe("low");
    expect(result.diagnostics.unresolvedFields.some((field) => field.startsWith("contact:"))).toBe(true);
  });

  it("keeps unresolved mobile fields out of patch so runtime can preserve existing overrides", async () => {
    const importer = loadImporter();
    const fetchFn = async (url) => ({
      ok: true,
      status: 200,
      text: async () => {
        if (url.includes("index.html")) {
          return "<title>VINATECH</title><main class=\"home-root\" style=\"--preview-bg:#000\"><h1>Home</h1><p>Subtitle</p></main>";
        }
        return "<h1>Page</h1><p>Text</p>";
      }
    });

    const result = await importer.importFromLivePages({ fetchFn });

    expect(result.patch.layout.mobileNav).toBeUndefined();
    expect(result.patch.layout.mobileHeroTitle).toBeUndefined();
    expect(result.patch.layout.mobileHeroSubtitle).toBeUndefined();
    expect(result.patch.layout.mobileCta).toBeUndefined();
    expect(result.diagnostics.unresolvedFields).toContain("home:layout.nav");
  });

  it("emits user-facing status hints when fallback warnings are present", async () => {
    const importer = loadImporter();
    const bridge = {
      extractHomePatch: () => ({
        patch: { hero: { title: "VinATech" } },
        importedFields: ["hero.title"],
        warnings: [
          "HOME hero title was empty in source markup; used brand name as fallback.",
          "HOME theme colors looked low-confidence and were preserved from the existing draft.",
          "HOME theme colors looked low-confidence and were preserved from the existing draft."
        ]
      }),
      extractContactPatch: () => ({ patch: { contact: {} }, importedFields: [], warnings: [] }),
      extractPrivacyPatch: () => ({ patch: { privacy: {} }, importedFields: [], warnings: [] }),
      mergeImportPatches: (a, b) => ({ ...(a || {}), ...(b || {}) }),
      buildImportReport: (pages) => ({
        importedFieldsCount: 1,
        warningsCount: 3,
        failedPages: [],
        pages,
        message: "Live import completed."
      })
    };

    const result = await importer.importFromLivePages({
      fetchFn: async () => ({ ok: true, status: 200, text: async () => "<html></html>" }),
      bridge
    });

    expect(result.diagnostics.statusHints).toEqual([
      "HOME title missing in source; using brand name.",
      "HOME theme looked low-confidence; kept existing draft colors."
    ]);
  });
});
