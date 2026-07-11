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
    normalizePreviewPageValue: normalizePreviewPageValue
  };
})();
