import { describe, expect, it } from "vitest";
import { createStateFixture } from "../helpers/state-fixtures.js";
import { applyScopedSetting } from "../../tools/configurator/core/page-context.js";
import { getPreviewConfigForDevice } from "../../tools/configurator/mobile/mobile-layout.js";

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
});
