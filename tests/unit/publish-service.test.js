import { describe, expect, it } from "vitest";
import { buildPublishTargets, normalizePublishScope } from "../../tools/configurator/publish/publish.service.js";

describe("publish service", () => {
  it("normalizes invalid scope to all", () => {
    expect(normalizePublishScope("invalid")).toBe("all");
  });

  it("builds targets for home scope", () => {
    expect(buildPublishTargets("home")).toEqual({
      home: true,
      privacy: false,
      contact: false
    });
  });

  it("builds targets for all scope", () => {
    expect(buildPublishTargets("all")).toEqual({
      home: true,
      privacy: true,
      contact: true
    });
  });
});
