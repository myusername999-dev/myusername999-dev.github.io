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

  function getAssociatedTabPages(config, dependencies) {
    var deps = dependencies || {};
    var descriptors = getAssociatedPageDescriptors(config);
    var isPrivacyDescriptor = typeof deps.isPrivacyPolicyDescriptor === "function"
      ? deps.isPrivacyPolicyDescriptor
      : isPrivacyPolicyDescriptor;
    var buildPageHtml = typeof deps.buildAssociatedTabPageHtml === "function"
      ? deps.buildAssociatedTabPageHtml
      : null;

    return descriptors
      .filter(function (descriptor) {
        return !isPrivacyDescriptor(descriptor);
      })
      .map(function (descriptor) {
        return {
          fileName: descriptor.fileName,
          html: buildPageHtml ? buildPageHtml(descriptor, config) : ""
        };
      });
  }

  function buildAssociatedTabPageHtml(tab, config, dependencies) {
    var deps = dependencies || {};
    var isPrivacyDescriptor = typeof deps.isPrivacyPolicyDescriptor === "function"
      ? deps.isPrivacyPolicyDescriptor
      : isPrivacyPolicyDescriptor;
    var isContactDescriptorFn = typeof deps.isContactDescriptor === "function"
      ? deps.isContactDescriptor
      : isContactDescriptor;
    var buildPrivacyHtml = typeof deps.buildPrivacyPolicyPageHtml === "function"
      ? deps.buildPrivacyPolicyPageHtml
      : null;
    var buildContactHtml = typeof deps.buildContactPageHtml === "function"
      ? deps.buildContactPageHtml
      : null;
    var escapeHtml = typeof deps.escapeHtml === "function"
      ? deps.escapeHtml
      : function (value) { return String(value || ""); };
    var getAllFontsHref = typeof deps.getAllFontsHref === "function"
      ? deps.getAllFontsHref
      : function () { return ""; };
    var buildAssociatedPageMarkup = typeof deps.buildAssociatedPageMarkup === "function"
      ? deps.buildAssociatedPageMarkup
      : function () { return ""; };

    if (isPrivacyDescriptor(tab) && buildPrivacyHtml) {
      return buildPrivacyHtml(config);
    }
    if (isContactDescriptorFn(tab) && buildContactHtml) {
      return buildContactHtml(config);
    }

    var title = String((tab && tab.sectionTitle) || (tab && tab.label) || "Page");
    var site = String((config && config.brand && config.brand.name) || "VinATech");

    return [
      "<!doctype html>",
      "<html lang=\"en\">",
      "<head>",
      "  <meta charset=\"utf-8\">",
      "  <meta name=\"viewport\" content=\"width=device-width,initial-scale=1\">",
      "  <title>" + escapeHtml(title) + " - " + escapeHtml(site) + "</title>",
      "  <link rel=\"preconnect\" href=\"https://fonts.googleapis.com\">",
      "  <link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin>",
      "  <link href=\"" + getAllFontsHref() + "\" rel=\"stylesheet\">",
      "  <link rel=\"stylesheet\" href=\"css/components/home/reset-shell.css\">",
      "  <link rel=\"stylesheet\" href=\"css/components/home/navigation.css\">",
      "  <link rel=\"stylesheet\" href=\"css/components/home/hero-cta.css\">",
      "  <link rel=\"stylesheet\" href=\"css/components/home/cards-footer.css\">",
      "  <link rel=\"stylesheet\" href=\"css/components/home/mobile.css\">",
      "</head>",
      "<body>",
      buildAssociatedPageMarkup(tab, config, false),
      "<script src=\"js/pages/home.runtime.js\"></script>",
      "</body>",
      "</html>"
    ].join("\n");
  }

  window.ConfiguratorPreviewBridge = {
    normalizePageHref: normalizePageHref,
    getAssociatedPageDescriptors: getAssociatedPageDescriptors,
    isPrivacyPolicyDescriptor: isPrivacyPolicyDescriptor,
    isContactDescriptor: isContactDescriptor,
    isFixedPageFileName: isFixedPageFileName,
    selectPreviewPage: selectPreviewPage,
    getAssociatedTabPages: getAssociatedTabPages,
    buildAssociatedTabPageHtml: buildAssociatedTabPageHtml
  };
})();
