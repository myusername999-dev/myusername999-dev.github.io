import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import vm from "node:vm";

describe("publish bridge", () => {
  function loadBridge() {
    const code = readFileSync(resolve("tools/configurator/publish/publish-bridge.js"), "utf8");
    const sandbox = { window: {} };
    vm.createContext(sandbox);
    vm.runInContext(code, sandbox);
    return sandbox.window.ConfiguratorPublishBridge;
  }

  it("normalizes invalid scope to all", () => {
    const bridge = loadBridge();
    expect(bridge.normalizePublishScope("bad")).toBe("all");
  });

  it("builds download summary for all scope", () => {
    const bridge = loadBridge();
    expect(bridge.buildScopedDownloadSummary("all", true, 3)).toContain("3 associated page");
  });

  it("builds publish targets for scoped publish", () => {
    const bridge = loadBridge();
    expect(bridge.getPublishTargets("contact")).toEqual({
      home: false,
      privacy: false,
      contact: true,
      assets: false
    });
  });

  it("determines validation requirement from scope", () => {
    const bridge = loadBridge();
    expect(bridge.shouldValidateState("home")).toBe(true);
    expect(bridge.shouldValidateState("privacy")).toBe(false);
  });

  it("determines associated-page inclusion by device and scope", () => {
    const bridge = loadBridge();
    expect(bridge.shouldIncludeAssociatedPages("desktop", "all")).toBe(true);
    expect(bridge.shouldIncludeAssociatedPages("mobile", "all")).toBe(false);
    expect(bridge.shouldIncludeAssociatedPages("desktop", "home")).toBe(false);
  });
});
