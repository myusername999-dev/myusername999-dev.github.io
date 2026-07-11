import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import vm from "node:vm";

describe("preview bridge", () => {
  function loadBridge() {
    const code = readFileSync(resolve("tools/configurator/core/preview-bridge.js"), "utf8");
    const sandbox = { window: {} };
    vm.createContext(sandbox);
    vm.runInContext(code, sandbox);
    return sandbox.window.ConfiguratorPreviewBridge;
  }

  it("detects fixed page filenames", () => {
    const bridge = loadBridge();
    expect(bridge.isFixedPageFileName("privacy.html")).toBe(true);
    expect(bridge.isFixedPageFileName("news.html")).toBe(false);
  });

  it("detects privacy and contact descriptors", () => {
    const bridge = loadBridge();
    expect(bridge.isPrivacyPolicyDescriptor({ fileName: "privacy.html" })).toBe(true);
    expect(bridge.isContactDescriptor({ sectionTitle: "Contact" })).toBe(true);
  });

  it("selects preview option by selected value", () => {
    const bridge = loadBridge();
    const options = [
      { value: "home", label: "HOME" },
      { value: "page:privacy.html", label: "Privacy" }
    ];

    expect(bridge.selectPreviewPage(options, "page:privacy.html")).toEqual(options[1]);
    expect(bridge.selectPreviewPage(options, "page:missing.html")).toEqual(options[0]);
  });

  it("normalizes local page href values", () => {
    const bridge = loadBridge();
    expect(bridge.normalizePageHref("products")).toBe("products.html");
    expect(bridge.normalizePageHref("news.html")).toBe("news.html");
    expect(bridge.normalizePageHref("mailto:team@vinatech.example")).toBe("mailto:team@vinatech.example");
  });

  it("builds associated page descriptors from tabs and hero buttons", () => {
    const bridge = loadBridge();
    const descriptors = bridge.getAssociatedPageDescriptors({
      tabs: [
        { pageHref: "products", sectionTitle: "Products", sectionText: "Our catalog" },
        { pageHref: "index.html", sectionTitle: "Home" },
        { pageHref: "https://example.com", sectionTitle: "External" }
      ],
      hero: {
        buttons: [
          { label: "Contact", href: "contact" },
          { label: "External", href: "mailto:hello@example.com" }
        ]
      }
    });

    expect(descriptors).toEqual([
      {
        fileName: "products.html",
        sectionTitle: "Products",
        sectionText: "Our catalog",
        label: "Products"
      },
      {
        fileName: "contact.html",
        sectionTitle: "Contact",
        sectionText: "This page is under construction.",
        label: "Contact"
      }
    ]);
  });
});
