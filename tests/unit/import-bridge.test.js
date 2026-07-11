import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import vm from "node:vm";

describe("import bridge", () => {
  function loadBridge() {
    const code = readFileSync(resolve("tools/configurator/import/import-bridge.js"), "utf8");
    const sandbox = { window: {} };
    vm.createContext(sandbox);
    vm.runInContext(code, sandbox);
    return sandbox.window.ConfiguratorImportBridge;
  }

  it("extracts home patch including desktop and mobile layout", () => {
    const bridge = loadBridge();
    const html = [
      "<html><head><title>VINATECH - HOME</title></head><body>",
      "<main class=\"home-root\" style=\"--preview-bg:#0f0f0f;--preview-text:#ededed;--preview-accent:#28a745;--preview-muted:#737373;--preview-surface:#1f1f1f;--preview-button-text:#ffffff;--preview-heading-size:62px;--preview-body-size:21px;--mobile-nav-x:12px;--mobile-nav-y:24px;--mobile-hero-title-x:10px;--mobile-hero-title-y:20px;--mobile-hero-subtitle-x:8px;--mobile-hero-subtitle-y:16px;--mobile-cta-x:14px;--mobile-cta-y:28px;font-family:'Montserrat',sans-serif\">",
      "<div data-drag-key=\"nav\" style=\"transform: translate(11px, 22px);\"></div>",
      "<div data-drag-key=\"heroTitle\" style=\"transform: translate(33px, 44px);\"></div>",
      "<div data-drag-key=\"heroSubtitle\" style=\"transform: translate(55px, 66px);\"></div>",
      "<div data-drag-key=\"cta\" style=\"transform: translate(77px, 88px);\"></div>",
      "<section class=\"hero-title-slot\"><h1>Build Faster</h1></section>",
      "<section class=\"hero-subtitle-slot\"><p>Ship with confidence</p></section>",
      "</main></body></html>"
    ].join("");

    const result = bridge.extractHomePatch(html);

    expect(result.patch.brand.name).toBe("VINATECH");
    expect(result.patch.hero.title).toBe("Build Faster");
    expect(result.patch.hero.subtitle).toBe("Ship with confidence");
    expect(result.patch.theme.bgColor).toBe("#0f0f0f");
    expect(result.patch.theme.fontFamily).toBe("Montserrat");
    expect(result.patch.layout.nav).toEqual({ x: 11, y: 22 });
    expect(result.patch.layout.mobileHeroSubtitle).toEqual({ x: 8, y: 16 });
    expect(result.patch.layout.mobileCta).toEqual({ x: 14, y: 28 });
    expect(result.importedFields.length).toBeGreaterThan(10);
    expect(result.warnings).toEqual([]);
  });

  it("handles single-quoted attributes and translate3d drag styles", () => {
    const bridge = loadBridge();
    const html = [
      "<html><head><title>VinATech</title></head><body>",
      "<main style='--preview-bg:#010203;--mobile-nav-x:5px;--mobile-nav-y:6px;font-family:\"Space Grotesk\",sans-serif' class='hero stage home-root'>",
      "<div style='transform:translate3d(12px, 18px, 0)' data-drag-key='nav'></div>",
      "<h1>Home Title</h1>",
      "<p>Home Subtitle</p>",
      "</main></body></html>"
    ].join("");

    const result = bridge.extractHomePatch(html);

    expect(result.patch.brand.name).toBe("VinATech");
    expect(result.patch.layout.nav).toEqual({ x: 12, y: 18 });
    expect(result.patch.layout.mobileNav).toEqual({ x: 5, y: 6 });
    expect(result.patch.hero.subtitle).toBe("Home Subtitle");
  });

  it("extracts contact and privacy metadata from production-like markup", () => {
    const bridge = loadBridge();

    const contactHtml = [
      "<div class='contact-root' style='--contact-bg-color:#f8fbfa;--contact-text-color:#18322b;--contact-tab-text-color:#18322b;--contact-tab-bg-color:#ffffff'>",
      "<nav class='contact-nav transparent-tabs'></nav>",
      "<section class='contact-hero'><p class='eyebrow'>Get In Touch</p><h1>Contact VINATECH Limited</h1><p>Tell us about your project needs.</p></section>",
      "<form action='https://formspree.io/f/mrevdeyn' data-subject-prefix='Website Contact Request'>",
      "<button type='submit'>Send Request</button>",
      "</form>",
      "</div>"
    ].join("");

    const contactResult = bridge.extractContactPatch(contactHtml);
    expect(contactResult.patch.contact.title).toBe("Contact VINATECH Limited");
    expect(contactResult.patch.contact.intro).toBe("Tell us about your project needs.");
    expect(contactResult.patch.contact.submitLabel).toBe("Send Request");
    expect(contactResult.patch.contact.emailSubject).toBe("Website Contact Request");
    expect(contactResult.patch.contact.formEndpoint).toBe("https://formspree.io/f/mrevdeyn");
    expect(contactResult.patch.contact.bgColor).toBe("#f8fbfa");
    expect(contactResult.patch.contact.topTabsTransparent).toBe(true);

    const privacyHtml = [
      "<div class='privacy-root' style='--privacy-bg-color:#f8fbfa;--privacy-text-color:#18322b;--privacy-top-band-height:76px;--privacy-card-padding:26px'>",
      "<nav class='top-nav transparent-tabs'></nav>",
      "<section class='hero'><p class='eyebrow'>Privacy And Data Protection</p><h1>Privacy Policy</h1><p>Policy intro summary.</p></section>",
      "<article><h2>1. Scope And Principles</h2><p>Scope paragraph.</p></article>",
      "<article><h2>2. Data We Process</h2><p>Data paragraph.</p></article>",
      "</div>"
    ].join("");

    const privacyResult = bridge.extractPrivacyPatch(privacyHtml);
    expect(privacyResult.patch.privacy.title).toBe("Privacy Policy");
    expect(privacyResult.patch.privacy.intro).toBe("Policy intro summary.");
    expect(privacyResult.patch.privacy.scopeText).toBe("Scope paragraph.");
    expect(privacyResult.patch.privacy.dataText).toBe("Data paragraph.");
    expect(privacyResult.patch.privacy.bgColor).toBe("#f8fbfa");
    expect(privacyResult.patch.privacy.textColor).toBe("#18322b");
    expect(privacyResult.patch.privacy.topBandHeight).toBe(76);
    expect(privacyResult.patch.privacy.cardPadding).toBe(26);
    expect(privacyResult.patch.privacy.topTabsTransparent).toBe(true);
  });

  it("preserves existing draft colors when home theme vars are low-confidence placeholders", () => {
    const bridge = loadBridge();
    const html = [
      "<html><head><title>VinATech</title></head><body>",
      "<main class=\"home-root\" style=\"--preview-bg:#ffffff;--preview-text:#ffffff;--preview-accent:#ffffff;--preview-muted:#ffffff;--preview-surface:#ffffff;--preview-button-text:#ffffff;--preview-heading-size:58px\">",
      "<h1>Visible Title</h1>",
      "<p>Visible Subtitle</p>",
      "</main></body></html>"
    ].join("");

    const result = bridge.extractHomePatch(html);

    expect(result.patch.theme.bgColor).toBeUndefined();
    expect(result.patch.theme.textColor).toBeUndefined();
    expect(result.patch.theme.accentColor).toBeUndefined();
    expect(result.patch.theme.headingSize).toBe(58);
    expect(result.warnings.some((warning) => warning.includes("low-confidence"))).toBe(true);
  });

  it("falls back hero title to brand name when source h1 is empty", () => {
    const bridge = loadBridge();
    const html = [
      "<html><head><title>VinATech</title></head><body>",
      "<main class=\"home-root\" style=\"--preview-bg:#102822\">",
      "<h1></h1>",
      "<p>Inspire. Innovate. Ambition.</p>",
      "</main></body></html>"
    ].join("");

    const result = bridge.extractHomePatch(html);

    expect(result.patch.brand.name).toBe("VinATech");
    expect(result.patch.hero.title).toBe("VinATech");
    expect(result.warnings.some((warning) => warning.includes("hero title was empty"))).toBe(true);
  });

  it("merges nested patches and builds report summary", () => {
    const bridge = loadBridge();

    const merged = bridge.mergeImportPatches(
      { hero: { title: "Old", subtitle: "Base" }, theme: { bgColor: "#111" } },
      { hero: { title: "New" }, theme: { textColor: "#eee" } }
    );

    expect(merged).toEqual({
      hero: { title: "New", subtitle: "Base" },
      theme: { bgColor: "#111", textColor: "#eee" }
    });

    const report = bridge.buildImportReport({
      home: { success: true, importedFields: ["hero.title"], warnings: [] },
      contact: { success: false, importedFields: [], warnings: ["fetch failed"] },
      privacy: { success: true, importedFields: ["privacy.title", "privacy.intro"], warnings: ["fallback"] }
    });

    expect(report.importedFieldsCount).toBe(3);
    expect(report.warningsCount).toBe(2);
    expect(report.failedPages).toEqual(["contact"]);
    expect(report.message).toContain("with issues");
  });
});
