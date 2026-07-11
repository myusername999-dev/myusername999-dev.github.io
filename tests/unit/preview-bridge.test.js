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

  it("builds associated tab pages and filters privacy descriptors", () => {
    const bridge = loadBridge();
    const config = {
      tabs: [
        { pageHref: "products", sectionTitle: "Products", sectionText: "Our catalog" },
        { pageHref: "privacy", sectionTitle: "Privacy" }
      ],
      hero: { buttons: [] }
    };

    const pages = bridge.getAssociatedTabPages(config, {
      buildAssociatedTabPageHtml: (descriptor) => `html:${descriptor.fileName}`
    });

    expect(pages).toEqual([
      { fileName: "products.html", html: "html:products.html" }
    ]);
  });

  it("builds associated tab html for standard pages", () => {
    const bridge = loadBridge();
    const html = bridge.buildAssociatedTabPageHtml(
      { fileName: "products.html", sectionTitle: "Products", sectionText: "Catalog" },
      { brand: { name: "VinATech" } },
      {
        getAllFontsHref: () => "https://fonts.example/all.css",
        escapeHtml: (value) => String(value),
        buildAssociatedPageMarkup: () => "<main>Products</main>"
      }
    );

    expect(html).toContain("<title>Products - VinATech</title>");
    expect(html).toContain("https://fonts.example/all.css");
    expect(html).toContain("<main>Products</main>");
  });

  it("builds associated tab html for privacy and contact pages", () => {
    const bridge = loadBridge();

    const privacyHtml = bridge.buildAssociatedTabPageHtml(
      { fileName: "privacy.html", sectionTitle: "Privacy" },
      { brand: { name: "VinATech" } },
      {
        buildPrivacyPolicyPageHtml: () => "<html>privacy</html>",
        buildContactPageHtml: () => "<html>contact</html>"
      }
    );

    const contactHtml = bridge.buildAssociatedTabPageHtml(
      { fileName: "contact.html", sectionTitle: "Contact" },
      { brand: { name: "VinATech" } },
      {
        buildPrivacyPolicyPageHtml: () => "<html>privacy</html>",
        buildContactPageHtml: () => "<html>contact</html>"
      }
    );

    expect(privacyHtml).toBe("<html>privacy</html>");
    expect(contactHtml).toBe("<html>contact</html>");
  });

  it("builds associated page markup for privacy and contact previews", () => {
    const bridge = loadBridge();

    const privacyMarkup = bridge.buildAssociatedPageMarkup(
      { fileName: "privacy.html" },
      { privacy: { title: "Privacy" } },
      false,
      {
        buildExternalFilePreviewMarkup: (href) => `external:${href}`,
        buildPrivacyPreviewHref: (href) => `privacy-preview:${href}`,
        buildContactPreviewHref: (href) => `contact-preview:${href}`
      }
    );

    const contactMarkup = bridge.buildAssociatedPageMarkup(
      { fileName: "contact.html" },
      { contact: { title: "Contact" } },
      false,
      {
        buildExternalFilePreviewMarkup: (href) => `external:${href}`,
        buildPrivacyPreviewHref: (href) => `privacy-preview:${href}`,
        buildContactPreviewHref: (href) => `contact-preview:${href}`
      }
    );

    expect(privacyMarkup).toBe("external:privacy-preview:privacy.html");
    expect(contactMarkup).toBe("external:contact-preview:contact.html");
  });

  it("builds associated page markup for non-fixed pages", () => {
    const bridge = loadBridge();
    const baseConfig = { hero: { title: "Home", subtitle: "Base" } };

    const markup = bridge.buildAssociatedPageMarkup(
      { sectionTitle: "Products", sectionText: "Catalog" },
      baseConfig,
      true,
      {
        deepClone: (value) => JSON.parse(JSON.stringify(value)),
        buildHomeMarkup: (pageConfig, draggable) => `${pageConfig.hero.title}|${pageConfig.hero.subtitle}|${draggable}`
      }
    );

    expect(markup).toBe("Products|Catalog|true");
    expect(baseConfig.hero.title).toBe("Home");
    expect(baseConfig.hero.subtitle).toBe("Base");
  });

  it("builds published html using the shared associated page shell", () => {
    const bridge = loadBridge();
    const html = bridge.buildAssociatedPublishedHtml(
      { fileName: "products.html", sectionTitle: "Products", sectionText: "Catalog" },
      { brand: { name: "VinATech" } },
      {
        getAllFontsHref: () => "https://fonts.example/all.css",
        escapeHtml: (value) => String(value),
        buildAssociatedPageMarkup: () => "<main>Published</main>"
      }
    );

    expect(html).toContain("<title>Products - VinATech</title>");
    expect(html).toContain("<main>Published</main>");
  });

  it("builds published html privacy and contact branches", () => {
    const bridge = loadBridge();

    const privacyHtml = bridge.buildAssociatedPublishedHtml(
      { fileName: "privacy.html", sectionTitle: "Privacy" },
      { brand: { name: "VinATech" } },
      {
        buildPrivacyPolicyPageHtml: () => "<html>privacy</html>",
        buildContactPageHtml: () => "<html>contact</html>"
      }
    );

    const contactHtml = bridge.buildAssociatedPublishedHtml(
      { fileName: "contact.html", sectionTitle: "Contact" },
      { brand: { name: "VinATech" } },
      {
        buildPrivacyPolicyPageHtml: () => "<html>privacy</html>",
        buildContactPageHtml: () => "<html>contact</html>"
      }
    );

    expect(privacyHtml).toBe("<html>privacy</html>");
    expect(contactHtml).toBe("<html>contact</html>");
  });
});
