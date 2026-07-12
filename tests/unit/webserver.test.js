import { describe, expect, it } from "vitest";
import { getContentType, safeResolvePath } from "../../tools/webserver/server.mjs";

describe("webserver helpers", () => {
  it("returns expected mime types", () => {
    expect(getContentType("index.html")).toContain("text/html");
    expect(getContentType("main.js")).toContain("application/javascript");
    expect(getContentType("image.png")).toBe("image/png");
  });

  it("prevents path traversal", () => {
    expect(safeResolvePath("/../secret.txt")).toBeNull();
  });
});
