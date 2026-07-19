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
