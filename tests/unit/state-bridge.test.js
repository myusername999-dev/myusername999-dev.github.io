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
});
