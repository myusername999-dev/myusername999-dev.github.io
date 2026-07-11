(function () {
  "use strict";

  function normalizePreviewDevice(value) {
    return String(value || "desktop").trim().toLowerCase() === "mobile" ? "mobile" : "desktop";
  }

  function applyMobilePreviewLayout(previewConfig) {
    if (!previewConfig || !previewConfig.layout) {
      return previewConfig;
    }
    previewConfig.layout.nav = Object.assign({}, previewConfig.layout.mobileNav || { x: 0, y: 0 });
    previewConfig.layout.heroTitle = Object.assign({}, previewConfig.layout.mobileHeroTitle || { x: 0, y: 0 });
    previewConfig.layout.heroSubtitle = Object.assign({}, previewConfig.layout.mobileHeroSubtitle || { x: 0, y: 0 });
    previewConfig.layout.cta = Object.assign({}, previewConfig.layout.mobileCta || { x: 0, y: 0 });
    return previewConfig;
  }

  window.ConfiguratorMobileBridge = {
    normalizePreviewDevice: normalizePreviewDevice,
    applyMobilePreviewLayout: applyMobilePreviewLayout
  };
})();
