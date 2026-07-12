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
    if (mode === "privacy" || mode === "contact") {
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
    normalizeGalleryImages: normalizeGalleryImages
  };
})();
