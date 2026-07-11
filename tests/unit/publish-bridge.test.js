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

  it("validates state configuration", () => {
    const bridge = loadBridge();
    const valid = {
      brand: { name: "VinATech" },
      hero: { buttons: [{ label: "Home" }] },
      tabs: [{ sectionId: "home" }]
    };
    const invalid = {
      brand: { name: "" },
      hero: { buttons: [{ label: "" }] },
      tabs: [{ sectionId: "" }, { sectionId: "" }]
    };

    expect(bridge.validateStateFromConfig(valid)).toEqual([]);
    expect(bridge.validateStateFromConfig(invalid).length).toBeGreaterThan(0);
  });

  it("preserves existing home only when there are no edits and fallback has home root", () => {
    const bridge = loadBridge();
    expect(bridge.shouldPreserveExistingHomeOnPublish(false, '<div class="home-root"></div>')).toBe(true);
    expect(bridge.shouldPreserveExistingHomeOnPublish(true, '<div class="home-root"></div>')).toBe(false);
    expect(bridge.shouldPreserveExistingHomeOnPublish(false, '<div></div>')).toBe(false);
  });

  it("builds publish execution plan for all scope on desktop", () => {
    const bridge = loadBridge();
    const plan = bridge.getPublishExecutionPlan("all", "desktop");

    expect(plan.scope).toBe("all");
    expect(plan.shouldValidate).toBe(true);
    expect(plan.includeAssociatedPages).toBe(true);
    expect(plan.targets).toEqual({
      home: true,
      privacy: true,
      contact: true,
      assets: true
    });
  });

  it("builds publish execution plan for contact scope on mobile", () => {
    const bridge = loadBridge();
    const plan = bridge.getPublishExecutionPlan("contact", "mobile");

    expect(plan.scope).toBe("contact");
    expect(plan.shouldValidate).toBe(false);
    expect(plan.includeAssociatedPages).toBe(false);
    expect(plan.targets).toEqual({
      home: false,
      privacy: false,
      contact: true,
      assets: false
    });
  });

  it("determines directory publish transport availability", () => {
    const bridge = loadBridge();
    expect(bridge.shouldUseDirectoryPublishing(true)).toBe(true);
    expect(bridge.shouldUseDirectoryPublishing(false)).toBe(false);
  });

  it("resolves publish flow context with transport and plan", () => {
    const bridge = loadBridge();
    const flow = bridge.resolvePublishFlowContext("all", "desktop", true);

    expect(flow.transport).toBe("filesystem");
    expect(flow.plan.scope).toBe("all");
    expect(flow.plan.includeAssociatedPages).toBe(true);
  });

  it("resolves filesystem success publish outcome message", () => {
    const bridge = loadBridge();
    const message = bridge.resolvePublishOutcomeStatus("filesystem-success", {
      projectDirectoryName: "site-root",
      scope: "all",
      includeAssociatedPages: true,
      associatedCount: 2,
      assetSuffix: " Copied 1 asset."
    });

    expect(message).toContain("Publish complete in site-root.");
    expect(message).toContain("2 associated page");
    expect(message).toContain("Copied 1 asset.");
  });

  it("resolves download fallback publish outcome message", () => {
    const bridge = loadBridge();
    const message = bridge.resolvePublishOutcomeStatus("download-fallback", {
      scope: "home",
      includeAssociatedPages: false,
      associatedCount: 0,
      cause: "Abort at write-index",
      assetSuffix: " No new assets copied."
    });

    expect(message).toContain("Folder write unavailable (Abort at write-index).");
    expect(message).toContain("Downloaded index.html.");
    expect(message).toContain("No new assets copied.");
  });
});
