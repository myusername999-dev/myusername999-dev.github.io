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

  function getPublishExecutionPlan(scope, previewDevice) {
    var publishScope = normalizePublishScope(scope);
    return {
      scope: publishScope,
      targets: getPublishTargets(publishScope),
      shouldValidate: shouldValidateState(publishScope),
      includeAssociatedPages: shouldIncludeAssociatedPages(previewDevice, publishScope)
    };
  }

  function shouldUseDirectoryPublishing(hasDirectoryPicker) {
    return !!hasDirectoryPicker;
  }

  function resolvePublishFlowContext(scope, previewDevice, hasDirectoryPicker) {
    return {
      plan: getPublishExecutionPlan(scope, previewDevice),
      transport: shouldUseDirectoryPublishing(hasDirectoryPicker) ? "filesystem" : "download"
    };
  }

  function resolvePublishOutcomeStatus(mode, details) {
    var info = details || {};
    var scope = normalizePublishScope(info.scope);
    var includeAssociatedPages = !!info.includeAssociatedPages;
    var associatedCount = parseInt(info.associatedCount, 10) || 0;
    var assetSuffix = String(info.assetSuffix || "");
    var cause = String(info.cause || "unknown reason");
    var projectDirectoryName = String(info.projectDirectoryName || "selected folder");

    if (mode === "filesystem-success") {
      return buildScopedPublishSuccessMessage(
        projectDirectoryName,
        scope,
        includeAssociatedPages,
        associatedCount,
        assetSuffix
      );
    }

    if (mode === "download-success") {
      return buildScopedDownloadMessage(scope, includeAssociatedPages, associatedCount, assetSuffix);
    }

    if (mode === "download-fallback") {
      return "Folder write unavailable (" + cause + "). "
        + buildScopedDownloadSummary(scope, includeAssociatedPages, associatedCount)
        + assetSuffix;
    }

    return "Publish status unavailable.";
  }

  function classifyPublishError(error) {
    var name = String(error && error.name || "");
    var reason = String(error && error.message || "");
    if (name === "AbortError") {
      return {
        kind: "abort",
        reason: reason || "AbortError"
      };
    }
    return {
      kind: "failure",
      reason: reason || "Unknown write error"
    };
  }

  function buildPublishAbortStatus(stage) {
    return "Publish canceled at step: " + String(stage || "unknown") + ". Click Publish again and allow folder write access.";
  }

  function buildPublishFailureStatus(stage, reason) {
    return "Direct folder publish failed at step: " + String(stage || "unknown")
      + ". " + String(reason || "Unknown write error")
      + ". Re-select your project root folder and try again.";
  }

  window.ConfiguratorPublishBridge = {
    normalizePublishScope: normalizePublishScope,
    getPublishTargets: getPublishTargets,
    validateStateFromConfig: validateStateFromConfig,
    shouldPreserveExistingHomeOnPublish: shouldPreserveExistingHomeOnPublish,
    shouldValidateState: shouldValidateState,
    shouldIncludeAssociatedPages: shouldIncludeAssociatedPages,
    getPublishExecutionPlan: getPublishExecutionPlan,
    shouldUseDirectoryPublishing: shouldUseDirectoryPublishing,
    resolvePublishFlowContext: resolvePublishFlowContext,
    resolvePublishOutcomeStatus: resolvePublishOutcomeStatus,
    classifyPublishError: classifyPublishError,
    buildPublishAbortStatus: buildPublishAbortStatus,
    buildPublishFailureStatus: buildPublishFailureStatus,
    buildScopedPublishSuccessMessage: buildScopedPublishSuccessMessage,
    buildScopedDownloadSummary: buildScopedDownloadSummary,
    buildScopedDownloadMessage: buildScopedDownloadMessage
  };
})();
