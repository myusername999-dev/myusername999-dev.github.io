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
  });
});
