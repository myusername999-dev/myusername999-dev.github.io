import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import vm from "node:vm";

describe("state bridge", () => {
  function loadBridge() {
    const code = readFileSync(resolve("tools/configurator/core/state-bridge.js"), "utf8");
    const sandbox = { window: {} };
    vm.createContext(sandbox);
    vm.runInContext(code, sandbox);
    return sandbox.window.ConfiguratorStateBridge;
  }

  it("normalizes page mode", () => {
    const bridge = loadBridge();
    expect(bridge.normalizePageMode("privacy")).toBe("privacy");
    expect(bridge.normalizePageMode("under-construction")).toBe("under-construction");
    expect(bridge.normalizePageMode("bad")).toBe("home");
  });

  it("normalizes tab mode", () => {
    const bridge = loadBridge();
    expect(bridge.normalizeTabMode("top-only")).toBe("top-only");
    expect(bridge.normalizeTabMode("bad")).toBe("top-and-home");
  });

  it("normalizes gallery layout", () => {
    const bridge = loadBridge();
    expect(bridge.normalizeGalleryLayout("split")).toBe("split");
    expect(bridge.normalizeGalleryLayout("bad")).toBe("horizontal");
  });

  it("normalizes preview page by options", () => {
    const bridge = loadBridge();
    const options = [{ value: "home" }, { value: "page:privacy.html" }];
    expect(bridge.normalizePreviewPageValue("page:privacy.html", options)).toBe("page:privacy.html");
    expect(bridge.normalizePreviewPageValue("page:unknown.html", options)).toBe("home");
  });

  it("normalizes transparency range", () => {
    const bridge = loadBridge();
    expect(bridge.normalizeTabImageTransparency("30", 10)).toBe(30);
    expect(bridge.normalizeTabImageTransparency("bad", 120)).toBe(95);
  });

  it("normalizes hex color values", () => {
    const bridge = loadBridge();
    expect(bridge.normalizeHex("#abcdef", "#000000")).toBe("#abcdef");
    expect(bridge.normalizeHex("oops", "#111111")).toBe("#111111");
  });

  it("normalizes text alignment", () => {
    const bridge = loadBridge();
    expect(bridge.normalizeTextAlign("center")).toBe("center");
    expect(bridge.normalizeTextAlign("diagonal")).toBe("left");
  });

  it("normalizes contact field type", () => {
    const bridge = loadBridge();
    expect(bridge.normalizeContactFieldType("email")).toBe("email");
    expect(bridge.normalizeContactFieldType("unsupported")).toBe("text");
  });

  it("normalizes contact fields and enforces consent", () => {
    const bridge = loadBridge();
    const fields = bridge.normalizeContactFields([
      { id: "team", label: "Team Name", type: "text", required: false, placeholder: "" }
    ]);

    expect(fields.some((item) => item.id === "consent")).toBe(true);
    expect(fields[0].id).toBe("team");
  });

  it("sanitizes file names and image sources", () => {
    const bridge = loadBridge();
    expect(bridge.normalizeImageSrc("  images/logo.png  ")).toBe("images/logo.png");
    expect(bridge.sanitizeFileName("a:b*c?.png")).toBe("a-b-c-.png");
  });

  it("normalizes logo rotation and fills two logos", () => {
    const bridge = loadBridge();
    expect(bridge.normalizeRotation(999)).toBe(180);
    const logos = bridge.ensureTwoLogos({ logos: [{ src: "x", fileName: "x.png" }] });
    expect(logos.length).toBe(2);
  });

  it("creates independent mobile logo overrides from desktop logos", () => {
    const bridge = loadBridge();
    const desktopState = {
      layout: {
        nav: { x: 1, y: 2 },
        heroTitle: { x: 3, y: 4 },
        heroSubtitle: { x: 5, y: 6 },
        cta: { x: 7, y: 8 }
      },
      brand: {
        logos: [
          { x: 10, y: 11, size: 72 },
          { x: 20, y: 21, size: 64 }
        ]
      }
    };

    const mobile = bridge.normalizeMobileOverrides({
      brand: { logos: [{ x: 100, y: 101, size: 44 }] }
    }, desktopState);

    expect(mobile.brand.logos).toEqual([
      { x: 100, y: 101, size: 44 },
      { x: 20, y: 21, size: 64 }
    ]);
    expect(desktopState.brand.logos).toEqual([
      { x: 10, y: 11, size: 72 },
      { x: 20, y: 21, size: 64 }
    ]);
  });

  it("migrates legacy mobile layout coordinates into mobile overrides", () => {
    const bridge = loadBridge();
    const mobile = bridge.normalizeMobileOverrides({}, {
      layout: {
        nav: { x: 1, y: 2 },
        heroTitle: { x: 3, y: 4 },
        heroSubtitle: { x: 5, y: 6 },
        cta: { x: 7, y: 8 },
        mobileNav: { x: 11, y: 12 },
        mobileHeroTitle: { x: 13, y: 14 },
        mobileHeroSubtitle: { x: 15, y: 16 },
        mobileCta: { x: 17, y: 18 }
      },
      brand: { logos: [] }
    });

    expect(mobile.layout).toEqual({
      nav: { x: 11, y: 12 },
      heroTitle: { x: 13, y: 14 },
      heroSubtitle: { x: 15, y: 16 },
      cta: { x: 17, y: 18 }
    });
  });

  it("migrates legacy mobile typography into mobile theme overrides", () => {
    const bridge = loadBridge();
    const mobile = bridge.normalizeMobileOverrides({}, {
      layout: {},
      brand: { logos: [] },
      theme: {
        headingSize: 64,
        bodySize: 18,
        buttonTextSize: 16,
        mobileHeadingSize: 42,
        mobileBodySize: 15
      }
    });

    expect(mobile.theme).toEqual({
      headingSize: 42,
      bodySize: 15,
      buttonTextSize: 16
    });
  });

  it("normalizes mobile CTA button layout overrides", () => {
    const bridge = loadBridge();
    const mobile = bridge.normalizeMobileOverrides({
      buttons: {
        paddingY: 9,
        paddingX: 22,
        gap: 14,
        width: "full"
      }
    }, { layout: {}, brand: { logos: [] }, theme: {} });

    expect(mobile.buttons).toEqual({
      paddingY: 9,
      paddingX: 22,
      gap: 14,
      width: "full"
    });
  });

  it("normalizes gallery images to four slots", () => {
    const bridge = loadBridge();
    const gallery = bridge.normalizeGalleryImages([{ src: "a", fileName: "a.png" }]);
    expect(gallery.length).toBe(4);
    expect(gallery[0].src).toBe("a");
  });

  it("normalizes under-construction settings with fixed page filtering", () => {
    const bridge = loadBridge();
    const config = bridge.normalizeUnderConstructionConfig(
      {
        enabled: 1,
        useSameImageForMobile: false,
        desktopImageSrc: " images/under-construction.png ",
        desktopImageFileName: "under:desktop.png",
        mobileImageSrc: "images/mobile-uc.png",
        mobileImageFileName: "mobile:uc.png",
        pages: ["news", "privacy.html", "NEWS.html", "folder/about.html", "solutions"]
      },
      {
        fixedPages: ["index.html", "privacy.html", "contact.html"]
      }
    );

    expect(config.enabled).toBe(true);
    expect(config.desktopImageFileName).toBe("under-desktop.png");
    expect(config.mobileImageFileName).toBe("mobile-uc.png");
    expect(config.pages).toEqual(["news.html", "solutions.html"]);
  });

  it("defaults mobile image to desktop when same-image mode is enabled", () => {
    const bridge = loadBridge();
    const config = bridge.normalizeUnderConstructionConfig({
      enabled: true,
      useSameImageForMobile: true,
      desktopImageSrc: "images/desktop-uc.png",
      desktopImageFileName: "desktop-uc.png",
      mobileImageSrc: "images/custom-mobile.png",
      mobileImageFileName: "custom-mobile.png",
      pages: []
    });

    expect(config.mobileImageSrc).toBe("images/desktop-uc.png");
    expect(config.mobileImageFileName).toBe("desktop-uc.png");
  });

  it("normalizes user-added custom page names", () => {
    const bridge = loadBridge();
    const config = bridge.normalizeUnderConstructionConfig({
      pages: ["new page", "new-page", "contact", "my_future_page"]
    });

    expect(config.pages).toEqual(["new page.html", "new-page.html", "my_future_page.html"]);
  });
});
