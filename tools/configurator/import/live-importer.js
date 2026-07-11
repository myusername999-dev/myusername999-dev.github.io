(function () {
  "use strict";

  function defaultPageMap() {
    return {
      home: "../../index.html",
      contact: "../../contact.html",
      privacy: "../../privacy.html"
    };
  }

  async function fetchPageHtml(fetchFn, url) {
    var response = await fetchFn(url);
    if (!response || !response.ok) {
      var status = response && typeof response.status !== "undefined" ? String(response.status) : "unknown";
      throw new Error("Failed to fetch " + url + " (status " + status + ")");
    }
    return response.text();
  }

  async function importFromLivePages(options) {
    var settings = options || {};
    var fetchFn = settings.fetchFn || (window.fetch && window.fetch.bind(window));
    var pages = settings.pages || defaultPageMap();
    var bridge = settings.bridge || window.ConfiguratorImportBridge;

    if (typeof fetchFn !== "function") {
      throw new Error("Fetch API is unavailable for live import.");
    }
    if (!bridge) {
      throw new Error("Import bridge is unavailable.");
    }

    var pageResults = {};
    var mergedPatch = {};

    function listUnresolvedFields(pageResult) {
      if (!pageResult || pageResult.success === false) {
        return [];
      }
      var imported = Array.isArray(pageResult.importedFields) ? pageResult.importedFields : [];
      var importedSet = {};
      imported.forEach(function (field) {
        importedSet[String(field)] = true;
      });

      var expectedByPage = {
        home: [
          "brand.name",
          "hero.title",
          "hero.subtitle",
          "theme.bgColor",
          "theme.textColor",
          "layout.nav",
          "layout.heroTitle",
          "layout.heroSubtitle",
          "layout.cta"
        ],
        contact: [
          "contact.title",
          "contact.intro",
          "contact.submitLabel",
          "contact.emailSubject",
          "contact.formEndpoint"
        ],
        privacy: [
          "privacy.title",
          "privacy.intro",
          "privacy.scopeText",
          "privacy.dataText",
          "privacy.noCookiesText",
          "privacy.noMarketingText",
          "privacy.howUseText",
          "privacy.enforcementText"
        ]
      };

      var expected = expectedByPage[pageResult.pageKey] || [];
      return expected.filter(function (field) {
        return !importedSet[field];
      });
    }

    function computeConfidence(pageResult) {
      if (!pageResult) {
        return "low";
      }
      if (pageResult.success === false) {
        return "low";
      }
      var importedCount = Array.isArray(pageResult.importedFields) ? pageResult.importedFields.length : 0;
      var warningCount = Array.isArray(pageResult.warnings) ? pageResult.warnings.length : 0;
      if (!importedCount || warningCount > 2) {
        return "low";
      }
      if (importedCount >= 6 && warningCount === 0) {
        return "high";
      }
      return "medium";
    }

    async function parsePage(pageKey, extractor) {
      var pagePath = pages[pageKey];
      if (!pagePath) {
        pageResults[pageKey] = {
          pageKey: pageKey,
          success: false,
          importedFields: [],
          warnings: ["Page path is not configured."]
        };
        return;
      }

      try {
        var html = await fetchPageHtml(fetchFn, pagePath);
        var extracted = extractor(html);
        pageResults[pageKey] = {
          pageKey: pageKey,
          success: true,
          importedFields: extracted.importedFields || [],
          warnings: extracted.warnings || []
        };
        mergedPatch = bridge.mergeImportPatches(mergedPatch, extracted.patch || {});
      } catch (error) {
        pageResults[pageKey] = {
          pageKey: pageKey,
          success: false,
          importedFields: [],
          warnings: [String(error && error.message || "Import failed.")]
        };
      }
    }

    await parsePage("home", bridge.extractHomePatch);
    await parsePage("contact", bridge.extractContactPatch);
    await parsePage("privacy", bridge.extractPrivacyPatch);

    var report = bridge.buildImportReport(pageResults);
    var diagnostics = {
      unresolvedFields: [],
      confidenceByPage: {},
      preservedByPolicy: [
        "layout.mobileNav",
        "layout.mobileHeroTitle",
        "layout.mobileHeroSubtitle",
        "layout.mobileCta",
        "tabs.*",
        "contact.fields"
      ]
    };

    Object.keys(pageResults).forEach(function (pageKey) {
      var pageResult = pageResults[pageKey];
      diagnostics.confidenceByPage[pageKey] = computeConfidence(pageResult);
      listUnresolvedFields(pageResult).forEach(function (field) {
        diagnostics.unresolvedFields.push(pageKey + ":" + field);
      });
    });

    return {
      ok: report.failedPages.length < 3,
      patch: mergedPatch,
      report: report,
      diagnostics: diagnostics,
      message: report.message
    };
  }

  window.ConfiguratorLiveImporter = {
    importFromLivePages: importFromLivePages,
    defaultPageMap: defaultPageMap
  };
})();
