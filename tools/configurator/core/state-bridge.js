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
    normalizeContactFields: normalizeContactFields
  };
})();
