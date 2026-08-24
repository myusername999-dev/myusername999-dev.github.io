import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import vm from "node:vm";

describe("mobile bridge", () => {
  function loadBridge() {
    const code = readFileSync(resolve("js/mobile/mobile-bridge.js"), "utf8");
    const sandbox = { window: {} };
    vm.createContext(sandbox);
    vm.runInContext(code, sandbox);
    return sandbox.window.ConfiguratorMobileBridge;
  }

  it("normalizes preview device", () => {
    const bridge = loadBridge();
    expect(bridge.normalizePreviewDevice("mobile")).toBe("mobile");
    expect(bridge.normalizePreviewDevice("tablet")).toBe("desktop");
  });

  it("maps mobile layout into active preview coordinates", () => {
    const bridge = loadBridge();
    const config = {
      theme: {
        headingSize: 64,
        bodySize: 18,
        buttonTextSize: 16
      },
      layout: {
        nav: { x: 1, y: 1 },
        heroTitle: { x: 2, y: 2 },
        heroSubtitle: { x: 3, y: 3 },
        cta: { x: 4, y: 4 },
        mobileNav: { x: 10, y: 11 },
        mobileHeroTitle: { x: 12, y: 13 },
        mobileHeroSubtitle: { x: 14, y: 15 },
        mobileCta: { x: 16, y: 17 }
      },
      brand: {
        logos: [{ x: 1, y: 2, size: 72 }]
      },
      mobile: {
        theme: {
          headingSize: 42,
          bodySize: 15,
          buttonTextSize: 14
        },
        brand: {
          logos: [{ x: 100, y: 101, size: 44 }]
        }
      }
    };

    bridge.applyMobilePreviewLayout(config);

    expect(config.layout.nav).toEqual({ x: 10, y: 11 });
    expect(config.layout.heroTitle).toEqual({ x: 12, y: 13 });
    expect(config.layout.heroSubtitle).toEqual({ x: 14, y: 15 });
    expect(config.layout.cta).toEqual({ x: 16, y: 17 });
    expect(config.brand.logos[0]).toEqual({ x: 100, y: 101, size: 44 });
    expect(config.theme).toEqual({ headingSize: 42, bodySize: 15, buttonTextSize: 14 });
  });

  it("merges partial mobile layout overrides with fallback coordinates", () => {
    const bridge = loadBridge();
    const config = {
      layout: {
        heroSubtitle: { x: 3, y: 4 },
        mobileHeroSubtitle: { x: 14, y: 15 }
      },
      mobile: {
        layout: {
          heroSubtitle: { x: 90 }
        }
      }
    };

    bridge.applyMobilePreviewLayout(config);

    expect(config.layout.heroSubtitle).toEqual({ x: 90, y: 15 });
  });
});
