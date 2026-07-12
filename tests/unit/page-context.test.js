import { describe, expect, it } from "vitest";
import { applyScopedSetting, getActivePageScope, normalizePageMode } from "../../tools/configurator/core/page-context.js";
import { createStateFixture } from "../helpers/state-fixtures.js";

describe("page context scoping", () => {
  it("normalizes unsupported page modes to home", () => {
    expect(normalizePageMode("unknown")).toBe("home");
  });

  it("returns active scope for supported page mode", () => {
    const state = createStateFixture();
    state.display.pageMode = "privacy";
    expect(getActivePageScope(state)).toBe("privacy");
  });

  it("applies setting only on the active page scope", () => {
    const state = createStateFixture();
    state.display.pageMode = "contact";

    applyScopedSetting(state, "theme.textColor", "#abcdef");

    expect(state.settingsByPage.contact.theme.textColor).toBe("#abcdef");
    expect(state.settingsByPage.home.theme.textColor).toBe("#111111");
    expect(state.settingsByPage.privacy.theme.textColor).toBe("#222222");
  });
});
