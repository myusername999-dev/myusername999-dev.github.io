import { describe, expect, it } from "vitest";
import { createStateFixture } from "../helpers/state-fixtures.js";
import { applyScopedSetting } from "../../tools/configurator/core/page-context.js";
import { getPreviewConfigForDevice } from "../../tools/configurator/mobile/mobile-layout.js";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import vm from "node:vm";

describe("desktop and mobile environment support", () => {
  it("keeps page-scoped settings isolated across environments", () => {
    const state = createStateFixture();

    state.display.pageMode = "home";
    applyScopedSetting(state, "theme.textColor", "#101010");
    const desktopPreview = getPreviewConfigForDevice(state, "desktop");

    state.display.pageMode = "privacy";
    applyScopedSetting(state, "theme.textColor", "#202020");
    const mobilePreview = getPreviewConfigForDevice(state, "mobile");

    expect(desktopPreview.settingsByPage.home.theme.textColor).toBe("#101010");
    expect(mobilePreview.settingsByPage.privacy.theme.textColor).toBe("#202020");
    expect(state.settingsByPage.contact.theme.textColor).toBe("#333333");
  });

  it("keeps mobile overrides preserved when live import lacks mobile coordinates", async () => {
    const bridgeCode = readFileSync(resolve("tools/configurator/import/import-bridge.js"), "utf8");
    const importerCode = readFileSync(resolve("tools/configurator/import/live-importer.js"), "utf8");
    const sandbox = { window: {} };
    vm.createContext(sandbox);
    vm.runInContext(bridgeCode, sandbox);
    vm.runInContext(importerCode, sandbox);

    const importer = sandbox.window.ConfiguratorLiveImporter;

    const baseState = createStateFixture();
    baseState.layout.mobileNav = { x: 101, y: 202 };
    baseState.layout.mobileHeroTitle = { x: 103, y: 204 };

    const result = await importer.importFromLivePages({
      fetchFn: async (url) => ({
        ok: true,
        status: 200,
        text: async () => {
          if (url.includes("index.html")) {
            return "<title>VINATECH</title><main class=\"home-root\" style=\"--preview-bg:#112233\"><h1>Imported Home</h1><p>Imported subtitle</p></main>";
          }
          if (url.includes("contact.html")) {
            return "<h1>Contact</h1><p>Contact intro</p>";
          }
          return "<h1>Privacy</h1><p>Privacy intro</p>";
        }
      })
    });

    const mergedState = {
      ...baseState,
      ...result.patch,
      layout: {
        ...baseState.layout,
        ...(result.patch.layout || {})
      }
    };

    expect(mergedState.layout.mobileNav).toEqual({ x: 101, y: 202 });
    expect(mergedState.layout.mobileHeroTitle).toEqual({ x: 103, y: 204 });
    expect(result.diagnostics.preservedByPolicy).toContain("layout.mobileNav");
    expect(result.diagnostics.unresolvedFields.some((field) => field.startsWith("home:"))).toBe(true);
  });
});
