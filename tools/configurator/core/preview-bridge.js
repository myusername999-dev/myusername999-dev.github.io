(function () {
  "use strict";

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
    isPrivacyPolicyDescriptor: isPrivacyPolicyDescriptor,
    isContactDescriptor: isContactDescriptor,
    isFixedPageFileName: isFixedPageFileName,
    selectPreviewPage: selectPreviewPage
  };
})();
