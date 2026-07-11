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

    async function parsePage(pageKey, extractor) {
      var pagePath = pages[pageKey];
      if (!pagePath) {
        pageResults[pageKey] = {
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
          success: true,
          importedFields: extracted.importedFields || [],
          warnings: extracted.warnings || []
        };
        mergedPatch = bridge.mergeImportPatches(mergedPatch, extracted.patch || {});
      } catch (error) {
        pageResults[pageKey] = {
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
    return {
      ok: report.failedPages.length < 3,
      patch: mergedPatch,
      report: report,
      message: report.message
    };
  }

  window.ConfiguratorLiveImporter = {
    importFromLivePages: importFromLivePages,
    defaultPageMap: defaultPageMap
  };
})();
