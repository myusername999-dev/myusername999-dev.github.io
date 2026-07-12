import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import vm from "node:vm";

describe("draft bridge", () => {
  function loadBridge() {
    const code = readFileSync(resolve("tools/configurator/draft/draft-bridge.js"), "utf8");
    const sandbox = { window: {} };
    vm.createContext(sandbox);
    vm.runInContext(code, sandbox);
    return sandbox.window.ConfiguratorDraftBridge;
  }

  it("builds repo draft script with key", () => {
    const bridge = loadBridge();
    const script = bridge.buildRepoDraftScript("__KEY__", { a: 1 });
    expect(script).toContain("window.__KEY__");
    expect(script).toContain('"a": 1');
  });

  it("returns null for invalid repo draft candidate", () => {
    const bridge = loadBridge();
    expect(bridge.getRepoDraftCandidate({}, "__KEY__")).toBeNull();
  });

  it("returns candidate for valid repo draft object", () => {
    const bridge = loadBridge();
    const source = { __KEY__: { tabs: [{ label: "HOME" }] } };
    expect(bridge.getRepoDraftCandidate(source, "__KEY__")).toEqual(source.__KEY__);
  });

  it("prefers repo draft when repo has richer nav markers", () => {
    const bridge = loadBridge();
    const localCandidate = { tabs: [{ label: "Home" }] };
    const repoCandidate = { tabs: [{ label: "Home" }, { label: "News" }, { label: "Privacy Policy" }, { label: "Contact" }] };
    expect(bridge.shouldPreferRepoDraft(localCandidate, repoCandidate)).toBe(true);
  });

  it("resolves draft save plan for remembered directory, picker, and download fallback", () => {
    const bridge = loadBridge();
    expect(bridge.resolveDraftSavePlan(true, true)).toEqual({
      transport: "filesystem",
      shouldResolveDirectory: false
    });
    expect(bridge.resolveDraftSavePlan(false, true)).toEqual({
      transport: "filesystem",
      shouldResolveDirectory: true
    });
    expect(bridge.resolveDraftSavePlan(false, false)).toEqual({
      transport: "download",
      shouldResolveDirectory: false
    });
  });

  it("classifies draft save errors", () => {
    const bridge = loadBridge();
    expect(bridge.classifyDraftSaveError({ name: "AbortError" })).toEqual({ kind: "abort" });
    expect(bridge.classifyDraftSaveError({ name: "TypeError" })).toEqual({ kind: "failure" });
  });

  it("builds draft save/load/import statuses", () => {
    const bridge = loadBridge();
    expect(bridge.buildDraftSaveStatus("filesystem-success", "js/configurator.draft.js")).toContain("Draft saved to js/configurator.draft.js");
    expect(bridge.buildDraftSaveStatus("download-abort", "js/configurator.draft.js")).toContain("Folder selection canceled");
    expect(bridge.buildDraftLoadStatus("missing", "js/configurator.draft.js")).toContain("No repo draft found");
    expect(bridge.buildDraftImportStatus(true)).toBe("Draft imported.");
    expect(bridge.buildDraftImportStatus(false)).toBe("Import failed: invalid JSON.");
  });
});
