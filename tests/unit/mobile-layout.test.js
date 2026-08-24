import { describe, expect, it } from "vitest";
import { getPreviewConfigForDevice, normalizePreviewDevice, updateDragPositionByDevice, updateLogoSizeByDevice } from "../../js/mobile/mobile-layout.js";
import { createStateFixture } from "../helpers/state-fixtures.js";

describe("mobile and desktop preview behavior", () => {
  it("normalizes preview device", () => {
    expect(normalizePreviewDevice("mobile")).toBe("mobile");
    expect(normalizePreviewDevice("desktop")).toBe("desktop");
    expect(normalizePreviewDevice("tablet")).toBe("desktop");
  });

  it("maps mobile layout to preview positions in mobile mode", () => {
    const state = createStateFixture();
    state.theme = {
      headingSize: 64,
      bodySize: 18,
      buttonTextSize: 16
    };
    state.mobile = {
      theme: {
        headingSize: 42,
        bodySize: 15,
        buttonTextSize: 14
      }
    };
    const previewConfig = getPreviewConfigForDevice(state, "mobile");

    expect(previewConfig.layout.nav).toEqual({ x: 11, y: 12 });
    expect(previewConfig.layout.heroTitle).toEqual({ x: 13, y: 14 });
    expect(previewConfig.layout.heroSubtitle).toEqual({ x: 15, y: 16 });
    expect(previewConfig.layout.cta).toEqual({ x: 17, y: 18 });
    expect(previewConfig.theme).toEqual({
      headingSize: 42,
      bodySize: 15,
      buttonTextSize: 14
    });
  });

  it("updates drag positions in mobile-specific keys for mobile", () => {
    const state = createStateFixture();
    updateDragPositionByDevice(state, "mobile", "heroTitle", 90, 91);
    expect(state.layout.mobileHeroTitle).toEqual({ x: 13, y: 14 });
    expect(state.mobile.layout.heroTitle).toEqual({ x: 90, y: 91 });
    expect(state.layout.heroTitle).toEqual({ x: 3, y: 4 });
  });

  it("keeps legacy mobile nav coordinates unchanged when a sparse override is written", () => {
    const state = createStateFixture();

    updateDragPositionByDevice(state, "mobile", "nav", 90, 91);

    expect(state.mobile.layout.nav).toEqual({ x: 90, y: 91 });
    expect(state.layout.mobileNav).toEqual({ x: 11, y: 12 });
  });

  it("keeps a partial mobile subtitle override visible while dragging", () => {
    const state = createStateFixture();
    state.mobile = {
      layout: {
        heroSubtitle: { x: 90 }
      }
    };

    expect(getPreviewConfigForDevice(state, "mobile").layout.heroSubtitle).toEqual({ x: 90, y: 16 });

    updateDragPositionByDevice(state, "mobile", "heroSubtitle", 92, 93);

    expect(state.mobile.layout.heroSubtitle).toEqual({ x: 92, y: 93 });
    expect(state.layout.mobileHeroSubtitle).toEqual({ x: 15, y: 16 });
  });

  it("updates drag positions in desktop keys for desktop", () => {
    const state = createStateFixture();
    updateDragPositionByDevice(state, "desktop", "heroTitle", 120, 121);
    expect(state.layout.heroTitle).toEqual({ x: 120, y: 121 });
    expect(state.layout.mobileHeroTitle).toEqual({ x: 13, y: 14 });
  });

  it("keeps desktop logo placement and size when mobile overrides change", () => {
    const state = createStateFixture();
    state.brand = {
      logos: [
        { x: 10, y: 11, size: 72 },
        { x: 20, y: 21, size: 64 }
      ]
    };

    updateDragPositionByDevice(state, "mobile", "logo-0", 100, 101);
    expect(state.mobile.brand.logos[0]).toEqual({ x: 100, y: 101 });

    updateLogoSizeByDevice(state, "mobile", 0, 44);

    expect(state.brand.logos[0]).toEqual({ x: 10, y: 11, size: 72 });
    expect(state.mobile.brand.logos[0]).toEqual({ x: 100, y: 101, size: 44 });

    const mobilePreview = getPreviewConfigForDevice(state, "mobile");
    expect(mobilePreview.brand.logos[0]).toEqual({ x: 100, y: 101, size: 44 });
    expect(getPreviewConfigForDevice(state, "desktop").brand.logos[0]).toEqual({ x: 10, y: 11, size: 72 });
  });

  it("keeps a size-only mobile logo change sparse", () => {
    const state = createStateFixture();

    state.brand = {
      logos: [
        { x: 10, y: 11, size: 72 },
        { x: 20, y: 21, size: 64 }
      ]
    };

    updateLogoSizeByDevice(state, "mobile", 1, 44);

    expect(state.mobile.brand.logos[1]).toEqual({ size: 44 });
    expect(getPreviewConfigForDevice(state, "mobile").brand.logos[1]).toEqual({ x: 20, y: 21, size: 44 });
  });
});
