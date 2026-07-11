(function () {
  "use strict";

  function normalizePageHref(value) {
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

  function getAssociatedPageDescriptors(config) {
    var sourceConfig = config || {};
    var tabs = Array.isArray(sourceConfig.tabs) ? sourceConfig.tabs : [];
    var heroButtons = sourceConfig.hero && Array.isArray(sourceConfig.hero.buttons)
      ? sourceConfig.hero.buttons
      : [];
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

    tabs.forEach(function (tab) {
      addPageFromHref(
        tab && tab.pageHref,
        (tab && (tab.sectionTitle || tab.label)) || "Page",
        (tab && tab.sectionText) || "This page is under construction."
      );
    });

    heroButtons.forEach(function (button, index) {
      var buttonTitle = String((button && button.label) || ("Page " + (index + 1)));
      addPageFromHref(button && button.href, buttonTitle, "This page is under construction.");
    });

    return Object.keys(pagesByFile).map(function (fileName) {
      return pagesByFile[fileName];
    });
  }

  function isPrivacyPolicyDescriptor(tab) {
    var fileName = String((tab && tab.fileName) || (tab && tab.pageHref) || "").toLowerCase();
    var title = String((tab && tab.sectionTitle) || (tab && tab.label) || "").toLowerCase();
    return fileName === "privacy.html" || title.indexOf("privacy") >= 0;
  }

  function isContactDescriptor(tab) {
    var fileName = String((tab && tab.fileName) || (tab && tab.pageHref) || "").toLowerCase();
    var title = String((tab && tab.sectionTitle) || (tab && tab.label) || "").toLowerCase();
    return fileName === "contact.html" || title === "contact" || title.indexOf("contact") === 0;
  }

  function isFixedPageFileName(fileName) {
    var normalized = String(fileName || "").toLowerCase();
    return normalized === "privacy.html" || normalized === "contact.html";
  }

  function selectPreviewPage(options, selectedValue) {
    var list = Array.isArray(options) ? options : [];
    for (var index = 0; index < list.length; index += 1) {
      if (list[index] && list[index].value === selectedValue) {
        return list[index];
      }
    }
    return list[0] || { value: "home", label: "HOME (index.html)", page: null };
  }

  window.ConfiguratorPreviewBridge = {
    normalizePageHref: normalizePageHref,
    getAssociatedPageDescriptors: getAssociatedPageDescriptors,
    isPrivacyPolicyDescriptor: isPrivacyPolicyDescriptor,
    isContactDescriptor: isContactDescriptor,
    isFixedPageFileName: isFixedPageFileName,
    selectPreviewPage: selectPreviewPage
  };
})();
