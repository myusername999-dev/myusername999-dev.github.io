(function () {
  "use strict";

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function normalizeHex(value, fallback) {
    var raw = String(value || "").trim();
    if (/^#[0-9a-fA-F]{6}$/.test(raw)) {
      return raw;
    }
    return fallback;
  }

  function normalizeGalleryLayout(value) {
    var candidate = String(value || "").trim().toLowerCase();
    if (candidate === "vertical" || candidate === "split" || candidate === "horizontal") {
      return candidate;
    }
    return "horizontal";
  }

  function normalizeTabMode(value) {
    var mode = String(value || "").trim().toLowerCase();
    if (mode === "top-only" || mode === "top-and-home") {
      return mode;
    }
    return "top-and-home";
  }

  function normalizePageMode(value) {
    var mode = String(value || "home").trim().toLowerCase();
    if (mode === "privacy" || mode === "contact" || mode === "under-construction") {
      return mode;
    }
    return "home";
  }

  function normalizeTabImageTransparency(value, fallbackValue) {
    var parsed = parseInt(value, 10);
    if (Number.isNaN(parsed)) {
      return clamp(fallbackValue, 0, 95);
    }
    return clamp(parsed, 0, 95);
  }

  function normalizeTextAlign(value) {
    var candidate = String(value || "left").toLowerCase();
    if (candidate !== "left" && candidate !== "center" && candidate !== "right") {
      return "left";
    }
    return candidate;
  }

  function slugify(value) {
    return String(value || "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
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
    var candidate = String(value || "text").toLowerCase();
    if (candidate === "email" || candidate === "textarea" || candidate === "checkbox") {
      return candidate;
    }
    return "text";
  }

  function normalizeContactFields(value) {
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

  function normalizeImageSrc(value) {
    var src = String(value || "").trim();
    return src;
  }

  function sanitizeFileName(value) {
    var name = String(value || "").trim();
    if (!name) {
      return "";
    }
    return name.replace(/[\\/:*?"<>|]/g, "-");
  }

  function normalizeRotation(value) {
    var parsed = parseInt(value, 10);
    if (Number.isNaN(parsed)) {
      parsed = 0;
    }
    return clamp(parsed, -180, 180);
  }

  function createDefaultLogo(index) {
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
    return [createDefaultLogo(0), createDefaultLogo(1)];
  }

  function normalizeBrandLogos(value, legacyPrimary) {
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
    var source = brand || {};
    var legacy = {
      src: source.logoSrc,
      fileName: source.logoFileName,
      x: 0,
      y: 0
    };
    return normalizeBrandLogos(source.logos, legacy);
  }

  function normalizeMobileLogoOverrides(value, desktopLogos) {
    var source = Array.isArray(value) ? value : [];
    var desktop = Array.isArray(desktopLogos) ? desktopLogos : createDefaultLogos();

    return [0, 1].map(function (index) {
      var override = source[index] || {};
      var fallback = desktop[index] || createDefaultLogo(index);
      return {
        x: parseInt(override.x, 10) || fallback.x,
        y: parseInt(override.y, 10) || fallback.y,
        size: clamp(parseInt(override.size, 10) || fallback.size, 1, 1200)
      };
    });
  }

  function normalizeMobileOverrides(value, desktopState) {
    var source = value || {};
    var desktop = desktopState || {};
    var desktopLayout = desktop.layout || {};
    var desktopTheme = desktop.theme || {};
    var legacyMobileKeys = {
      nav: "mobileNav",
      heroTitle: "mobileHeroTitle",
      heroSubtitle: "mobileHeroSubtitle",
      cta: "mobileCta"
    };

    function normalizePosition(override, fallback) {
      var item = override || {};
      var base = fallback || { x: 0, y: 0 };
      return {
        x: parseInt(item.x, 10) || base.x || 0,
        y: parseInt(item.y, 10) || base.y || 0
      };
    }

    return {
      layout: {
        nav: normalizePosition(source.layout && source.layout.nav, desktopLayout[legacyMobileKeys.nav] || desktopLayout.nav),
        heroTitle: normalizePosition(source.layout && source.layout.heroTitle, desktopLayout[legacyMobileKeys.heroTitle] || desktopLayout.heroTitle),
        heroSubtitle: normalizePosition(source.layout && source.layout.heroSubtitle, desktopLayout[legacyMobileKeys.heroSubtitle] || desktopLayout.heroSubtitle),
        cta: normalizePosition(source.layout && source.layout.cta, desktopLayout[legacyMobileKeys.cta] || desktopLayout.cta)
      },
      brand: {
        logos: normalizeMobileLogoOverrides(source.brand && source.brand.logos, desktop.brand && desktop.brand.logos)
      },
      theme: {
        headingSize: clamp(parseInt(source.theme && source.theme.headingSize, 10) || parseInt(desktopTheme.mobileHeadingSize, 10) || desktopTheme.headingSize || 64, 20, 160),
        bodySize: clamp(parseInt(source.theme && source.theme.bodySize, 10) || parseInt(desktopTheme.mobileBodySize, 10) || desktopTheme.bodySize || 18, 10, 72),
        buttonTextSize: clamp(parseInt(source.theme && source.theme.buttonTextSize, 10) || parseInt(desktopTheme.mobileButtonTextSize, 10) || desktopTheme.buttonTextSize || 16, 10, 72),
        bgColor: normalizeHex(source.theme && source.theme.bgColor, desktopTheme.bgColor || "#f2f7f3"),
        textColor: normalizeHex(source.theme && source.theme.textColor, desktopTheme.textColor || "#102822"),
        accentColor: normalizeHex(source.theme && source.theme.accentColor, desktopTheme.accentColor || "#0f7b6c"),
        mutedColor: normalizeHex(source.theme && source.theme.mutedColor, desktopTheme.mutedColor || "#4f6962"),
        surfaceColor: normalizeHex(source.theme && source.theme.surfaceColor, desktopTheme.surfaceColor || "#e5f0ea"),
        buttonTextColor: normalizeHex(source.theme && source.theme.buttonTextColor, desktopTheme.buttonTextColor || "#ffffff")
      },
      buttons: {
        paddingY: clamp(parseInt(source.buttons && source.buttons.paddingY, 10) || 12, 0, 80),
        paddingX: clamp(parseInt(source.buttons && source.buttons.paddingX, 10) || 18, 0, 120),
        gap: clamp(parseInt(source.buttons && source.buttons.gap, 10) || 10, 0, 80),
        width: source.buttons && source.buttons.width === "full" ? "full" : "auto"
      }
    };
  }

  function normalizeGalleryImages(value) {
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

  function normalizePreviewPageValue(value, options) {
    var candidate = String(value || "home").trim();
    if (!candidate || candidate === "home") {
      return "home";
    }

    if (!/^page:/i.test(candidate)) {
      return "home";
    }

    var list = Array.isArray(options) ? options : [];
    for (var index = 0; index < list.length; index += 1) {
      if (list[index] && list[index].value === candidate) {
        return candidate;
      }
    }

    return "home";
  }

  function normalizeUnderConstructionPageFileName(value, normalizePageHref) {
    var normalizeHref = typeof normalizePageHref === "function"
      ? normalizePageHref
      : function (candidate) {
          var href = String(candidate || "").trim();
          if (!href || /^(https?:|mailto:|tel:|#)/i.test(href)) {
            return "";
          }
          href = href.replace(/\\+/g, "/");
          if (!/\.html?$/i.test(href)) {
            href += ".html";
          }
          return href;
        };

    var href = normalizeHref(value);
    if (!href || /^(https?:|mailto:|tel:|#)/i.test(href)) {
      return "";
    }
    href = href.split("?")[0].split("#")[0].trim().toLowerCase();
    if (!href || href.indexOf("/") >= 0 || href === "index.html") {
      return "";
    }
    return href;
  }

  function normalizeUnderConstructionConfig(value, options) {
    var source = value || {};
    var opts = options || {};
    var defaultImage = String(opts.defaultImage || "images/under-construction.png");
    var fixedPages = Array.isArray(opts.fixedPages) ? opts.fixedPages : ["index.html", "privacy.html", "contact.html"];
    var normalizePageHref = typeof opts.normalizePageHref === "function" ? opts.normalizePageHref : null;

    var fixedLookup = {};
    fixedPages.forEach(function (item) {
      fixedLookup[String(item || "").toLowerCase()] = true;
    });

    var desktopImageSrc = normalizeImageSrc(source.desktopImageSrc || defaultImage) || defaultImage;
    var desktopImageFileName = sanitizeFileName(source.desktopImageFileName || "under-construction.png") || "under-construction.png";
    var useSameImageForMobile = typeof source.useSameImageForMobile === "boolean" ? source.useSameImageForMobile : true;
    var mobileImageSrc = useSameImageForMobile
      ? desktopImageSrc
      : (normalizeImageSrc(source.mobileImageSrc || desktopImageSrc) || desktopImageSrc);
    var mobileImageFileName = useSameImageForMobile
      ? desktopImageFileName
      : (sanitizeFileName(source.mobileImageFileName || desktopImageFileName) || desktopImageFileName);

    var seenPages = {};
    var pages = (Array.isArray(source.pages) ? source.pages : ["news.html"])
      .map(function (page) {
        return normalizeUnderConstructionPageFileName(page, normalizePageHref);
      })
      .filter(function (page) {
        if (!page || fixedLookup[page] || seenPages[page]) {
          return false;
        }
        seenPages[page] = true;
        return true;
      });

    return {
      enabled: !!source.enabled,
      useSameImageForMobile: useSameImageForMobile,
      desktopImageSrc: desktopImageSrc,
      desktopImageFileName: desktopImageFileName,
      mobileImageSrc: mobileImageSrc,
      mobileImageFileName: mobileImageFileName,
      pages: pages
    };
  }

  window.ConfiguratorStateBridge = {
    clamp: clamp,
    normalizeHex: normalizeHex,
    normalizeGalleryLayout: normalizeGalleryLayout,
    normalizeTabMode: normalizeTabMode,
    normalizePageMode: normalizePageMode,
    normalizeTabImageTransparency: normalizeTabImageTransparency,
    normalizePreviewPageValue: normalizePreviewPageValue,
    normalizeTextAlign: normalizeTextAlign,
    normalizeContactFieldType: normalizeContactFieldType,
    normalizeContactFields: normalizeContactFields,
    normalizeImageSrc: normalizeImageSrc,
    sanitizeFileName: sanitizeFileName,
    normalizeRotation: normalizeRotation,
    createDefaultLogo: createDefaultLogo,
    createDefaultLogos: createDefaultLogos,
    normalizeBrandLogos: normalizeBrandLogos,
    ensureTwoLogos: ensureTwoLogos,
    normalizeMobileLogoOverrides: normalizeMobileLogoOverrides,
    normalizeMobileOverrides: normalizeMobileOverrides,
    normalizeGalleryImages: normalizeGalleryImages,
    normalizeUnderConstructionConfig: normalizeUnderConstructionConfig
  };
})();
