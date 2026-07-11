(function () {
  "use strict";

  var STORAGE_KEY = "home-config-draft-v1";
  var LAST_PUBLISHED_KEY = "home-config-last-published-v1";
  var REPO_DRAFT_GLOBAL_KEY = "__CONFIGURATOR_DRAFT__";
  var REPO_DRAFT_FILE_PATH = "js/configurator.draft.js";
  var FS_HANDLE_DB_NAME = "vinatech-configurator-fs";
  var FS_HANDLE_STORE_NAME = "handles";
  var FS_HANDLE_KEY = "project-root";
  var FONT_FAMILIES = [
    "Sora",
    "Space Grotesk",
    "Manrope",
    "Plus Jakarta Sans",
    "Outfit",
    "DM Sans",
    "Archivo",
    "Karla",
    "Merriweather",
    "Playfair Display",
    "Cormorant Garamond",
    "Bricolage Grotesque"
  ];

  var defaultConfig = {
    brand: {
      name: "VinATech",
      logoSrc: "",
      logoFileName: "",
      logos: createDefaultLogos()
    },
    hero: {
      title: "We Build Financial Software With Human Clarity",
      subtitle: "Experiment with colors, typography, and layout to shape your homepage before publishing.",
      titleFontFamily: "",
      subtitleFontFamily: "",
      titleAlign: "left",
      subtitleAlign: "left",
      titleColor: "#102822",
      subtitleColor: "#4f6962",
      buttons: [
        {
          label: "Button 1",
          href: "products.html"
        },
        {
          label: "Button 2",
          href: "news.html"
        },
        {
          label: "Button 3",
          href: "privacy.html"
        },
        {
          label: "Button 4",
          href: "contact.html"
        }
      ]
    },
    theme: {
      fontFamily: "Sora",
      headingSize: 64,
      bodySize: 18,
      buttonTextSize: 16,
      bgColor: "#f2f7f3",
      textColor: "#102822",
      accentColor: "#0f7b6c",
      mutedColor: "#4f6962",
      surfaceColor: "#e5f0ea",
      buttonTextColor: "#ffffff"
    },
    background: {
      src: "",
      fileName: "",
      transparency: 32,
      x: 52,
      y: 20
    },
    layout: {
      logo: { x: 0, y: 0 },
      nav: { x: 0, y: 0 },
      hero: { x: 0, y: 0 },
      heroTitle: { x: 0, y: 0 },
      heroSubtitle: { x: 0, y: 0 },
      cta: { x: 0, y: 0 },
      mobileNav: { x: 0, y: 0 },
      mobileHeroTitle: { x: 0, y: 0 },
      mobileHeroSubtitle: { x: 0, y: 0 },
      mobileCta: { x: 0, y: 0 }
    },
    display: {
      pageMode: "home",
      tabMode: "top-and-home",
      topTabsTransparent: false,
      tabTextColor: "#102822",
      tabBgColor: "#e5f0ea",
      ctaTextOnly: false,
      previewPage: "home",
      previewDevice: "desktop",
      mobileHeroCenter: true
    },
    privacy: {
      title: "Privacy Policy",
      intro: "VINATECH Limited is committed to lawful, fair, and transparent handling of personal information. This policy explains what data we process, why we process it, and how we protect it.",
      scopeText: "This policy applies to VINATECH Limited websites, digital services, and business communication channels. We process personal data only where it is relevant to providing our services, supporting customers, protecting security, or complying with legal obligations.",
      dataText: "Depending on your interaction with us, we may process identity and contact details you submit, service-related communications and support records, and technical event logs required for security, fault analysis, and service continuity.",
      noCookiesText: "VINATECH Limited does not use analytics cookies, marketing cookies, or social media tracking cookies on this website. We do not deploy cookie banners for profiling because no such cookies are collected.",
      noMarketingText: "We do not build advertising profiles and we do not sell personal data to third parties. Where informational emails are required for active service relationships, they are limited to operational communications.",
      howUseText: "To respond to enquiries and deliver requested services.\nTo provide support and maintain platform reliability.\nTo secure systems and investigate misuse or abuse.\nTo comply with regulatory, contractual, and legal duties.",
      enforcementText: "VINATECH Limited applies a structured compliance model informed by public policy approaches from Google Play Developer Content Policy (privacy, deception prevention, responsible data handling, and clear user disclosures) and by data protection governance themes described by the Scottish Judiciary guidance on privacy and data protection.",
      bgColor: "#f8fbfa",
      textColor: "#18322b",
      topTabsTransparent: false,
      tabTextColor: "#18322b",
      tabBgColor: "#ffffff",
      mutedColor: "#5a736c",
      lineColor: "#dce6e1",
      accentColor: "#0f786b",
      cardColor: "#ffffff",
      topBandHeight: 76,
      heroTopPadding: 50,
      cardPadding: 26,
      layoutGap: 26
    },
    contact: {
      title: "Contact VINATECH Limited",
      intro: "Tell us about your project needs and our team will respond promptly.",
      submitLabel: "Submit",
      emailSubject: "Website Contact Request",
      topTabsTransparent: false,
      formEndpoint: "https://formspree.io/f/mrevdeyn",
      recipientEmail: "support@vinatech.it.com",
      fields: createDefaultContactFields()
    },
    tabs: [
      {
        label: "About",
        sectionId: "about",
        pageHref: "about.html",
        sectionTitle: "About",
        sectionText: "Describe who you are, what the company stands for, and why your approach is different.",
        sectionFontFamily: "",
        sectionTitleColor: "#102822",
        sectionTextColor: "#4f6962",
        sectionBackgroundColor: "#e5f0ea",
        navFontFamily: "",
        navTextColor: "#102822",
        navBackgroundColor: "#e5f0ea",
        sectionBackgroundSrc: "",
        sectionBackgroundFileName: "",
        sectionBackgroundTransparency: 36,
        galleryLayout: "horizontal",
        galleryImageTransparency: 0,
        galleryImages: [
          { src: "", fileName: "" },
          { src: "", fileName: "" },
          { src: "", fileName: "" },
          { src: "", fileName: "" }
        ]
      },
      {
        label: "Products",
        sectionId: "products",
        pageHref: "products.html",
        sectionTitle: "Products",
        sectionText: "Summarize your core products and the value each one delivers for clients.",
        sectionFontFamily: "",
        sectionTitleColor: "#102822",
        sectionTextColor: "#4f6962",
        sectionBackgroundColor: "#e5f0ea",
        navFontFamily: "",
        navTextColor: "#102822",
        navBackgroundColor: "#e5f0ea",
        sectionBackgroundSrc: "",
        sectionBackgroundFileName: "",
        sectionBackgroundTransparency: 36,
        galleryLayout: "horizontal",
        galleryImageTransparency: 0,
        galleryImages: [
          { src: "", fileName: "" },
          { src: "", fileName: "" },
          { src: "", fileName: "" },
          { src: "", fileName: "" }
        ]
      },
      {
        label: "Privacy",
        sectionId: "privacy",
        pageHref: "privacy.html",
        sectionTitle: "Privacy",
        sectionText: "Explain privacy and compliance commitments in simple language people can trust.",
        sectionFontFamily: "",
        sectionTitleColor: "#102822",
        sectionTextColor: "#4f6962",
        sectionBackgroundColor: "#e5f0ea",
        navFontFamily: "",
        navTextColor: "#102822",
        navBackgroundColor: "#e5f0ea",
        sectionBackgroundSrc: "",
        sectionBackgroundFileName: "",
        sectionBackgroundTransparency: 36,
        galleryLayout: "horizontal",
        galleryImageTransparency: 0,
        galleryImages: [
          { src: "", fileName: "" },
          { src: "", fileName: "" },
          { src: "", fileName: "" },
          { src: "", fileName: "" }
        ]
      }
    ]
  };

  var state = loadState();
  var dom = {};
  var previewRenderFrame = 0;
  var previewRenderTimeout = 0;
  var rememberedProjectDirectory = null;
  var hasUserEditsSinceLoad = false;

  document.addEventListener("DOMContentLoaded", init);

  async function init() {
    collectDom();
    rememberedProjectDirectory = await loadRememberedProjectDirectory();
    sanitizeState();
    bindCoreInputs();
    bindActions();
    syncInputsFromState();
    renderButtonsEditor();
    renderTabsEditor();
    renderContactFieldsEditor();
    renderPreview();
    setStatus("Draft loaded. Make edits and review in preview.", false);
  }

  function collectDom() {
    dom.pageMode = document.getElementById("pageMode");
    dom.homeControls = document.getElementById("homeControls");
    dom.privacyControls = document.getElementById("privacyControls");
    dom.contactControls = document.getElementById("contactControls");

    dom.brandName = document.getElementById("brandName");
    dom.heroTitle = document.getElementById("heroTitle");
    dom.heroSubtitle = document.getElementById("heroSubtitle");
    dom.logo1Input = document.getElementById("logo1Input");
    dom.logo2Input = document.getElementById("logo2Input");
    dom.backgroundInput = document.getElementById("backgroundInput");
    dom.clearLogo1 = document.getElementById("clearLogo1");
    dom.clearLogo2 = document.getElementById("clearLogo2");
    dom.clearBackground = document.getElementById("clearBackground");

    dom.fontFamily = document.getElementById("fontFamily");
    dom.heroTitleFontFamily = document.getElementById("heroTitleFontFamily");
    dom.heroSubtitleFontFamily = document.getElementById("heroSubtitleFontFamily");
    dom.heroTitleAlign = document.getElementById("heroTitleAlign");
    dom.heroSubtitleAlign = document.getElementById("heroSubtitleAlign");
    dom.heroTitleColor = document.getElementById("heroTitleColor");
    dom.heroSubtitleColor = document.getElementById("heroSubtitleColor");
    dom.headingSize = document.getElementById("headingSize");
    dom.bodySize = document.getElementById("bodySize");
    dom.buttonTextSize = document.getElementById("buttonTextSize");
    dom.headingSizeValue = document.getElementById("headingSizeValue");
    dom.bodySizeValue = document.getElementById("bodySizeValue");
    dom.buttonTextSizeValue = document.getElementById("buttonTextSizeValue");
    // Mobile override controls
    dom.mobileOverridesEnabled = document.getElementById("mobileOverridesEnabled");
    dom.mobileHeadingSize = document.getElementById("mobileHeadingSize");
    dom.mobileHeadingSizeValue = document.getElementById("mobileHeadingSizeValue");
    dom.mobileBodySize = document.getElementById("mobileBodySize");
    dom.mobileBodySizeValue = document.getElementById("mobileBodySizeValue");
    dom.mobileHeroCenter = document.getElementById("mobileHeroCenter");

    dom.bgColor = document.getElementById("bgColor");
    dom.textColor = document.getElementById("textColor");
    dom.accentColor = document.getElementById("accentColor");
    dom.mutedColor = document.getElementById("mutedColor");
    dom.surfaceColor = document.getElementById("surfaceColor");
    dom.buttonTextColor = document.getElementById("buttonTextColor");

    dom.logo1X = document.getElementById("logo1X");
    dom.logo1Y = document.getElementById("logo1Y");
    dom.logo1Size = document.getElementById("logo1Size");
    dom.logo1Rotation = document.getElementById("logo1Rotation");
    dom.logo1Transparency = document.getElementById("logo1Transparency");
    dom.logo2X = document.getElementById("logo2X");
    dom.logo2Y = document.getElementById("logo2Y");
    dom.logo2Size = document.getElementById("logo2Size");
    dom.logo2Rotation = document.getElementById("logo2Rotation");
    dom.logo2Transparency = document.getElementById("logo2Transparency");
    dom.navX = document.getElementById("navX");
    dom.navY = document.getElementById("navY");
    dom.heroX = document.getElementById("heroX") || document.getElementById("heroTitleX");
    dom.heroY = document.getElementById("heroY") || document.getElementById("heroTitleY");
    dom.heroSubtitleX = document.getElementById("heroSubtitleX");
    dom.heroSubtitleY = document.getElementById("heroSubtitleY");
    dom.ctaX = document.getElementById("ctaX");
    dom.ctaY = document.getElementById("ctaY");
    dom.bgX = document.getElementById("bgX");
    dom.bgY = document.getElementById("bgY");
    dom.bgTransparency = document.getElementById("bgTransparency");
    dom.bgTransparencyValue = document.getElementById("bgTransparencyValue");
    dom.mobileNavX = document.getElementById("mobileNavX");
    dom.mobileNavY = document.getElementById("mobileNavY");
    dom.mobileHeroTitleX = document.getElementById("mobileHeroTitleX");
    dom.mobileHeroTitleY = document.getElementById("mobileHeroTitleY");
    dom.mobileHeroSubtitleX = document.getElementById("mobileHeroSubtitleX");
    dom.mobileHeroSubtitleY = document.getElementById("mobileHeroSubtitleY");
    dom.mobileCtaX = document.getElementById("mobileCtaX");
    dom.mobileCtaY = document.getElementById("mobileCtaY");

    dom.tabsEditor = document.getElementById("tabsEditor");
    dom.buttonsEditor = document.getElementById("buttonsEditor");
    dom.addButton = document.getElementById("addButton");
    dom.ctaTextOnly = document.getElementById("ctaTextOnly");
    dom.addTab = document.getElementById("addTab");
    dom.tabDisplayMode = document.getElementById("tabDisplayMode");
    dom.topTabsTransparent = document.getElementById("topTabsTransparent");
    dom.globalTabTextColor = document.getElementById("globalTabTextColor");
    dom.globalTabBgColor = document.getElementById("globalTabBgColor");

    dom.previewHome = document.getElementById("previewHome");
    dom.publishHomeOnly = document.getElementById("publishHomeOnly");
    dom.publishPrivacyOnly = document.getElementById("publishPrivacyOnly");
    dom.publishContactOnly = document.getElementById("publishContactOnly");
    dom.previewPage = document.getElementById("previewPage");
    dom.previewMobileToggle = document.getElementById("previewMobileToggle");
    dom.previewDevice = document.getElementById("previewDevice");
    dom.publishHome = document.getElementById("publishHome");
    dom.exportDraft = document.getElementById("exportDraft");
    dom.importDraft = document.getElementById("importDraft");
    dom.saveRepoDraft = document.getElementById("saveRepoDraft");
    dom.loadRepoDraft = document.getElementById("loadRepoDraft");
    dom.resetDraft = document.getElementById("resetDraft");
    dom.approval = document.getElementById("approval");
    dom.statusMessage = document.getElementById("statusMessage");
    dom.previewViewport = document.getElementById("previewViewport");

    dom.privacyTitle = document.getElementById("privacyTitle");
    dom.privacyIntro = document.getElementById("privacyIntro");
    dom.privacyScopeText = document.getElementById("privacyScopeText");
    dom.privacyDataText = document.getElementById("privacyDataText");
    dom.privacyNoCookiesText = document.getElementById("privacyNoCookiesText");
    dom.privacyNoMarketingText = document.getElementById("privacyNoMarketingText");
    dom.privacyHowUseText = document.getElementById("privacyHowUseText");
    dom.privacyEnforcementText = document.getElementById("privacyEnforcementText");
    dom.privacyTopTabsTransparent = document.getElementById("privacyTopTabsTransparent");
    dom.privacyBgColor = document.getElementById("privacyBgColor");
    dom.privacyTabTextColor = document.getElementById("privacyTabTextColor");
    dom.privacyTabBgColor = document.getElementById("privacyTabBgColor");
    dom.privacyTextColor = document.getElementById("privacyTextColor");
    dom.privacyMutedColor = document.getElementById("privacyMutedColor");
    dom.privacyLineColor = document.getElementById("privacyLineColor");
    dom.privacyAccentColor = document.getElementById("privacyAccentColor");
    dom.privacyCardColor = document.getElementById("privacyCardColor");
    dom.privacyTopBandHeight = document.getElementById("privacyTopBandHeight");
    dom.privacyTopBandHeightValue = document.getElementById("privacyTopBandHeightValue");
    dom.privacyHeroTopPadding = document.getElementById("privacyHeroTopPadding");
    dom.privacyHeroTopPaddingValue = document.getElementById("privacyHeroTopPaddingValue");
    dom.privacyCardPadding = document.getElementById("privacyCardPadding");
    dom.privacyCardPaddingValue = document.getElementById("privacyCardPaddingValue");
    dom.privacyLayoutGap = document.getElementById("privacyLayoutGap");
    dom.privacyLayoutGapValue = document.getElementById("privacyLayoutGapValue");

    dom.contactTitle = document.getElementById("contactTitle");
    dom.contactIntro = document.getElementById("contactIntro");
    dom.contactSubmitLabel = document.getElementById("contactSubmitLabel");
    dom.contactEmailSubject = document.getElementById("contactEmailSubject");
    dom.contactTopTabsTransparent = document.getElementById("contactTopTabsTransparent");
    dom.contactFormEndpoint = document.getElementById("contactFormEndpoint");
    dom.contactFieldsEditor = document.getElementById("contactFieldsEditor");
    dom.addContactField = document.getElementById("addContactField");
  }

  function bindCoreInputs() {
    bindText(dom.pageMode, function (value) {
      state.display.pageMode = normalizePageMode(value);
      if (state.display.pageMode === "privacy") {
        state.display.previewPage = "page:privacy.html";
      } else if (state.display.pageMode === "contact") {
        state.display.previewPage = "page:contact.html";
      } else {
        state.display.previewPage = "home";
      }
      if (dom.previewPage) {
        dom.previewPage.value = state.display.previewPage;
      }
      applyPageModeUI();
    }, "change");

    bindText(dom.brandName, function (value) {
      state.brand.name = value;
    });
    bindText(dom.heroTitle, function (value) {
      state.hero.title = value;
    });
    bindText(dom.heroSubtitle, function (value) {
      state.hero.subtitle = value;
    });

    bindText(dom.fontFamily, function (value) {
      state.theme.fontFamily = value;
    }, "change");

    bindText(dom.heroTitleFontFamily, function (value) {
      state.hero.titleFontFamily = normalizeFontFamily(value);
    }, "change");

    bindText(dom.heroSubtitleFontFamily, function (value) {
      state.hero.subtitleFontFamily = normalizeFontFamily(value);
    }, "change");

    bindText(dom.heroTitleAlign, function (value) {
      state.hero.titleAlign = normalizeTextAlign(value);
    }, "change");

    bindText(dom.heroSubtitleAlign, function (value) {
      state.hero.subtitleAlign = normalizeTextAlign(value);
    }, "change");

    bindText(dom.heroTitleColor, function (value) {
      state.hero.titleColor = normalizeHex(value, state.theme.textColor);
    }, "input");

    bindText(dom.heroSubtitleColor, function (value) {
      state.hero.subtitleColor = normalizeHex(value, state.theme.mutedColor);
    }, "input");

    bindNumber(dom.headingSize, function (value) {
      state.theme.headingSize = clamp(value, 32, 120);
    });
    bindNumber(dom.bodySize, function (value) {
      state.theme.bodySize = clamp(value, 12, 32);
    });
    bindNumber(dom.buttonTextSize, function (value) {
      state.theme.buttonTextSize = clamp(value, 12, 32);
    });

    // Mobile overrides bindings
    if (dom.mobileOverridesEnabled) {
      dom.mobileOverridesEnabled.addEventListener("change", function () {
        state.display.mobileOverrides = !!dom.mobileOverridesEnabled.checked;
        saveAndPreview();
      });
    }
    bindNumber(dom.mobileHeadingSize, function (value) {
      state.theme.mobileHeadingSize = clamp(value, 28, 120);
    });
    bindNumber(dom.mobileBodySize, function (value) {
      state.theme.mobileBodySize = clamp(value, 12, 40);
    });
    if (dom.mobileHeroCenter) {
      dom.mobileHeroCenter.addEventListener("change", function () {
        state.display.mobileHeroCenter = !!dom.mobileHeroCenter.checked;
        saveAndPreview();
      });
    }

    if (dom.previewDevice) {
      dom.previewDevice.addEventListener("change", function () {
        state.display.previewDevice = normalizePreviewDevice(dom.previewDevice.value);
        if (dom.previewMobileToggle) {
          dom.previewMobileToggle.checked = state.display.previewDevice === "mobile";
        }
        saveAndPreview();
      });
    }

    if (dom.previewMobileToggle) {
      dom.previewMobileToggle.addEventListener("change", function () {
        state.display.previewDevice = dom.previewMobileToggle.checked ? "mobile" : "desktop";
        if (dom.previewDevice) {
          dom.previewDevice.value = state.display.previewDevice;
        }
        saveAndPreview();
      });
    }

    if (dom.previewPage) {
      dom.previewPage.addEventListener("change", function () {
        state.display.previewPage = normalizePreviewPageValue(dom.previewPage.value, state);
        if (state.display.previewPage === "page:privacy.html") {
          state.display.pageMode = "privacy";
        } else if (state.display.previewPage === "page:contact.html") {
          state.display.pageMode = "contact";
        } else {
          state.display.pageMode = "home";
        }
        applyPageModeUI();
        saveAndPreview();
      });
    }

    bindText(dom.contactTitle, function (value) {
      state.contact.title = String(value || "");
    });
    bindText(dom.contactIntro, function (value) {
      state.contact.intro = String(value || "");
    });
    bindText(dom.contactSubmitLabel, function (value) {
      state.contact.submitLabel = String(value || "");
    });
    bindText(dom.contactEmailSubject, function (value) {
      state.contact.emailSubject = String(value || "");
    });
    if (dom.contactTopTabsTransparent) {
      dom.contactTopTabsTransparent.addEventListener("change", function () {
        state.contact.topTabsTransparent = !!dom.contactTopTabsTransparent.checked;
        saveAndPreview();
      });
    }
    bindText(dom.contactFormEndpoint, function (value) {
      state.contact.formEndpoint = String(value || "");
    });

    bindText(dom.privacyTitle, function (value) {
      state.privacy.title = String(value || "");
    });
    bindText(dom.privacyIntro, function (value) {
      state.privacy.intro = String(value || "");
    });
    bindText(dom.privacyScopeText, function (value) {
      state.privacy.scopeText = String(value || "");
    });
    bindText(dom.privacyDataText, function (value) {
      state.privacy.dataText = String(value || "");
    });
    bindText(dom.privacyNoCookiesText, function (value) {
      state.privacy.noCookiesText = String(value || "");
    });
    bindText(dom.privacyNoMarketingText, function (value) {
      state.privacy.noMarketingText = String(value || "");
    });
    bindText(dom.privacyHowUseText, function (value) {
      state.privacy.howUseText = String(value || "");
    });
    bindText(dom.privacyEnforcementText, function (value) {
      state.privacy.enforcementText = String(value || "");
    });

    bindText(dom.privacyBgColor, function (value) {
      state.privacy.bgColor = normalizeHex(value, "#f8fbfa");
    }, "input");
    if (dom.privacyTopTabsTransparent) {
      dom.privacyTopTabsTransparent.addEventListener("change", function () {
        state.privacy.topTabsTransparent = !!dom.privacyTopTabsTransparent.checked;
        saveAndPreview();
      });
    }
    bindText(dom.privacyTabTextColor, function (value) {
      state.display.tabTextColor = normalizeHex(value, state.theme.textColor);
    }, "input");
    bindText(dom.privacyTabBgColor, function (value) {
      state.display.tabBgColor = normalizeHex(value, state.theme.surfaceColor);
    }, "input");
    bindText(dom.privacyTextColor, function (value) {
      state.privacy.textColor = normalizeHex(value, "#18322b");
    }, "input");
    bindText(dom.privacyMutedColor, function (value) {
      state.privacy.mutedColor = normalizeHex(value, "#5a736c");
    }, "input");
    bindText(dom.privacyLineColor, function (value) {
      state.privacy.lineColor = normalizeHex(value, "#dce6e1");
    }, "input");
    bindText(dom.privacyAccentColor, function (value) {
      state.privacy.accentColor = normalizeHex(value, "#0f786b");
    }, "input");
    bindText(dom.privacyCardColor, function (value) {
      state.privacy.cardColor = normalizeHex(value, "#ffffff");
    }, "input");

    bindNumber(dom.privacyTopBandHeight, function (value) {
      state.privacy.topBandHeight = clamp(value, 48, 120);
    });
    bindNumber(dom.privacyHeroTopPadding, function (value) {
      state.privacy.heroTopPadding = clamp(value, 24, 96);
    });
    bindNumber(dom.privacyCardPadding, function (value) {
      state.privacy.cardPadding = clamp(value, 16, 40);
    });
    bindNumber(dom.privacyLayoutGap, function (value) {
      state.privacy.layoutGap = clamp(value, 12, 40);
    });

    bindText(dom.bgColor, function (value) {
      state.theme.bgColor = value;
    }, "input");
    bindText(dom.textColor, function (value) {
      var previous = state.theme.textColor;
      state.theme.textColor = value;
      syncThemeLinkedTabColors("textColor", previous, value);
    }, "input");
    bindText(dom.accentColor, function (value) {
      state.theme.accentColor = value;
    }, "input");
    bindText(dom.mutedColor, function (value) {
      var previous = state.theme.mutedColor;
      state.theme.mutedColor = value;
      syncThemeLinkedTabColors("mutedColor", previous, value);
    }, "input");
    bindText(dom.surfaceColor, function (value) {
      var previous = state.theme.surfaceColor;
      state.theme.surfaceColor = value;
      syncThemeLinkedTabColors("surfaceColor", previous, value);
    }, "input");
    bindText(dom.buttonTextColor, function (value) {
      state.theme.buttonTextColor = value;
    }, "input");

    bindNumber(dom.logo1X, function (value) {
      state.brand.logos[0].x = value;
    });
    bindNumber(dom.logo1Y, function (value) {
      state.brand.logos[0].y = value;
    });
    bindNumber(dom.logo1Size, function (value) {
      setLogoSize(0, value, true);
    });
    bindNumber(dom.logo1Rotation, function (value) {
      state.brand.logos[0].rotation = normalizeRotation(value);
    });
    bindNumber(dom.logo1Transparency, function (value) {
      state.brand.logos[0].transparency = clamp(value, 0, 95);
    });
    bindNumber(dom.logo2X, function (value) {
      state.brand.logos[1].x = value;
    });
    bindNumber(dom.logo2Y, function (value) {
      state.brand.logos[1].y = value;
    });
    bindNumber(dom.logo2Size, function (value) {
      setLogoSize(1, value, true);
    });
    bindNumber(dom.logo2Rotation, function (value) {
      state.brand.logos[1].rotation = normalizeRotation(value);
    });
    bindNumber(dom.logo2Transparency, function (value) {
      state.brand.logos[1].transparency = clamp(value, 0, 95);
    });
    bindNumber(dom.navX, function (value) {
      state.layout.nav.x = value;
    });
    bindNumber(dom.navY, function (value) {
      state.layout.nav.y = value;
    });
    bindNumber(dom.heroX, function (value) {
      state.layout.heroTitle.x = value;
    });
    bindNumber(dom.heroY, function (value) {
      state.layout.heroTitle.y = value;
    });
    bindNumber(dom.heroSubtitleX, function (value) {
      state.layout.heroSubtitle.x = value;
    });
    bindNumber(dom.heroSubtitleY, function (value) {
      state.layout.heroSubtitle.y = value;
    });
    bindNumber(dom.ctaX, function (value) {
      state.layout.cta.x = value;
    });
    bindNumber(dom.ctaY, function (value) {
      state.layout.cta.y = value;
    });
    bindNumber(dom.bgX, function (value) {
      state.background.x = clamp(value, 0, 100);
    });
    bindNumber(dom.bgY, function (value) {
      state.background.y = clamp(value, 0, 100);
    });
    bindNumber(dom.bgTransparency, function (value) {
      state.background.transparency = clamp(value, 0, 95);
    });

    bindNumber(dom.mobileNavX, function (value) {
      state.layout.mobileNav.x = value;
    });
    bindNumber(dom.mobileNavY, function (value) {
      state.layout.mobileNav.y = value;
    });
    bindNumber(dom.mobileHeroTitleX, function (value) {
      state.layout.mobileHeroTitle.x = value;
    });
    bindNumber(dom.mobileHeroTitleY, function (value) {
      state.layout.mobileHeroTitle.y = value;
    });
    bindNumber(dom.mobileHeroSubtitleX, function (value) {
      state.layout.mobileHeroSubtitle.x = value;
    });
    bindNumber(dom.mobileHeroSubtitleY, function (value) {
      state.layout.mobileHeroSubtitle.y = value;
    });
    bindNumber(dom.mobileCtaX, function (value) {
      state.layout.mobileCta.x = value;
    });
    bindNumber(dom.mobileCtaY, function (value) {
      state.layout.mobileCta.y = value;
    });

    bindText(dom.tabDisplayMode, function (value) {
      state.display.tabMode = normalizeTabMode(value);
    }, "change");

    bindText(dom.globalTabTextColor, function (value) {
      state.display.tabTextColor = normalizeHex(value, state.theme.textColor);
    }, "input");

    bindText(dom.globalTabBgColor, function (value) {
      state.display.tabBgColor = normalizeHex(value, state.theme.surfaceColor);
    }, "input");

    dom.topTabsTransparent.addEventListener("change", function () {
      state.display.topTabsTransparent = !!dom.topTabsTransparent.checked;
      refresh();
    });

    dom.ctaTextOnly.addEventListener("change", function () {
      state.display.ctaTextOnly = !!dom.ctaTextOnly.checked;
      refresh();
    });

    dom.logo1Input.addEventListener("change", function (event) {
      handleImageUpload(event, function (asset) {
        state.brand.logos[0].src = asset.src;
        state.brand.logos[0].fileName = asset.fileName;
        state.brand.logoSrc = asset.src;
        state.brand.logoFileName = asset.fileName;
      });
    });

    dom.logo2Input.addEventListener("change", function (event) {
      handleImageUpload(event, function (asset) {
        state.brand.logos[1].src = asset.src;
        state.brand.logos[1].fileName = asset.fileName;
      });
    });

    dom.backgroundInput.addEventListener("change", function (event) {
      handleImageUpload(event, function (asset) {
        state.background.src = asset.src;
        state.background.fileName = asset.fileName;
      });
    });

    dom.clearLogo1.addEventListener("click", function () {
      state.brand.logos[0].src = "";
      state.brand.logos[0].fileName = "";
      state.brand.logoSrc = "";
      state.brand.logoFileName = "";
      dom.logo1Input.value = "";
      refresh("Logo 1 removed from draft.");
    });

    dom.clearLogo2.addEventListener("click", function () {
      state.brand.logos[1].src = "";
      state.brand.logos[1].fileName = "";
      dom.logo2Input.value = "";
      refresh("Logo 2 removed from draft.");
    });

    dom.clearBackground.addEventListener("click", function () {
      state.background.src = "";
      state.background.fileName = "";
      dom.backgroundInput.value = "";
      refresh("Background removed from draft.");
    });
  }

  function bindActions() {
    dom.addButton.addEventListener("click", function () {
      var nextIndex = state.hero.buttons.length + 1;
      state.hero.buttons.push({
        label: "Button " + nextIndex,
        href: "#"
      });
      refresh("Action button added.");
    });

    dom.addTab.addEventListener("click", function () {
      var nextIndex = state.tabs.length + 1;
      state.tabs.push({
        label: "New Tab " + nextIndex,
        sectionId: uniqueSectionId("new-tab-" + nextIndex),
        pageHref: "",
        sectionTitle: "New Section " + nextIndex,
        sectionText: "Add content for this section before publishing.",
        sectionFontFamily: "",
        sectionTitleColor: state.theme.textColor,
        sectionTextColor: state.theme.mutedColor,
        sectionBackgroundColor: state.theme.surfaceColor,
        navFontFamily: "",
        navTextColor: state.display.tabTextColor,
        navBackgroundColor: state.display.tabBgColor,
        sectionBackgroundSrc: "",
        sectionBackgroundFileName: "",
        sectionBackgroundTransparency: 36,
        galleryLayout: "horizontal",
        galleryImageTransparency: 0,
        galleryImages: createEmptyGallery()
      });
      refresh("Tab added. Update the new tab details.");
    });

    dom.previewHome.addEventListener("click", function () {
      openPreviewWindow();
    });

    if (dom.publishHomeOnly) {
      dom.publishHomeOnly.addEventListener("click", function () {
        handlePublish("home");
      });
    }

    if (dom.publishPrivacyOnly) {
      dom.publishPrivacyOnly.addEventListener("click", function () {
        handlePublish("privacy");
      });
    }

    if (dom.publishContactOnly) {
      dom.publishContactOnly.addEventListener("click", function () {
        handlePublish("contact");
      });
    }

    if (dom.addContactField) {
      dom.addContactField.addEventListener("click", function () {
        var nextIndex = (state.contact && Array.isArray(state.contact.fields) ? state.contact.fields.length : 0) + 1;
        state.contact.fields.push({
          id: "field-" + nextIndex,
          label: "New Field " + nextIndex,
          type: "text",
          required: false,
          placeholder: ""
        });
        refresh("Contact field added.");
      });
    }

    dom.publishHome.addEventListener("click", function () {
      handlePublish("all");
    });

    dom.exportDraft.addEventListener("click", function () {
      exportDraft();
    });

    dom.saveRepoDraft.addEventListener("click", function () {
      saveRepoDraft();
    });

    dom.loadRepoDraft.addEventListener("click", function () {
      loadRepoDraft();
    });

    dom.importDraft.addEventListener("change", function (event) {
      importDraft(event);
    });

    dom.resetDraft.addEventListener("click", function () {
      if (!window.confirm("Reset all draft settings to default values?")) {
        return;
      }
      state = deepClone(defaultConfig);
      refresh("Draft reset to defaults.");
      dom.approval.checked = false;
    });
  }

  function bindText(element, setter, eventName) {
    if (!element) {
      return;
    }
    var inputEvent = eventName || "input";
    element.addEventListener(inputEvent, function () {
      setter(element.value);
      saveAndPreview();
    });
  }

  function bindNumber(element, setter) {
    if (!element) {
      return;
    }
    element.addEventListener("input", function () {
      var numericValue = parseInt(element.value, 10);
      if (Number.isNaN(numericValue)) {
        return;
      }
      setter(numericValue);
      syncRangeValuePill(element);
      saveAndPreview();
    });

    if (element.type === "number") {
      element.addEventListener("change", function () {
        saveAndPreview();
      });
    }
  }

  function syncRangeValuePill(element) {
    if (!element || element.type !== "range") {
      return;
    }
    var value = String(element.value || "0");
    if (element === dom.headingSize && dom.headingSizeValue) {
      dom.headingSizeValue.textContent = value + "px";
      return;
    }
    if (element === dom.bodySize && dom.bodySizeValue) {
      dom.bodySizeValue.textContent = value + "px";
      return;
    }
    if (element === dom.buttonTextSize && dom.buttonTextSizeValue) {
      dom.buttonTextSizeValue.textContent = value + "px";
      return;
    }
    if (element === dom.mobileHeadingSize && dom.mobileHeadingSizeValue) {
      dom.mobileHeadingSizeValue.textContent = value + "px";
      return;
    }
    if (element === dom.mobileBodySize && dom.mobileBodySizeValue) {
      dom.mobileBodySizeValue.textContent = value + "px";
      return;
    }
    if (element === dom.bgTransparency && dom.bgTransparencyValue) {
      dom.bgTransparencyValue.textContent = value + "%";
      return;
    }
    if (element === dom.privacyTopBandHeight && dom.privacyTopBandHeightValue) {
      dom.privacyTopBandHeightValue.textContent = value + "px";
      return;
    }
    if (element === dom.privacyHeroTopPadding && dom.privacyHeroTopPaddingValue) {
      dom.privacyHeroTopPaddingValue.textContent = value + "px";
      return;
    }
    if (element === dom.privacyCardPadding && dom.privacyCardPaddingValue) {
      dom.privacyCardPaddingValue.textContent = value + "px";
      return;
    }
    if (element === dom.privacyLayoutGap && dom.privacyLayoutGapValue) {
      dom.privacyLayoutGapValue.textContent = value + "px";
    }
  }

  function syncThemeLinkedTabColors(themeKey, previousValue, nextValue) {
    if (previousValue === nextValue) {
      return;
    }

    state.tabs.forEach(function (tab) {
      if (themeKey === "textColor") {
        if (tab.sectionTitleColor === previousValue) {
          tab.sectionTitleColor = nextValue;
        }
        if (state.display.tabTextColor === previousValue) {
          state.display.tabTextColor = nextValue;
        }
      }

      if (themeKey === "mutedColor" && tab.sectionTextColor === previousValue) {
        tab.sectionTextColor = nextValue;
      }

      if (themeKey === "surfaceColor") {
        if (tab.sectionBackgroundColor === previousValue) {
          tab.sectionBackgroundColor = nextValue;
        }
        if (state.display.tabBgColor === previousValue) {
          state.display.tabBgColor = nextValue;
        }
      }
    });

    syncTabColorInputsFromState();
  }

  function syncTabColorInputsFromState() {
    if (!dom.tabsEditor) {
      return;
    }

    var rows = dom.tabsEditor.querySelectorAll(".tab-row[data-tab-index]");
    rows.forEach(function (row) {
      var index = parseInt(row.getAttribute("data-tab-index"), 10);
      if (Number.isNaN(index) || !state.tabs[index]) {
        return;
      }

      var tab = state.tabs[index];
      setColorFieldValue(row, "sectionTitleColor", tab.sectionTitleColor);
      setColorFieldValue(row, "sectionTextColor", tab.sectionTextColor);
      setColorFieldValue(row, "sectionBackgroundColor", tab.sectionBackgroundColor);
      setColorFieldValue(row, "navTextColor", tab.navTextColor);
      setColorFieldValue(row, "navBackgroundColor", tab.navBackgroundColor);
    });
  }

  function setColorFieldValue(row, fieldName, value) {
    var input = row.querySelector("input[type='color'][data-field='" + fieldName + "']");
    if (input) {
      input.value = normalizeHex(value, "#000000");
    }
  }

  function handleImageUpload(event, callback) {
    var file = event.target.files && event.target.files[0];
    if (!file) {
      return;
    }
    var reader = new FileReader();
    reader.onload = function (loadEvent) {
      callback({
        src: String(loadEvent.target.result || ""),
        fileName: sanitizeFileName(file.name)
      });
      refresh(file.name + " loaded into draft.");
    };
    reader.readAsDataURL(file);
  }

  function refresh(message) {
    hasUserEditsSinceLoad = true;
    sanitizeState();
    saveState();
    syncInputsFromState();
    renderButtonsEditor();
    renderTabsEditor();
    renderContactFieldsEditor();
    schedulePreviewRender();
    if (message) {
      setStatus(message, false);
    }
  }

  function saveAndPreview() {
    hasUserEditsSinceLoad = true;
    saveState();
    schedulePreviewRender();
  }

  function schedulePreviewRender() {
    if (previewRenderFrame) {
      cancelAnimationFrame(previewRenderFrame);
    }
    if (previewRenderTimeout) {
      clearTimeout(previewRenderTimeout);
      previewRenderTimeout = 0;
    }
    previewRenderFrame = requestAnimationFrame(function () {
      previewRenderFrame = 0;
      if (previewRenderTimeout) {
        clearTimeout(previewRenderTimeout);
        previewRenderTimeout = 0;
      }
      renderPreview();
    });

    previewRenderTimeout = window.setTimeout(function () {
      if (previewRenderFrame) {
        cancelAnimationFrame(previewRenderFrame);
        previewRenderFrame = 0;
        renderPreview();
      }
      previewRenderTimeout = 0;
    }, 80);
  }

  function syncInputsFromState() {
    if (dom.pageMode) {
      dom.pageMode.value = normalizePageMode(state.display && state.display.pageMode);
    }

    if (dom.brandName) {
      dom.brandName.value = state.brand.name;
    }
    if (dom.heroTitle) {
      dom.heroTitle.value = state.hero.title;
    }
    if (dom.heroSubtitle) {
      dom.heroSubtitle.value = state.hero.subtitle;
    }

    if (dom.fontFamily) {
      dom.fontFamily.value = state.theme.fontFamily;
    }
    if (dom.heroTitleFontFamily) {
      dom.heroTitleFontFamily.value = state.hero.titleFontFamily || "";
    }
    if (dom.heroSubtitleFontFamily) {
      dom.heroSubtitleFontFamily.value = state.hero.subtitleFontFamily || "";
    }
    if (dom.heroTitleAlign) {
      dom.heroTitleAlign.value = state.hero.titleAlign;
    }
    if (dom.heroSubtitleAlign) {
      dom.heroSubtitleAlign.value = state.hero.subtitleAlign;
    }
    if (dom.headingSize) {
      dom.headingSize.value = String(state.theme.headingSize);
    }
    if (dom.bodySize) {
      dom.bodySize.value = String(state.theme.bodySize);
    }
    if (dom.buttonTextSize) {
      dom.buttonTextSize.value = String(state.theme.buttonTextSize);
    }
    if (dom.headingSizeValue) {
      dom.headingSizeValue.textContent = state.theme.headingSize + "px";
    }
    if (dom.bodySizeValue) {
      dom.bodySizeValue.textContent = state.theme.bodySize + "px";
    }
    if (dom.buttonTextSizeValue) {
      dom.buttonTextSizeValue.textContent = state.theme.buttonTextSize + "px";
    }

    if (dom.bgColor) {
      dom.bgColor.value = normalizeHex(state.theme.bgColor, "#f2f7f3");
    }
    if (dom.textColor) {
      dom.textColor.value = normalizeHex(state.theme.textColor, "#102822");
    }
    if (dom.accentColor) {
      dom.accentColor.value = normalizeHex(state.theme.accentColor, "#0f7b6c");
    }
    if (dom.mutedColor) {
      dom.mutedColor.value = normalizeHex(state.theme.mutedColor, "#4f6962");
    }
    if (dom.surfaceColor) {
      dom.surfaceColor.value = normalizeHex(state.theme.surfaceColor, "#e5f0ea");
    }
    if (dom.buttonTextColor) {
      dom.buttonTextColor.value = normalizeHex(state.theme.buttonTextColor, "#ffffff");
    }
    if (dom.heroTitleColor) {
      dom.heroTitleColor.value = normalizeHex(state.hero.titleColor, state.theme.textColor);
    }
    if (dom.heroSubtitleColor) {
      dom.heroSubtitleColor.value = normalizeHex(state.hero.subtitleColor, state.theme.mutedColor);
    }

    if (dom.logo1X) {
      dom.logo1X.value = String(state.brand.logos[0].x);
    }
    if (dom.logo1Y) {
      dom.logo1Y.value = String(state.brand.logos[0].y);
    }
    if (dom.logo1Size) {
      dom.logo1Size.value = String(state.brand.logos[0].size);
    }
    if (dom.logo1Rotation) {
      dom.logo1Rotation.value = String(state.brand.logos[0].rotation);
    }
    if (dom.logo1Transparency) {
      dom.logo1Transparency.value = String(state.brand.logos[0].transparency);
    }
    if (dom.logo2X) {
      dom.logo2X.value = String(state.brand.logos[1].x);
    }
    if (dom.logo2Y) {
      dom.logo2Y.value = String(state.brand.logos[1].y);
    }
    if (dom.logo2Size) {
      dom.logo2Size.value = String(state.brand.logos[1].size);
    }
    if (dom.logo2Rotation) {
      dom.logo2Rotation.value = String(state.brand.logos[1].rotation);
    }
    if (dom.logo2Transparency) {
      dom.logo2Transparency.value = String(state.brand.logos[1].transparency);
    }
    if (dom.navX) {
      dom.navX.value = String(state.layout.nav.x);
    }
    if (dom.navY) {
      dom.navY.value = String(state.layout.nav.y);
    }
    if (dom.heroX) {
      dom.heroX.value = String(state.layout.heroTitle.x);
    }
    if (dom.heroY) {
      dom.heroY.value = String(state.layout.heroTitle.y);
    }
    if (dom.heroSubtitleX) {
      dom.heroSubtitleX.value = String(state.layout.heroSubtitle.x);
    }
    if (dom.heroSubtitleY) {
      dom.heroSubtitleY.value = String(state.layout.heroSubtitle.y);
    }
    if (dom.ctaX) {
      dom.ctaX.value = String(state.layout.cta.x);
    }
    if (dom.ctaY) {
      dom.ctaY.value = String(state.layout.cta.y);
    }
    if (dom.bgX) {
      dom.bgX.value = String(state.background.x);
    }
    if (dom.bgY) {
      dom.bgY.value = String(state.background.y);
    }
    if (dom.bgTransparency) {
      dom.bgTransparency.value = String(state.background.transparency);
    }
    if (dom.bgTransparencyValue) {
      dom.bgTransparencyValue.textContent = state.background.transparency + "%";
    }
    if (dom.mobileNavX) {
      dom.mobileNavX.value = String((state.layout.mobileNav && state.layout.mobileNav.x) || 0);
    }
    if (dom.mobileNavY) {
      dom.mobileNavY.value = String((state.layout.mobileNav && state.layout.mobileNav.y) || 0);
    }
    if (dom.mobileHeroTitleX) {
      dom.mobileHeroTitleX.value = String((state.layout.mobileHeroTitle && state.layout.mobileHeroTitle.x) || 0);
    }
    if (dom.mobileHeroTitleY) {
      dom.mobileHeroTitleY.value = String((state.layout.mobileHeroTitle && state.layout.mobileHeroTitle.y) || 0);
    }
    if (dom.mobileHeroSubtitleX) {
      dom.mobileHeroSubtitleX.value = String((state.layout.mobileHeroSubtitle && state.layout.mobileHeroSubtitle.x) || 0);
    }
    if (dom.mobileHeroSubtitleY) {
      dom.mobileHeroSubtitleY.value = String((state.layout.mobileHeroSubtitle && state.layout.mobileHeroSubtitle.y) || 0);
    }
    if (dom.mobileCtaX) {
      dom.mobileCtaX.value = String((state.layout.mobileCta && state.layout.mobileCta.x) || 0);
    }
    if (dom.mobileCtaY) {
      dom.mobileCtaY.value = String((state.layout.mobileCta && state.layout.mobileCta.y) || 0);
    }
    // Mobile overrides UI
    if (dom.mobileOverridesEnabled) {
      dom.mobileOverridesEnabled.checked = !!state.display.mobileOverrides;
    }
    if (dom.mobileHeadingSize) {
      dom.mobileHeadingSize.value = String(state.theme.mobileHeadingSize || state.theme.headingSize || 48);
    }
    if (dom.mobileHeadingSizeValue) {
      dom.mobileHeadingSizeValue.textContent = String(state.theme.mobileHeadingSize || state.theme.headingSize || 48) + "px";
    }
    if (dom.mobileBodySize) {
      dom.mobileBodySize.value = String(state.theme.mobileBodySize || state.theme.bodySize || 16);
    }
    if (dom.mobileBodySizeValue) {
      dom.mobileBodySizeValue.textContent = String(state.theme.mobileBodySize || state.theme.bodySize || 16) + "px";
    }
    if (dom.mobileHeroCenter) {
      dom.mobileHeroCenter.checked = !!state.display.mobileHeroCenter;
    }
    refreshPreviewPageOptions();
    if (dom.previewDevice) {
      dom.previewDevice.value = normalizePreviewDevice(state.display.previewDevice);
    }
    if (dom.previewMobileToggle) {
      dom.previewMobileToggle.checked = normalizePreviewDevice(state.display.previewDevice) === "mobile";
    }
    if (dom.tabDisplayMode) {
      dom.tabDisplayMode.value = state.display.tabMode;
    }
    if (dom.topTabsTransparent) {
      dom.topTabsTransparent.checked = !!state.display.topTabsTransparent;
    }
    if (dom.globalTabTextColor) {
      dom.globalTabTextColor.value = normalizeHex(state.display.tabTextColor, state.theme.textColor);
    }
    if (dom.globalTabBgColor) {
      dom.globalTabBgColor.value = normalizeHex(state.display.tabBgColor, state.theme.surfaceColor);
    }
    if (dom.ctaTextOnly) {
      dom.ctaTextOnly.checked = !!state.display.ctaTextOnly;
    }

    if (dom.privacyTitle) {
      dom.privacyTitle.value = String(state.privacy.title || "");
    }
    if (dom.privacyIntro) {
      dom.privacyIntro.value = String(state.privacy.intro || "");
    }
    if (dom.privacyScopeText) {
      dom.privacyScopeText.value = String(state.privacy.scopeText || "");
    }
    if (dom.privacyDataText) {
      dom.privacyDataText.value = String(state.privacy.dataText || "");
    }
    if (dom.privacyNoCookiesText) {
      dom.privacyNoCookiesText.value = String(state.privacy.noCookiesText || "");
    }
    if (dom.privacyNoMarketingText) {
      dom.privacyNoMarketingText.value = String(state.privacy.noMarketingText || "");
    }
    if (dom.privacyHowUseText) {
      dom.privacyHowUseText.value = String(state.privacy.howUseText || "");
    }
    if (dom.privacyEnforcementText) {
      dom.privacyEnforcementText.value = String(state.privacy.enforcementText || "");
    }
    if (dom.privacyBgColor) {
      dom.privacyBgColor.value = state.privacy.bgColor;
    }
    if (dom.privacyTopTabsTransparent) {
      dom.privacyTopTabsTransparent.checked = !!state.privacy.topTabsTransparent;
    }
    if (dom.privacyTabTextColor) {
      dom.privacyTabTextColor.value = normalizeHex(state.display.tabTextColor, state.theme.textColor);
    }
    if (dom.privacyTabBgColor) {
      dom.privacyTabBgColor.value = normalizeHex(state.display.tabBgColor, state.theme.surfaceColor);
    }
    if (dom.privacyTextColor) {
      dom.privacyTextColor.value = state.privacy.textColor;
    }
    if (dom.privacyMutedColor) {
      dom.privacyMutedColor.value = state.privacy.mutedColor;
    }
    if (dom.privacyLineColor) {
      dom.privacyLineColor.value = state.privacy.lineColor;
    }
    if (dom.privacyAccentColor) {
      dom.privacyAccentColor.value = state.privacy.accentColor;
    }
    if (dom.privacyCardColor) {
      dom.privacyCardColor.value = state.privacy.cardColor;
    }
    if (dom.privacyTopBandHeight) {
      dom.privacyTopBandHeight.value = String(state.privacy.topBandHeight);
    }
    if (dom.privacyTopBandHeightValue) {
      dom.privacyTopBandHeightValue.textContent = state.privacy.topBandHeight + "px";
    }
    if (dom.privacyHeroTopPadding) {
      dom.privacyHeroTopPadding.value = String(state.privacy.heroTopPadding);
    }
    if (dom.privacyHeroTopPaddingValue) {
      dom.privacyHeroTopPaddingValue.textContent = state.privacy.heroTopPadding + "px";
    }
    if (dom.privacyCardPadding) {
      dom.privacyCardPadding.value = String(state.privacy.cardPadding);
    }
    if (dom.privacyCardPaddingValue) {
      dom.privacyCardPaddingValue.textContent = state.privacy.cardPadding + "px";
    }
    if (dom.privacyLayoutGap) {
      dom.privacyLayoutGap.value = String(state.privacy.layoutGap);
    }
    if (dom.privacyLayoutGapValue) {
      dom.privacyLayoutGapValue.textContent = state.privacy.layoutGap + "px";
    }

    if (dom.contactTitle) {
      dom.contactTitle.value = state.contact.title;
    }
    if (dom.contactIntro) {
      dom.contactIntro.value = state.contact.intro;
    }
    if (dom.contactSubmitLabel) {
      dom.contactSubmitLabel.value = state.contact.submitLabel;
    }
    if (dom.contactEmailSubject) {
      dom.contactEmailSubject.value = state.contact.emailSubject;
    }
    if (dom.contactTopTabsTransparent) {
      dom.contactTopTabsTransparent.checked = !!state.contact.topTabsTransparent;
    }
    if (dom.contactFormEndpoint) {
      dom.contactFormEndpoint.value = state.contact.formEndpoint;
    }

    applyPageModeUI();
  }

  function applyPageModeUI() {
    var mode = normalizePageMode(state.display && state.display.pageMode);
    if (dom.homeControls) {
      dom.homeControls.classList.toggle("page-mode-hidden", mode !== "home");
    }
    if (dom.privacyControls) {
      dom.privacyControls.classList.toggle("page-mode-hidden", mode !== "privacy");
    }
    if (dom.contactControls) {
      dom.contactControls.classList.toggle("page-mode-hidden", mode !== "contact");
    }
  }

  function renderButtonsEditor() {
    dom.buttonsEditor.innerHTML = state.hero.buttons
      .map(function (button, index) {
        return [
          "<div class=\"tab-row\" data-button-index=\"" + index + "\">",
          "<div class=\"tab-row-head\">",
          "<strong>Button " + (index + 1) + "</strong>",
          "<div class=\"tab-actions\">",
          "<button type=\"button\" data-action=\"up\">Up</button>",
          "<button type=\"button\" data-action=\"down\">Down</button>",
          "<button type=\"button\" data-action=\"remove\" class=\"danger\">Remove</button>",
          "</div>",
          "</div>",
          "<label>Button Label<input type=\"text\" data-field=\"label\" value=\"" + escapeAttr(button.label) + "\"></label>",
          "<label>Button Link<input type=\"text\" data-field=\"href\" value=\"" + escapeAttr(button.href) + "\" placeholder=\"products.html\"></label>",
          "</div>"
        ].join("");
      })
      .join("");

    var rows = dom.buttonsEditor.querySelectorAll(".tab-row");
    rows.forEach(function (row) {
      var index = parseInt(row.getAttribute("data-button-index"), 10);
      var inputs = row.querySelectorAll("input[data-field]");
      inputs.forEach(function (input) {
        var onFieldChange = function () {
          var field = String(input.getAttribute("data-field") || "");
          state.hero.buttons[index][field] = input.value;
          saveAndPreview();
        };
        input.addEventListener("input", onFieldChange);
        input.addEventListener("change", onFieldChange);
      });

      var controls = row.querySelectorAll("button[data-action]");
      controls.forEach(function (buttonControl) {
        buttonControl.addEventListener("click", function () {
          var action = String(buttonControl.getAttribute("data-action") || "");
          if (action === "remove") {
            state.hero.buttons.splice(index, 1);
            if (!state.hero.buttons.length) {
              state.hero.buttons.push({
                label: "Explore Products",
                href: "products.html"
              });
            }
            refresh("Action button removed.");
            return;
          }
          if (action === "up" && index > 0) {
            swapArrayItems(state.hero.buttons, index, index - 1);
            refresh();
            return;
          }
          if (action === "down" && index < state.hero.buttons.length - 1) {
            swapArrayItems(state.hero.buttons, index, index + 1);
            refresh();
          }
        });
      });
    });
  }

  function renderTabsEditor() {
    dom.tabsEditor.innerHTML = state.tabs
      .map(function (tab, index) {
        return [
          "<div class=\"tab-row\" data-tab-index=\"" + index + "\">",
          "<div class=\"tab-row-head\">",
          "<strong>Tab " + (index + 1) + "</strong>",
          "<div class=\"tab-actions\">",
          "<button type=\"button\" data-action=\"up\">Up</button>",
          "<button type=\"button\" data-action=\"down\">Down</button>",
          "<button type=\"button\" data-action=\"remove\" class=\"danger\">Remove</button>",
          "</div>",
          "</div>",
          "<label>Label<input type=\"text\" data-field=\"label\" value=\"" + escapeAttr(tab.label) + "\"></label>",
          "<label>Section Id<input type=\"text\" data-field=\"sectionId\" value=\"" + escapeAttr(tab.sectionId) + "\"></label>",
          "<label>Associated Page (HTML)<input type=\"text\" data-field=\"pageHref\" value=\"" + escapeAttr(tab.pageHref || "") + "\" placeholder=\"about.html\"></label>",
          "<label>Section Title<input type=\"text\" data-field=\"sectionTitle\" value=\"" + escapeAttr(tab.sectionTitle) + "\"></label>",
          "<label>Section Text<textarea rows=\"2\" data-field=\"sectionText\">" + escapeHtml(tab.sectionText) + "</textarea></label>",
          "<label>Section Font Family<select data-field=\"sectionFontFamily\">" + fontOptionsMarkup(tab.sectionFontFamily, true) + "</select></label>",
          "<label>Section Title Color<input type=\"color\" data-field=\"sectionTitleColor\" value=\"" + escapeAttr(tab.sectionTitleColor) + "\"></label>",
          "<label>Section Text Color<input type=\"color\" data-field=\"sectionTextColor\" value=\"" + escapeAttr(tab.sectionTextColor) + "\"></label>",
          "<label>Section Card Color<input type=\"color\" data-field=\"sectionBackgroundColor\" value=\"" + escapeAttr(tab.sectionBackgroundColor) + "\"></label>",
          "<label>Tab Background Image<input type=\"file\" accept=\"image/*\" data-file-role=\"tab-bg\"></label>",
          "<p class=\"hint\">Current background: " + escapeHtml(tab.sectionBackgroundFileName || "not set") + "</p>",
          "<label>Tab Background Transparency (%)<input type=\"range\" min=\"0\" max=\"95\" step=\"1\" data-field=\"sectionBackgroundTransparency\" data-value-id=\"tabBgTransparencyValue-" + index + "\" value=\"" + escapeAttr(String(normalizeTabImageTransparency(tab.sectionBackgroundTransparency, 36))) + "\"><span id=\"tabBgTransparencyValue-" + index + "\" class=\"value-pill\">" + escapeHtml(String(normalizeTabImageTransparency(tab.sectionBackgroundTransparency, 36))) + "%</span></label>",
          "<button type=\"button\" data-action=\"clear-tab-bg\">Clear Tab Background</button>",
          "<label>Tab Gallery Layout<select data-field=\"galleryLayout\">" + galleryLayoutOptionsMarkup(tab.galleryLayout) + "</select></label>",
          "<label>Tab Gallery Image Transparency (%)<input type=\"range\" min=\"0\" max=\"95\" step=\"1\" data-field=\"galleryImageTransparency\" data-value-id=\"tabGalleryTransparencyValue-" + index + "\" value=\"" + escapeAttr(String(normalizeTabImageTransparency(tab.galleryImageTransparency, 0))) + "\"><span id=\"tabGalleryTransparencyValue-" + index + "\" class=\"value-pill\">" + escapeHtml(String(normalizeTabImageTransparency(tab.galleryImageTransparency, 0))) + "%</span></label>",
          "<label>Gallery Image 1<input type=\"file\" accept=\"image/*\" data-file-role=\"gallery\" data-gallery-index=\"0\"></label>",
          "<p class=\"hint\">Image 1: " + escapeHtml(getGalleryFileName(tab, 0)) + "</p>",
          "<button type=\"button\" data-action=\"clear-gallery\" data-gallery-index=\"0\">Clear Image 1</button>",
          "<label>Gallery Image 2<input type=\"file\" accept=\"image/*\" data-file-role=\"gallery\" data-gallery-index=\"1\"></label>",
          "<p class=\"hint\">Image 2: " + escapeHtml(getGalleryFileName(tab, 1)) + "</p>",
          "<button type=\"button\" data-action=\"clear-gallery\" data-gallery-index=\"1\">Clear Image 2</button>",
          "<label>Gallery Image 3<input type=\"file\" accept=\"image/*\" data-file-role=\"gallery\" data-gallery-index=\"2\"></label>",
          "<p class=\"hint\">Image 3: " + escapeHtml(getGalleryFileName(tab, 2)) + "</p>",
          "<button type=\"button\" data-action=\"clear-gallery\" data-gallery-index=\"2\">Clear Image 3</button>",
          "<label>Gallery Image 4<input type=\"file\" accept=\"image/*\" data-file-role=\"gallery\" data-gallery-index=\"3\"></label>",
          "<p class=\"hint\">Image 4: " + escapeHtml(getGalleryFileName(tab, 3)) + "</p>",
          "<button type=\"button\" data-action=\"clear-gallery\" data-gallery-index=\"3\">Clear Image 4</button>",
          "<label>Tab Pill Font Family<select data-field=\"navFontFamily\">" + fontOptionsMarkup(tab.navFontFamily, true) + "</select></label>",
          "</div>"
        ].join("");
      })
      .join("");

    var rows = dom.tabsEditor.querySelectorAll(".tab-row");
    rows.forEach(function (row) {
      var index = parseInt(row.getAttribute("data-tab-index"), 10);
      var inputs = row.querySelectorAll("input[data-field], textarea[data-field], select[data-field]");
      inputs.forEach(function (input) {
        var onFieldChange = function (event) {
          var field = String(input.getAttribute("data-field") || "");

          // Keep page href typing natural; normalize only when editing is committed.
          if (field === "pageHref" && event && event.type === "input") {
            state.tabs[index].pageHref = input.value;
            saveAndPreview();
            return;
          }

          state.tabs[index][field] = input.value;
          var valueTargetId = String(input.getAttribute("data-value-id") || "");
          if (valueTargetId) {
            var valueTarget = row.querySelector("#" + valueTargetId);
            if (valueTarget) {
              valueTarget.textContent = String(input.value || "0") + "%";
            }
          }
          if (field === "label" && !state.tabs[index].sectionTitle) {
            state.tabs[index].sectionTitle = input.value;
          }
          if (field === "sectionId") {
            state.tabs[index].sectionId = slugify(input.value) || uniqueSectionId("section");
            input.value = state.tabs[index].sectionId;
          }
          if (field === "pageHref") {
            state.tabs[index].pageHref = normalizePageHref(input.value);
            input.value = state.tabs[index].pageHref;
          }
          saveAndPreview();
        };
        input.addEventListener("input", onFieldChange);
        input.addEventListener("change", onFieldChange);
      });

      var fileInputs = row.querySelectorAll("input[type='file'][data-file-role]");
      fileInputs.forEach(function (fileInput) {
        fileInput.addEventListener("change", function (event) {
          var role = String(fileInput.getAttribute("data-file-role") || "");
          if (role === "tab-bg") {
            handleImageUpload(event, function (asset) {
              state.tabs[index].sectionBackgroundSrc = asset.src;
              state.tabs[index].sectionBackgroundFileName = asset.fileName;
            });
            return;
          }
          if (role === "gallery") {
            var galleryIndex = clamp(parseInt(fileInput.getAttribute("data-gallery-index"), 10) || 0, 0, 3);
            handleImageUpload(event, function (asset) {
              ensureGallerySlots(state.tabs[index]);
              state.tabs[index].galleryImages[galleryIndex] = {
                src: asset.src,
                fileName: asset.fileName
              };
            });
          }
        });
      });

      var controls = row.querySelectorAll("button[data-action]");
      controls.forEach(function (button) {
        button.addEventListener("click", function () {
          var action = String(button.getAttribute("data-action") || "");
          if (action === "clear-tab-bg") {
            state.tabs[index].sectionBackgroundSrc = "";
            state.tabs[index].sectionBackgroundFileName = "";
            refresh("Tab background removed.");
            return;
          }
          if (action === "clear-gallery") {
            var galleryIndex = clamp(parseInt(button.getAttribute("data-gallery-index"), 10) || 0, 0, 3);
            ensureGallerySlots(state.tabs[index]);
            state.tabs[index].galleryImages[galleryIndex] = { src: "", fileName: "" };
            refresh("Gallery image removed.");
            return;
          }
          if (action === "remove") {
            state.tabs.splice(index, 1);
            if (!state.tabs.length) {
              state.tabs.push({
                label: "Home",
                sectionId: "home",
                pageHref: "index.html",
                sectionTitle: "Home",
                sectionText: "Describe this section.",
                sectionFontFamily: "",
                sectionTitleColor: state.theme.textColor,
                sectionTextColor: state.theme.mutedColor,
                sectionBackgroundColor: state.theme.surfaceColor,
                navFontFamily: "",
                navTextColor: state.display.tabTextColor,
                navBackgroundColor: state.display.tabBgColor,
                sectionBackgroundSrc: "",
                sectionBackgroundFileName: "",
                sectionBackgroundTransparency: 36,
                galleryLayout: "horizontal",
                galleryImageTransparency: 0,
                galleryImages: createEmptyGallery()
              });
            }
            refresh("Tab removed.");
            return;
          }
          if (action === "up" && index > 0) {
            swapTabs(index, index - 1);
            refresh();
            return;
          }
          if (action === "down" && index < state.tabs.length - 1) {
            swapTabs(index, index + 1);
            refresh();
          }
        });
      });
    });
  }

  function renderContactFieldsEditor() {
    if (!dom.contactFieldsEditor) {
      return;
    }

    var fields = (state.contact && Array.isArray(state.contact.fields)) ? state.contact.fields : [];
    dom.contactFieldsEditor.innerHTML = fields
      .map(function (field, index) {
        var type = normalizeContactFieldType(field.type);
        var requiredChecked = field.required ? " checked" : "";
        var removeDisabled = field.id === "consent" ? " disabled" : "";
        return [
          "<div class=\"tab-row\" data-contact-field-index=\"" + index + "\">",
          "<div class=\"tab-row-head\">",
          "<strong>Field " + (index + 1) + "</strong>",
          "<div class=\"tab-actions\">",
          "<button type=\"button\" data-action=\"up\">Up</button>",
          "<button type=\"button\" data-action=\"down\">Down</button>",
          "<button type=\"button\" data-action=\"remove\" class=\"danger\"" + removeDisabled + ">Remove</button>",
          "</div>",
          "</div>",
          "<label>Field Label<input type=\"text\" data-field=\"label\" value=\"" + escapeAttr(field.label) + "\"></label>",
          "<label>Field Id<input type=\"text\" data-field=\"id\" value=\"" + escapeAttr(field.id) + "\" placeholder=\"field-id\"></label>",
          "<label>Field Type<select data-field=\"type\">" + contactFieldTypeOptionsMarkup(type) + "</select></label>",
          "<label>Placeholder<input type=\"text\" data-field=\"placeholder\" value=\"" + escapeAttr(field.placeholder || "") + "\"></label>",
          "<label class=\"approval\"><input type=\"checkbox\" data-field=\"required\"" + requiredChecked + "> Required</label>",
          "</div>"
        ].join("");
      })
      .join("");

    var rows = dom.contactFieldsEditor.querySelectorAll(".tab-row");
    rows.forEach(function (row) {
      var index = parseInt(row.getAttribute("data-contact-field-index"), 10);
      var inputs = row.querySelectorAll("input[data-field],select[data-field]");
      inputs.forEach(function (input) {
        var eventName = input.type === "checkbox" || input.tagName === "SELECT" ? "change" : "input";
        input.addEventListener(eventName, function () {
          var fieldName = String(input.getAttribute("data-field") || "");
          var targetField = state.contact.fields[index];
          if (!targetField) {
            return;
          }
          if (fieldName === "required") {
            targetField.required = !!input.checked;
          } else if (fieldName === "type") {
            targetField.type = normalizeContactFieldType(input.value);
            if (targetField.type === "checkbox") {
              targetField.required = true;
            }
          } else if (fieldName === "id") {
            targetField.id = slugify(input.value || targetField.label || ("field-" + (index + 1)));
          } else {
            targetField[fieldName] = input.value;
          }
          saveAndPreview();
        });
      });

      var controls = row.querySelectorAll("button[data-action]");
      controls.forEach(function (buttonControl) {
        buttonControl.addEventListener("click", function () {
          var action = String(buttonControl.getAttribute("data-action") || "");
          if (action === "remove") {
            if (state.contact.fields[index] && state.contact.fields[index].id === "consent") {
              setStatus("Consent field cannot be removed.", true);
              return;
            }
            state.contact.fields.splice(index, 1);
            refresh("Contact field removed.");
            return;
          }
          if (action === "up" && index > 0) {
            swapArrayItems(state.contact.fields, index, index - 1);
            refresh();
            return;
          }
          if (action === "down" && index < state.contact.fields.length - 1) {
            swapArrayItems(state.contact.fields, index, index + 1);
            refresh();
          }
        });
      });
    });
  }

  function renderPreview() {
    var previewDevice = normalizePreviewDevice(state.display && state.display.previewDevice);
    var previewSelection = normalizePreviewPage(state.display && state.display.previewPage, state);
    var previewConfig = getPreviewConfig(previewDevice);

    if (previewSelection.value === "home") {
      dom.previewViewport.innerHTML = buildHomeMarkup(previewConfig, true);
    } else {
      dom.previewViewport.innerHTML = buildAssociatedPageMarkup(previewSelection.page, previewConfig, true);
    }

    dom.previewViewport.classList.toggle("preview-mobile", previewDevice === "mobile");
    dom.previewViewport.classList.toggle("preview-mobile-center-hero", previewDevice === "mobile" && !!(state.display && state.display.mobileHeroCenter));

    if (previewDevice === "mobile") {
      var homeTabSelector = dom.previewViewport.querySelector(".home-tab-selector");
      if (homeTabSelector) {
        homeTabSelector.style.display = "none";
      }
    }

    enablePreviewHamburger();
    enableDragging();
  }

  function getPreviewConfig(previewDevice) {
    if (previewDevice !== "mobile") {
      return state;
    }

    // In mobile preview, render draggable slots from mobile layout coordinates.
    var previewConfig = deepClone(state);
    if (window.ConfiguratorMobileBridge && typeof window.ConfiguratorMobileBridge.applyMobilePreviewLayout === "function") {
      return window.ConfiguratorMobileBridge.applyMobilePreviewLayout(previewConfig);
    }
    previewConfig.layout.nav = Object.assign({}, previewConfig.layout.mobileNav || { x: 0, y: 0 });
    previewConfig.layout.heroTitle = Object.assign({}, previewConfig.layout.mobileHeroTitle || { x: 0, y: 0 });
    previewConfig.layout.heroSubtitle = Object.assign({}, previewConfig.layout.mobileHeroSubtitle || { x: 0, y: 0 });
    previewConfig.layout.cta = Object.assign({}, previewConfig.layout.mobileCta || { x: 0, y: 0 });
    return previewConfig;
  }

  function enablePreviewHamburger() {
    var button = dom.previewViewport.querySelector(".hamburger");
    var root = dom.previewViewport.querySelector(".home-root");
    if (!button || !root) {
      return;
    }

    button.addEventListener("click", function () {
      var isOpen = root.classList.toggle("nav-open");
      button.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  }

  function enableDragging() {
    var dragNodes = dom.previewViewport.querySelectorAll("[data-drag-key]");
    dragNodes.forEach(function (node) {
      node.addEventListener("click", function (event) {
        var blockedUntil = Number(node.getAttribute("data-block-click-until") || 0);
        if (blockedUntil > Date.now()) {
          event.preventDefault();
          event.stopPropagation();
        }
      }, true);

      node.addEventListener("pointerdown", function (event) {
        event.preventDefault();
        var dragKey = String(node.getAttribute("data-drag-key") || "");
        var startPosition = getDragPosition(dragKey);
        if (!startPosition) {
          return;
        }

        var startX = event.clientX;
        var startY = event.clientY;
        var moved = false;

        node.classList.add("dragging");

        function onMove(moveEvent) {
          var deltaX = moveEvent.clientX - startX;
          var deltaY = moveEvent.clientY - startY;
          if (!moved && (Math.abs(deltaX) > 4 || Math.abs(deltaY) > 4)) {
            moved = true;
          }
          var nextX = Math.round(startPosition.x + deltaX);
          var nextY = Math.round(startPosition.y + deltaY);
          setDragPosition(dragKey, nextX, nextY);
          if (isLogoDragKey(dragKey)) {
            var logoIndex = logoIndexFromDragKey(dragKey);
            node.style.transform = logoTransform(state.brand.logos[logoIndex]);
          } else {
            node.style.transform = "translate(" + nextX + "px, " + nextY + "px)";
          }
          syncPositionInputsOnly();
        }

        function onUp() {
          node.classList.remove("dragging");
          window.removeEventListener("pointermove", onMove);
          window.removeEventListener("pointerup", onUp);
          saveState();
          if (moved) {
            node.setAttribute("data-block-click-until", String(Date.now() + 350));
            setStatus("Updated " + dragLabel(dragKey) + " position.", false);
          }
        }

        window.addEventListener("pointermove", onMove);
        window.addEventListener("pointerup", onUp);
      });
    });
  }

  function syncPositionInputsOnly() {
    if (dom.logo1X) {
      dom.logo1X.value = String(state.brand.logos[0].x);
    }
    if (dom.logo1Y) {
      dom.logo1Y.value = String(state.brand.logos[0].y);
    }
    if (dom.logo2X) {
      dom.logo2X.value = String(state.brand.logos[1].x);
    }
    if (dom.logo2Y) {
      dom.logo2Y.value = String(state.brand.logos[1].y);
    }
    if (dom.navX) {
      dom.navX.value = String(state.layout.nav.x);
    }
    if (dom.navY) {
      dom.navY.value = String(state.layout.nav.y);
    }
    if (dom.heroX) {
      dom.heroX.value = String(state.layout.heroTitle.x);
    }
    if (dom.heroY) {
      dom.heroY.value = String(state.layout.heroTitle.y);
    }
    if (dom.heroSubtitleX) {
      dom.heroSubtitleX.value = String(state.layout.heroSubtitle.x);
    }
    if (dom.heroSubtitleY) {
      dom.heroSubtitleY.value = String(state.layout.heroSubtitle.y);
    }
    if (dom.ctaX) {
      dom.ctaX.value = String(state.layout.cta.x);
    }
    if (dom.ctaY) {
      dom.ctaY.value = String(state.layout.cta.y);
    }
    if (dom.mobileNavX) {
      dom.mobileNavX.value = String((state.layout.mobileNav && state.layout.mobileNav.x) || 0);
    }
    if (dom.mobileNavY) {
      dom.mobileNavY.value = String((state.layout.mobileNav && state.layout.mobileNav.y) || 0);
    }
    if (dom.mobileHeroTitleX) {
      dom.mobileHeroTitleX.value = String((state.layout.mobileHeroTitle && state.layout.mobileHeroTitle.x) || 0);
    }
    if (dom.mobileHeroTitleY) {
      dom.mobileHeroTitleY.value = String((state.layout.mobileHeroTitle && state.layout.mobileHeroTitle.y) || 0);
    }
    if (dom.mobileHeroSubtitleX) {
      dom.mobileHeroSubtitleX.value = String((state.layout.mobileHeroSubtitle && state.layout.mobileHeroSubtitle.x) || 0);
    }
    if (dom.mobileHeroSubtitleY) {
      dom.mobileHeroSubtitleY.value = String((state.layout.mobileHeroSubtitle && state.layout.mobileHeroSubtitle.y) || 0);
    }
    if (dom.mobileCtaX) {
      dom.mobileCtaX.value = String((state.layout.mobileCta && state.layout.mobileCta.x) || 0);
    }
    if (dom.mobileCtaY) {
      dom.mobileCtaY.value = String((state.layout.mobileCta && state.layout.mobileCta.y) || 0);
    }
  }

  function openPreviewWindow() {
    var previewSelection = normalizePreviewPage(state.display && state.display.previewPage, state);
    if (window.ConfiguratorPreviewBridge && typeof window.ConfiguratorPreviewBridge.resolvePreviewOpenPlan === "function") {
      var openPlan = window.ConfiguratorPreviewBridge.resolvePreviewOpenPlan(previewSelection, state, {
        isPrivacyPolicyDescriptor: isPrivacyPolicyDescriptor,
        isContactDescriptor: isContactDescriptor,
        normalizePageHref: normalizePageHref,
        buildPrivacyPreviewHref: buildPrivacyPreviewHref,
        buildContactPreviewHref: buildContactPreviewHref,
        buildPublishedHtml: buildPublishedHtml,
        buildAssociatedPublishedHtml: buildAssociatedPublishedHtml
      });

      if (openPlan.mode === "url") {
        var directWindowFromPlan = window.open(openPlan.url, "_blank", "noopener,noreferrer");
        if (!directWindowFromPlan) {
          setStatus("Preview popup blocked by browser.", true);
          return;
        }
        setStatus("Opened " + openPlan.label + " preview in new tab.", false);
        return;
      }

      var previewWindowFromPlan = window.open("", "_blank", "noopener,noreferrer");
      if (!previewWindowFromPlan) {
        setStatus("Preview popup blocked by browser.", true);
        return;
      }
      previewWindowFromPlan.document.open();
      previewWindowFromPlan.document.write(openPlan.html || "");
      previewWindowFromPlan.document.close();
      setStatus("Opened " + openPlan.label + " preview in new tab.", false);
      return;
    }

    if (previewSelection.value !== "home" && (isPrivacyPolicyDescriptor(previewSelection.page) || isContactDescriptor(previewSelection.page))) {
      var pageHref = normalizePageHref(previewSelection.page && previewSelection.page.fileName)
        || (isPrivacyPolicyDescriptor(previewSelection.page) ? "privacy.html" : "contact.html");
      var previewHref = isPrivacyPolicyDescriptor(previewSelection.page)
        ? buildPrivacyPreviewHref(pageHref, state)
        : buildContactPreviewHref(pageHref, state);
      var directWindow = window.open(previewHref, "_blank", "noopener,noreferrer");
      if (!directWindow) {
        setStatus("Preview popup blocked by browser.", true);
        return;
      }
      setStatus("Opened " + previewSelection.label + " preview in new tab.", false);
      return;
    }

    var html = previewSelection.value === "home"
      ? buildPublishedHtml(state)
      : buildAssociatedPublishedHtml(previewSelection.page, state);
    var previewWindow = window.open("", "_blank", "noopener,noreferrer");
    if (!previewWindow) {
      setStatus("Preview popup blocked by browser.", true);
      return;
    }
    previewWindow.document.open();
    previewWindow.document.write(html);
    previewWindow.document.close();
    setStatus("Opened " + previewSelection.label + " preview in new tab.", false);
  }

  async function handlePublish(scope) {
    var previewDevice = normalizePreviewDevice(state.display && state.display.previewDevice);
    var hasDirectoryPicker = typeof window.showDirectoryPicker === "function";
    var publishFlow = null;
    if (window.ConfiguratorPublishBridge && typeof window.ConfiguratorPublishBridge.resolvePublishFlowContext === "function") {
      publishFlow = window.ConfiguratorPublishBridge.resolvePublishFlowContext(scope, previewDevice, hasDirectoryPicker);
    }
    var publishPlan = null;
    if (publishFlow && publishFlow.plan) {
      publishPlan = publishFlow.plan;
    } else if (window.ConfiguratorPublishBridge && typeof window.ConfiguratorPublishBridge.getPublishExecutionPlan === "function") {
      publishPlan = window.ConfiguratorPublishBridge.getPublishExecutionPlan(scope, previewDevice);
    }
    var publishScope = publishPlan ? publishPlan.scope : normalizePublishScope(scope);
    if (!dom.approval.checked) {
      setStatus("Approve the preview checkbox before publishing.", true);
      return;
    }

    var shouldValidate = publishPlan ? !!publishPlan.shouldValidate : shouldValidateStateForPublish(publishScope);
    if (shouldValidate) {
      var validationErrors = validateState();
      if (validationErrors.length) {
        setStatus(validationErrors[0], true);
        return;
      }
    }

    var publishStage = "start";
    var includeAssociatedPages = publishPlan ? !!publishPlan.includeAssociatedPages : shouldIncludeAssociatedPagesForPublish(previewDevice, publishScope);
    var publishTargets = publishPlan ? publishPlan.targets : getPublishTargets(publishScope);
    var publishHomePage = publishTargets.home;
    var publishPrivacyPage = publishTargets.privacy;
    var publishContactPage = publishTargets.contact;
    var publishAssets = publishTargets.assets;

    try {
      var shouldUseDirectoryTransport = publishFlow
        ? publishFlow.transport === "filesystem"
        : hasDirectoryPicker;
      if (shouldUseDirectoryTransport) {
        publishStage = "resolve-folder";
        var projectDirectory = await resolveProjectDirectoryHandle();
        if (!projectDirectory) {
          var canceledPublishPayload = preparePublishPayload(state);
          var canceledHtml = buildPublishedHtml(canceledPublishPayload.config);
          await publishByDownloadFallback(canceledPublishPayload, canceledHtml, includeAssociatedPages, "Folder picker blocked/canceled", publishScope);
          return;
        }

        try {
          var fallbackHomeHtml = "";
          if (publishHomePage) {
            publishStage = "read-existing-index";
            fallbackHomeHtml = await readExistingIndexHtml(projectDirectory);
          }

          var publishPayload = preparePublishPayload(state, {
            fallbackHomeHtml: fallbackHomeHtml
          });
          var html = buildPublishedHtml(publishPayload.config);
          var privacyHtml = buildPrivacyPolicyPageHtml(publishPayload.config);
          var contactHtml = buildContactPageHtml(publishPayload.config);

          if (publishHomePage && shouldPreserveExistingHomeOnPublish(fallbackHomeHtml)) {
            html = fallbackHomeHtml;
          }

          var savedAssetsResult = { mode: "none", count: 0 };
          if (publishAssets) {
            publishStage = "write-assets";
            savedAssetsResult = await persistPublishAssets(publishPayload.assets, projectDirectory);
          }

          if (publishHomePage) {
            publishStage = "write-index";
            await writeIndexHtml(projectDirectory, html);
          }

          if (publishPrivacyPage) {
            publishStage = "write-privacy";
            await writeSinglePage(projectDirectory, "privacy.html", privacyHtml);
          }

          if (publishContactPage) {
            publishStage = "write-contact";
            await writeSinglePage(projectDirectory, "contact.html", contactHtml);
          }

          var writtenAssociatedPagesCount = 0;
          if (includeAssociatedPages) {
            publishStage = "write-associated-pages";
            writtenAssociatedPagesCount = await writeAssociatedTabPages(projectDirectory, publishPayload.config);
          }

          publishStage = "completed";
          if (publishHomePage) {
            localStorage.setItem(LAST_PUBLISHED_KEY, html);
          }
          setStatus(buildScopedPublishSuccessMessage(projectDirectory, publishScope, includeAssociatedPages, writtenAssociatedPagesCount, savedAssetsResult), false);
          return;
        } catch (writeError) {
          if (writeError && writeError.name === "AbortError") {
            setStatus("Publish canceled at step: " + publishStage + ". Click Publish again and allow folder write access.", true);
            return;
          }
          throw writeError;
        }
      }

      var publishPayload = preparePublishPayload(state);
      var html = buildPublishedHtml(publishPayload.config);
      var privacyHtml = buildPrivacyPolicyPageHtml(publishPayload.config);
      var contactHtml = buildContactPageHtml(publishPayload.config);

      if (publishHomePage) {
        downloadFile("index.html", html, "text/html");
      }
      if (publishPrivacyPage) {
        downloadFile("privacy.html", privacyHtml, "text/html");
      }
      if (publishContactPage) {
        downloadFile("contact.html", contactHtml, "text/html");
      }
      var noFsAssetsResult = publishAssets ? await persistPublishAssets(publishPayload.assets) : { mode: "none", count: 0 };
      var downloadedAssociatedPagesCount = 0;
      if (includeAssociatedPages) {
        downloadedAssociatedPagesCount = downloadAssociatedTabPages(publishPayload.config);
      }
      if (publishHomePage) {
        localStorage.setItem(LAST_PUBLISHED_KEY, html);
      }
      setStatus(buildScopedDownloadMessage(publishScope, includeAssociatedPages, downloadedAssociatedPagesCount, noFsAssetsResult), false);
      return;
    } catch (error) {
      if (error && error.name === "AbortError") {
        var abortReason = error && error.message ? String(error.message) : "AbortError";
        var abortedPublishPayload = preparePublishPayload(state);
        var abortedHtml = buildPublishedHtml(abortedPublishPayload.config);
        await publishByDownloadFallback(abortedPublishPayload, abortedHtml, includeAssociatedPages, "Abort at " + publishStage + " (" + abortReason + ")", publishScope);
        return;
      }

      rememberedProjectDirectory = null;
      await clearRememberedProjectDirectory();
      var reason = error && error.message ? String(error.message) : "Unknown write error";
      setStatus("Direct folder publish failed at step: " + publishStage + ". " + reason + ". Re-select your project root folder and try again.", true);
    }
  }

  async function readExistingIndexHtml(projectDirectory) {
    try {
      var indexHandle = await projectDirectory.getFileHandle("index.html");
      var file = await indexHandle.getFile();
      return await file.text();
    } catch (_error) {
      return "";
    }
  }

  function shouldPreserveExistingHomeOnPublish(fallbackHomeHtml) {
    if (window.ConfiguratorPublishBridge && typeof window.ConfiguratorPublishBridge.shouldPreserveExistingHomeOnPublish === "function") {
      return window.ConfiguratorPublishBridge.shouldPreserveExistingHomeOnPublish(hasUserEditsSinceLoad, fallbackHomeHtml);
    }
    if (hasUserEditsSinceLoad) {
      return false;
    }
    var html = String(fallbackHomeHtml || "");
    if (!html) {
      return false;
    }
    return html.indexOf("class=\"home-root\"") >= 0;
  }

  async function publishByDownloadFallback(publishPayload, html, includeAssociatedPages, cause, scope) {
    var publishScope = normalizePublishScope(scope);
    var publishTargets = getPublishTargets(publishScope);
    var publishHomePage = publishTargets.home;
    var publishPrivacyPage = publishTargets.privacy;
    var publishContactPage = publishTargets.contact;
    var publishAssets = publishTargets.assets;

    if (publishHomePage) {
      downloadFile("index.html", html, "text/html");
    }
    if (publishPrivacyPage) {
      downloadFile("privacy.html", buildPrivacyPolicyPageHtml(publishPayload.config), "text/html");
    }
    if (publishContactPage) {
      downloadFile("contact.html", buildContactPageHtml(publishPayload.config), "text/html");
    }
    var assetsResult = publishAssets ? await persistPublishAssets(publishPayload.assets) : { mode: "none", count: 0 };
    var associatedCount = 0;
    if (includeAssociatedPages) {
      associatedCount = downloadAssociatedTabPages(publishPayload.config);
    }
    if (publishHomePage) {
      localStorage.setItem(LAST_PUBLISHED_KEY, html);
    }

    setStatus("Folder write unavailable (" + cause + "). " + buildScopedDownloadSummary(publishScope, includeAssociatedPages, associatedCount) + assetStatusSuffix(assetsResult), false);
  }

  function normalizePublishScope(scope) {
    if (window.ConfiguratorPublishBridge && typeof window.ConfiguratorPublishBridge.normalizePublishScope === "function") {
      return window.ConfiguratorPublishBridge.normalizePublishScope(scope);
    }
    var candidate = String(scope || "all").toLowerCase();
    if (candidate === "home" || candidate === "privacy" || candidate === "contact" || candidate === "all") {
      return candidate;
    }
    return "all";
  }

  function getPublishTargets(scope) {
    if (window.ConfiguratorPublishBridge && typeof window.ConfiguratorPublishBridge.getPublishTargets === "function") {
      return window.ConfiguratorPublishBridge.getPublishTargets(scope);
    }
    var publishScope = normalizePublishScope(scope);
    return {
      home: publishScope === "all" || publishScope === "home",
      privacy: publishScope === "all" || publishScope === "privacy",
      contact: publishScope === "all" || publishScope === "contact",
      assets: publishScope === "all" || publishScope === "home"
    };
  }

  function shouldValidateStateForPublish(scope) {
    if (window.ConfiguratorPublishBridge && typeof window.ConfiguratorPublishBridge.shouldValidateState === "function") {
      return window.ConfiguratorPublishBridge.shouldValidateState(scope);
    }
    var publishScope = normalizePublishScope(scope);
    return publishScope === "home" || publishScope === "all";
  }

  function shouldIncludeAssociatedPagesForPublish(previewDevice, scope) {
    if (window.ConfiguratorPublishBridge && typeof window.ConfiguratorPublishBridge.shouldIncludeAssociatedPages === "function") {
      return window.ConfiguratorPublishBridge.shouldIncludeAssociatedPages(previewDevice, scope);
    }
    var normalizedDevice = normalizePreviewDevice(previewDevice);
    var publishScope = normalizePublishScope(scope);
    return normalizedDevice !== "mobile" && publishScope === "all";
  }

  function buildScopedPublishSuccessMessage(projectDirectory, scope, includeAssociatedPages, associatedCount, assetsResult) {
    if (window.ConfiguratorPublishBridge && typeof window.ConfiguratorPublishBridge.buildScopedPublishSuccessMessage === "function") {
      return window.ConfiguratorPublishBridge.buildScopedPublishSuccessMessage(
        String(projectDirectory.name || "selected folder"),
        scope,
        includeAssociatedPages,
        associatedCount,
        assetStatusSuffix(assetsResult)
      );
    }
    var location = String(projectDirectory.name || "selected folder");
    var base = "Publish complete in " + location + ". ";
    if (scope === "privacy") {
      return base + "Saved privacy.html.";
    }
    if (scope === "contact") {
      return base + "Saved contact.html.";
    }
    if (scope === "home") {
      return base + "Saved index.html." + assetStatusSuffix(assetsResult);
    }
    if (includeAssociatedPages) {
      return base + "Saved index.html, privacy.html, contact.html, and " + associatedCount + " associated page(s)." + assetStatusSuffix(assetsResult);
    }
    return base + "Saved index.html, privacy.html, and contact.html." + assetStatusSuffix(assetsResult);
  }

  function buildScopedDownloadSummary(scope, includeAssociatedPages, associatedCount) {
    if (window.ConfiguratorPublishBridge && typeof window.ConfiguratorPublishBridge.buildScopedDownloadSummary === "function") {
      return window.ConfiguratorPublishBridge.buildScopedDownloadSummary(scope, includeAssociatedPages, associatedCount);
    }
    if (scope === "privacy") {
      return "Downloaded privacy.html.";
    }
    if (scope === "contact") {
      return "Downloaded contact.html.";
    }
    if (scope === "home") {
      return "Downloaded index.html.";
    }
    if (includeAssociatedPages) {
      return "Downloaded index.html, privacy.html, contact.html, and " + associatedCount + " associated page(s).";
    }
    return "Downloaded index.html, privacy.html, and contact.html.";
  }

  function buildScopedDownloadMessage(scope, includeAssociatedPages, associatedCount, assetsResult) {
    if (window.ConfiguratorPublishBridge && typeof window.ConfiguratorPublishBridge.buildScopedDownloadMessage === "function") {
      return window.ConfiguratorPublishBridge.buildScopedDownloadMessage(
        scope,
        includeAssociatedPages,
        associatedCount,
        assetStatusSuffix(assetsResult)
      );
    }
    return "Browser folder-write API unavailable. " + buildScopedDownloadSummary(scope, includeAssociatedPages, associatedCount) + assetStatusSuffix(assetsResult);
  }

  function validateState() {
    if (window.ConfiguratorPublishBridge && typeof window.ConfiguratorPublishBridge.validateStateFromConfig === "function") {
      return window.ConfiguratorPublishBridge.validateStateFromConfig(state);
    }
    var errors = [];
    if (!state.brand.name.trim()) {
      errors.push("Brand name is required.");
    }
    if (!Array.isArray(state.hero.buttons) || !state.hero.buttons.length) {
      errors.push("At least one action button is required.");
    }
    if (Array.isArray(state.hero.buttons) && state.hero.buttons.some(function (button) {
      return !String(button.label || "").trim();
    })) {
      errors.push("Each action button needs a label.");
    }
    if (!state.tabs.length) {
      errors.push("At least one tab is required.");
    }
    var seen = {};
    state.tabs.forEach(function (tab, index) {
      var id = slugify(tab.sectionId || "");
      if (!id) {
        errors.push("Tab " + (index + 1) + " needs a valid section id.");
      }
      if (seen[id]) {
        errors.push("Duplicate section id found: " + id);
      }
      seen[id] = true;
    });
    return errors;
  }

  function exportDraft() {
    var json = JSON.stringify(state, null, 2);
    downloadFile("home-config-draft.json", json, "application/json");
    setStatus("Draft exported as JSON.", false);
  }

  async function saveRepoDraft() {
    var scriptContent = buildRepoDraftScript(state);

    try {
      if (!rememberedProjectDirectory && typeof window.showDirectoryPicker === "function") {
        var chosenDirectory = await resolveProjectDirectoryHandle();
        if (chosenDirectory) {
          rememberedProjectDirectory = chosenDirectory;
        }
      }

      if (rememberedProjectDirectory && typeof rememberedProjectDirectory.getDirectoryHandle === "function") {
        var projectDirectory = rememberedProjectDirectory;
        var jsDirectory = await projectDirectory.getDirectoryHandle("js", { create: true });
        var draftHandle = await jsDirectory.getFileHandle("configurator.draft.js", { create: true });
        var writable = await draftHandle.createWritable();
        await writable.write(scriptContent);
        await writable.close();

        window[REPO_DRAFT_GLOBAL_KEY] = deepClone(state);
        setStatus("Draft saved to " + REPO_DRAFT_FILE_PATH + ". Commit and push this file to reuse the same draft on another PC.", false);
        return;
      }

      downloadFile("configurator.draft.js", scriptContent, "application/javascript");
      setStatus("Draft downloaded as configurator.draft.js. Put it in js/ (overwrite existing) and commit.", false);
    } catch (error) {
      if (error && error.name === "AbortError") {
        downloadFile("configurator.draft.js", scriptContent, "application/javascript");
        setStatus("Folder selection canceled. Draft downloaded as configurator.draft.js instead.", false);
        return;
      }

      rememberedProjectDirectory = null;
      await clearRememberedProjectDirectory();
      downloadFile("configurator.draft.js", scriptContent, "application/javascript");
      setStatus("Direct folder save was unavailable. Draft downloaded as configurator.draft.js. Put it in js/ and commit.", false);
    }
  }

  function loadRepoDraft() {
    var repoDraft = getRepoDraft();
    if (!repoDraft) {
      setStatus("No repo draft found in " + REPO_DRAFT_FILE_PATH + ". Save one first.", true);
      return;
    }

    state = mergeConfig(defaultConfig, repoDraft);
    sanitizeState();
    refresh("Loaded draft from " + REPO_DRAFT_FILE_PATH + ".");
    dom.approval.checked = false;
  }

  function buildRepoDraftScript(draftState) {
    if (window.ConfiguratorDraftBridge && typeof window.ConfiguratorDraftBridge.buildRepoDraftScript === "function") {
      return window.ConfiguratorDraftBridge.buildRepoDraftScript(REPO_DRAFT_GLOBAL_KEY, draftState);
    }
    return [
      "// Auto-generated by Homepage Configurator.",
      "// Commit this file to keep draft settings synced across devices.",
      "window." + REPO_DRAFT_GLOBAL_KEY + " = " + JSON.stringify(draftState, null, 2) + ";",
      ""
    ].join("\n");
  }

  function getRepoDraft() {
    if (window.ConfiguratorDraftBridge && typeof window.ConfiguratorDraftBridge.getRepoDraftCandidate === "function") {
      return window.ConfiguratorDraftBridge.getRepoDraftCandidate(window, REPO_DRAFT_GLOBAL_KEY);
    }
    var candidate = window[REPO_DRAFT_GLOBAL_KEY];
    if (!candidate || typeof candidate !== "object" || Array.isArray(candidate)) {
      return null;
    }
    if (Object.keys(candidate).length === 0) {
      return null;
    }
    return candidate;
  }

  function importDraft(event) {
    var file = event.target.files && event.target.files[0];
    if (!file) {
      return;
    }
    var reader = new FileReader();
    reader.onload = function (loadEvent) {
      try {
        var incoming = JSON.parse(String(loadEvent.target.result || "{}"));
        state = mergeConfig(defaultConfig, incoming);
        sanitizeState();
        refresh("Draft imported.");
      } catch (_error) {
        setStatus("Import failed: invalid JSON.", true);
      }
      dom.importDraft.value = "";
    };
    reader.readAsText(file);
  }

  function buildPublishedHtml(config) {
    var fontHref = getAllFontsHref();

    return [
      "<!doctype html>",
      "<html lang=\"en\">",
      "<head>",
      "  <meta charset=\"utf-8\">",
      "  <meta name=\"viewport\" content=\"width=device-width,initial-scale=1\">",
      "  <title>" + escapeHtml(config.brand.name) + "</title>",
      "  <link rel=\"preconnect\" href=\"https://fonts.googleapis.com\">",
      "  <link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin>",
      "  <link href=\"" + fontHref + "\" rel=\"stylesheet\">",
      "  <link rel=\"stylesheet\" href=\"css/components/home/reset-shell.css\">",
      "  <link rel=\"stylesheet\" href=\"css/components/home/navigation.css\">",
      "  <link rel=\"stylesheet\" href=\"css/components/home/hero-cta.css\">",
      "  <link rel=\"stylesheet\" href=\"css/components/home/cards-footer.css\">",
      "  <link rel=\"stylesheet\" href=\"css/components/home/mobile.css\">",
      "</head>",
      "<body>",
      buildHomeMarkup(config, false),
      "<script src=\"js/pages/home.runtime.js\"></script>",
      "</body>",
      "</html>"
    ].join("\n");
  }

  function buildHomeMarkup(config, draggable) {
    var footerMarkup = draggable
      ? ""
      : "<footer class=\"site-footer-fixed\">&copy;VINATECH 2026. All rights reserved.</footer>";

    var tabMode = normalizeTabMode(config.display && config.display.tabMode);
    var topTabsTransparent = !!(config.display && config.display.topTabsTransparent);
    var ctaTextOnly = !!(config.display && config.display.ctaTextOnly);
    var showHomeTabSelector = tabMode === "top-and-home";
    var showTabCards = tabMode === "top-and-home";

    function resolveTabHref(tab, id) {
      var label = String((tab && tab.label) || "").trim().toLowerCase();
      var sectionTitle = String((tab && tab.sectionTitle) || "").trim().toLowerCase();
      if (label === "home") {
        return "index.html";
      }
      if (label === "news") {
        return "news.html";
      }
      if (label.indexOf("contact") >= 0 || sectionTitle.indexOf("contact") >= 0) {
        return "contact.html";
      }
      if (label.indexOf("privacy") >= 0 || sectionTitle.indexOf("privacy") >= 0) {
        return "privacy.html";
      }
      var linkedPage = normalizePageHref(tab && tab.pageHref);
      return linkedPage || (showTabCards ? "#" + id : "#");
    }

    var bgImage = config.background.src
      ? "style=\"background-image:url('" + escapeAttr(config.background.src) + "');background-size:115% 115%;background-position:" +
        config.background.x +
        "% " +
        config.background.y +
        "%;\""
      : "style=\"background-image:radial-gradient(circle at " +
        config.background.x +
        "% " +
        config.background.y +
        "%, color-mix(in srgb, var(--preview-accent) 22%, #ffffff 78%) 0%, transparent 58%);\"";

    var topNavLinks = config.tabs
      .map(function (tab) {
        var id = slugify(tab.sectionId || tab.label || "section");
        var href = resolveTabHref(tab, id);
        var previewAttrs = draggable ? " target=\"_blank\" rel=\"noreferrer\"" : "";
        var navStyle = buildTabPillStyle(tab, config, topTabsTransparent);
        return "<a href=\"" + escapeAttr(href) + "\"" + previewAttrs + " style=\"" + navStyle + "\">" + escapeHtml(tab.label) + "</a>";
      })
      .join("");

    var homeSelectorLinks = config.tabs
      .map(function (tab) {
        var id = slugify(tab.sectionId || tab.label || "section");
        var href = resolveTabHref(tab, id);
        var previewAttrs = draggable ? " target=\"_blank\" rel=\"noreferrer\"" : "";
        var navStyle = buildTabPillStyle(tab, config, topTabsTransparent);
        return "<a href=\"" + escapeAttr(href) + "\"" + previewAttrs + " style=\"" + navStyle + "\">" + escapeHtml(tab.label) + "</a>";
      })
      .join("");

    var homeTabSelectorMarkup = showHomeTabSelector
      ? "<nav class=\"home-tab-selector\">" + homeSelectorLinks + "</nav>"
      : "";

    var cards = config.tabs
      .map(function (tab) {
        var id = slugify(tab.sectionId || tab.label || "section");
        var cardStyle = "background:" + escapeAttr(tab.sectionBackgroundColor || config.theme.surfaceColor) + ";";
        if (tab.sectionBackgroundSrc) {
          var tabBgTransparency = normalizeTabImageTransparency(tab.sectionBackgroundTransparency, 36) / 100;
          var tabBgTopAlpha = tabBgTransparency.toFixed(2);
          var tabBgBottomAlpha = Math.min(0.95, tabBgTransparency + 0.12).toFixed(2);
          cardStyle += "background-image:linear-gradient(180deg, rgba(255,255,255," + tabBgTopAlpha + "), rgba(255,255,255," + tabBgBottomAlpha + ")),url('" +
            escapeAttr(tab.sectionBackgroundSrc) + "');background-size:cover;background-position:center;";
        }
        var titleStyle = "color:" + escapeAttr(tab.sectionTitleColor || config.theme.textColor) + ";" +
          (tab.sectionFontFamily ? "font-family:'" + escapeAttr(tab.sectionFontFamily) + "','Segoe UI',sans-serif;" : "");
        var textStyle = "color:" + escapeAttr(tab.sectionTextColor || config.theme.mutedColor) + ";" +
          (tab.sectionFontFamily ? "font-family:'" + escapeAttr(tab.sectionFontFamily) + "','Segoe UI',sans-serif;" : "");
        var galleryMarkup = tabGalleryMarkup(tab);
        return [
          "<article id=\"" + escapeAttr(id) + "\" class=\"generated-card\" style=\"" + cardStyle + "\">",
          "<h3 style=\"" + titleStyle + "\">" + escapeHtml(tab.sectionTitle || tab.label) + "</h3>",
          "<p style=\"" + textStyle + "\">" + escapeHtml(tab.sectionText || "Add content for this section.") + "</p>",
          galleryMarkup,
          "</article>"
        ].join("");
      })
      .join("");

    var buttonLinks = config.hero.buttons
      .map(function (button) {
        var href = String(button.href || "#").trim() || "#";
        var previewAttrs = draggable ? " target=\"_blank\" rel=\"noreferrer\"" : "";
        var buttonStyle = "background:" + escapeAttr(config.theme.accentColor) + ";color:" +
          escapeAttr(config.theme.buttonTextColor) + ";font-size:var(--preview-button-size);";
        if (ctaTextOnly) {
          buttonStyle += "background:transparent;border-color:transparent;box-shadow:none;";
        }
        return "<a href=\"" + escapeAttr(href) + "\"" + previewAttrs + " style=\"" + buttonStyle + "\">" +
          escapeHtml(button.label) +
          "</a>";
      })
      .join("");

    var logos = ensureTwoLogos(config.brand)
      .map(function (logo, index) {
        var label = index === 0 ? config.brand.name : "Logo 2";
        var inner = logo.src
          ? "<img src=\"" + escapeAttr(logo.src) + "\" alt=\"" + escapeAttr(label) + "\">"
          : "<span class=\"logo-fallback\">" + escapeHtml(label) + "</span>";
        return "<div class=\"logo-slot\" " + logoDragAttr(index, draggable) + logoStyleAttr(logo) + ">" + inner + "</div>";
      })
      .join("");

    return [
      "<div class=\"home-root\" style=\"--preview-bg:" + escapeAttr(config.theme.bgColor) +
        ";--preview-text:" +
        escapeAttr(config.theme.textColor) +
        ";--preview-accent:" +
        escapeAttr(config.theme.accentColor) +
        ";--preview-muted:" +
        escapeAttr(config.theme.mutedColor) +
        ";--preview-surface:" +
        escapeAttr(config.theme.surfaceColor) +
        ";--preview-bg-opacity:" +
        transparencyToOpacity(config.background.transparency) +
        ";--preview-button-text:" +
        escapeAttr(config.theme.buttonTextColor) +
        ";--preview-button-size:" +
        config.theme.buttonTextSize +
        "px" +
        ";--preview-heading-size:" +
        config.theme.headingSize +
        "px;--preview-body-size:" +
        config.theme.bodySize +
        "px;--mobile-nav-x:" + ((config.layout.mobileNav && config.layout.mobileNav.x) || 0) +
        "px;--mobile-nav-y:" + ((config.layout.mobileNav && config.layout.mobileNav.y) || 0) +
        "px;--mobile-hero-title-x:" + ((config.layout.mobileHeroTitle && config.layout.mobileHeroTitle.x) || 0) +
        "px;--mobile-hero-title-y:" + ((config.layout.mobileHeroTitle && config.layout.mobileHeroTitle.y) || 0) +
        "px;--mobile-hero-subtitle-x:" + ((config.layout.mobileHeroSubtitle && config.layout.mobileHeroSubtitle.x) || 0) +
        "px;--mobile-hero-subtitle-y:" + ((config.layout.mobileHeroSubtitle && config.layout.mobileHeroSubtitle.y) || 0) +
        "px;--mobile-cta-x:" + ((config.layout.mobileCta && config.layout.mobileCta.x) || 0) +
        "px;--mobile-cta-y:" + ((config.layout.mobileCta && config.layout.mobileCta.y) || 0) +
        "px;font-family:'" +
        escapeAttr(config.theme.fontFamily) +
        "','Segoe UI',sans-serif;\">",
      "<div class=\"home-bg\" " + bgImage + "></div>",
      "<div class=\"home-overlay\" style=\"background:linear-gradient(160deg, color-mix(in srgb, " +
        escapeAttr(config.theme.surfaceColor) +
        " 86%, #ffffff 14%) 0%, transparent 70%);\"></div>",
      "<header class=\"home-header\">",
      "<div class=\"brand-logos\">" + logos + "</div>",
      "<button class=\"hamburger\" type=\"button\" aria-label=\"Toggle navigation\" aria-expanded=\"false\" aria-controls=\"site-nav\"><span class=\"bar\"></span></button>",
      "<nav id=\"site-nav\" class=\"home-nav nav-slot\" " + dragAttr("nav", draggable) + transformAttr(config.layout.nav) + ">" + topNavLinks + "</nav>",
      "</header>",
      "<main class=\"hero-wrap\">",
      "<section class=\"hero-title-slot\" " + dragAttr("heroTitle", draggable) + " style=\"transform:translate(" + config.layout.heroTitle.x + "px," + config.layout.heroTitle.y + "px);text-align:" + escapeAttr(config.hero.titleAlign) + ";" + (config.hero.titleFontFamily ? "font-family:'" + escapeAttr(config.hero.titleFontFamily) + "','Segoe UI',sans-serif;" : "") + "\">",
      "<h1 style=\"color:" + escapeAttr(config.hero.titleColor) + ";\">" + escapeHtml(config.hero.title) + "</h1>",
      "</section>",
      "<section class=\"hero-subtitle-slot\" " + dragAttr("heroSubtitle", draggable) + " style=\"transform:translate(" + config.layout.heroSubtitle.x + "px," + config.layout.heroSubtitle.y + "px);text-align:" + escapeAttr(config.hero.subtitleAlign) + ";" + (config.hero.subtitleFontFamily ? "font-family:'" + escapeAttr(config.hero.subtitleFontFamily) + "','Segoe UI',sans-serif;" : "") + "\">",
      "<p style=\"color:" + escapeAttr(config.hero.subtitleColor) + ";\">" + escapeHtml(config.hero.subtitle) + "</p>",
      "</section>",
      "<div class=\"cta-slot\" " + dragAttr("cta", draggable) + transformAttr(config.layout.cta) + ">",
      buttonLinks,
      "</div>",
      homeTabSelectorMarkup,
      "</main>",
      showTabCards ? "<section class=\"generated-sections\">" + cards + "</section>" : "",
      footerMarkup,
      "</div>"
    ].join("");
  }

  function tabGalleryMarkup(tab) {
    var galleryImages = normalizeGalleryImages(tab.galleryImages)
      .filter(function (item) {
        return !!item.src;
      })
      .slice(0, 4);

    if (!galleryImages.length) {
      return "";
    }

    var layoutStyle = galleryLayoutStyle(tab.galleryLayout, galleryImages.length);
    var galleryOpacity = transparencyToOpacity(normalizeTabImageTransparency(tab.galleryImageTransparency, 0));
    var items = galleryImages
      .map(function (image, index) {
        return "<img src=\"" + escapeAttr(image.src) + "\" alt=\"Tab media " + (index + 1) + "\" style=\"width:100%;height:148px;object-fit:cover;border-radius:10px;opacity:" + galleryOpacity + ";\">";
      })
      .join("");

    return "<div class=\"tab-gallery\" style=\"" + layoutStyle + "\">" + items + "</div>";
  }

  function galleryLayoutStyle(layout, imageCount) {
    var mode = normalizeGalleryLayout(layout);
    if (mode === "vertical") {
      return "margin-top:12px;display:grid;grid-template-columns:1fr;gap:8px;";
    }
    if (mode === "split") {
      return "margin-top:12px;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;";
    }
    if (imageCount === 1) {
      return "margin-top:12px;display:grid;grid-template-columns:1fr;gap:8px;";
    }
    return "margin-top:12px;display:grid;grid-template-columns:repeat(" + Math.min(imageCount, 4) + ",minmax(0,1fr));gap:8px;";
  }

  function preparePublishPayload(sourceConfig, options) {
    var publishConfig = deepClone(sourceConfig);
    var assets = [];
    var usedNames = {};
    var publishOptions = options || {};

    function stageAsset(src, fileName, fallbackPrefix) {
      var cleanSrc = normalizeImageSrc(src);
      if (!cleanSrc) {
        return { src: "", fileName: "" };
      }
      if (!isDataUrl(cleanSrc)) {
        return {
          src: cleanSrc,
          fileName: sanitizeFileName(fileName)
        };
      }

      var resolvedName = sanitizeFileName(fileName) || inferFileName(cleanSrc, fallbackPrefix);
      resolvedName = ensureUniqueFileName(resolvedName, usedNames);
      assets.push({
        fileName: resolvedName,
        dataUrl: cleanSrc
      });
      return {
        src: "images/" + resolvedName,
        fileName: resolvedName
      };
    }

    var publishLogos = ensureTwoLogos(publishConfig.brand);
    publishLogos = backfillMissingLogosFromPublishFallbacks(publishLogos, publishOptions.fallbackHomeHtml);

    publishConfig.brand.logos = publishLogos.map(function (logo, logoIndex) {
      var logoAsset = stageAsset(logo.src, logo.fileName, "logo-" + (logoIndex + 1));
      return Object.assign({}, logo, {
        src: logoAsset.src,
        fileName: logoAsset.fileName
      });
    });
    publishConfig.brand.logoSrc = publishConfig.brand.logos[0].src;
    publishConfig.brand.logoFileName = publishConfig.brand.logos[0].fileName;

    var backgroundAsset = stageAsset(publishConfig.background.src, publishConfig.background.fileName, "home-background");
    publishConfig.background.src = backgroundAsset.src;
    publishConfig.background.fileName = backgroundAsset.fileName;

    publishConfig.tabs.forEach(function (tab, tabIndex) {
      var tabBgAsset = stageAsset(tab.sectionBackgroundSrc, tab.sectionBackgroundFileName, "tab-" + (tabIndex + 1) + "-background");
      tab.sectionBackgroundSrc = tabBgAsset.src;
      tab.sectionBackgroundFileName = tabBgAsset.fileName;

      tab.galleryImages = normalizeGalleryImages(tab.galleryImages).map(function (image, imageIndex) {
        var itemAsset = stageAsset(image.src, image.fileName, "tab-" + (tabIndex + 1) + "-image-" + (imageIndex + 1));
        return {
          src: itemAsset.src,
          fileName: itemAsset.fileName
        };
      });
    });

    return {
      config: publishConfig,
      assets: assets
    };
  }

  async function writeIndexHtml(projectDirectory, html) {
    var indexHandle = await projectDirectory.getFileHandle("index.html", { create: true });
    var writable = await indexHandle.createWritable();
    await writable.write(html);
    await writable.close();
  }

  async function writeSinglePage(projectDirectory, fileName, html) {
    var pageHandle = await projectDirectory.getFileHandle(fileName, { create: true });
    var writable = await pageHandle.createWritable();
    await writable.write(html);
    await writable.close();
  }

  async function writeAssociatedTabPages(projectDirectory, config) {
    var pages = getAssociatedTabPages(config);
    for (var i = 0; i < pages.length; i += 1) {
      var page = pages[i];
      var fileHandle = await projectDirectory.getFileHandle(page.fileName, { create: true });
      var writable = await fileHandle.createWritable();
      await writable.write(page.html);
      await writable.close();
    }
    return pages.length;
  }

  function downloadAssociatedTabPages(config) {
    var pages = getAssociatedTabPages(config);
    pages.forEach(function (page) {
      downloadFile(page.fileName, page.html, "text/html");
    });
    return pages.length;
  }

  function getAssociatedTabPages(config) {
    if (window.ConfiguratorPreviewBridge && typeof window.ConfiguratorPreviewBridge.getAssociatedTabPages === "function") {
      return window.ConfiguratorPreviewBridge.getAssociatedTabPages(config, {
        isPrivacyPolicyDescriptor: isPrivacyPolicyDescriptor,
        buildAssociatedTabPageHtml: buildAssociatedTabPageHtml
      });
    }
    var descriptors = getAssociatedPageDescriptors(config);
    return descriptors
      .filter(function (descriptor) {
        return !isPrivacyPolicyDescriptor(descriptor);
      })
      .map(function (descriptor) {
      return {
        fileName: descriptor.fileName,
        html: buildAssociatedTabPageHtml(descriptor, config)
      };
    });
  }

  function getAssociatedPageDescriptors(config) {
    if (window.ConfiguratorPreviewBridge && typeof window.ConfiguratorPreviewBridge.getAssociatedPageDescriptors === "function") {
      return window.ConfiguratorPreviewBridge.getAssociatedPageDescriptors(config);
    }
    var pagesByFile = {};

    function addPageFromHref(href, titleFallback, subtitleFallback) {
      var normalized = normalizePageHref(href);
      if (!normalized || /^(https?:|mailto:|tel:|#)/i.test(normalized)) {
        return;
      }

      var clean = normalized.split("?")[0].split("#")[0].trim();
      if (!clean) {
        return;
      }

      var lower = clean.toLowerCase();
      if (lower === "index.html" || lower.indexOf("/") >= 0) {
        return;
      }

      if (!pagesByFile[clean]) {
        pagesByFile[clean] = {
          fileName: clean,
          sectionTitle: String(titleFallback || "Page"),
          sectionText: String(subtitleFallback || "This page is under construction."),
          label: String(titleFallback || "Page")
        };
      }
    }

    config.tabs.forEach(function (tab) {
      addPageFromHref(tab.pageHref, tab.sectionTitle || tab.label || "Page", tab.sectionText || "This page is under construction.");
    });

    if (config.hero && Array.isArray(config.hero.buttons)) {
      config.hero.buttons.forEach(function (button, index) {
        var buttonTitle = String((button && button.label) || ("Page " + (index + 1)));
        addPageFromHref(button && button.href, buttonTitle, "This page is under construction.");
      });
    }

    return Object.keys(pagesByFile).map(function (fileName) {
      return pagesByFile[fileName];
    });
  }

  function buildAssociatedTabPageHtml(tab, config) {
    if (window.ConfiguratorPreviewBridge && typeof window.ConfiguratorPreviewBridge.buildAssociatedTabPageHtml === "function") {
      return window.ConfiguratorPreviewBridge.buildAssociatedTabPageHtml(tab, config, {
        isPrivacyPolicyDescriptor: isPrivacyPolicyDescriptor,
        isContactDescriptor: isContactDescriptor,
        buildPrivacyPolicyPageHtml: buildPrivacyPolicyPageHtml,
        buildContactPageHtml: buildContactPageHtml,
        buildAssociatedPageMarkup: buildAssociatedPageMarkup,
        getAllFontsHref: getAllFontsHref,
        escapeHtml: escapeHtml
      });
    }
    if (isPrivacyPolicyDescriptor(tab)) {
      return buildPrivacyPolicyPageHtml(config);
    }
    if (isContactDescriptor(tab)) {
      return buildContactPageHtml(config);
    }

    var title = String((tab && tab.sectionTitle) || (tab && tab.label) || "Page");
    var site = String((config && config.brand && config.brand.name) || "VinATech");

    return [
      "<!doctype html>",
      "<html lang=\"en\">",
      "<head>",
      "  <meta charset=\"utf-8\">",
      "  <meta name=\"viewport\" content=\"width=device-width,initial-scale=1\">",
      "  <title>" + escapeHtml(title) + " - " + escapeHtml(site) + "</title>",
      "  <link rel=\"preconnect\" href=\"https://fonts.googleapis.com\">",
      "  <link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin>",
      "  <link href=\"" + getAllFontsHref() + "\" rel=\"stylesheet\">",
      "  <link rel=\"stylesheet\" href=\"css/components/home/reset-shell.css\">",
      "  <link rel=\"stylesheet\" href=\"css/components/home/navigation.css\">",
      "  <link rel=\"stylesheet\" href=\"css/components/home/hero-cta.css\">",
      "  <link rel=\"stylesheet\" href=\"css/components/home/cards-footer.css\">",
      "  <link rel=\"stylesheet\" href=\"css/components/home/mobile.css\">",
      "</head>",
      "<body>",
      buildAssociatedPageMarkup(tab, config, false),
      "<script src=\"js/pages/home.runtime.js\"></script>",
      "</body>",
      "</html>"
    ].join("\n");
  }

  function buildAssociatedPageMarkup(tab, config, draggable) {
    if (window.ConfiguratorPreviewBridge && typeof window.ConfiguratorPreviewBridge.buildAssociatedPageMarkup === "function") {
      return window.ConfiguratorPreviewBridge.buildAssociatedPageMarkup(tab, config, draggable, {
        isPrivacyPolicyDescriptor: isPrivacyPolicyDescriptor,
        isContactDescriptor: isContactDescriptor,
        normalizePageHref: normalizePageHref,
        buildExternalFilePreviewMarkup: buildExternalFilePreviewMarkup,
        buildPrivacyPreviewHref: buildPrivacyPreviewHref,
        buildContactPreviewHref: buildContactPreviewHref,
        deepClone: deepClone,
        buildHomeMarkup: buildHomeMarkup
      });
    }
    if (isPrivacyPolicyDescriptor(tab)) {
      var privacyHref = normalizePageHref(tab && tab.fileName) || "privacy.html";
      return buildExternalFilePreviewMarkup(buildPrivacyPreviewHref(privacyHref, config));
    }
    if (isContactDescriptor(tab)) {
      var contactHref = normalizePageHref(tab && tab.fileName) || "contact.html";
      return buildExternalFilePreviewMarkup(buildContactPreviewHref(contactHref, config));
    }

    var pageConfig = deepClone(config);
    pageConfig.hero.title = String((tab && tab.sectionTitle) || (tab && tab.label) || "Page");
    pageConfig.hero.subtitle = String((tab && tab.sectionText) || "This page is under construction.");
    return buildHomeMarkup(pageConfig, draggable);
  }

  function buildAssociatedPublishedHtml(tab, config) {
    if (window.ConfiguratorPreviewBridge && typeof window.ConfiguratorPreviewBridge.buildAssociatedPublishedHtml === "function") {
      return window.ConfiguratorPreviewBridge.buildAssociatedPublishedHtml(tab, config, {
        isPrivacyPolicyDescriptor: isPrivacyPolicyDescriptor,
        isContactDescriptor: isContactDescriptor,
        buildPrivacyPolicyPageHtml: buildPrivacyPolicyPageHtml,
        buildContactPageHtml: buildContactPageHtml,
        buildAssociatedPageMarkup: buildAssociatedPageMarkup,
        getAllFontsHref: getAllFontsHref,
        escapeHtml: escapeHtml
      });
    }
    if (isPrivacyPolicyDescriptor(tab)) {
      return buildPrivacyPolicyPageHtml(config);
    }
    if (isContactDescriptor(tab)) {
      return buildContactPageHtml(config);
    }

    var title = String((tab && tab.sectionTitle) || (tab && tab.label) || "Page");
    var site = String((config && config.brand && config.brand.name) || "VinATech");
    return [
      "<!doctype html>",
      "<html lang=\"en\">",
      "<head>",
      "  <meta charset=\"utf-8\">",
      "  <meta name=\"viewport\" content=\"width=device-width,initial-scale=1\">",
      "  <title>" + escapeHtml(title) + " - " + escapeHtml(site) + "</title>",
      "  <link rel=\"preconnect\" href=\"https://fonts.googleapis.com\">",
      "  <link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin>",
      "  <link href=\"" + getAllFontsHref() + "\" rel=\"stylesheet\">",
      "  <link rel=\"stylesheet\" href=\"css/components/home/reset-shell.css\">",
      "  <link rel=\"stylesheet\" href=\"css/components/home/navigation.css\">",
      "  <link rel=\"stylesheet\" href=\"css/components/home/hero-cta.css\">",
      "  <link rel=\"stylesheet\" href=\"css/components/home/cards-footer.css\">",
      "  <link rel=\"stylesheet\" href=\"css/components/home/mobile.css\">",
      "</head>",
      "<body>",
      buildAssociatedPageMarkup(tab, config, false),
      "<script src=\"js/pages/home.runtime.js\"></script>",
      "</body>",
      "</html>"
    ].join("\n");
  }

  function refreshPreviewPageOptions() {
    if (!dom.previewPage) {
      return;
    }

    var previousPreviewPage = state.display && state.display.previewPage;
    if (window.ConfiguratorPreviewBridge && typeof window.ConfiguratorPreviewBridge.refreshPreviewPageOptions === "function") {
      var refreshed = window.ConfiguratorPreviewBridge.refreshPreviewPageOptions(previousPreviewPage, state, {
        getPreviewPageOptions: getPreviewPageOptions,
        normalizePreviewPageValue: function (value, options) {
          if (window.ConfiguratorStateBridge && typeof window.ConfiguratorStateBridge.normalizePreviewPageValue === "function") {
            return window.ConfiguratorStateBridge.normalizePreviewPageValue(value, options);
          }
          return window.ConfiguratorPreviewBridge.normalizePreviewPageValue(value, options);
        },
        escapeAttr: escapeAttr,
        escapeHtml: escapeHtml
      });
      dom.previewPage.innerHTML = refreshed.optionsHtml;
      state.display.previewPage = refreshed.selectedValue;
      dom.previewPage.value = state.display.previewPage;
      if (refreshed.changed) {
        saveState();
      }
      return;
    }

    var options = getPreviewPageOptions(state);
    dom.previewPage.innerHTML = options
      .map(function (option) {
        return "<option value=\"" + escapeAttr(option.value) + "\">" + escapeHtml(option.label) + "</option>";
      })
      .join("");

    state.display.previewPage = normalizePreviewPageValue(state.display && state.display.previewPage, state);
    dom.previewPage.value = state.display.previewPage;
    if (state.display.previewPage !== previousPreviewPage) {
      saveState();
    }
  }

  function getPreviewPageOptions(config) {
    if (window.ConfiguratorPreviewBridge && typeof window.ConfiguratorPreviewBridge.getPreviewPageOptions === "function") {
      return window.ConfiguratorPreviewBridge.getPreviewPageOptions(config, {
        getAssociatedPageDescriptors: getAssociatedPageDescriptors,
        isFixedPageFileName: isFixedPageFileName
      });
    }
    var options = [{
      value: "home",
      label: "HOME (index.html)",
      page: null
    }];

    options.push({
      value: "page:privacy.html",
      label: "Privacy Policy (privacy.html)",
      page: {
        fileName: "privacy.html",
        sectionTitle: (config && config.privacy && config.privacy.title) || "Privacy Policy",
        label: "Privacy"
      }
    });

    options.push({
      value: "page:contact.html",
      label: "Contact (contact.html)",
      page: {
        fileName: "contact.html",
        sectionTitle: (config && config.contact && config.contact.title) || "Contact",
        label: "Contact"
      }
    });

    getAssociatedPageDescriptors(config).forEach(function (descriptor) {
      if (isFixedPageFileName(descriptor.fileName)) {
        return;
      }
      var descriptorFile = String(descriptor.fileName || "").toLowerCase();
      var descriptorLabel = String(descriptor.sectionTitle || descriptor.label || "").trim().toLowerCase();
      if (descriptorLabel === "contact" && descriptorFile !== "contact.html") {
        return;
      }
      options.push({
        value: "page:" + descriptor.fileName,
        label: String(descriptor.sectionTitle || descriptor.label || "Page") + " (" + descriptor.fileName + ")",
        page: descriptor
      });
    });

    return options;
  }

  function normalizePreviewPage(value, config) {
    if (window.ConfiguratorPreviewBridge && typeof window.ConfiguratorPreviewBridge.resolvePreviewSelection === "function") {
      return window.ConfiguratorPreviewBridge.resolvePreviewSelection(value, config, {
        getPreviewPageOptions: getPreviewPageOptions,
        normalizePreviewPageValue: function (candidateValue, options) {
          if (window.ConfiguratorStateBridge && typeof window.ConfiguratorStateBridge.normalizePreviewPageValue === "function") {
            return window.ConfiguratorStateBridge.normalizePreviewPageValue(candidateValue, options);
          }
          return window.ConfiguratorPreviewBridge.normalizePreviewPageValue(candidateValue, options);
        },
        selectPreviewPage: selectPreviewPage
      });
    }
    var options = getPreviewPageOptions(config);
    if (window.ConfiguratorPreviewBridge && typeof window.ConfiguratorPreviewBridge.normalizePreviewPage === "function") {
      return window.ConfiguratorPreviewBridge.normalizePreviewPage(value, options, {
        normalizePreviewPageValue: function (candidateValue) {
          return normalizePreviewPageValue(candidateValue, config);
        },
        selectPreviewPage: selectPreviewPage
      });
    }
    var selectedValue = normalizePreviewPageValue(value, config);
    for (var index = 0; index < options.length; index += 1) {
      if (options[index].value === selectedValue) {
        return options[index];
      }
    }
    return options[0];
  }

  function isPrivacyPolicyDescriptor(tab) {
    if (window.ConfiguratorPreviewBridge && typeof window.ConfiguratorPreviewBridge.isPrivacyPolicyDescriptor === "function") {
      return window.ConfiguratorPreviewBridge.isPrivacyPolicyDescriptor(tab);
    }
    var fileName = String((tab && tab.fileName) || (tab && tab.pageHref) || "").toLowerCase();
    var title = String((tab && tab.sectionTitle) || (tab && tab.label) || "").toLowerCase();
    return fileName === "privacy.html" || title.indexOf("privacy") >= 0;
  }

  function isContactDescriptor(tab) {
    if (window.ConfiguratorPreviewBridge && typeof window.ConfiguratorPreviewBridge.isContactDescriptor === "function") {
      return window.ConfiguratorPreviewBridge.isContactDescriptor(tab);
    }
    var fileName = String((tab && tab.fileName) || (tab && tab.pageHref) || "").toLowerCase();
    var title = String((tab && tab.sectionTitle) || (tab && tab.label) || "").toLowerCase();
    return fileName === "contact.html" || title === "contact" || title.indexOf("contact") === 0;
  }

  function isFixedPageFileName(fileName) {
    if (window.ConfiguratorPreviewBridge && typeof window.ConfiguratorPreviewBridge.isFixedPageFileName === "function") {
      return window.ConfiguratorPreviewBridge.isFixedPageFileName(fileName);
    }
    var normalized = String(fileName || "").toLowerCase();
    return normalized === "privacy.html" || normalized === "contact.html";
  }

  function buildExternalFilePreviewMarkup(fileHref) {
    return "<div class=\"preview-iframe-shell\"><iframe src=\"" + escapeAttr(fileHref) + "\" title=\"External page preview\" loading=\"lazy\"></iframe></div>";
  }

  function buildPrivacyRootStyle(config) {
    var display = (config && config.display) || {};
    var privacy = (config && config.privacy) || {};
    var bgColor = normalizeHex(privacy.bgColor, "#f8fbfa");
    var textColor = normalizeHex(privacy.textColor, "#18322b");
    var mutedColor = normalizeHex(privacy.mutedColor, "#5a736c");
    var lineColor = normalizeHex(privacy.lineColor, "#dce6e1");
    var accentColor = normalizeHex(privacy.accentColor, "#0f786b");
    var cardColor = normalizeHex(privacy.cardColor, "#ffffff");
    var tabTextColor = normalizeHex(display.tabTextColor, textColor);
    var tabBgColor = normalizeHex(display.tabBgColor, "#ffffff");
    var topBandHeight = clamp(parseInt(privacy.topBandHeight, 10) || 76, 48, 120);
    var heroTopPadding = clamp(parseInt(privacy.heroTopPadding, 10) || 50, 24, 96);
    var cardPadding = clamp(parseInt(privacy.cardPadding, 10) || 26, 16, 40);
    var layoutGap = clamp(parseInt(privacy.layoutGap, 10) || 26, 12, 40);

    return [
      "--privacy-bg-color:" + escapeAttr(bgColor),
      "--privacy-text-color:" + escapeAttr(textColor),
      "--privacy-muted-color:" + escapeAttr(mutedColor),
      "--privacy-line-color:" + escapeAttr(lineColor),
      "--privacy-accent-color:" + escapeAttr(accentColor),
      "--privacy-card-color:" + escapeAttr(cardColor),
      "--privacy-tab-text-color:" + escapeAttr(tabTextColor),
      "--privacy-tab-bg-color:" + escapeAttr(tabBgColor),
      "--privacy-top-band-height:" + topBandHeight + "px",
      "--privacy-mobile-top-band-height:" + Math.max(42, topBandHeight - 12) + "px",
      "--privacy-hero-top-padding:" + heroTopPadding + "px",
      "--privacy-card-padding:" + cardPadding + "px",
      "--privacy-mobile-card-padding:" + Math.max(14, cardPadding - 4) + "px",
      "--privacy-layout-gap:" + layoutGap + "px"
    ].join(";");
  }

  function buildContactRootStyle(config) {
    var theme = (config && config.theme) || {};
    var display = (config && config.display) || {};
    var privacy = (config && config.privacy) || {};
    var bg = normalizeHex(privacy.bgColor, normalizeHex(theme.bgColor, "#f8fbfa"));
    var text = normalizeHex(privacy.textColor, "#18322b");
    var muted = normalizeHex(privacy.mutedColor, "#5a736c");
    var accent = normalizeHex(privacy.accentColor, "#0f786b");
    var surface = normalizeHex(privacy.cardColor, "#ffffff");
    var line = normalizeHex(privacy.lineColor, "#dce6e1");
    var tabText = normalizeHex(display.tabTextColor, normalizeHex(theme.textColor, "#18322b"));
    var tabBg = normalizeHex(display.tabBgColor, normalizeHex(theme.surfaceColor, "#ffffff"));

    return [
      "--contact-bg-color:" + escapeAttr(bg),
      "--contact-text-color:" + escapeAttr(text),
      "--contact-muted-color:" + escapeAttr(muted),
      "--contact-accent-color:" + escapeAttr(accent),
      "--contact-surface-color:" + escapeAttr(surface),
      "--contact-line-color:" + escapeAttr(line),
      "--contact-tab-text-color:" + escapeAttr(tabText),
      "--contact-tab-bg-color:" + escapeAttr(tabBg)
    ].join(";");
  }

  function buildPrivacyPolicyPageHtml(config) {
    var privacyTitle = String((config && config.privacy && config.privacy.title) || "Privacy Policy");
    return [
      "<!doctype html>",
      "<html lang=\"en\">",
      "<head>",
      "  <meta charset=\"utf-8\">",
      "  <meta name=\"viewport\" content=\"width=device-width,initial-scale=1\">",
      "  <title>" + escapeHtml(privacyTitle) + " - " + escapeHtml(config.brand && config.brand.name ? config.brand.name : "VinATech") + "</title>",
      "  <link rel=\"stylesheet\" href=\"css/components/nav.css\">",
      "  <link rel=\"stylesheet\" href=\"css/components/hamburger.css\">",
      "  <link rel=\"stylesheet\" href=\"css/pages/privacy.css\">",
      "</head>",
      "<body>",
      buildPrivacyPolicyPageMarkup(config, false),
      "<script src=\"js/pages/privacy.runtime.js\"></script>",
      "</body>",
      "</html>"
    ].join("\n");
  }

  function buildPrivacyPolicyPageMarkup(config, previewMode) {
    var brandName = String((config && config.brand && config.brand.name) || "VINATECH");
    var privacy = (config && config.privacy) || {};
    var title = String(privacy.title || "Privacy Policy");
    var intro = String(privacy.intro || "");
    var scopeText = String(privacy.scopeText || "");
    var dataText = String(privacy.dataText || "");
    var noCookiesText = String(privacy.noCookiesText || "");
    var noMarketingText = String(privacy.noMarketingText || "");
    var howUseText = String(privacy.howUseText || "");
    var enforcementText = String(privacy.enforcementText || "");
    var navLinks = (config && Array.isArray(config.tabs) ? config.tabs : [])
      .slice(0, 4)
      .map(function (tab) {
        var href = normalizePageHref(tab.pageHref) || "#";
        var isPrivacy = /privacy/i.test(String(tab.sectionTitle || tab.label || "")) || /privacy\.html/i.test(href);
        var attrs = previewMode ? " target=\"_blank\" rel=\"noreferrer\"" : "";
        return "<a href=\"" + escapeAttr(href) + "\"" + attrs + (isPrivacy ? " class=\"current\"" : "") + ">" + escapeHtml(String(tab.label || "Page")) + "</a>";
      })
      .join("");

    if (!navLinks) {
      navLinks = "<a href=\"index.html\">HOME</a><a href=\"privacy.html\" class=\"current\">PRIVACY POLICY</a>";
    }

    var topNavClass = privacy.topTabsTransparent ? "top-nav transparent-tabs" : "top-nav";

    return [
      "<div class=\"privacy-root\" style=\"" + buildPrivacyRootStyle(config) + "\">",
      "<header class=\"top-band\"><div class=\"top-band-inner\"><div class=\"brand\">" + escapeHtml(brandName) + " Limited</div><button class=\"hamburger\" id=\"privacyMenuToggle\" type=\"button\" aria-label=\"Toggle navigation\" aria-expanded=\"false\" aria-controls=\"topNav\"><span class=\"bar\"></span></button><nav class=\"" + topNavClass + "\" id=\"topNav\">" + navLinks + "</nav></div></header>",
      "<main class=\"main-wrap\">",
      "<section class=\"hero\"><p class=\"eyebrow\">Privacy And Data Protection</p><h1>" + escapeHtml(title) + "</h1><p>" + escapeHtml(intro) + "</p></section>",
      "<section class=\"policy-grid\">",
      "<article class=\"policy-card\"><h2>1. Scope And Principles</h2><p>" + escapeHtml(scopeText) + "</p><p>We align our practices with key privacy principles reflected in UK GDPR and the Data Protection Act 2018, including purpose limitation, data minimization, accuracy, storage limitation, and confidentiality.</p></article>",
      "<article class=\"policy-card\"><h2>2. Data We Process</h2><p>Depending on your interaction with us, we may process:</p><ul><li>Identity and contact details you submit (for example name, business email, role, company).</li><li>Service-related communications and support records.</li><li>Technical event logs required for security, fault analysis, and service continuity.</li></ul><h3>No Cookies Collected</h3><p>" + escapeHtml(noCookiesText) + "</p><h3>No Marketing Profiling</h3><p>" + escapeHtml(noMarketingText) + "</p></article>",
      "<article class=\"policy-card policy-card-wide\"><h2>3. How We Use Information</h2><ul>" + privacyListItemsMarkup(howUseText) + "</ul></article>",
      "<article class=\"policy-card policy-card-wide\"><h2>4. Enforcement And Data Protection Controls</h2><p>" + escapeHtml(enforcementText) + "</p><ul><li>Periodic policy reviews and internal audits of data processing activities.</li><li>Role-based access controls and least-privilege data access.</li><li>Documented incident response and escalation procedures.</li><li>Corrective action workflow for potential policy breaches, including remediation and recordkeeping.</li><li>Cooperation with supervisory or competent authorities where legally required.</li></ul><div class=\"policy-note\">If you believe your data has been handled in a way that is inconsistent with this policy, contact VINATECH Limited using the support channels listed on this website and we will investigate promptly.</div></article>",
      "<article class=\"policy-card\"><h2>5. Your Rights</h2><p>Subject to applicable law, you may request access to personal data, correction of inaccurate data, restriction of processing, erasure where lawful, and information about how your data is used.</p><p>Requests are reviewed with attention to legal obligations, security requirements, and any applicable exemptions.</p></article>",
      "<article class=\"policy-card\"><h2>6. Retention, Security, And Updates</h2><p>We retain personal information only for as long as required by legitimate business purposes or legal obligations. Appropriate technical and organizational safeguards are applied to protect confidentiality and integrity.</p><p>This policy may be updated from time to time. Material changes will be published on this page.</p><p><strong>Last updated:</strong> 13 June 2026</p></article>",
      "<article class=\"policy-card policy-card-wide\"><h2>Your Agreement</h2><p>By submitting data to us and using the website, you agree to our use of your data and of anyone you represent in the manner set out in this Privacy Policy (as amended from time to time, as described above) and you are responsible for ensuring that you have authority to do this on behalf of anyone about whom you submit data to us.</p></article>",
      "</section>",
      "</main>",
      "<footer class=\"footer\"><div class=\"footer-band\"><div class=\"footer-inner\">&copy; " + escapeHtml(brandName.toUpperCase()) + " 2026. All rights reserved.</div></div></footer>",
      "</div>"
    ].join("");
  }

  function buildContactPageHtml(config) {
    var contactTitle = String((config && config.contact && config.contact.title) || "Contact VINATECH Limited");
    return [
      "<!doctype html>",
      "<html lang=\"en\">",
      "<head>",
      "  <meta charset=\"utf-8\">",
      "  <meta name=\"viewport\" content=\"width=device-width,initial-scale=1\">",
      "  <title>" + escapeHtml(contactTitle) + " - " + escapeHtml(config.brand && config.brand.name ? config.brand.name : "VinATech") + "</title>",
      "  <link rel=\"stylesheet\" href=\"css/pages/contact.css\">",
      "</head>",
      "<body>",
      buildContactPageMarkup(config, false),
      "<script src=\"js/pages/contact.runtime.js\"></script>",
      "</body>",
      "</html>"
    ].join("\n");
  }

  function buildContactPageMarkup(config, previewMode) {
    var brandName = String((config && config.brand && config.brand.name) || "VINATECH");
    var contact = (config && config.contact) || {};
    var title = String(contact.title || "Contact VINATECH Limited");
    var intro = String(contact.intro || "Tell us about your project needs and our team will respond promptly.");
    var submitLabel = String(contact.submitLabel || "Submit");
    var subjectPrefix = String(contact.emailSubject || "Website Contact Request");
    var formEndpoint = String(contact.formEndpoint || "").trim();
    var navClass = contact.topTabsTransparent ? "contact-nav transparent-tabs" : "contact-nav";
    var fields = normalizeContactFields(contact.fields);
    var navAttrs = previewMode ? " target=\"_blank\" rel=\"noreferrer\"" : "";

    return [
      "<div class=\"contact-root\" style=\"" + buildContactRootStyle(config) + "\">",
      "<header class=\"contact-header\"><div class=\"contact-header-inner\"><div class=\"brand\">" + escapeHtml(brandName) + " Limited</div><button class=\"hamburger\" id=\"contactMenuToggle\" type=\"button\" aria-label=\"Toggle navigation\" aria-expanded=\"false\" aria-controls=\"contactNav\"><span class=\"bar\"></span></button><nav class=\"" + navClass + "\" id=\"contactNav\"><a href=\"index.html\"" + navAttrs + ">HOME</a><a href=\"news.html\"" + navAttrs + ">NEWS</a><a href=\"contact.html\" class=\"current\"" + navAttrs + ">CONTACT</a><a href=\"privacy.html\"" + navAttrs + ">PRIVACY POLICY</a></nav></div></header>",
      "<main class=\"contact-main\"><section class=\"contact-hero\"><p class=\"eyebrow\">Get In Touch</p><h1>" + escapeHtml(title) + "</h1><p>" + escapeHtml(intro) + "</p></section>",
      "<section class=\"contact-card\"><form id=\"contactForm\" action=\"" + escapeAttr(formEndpoint) + "\" method=\"POST\" data-subject-prefix=\"" + escapeAttr(subjectPrefix) + "\"><input type=\"hidden\" name=\"_subject\" value=\"" + escapeAttr(subjectPrefix + " - Website") + "\"><input type=\"text\" name=\"_gotcha\" style=\"display:none\" tabindex=\"-1\" autocomplete=\"off\">" + contactFieldsMarkup(fields) + "<button type=\"submit\">" + escapeHtml(submitLabel) + "</button></form><p class=\"contact-note\">" + escapeHtml(formEndpoint ? "Submitting sends your message securely via Formspree." : "Add a Formspree endpoint to enable submit.") + "</p></section></main>",
      "<footer class=\"contact-footer\">&copy; " + escapeHtml(brandName.toUpperCase()) + " 2026. All rights reserved.</footer>",
      "</div>"
    ].join("");
  }

  function contactFieldsMarkup(fields) {
    return fields.map(function (field) {
      var type = normalizeContactFieldType(field.type);
      var requiredAttr = field.required ? " required" : "";
      var placeholderAttr = field.placeholder ? " placeholder=\"" + escapeAttr(field.placeholder) + "\"" : "";
      if (type === "checkbox") {
        return "<label class=\"consent\"><input type=\"checkbox\" name=\"" + escapeAttr(field.label) + "\"" + requiredAttr + "><span>" + escapeHtml(field.label) + " <a href=\"privacy.html\">Privacy Policy</a> of VINATECH Limited.</span></label>";
      }
      if (type === "textarea") {
        return "<div class=\"field-row full\"><label>" + escapeHtml(field.label) + "<textarea name=\"" + escapeAttr(field.label) + "\"" + placeholderAttr + requiredAttr + "></textarea></label></div>";
      }
      var inputType = type === "email" ? "email" : "text";
      return "<div class=\"field-row\"><label>" + escapeHtml(field.label) + "<input type=\"" + inputType + "\" name=\"" + escapeAttr(field.label) + "\"" + placeholderAttr + requiredAttr + "></label></div>";
    }).join("");
  }

  function privacyListItemsMarkup(text) {
    var fallback = [
      "To respond to enquiries and deliver requested services.",
      "To provide support and maintain platform reliability.",
      "To secure systems and investigate misuse or abuse.",
      "To comply with regulatory, contractual, and legal duties."
    ];
    var rows = String(text || "")
      .split(/\r?\n/)
      .map(function (line) {
        return String(line || "").replace(/^[-*\u2022]\s*/, "").trim();
      })
      .filter(function (line) {
        return line.length > 0;
      });
    var items = rows.length ? rows : fallback;
    return items.map(function (line) {
      return "<li>" + escapeHtml(line) + "</li>";
    }).join("");
  }

  async function resolveProjectDirectoryHandle() {
    if (rememberedProjectDirectory) {
      return rememberedProjectDirectory;
    }

    if (!window.isSecureContext) {
      setStatus("Debug resolve-folder: folder picker is unavailable in insecure context. Open configurator via https:// or http://localhost (not file://).", true);
      return null;
    }

    if (window.top !== window.self) {
      setStatus("Debug resolve-folder: folder picker is blocked inside embedded frames. Open configurator in a top-level browser tab.", true);
      return null;
    }

    var projectDirectory = null;
    try {
      projectDirectory = await window.showDirectoryPicker({ mode: "readwrite" });
    } catch (pickerError) {
      if (pickerError && pickerError.name === "AbortError") {
        setStatus("Debug resolve-folder: folder picker was canceled or blocked before selection. If no picker appeared, run configurator in a top-level tab on http://localhost and try again.", true);
        return null;
      }
      throw pickerError;
    }

    if (!projectDirectory) {
      setStatus("Debug resolve-folder: folder picker returned an empty handle.", true);
      return null;
    }

    var selectedName = String(projectDirectory.name || "").trim() || "(unknown)";
    if (String(projectDirectory.name || "").toLowerCase() === "images") {
      setStatus("Select the project root folder (the folder containing index.html), not images/.", true);
      return null;
    }

    var looksLikeProjectRoot = await verifyProjectRootDirectory(projectDirectory);
    if (!looksLikeProjectRoot) {
      setStatus("Selected folder '" + selectedName + "' is not your site root. Debug resolve-folder: required files index.html and configurator.html were not found there.", true);
      return null;
    }

    rememberedProjectDirectory = projectDirectory;
    await saveRememberedProjectDirectory(projectDirectory);
    return rememberedProjectDirectory;
  }

  async function openFsHandleDb() {
    if (typeof indexedDB === "undefined") {
      return null;
    }

    return new Promise(function (resolve) {
      try {
        var request = indexedDB.open(FS_HANDLE_DB_NAME, 1);
        request.onupgradeneeded = function () {
          var db = request.result;
          if (!db.objectStoreNames.contains(FS_HANDLE_STORE_NAME)) {
            db.createObjectStore(FS_HANDLE_STORE_NAME);
          }
        };
        request.onsuccess = function () {
          resolve(request.result);
        };
        request.onerror = function () {
          resolve(null);
        };
      } catch (_error) {
        resolve(null);
      }
    });
  }

  async function saveRememberedProjectDirectory(handle) {
    var db = await openFsHandleDb();
    if (!db || !handle) {
      return;
    }

    await new Promise(function (resolve) {
      try {
        var tx = db.transaction(FS_HANDLE_STORE_NAME, "readwrite");
        tx.objectStore(FS_HANDLE_STORE_NAME).put(handle, FS_HANDLE_KEY);
        tx.oncomplete = function () { resolve(); };
        tx.onerror = function () { resolve(); };
      } catch (_error) {
        resolve();
      }
    });
    db.close();
  }

  async function loadRememberedProjectDirectory() {
    var db = await openFsHandleDb();
    if (!db) {
      return null;
    }

    var handle = await new Promise(function (resolve) {
      try {
        var tx = db.transaction(FS_HANDLE_STORE_NAME, "readonly");
        var request = tx.objectStore(FS_HANDLE_STORE_NAME).get(FS_HANDLE_KEY);
        request.onsuccess = function () {
          resolve(request.result || null);
        };
        request.onerror = function () {
          resolve(null);
        };
      } catch (_error) {
        resolve(null);
      }
    });
    db.close();

    if (!handle || typeof handle.getFileHandle !== "function") {
      return null;
    }

    var looksLikeRoot = await verifyProjectRootDirectory(handle);
    if (!looksLikeRoot) {
      return null;
    }
    return handle;
  }

  async function clearRememberedProjectDirectory() {
    var db = await openFsHandleDb();
    if (!db) {
      return;
    }

    await new Promise(function (resolve) {
      try {
        var tx = db.transaction(FS_HANDLE_STORE_NAME, "readwrite");
        tx.objectStore(FS_HANDLE_STORE_NAME).delete(FS_HANDLE_KEY);
        tx.oncomplete = function () { resolve(); };
        tx.onerror = function () { resolve(); };
      } catch (_error) {
        resolve();
      }
    });
    db.close();
  }

  async function ensureDirectoryReadWritePermission(directoryHandle) {
    if (!directoryHandle) {
      return false;
    }

    // Some browser contexts expose directory handles but do not expose permission APIs.
    // In that case, trust the remembered handle and attempt the write directly.
    if (typeof directoryHandle.queryPermission !== "function") {
      return true;
    }

    try {
      var options = { mode: "readwrite" };
      var state = await directoryHandle.queryPermission(options);
      if (state === "granted") {
        return true;
      }
      if (state === "prompt") {
        state = await directoryHandle.requestPermission(options);
        return state === "granted";
      }
      return false;
    } catch (_error) {
      return false;
    }
  }

  async function verifyProjectRootDirectory(projectDirectory) {
    try {
      await projectDirectory.getFileHandle("index.html");
      await projectDirectory.getFileHandle("configurator.html");
      return true;
    } catch (_error) {
      return false;
    }
  }

  async function persistPublishAssets(assets, projectDirectory) {
    if (!assets || !assets.length) {
      return { mode: "none", count: 0 };
    }

    if (projectDirectory) {
      var imagesDirectory = projectDirectory;
      if (String(projectDirectory.name || "").toLowerCase() !== "images") {
        imagesDirectory = await projectDirectory.getDirectoryHandle("images", { create: true });
      }

      for (var index = 0; index < assets.length; index += 1) {
        var asset = assets[index];
        var blob = dataUrlToBlob(asset.dataUrl);
        var fileHandle = await imagesDirectory.getFileHandle(asset.fileName, { create: true });
        var writable = await fileHandle.createWritable();
        await writable.write(blob);
        await writable.close();
        var writtenFile = await fileHandle.getFile();
        if (!writtenFile || writtenFile.size === 0) {
          throw new Error("Failed to verify written image file: " + asset.fileName);
        }
      }

      return { mode: "directory", count: assets.length };
    }

    assets.forEach(function (asset) {
      downloadBlob(dataUrlToBlob(asset.dataUrl), asset.fileName);
    });
    return { mode: "download", count: assets.length };
  }

  function assetStatusSuffix(result) {
    if (!result || !result.count) {
      return "";
    }
    if (result.mode === "directory") {
      return " Saved " + result.count + " image file(s) into images/.";
    }
    return " Downloaded " + result.count + " image file(s) because auto-copy to images/ was not permitted.";
  }

  function isDataUrl(value) {
    return /^data:/i.test(String(value || ""));
  }

  function inferFileName(dataUrl, fallbackPrefix) {
    var mimeMatch = String(dataUrl || "").match(/^data:([^;,]+)/i);
    var extension = "png";
    if (mimeMatch && mimeMatch[1]) {
      var mime = mimeMatch[1].toLowerCase();
      if (mime.indexOf("jpeg") >= 0 || mime.indexOf("jpg") >= 0) {
        extension = "jpg";
      } else if (mime.indexOf("webp") >= 0) {
        extension = "webp";
      } else if (mime.indexOf("gif") >= 0) {
        extension = "gif";
      } else if (mime.indexOf("svg") >= 0) {
        extension = "svg";
      }
    }
    return sanitizeFileName(fallbackPrefix + "." + extension);
  }

  function ensureUniqueFileName(fileName, usedNames) {
    var dotIndex = fileName.lastIndexOf(".");
    var base = dotIndex > 0 ? fileName.slice(0, dotIndex) : fileName;
    var ext = dotIndex > 0 ? fileName.slice(dotIndex) : "";
    var candidate = fileName;
    var counter = 2;
    while (usedNames[candidate]) {
      candidate = base + "-" + counter + ext;
      counter += 1;
    }
    usedNames[candidate] = true;
    return candidate;
  }

  function backfillMissingLogosFromPublishFallbacks(logos, fallbackHomeHtml) {
    var normalized = normalizeBrandLogos(logos);
    if (normalized[0].src && normalized[1].src) {
      return normalized;
    }

    var fallbackLogos = extractLogosFromHomeHtml(fallbackHomeHtml);
    if (fallbackLogos.length < 2) {
      var lastPublishedLogos = extractLogosFromLastPublishedHtml();
      fallbackLogos = fallbackLogos.concat(lastPublishedLogos.slice(fallbackLogos.length));
    }

    if (!fallbackLogos.length) {
      return normalized;
    }

    return normalized.map(function (logo, index) {
      if (logo.src || !fallbackLogos[index]) {
        return logo;
      }
      return Object.assign({}, logo, {
        src: fallbackLogos[index].src,
        fileName: logo.fileName || fallbackLogos[index].fileName
      });
    });
  }

  function extractLogosFromLastPublishedHtml() {
    try {
      var html = String(localStorage.getItem(LAST_PUBLISHED_KEY) || "");
      if (!html) {
        return [];
      }
      return extractLogosFromHomeHtml(html);
    } catch (_error) {
      return [];
    }
  }

  function extractLogosFromHomeHtml(html) {
    var source = String(html || "");
    if (!source) {
      return [];
    }

    var logoRegex = /<div class=\"logo-slot\"[^>]*>\s*<img[^>]*src=\"([^\"]+)\"[^>]*>/gi;
    var matches = [];
    var match;
    while ((match = logoRegex.exec(source)) && matches.length < 2) {
      var src = normalizeImageSrc(match[1]);
      if (!src) {
        continue;
      }
      matches.push({
        src: src,
        fileName: inferFileNameFromPath(src)
      });
    }
    return matches;
  }

  function inferFileNameFromPath(pathValue) {
    var value = String(pathValue || "").trim();
    if (!value) {
      return "";
    }
    var clean = value.split("?")[0].split("#")[0];
    var segments = clean.split("/");
    return sanitizeFileName(segments[segments.length - 1] || "");
  }

  function dragAttr(key, draggable) {
    if (!draggable) {
      return "";
    }
    return "data-drag-key=\"" + key + "\"";
  }

  function logoDragAttr(index, draggable) {
    if (!draggable) {
      return "";
    }
    return "data-drag-key=\"logo-" + index + "\"";
  }

  function transformAttr(position) {
    return "style=\"transform:translate(" + position.x + "px," + position.y + "px);\"";
  }

  function logoStyleAttr(logo) {
    return "style=\"width:" + logo.size + "px;height:" + logo.size + "px;opacity:" + transparencyToOpacity(logo.transparency) + ";transform:" + logoTransform(logo) + ";\"";
  }

  function logoTransform(logo) {
    return "translate(" + logo.x + "px," + logo.y + "px) rotate(" + logo.rotation + "deg)";
  }

  function isLogoDragKey(dragKey) {
    return /^logo-\d+$/.test(dragKey);
  }

  function logoIndexFromDragKey(dragKey) {
    var index = parseInt(String(dragKey).replace("logo-", ""), 10);
    if (Number.isNaN(index)) {
      return 0;
    }
    return clamp(index, 0, 1);
  }

  function getDragPosition(dragKey) {
    var previewDevice = normalizePreviewDevice(state.display && state.display.previewDevice);
    if (previewDevice === "mobile") {
      if (dragKey === "nav") {
        return state.layout.mobileNav || { x: 0, y: 0 };
      }
      if (dragKey === "heroTitle") {
        return state.layout.mobileHeroTitle || { x: 0, y: 0 };
      }
      if (dragKey === "heroSubtitle") {
        return state.layout.mobileHeroSubtitle || { x: 0, y: 0 };
      }
      if (dragKey === "cta") {
        return state.layout.mobileCta || { x: 0, y: 0 };
      }
    }
    if (isLogoDragKey(dragKey)) {
      var logoIndex = logoIndexFromDragKey(dragKey);
      return {
        x: state.brand.logos[logoIndex].x,
        y: state.brand.logos[logoIndex].y
      };
    }
    if (!state.layout[dragKey]) {
      return null;
    }
    return {
      x: state.layout[dragKey].x,
      y: state.layout[dragKey].y
    };
  }

  function setDragPosition(dragKey, x, y) {
    var previewDevice = normalizePreviewDevice(state.display && state.display.previewDevice);
    if (previewDevice === "mobile") {
      if (dragKey === "nav") {
        state.layout.mobileNav.x = x;
        state.layout.mobileNav.y = y;
        return;
      }
      if (dragKey === "heroTitle") {
        state.layout.mobileHeroTitle.x = x;
        state.layout.mobileHeroTitle.y = y;
        return;
      }
      if (dragKey === "heroSubtitle") {
        state.layout.mobileHeroSubtitle.x = x;
        state.layout.mobileHeroSubtitle.y = y;
        return;
      }
      if (dragKey === "cta") {
        state.layout.mobileCta.x = x;
        state.layout.mobileCta.y = y;
        return;
      }
    }
    if (isLogoDragKey(dragKey)) {
      var logoIndex = logoIndexFromDragKey(dragKey);
      state.brand.logos[logoIndex].x = x;
      state.brand.logos[logoIndex].y = y;
      return;
    }
    if (state.layout[dragKey]) {
      state.layout[dragKey].x = x;
      state.layout[dragKey].y = y;
    }
  }

  function dragLabel(dragKey) {
    if (dragKey === "logo-0") {
      return "logo 1";
    }
    if (dragKey === "logo-1") {
      return "logo 2";
    }
    return dragKey;
  }

  function setStatus(message, isError) {
    dom.statusMessage.textContent = message;
    dom.statusMessage.style.color = isError ? "#8a211a" : "#2f6256";
  }

  function sanitizeState() {
    state.brand.name = String(state.brand.name || "VinATech").trim();
    state.brand.logoSrc = normalizeImageSrc(state.brand.logoSrc);
    state.brand.logoFileName = sanitizeFileName(state.brand.logoFileName);
    state.brand.logos = normalizeBrandLogos(state.brand.logos, {
      src: state.brand.logoSrc,
      fileName: state.brand.logoFileName,
      x: state.layout && state.layout.logo ? state.layout.logo.x : 0,
      y: state.layout && state.layout.logo ? state.layout.logo.y : 0
    });
    state.brand.logoSrc = state.brand.logos[0].src;
    state.brand.logoFileName = state.brand.logos[0].fileName;
    state.hero.title = String(state.hero.title || "");
    state.hero.subtitle = String(state.hero.subtitle || "");
    state.hero.titleFontFamily = normalizeFontFamily(state.hero.titleFontFamily);
    state.hero.subtitleFontFamily = normalizeFontFamily(state.hero.subtitleFontFamily);
    state.hero.titleAlign = normalizeTextAlign(state.hero.titleAlign);
    state.hero.subtitleAlign = normalizeTextAlign(state.hero.subtitleAlign);
    state.hero.titleColor = normalizeHex(state.hero.titleColor, state.theme.textColor);
    state.hero.subtitleColor = normalizeHex(state.hero.subtitleColor, state.theme.mutedColor);

    if (!Array.isArray(state.hero.buttons) || !state.hero.buttons.length) {
      var legacyLabel = String(state.hero.ctaLabel || "Button 1");
      var legacyHref = String(state.hero.ctaHref || "products.html");
      state.hero.buttons = [{
        label: legacyLabel,
        href: legacyHref
      }, {
        label: "Button 2",
        href: "news.html"
      }, {
        label: "Button 3",
        href: "privacy.html"
      }, {
        label: "Button 4",
        href: "contact.html"
      }];
    }

    state.hero.buttons = state.hero.buttons
      .map(function (button, index) {
        return {
          label: String(button.label || ("Button " + (index + 1))).trim(),
          href: String(button.href || "#").trim() || "#"
        };
      })
      .filter(function (button) {
        return button.label.length > 0;
      });

    var defaultButtonSeeds = [
      { label: "Button 1", href: "products.html" },
      { label: "Button 2", href: "news.html" },
      { label: "Button 3", href: "privacy.html" },
      { label: "Button 4", href: "contact.html" }
    ];
    while (state.hero.buttons.length < 4) {
      var seed = defaultButtonSeeds[state.hero.buttons.length] || {
        label: "Button " + (state.hero.buttons.length + 1),
        href: "#"
      };
      state.hero.buttons.push({
        label: seed.label,
        href: seed.href
      });
    }

    if (!state.hero.buttons.length) {
      state.hero.buttons = [{
        label: "Button 1",
        href: "products.html"
      }, {
        label: "Button 2",
        href: "news.html"
      }, {
        label: "Button 3",
        href: "privacy.html"
      }, {
        label: "Button 4",
        href: "contact.html"
      }];
    }

    state.theme.headingSize = clamp(parseInt(state.theme.headingSize, 10) || 64, 32, 120);
    state.theme.bodySize = clamp(parseInt(state.theme.bodySize, 10) || 18, 12, 32);
    state.theme.buttonTextSize = clamp(parseInt(state.theme.buttonTextSize, 10) || 16, 12, 32);

    state.theme.bgColor = normalizeHex(state.theme.bgColor, "#f2f7f3");
    state.theme.textColor = normalizeHex(state.theme.textColor, "#102822");
    state.theme.accentColor = normalizeHex(state.theme.accentColor, "#0f7b6c");
    state.theme.mutedColor = normalizeHex(state.theme.mutedColor, "#4f6962");
    state.theme.surfaceColor = normalizeHex(state.theme.surfaceColor, "#e5f0ea");
    state.theme.buttonTextColor = normalizeHex(state.theme.buttonTextColor, "#ffffff");

    // Mobile theme defaults
    state.theme.mobileHeadingSize = clamp(parseInt(state.theme.mobileHeadingSize, 10) || state.theme.headingSize || 48, 20, 160);
    state.theme.mobileBodySize = clamp(parseInt(state.theme.mobileBodySize, 10) || state.theme.bodySize || 16, 10, 72);

    state.layout = state.layout || {};
    var hasHeroTitleLayout = !!state.layout.heroTitle;
    var hasHeroSubtitleLayout = !!state.layout.heroSubtitle;
    var legacyHeroLayout = state.layout.hero || { x: 0, y: 0 };
    ["logo", "nav", "hero", "heroTitle", "heroSubtitle", "cta", "mobileNav", "mobileHeroTitle", "mobileHeroSubtitle", "mobileCta"].forEach(function (key) {
      state.layout[key] = state.layout[key] || { x: 0, y: 0 };
      state.layout[key].x = parseInt(state.layout[key].x, 10) || 0;
      state.layout[key].y = parseInt(state.layout[key].y, 10) || 0;
    });
    if (!hasHeroTitleLayout) {
      state.layout.heroTitle = {
        x: parseInt(legacyHeroLayout.x, 10) || 0,
        y: parseInt(legacyHeroLayout.y, 10) || 0
      };
    }
    if (!hasHeroSubtitleLayout) {
      state.layout.heroSubtitle = {
        x: parseInt(legacyHeroLayout.x, 10) || 0,
        y: (parseInt(legacyHeroLayout.y, 10) || 0) + 86
      };
    }

    state.display = state.display || {};
    state.display.pageMode = normalizePageMode(state.display.pageMode);
    state.display.tabMode = normalizeTabMode(state.display.tabMode);
    state.display.topTabsTransparent = !!state.display.topTabsTransparent;
    state.display.tabTextColor = normalizeHex(state.display.tabTextColor, state.theme.textColor);
    state.display.tabBgColor = normalizeHex(state.display.tabBgColor, state.theme.surfaceColor);
    state.display.ctaTextOnly = !!state.display.ctaTextOnly;
    // Mobile display flags
    state.display.mobileOverrides = !!state.display.mobileOverrides;
    if (typeof state.display.mobileHeroCenter === "undefined" || state.display.mobileHeroCenter === null) {
      state.display.mobileHeroCenter = true;
    } else {
      state.display.mobileHeroCenter = !!state.display.mobileHeroCenter;
    }
    state.display.previewDevice = normalizePreviewDevice(state.display.previewDevice);
    state.display.previewPage = normalizePreviewPageValue(state.display.previewPage, state);

    state.privacy = state.privacy || {};
    state.privacy.title = String(state.privacy.title || "Privacy Policy");
    state.privacy.intro = String(state.privacy.intro || "");
    state.privacy.scopeText = String(state.privacy.scopeText || "");
    state.privacy.dataText = String(state.privacy.dataText || "");
    state.privacy.noCookiesText = String(state.privacy.noCookiesText || "");
    state.privacy.noMarketingText = String(state.privacy.noMarketingText || "");
    state.privacy.howUseText = String(state.privacy.howUseText || "");
    state.privacy.enforcementText = String(state.privacy.enforcementText || "");
    state.privacy.bgColor = normalizeHex(state.privacy.bgColor, "#f8fbfa");
    state.privacy.textColor = normalizeHex(state.privacy.textColor, "#18322b");
    state.privacy.topTabsTransparent = !!state.privacy.topTabsTransparent;
    state.privacy.tabTextColor = normalizeHex(state.display.tabTextColor, state.theme.textColor);
    state.privacy.tabBgColor = normalizeHex(state.display.tabBgColor, state.theme.surfaceColor);
    state.privacy.mutedColor = normalizeHex(state.privacy.mutedColor, "#5a736c");
    state.privacy.lineColor = normalizeHex(state.privacy.lineColor, "#dce6e1");
    state.privacy.accentColor = normalizeHex(state.privacy.accentColor, "#0f786b");
    state.privacy.cardColor = normalizeHex(state.privacy.cardColor, "#ffffff");
    state.privacy.topBandHeight = clamp(parseInt(state.privacy.topBandHeight, 10) || 76, 48, 120);
    state.privacy.heroTopPadding = clamp(parseInt(state.privacy.heroTopPadding, 10) || 50, 24, 96);
    state.privacy.cardPadding = clamp(parseInt(state.privacy.cardPadding, 10) || 26, 16, 40);
    state.privacy.layoutGap = clamp(parseInt(state.privacy.layoutGap, 10) || 26, 12, 40);

    state.contact = state.contact || {};
    state.contact.title = String(state.contact.title || "Contact VINATECH Limited");
    state.contact.intro = String(state.contact.intro || "Tell us about your project needs and our team will respond promptly.");
    state.contact.submitLabel = String(state.contact.submitLabel || "Submit");
    state.contact.emailSubject = String(state.contact.emailSubject || "Website Contact Request");
    state.contact.topTabsTransparent = !!state.contact.topTabsTransparent;
    state.contact.formEndpoint = String(state.contact.formEndpoint || "https://formspree.io/f/mrevdeyn").trim();
    state.contact.fields = normalizeContactFields(state.contact.fields);

    var backgroundX = parseInt(state.background.x, 10);
    var backgroundY = parseInt(state.background.y, 10);
    var backgroundTransparency = parseInt(state.background.transparency, 10);
    if (Number.isNaN(backgroundX)) {
      backgroundX = 52;
    }
    if (Number.isNaN(backgroundY)) {
      backgroundY = 20;
    }
    if (Number.isNaN(backgroundTransparency)) {
      backgroundTransparency = 32;
    }
    state.background.x = clamp(backgroundX, 0, 100);
    state.background.y = clamp(backgroundY, 0, 100);
    state.background.transparency = clamp(backgroundTransparency, 0, 95);
    state.background.src = normalizeImageSrc(state.background.src);
    state.background.fileName = sanitizeFileName(state.background.fileName);

    state.tabs = state.tabs
      .map(function (tab, index) {
        var label = String(tab.label || "Tab " + (index + 1));
        var labelLower = label.trim().toLowerCase();
        var sectionId = slugify(String(tab.sectionId || label || "section"));
        var sectionTitle = String(tab.sectionTitle || label);
        var sectionTitleLower = sectionTitle.trim().toLowerCase();
        var normalizedPageHref = normalizePageHref(tab.pageHref);
        if (labelLower.indexOf("contact") >= 0 || sectionTitleLower.indexOf("contact") >= 0) {
          normalizedPageHref = "contact.html";
        } else if (labelLower.indexOf("privacy") >= 0 || sectionTitleLower.indexOf("privacy") >= 0) {
          normalizedPageHref = "privacy.html";
        }
        return {
          label: label,
          sectionId: sectionId || uniqueSectionId("section"),
          pageHref: normalizedPageHref,
          sectionTitle: sectionTitle,
          sectionText: String(tab.sectionText || "Add section content here."),
          sectionFontFamily: normalizeFontFamily(tab.sectionFontFamily),
          sectionTitleColor: normalizeHex(tab.sectionTitleColor, state.theme.textColor),
          sectionTextColor: normalizeHex(tab.sectionTextColor, state.theme.mutedColor),
          sectionBackgroundColor: normalizeHex(tab.sectionBackgroundColor, state.theme.surfaceColor),
          navFontFamily: normalizeFontFamily(tab.navFontFamily),
          navTextColor: normalizeHex(state.display.tabTextColor, state.theme.textColor),
          navBackgroundColor: normalizeHex(state.display.tabBgColor, state.theme.surfaceColor),
          sectionBackgroundSrc: normalizeImageSrc(tab.sectionBackgroundSrc),
          sectionBackgroundFileName: sanitizeFileName(tab.sectionBackgroundFileName),
          sectionBackgroundTransparency: normalizeTabImageTransparency(tab.sectionBackgroundTransparency, 36),
          galleryLayout: normalizeGalleryLayout(tab.galleryLayout),
          galleryImageTransparency: normalizeTabImageTransparency(tab.galleryImageTransparency, 0),
          galleryImages: normalizeGalleryImages(tab.galleryImages)
        };
      })
      .filter(function (tab) {
        return tab.label.trim().length > 0;
      });

    dedupeSectionIds();
  }

  function dedupeSectionIds() {
    var seen = {};
    state.tabs.forEach(function (tab) {
      var base = tab.sectionId;
      var unique = base;
      var offset = 2;
      while (seen[unique]) {
        unique = base + "-" + offset;
        offset += 1;
      }
      seen[unique] = true;
      tab.sectionId = unique;
    });
  }

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function loadState() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      var repoDraft = getRepoDraft();

      if (raw) {
        var parsed = JSON.parse(raw);
        if (repoDraft && shouldPreferRepoDraft(parsed, repoDraft)) {
          return mergeConfig(defaultConfig, repoDraft);
        }
        return mergeConfig(defaultConfig, parsed);
      }

      if (repoDraft) {
        return mergeConfig(defaultConfig, repoDraft);
      }

      return deepClone(defaultConfig);
    } catch (_error) {
      return deepClone(defaultConfig);
    }
  }

  function shouldPreferRepoDraft(localCandidate, repoCandidate) {
    if (window.ConfiguratorDraftBridge && typeof window.ConfiguratorDraftBridge.shouldPreferRepoDraft === "function") {
      return window.ConfiguratorDraftBridge.shouldPreferRepoDraft(localCandidate, repoCandidate);
    }
    var localBrand = (localCandidate && localCandidate.brand) || {};
    var repoBrand = (repoCandidate && repoCandidate.brand) || {};

    var localLogos = ensureTwoLogos(localBrand);
    var repoLogos = ensureTwoLogos(repoBrand);

    var localLogoCount = localLogos.filter(function (logo) {
      return !!normalizeImageSrc(logo.src);
    }).length;
    var repoLogoCount = repoLogos.filter(function (logo) {
      return !!normalizeImageSrc(logo.src);
    }).length;

    if (repoLogoCount > localLogoCount) {
      return true;
    }

    var localTabs = Array.isArray(localCandidate && localCandidate.tabs) ? localCandidate.tabs : [];
    var repoTabs = Array.isArray(repoCandidate && repoCandidate.tabs) ? repoCandidate.tabs : [];
    if (repoTabs.length > localTabs.length) {
      return true;
    }

    var localLabels = localTabs.map(function (tab) {
      return String((tab && tab.label) || "").trim().toLowerCase();
    });
    var repoLabels = repoTabs.map(function (tab) {
      return String((tab && tab.label) || "").trim().toLowerCase();
    });
    var expectedNav = ["home", "news", "privacy policy", "contact"];
    var localNavScore = expectedNav.filter(function (label) {
      return localLabels.indexOf(label) >= 0;
    }).length;
    var repoNavScore = expectedNav.filter(function (label) {
      return repoLabels.indexOf(label) >= 0;
    }).length;

    return repoNavScore > localNavScore;
  }

  function mergeConfig(base, incoming) {
    var merged = deepClone(base);

    if (!incoming || typeof incoming !== "object") {
      return merged;
    }

    merged.brand = Object.assign({}, merged.brand, incoming.brand || {});
    merged.brand.logos = normalizeBrandLogos(merged.brand.logos, {
      src: merged.brand.logoSrc,
      fileName: merged.brand.logoFileName,
      x: incoming.layout && incoming.layout.logo ? incoming.layout.logo.x : 0,
      y: incoming.layout && incoming.layout.logo ? incoming.layout.logo.y : 0
    });
    merged.hero = Object.assign({}, merged.hero, incoming.hero || {});
    merged.theme = Object.assign({}, merged.theme, incoming.theme || {});
    merged.background = Object.assign({}, merged.background, incoming.background || {});
    merged.display = Object.assign({}, merged.display, incoming.display || {});
    merged.privacy = Object.assign({}, merged.privacy, incoming.privacy || {});
    merged.contact = Object.assign({}, merged.contact, incoming.contact || {});

    var incomingLayout = incoming.layout || {};
    merged.layout = {
      logo: Object.assign({}, merged.layout.logo, incomingLayout.logo || {}),
      nav: Object.assign({}, merged.layout.nav, incomingLayout.nav || {}),
      hero: Object.assign({}, merged.layout.hero, incomingLayout.hero || {}),
      heroTitle: Object.assign({}, merged.layout.heroTitle, incomingLayout.heroTitle || incomingLayout.hero || {}),
      heroSubtitle: Object.assign({}, merged.layout.heroSubtitle, incomingLayout.heroSubtitle || incomingLayout.hero || {}),
      cta: Object.assign({}, merged.layout.cta, incomingLayout.cta || {}),
      mobileNav: Object.assign({}, merged.layout.mobileNav || { x: 0, y: 0 }, incomingLayout.mobileNav || {}),
      mobileHeroTitle: Object.assign({}, merged.layout.mobileHeroTitle || { x: 0, y: 0 }, incomingLayout.mobileHeroTitle || {}),
      mobileHeroSubtitle: Object.assign({}, merged.layout.mobileHeroSubtitle || { x: 0, y: 0 }, incomingLayout.mobileHeroSubtitle || {}),
      mobileCta: Object.assign({}, merged.layout.mobileCta || { x: 0, y: 0 }, incomingLayout.mobileCta || {})
    };

    if (Array.isArray(incoming.tabs) && incoming.tabs.length) {
      merged.tabs = incoming.tabs.map(function (tab) {
        return {
          label: String(tab.label || "New Tab"),
          sectionId: String(tab.sectionId || slugify(tab.label || "new-tab")),
          pageHref: String(tab.pageHref || ""),
          sectionTitle: String(tab.sectionTitle || tab.label || "New Section"),
          sectionText: String(tab.sectionText || "Add section content here."),
          sectionFontFamily: String(tab.sectionFontFamily || ""),
          sectionTitleColor: String(tab.sectionTitleColor || merged.theme.textColor),
          sectionTextColor: String(tab.sectionTextColor || merged.theme.mutedColor),
          sectionBackgroundColor: String(tab.sectionBackgroundColor || merged.theme.surfaceColor),
          navFontFamily: String(tab.navFontFamily || ""),
          navTextColor: String(tab.navTextColor || merged.theme.textColor),
          navBackgroundColor: String(tab.navBackgroundColor || merged.theme.surfaceColor),
          sectionBackgroundSrc: String(tab.sectionBackgroundSrc || ""),
          sectionBackgroundFileName: String(tab.sectionBackgroundFileName || ""),
          sectionBackgroundTransparency: normalizeTabImageTransparency(tab.sectionBackgroundTransparency, 36),
          galleryLayout: String(tab.galleryLayout || "horizontal"),
          galleryImageTransparency: normalizeTabImageTransparency(tab.galleryImageTransparency, 0),
          galleryImages: Array.isArray(tab.galleryImages) ? tab.galleryImages.map(function (image) {
            return {
              src: String((image && image.src) || ""),
              fileName: String((image && image.fileName) || "")
            };
          }) : createEmptyGallery()
        };
      });
    }

    if (incoming.hero && Array.isArray(incoming.hero.buttons) && incoming.hero.buttons.length) {
      merged.hero.buttons = incoming.hero.buttons.map(function (button) {
        return {
          label: String(button.label || "Button"),
          href: String(button.href || "#")
        };
      });
    }

    if (incoming.contact && Array.isArray(incoming.contact.fields) && incoming.contact.fields.length) {
      merged.contact.fields = incoming.contact.fields.map(function (field, index) {
        return {
          id: String((field && field.id) || ("field-" + (index + 1))),
          label: String((field && field.label) || ("Field " + (index + 1))),
          type: String((field && field.type) || "text"),
          required: !!(field && field.required),
          placeholder: String((field && field.placeholder) || "")
        };
      });
    }

    return merged;
  }

  function swapTabs(indexA, indexB) {
    swapArrayItems(state.tabs, indexA, indexB);
  }

  function swapArrayItems(items, indexA, indexB) {
    var temp = items[indexA];
    items[indexA] = items[indexB];
    items[indexB] = temp;
  }

  function fontOptionsMarkup(selectedFont, includeDefault) {
    var options = [];
    if (includeDefault) {
      options.push("<option value=\"\"" + (selectedFont ? "" : " selected") + ">Use Site Font</option>");
    }
    FONT_FAMILIES.forEach(function (font) {
      options.push("<option value=\"" + escapeAttr(font) + "\"" + (selectedFont === font ? " selected" : "") + ">" + escapeHtml(font) + "</option>");
    });
    return options.join("");
  }

  function normalizeFontFamily(value) {
    var candidate = String(value || "").trim();
    if (!candidate) {
      return "";
    }
    return FONT_FAMILIES.indexOf(candidate) >= 0 ? candidate : "";
  }

  function normalizePageHref(value) {
    if (window.ConfiguratorPreviewBridge && typeof window.ConfiguratorPreviewBridge.normalizePageHref === "function") {
      return window.ConfiguratorPreviewBridge.normalizePageHref(value);
    }
    var href = String(value || "").trim();
    if (!href) {
      return "";
    }
    if (/^(https?:|mailto:|tel:|#)/i.test(href)) {
      return href;
    }
    href = href.replace(/\\+/g, "/");
    if (!/\.html?$/i.test(href)) {
      href += ".html";
    }
    return href;
  }

  function addQueryParam(href, key, value) {
    var input = String(href || "").trim();
    if (!input) {
      return input;
    }

    var hashIndex = input.indexOf("#");
    var hash = "";
    if (hashIndex >= 0) {
      hash = input.slice(hashIndex);
      input = input.slice(0, hashIndex);
    }

    var encodedKey = encodeURIComponent(String(key || ""));
    var encodedValue = encodeURIComponent(String(value || ""));
    var separator = input.indexOf("?") >= 0 ? "&" : "?";
    return input + separator + encodedKey + "=" + encodedValue + hash;
  }

  function buildPrivacyPreviewHref(fileHref, config) {
    var display = (config && config.display) || {};
    var privacy = (config && config.privacy) || {};
    var previewDevice = normalizePreviewDevice(config && config.display && config.display.previewDevice);
    var href = addQueryParam(fileHref, "configuratorPreview", "1");
    href = addQueryParam(href, "pdevice", previewDevice);
    href = addQueryParam(href, "pbg", normalizeHex(privacy.bgColor, "#f8fbfa"));
    href = addQueryParam(href, "ptxt", normalizeHex(privacy.textColor, "#18322b"));
    href = addQueryParam(href, "pmut", normalizeHex(privacy.mutedColor, "#5a736c"));
    href = addQueryParam(href, "pline", normalizeHex(privacy.lineColor, "#dce6e1"));
    href = addQueryParam(href, "pacc", normalizeHex(privacy.accentColor, "#0f786b"));
    href = addQueryParam(href, "pcard", normalizeHex(privacy.cardColor, "#ffffff"));
    href = addQueryParam(href, "ptabtxt", normalizeHex(display.tabTextColor, normalizeHex(privacy.textColor, "#18322b")));
    href = addQueryParam(href, "ptabbg", normalizeHex(display.tabBgColor, "#ffffff"));
    href = addQueryParam(href, "ptabtransparent", privacy.topTabsTransparent ? "1" : "0");
    href = addQueryParam(href, "ptop", String(clamp(parseInt(privacy.topBandHeight, 10) || 76, 48, 120)));
    href = addQueryParam(href, "phero", String(clamp(parseInt(privacy.heroTopPadding, 10) || 50, 24, 96)));
    href = addQueryParam(href, "pcardpad", String(clamp(parseInt(privacy.cardPadding, 10) || 26, 16, 40)));
    href = addQueryParam(href, "pgap", String(clamp(parseInt(privacy.layoutGap, 10) || 26, 12, 40)));
    return href;
  }

  function buildContactPreviewHref(fileHref, config) {
    var theme = (config && config.theme) || {};
    var display = (config && config.display) || {};
    var privacy = (config && config.privacy) || {};
    var contact = (config && config.contact) || {};
    var previewDevice = normalizePreviewDevice(config && config.display && config.display.previewDevice);
    var href = addQueryParam(fileHref, "configuratorPreview", "1");
    href = addQueryParam(href, "pdevice", previewDevice);
    href = addQueryParam(href, "ctitle", String(contact.title || ""));
    href = addQueryParam(href, "cintro", String(contact.intro || ""));
    href = addQueryParam(href, "csubmit", String(contact.submitLabel || "Submit"));
    href = addQueryParam(href, "csubject", String(contact.emailSubject || "Website Contact Request"));
    href = addQueryParam(href, "cform", String(contact.formEndpoint || "https://formspree.io/f/mrevdeyn"));
    href = addQueryParam(href, "cbg", normalizeHex(privacy.bgColor, normalizeHex(theme.bgColor, "#f8fbfa")));
    href = addQueryParam(href, "ctxt", normalizeHex(privacy.textColor, "#18322b"));
    href = addQueryParam(href, "cmut", normalizeHex(privacy.mutedColor, "#5a736c"));
    href = addQueryParam(href, "cacc", normalizeHex(privacy.accentColor, "#0f786b"));
    href = addQueryParam(href, "csurface", normalizeHex(privacy.cardColor, "#ffffff"));
    href = addQueryParam(href, "cline", normalizeHex(privacy.lineColor, "#dce6e1"));
    href = addQueryParam(href, "ctabtxt", normalizeHex(display.tabTextColor, normalizeHex(theme.textColor, "#18322b")));
    href = addQueryParam(href, "ctabbg", normalizeHex(display.tabBgColor, normalizeHex(theme.surfaceColor, "#ffffff")));
    href = addQueryParam(href, "ctabtransparent", contact.topTabsTransparent ? "1" : "0");
    return href;
  }

  function buildTabPillStyle(tab, config, transparentMode) {
    var globalTabText = normalizeHex(config.display && config.display.tabTextColor, config.theme.textColor);
    var globalTabBg = normalizeHex(config.display && config.display.tabBgColor, config.theme.surfaceColor);
    var style = "color:" + escapeAttr(globalTabText) + ";" +
      "background-color:" + escapeAttr(globalTabBg) + ";" +
      "background-image:none;" +
      "border-color:" + escapeAttr(globalTabBg) + ";" +
      (tab.navFontFamily ? "font-family:'" + escapeAttr(tab.navFontFamily) + "','Segoe UI',sans-serif;" : "") +
      "font-size:var(--preview-button-size);";

    if (transparentMode) {
      style += "background-color:transparent !important;background-image:none !important;border-color:transparent !important;box-shadow:none !important;";
    }

    return style;
  }

  function normalizeTextAlign(value) {
    if (window.ConfiguratorStateBridge && typeof window.ConfiguratorStateBridge.normalizeTextAlign === "function") {
      return window.ConfiguratorStateBridge.normalizeTextAlign(value);
    }
    var candidate = String(value || "left").toLowerCase();
    if (candidate !== "left" && candidate !== "center" && candidate !== "right") {
      return "left";
    }
    return candidate;
  }

  function normalizeImageSrc(value) {
    if (window.ConfiguratorStateBridge && typeof window.ConfiguratorStateBridge.normalizeImageSrc === "function") {
      return window.ConfiguratorStateBridge.normalizeImageSrc(value);
    }
    var src = String(value || "").trim();
    return src;
  }

  function sanitizeFileName(value) {
    if (window.ConfiguratorStateBridge && typeof window.ConfiguratorStateBridge.sanitizeFileName === "function") {
      return window.ConfiguratorStateBridge.sanitizeFileName(value);
    }
    var name = String(value || "").trim();
    if (!name) {
      return "";
    }
    return name.replace(/[\\/:*?"<>|]/g, "-");
  }

  function createDefaultLogo(index) {
    if (window.ConfiguratorStateBridge && typeof window.ConfiguratorStateBridge.createDefaultLogo === "function") {
      return window.ConfiguratorStateBridge.createDefaultLogo(index);
    }
    return {
      src: "",
      fileName: "",
      x: index === 0 ? 0 : 76,
      y: 0,
      size: 72,
      rotation: 0,
      transparency: 0
    };
  }

  function createDefaultLogos() {
    if (window.ConfiguratorStateBridge && typeof window.ConfiguratorStateBridge.createDefaultLogos === "function") {
      return window.ConfiguratorStateBridge.createDefaultLogos();
    }
    return [createDefaultLogo(0), createDefaultLogo(1)];
  }

  function normalizeRotation(value) {
    if (window.ConfiguratorStateBridge && typeof window.ConfiguratorStateBridge.normalizeRotation === "function") {
      return window.ConfiguratorStateBridge.normalizeRotation(value);
    }
    var parsed = parseInt(value, 10);
    if (Number.isNaN(parsed)) {
      parsed = 0;
    }
    return clamp(parsed, -180, 180);
  }

  function normalizeBrandLogos(value, legacyPrimary) {
    if (window.ConfiguratorStateBridge && typeof window.ConfiguratorStateBridge.normalizeBrandLogos === "function") {
      return window.ConfiguratorStateBridge.normalizeBrandLogos(value, legacyPrimary);
    }
    var defaults = createDefaultLogos();
    var legacy = legacyPrimary || {};
    var source = Array.isArray(value) ? value.slice(0, 2) : [];

    if (!source.length && (legacy.src || legacy.fileName)) {
      source.push({
        src: legacy.src,
        fileName: legacy.fileName,
        x: legacy.x,
        y: legacy.y
      });
    }

    while (source.length < 2) {
      source.push(defaults[source.length]);
    }

    return [0, 1].map(function (index) {
      var item = source[index] || defaults[index];
      return {
        src: normalizeImageSrc(item.src),
        fileName: sanitizeFileName(item.fileName),
        x: parseInt(item.x, 10) || 0,
        y: parseInt(item.y, 10) || 0,
        size: clamp(parseInt(item.size, 10) || defaults[index].size, 1, 1200),
        rotation: normalizeRotation(item.rotation),
        transparency: clamp(parseInt(item.transparency, 10) || 0, 0, 95)
      };
    });
  }

  function ensureTwoLogos(brand) {
    if (window.ConfiguratorStateBridge && typeof window.ConfiguratorStateBridge.ensureTwoLogos === "function") {
      return window.ConfiguratorStateBridge.ensureTwoLogos(brand);
    }
    var legacy = {
      src: brand.logoSrc,
      fileName: brand.logoFileName,
      x: 0,
      y: 0
    };
    return normalizeBrandLogos(brand.logos, legacy);
  }

  function setLogoSize(index, value, keepCenter) {
    var logoIndex = clamp(parseInt(index, 10) || 0, 0, 1);
    var logo = state.brand.logos[logoIndex];
    var nextSize = clamp(parseInt(value, 10) || 0, 1, 1200);
    var previousSize = clamp(parseInt(logo.size, 10) || 72, 1, 1200);
    if (keepCenter && nextSize !== previousSize) {
      var delta = nextSize - previousSize;
      logo.x -= Math.round(delta / 2);
      logo.y -= Math.round(delta / 2);
    }
    logo.size = nextSize;
  }

  function createEmptyGallery() {
    return [
      { src: "", fileName: "" },
      { src: "", fileName: "" },
      { src: "", fileName: "" },
      { src: "", fileName: "" }
    ];
  }

  function createDefaultContactFields() {
    return [
      { id: "first-name", label: "First Name", type: "text", required: true, placeholder: "Your first name" },
      { id: "last-name", label: "Last Name", type: "text", required: true, placeholder: "Your last name" },
      { id: "business-email", label: "Business Email", type: "email", required: true, placeholder: "name@company.com" },
      { id: "company", label: "Company", type: "text", required: true, placeholder: "Company name" },
      { id: "message", label: "Message", type: "textarea", required: true, placeholder: "How can we help?" },
      { id: "consent", label: "I agree to the Privacy Policy", type: "checkbox", required: true, placeholder: "" }
    ];
  }

  function normalizeContactFieldType(value) {
    if (window.ConfiguratorStateBridge && typeof window.ConfiguratorStateBridge.normalizeContactFieldType === "function") {
      return window.ConfiguratorStateBridge.normalizeContactFieldType(value);
    }
    var candidate = String(value || "text").toLowerCase();
    if (candidate === "email" || candidate === "textarea" || candidate === "checkbox") {
      return candidate;
    }
    return "text";
  }

  function normalizeContactFields(value) {
    if (window.ConfiguratorStateBridge && typeof window.ConfiguratorStateBridge.normalizeContactFields === "function") {
      return window.ConfiguratorStateBridge.normalizeContactFields(value);
    }
    var source = Array.isArray(value) ? value : createDefaultContactFields();
    var fields = source
      .map(function (field, index) {
        var fallbackLabel = "Field " + (index + 1);
        var label = String((field && field.label) || fallbackLabel).trim() || fallbackLabel;
        var type = normalizeContactFieldType(field && field.type);
        var id = slugify((field && field.id) || label || ("field-" + (index + 1)));
        return {
          id: id || ("field-" + (index + 1)),
          label: label,
          type: type,
          required: type === "checkbox" ? true : !!(field && field.required),
          placeholder: String((field && field.placeholder) || "")
        };
      })
      .filter(function (field) {
        return !!field.label;
      });

    if (!fields.some(function (field) { return field.id === "consent"; })) {
      fields.push({ id: "consent", label: "I agree to the Privacy Policy", type: "checkbox", required: true, placeholder: "" });
    }
    return fields;
  }

  function contactFieldTypeOptionsMarkup(selectedType) {
    var type = normalizeContactFieldType(selectedType);
    return [
      "<option value=\"text\"" + (type === "text" ? " selected" : "") + ">Text</option>",
      "<option value=\"email\"" + (type === "email" ? " selected" : "") + ">Email</option>",
      "<option value=\"textarea\"" + (type === "textarea" ? " selected" : "") + ">Textarea</option>",
      "<option value=\"checkbox\"" + (type === "checkbox" ? " selected" : "") + ">Consent Checkbox</option>"
    ].join("");
  }

  function normalizeGalleryImages(value) {
    if (window.ConfiguratorStateBridge && typeof window.ConfiguratorStateBridge.normalizeGalleryImages === "function") {
      return window.ConfiguratorStateBridge.normalizeGalleryImages(value);
    }
    var items = Array.isArray(value) ? value.slice(0, 4) : [];
    while (items.length < 4) {
      items.push({ src: "", fileName: "" });
    }
    return items.map(function (item) {
      return {
        src: normalizeImageSrc(item && item.src),
        fileName: sanitizeFileName(item && item.fileName)
      };
    });
  }

  function ensureGallerySlots(tab) {
    tab.galleryImages = normalizeGalleryImages(tab.galleryImages);
  }

  function normalizeGalleryLayout(value) {
    if (window.ConfiguratorStateBridge && typeof window.ConfiguratorStateBridge.normalizeGalleryLayout === "function") {
      return window.ConfiguratorStateBridge.normalizeGalleryLayout(value);
    }
    var candidate = String(value || "").trim().toLowerCase();
    if (candidate === "vertical" || candidate === "split" || candidate === "horizontal") {
      return candidate;
    }
    return "horizontal";
  }

  function normalizeTabMode(value) {
    if (window.ConfiguratorStateBridge && typeof window.ConfiguratorStateBridge.normalizeTabMode === "function") {
      return window.ConfiguratorStateBridge.normalizeTabMode(value);
    }
    var mode = String(value || "").trim().toLowerCase();
    if (mode === "top-only" || mode === "top-and-home") {
      return mode;
    }
    return "top-and-home";
  }

  function normalizePageMode(value) {
    if (window.ConfiguratorStateBridge && typeof window.ConfiguratorStateBridge.normalizePageMode === "function") {
      return window.ConfiguratorStateBridge.normalizePageMode(value);
    }
    var mode = String(value || "home").trim().toLowerCase();
    if (mode === "privacy" || mode === "contact") {
      return mode;
    }
    return "home";
  }

  function normalizePreviewDevice(value) {
    if (window.ConfiguratorMobileBridge && typeof window.ConfiguratorMobileBridge.normalizePreviewDevice === "function") {
      return window.ConfiguratorMobileBridge.normalizePreviewDevice(value);
    }
    return String(value || "desktop").trim().toLowerCase() === "mobile" ? "mobile" : "desktop";
  }

  function normalizePreviewPageValue(value, config) {
    var options = getPreviewPageOptions(config || state);
    if (window.ConfiguratorPreviewBridge && typeof window.ConfiguratorPreviewBridge.normalizePreviewPageValue === "function") {
      return window.ConfiguratorPreviewBridge.normalizePreviewPageValue(value, options);
    }
    if (window.ConfiguratorStateBridge && typeof window.ConfiguratorStateBridge.normalizePreviewPageValue === "function") {
      return window.ConfiguratorStateBridge.normalizePreviewPageValue(value, options);
    }

    var candidate = String(value || "home").trim();
    if (!candidate || candidate === "home") {
      return "home";
    }

    if (!/^page:/i.test(candidate)) {
      return "home";
    }

    for (var index = 0; index < options.length; index += 1) {
      if (options[index].value === candidate) {
        return candidate;
      }
    }

    return "home";
  }

  function normalizeTabImageTransparency(value, fallbackValue) {
    if (window.ConfiguratorStateBridge && typeof window.ConfiguratorStateBridge.normalizeTabImageTransparency === "function") {
      return window.ConfiguratorStateBridge.normalizeTabImageTransparency(value, fallbackValue);
    }
    var parsed = parseInt(value, 10);
    if (Number.isNaN(parsed)) {
      return clamp(fallbackValue, 0, 95);
    }
    return clamp(parsed, 0, 95);
  }

  function galleryLayoutOptionsMarkup(selected) {
    var mode = normalizeGalleryLayout(selected);
    return [
      "<option value=\"horizontal\"" + (mode === "horizontal" ? " selected" : "") + ">Horizontal Row</option>",
      "<option value=\"vertical\"" + (mode === "vertical" ? " selected" : "") + ">Vertical Stack</option>",
      "<option value=\"split\"" + (mode === "split" ? " selected" : "") + ">Split 2 Left / 2 Right</option>"
    ].join("");
  }

  function getGalleryFileName(tab, index) {
    ensureGallerySlots(tab);
    return tab.galleryImages[index] && tab.galleryImages[index].fileName
      ? tab.galleryImages[index].fileName
      : "not set";
  }

  function uniqueSectionId(base) {
    var slug = slugify(base || "section");
    var seen = {};
    state.tabs.forEach(function (tab) {
      seen[tab.sectionId] = true;
    });

    if (!seen[slug]) {
      return slug;
    }

    var counter = 2;
    while (seen[slug + "-" + counter]) {
      counter += 1;
    }
    return slug + "-" + counter;
  }

  function slugify(value) {
    return String(value || "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  function getFontHref(fontFamily) {
    var maps = {
      "Sora": "https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&display=swap",
      "Space Grotesk": "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap",
      "Manrope": "https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;700;800&display=swap",
      "Plus Jakarta Sans": "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;700;800&display=swap",
      "Outfit": "https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;700;800&display=swap",
      "DM Sans": "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;900&display=swap",
      "Archivo": "https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;700;800&display=swap",
      "Karla": "https://fonts.googleapis.com/css2?family=Karla:wght@400;500;700;800&display=swap",
      "Merriweather": "https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700;900&display=swap",
      "Playfair Display": "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;800&display=swap",
      "Cormorant Garamond": "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&display=swap",
      "Bricolage Grotesque": "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;500;700;800&display=swap"
    };
    return maps[fontFamily] || maps.Sora;
  }

  function getAllFontsHref() {
    return "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=Sora:wght@400;600;700;800&family=Manrope:wght@400;500;700;800&family=Plus+Jakarta+Sans:wght@400;500;700;800&family=Outfit:wght@400;500;700;800&family=DM+Sans:wght@400;500;700;900&family=Archivo:wght@400;500;700;800&family=Karla:wght@400;500;700;800&family=Merriweather:wght@400;700;900&family=Playfair+Display:wght@400;600;700;800&family=Cormorant+Garamond:wght@400;500;600;700&family=Bricolage+Grotesque:wght@400;500;700;800&display=swap";
  }

  function downloadFile(filename, content, mimeType) {
    var blob = new Blob([content], { type: mimeType });
    downloadBlob(blob, filename);
  }

  function downloadBlob(blob, filename) {
    var url = URL.createObjectURL(blob);
    var anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  }

  function dataUrlToBlob(dataUrl) {
    var parts = String(dataUrl || "").split(",");
    if (parts.length < 2) {
      return new Blob([""], { type: "application/octet-stream" });
    }
    var mimeMatch = parts[0].match(/data:([^;]+);base64/i);
    var mime = mimeMatch && mimeMatch[1] ? mimeMatch[1] : "application/octet-stream";
    var binary = atob(parts[1]);
    var length = binary.length;
    var bytes = new Uint8Array(length);
    for (var index = 0; index < length; index += 1) {
      bytes[index] = binary.charCodeAt(index);
    }
    return new Blob([bytes], { type: mime });
  }

  function clamp(value, min, max) {
    if (window.ConfiguratorStateBridge && typeof window.ConfiguratorStateBridge.clamp === "function") {
      return window.ConfiguratorStateBridge.clamp(value, min, max);
    }
    return Math.max(min, Math.min(max, value));
  }

  function transparencyToOpacity(transparency) {
    var normalized = clamp(parseInt(transparency, 10) || 0, 0, 100);
    return String((100 - normalized) / 100);
  }

  function deepClone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function normalizeHex(value, fallback) {
    if (window.ConfiguratorStateBridge && typeof window.ConfiguratorStateBridge.normalizeHex === "function") {
      return window.ConfiguratorStateBridge.normalizeHex(value, fallback);
    }
    var raw = String(value || "").trim();
    if (/^#[0-9a-fA-F]{6}$/.test(raw)) {
      return raw;
    }
    return fallback;
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function escapeAttr(value) {
    return escapeHtml(value).replace(/`/g, "");
  }
})();
