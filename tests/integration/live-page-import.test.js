import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import vm from "node:vm";

describe("live page import integration", () => {
  function loadRuntime() {
    const bridgeCode = readFileSync(resolve("tools/configurator/import/import-bridge.js"), "utf8");
    const importerCode = readFileSync(resolve("tools/configurator/import/live-importer.js"), "utf8");
    const sandbox = { window: {} };
    vm.createContext(sandbox);
    vm.runInContext(bridgeCode, sandbox);
    vm.runInContext(importerCode, sandbox);
    return sandbox.window;
  }

  it("aggregates home/contact/privacy into a merged patch", async () => {
    const runtime = loadRuntime();
    const pages = {
      home: "../../index.html",
      contact: "../../contact.html",
      privacy: "../../privacy.html"
    };
    const htmlByUrl = {
      "../../index.html": [
        "<title>VINATECH - HOME</title>",
        "<main class=\"home-root\" style=\"--preview-bg:#001122;--preview-text:#ffffff;--mobile-cta-x:12px;--mobile-cta-y:32px\">",
        "<div data-drag-key=\"nav\" style=\"transform: translate(10px, 20px);\"></div>",
        "<h1>Live Home Title</h1>",
        "<p>Live Home Subtitle</p>",
        "</main>"
      ].join(""),
      "../../contact.html": "<h1>Get In Touch</h1><p>Reach us for help.</p>",
      "../../privacy.html": "<h1>Privacy Policy</h1><p>Your data matters.</p>"
    };

    const result = await runtime.ConfiguratorLiveImporter.importFromLivePages({
      pages,
      fetchFn: async (url) => ({ ok: true, status: 200, text: async () => htmlByUrl[url] })
    });

    expect(result.patch.hero.title).toBe("Live Home Title");
    expect(result.patch.contact.intro).toBe("Reach us for help.");
    expect(result.patch.privacy.intro).toBe("Your data matters.");
    expect(result.patch.layout.nav).toEqual({ x: 10, y: 20 });
    expect(result.patch.layout.mobileCta).toEqual({ x: 12, y: 32 });
    expect(result.report.importedFieldsCount).toBeGreaterThan(5);
  });
});
