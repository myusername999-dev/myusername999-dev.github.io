(function () {
  "use strict";

  function byId(id) {
    return document.getElementById(id);
  }

  function setVisible(element, visible) {
    if (!element) {
      return;
    }
    element.style.display = visible ? "" : "none";
  }

  function run() {
    var params = new URLSearchParams(window.location.search);
    var panel = String(params.get("panel") || "").toLowerCase();
    if (!panel) {
      return;
    }

    var map = {
      colors: "panel-colors",
      fonts: "panel-fonts",
      buttons: "panel-buttons",
      logos: "panel-logos",
      publish: "panel-publish"
    };

    var targetId = map[panel];
    if (!targetId) {
      return;
    }

    ["panel-branding", "panel-colors", "panel-logos", "panel-fonts", "panel-buttons", "panel-layout", "panel-tabs"].forEach(function (id) {
      setVisible(byId(id), id === targetId);
    });

    if (targetId !== "panel-publish") {
      setVisible(byId("panel-publish"), true);
    }

    var target = byId(targetId);
    if (target) {
      target.scrollIntoView({ behavior: "auto", block: "start" });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
})();
