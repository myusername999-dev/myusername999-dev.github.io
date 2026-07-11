(function () {
  "use strict";

  function normalizePublishScope(scope) {
    var candidate = String(scope || "all").toLowerCase();
    if (candidate === "home" || candidate === "privacy" || candidate === "contact" || candidate === "all") {
      return candidate;
    }
    return "all";
  }

  function getPublishTargets(scope) {
    var publishScope = normalizePublishScope(scope);
    return {
      home: publishScope === "all" || publishScope === "home",
      privacy: publishScope === "all" || publishScope === "privacy",
      contact: publishScope === "all" || publishScope === "contact",
      assets: publishScope === "all" || publishScope === "home"
    };
  }

  function slugify(value) {
    return String(value || "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  function validateStateFromConfig(config) {
    var errors = [];
    var state = config || {};
    var brand = state.brand || {};
    var hero = state.hero || {};
    var tabs = Array.isArray(state.tabs) ? state.tabs : [];

    if (!String(brand.name || "").trim()) {
      errors.push("Brand name is required.");
    }
    if (!Array.isArray(hero.buttons) || !hero.buttons.length) {
      errors.push("At least one action button is required.");
    }
    if (Array.isArray(hero.buttons) && hero.buttons.some(function (button) {
      return !String((button && button.label) || "").trim();
    })) {
      errors.push("Each action button needs a label.");
    }
    if (!tabs.length) {
      errors.push("At least one tab is required.");
    }

    var seen = {};
    tabs.forEach(function (tab, index) {
      var id = slugify(tab && tab.sectionId);
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

  function shouldPreserveExistingHomeOnPublish(hasUserEditsSinceLoad, fallbackHomeHtml) {
    if (hasUserEditsSinceLoad) {
      return false;
    }
    var html = String(fallbackHomeHtml || "");
    if (!html) {
      return false;
    }
    return html.indexOf('class="home-root"') >= 0;
  }

  function shouldValidateState(scope) {
    var publishScope = normalizePublishScope(scope);
    return publishScope === "home" || publishScope === "all";
  }

  function shouldIncludeAssociatedPages(previewDevice, scope) {
    var normalizedDevice = String(previewDevice || "desktop").trim().toLowerCase();
    var publishScope = normalizePublishScope(scope);
    return normalizedDevice !== "mobile" && publishScope === "all";
  }

  function buildScopedPublishSuccessMessage(projectDirectoryName, scope, includeAssociatedPages, associatedCount, assetSuffix) {
    var location = String(projectDirectoryName || "selected folder");
    var suffix = String(assetSuffix || "");
    var base = "Publish complete in " + location + ". ";
    if (scope === "privacy") {
      return base + "Saved privacy.html.";
    }
    if (scope === "contact") {
      return base + "Saved contact.html.";
    }
    if (scope === "home") {
      return base + "Saved index.html." + suffix;
    }
    if (includeAssociatedPages) {
      return base + "Saved index.html, privacy.html, contact.html, and " + associatedCount + " associated page(s)." + suffix;
    }
    return base + "Saved index.html, privacy.html, and contact.html." + suffix;
  }

  function buildScopedDownloadSummary(scope, includeAssociatedPages, associatedCount) {
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

  function buildScopedDownloadMessage(scope, includeAssociatedPages, associatedCount, assetSuffix) {
    var suffix = String(assetSuffix || "");
    return "Browser folder-write API unavailable. " + buildScopedDownloadSummary(scope, includeAssociatedPages, associatedCount) + suffix;
  }

  window.ConfiguratorPublishBridge = {
    normalizePublishScope: normalizePublishScope,
    getPublishTargets: getPublishTargets,
    validateStateFromConfig: validateStateFromConfig,
    shouldPreserveExistingHomeOnPublish: shouldPreserveExistingHomeOnPublish,
    shouldValidateState: shouldValidateState,
    shouldIncludeAssociatedPages: shouldIncludeAssociatedPages,
    buildScopedPublishSuccessMessage: buildScopedPublishSuccessMessage,
    buildScopedDownloadSummary: buildScopedDownloadSummary,
    buildScopedDownloadMessage: buildScopedDownloadMessage
  };
})();
