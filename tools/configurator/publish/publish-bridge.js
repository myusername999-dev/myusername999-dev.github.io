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
    buildScopedPublishSuccessMessage: buildScopedPublishSuccessMessage,
    buildScopedDownloadSummary: buildScopedDownloadSummary,
    buildScopedDownloadMessage: buildScopedDownloadMessage
  };
})();
