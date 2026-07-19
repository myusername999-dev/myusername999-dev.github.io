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

  it("builds under-construction markup branch for selected non-fixed pages", () => {
    const bridge = loadBridge();

    const markup = bridge.buildAssociatedPageMarkup(
      { fileName: "news.html", sectionTitle: "News" },
      { underConstruction: { enabled: true, pages: ["news.html"] } },
      true,
      {
        shouldUseUnderConstructionPage: () => true,
        buildUnderConstructionPageMarkup: (tab, _config, draggable) => `${tab.fileName}|${draggable}`,
        deepClone: (value) => JSON.parse(JSON.stringify(value)),
        buildHomeMarkup: () => "home"
      }
    );

    expect(markup).toBe("news.html|true");
  });

  it("builds full under-construction HTML shell for associated tab pages", () => {
    const bridge = loadBridge();
    const html = bridge.buildAssociatedTabPageHtml(
      { fileName: "solutions.html", sectionTitle: "Solutions" },
      { brand: { name: "VinATech" } },
      {
        shouldUseUnderConstructionPage: () => true,
        buildUnderConstructionPageMarkup: () => "<main>UC</main>",
        escapeHtml: (value) => String(value)
      }
    );

    expect(html).toContain("<title>Solutions - VinATech</title>");
    expect(html).toContain("<main>UC</main>");
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

  it("builds preview page options with fixed pages and descriptors", () => {
    const bridge = loadBridge();
    const options = bridge.getPreviewPageOptions(
      {
        privacy: { title: "Privacy Policy" },
        contact: { title: "Contact Us" }
      },
      {
        getAssociatedPageDescriptors: () => [
          { fileName: "products.html", sectionTitle: "Products", label: "Products" },
          { fileName: "contact-us.html", sectionTitle: "Contact", label: "Contact" },
          { fileName: "privacy.html", sectionTitle: "Privacy", label: "Privacy" }
        ]
      }
    );

    expect(options.map((option) => option.value)).toEqual([
      "home",
      "page:privacy.html",
      "page:contact.html",
      "page:products.html"
    ]);
    expect(options[2].label).toBe("Contact (contact.html)");
  });

  it("includes under-construction selected pages in preview options", () => {
    const bridge = loadBridge();
    const options = bridge.getPreviewPageOptions(
      {
        underConstruction: {
          pages: ["future-page", "custom-report.html", "privacy.html"]
        }
      },
      {
        getAssociatedPageDescriptors: () => []
      }
    );

    const values = options.map((option) => option.value);
    expect(values).toContain("page:future-page.html");
    expect(values).toContain("page:custom-report.html");
    expect(values.filter((value) => value === "page:privacy.html")).toHaveLength(1);
  });

  it("normalizes preview page value against available options", () => {
    const bridge = loadBridge();
    const options = [
      { value: "home", label: "HOME" },
      { value: "page:products.html", label: "Products" }
    ];

    expect(bridge.normalizePreviewPageValue("page:products.html", options)).toBe("page:products.html");
    expect(bridge.normalizePreviewPageValue("page:missing.html", options)).toBe("home");
    expect(bridge.normalizePreviewPageValue("products.html", options)).toBe("home");
  });

  it("normalizes preview page option selection", () => {
    const bridge = loadBridge();
    const options = [
      { value: "home", label: "HOME" },
      { value: "page:products.html", label: "Products" }
    ];

    const selected = bridge.normalizePreviewPage("page:products.html", options);
    const fallback = bridge.normalizePreviewPage("page:missing.html", options);

    expect(selected).toEqual(options[1]);
    expect(fallback).toEqual(options[0]);
  });

  it("refreshes preview page options and preserves selected value when valid", () => {
    const bridge = loadBridge();
    const result = bridge.refreshPreviewPageOptions(
      "page:products.html",
      {},
      {
        getPreviewPageOptions: () => [
          { value: "home", label: "HOME" },
          { value: "page:products.html", label: "Products" }
        ]
      }
    );

    expect(result.selectedValue).toBe("page:products.html");
    expect(result.changed).toBe(false);
    expect(result.optionsHtml).toContain("<option value=\"home\">HOME</option>");
  });

  it("refreshes preview page options and falls back to home when invalid", () => {
    const bridge = loadBridge();
    const result = bridge.refreshPreviewPageOptions(
      "page:missing.html",
      {},
      {
        getPreviewPageOptions: () => [
          { value: "home", label: "HOME" },
          { value: "page:products.html", label: "Products" }
        ]
      }
    );

    expect(result.selectedValue).toBe("home");
    expect(result.changed).toBe(true);
  });

  it("resolves preview selection from config and current value", () => {
    const bridge = loadBridge();
    const selected = bridge.resolvePreviewSelection(
      "page:products.html",
      {},
      {
        getPreviewPageOptions: () => [
          { value: "home", label: "HOME" },
          { value: "page:products.html", label: "Products", page: { fileName: "products.html" } }
        ]
      }
    );

    expect(selected.value).toBe("page:products.html");
    expect(selected.label).toBe("Products");
  });

  it("resolves preview selection fallback to home", () => {
    const bridge = loadBridge();
    const selected = bridge.resolvePreviewSelection(
      "page:missing.html",
      {},
      {
        getPreviewPageOptions: () => [
          { value: "home", label: "HOME", page: null },
          { value: "page:products.html", label: "Products", page: { fileName: "products.html" } }
        ]
      }
    );

    expect(selected.value).toBe("home");
    expect(selected.label).toBe("HOME");
  });

  it("resolves preview open plan for fixed pages to direct url", () => {
    const bridge = loadBridge();
    const plan = bridge.resolvePreviewOpenPlan(
      {
        value: "page:privacy.html",
        label: "Privacy Policy",
        page: { fileName: "privacy.html", sectionTitle: "Privacy" }
      },
      {},
      {
        buildPrivacyPreviewHref: (href) => `privacy-preview:${href}`,
        buildContactPreviewHref: (href) => `contact-preview:${href}`
      }
    );

    expect(plan).toEqual({
      mode: "url",
      url: "privacy-preview:privacy.html",
      label: "Privacy Policy"
    });
  });

  it("resolves preview open plan for home to html", () => {
    const bridge = loadBridge();
    const plan = bridge.resolvePreviewOpenPlan(
      {
        value: "home",
        label: "HOME (index.html)",
        page: null
      },
      { brand: { name: "VinATech" } },
      {
        buildPublishedHtml: () => "<html>home</html>",
        buildAssociatedPublishedHtml: () => "<html>associated</html>"
      }
    );

    expect(plan).toEqual({
      mode: "html",
      html: "<html>home</html>",
      label: "HOME (index.html)"
    });
  });
});
