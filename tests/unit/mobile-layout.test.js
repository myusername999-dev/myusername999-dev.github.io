import { describe, expect, it } from "vitest";
import { getPreviewConfigForDevice, normalizePreviewDevice, updateDragPositionByDevice } from "../../tools/configurator/mobile/mobile-layout.js";
import { createStateFixture } from "../helpers/state-fixtures.js";

describe("mobile and desktop preview behavior", () => {
  it("normalizes preview device", () => {
    expect(normalizePreviewDevice("mobile")).toBe("mobile");
    expect(normalizePreviewDevice("desktop")).toBe("desktop");
    expect(normalizePreviewDevice("tablet")).toBe("desktop");
  });

  it("maps mobile layout to preview positions in mobile mode", () => {
    const state = createStateFixture();
    const previewConfig = getPreviewConfigForDevice(state, "mobile");

    expect(previewConfig.layout.nav).toEqual({ x: 11, y: 12 });
    expect(previewConfig.layout.heroTitle).toEqual({ x: 13, y: 14 });
    expect(previewConfig.layout.heroSubtitle).toEqual({ x: 15, y: 16 });
    expect(previewConfig.layout.cta).toEqual({ x: 17, y: 18 });
  });

  it("updates drag positions in mobile-specific keys for mobile", () => {
    const state = createStateFixture();
    updateDragPositionByDevice(state, "mobile", "heroTitle", 90, 91);
    expect(state.layout.mobileHeroTitle).toEqual({ x: 90, y: 91 });
    expect(state.layout.heroTitle).toEqual({ x: 3, y: 4 });
  });

  it("updates drag positions in desktop keys for desktop", () => {
    const state = createStateFixture();
    updateDragPositionByDevice(state, "desktop", "heroTitle", 120, 121);
    expect(state.layout.heroTitle).toEqual({ x: 120, y: 121 });
    expect(state.layout.mobileHeroTitle).toEqual({ x: 13, y: 14 });
  });
});
