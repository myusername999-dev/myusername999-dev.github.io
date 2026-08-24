(function () {
  "use strict";

  function normalizePreviewDevice(value) {
    return String(value || "desktop").trim().toLowerCase() === "mobile" ? "mobile" : "desktop";
  }

  function getMobileLayout(config, key) {
    var overrides = config.mobile && config.mobile.layout;
    if (overrides && overrides[key]) {
      return overrides[key];
    }
    var legacyKeys = {
      nav: "mobileNav",
      heroTitle: "mobileHeroTitle",
      heroSubtitle: "mobileHeroSubtitle",
      cta: "mobileCta"
    };
    return config.layout[legacyKeys[key]] || config.layout[key] || { x: 0, y: 0 };
  }

  function applyMobilePreviewLayout(previewConfig) {
    if (!previewConfig || !previewConfig.layout) {
      return previewConfig;
    }

    ["nav", "heroTitle", "heroSubtitle", "cta"].forEach(function (key) {
      previewConfig.layout[key] = Object.assign({}, getMobileLayout(previewConfig, key));
    });

    var mobileLogos = previewConfig.mobile && previewConfig.mobile.brand && previewConfig.mobile.brand.logos;
    if (Array.isArray(previewConfig.brand && previewConfig.brand.logos) && Array.isArray(mobileLogos)) {
      previewConfig.brand.logos = previewConfig.brand.logos.map(function (logo, index) {
        return Object.assign({}, logo, mobileLogos[index] || {});
      });
    }
    return previewConfig;
  }

  window.ConfiguratorMobileBridge = {
    normalizePreviewDevice: normalizePreviewDevice,
    applyMobilePreviewLayout: applyMobilePreviewLayout
  };
})();
