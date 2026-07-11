import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import vm from "node:vm";

describe("publish flow routing", () => {
  function loadBridge() {
    const code = readFileSync(resolve("tools/configurator/publish/publish-bridge.js"), "utf8");
    const sandbox = { window: {} };
    vm.createContext(sandbox);
    vm.runInContext(code, sandbox);
    return sandbox.window.ConfiguratorPublishBridge;
  }

  it("routes to filesystem transport and success status on desktop all-scope", () => {
    const bridge = loadBridge();
    const flow = bridge.resolvePublishFlowContext("all", "desktop", true);

    expect(flow.transport).toBe("filesystem");
    expect(flow.plan.scope).toBe("all");
    expect(flow.plan.includeAssociatedPages).toBe(true);

    const status = bridge.resolvePublishOutcomeStatus("filesystem-success", {
      projectDirectoryName: "site-root",
      scope: flow.plan.scope,
      includeAssociatedPages: flow.plan.includeAssociatedPages,
      associatedCount: 2,
      assetSuffix: " Copied 1 asset."
    });

    expect(status).toContain("Publish complete in site-root.");
    expect(status).toContain("2 associated page");
  });

  it("routes to download transport and fallback status when picker is unavailable", () => {
    const bridge = loadBridge();
    const flow = bridge.resolvePublishFlowContext("home", "mobile", false);

    expect(flow.transport).toBe("download");
    expect(flow.plan.scope).toBe("home");
    expect(flow.plan.includeAssociatedPages).toBe(false);

    const status = bridge.resolvePublishOutcomeStatus("download-fallback", {
      scope: flow.plan.scope,
      includeAssociatedPages: flow.plan.includeAssociatedPages,
      associatedCount: 0,
      cause: "Folder picker blocked/canceled",
      assetSuffix: " No new assets copied."
    });

    expect(status).toContain("Folder write unavailable (Folder picker blocked/canceled).");
    expect(status).toContain("Downloaded index.html.");
  });
});
