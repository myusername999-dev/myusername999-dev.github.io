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
});
