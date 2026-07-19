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
    var shouldUseUnderConstructionPage = typeof deps.shouldUseUnderConstructionPage === "function"
      ? deps.shouldUseUnderConstructionPage
      : function () { return false; };
    var buildUnderConstructionPageMarkup = typeof deps.buildUnderConstructionPageMarkup === "function"
      ? deps.buildUnderConstructionPageMarkup
      : null;
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
    if (shouldUseUnderConstructionPage(tab, config) && buildUnderConstructionPageMarkup) {
      var titleFallback = String((tab && tab.sectionTitle) || (tab && tab.label) || "Page");
      var siteFallback = String((config && config.brand && config.brand.name) || "VinATech");
      return [
        "<!doctype html>",
        "<html lang=\"en\">",
        "<head>",
        "  <meta charset=\"utf-8\">",
        "  <meta name=\"viewport\" content=\"width=device-width,initial-scale=1\">",
        "  <title>" + escapeHtml(titleFallback) + " - " + escapeHtml(siteFallback) + "</title>",
        "  <style>html,body{margin:0;padding:0;height:100%;width:100%;background:#000;overflow:hidden}</style>",
        "</head>",
        "<body>",
        buildUnderConstructionPageMarkup(tab, config, false),
        "</body>",
        "</html>"
      ].join("\n");
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

  function buildAssociatedPageMarkup(tab, config, draggable, dependencies) {
    var deps = dependencies || {};
    var isPrivacyDescriptor = typeof deps.isPrivacyPolicyDescriptor === "function"
      ? deps.isPrivacyPolicyDescriptor
      : isPrivacyPolicyDescriptor;
    var isContactDescriptorFn = typeof deps.isContactDescriptor === "function"
      ? deps.isContactDescriptor
      : isContactDescriptor;
    var shouldUseUnderConstructionPage = typeof deps.shouldUseUnderConstructionPage === "function"
      ? deps.shouldUseUnderConstructionPage
      : function () { return false; };
    var buildUnderConstructionPageMarkup = typeof deps.buildUnderConstructionPageMarkup === "function"
      ? deps.buildUnderConstructionPageMarkup
      : null;
    var normalizeHref = typeof deps.normalizePageHref === "function"
      ? deps.normalizePageHref
      : normalizePageHref;
    var buildExternalMarkup = typeof deps.buildExternalFilePreviewMarkup === "function"
      ? deps.buildExternalFilePreviewMarkup
      : function () { return ""; };
    var buildPrivacyPreviewHref = typeof deps.buildPrivacyPreviewHref === "function"
      ? deps.buildPrivacyPreviewHref
      : function (href) { return href; };
    var buildContactPreviewHref = typeof deps.buildContactPreviewHref === "function"
      ? deps.buildContactPreviewHref
      : function (href) { return href; };
    var deepClone = typeof deps.deepClone === "function"
      ? deps.deepClone
      : function (value) { return value; };
    var buildHomeMarkup = typeof deps.buildHomeMarkup === "function"
      ? deps.buildHomeMarkup
      : function () { return ""; };

    if (isPrivacyDescriptor(tab)) {
      var privacyHref = normalizeHref(tab && tab.fileName) || "privacy.html";
      return buildExternalMarkup(buildPrivacyPreviewHref(privacyHref, config));
    }
    if (isContactDescriptorFn(tab)) {
      var contactHref = normalizeHref(tab && tab.fileName) || "contact.html";
      return buildExternalMarkup(buildContactPreviewHref(contactHref, config));
    }

    if (shouldUseUnderConstructionPage(tab, config) && buildUnderConstructionPageMarkup) {
      return buildUnderConstructionPageMarkup(tab, config, draggable);
    }

    var pageConfig = deepClone(config);
    if (!pageConfig || typeof pageConfig !== "object") {
      pageConfig = {};
    }
    pageConfig.hero = pageConfig.hero || {};
    pageConfig.hero.title = String((tab && tab.sectionTitle) || (tab && tab.label) || "Page");
    pageConfig.hero.subtitle = String((tab && tab.sectionText) || "This page is under construction.");
    return buildHomeMarkup(pageConfig, draggable);
  }

  function buildAssociatedPublishedHtml(tab, config, dependencies) {
    return buildAssociatedTabPageHtml(tab, config, dependencies);
  }

  function getPreviewPageOptions(config, dependencies) {
    var deps = dependencies || {};
    var getDescriptors = typeof deps.getAssociatedPageDescriptors === "function"
      ? deps.getAssociatedPageDescriptors
      : getAssociatedPageDescriptors;
    var isFixedFile = typeof deps.isFixedPageFileName === "function"
      ? deps.isFixedPageFileName
      : isFixedPageFileName;

    var sourceConfig = config || {};
    var options = [{
      value: "home",
      label: "HOME (index.html)",
      page: null
    }];

    options.push({
      value: "page:privacy.html",
      label: "Privacy Policy (privacy.html)",
      page: {
        fileName: "privacy.html",
        sectionTitle: (sourceConfig.privacy && sourceConfig.privacy.title) || "Privacy Policy",
        label: "Privacy"
      }
    });

    options.push({
      value: "page:contact.html",
      label: "Contact (contact.html)",
      page: {
        fileName: "contact.html",
        sectionTitle: (sourceConfig.contact && sourceConfig.contact.title) || "Contact",
        label: "Contact"
      }
    });

    getDescriptors(sourceConfig).forEach(function (descriptor) {
      if (isFixedFile(descriptor && descriptor.fileName)) {
        return;
      }
      var descriptorFile = String((descriptor && descriptor.fileName) || "").toLowerCase();
      var descriptorLabel = String((descriptor && (descriptor.sectionTitle || descriptor.label)) || "").trim().toLowerCase();
      if (descriptorLabel === "contact" && descriptorFile !== "contact.html") {
        return;
      }
      options.push({
        value: "page:" + descriptor.fileName,
        label: String((descriptor.sectionTitle || descriptor.label || "Page")) + " (" + descriptor.fileName + ")",
        page: descriptor
      });
    });

    var underConstruction = sourceConfig.underConstruction || {};
    var selectedPages = Array.isArray(underConstruction.pages) ? underConstruction.pages : [];
    selectedPages.forEach(function (pageName) {
      var normalized = normalizePageHref(pageName);
      if (!normalized || isFixedFile(normalized)) {
        return;
      }
      var value = "page:" + normalized;
      var exists = options.some(function (option) {
        return option && option.value === value;
      });
      if (exists) {
        return;
      }

      var base = String(normalized).replace(/\.html?$/i, "");
      var label = base
        .split(/[-_\s]+/)
        .filter(Boolean)
        .map(function (part) {
          return part.charAt(0).toUpperCase() + part.slice(1);
        })
        .join(" ") || "Page";

      options.push({
        value: value,
        label: label + " (" + normalized + ")",
        page: {
          fileName: normalized,
          sectionTitle: label,
          sectionText: "This page is under construction.",
          label: label
        }
      });
    });

    return options;
  }

  function normalizePreviewPageValue(value, options) {
    var list = Array.isArray(options) ? options : [];
    var candidate = String(value || "home").trim();
    if (!candidate || candidate === "home") {
      return "home";
    }

    if (!/^page:/i.test(candidate)) {
      return "home";
    }

    for (var index = 0; index < list.length; index += 1) {
      if (list[index] && list[index].value === candidate) {
        return candidate;
      }
    }

    return "home";
  }

  function normalizePreviewPage(value, options, dependencies) {
    var deps = dependencies || {};
    var normalizeValue = typeof deps.normalizePreviewPageValue === "function"
      ? deps.normalizePreviewPageValue
      : normalizePreviewPageValue;
    var selectPage = typeof deps.selectPreviewPage === "function"
      ? deps.selectPreviewPage
      : selectPreviewPage;
    var selectedValue = normalizeValue(value, options);
    return selectPage(options, selectedValue);
  }

  function refreshPreviewPageOptions(currentPreviewPage, config, dependencies) {
    var deps = dependencies || {};
    var getOptions = typeof deps.getPreviewPageOptions === "function"
      ? deps.getPreviewPageOptions
      : getPreviewPageOptions;
    var normalizeValue = typeof deps.normalizePreviewPageValue === "function"
      ? deps.normalizePreviewPageValue
      : normalizePreviewPageValue;
    var escapeAttr = typeof deps.escapeAttr === "function"
      ? deps.escapeAttr
      : function (value) { return String(value || ""); };
    var escapeHtml = typeof deps.escapeHtml === "function"
      ? deps.escapeHtml
      : function (value) { return String(value || ""); };

    var options = getOptions(config || {});
    var optionsHtml = options
      .map(function (option) {
        return "<option value=\"" + escapeAttr(option.value) + "\">" + escapeHtml(option.label) + "</option>";
      })
      .join("");
    var selectedValue = normalizeValue(currentPreviewPage, options);

    return {
      options: options,
      optionsHtml: optionsHtml,
      selectedValue: selectedValue,
      changed: selectedValue !== String(currentPreviewPage || "")
    };
  }

  function resolvePreviewSelection(value, config, dependencies) {
    var deps = dependencies || {};
    var getOptions = typeof deps.getPreviewPageOptions === "function"
      ? deps.getPreviewPageOptions
      : getPreviewPageOptions;
    var normalizeValue = typeof deps.normalizePreviewPageValue === "function"
      ? deps.normalizePreviewPageValue
      : normalizePreviewPageValue;
    var selectPage = typeof deps.selectPreviewPage === "function"
      ? deps.selectPreviewPage
      : selectPreviewPage;

    var options = getOptions(config || {});
    var selectedValue = normalizeValue(value, options);
    return selectPage(options, selectedValue);
  }

  function resolvePreviewOpenPlan(previewSelection, config, dependencies) {
    var deps = dependencies || {};
    var selection = previewSelection || { value: "home", label: "HOME (index.html)", page: null };
    var isPrivacyDescriptor = typeof deps.isPrivacyPolicyDescriptor === "function"
      ? deps.isPrivacyPolicyDescriptor
      : isPrivacyPolicyDescriptor;
    var isContactDescriptorFn = typeof deps.isContactDescriptor === "function"
      ? deps.isContactDescriptor
      : isContactDescriptor;
    var normalizeHref = typeof deps.normalizePageHref === "function"
      ? deps.normalizePageHref
      : normalizePageHref;
    var buildPrivacyHref = typeof deps.buildPrivacyPreviewHref === "function"
      ? deps.buildPrivacyPreviewHref
      : function (href) { return href; };
    var buildContactHref = typeof deps.buildContactPreviewHref === "function"
      ? deps.buildContactPreviewHref
      : function (href) { return href; };
    var buildPublishedHtml = typeof deps.buildPublishedHtml === "function"
      ? deps.buildPublishedHtml
      : function () { return ""; };
    var buildAssociatedPublishedHtml = typeof deps.buildAssociatedPublishedHtml === "function"
      ? deps.buildAssociatedPublishedHtml
      : function () { return ""; };

    if (selection.value !== "home" && (isPrivacyDescriptor(selection.page) || isContactDescriptorFn(selection.page))) {
      var pageHref = normalizeHref(selection.page && selection.page.fileName)
        || (isPrivacyDescriptor(selection.page) ? "privacy.html" : "contact.html");
      var previewHref = isPrivacyDescriptor(selection.page)
        ? buildPrivacyHref(pageHref, config)
        : buildContactHref(pageHref, config);
      return {
        mode: "url",
        url: previewHref,
        label: String(selection.label || "Page")
      };
    }

    return {
      mode: "html",
      html: selection.value === "home"
        ? buildPublishedHtml(config)
        : buildAssociatedPublishedHtml(selection.page, config),
      label: String(selection.label || "Page")
    };
  }

  window.ConfiguratorPreviewBridge = {
    normalizePageHref: normalizePageHref,
    getAssociatedPageDescriptors: getAssociatedPageDescriptors,
    isPrivacyPolicyDescriptor: isPrivacyPolicyDescriptor,
    isContactDescriptor: isContactDescriptor,
    isFixedPageFileName: isFixedPageFileName,
    selectPreviewPage: selectPreviewPage,
    getAssociatedTabPages: getAssociatedTabPages,
    buildAssociatedTabPageHtml: buildAssociatedTabPageHtml,
    buildAssociatedPageMarkup: buildAssociatedPageMarkup,
    buildAssociatedPublishedHtml: buildAssociatedPublishedHtml,
    getPreviewPageOptions: getPreviewPageOptions,
    normalizePreviewPageValue: normalizePreviewPageValue,
    normalizePreviewPage: normalizePreviewPage,
    refreshPreviewPageOptions: refreshPreviewPageOptions,
    resolvePreviewSelection: resolvePreviewSelection,
    resolvePreviewOpenPlan: resolvePreviewOpenPlan
  };
})();
