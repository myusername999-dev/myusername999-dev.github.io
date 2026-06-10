(function () {
  "use strict";

  var STORAGE_KEY = "home-config-draft-v1";
  var LAST_PUBLISHED_KEY = "home-config-last-published-v1";
  var FONT_FAMILIES = [
    "Sora",
    "Space Grotesk",
    "Manrope",
    "Plus Jakarta Sans",
    "Outfit",
    "DM Sans",
    "Archivo",
    "Karla",
    "Merriweather",
    "Playfair Display",
    "Cormorant Garamond",
    "Bricolage Grotesque"
  ];

  var defaultConfig = {
    brand: {
      name: "VinATech",
      logoSrc: "",
      logoFileName: "",
      logos: createDefaultLogos()
    },
    hero: {
      title: "We Build Financial Software With Human Clarity",
      subtitle: "Experiment with colors, typography, and layout to shape your homepage before publishing.",
      buttons: [
        {
          label: "Explore Products",
          href: "products.html"
        }
      ]
    },
    theme: {
      fontFamily: "Sora",
      headingSize: 64,
      bodySize: 18,
      buttonTextSize: 16,
      bgColor: "#f2f7f3",
      textColor: "#102822",
      accentColor: "#0f7b6c",
      mutedColor: "#4f6962",
      surfaceColor: "#e5f0ea",
      buttonTextColor: "#ffffff"
    },
    background: {
      src: "",
      fileName: "",
      transparency: 32,
      x: 52,
      y: 20
    },
    layout: {
      logo: { x: 0, y: 0 },
      nav: { x: 0, y: 0 },
      hero: { x: 0, y: 0 },
      cta: { x: 0, y: 0 }
    },
    tabs: [
      {
        label: "About",
        sectionId: "about",
        sectionTitle: "About",
        sectionText: "Describe who you are, what the company stands for, and why your approach is different.",
        sectionFontFamily: "",
        sectionTitleColor: "#102822",
        sectionTextColor: "#4f6962",
        sectionBackgroundColor: "#e5f0ea",
        navFontFamily: "",
        navTextColor: "#102822",
        navBackgroundColor: "#e5f0ea",
        sectionBackgroundSrc: "",
        sectionBackgroundFileName: "",
        sectionBackgroundTransparency: 36,
        galleryLayout: "horizontal",
        galleryImageTransparency: 0,
        galleryImages: [
          { src: "", fileName: "" },
          { src: "", fileName: "" },
          { src: "", fileName: "" },
          { src: "", fileName: "" }
        ]
      },
      {
        label: "Products",
        sectionId: "products",
        sectionTitle: "Products",
        sectionText: "Summarize your core products and the value each one delivers for clients.",
        sectionFontFamily: "",
        sectionTitleColor: "#102822",
        sectionTextColor: "#4f6962",
        sectionBackgroundColor: "#e5f0ea",
        navFontFamily: "",
        navTextColor: "#102822",
        navBackgroundColor: "#e5f0ea",
        sectionBackgroundSrc: "",
        sectionBackgroundFileName: "",
        sectionBackgroundTransparency: 36,
        galleryLayout: "horizontal",
        galleryImageTransparency: 0,
        galleryImages: [
          { src: "", fileName: "" },
          { src: "", fileName: "" },
          { src: "", fileName: "" },
          { src: "", fileName: "" }
        ]
      },
      {
        label: "Privacy",
        sectionId: "privacy",
        sectionTitle: "Privacy",
        sectionText: "Explain privacy and compliance commitments in simple language people can trust.",
        sectionFontFamily: "",
        sectionTitleColor: "#102822",
        sectionTextColor: "#4f6962",
        sectionBackgroundColor: "#e5f0ea",
        navFontFamily: "",
        navTextColor: "#102822",
        navBackgroundColor: "#e5f0ea",
        sectionBackgroundSrc: "",
        sectionBackgroundFileName: "",
        sectionBackgroundTransparency: 36,
        galleryLayout: "horizontal",
        galleryImageTransparency: 0,
        galleryImages: [
          { src: "", fileName: "" },
          { src: "", fileName: "" },
          { src: "", fileName: "" },
          { src: "", fileName: "" }
        ]
      }
    ]
  };

  var state = loadState();
  var dom = {};
  var previewRenderFrame = 0;
  var previewRenderTimeout = 0;

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    collectDom();
    sanitizeState();
    bindCoreInputs();
    bindActions();
    syncInputsFromState();
    renderButtonsEditor();
    renderTabsEditor();
    renderPreview();
    setStatus("Draft loaded. Make edits and review in preview.", false);
  }

  function collectDom() {
    dom.brandName = document.getElementById("brandName");
    dom.heroTitle = document.getElementById("heroTitle");
    dom.heroSubtitle = document.getElementById("heroSubtitle");
    dom.logo1Input = document.getElementById("logo1Input");
    dom.logo2Input = document.getElementById("logo2Input");
    dom.backgroundInput = document.getElementById("backgroundInput");
    dom.clearLogo1 = document.getElementById("clearLogo1");
    dom.clearLogo2 = document.getElementById("clearLogo2");
    dom.clearBackground = document.getElementById("clearBackground");

    dom.fontFamily = document.getElementById("fontFamily");
    dom.headingSize = document.getElementById("headingSize");
    dom.bodySize = document.getElementById("bodySize");
    dom.buttonTextSize = document.getElementById("buttonTextSize");
    dom.headingSizeValue = document.getElementById("headingSizeValue");
    dom.bodySizeValue = document.getElementById("bodySizeValue");
    dom.buttonTextSizeValue = document.getElementById("buttonTextSizeValue");

    dom.bgColor = document.getElementById("bgColor");
    dom.textColor = document.getElementById("textColor");
    dom.accentColor = document.getElementById("accentColor");
    dom.mutedColor = document.getElementById("mutedColor");
    dom.surfaceColor = document.getElementById("surfaceColor");
    dom.buttonTextColor = document.getElementById("buttonTextColor");

    dom.logo1X = document.getElementById("logo1X");
    dom.logo1Y = document.getElementById("logo1Y");
    dom.logo1Size = document.getElementById("logo1Size");
    dom.logo1Rotation = document.getElementById("logo1Rotation");
    dom.logo1Transparency = document.getElementById("logo1Transparency");
    dom.logo2X = document.getElementById("logo2X");
    dom.logo2Y = document.getElementById("logo2Y");
    dom.logo2Size = document.getElementById("logo2Size");
    dom.logo2Rotation = document.getElementById("logo2Rotation");
    dom.logo2Transparency = document.getElementById("logo2Transparency");
    dom.navX = document.getElementById("navX");
    dom.navY = document.getElementById("navY");
    dom.heroX = document.getElementById("heroX");
    dom.heroY = document.getElementById("heroY");
    dom.ctaX = document.getElementById("ctaX");
    dom.ctaY = document.getElementById("ctaY");
    dom.bgX = document.getElementById("bgX");
    dom.bgY = document.getElementById("bgY");
    dom.bgTransparency = document.getElementById("bgTransparency");
    dom.bgTransparencyValue = document.getElementById("bgTransparencyValue");

    dom.tabsEditor = document.getElementById("tabsEditor");
    dom.buttonsEditor = document.getElementById("buttonsEditor");
    dom.addButton = document.getElementById("addButton");
    dom.addTab = document.getElementById("addTab");

    dom.previewHome = document.getElementById("previewHome");
    dom.publishHome = document.getElementById("publishHome");
    dom.exportDraft = document.getElementById("exportDraft");
    dom.importDraft = document.getElementById("importDraft");
    dom.resetDraft = document.getElementById("resetDraft");
    dom.approval = document.getElementById("approval");
    dom.statusMessage = document.getElementById("statusMessage");
    dom.previewViewport = document.getElementById("previewViewport");
  }

  function bindCoreInputs() {
    bindText(dom.brandName, function (value) {
      state.brand.name = value;
    });
    bindText(dom.heroTitle, function (value) {
      state.hero.title = value;
    });
    bindText(dom.heroSubtitle, function (value) {
      state.hero.subtitle = value;
    });

    bindText(dom.fontFamily, function (value) {
      state.theme.fontFamily = value;
    }, "change");

    bindNumber(dom.headingSize, function (value) {
      state.theme.headingSize = clamp(value, 32, 120);
    });
    bindNumber(dom.bodySize, function (value) {
      state.theme.bodySize = clamp(value, 12, 32);
    });
    bindNumber(dom.buttonTextSize, function (value) {
      state.theme.buttonTextSize = clamp(value, 12, 32);
    });

    bindText(dom.bgColor, function (value) {
      state.theme.bgColor = value;
    }, "input");
    bindText(dom.textColor, function (value) {
      state.theme.textColor = value;
    }, "input");
    bindText(dom.accentColor, function (value) {
      state.theme.accentColor = value;
    }, "input");
    bindText(dom.mutedColor, function (value) {
      state.theme.mutedColor = value;
    }, "input");
    bindText(dom.surfaceColor, function (value) {
      state.theme.surfaceColor = value;
    }, "input");
    bindText(dom.buttonTextColor, function (value) {
      state.theme.buttonTextColor = value;
    }, "input");

    bindNumber(dom.logo1X, function (value) {
      state.brand.logos[0].x = value;
    });
    bindNumber(dom.logo1Y, function (value) {
      state.brand.logos[0].y = value;
    });
    bindNumber(dom.logo1Size, function (value) {
      setLogoSize(0, value, true);
    });
    bindNumber(dom.logo1Rotation, function (value) {
      state.brand.logos[0].rotation = normalizeRotation(value);
    });
    bindNumber(dom.logo1Transparency, function (value) {
      state.brand.logos[0].transparency = clamp(value, 0, 95);
    });
    bindNumber(dom.logo2X, function (value) {
      state.brand.logos[1].x = value;
    });
    bindNumber(dom.logo2Y, function (value) {
      state.brand.logos[1].y = value;
    });
    bindNumber(dom.logo2Size, function (value) {
      setLogoSize(1, value, true);
    });
    bindNumber(dom.logo2Rotation, function (value) {
      state.brand.logos[1].rotation = normalizeRotation(value);
    });
    bindNumber(dom.logo2Transparency, function (value) {
      state.brand.logos[1].transparency = clamp(value, 0, 95);
    });
    bindNumber(dom.navX, function (value) {
      state.layout.nav.x = value;
    });
    bindNumber(dom.navY, function (value) {
      state.layout.nav.y = value;
    });
    bindNumber(dom.heroX, function (value) {
      state.layout.hero.x = value;
    });
    bindNumber(dom.heroY, function (value) {
      state.layout.hero.y = value;
    });
    bindNumber(dom.ctaX, function (value) {
      state.layout.cta.x = value;
    });
    bindNumber(dom.ctaY, function (value) {
      state.layout.cta.y = value;
    });
    bindNumber(dom.bgX, function (value) {
      state.background.x = clamp(value, 0, 100);
    });
    bindNumber(dom.bgY, function (value) {
      state.background.y = clamp(value, 0, 100);
    });
    bindNumber(dom.bgTransparency, function (value) {
      state.background.transparency = clamp(value, 0, 95);
    });

    dom.logo1Input.addEventListener("change", function (event) {
      handleImageUpload(event, function (asset) {
        state.brand.logos[0].src = asset.src;
        state.brand.logos[0].fileName = asset.fileName;
        state.brand.logoSrc = asset.src;
        state.brand.logoFileName = asset.fileName;
      });
    });

    dom.logo2Input.addEventListener("change", function (event) {
      handleImageUpload(event, function (asset) {
        state.brand.logos[1].src = asset.src;
        state.brand.logos[1].fileName = asset.fileName;
      });
    });

    dom.backgroundInput.addEventListener("change", function (event) {
      handleImageUpload(event, function (asset) {
        state.background.src = asset.src;
        state.background.fileName = asset.fileName;
      });
    });

    dom.clearLogo1.addEventListener("click", function () {
      state.brand.logos[0].src = "";
      state.brand.logos[0].fileName = "";
      state.brand.logoSrc = "";
      state.brand.logoFileName = "";
      dom.logo1Input.value = "";
      refresh("Logo 1 removed from draft.");
    });

    dom.clearLogo2.addEventListener("click", function () {
      state.brand.logos[1].src = "";
      state.brand.logos[1].fileName = "";
      dom.logo2Input.value = "";
      refresh("Logo 2 removed from draft.");
    });

    dom.clearBackground.addEventListener("click", function () {
      state.background.src = "";
      state.background.fileName = "";
      dom.backgroundInput.value = "";
      refresh("Background removed from draft.");
    });
  }

  function bindActions() {
    dom.addButton.addEventListener("click", function () {
      var nextIndex = state.hero.buttons.length + 1;
      state.hero.buttons.push({
        label: "Button " + nextIndex,
        href: "#"
      });
      refresh("Action button added.");
    });

    dom.addTab.addEventListener("click", function () {
      var nextIndex = state.tabs.length + 1;
      state.tabs.push({
        label: "New Tab " + nextIndex,
        sectionId: uniqueSectionId("new-tab-" + nextIndex),
        sectionTitle: "New Section " + nextIndex,
        sectionText: "Add content for this section before publishing.",
        sectionFontFamily: "",
        sectionTitleColor: state.theme.textColor,
        sectionTextColor: state.theme.mutedColor,
        sectionBackgroundColor: state.theme.surfaceColor,
        navFontFamily: "",
        navTextColor: state.theme.textColor,
        navBackgroundColor: state.theme.surfaceColor,
        sectionBackgroundSrc: "",
        sectionBackgroundFileName: "",
        sectionBackgroundTransparency: 36,
        galleryLayout: "horizontal",
        galleryImageTransparency: 0,
        galleryImages: createEmptyGallery()
      });
      refresh("Tab added. Update the new tab details.");
    });

    dom.previewHome.addEventListener("click", function () {
      openPreviewWindow();
    });

    dom.publishHome.addEventListener("click", function () {
      handlePublish();
    });

    dom.exportDraft.addEventListener("click", function () {
      exportDraft();
    });

    dom.importDraft.addEventListener("change", function (event) {
      importDraft(event);
    });

    dom.resetDraft.addEventListener("click", function () {
      if (!window.confirm("Reset all draft settings to default values?")) {
        return;
      }
      state = deepClone(defaultConfig);
      refresh("Draft reset to defaults.");
      dom.approval.checked = false;
    });
  }

  function bindText(element, setter, eventName) {
    var inputEvent = eventName || "input";
    element.addEventListener(inputEvent, function () {
      setter(element.value);
      refresh();
    });
  }

  function bindNumber(element, setter) {
    element.addEventListener("input", function () {
      var numericValue = parseInt(element.value, 10);
      if (Number.isNaN(numericValue)) {
        return;
      }
      setter(numericValue);
      if (element.type === "range") {
        refresh();
        return;
      }
      saveAndPreview();
    });

    if (element.type === "number") {
      element.addEventListener("change", function () {
        refresh();
      });
    }
  }

  function handleImageUpload(event, callback) {
    var file = event.target.files && event.target.files[0];
    if (!file) {
      return;
    }
    var reader = new FileReader();
    reader.onload = function (loadEvent) {
      callback({
        src: String(loadEvent.target.result || ""),
        fileName: sanitizeFileName(file.name)
      });
      refresh(file.name + " loaded into draft.");
    };
    reader.readAsDataURL(file);
  }

  function refresh(message) {
    sanitizeState();
    saveState();
    syncInputsFromState();
    renderButtonsEditor();
    renderTabsEditor();
    schedulePreviewRender();
    if (message) {
      setStatus(message, false);
    }
  }

  function saveAndPreview() {
    saveState();
    schedulePreviewRender();
  }

  function schedulePreviewRender() {
    if (previewRenderFrame) {
      cancelAnimationFrame(previewRenderFrame);
    }
    if (previewRenderTimeout) {
      clearTimeout(previewRenderTimeout);
      previewRenderTimeout = 0;
    }
    previewRenderFrame = requestAnimationFrame(function () {
      previewRenderFrame = 0;
      if (previewRenderTimeout) {
        clearTimeout(previewRenderTimeout);
        previewRenderTimeout = 0;
      }
      renderPreview();
    });

    previewRenderTimeout = window.setTimeout(function () {
      if (previewRenderFrame) {
        cancelAnimationFrame(previewRenderFrame);
        previewRenderFrame = 0;
        renderPreview();
      }
      previewRenderTimeout = 0;
    }, 80);
  }

  function syncInputsFromState() {
    dom.brandName.value = state.brand.name;
    dom.heroTitle.value = state.hero.title;
    dom.heroSubtitle.value = state.hero.subtitle;

    dom.fontFamily.value = state.theme.fontFamily;
    dom.headingSize.value = String(state.theme.headingSize);
    dom.bodySize.value = String(state.theme.bodySize);
    dom.buttonTextSize.value = String(state.theme.buttonTextSize);
    dom.headingSizeValue.textContent = state.theme.headingSize + "px";
    dom.bodySizeValue.textContent = state.theme.bodySize + "px";
    dom.buttonTextSizeValue.textContent = state.theme.buttonTextSize + "px";

    dom.bgColor.value = normalizeHex(state.theme.bgColor, "#f2f7f3");
    dom.textColor.value = normalizeHex(state.theme.textColor, "#102822");
    dom.accentColor.value = normalizeHex(state.theme.accentColor, "#0f7b6c");
    dom.mutedColor.value = normalizeHex(state.theme.mutedColor, "#4f6962");
    dom.surfaceColor.value = normalizeHex(state.theme.surfaceColor, "#e5f0ea");
    dom.buttonTextColor.value = normalizeHex(state.theme.buttonTextColor, "#ffffff");

    dom.logo1X.value = String(state.brand.logos[0].x);
    dom.logo1Y.value = String(state.brand.logos[0].y);
    dom.logo1Size.value = String(state.brand.logos[0].size);
    dom.logo1Rotation.value = String(state.brand.logos[0].rotation);
    dom.logo1Transparency.value = String(state.brand.logos[0].transparency);
    dom.logo2X.value = String(state.brand.logos[1].x);
    dom.logo2Y.value = String(state.brand.logos[1].y);
    dom.logo2Size.value = String(state.brand.logos[1].size);
    dom.logo2Rotation.value = String(state.brand.logos[1].rotation);
    dom.logo2Transparency.value = String(state.brand.logos[1].transparency);
    dom.navX.value = String(state.layout.nav.x);
    dom.navY.value = String(state.layout.nav.y);
    dom.heroX.value = String(state.layout.hero.x);
    dom.heroY.value = String(state.layout.hero.y);
    dom.ctaX.value = String(state.layout.cta.x);
    dom.ctaY.value = String(state.layout.cta.y);
    dom.bgX.value = String(state.background.x);
    dom.bgY.value = String(state.background.y);
    dom.bgTransparency.value = String(state.background.transparency);
    dom.bgTransparencyValue.textContent = state.background.transparency + "%";
  }

  function renderButtonsEditor() {
    dom.buttonsEditor.innerHTML = state.hero.buttons
      .map(function (button, index) {
        return [
          "<div class=\"tab-row\" data-button-index=\"" + index + "\">",
          "<div class=\"tab-row-head\">",
          "<strong>Button " + (index + 1) + "</strong>",
          "<div class=\"tab-actions\">",
          "<button type=\"button\" data-action=\"up\">Up</button>",
          "<button type=\"button\" data-action=\"down\">Down</button>",
          "<button type=\"button\" data-action=\"remove\" class=\"danger\">Remove</button>",
          "</div>",
          "</div>",
          "<label>Button Label<input type=\"text\" data-field=\"label\" value=\"" + escapeAttr(button.label) + "\"></label>",
          "<label>Button Link<input type=\"text\" data-field=\"href\" value=\"" + escapeAttr(button.href) + "\" placeholder=\"products.html\"></label>",
          "</div>"
        ].join("");
      })
      .join("");

    var rows = dom.buttonsEditor.querySelectorAll(".tab-row");
    rows.forEach(function (row) {
      var index = parseInt(row.getAttribute("data-button-index"), 10);
      var inputs = row.querySelectorAll("input[data-field]");
      inputs.forEach(function (input) {
        var onFieldChange = function () {
          var field = String(input.getAttribute("data-field") || "");
          state.hero.buttons[index][field] = input.value;
          saveAndPreview();
        };
        input.addEventListener("input", onFieldChange);
        input.addEventListener("change", onFieldChange);
      });

      var controls = row.querySelectorAll("button[data-action]");
      controls.forEach(function (buttonControl) {
        buttonControl.addEventListener("click", function () {
          var action = String(buttonControl.getAttribute("data-action") || "");
          if (action === "remove") {
            state.hero.buttons.splice(index, 1);
            if (!state.hero.buttons.length) {
              state.hero.buttons.push({
                label: "Explore Products",
                href: "products.html"
              });
            }
            refresh("Action button removed.");
            return;
          }
          if (action === "up" && index > 0) {
            swapArrayItems(state.hero.buttons, index, index - 1);
            refresh();
            return;
          }
          if (action === "down" && index < state.hero.buttons.length - 1) {
            swapArrayItems(state.hero.buttons, index, index + 1);
            refresh();
          }
        });
      });
    });
  }

  function renderTabsEditor() {
    dom.tabsEditor.innerHTML = state.tabs
      .map(function (tab, index) {
        return [
          "<div class=\"tab-row\" data-tab-index=\"" + index + "\">",
          "<div class=\"tab-row-head\">",
          "<strong>Tab " + (index + 1) + "</strong>",
          "<div class=\"tab-actions\">",
          "<button type=\"button\" data-action=\"up\">Up</button>",
          "<button type=\"button\" data-action=\"down\">Down</button>",
          "<button type=\"button\" data-action=\"remove\" class=\"danger\">Remove</button>",
          "</div>",
          "</div>",
          "<label>Label<input type=\"text\" data-field=\"label\" value=\"" + escapeAttr(tab.label) + "\"></label>",
          "<label>Section Id<input type=\"text\" data-field=\"sectionId\" value=\"" + escapeAttr(tab.sectionId) + "\"></label>",
          "<label>Section Title<input type=\"text\" data-field=\"sectionTitle\" value=\"" + escapeAttr(tab.sectionTitle) + "\"></label>",
          "<label>Section Text<textarea rows=\"2\" data-field=\"sectionText\">" + escapeHtml(tab.sectionText) + "</textarea></label>",
          "<label>Section Font Family<select data-field=\"sectionFontFamily\">" + fontOptionsMarkup(tab.sectionFontFamily, true) + "</select></label>",
          "<label>Section Title Color<input type=\"color\" data-field=\"sectionTitleColor\" value=\"" + escapeAttr(tab.sectionTitleColor) + "\"></label>",
          "<label>Section Text Color<input type=\"color\" data-field=\"sectionTextColor\" value=\"" + escapeAttr(tab.sectionTextColor) + "\"></label>",
          "<label>Section Card Color<input type=\"color\" data-field=\"sectionBackgroundColor\" value=\"" + escapeAttr(tab.sectionBackgroundColor) + "\"></label>",
          "<label>Tab Background Image<input type=\"file\" accept=\"image/*\" data-file-role=\"tab-bg\"></label>",
          "<p class=\"hint\">Current background: " + escapeHtml(tab.sectionBackgroundFileName || "not set") + "</p>",
          "<label>Tab Background Transparency (%)<input type=\"range\" min=\"0\" max=\"95\" step=\"1\" data-field=\"sectionBackgroundTransparency\" data-value-id=\"tabBgTransparencyValue-" + index + "\" value=\"" + escapeAttr(String(normalizeTabImageTransparency(tab.sectionBackgroundTransparency, 36))) + "\"><span id=\"tabBgTransparencyValue-" + index + "\" class=\"value-pill\">" + escapeHtml(String(normalizeTabImageTransparency(tab.sectionBackgroundTransparency, 36))) + "%</span></label>",
          "<button type=\"button\" data-action=\"clear-tab-bg\">Clear Tab Background</button>",
          "<label>Tab Gallery Layout<select data-field=\"galleryLayout\">" + galleryLayoutOptionsMarkup(tab.galleryLayout) + "</select></label>",
          "<label>Tab Gallery Image Transparency (%)<input type=\"range\" min=\"0\" max=\"95\" step=\"1\" data-field=\"galleryImageTransparency\" data-value-id=\"tabGalleryTransparencyValue-" + index + "\" value=\"" + escapeAttr(String(normalizeTabImageTransparency(tab.galleryImageTransparency, 0))) + "\"><span id=\"tabGalleryTransparencyValue-" + index + "\" class=\"value-pill\">" + escapeHtml(String(normalizeTabImageTransparency(tab.galleryImageTransparency, 0))) + "%</span></label>",
          "<label>Gallery Image 1<input type=\"file\" accept=\"image/*\" data-file-role=\"gallery\" data-gallery-index=\"0\"></label>",
          "<p class=\"hint\">Image 1: " + escapeHtml(getGalleryFileName(tab, 0)) + "</p>",
          "<button type=\"button\" data-action=\"clear-gallery\" data-gallery-index=\"0\">Clear Image 1</button>",
          "<label>Gallery Image 2<input type=\"file\" accept=\"image/*\" data-file-role=\"gallery\" data-gallery-index=\"1\"></label>",
          "<p class=\"hint\">Image 2: " + escapeHtml(getGalleryFileName(tab, 1)) + "</p>",
          "<button type=\"button\" data-action=\"clear-gallery\" data-gallery-index=\"1\">Clear Image 2</button>",
          "<label>Gallery Image 3<input type=\"file\" accept=\"image/*\" data-file-role=\"gallery\" data-gallery-index=\"2\"></label>",
          "<p class=\"hint\">Image 3: " + escapeHtml(getGalleryFileName(tab, 2)) + "</p>",
          "<button type=\"button\" data-action=\"clear-gallery\" data-gallery-index=\"2\">Clear Image 3</button>",
          "<label>Gallery Image 4<input type=\"file\" accept=\"image/*\" data-file-role=\"gallery\" data-gallery-index=\"3\"></label>",
          "<p class=\"hint\">Image 4: " + escapeHtml(getGalleryFileName(tab, 3)) + "</p>",
          "<button type=\"button\" data-action=\"clear-gallery\" data-gallery-index=\"3\">Clear Image 4</button>",
          "<label>Tab Pill Font Family<select data-field=\"navFontFamily\">" + fontOptionsMarkup(tab.navFontFamily, true) + "</select></label>",
          "<label>Tab Pill Text Color<input type=\"color\" data-field=\"navTextColor\" value=\"" + escapeAttr(tab.navTextColor) + "\"></label>",
          "<label>Tab Pill Background<input type=\"color\" data-field=\"navBackgroundColor\" value=\"" + escapeAttr(tab.navBackgroundColor) + "\"></label>",
          "</div>"
        ].join("");
      })
      .join("");

    var rows = dom.tabsEditor.querySelectorAll(".tab-row");
    rows.forEach(function (row) {
      var index = parseInt(row.getAttribute("data-tab-index"), 10);
      var inputs = row.querySelectorAll("input[data-field], textarea[data-field], select[data-field]");
      inputs.forEach(function (input) {
        var onFieldChange = function () {
          var field = String(input.getAttribute("data-field") || "");
          state.tabs[index][field] = input.value;
          var valueTargetId = String(input.getAttribute("data-value-id") || "");
          if (valueTargetId) {
            var valueTarget = row.querySelector("#" + valueTargetId);
            if (valueTarget) {
              valueTarget.textContent = String(input.value || "0") + "%";
            }
          }
          if (field === "label" && !state.tabs[index].sectionTitle) {
            state.tabs[index].sectionTitle = input.value;
          }
          if (field === "sectionId") {
            state.tabs[index].sectionId = slugify(input.value) || uniqueSectionId("section");
            input.value = state.tabs[index].sectionId;
          }
          saveAndPreview();
        };
        input.addEventListener("input", onFieldChange);
        input.addEventListener("change", onFieldChange);
      });

      var fileInputs = row.querySelectorAll("input[type='file'][data-file-role]");
      fileInputs.forEach(function (fileInput) {
        fileInput.addEventListener("change", function (event) {
          var role = String(fileInput.getAttribute("data-file-role") || "");
          if (role === "tab-bg") {
            handleImageUpload(event, function (asset) {
              state.tabs[index].sectionBackgroundSrc = asset.src;
              state.tabs[index].sectionBackgroundFileName = asset.fileName;
            });
            return;
          }
          if (role === "gallery") {
            var galleryIndex = clamp(parseInt(fileInput.getAttribute("data-gallery-index"), 10) || 0, 0, 3);
            handleImageUpload(event, function (asset) {
              ensureGallerySlots(state.tabs[index]);
              state.tabs[index].galleryImages[galleryIndex] = {
                src: asset.src,
                fileName: asset.fileName
              };
            });
          }
        });
      });

      var controls = row.querySelectorAll("button[data-action]");
      controls.forEach(function (button) {
        button.addEventListener("click", function () {
          var action = String(button.getAttribute("data-action") || "");
          if (action === "clear-tab-bg") {
            state.tabs[index].sectionBackgroundSrc = "";
            state.tabs[index].sectionBackgroundFileName = "";
            refresh("Tab background removed.");
            return;
          }
          if (action === "clear-gallery") {
            var galleryIndex = clamp(parseInt(button.getAttribute("data-gallery-index"), 10) || 0, 0, 3);
            ensureGallerySlots(state.tabs[index]);
            state.tabs[index].galleryImages[galleryIndex] = { src: "", fileName: "" };
            refresh("Gallery image removed.");
            return;
          }
          if (action === "remove") {
            state.tabs.splice(index, 1);
            if (!state.tabs.length) {
              state.tabs.push({
                label: "Home",
                sectionId: "home",
                sectionTitle: "Home",
                sectionText: "Describe this section.",
                sectionFontFamily: "",
                sectionTitleColor: state.theme.textColor,
                sectionTextColor: state.theme.mutedColor,
                sectionBackgroundColor: state.theme.surfaceColor,
                navFontFamily: "",
                navTextColor: state.theme.textColor,
                navBackgroundColor: state.theme.surfaceColor,
                sectionBackgroundSrc: "",
                sectionBackgroundFileName: "",
                sectionBackgroundTransparency: 36,
                galleryLayout: "horizontal",
                galleryImageTransparency: 0,
                galleryImages: createEmptyGallery()
              });
            }
            refresh("Tab removed.");
            return;
          }
          if (action === "up" && index > 0) {
            swapTabs(index, index - 1);
            refresh();
            return;
          }
          if (action === "down" && index < state.tabs.length - 1) {
            swapTabs(index, index + 1);
            refresh();
          }
        });
      });
    });
  }

  function renderPreview() {
    dom.previewViewport.innerHTML = buildHomeMarkup(state, true);
    enableDragging();
  }

  function enableDragging() {
    var dragNodes = dom.previewViewport.querySelectorAll("[data-drag-key]");
    dragNodes.forEach(function (node) {
      node.addEventListener("click", function (event) {
        var blockedUntil = Number(node.getAttribute("data-block-click-until") || 0);
        if (blockedUntil > Date.now()) {
          event.preventDefault();
          event.stopPropagation();
        }
      }, true);

      node.addEventListener("pointerdown", function (event) {
        event.preventDefault();
        var dragKey = String(node.getAttribute("data-drag-key") || "");
        var startPosition = getDragPosition(dragKey);
        if (!startPosition) {
          return;
        }

        var startX = event.clientX;
        var startY = event.clientY;
        var moved = false;

        node.classList.add("dragging");

        function onMove(moveEvent) {
          var deltaX = moveEvent.clientX - startX;
          var deltaY = moveEvent.clientY - startY;
          if (!moved && (Math.abs(deltaX) > 4 || Math.abs(deltaY) > 4)) {
            moved = true;
          }
          var nextX = Math.round(startPosition.x + deltaX);
          var nextY = Math.round(startPosition.y + deltaY);
          setDragPosition(dragKey, nextX, nextY);
          if (isLogoDragKey(dragKey)) {
            var logoIndex = logoIndexFromDragKey(dragKey);
            node.style.transform = logoTransform(state.brand.logos[logoIndex]);
          } else {
            node.style.transform = "translate(" + nextX + "px, " + nextY + "px)";
          }
          syncPositionInputsOnly();
        }

        function onUp() {
          node.classList.remove("dragging");
          window.removeEventListener("pointermove", onMove);
          window.removeEventListener("pointerup", onUp);
          saveState();
          if (moved) {
            node.setAttribute("data-block-click-until", String(Date.now() + 350));
            setStatus("Updated " + dragLabel(dragKey) + " position.", false);
          }
        }

        window.addEventListener("pointermove", onMove);
        window.addEventListener("pointerup", onUp);
      });
    });
  }

  function syncPositionInputsOnly() {
    dom.logo1X.value = String(state.brand.logos[0].x);
    dom.logo1Y.value = String(state.brand.logos[0].y);
    dom.logo2X.value = String(state.brand.logos[1].x);
    dom.logo2Y.value = String(state.brand.logos[1].y);
    dom.navX.value = String(state.layout.nav.x);
    dom.navY.value = String(state.layout.nav.y);
    dom.heroX.value = String(state.layout.hero.x);
    dom.heroY.value = String(state.layout.hero.y);
    dom.ctaX.value = String(state.layout.cta.x);
    dom.ctaY.value = String(state.layout.cta.y);
  }

  function openPreviewWindow() {
    var html = buildPublishedHtml(state);
    var previewWindow = window.open("", "_blank", "noopener,noreferrer");
    if (!previewWindow) {
      setStatus("Preview popup blocked by browser.", true);
      return;
    }
    previewWindow.document.open();
    previewWindow.document.write(html);
    previewWindow.document.close();
    setStatus("Opened HOME preview in new tab.", false);
  }

  async function handlePublish() {
    if (!dom.approval.checked) {
      setStatus("Approve the preview checkbox before publishing.", true);
      return;
    }

    var validationErrors = validateState();
    if (validationErrors.length) {
      setStatus(validationErrors[0], true);
      return;
    }

    var publishPayload = preparePublishPayload(state);
    var html = buildPublishedHtml(publishPayload.config);

    try {
      if (typeof window.showDirectoryPicker === "function") {
        var projectDirectory = await window.showDirectoryPicker({ mode: "readwrite" });
        if (String(projectDirectory.name || "").toLowerCase() === "images") {
          setStatus("Select the project root folder (the folder containing index.html), not images/.", true);
          return;
        }

        var looksLikeProjectRoot = await verifyProjectRootDirectory(projectDirectory);
        if (!looksLikeProjectRoot) {
          setStatus("Selected folder is not your site root. Choose the folder that already contains index.html and configurator.html.", true);
          return;
        }

        var savedAssetsResult = await persistPublishAssets(publishPayload.assets, projectDirectory);
        await writeIndexHtml(projectDirectory, html);
        localStorage.setItem(LAST_PUBLISHED_KEY, html);
        setStatus("Publish complete in " + String(projectDirectory.name || "selected folder") + ". index.html and uploaded images were saved." + assetStatusSuffix(savedAssetsResult), false);
        return;
      }

      downloadFile("index.html", html, "text/html");
      var noFsAssetsResult = await persistPublishAssets(publishPayload.assets);
      localStorage.setItem(LAST_PUBLISHED_KEY, html);
      setStatus("Browser folder-write API unavailable. Downloaded index.html and image files for manual placement." + assetStatusSuffix(noFsAssetsResult), false);
      return;
    } catch (error) {
      if (error && error.name === "AbortError") {
        downloadFile("index.html", html, "text/html");
        var cancelledAssetsResult = await persistPublishAssets(publishPayload.assets);
        localStorage.setItem(LAST_PUBLISHED_KEY, html);
        setStatus("Folder selection was cancelled. Downloaded index.html and image files instead." + assetStatusSuffix(cancelledAssetsResult), false);
        return;
      }

      downloadFile("index.html", html, "text/html");
      var fallbackAssetsResult = await persistPublishAssets(publishPayload.assets);
      localStorage.setItem(LAST_PUBLISHED_KEY, html);
      setStatus("Publish fallback used because direct folder write is blocked in this context." + assetStatusSuffix(fallbackAssetsResult), false);
    }
  }

  function validateState() {
    var errors = [];
    if (!state.brand.name.trim()) {
      errors.push("Brand name is required.");
    }
    if (!state.hero.title.trim()) {
      errors.push("Hero title is required.");
    }
    if (!state.hero.subtitle.trim()) {
      errors.push("Hero subtitle is required.");
    }
    if (!Array.isArray(state.hero.buttons) || !state.hero.buttons.length) {
      errors.push("At least one action button is required.");
    }
    if (Array.isArray(state.hero.buttons) && state.hero.buttons.some(function (button) {
      return !String(button.label || "").trim();
    })) {
      errors.push("Each action button needs a label.");
    }
    if (!state.tabs.length) {
      errors.push("At least one tab is required.");
    }
    var seen = {};
    state.tabs.forEach(function (tab, index) {
      var id = slugify(tab.sectionId || "");
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

  function exportDraft() {
    var json = JSON.stringify(state, null, 2);
    downloadFile("home-config-draft.json", json, "application/json");
    setStatus("Draft exported as JSON.", false);
  }

  function importDraft(event) {
    var file = event.target.files && event.target.files[0];
    if (!file) {
      return;
    }
    var reader = new FileReader();
    reader.onload = function (loadEvent) {
      try {
        var incoming = JSON.parse(String(loadEvent.target.result || "{}"));
        state = mergeConfig(defaultConfig, incoming);
        sanitizeState();
        refresh("Draft imported.");
      } catch (_error) {
        setStatus("Import failed: invalid JSON.", true);
      }
      dom.importDraft.value = "";
    };
    reader.readAsText(file);
  }

  function buildPublishedHtml(config) {
    var fontHref = getAllFontsHref();
    return [
      "<!doctype html>",
      "<html lang=\"en\">",
      "<head>",
      "  <meta charset=\"utf-8\">",
      "  <meta name=\"viewport\" content=\"width=device-width,initial-scale=1\">",
      "  <title>" + escapeHtml(config.brand.name) + "</title>",
      "  <link rel=\"preconnect\" href=\"https://fonts.googleapis.com\">",
      "  <link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin>",
      "  <link href=\"" + fontHref + "\" rel=\"stylesheet\">",
      "  <style>",
      buildPublishedStyles(config),
      "  </style>",
      "</head>",
      "<body>",
      buildHomeMarkup(config, false),
      "</body>",
      "</html>"
    ].join("\n");
  }

  function buildHomeMarkup(config, draggable) {
    var bgImage = config.background.src
      ? "style=\"background-image:url('" + escapeAttr(config.background.src) + "');background-position:" +
        config.background.x +
        "% " +
        config.background.y +
        "%;\""
      : "style=\"background-image:radial-gradient(circle at " +
        config.background.x +
        "% " +
        config.background.y +
        "%, color-mix(in srgb, var(--preview-accent) 22%, #ffffff 78%) 0%, transparent 58%);\"";

    var navLinks = config.tabs
      .map(function (tab) {
        var id = slugify(tab.sectionId || tab.label || "section");
        var previewAttrs = draggable ? " target=\"_blank\" rel=\"noreferrer\"" : "";
        var navStyle = "color:" + escapeAttr(tab.navTextColor || config.theme.textColor) + ";background:" +
          escapeAttr(tab.navBackgroundColor || config.theme.surfaceColor) + ";" +
          (tab.navFontFamily ? "font-family:'" + escapeAttr(tab.navFontFamily) + "','Segoe UI',sans-serif;" : "") +
          "font-size:var(--preview-button-size);";
        return "<a href=\"#" + escapeAttr(id) + "\"" + previewAttrs + " style=\"" + navStyle + "\">" + escapeHtml(tab.label) + "</a>";
      })
      .join("");

    var cards = config.tabs
      .map(function (tab) {
        var id = slugify(tab.sectionId || tab.label || "section");
        var cardStyle = "background:" + escapeAttr(tab.sectionBackgroundColor || config.theme.surfaceColor) + ";";
        if (tab.sectionBackgroundSrc) {
          var tabBgTransparency = normalizeTabImageTransparency(tab.sectionBackgroundTransparency, 36) / 100;
          var tabBgTopAlpha = tabBgTransparency.toFixed(2);
          var tabBgBottomAlpha = Math.min(0.95, tabBgTransparency + 0.12).toFixed(2);
          cardStyle += "background-image:linear-gradient(180deg, rgba(255,255,255," + tabBgTopAlpha + "), rgba(255,255,255," + tabBgBottomAlpha + ")),url('" +
            escapeAttr(tab.sectionBackgroundSrc) + "');background-size:cover;background-position:center;";
        }
        var titleStyle = "color:" + escapeAttr(tab.sectionTitleColor || config.theme.textColor) + ";" +
          (tab.sectionFontFamily ? "font-family:'" + escapeAttr(tab.sectionFontFamily) + "','Segoe UI',sans-serif;" : "");
        var textStyle = "color:" + escapeAttr(tab.sectionTextColor || config.theme.mutedColor) + ";" +
          (tab.sectionFontFamily ? "font-family:'" + escapeAttr(tab.sectionFontFamily) + "','Segoe UI',sans-serif;" : "");
        var galleryMarkup = tabGalleryMarkup(tab);
        return [
          "<article id=\"" + escapeAttr(id) + "\" class=\"generated-card\" style=\"" + cardStyle + "\">",
          "<h3 style=\"" + titleStyle + "\">" + escapeHtml(tab.sectionTitle || tab.label) + "</h3>",
          "<p style=\"" + textStyle + "\">" + escapeHtml(tab.sectionText || "Add content for this section.") + "</p>",
          galleryMarkup,
          "</article>"
        ].join("");
      })
      .join("");

    var buttonLinks = config.hero.buttons
      .map(function (button) {
        var href = String(button.href || "#").trim() || "#";
        var previewAttrs = draggable ? " target=\"_blank\" rel=\"noreferrer\"" : "";
        return "<a href=\"" + escapeAttr(href) + "\"" + previewAttrs + " style=\"background:" +
          escapeAttr(config.theme.accentColor) + ";color:" +
          escapeAttr(config.theme.buttonTextColor) + ";font-size:var(--preview-button-size);\">" +
          escapeHtml(button.label) +
          "</a>";
      })
      .join("");

    var logos = ensureTwoLogos(config.brand)
      .map(function (logo, index) {
        var label = index === 0 ? config.brand.name : "Logo 2";
        var inner = logo.src
          ? "<img src=\"" + escapeAttr(logo.src) + "\" alt=\"" + escapeAttr(label) + "\">"
          : "<span class=\"logo-fallback\">" + escapeHtml(label) + "</span>";
        return "<div class=\"logo-slot\" " + logoDragAttr(index, draggable) + logoStyleAttr(logo) + ">" + inner + "</div>";
      })
      .join("");

    return [
      "<div class=\"home-root\" style=\"--preview-bg:" + escapeAttr(config.theme.bgColor) +
        ";--preview-text:" +
        escapeAttr(config.theme.textColor) +
        ";--preview-accent:" +
        escapeAttr(config.theme.accentColor) +
        ";--preview-muted:" +
        escapeAttr(config.theme.mutedColor) +
        ";--preview-surface:" +
        escapeAttr(config.theme.surfaceColor) +
        ";--preview-bg-opacity:" +
        transparencyToOpacity(config.background.transparency) +
        ";--preview-button-text:" +
        escapeAttr(config.theme.buttonTextColor) +
        ";--preview-button-size:" +
        config.theme.buttonTextSize +
        "px" +
        ";--preview-heading-size:" +
        config.theme.headingSize +
        "px;--preview-body-size:" +
        config.theme.bodySize +
        "px;font-family:'" +
        escapeAttr(config.theme.fontFamily) +
        "','Segoe UI',sans-serif;\">",
      "<div class=\"home-bg\" " + bgImage + "></div>",
      "<div class=\"home-overlay\" style=\"background:linear-gradient(160deg, color-mix(in srgb, " +
        escapeAttr(config.theme.surfaceColor) +
        " 86%, #ffffff 14%) 0%, transparent 70%);\"></div>",
      "<header class=\"home-header\">",
      "<div class=\"brand-logos\">" + logos + "</div>",
      "<nav class=\"home-nav nav-slot\" " + dragAttr("nav", draggable) + transformAttr(config.layout.nav) + ">" + navLinks + "</nav>",
      "</header>",
      "<main class=\"hero-wrap\">",
      "<section class=\"hero-slot\" " + dragAttr("hero", draggable) + transformAttr(config.layout.hero) + ">",
      "<h1>" + escapeHtml(config.hero.title) + "</h1>",
      "<p>" + escapeHtml(config.hero.subtitle) + "</p>",
      "</section>",
      "<div class=\"cta-slot\" " + dragAttr("cta", draggable) + transformAttr(config.layout.cta) + ">",
      buttonLinks,
      "</div>",
      "</main>",
      "<section class=\"generated-sections\">" + cards + "</section>",
      "</div>"
    ].join("");
  }

  function tabGalleryMarkup(tab) {
    var galleryImages = normalizeGalleryImages(tab.galleryImages)
      .filter(function (item) {
        return !!item.src;
      })
      .slice(0, 4);

    if (!galleryImages.length) {
      return "";
    }

    var layoutStyle = galleryLayoutStyle(tab.galleryLayout, galleryImages.length);
    var galleryOpacity = transparencyToOpacity(normalizeTabImageTransparency(tab.galleryImageTransparency, 0));
    var items = galleryImages
      .map(function (image, index) {
        return "<img src=\"" + escapeAttr(image.src) + "\" alt=\"Tab media " + (index + 1) + "\" style=\"width:100%;height:148px;object-fit:cover;border-radius:10px;opacity:" + galleryOpacity + ";\">";
      })
      .join("");

    return "<div class=\"tab-gallery\" style=\"" + layoutStyle + "\">" + items + "</div>";
  }

  function galleryLayoutStyle(layout, imageCount) {
    var mode = normalizeGalleryLayout(layout);
    if (mode === "vertical") {
      return "margin-top:12px;display:grid;grid-template-columns:1fr;gap:8px;";
    }
    if (mode === "split") {
      return "margin-top:12px;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;";
    }
    if (imageCount === 1) {
      return "margin-top:12px;display:grid;grid-template-columns:1fr;gap:8px;";
    }
    return "margin-top:12px;display:grid;grid-template-columns:repeat(" + Math.min(imageCount, 4) + ",minmax(0,1fr));gap:8px;";
  }

  function preparePublishPayload(sourceConfig) {
    var publishConfig = deepClone(sourceConfig);
    var assets = [];
    var usedNames = {};

    function stageAsset(src, fileName, fallbackPrefix) {
      var cleanSrc = normalizeImageSrc(src);
      if (!cleanSrc) {
        return { src: "", fileName: "" };
      }
      if (!isDataUrl(cleanSrc)) {
        return {
          src: cleanSrc,
          fileName: sanitizeFileName(fileName)
        };
      }

      var resolvedName = sanitizeFileName(fileName) || inferFileName(cleanSrc, fallbackPrefix);
      resolvedName = ensureUniqueFileName(resolvedName, usedNames);
      assets.push({
        fileName: resolvedName,
        dataUrl: cleanSrc
      });
      return {
        src: "images/" + resolvedName,
        fileName: resolvedName
      };
    }

    publishConfig.brand.logos = ensureTwoLogos(publishConfig.brand).map(function (logo, logoIndex) {
      var logoAsset = stageAsset(logo.src, logo.fileName, "logo-" + (logoIndex + 1));
      return Object.assign({}, logo, {
        src: logoAsset.src,
        fileName: logoAsset.fileName
      });
    });
    publishConfig.brand.logoSrc = publishConfig.brand.logos[0].src;
    publishConfig.brand.logoFileName = publishConfig.brand.logos[0].fileName;

    var backgroundAsset = stageAsset(publishConfig.background.src, publishConfig.background.fileName, "home-background");
    publishConfig.background.src = backgroundAsset.src;
    publishConfig.background.fileName = backgroundAsset.fileName;

    publishConfig.tabs.forEach(function (tab, tabIndex) {
      var tabBgAsset = stageAsset(tab.sectionBackgroundSrc, tab.sectionBackgroundFileName, "tab-" + (tabIndex + 1) + "-background");
      tab.sectionBackgroundSrc = tabBgAsset.src;
      tab.sectionBackgroundFileName = tabBgAsset.fileName;

      tab.galleryImages = normalizeGalleryImages(tab.galleryImages).map(function (image, imageIndex) {
        var itemAsset = stageAsset(image.src, image.fileName, "tab-" + (tabIndex + 1) + "-image-" + (imageIndex + 1));
        return {
          src: itemAsset.src,
          fileName: itemAsset.fileName
        };
      });
    });

    return {
      config: publishConfig,
      assets: assets
    };
  }

  async function writeIndexHtml(projectDirectory, html) {
    var indexHandle = await projectDirectory.getFileHandle("index.html", { create: true });
    var writable = await indexHandle.createWritable();
    await writable.write(html);
    await writable.close();
  }

  async function verifyProjectRootDirectory(projectDirectory) {
    try {
      await projectDirectory.getFileHandle("index.html");
      await projectDirectory.getFileHandle("configurator.html");
      return true;
    } catch (_error) {
      return false;
    }
  }

  async function persistPublishAssets(assets, projectDirectory) {
    if (!assets || !assets.length) {
      return { mode: "none", count: 0 };
    }

    if (projectDirectory) {
      var imagesDirectory = projectDirectory;
      if (String(projectDirectory.name || "").toLowerCase() !== "images") {
        imagesDirectory = await projectDirectory.getDirectoryHandle("images", { create: true });
      }

      for (var index = 0; index < assets.length; index += 1) {
        var asset = assets[index];
        var blob = dataUrlToBlob(asset.dataUrl);
        var fileHandle = await imagesDirectory.getFileHandle(asset.fileName, { create: true });
        var writable = await fileHandle.createWritable();
        await writable.write(blob);
        await writable.close();
        var writtenFile = await fileHandle.getFile();
        if (!writtenFile || writtenFile.size === 0) {
          throw new Error("Failed to verify written image file: " + asset.fileName);
        }
      }

      return { mode: "directory", count: assets.length };
    }

    assets.forEach(function (asset) {
      downloadBlob(dataUrlToBlob(asset.dataUrl), asset.fileName);
    });
    return { mode: "download", count: assets.length };
  }

  function assetStatusSuffix(result) {
    if (!result || !result.count) {
      return "";
    }
    if (result.mode === "directory") {
      return " Saved " + result.count + " image file(s) into images/.";
    }
    return " Downloaded " + result.count + " image file(s) because auto-copy to images/ was not permitted.";
  }

  function isDataUrl(value) {
    return /^data:/i.test(String(value || ""));
  }

  function inferFileName(dataUrl, fallbackPrefix) {
    var mimeMatch = String(dataUrl || "").match(/^data:([^;,]+)/i);
    var extension = "png";
    if (mimeMatch && mimeMatch[1]) {
      var mime = mimeMatch[1].toLowerCase();
      if (mime.indexOf("jpeg") >= 0 || mime.indexOf("jpg") >= 0) {
        extension = "jpg";
      } else if (mime.indexOf("webp") >= 0) {
        extension = "webp";
      } else if (mime.indexOf("gif") >= 0) {
        extension = "gif";
      } else if (mime.indexOf("svg") >= 0) {
        extension = "svg";
      }
    }
    return sanitizeFileName(fallbackPrefix + "." + extension);
  }

  function ensureUniqueFileName(fileName, usedNames) {
    var dotIndex = fileName.lastIndexOf(".");
    var base = dotIndex > 0 ? fileName.slice(0, dotIndex) : fileName;
    var ext = dotIndex > 0 ? fileName.slice(dotIndex) : "";
    var candidate = fileName;
    var counter = 2;
    while (usedNames[candidate]) {
      candidate = base + "-" + counter + ext;
      counter += 1;
    }
    usedNames[candidate] = true;
    return candidate;
  }

  function dragAttr(key, draggable) {
    if (!draggable) {
      return "";
    }
    return "data-drag-key=\"" + key + "\"";
  }

  function logoDragAttr(index, draggable) {
    if (!draggable) {
      return "";
    }
    return "data-drag-key=\"logo-" + index + "\"";
  }

  function transformAttr(position) {
    return "style=\"transform:translate(" + position.x + "px," + position.y + "px);\"";
  }

  function logoStyleAttr(logo) {
    return "style=\"width:" + logo.size + "px;height:" + logo.size + "px;opacity:" + transparencyToOpacity(logo.transparency) + ";transform:" + logoTransform(logo) + ";\"";
  }

  function logoTransform(logo) {
    return "translate(" + logo.x + "px," + logo.y + "px) rotate(" + logo.rotation + "deg)";
  }

  function isLogoDragKey(dragKey) {
    return /^logo-\d+$/.test(dragKey);
  }

  function logoIndexFromDragKey(dragKey) {
    var index = parseInt(String(dragKey).replace("logo-", ""), 10);
    if (Number.isNaN(index)) {
      return 0;
    }
    return clamp(index, 0, 1);
  }

  function getDragPosition(dragKey) {
    if (isLogoDragKey(dragKey)) {
      var logoIndex = logoIndexFromDragKey(dragKey);
      return {
        x: state.brand.logos[logoIndex].x,
        y: state.brand.logos[logoIndex].y
      };
    }
    if (!state.layout[dragKey]) {
      return null;
    }
    return {
      x: state.layout[dragKey].x,
      y: state.layout[dragKey].y
    };
  }

  function setDragPosition(dragKey, x, y) {
    if (isLogoDragKey(dragKey)) {
      var logoIndex = logoIndexFromDragKey(dragKey);
      state.brand.logos[logoIndex].x = x;
      state.brand.logos[logoIndex].y = y;
      return;
    }
    if (state.layout[dragKey]) {
      state.layout[dragKey].x = x;
      state.layout[dragKey].y = y;
    }
  }

  function dragLabel(dragKey) {
    if (dragKey === "logo-0") {
      return "logo 1";
    }
    if (dragKey === "logo-1") {
      return "logo 2";
    }
    return dragKey;
  }

  function buildPublishedStyles(config) {
    return [
      "*{box-sizing:border-box}",
      "html,body{margin:0;padding:0}",
      "body{background:" + config.theme.bgColor + ";color:" + config.theme.textColor + ";}",
      ".home-root{min-height:100vh;position:relative;overflow:hidden;isolation:isolate;background:var(--preview-bg);color:var(--preview-text)}",
      ".home-bg{position:absolute;inset:0;background-size:cover;background-repeat:no-repeat;opacity:var(--preview-bg-opacity,.68);z-index:-2}",
      ".home-overlay{position:absolute;inset:0;z-index:-1}",
      ".home-header{max-width:1240px;margin:0 auto;padding:24px;display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap}",
      ".brand-logos{position:relative;min-width:280px;min-height:96px;flex:1 1 280px}",
      ".logo-slot{position:absolute;left:0;top:0;display:flex;align-items:center;justify-content:center;transform-origin:center;touch-action:none}",
      ".logo-slot img{width:100%;height:100%;object-fit:contain;display:block}",
      ".logo-fallback{font-size:.78rem;font-weight:700;padding:8px 10px;border-radius:10px;border:1px dashed color-mix(in srgb,var(--preview-text) 28%,#fff 72%);background:color-mix(in srgb,var(--preview-surface) 86%,#fff 14%);text-align:center}",
      ".home-nav{display:flex;flex-wrap:wrap;gap:8px}",
      ".home-nav a{text-decoration:none;color:inherit;border:1px solid color-mix(in srgb,var(--preview-text) 18%,#fff 82%);padding:8px 12px;border-radius:999px;background:color-mix(in srgb,var(--preview-surface) 72%,#fff 28%);font-size:var(--preview-button-size)}",
      ".hero-wrap{max-width:1240px;margin:34px auto 0;padding:0 24px 36px}",
      ".hero-slot{max-width:760px}",
      ".hero-slot h1{margin:0;line-height:.98;letter-spacing:-.03em;font-size:var(--preview-heading-size)}",
      ".hero-slot p{margin:20px 0 0;line-height:1.55;font-size:var(--preview-body-size);color:var(--preview-muted);max-width:60ch}",
      ".cta-slot{display:flex;flex-wrap:wrap;gap:10px;margin-top:28px}",
      ".cta-slot a{display:inline-flex;align-items:center;gap:8px;text-decoration:none;font-weight:700;padding:12px 18px;border-radius:999px;font-size:var(--preview-button-size)}",
      ".generated-sections{max-width:1240px;margin:0 auto;padding:8px 24px 36px;display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:14px}",
      ".generated-card{border-radius:14px;padding:18px;border:1px solid color-mix(in srgb,var(--preview-text) 22%,#fff 78%);background:color-mix(in srgb,var(--preview-surface) 76%,#fff 24%)}",
      ".generated-card h3{margin:0;font-size:1.1rem}",
      ".generated-card p{margin:8px 0 0;line-height:1.5;color:var(--preview-muted)}",
      "@media (max-width:760px){.hero-slot h1{font-size:clamp(2rem,10vw,var(--preview-heading-size))}.home-header,.hero-wrap,.generated-sections{padding-left:16px;padding-right:16px}}"
    ].join("\n");
  }

  function setStatus(message, isError) {
    dom.statusMessage.textContent = message;
    dom.statusMessage.style.color = isError ? "#8a211a" : "#2f6256";
  }

  function sanitizeState() {
    state.brand.name = String(state.brand.name || "VinATech").trim();
    state.brand.logoSrc = normalizeImageSrc(state.brand.logoSrc);
    state.brand.logoFileName = sanitizeFileName(state.brand.logoFileName);
    state.brand.logos = normalizeBrandLogos(state.brand.logos, {
      src: state.brand.logoSrc,
      fileName: state.brand.logoFileName,
      x: state.layout && state.layout.logo ? state.layout.logo.x : 0,
      y: state.layout && state.layout.logo ? state.layout.logo.y : 0
    });
    state.brand.logoSrc = state.brand.logos[0].src;
    state.brand.logoFileName = state.brand.logos[0].fileName;
    state.hero.title = String(state.hero.title || "");
    state.hero.subtitle = String(state.hero.subtitle || "");

    if (!Array.isArray(state.hero.buttons) || !state.hero.buttons.length) {
      var legacyLabel = String(state.hero.ctaLabel || "Explore Products");
      var legacyHref = String(state.hero.ctaHref || "products.html");
      state.hero.buttons = [{
        label: legacyLabel,
        href: legacyHref
      }];
    }

    state.hero.buttons = state.hero.buttons
      .map(function (button, index) {
        return {
          label: String(button.label || ("Button " + (index + 1))).trim(),
          href: String(button.href || "#").trim() || "#"
        };
      })
      .filter(function (button) {
        return button.label.length > 0;
      });

    if (!state.hero.buttons.length) {
      state.hero.buttons = [{
        label: "Explore Products",
        href: "products.html"
      }];
    }

    state.theme.headingSize = clamp(parseInt(state.theme.headingSize, 10) || 64, 32, 120);
    state.theme.bodySize = clamp(parseInt(state.theme.bodySize, 10) || 18, 12, 32);
    state.theme.buttonTextSize = clamp(parseInt(state.theme.buttonTextSize, 10) || 16, 12, 32);

    state.theme.bgColor = normalizeHex(state.theme.bgColor, "#f2f7f3");
    state.theme.textColor = normalizeHex(state.theme.textColor, "#102822");
    state.theme.accentColor = normalizeHex(state.theme.accentColor, "#0f7b6c");
    state.theme.mutedColor = normalizeHex(state.theme.mutedColor, "#4f6962");
    state.theme.surfaceColor = normalizeHex(state.theme.surfaceColor, "#e5f0ea");
    state.theme.buttonTextColor = normalizeHex(state.theme.buttonTextColor, "#ffffff");

    state.layout = state.layout || {};
    ["logo", "nav", "hero", "cta"].forEach(function (key) {
      state.layout[key] = state.layout[key] || { x: 0, y: 0 };
      state.layout[key].x = parseInt(state.layout[key].x, 10) || 0;
      state.layout[key].y = parseInt(state.layout[key].y, 10) || 0;
    });

    var backgroundX = parseInt(state.background.x, 10);
    var backgroundY = parseInt(state.background.y, 10);
    var backgroundTransparency = parseInt(state.background.transparency, 10);
    if (Number.isNaN(backgroundX)) {
      backgroundX = 52;
    }
    if (Number.isNaN(backgroundY)) {
      backgroundY = 20;
    }
    if (Number.isNaN(backgroundTransparency)) {
      backgroundTransparency = 32;
    }
    state.background.x = clamp(backgroundX, 0, 100);
    state.background.y = clamp(backgroundY, 0, 100);
    state.background.transparency = clamp(backgroundTransparency, 0, 95);
    state.background.src = normalizeImageSrc(state.background.src);
    state.background.fileName = sanitizeFileName(state.background.fileName);

    state.tabs = state.tabs
      .map(function (tab, index) {
        var label = String(tab.label || "Tab " + (index + 1));
        var sectionId = slugify(String(tab.sectionId || label || "section"));
        return {
          label: label,
          sectionId: sectionId || uniqueSectionId("section"),
          sectionTitle: String(tab.sectionTitle || label),
          sectionText: String(tab.sectionText || "Add section content here."),
          sectionFontFamily: normalizeFontFamily(tab.sectionFontFamily),
          sectionTitleColor: normalizeHex(tab.sectionTitleColor, state.theme.textColor),
          sectionTextColor: normalizeHex(tab.sectionTextColor, state.theme.mutedColor),
          sectionBackgroundColor: normalizeHex(tab.sectionBackgroundColor, state.theme.surfaceColor),
          navFontFamily: normalizeFontFamily(tab.navFontFamily),
          navTextColor: normalizeHex(tab.navTextColor, state.theme.textColor),
          navBackgroundColor: normalizeHex(tab.navBackgroundColor, state.theme.surfaceColor),
          sectionBackgroundSrc: normalizeImageSrc(tab.sectionBackgroundSrc),
          sectionBackgroundFileName: sanitizeFileName(tab.sectionBackgroundFileName),
          sectionBackgroundTransparency: normalizeTabImageTransparency(tab.sectionBackgroundTransparency, 36),
          galleryLayout: normalizeGalleryLayout(tab.galleryLayout),
          galleryImageTransparency: normalizeTabImageTransparency(tab.galleryImageTransparency, 0),
          galleryImages: normalizeGalleryImages(tab.galleryImages)
        };
      })
      .filter(function (tab) {
        return tab.label.trim().length > 0;
      });

    dedupeSectionIds();
  }

  function dedupeSectionIds() {
    var seen = {};
    state.tabs.forEach(function (tab) {
      var base = tab.sectionId;
      var unique = base;
      var offset = 2;
      while (seen[unique]) {
        unique = base + "-" + offset;
        offset += 1;
      }
      seen[unique] = true;
      tab.sectionId = unique;
    });
  }

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function loadState() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return deepClone(defaultConfig);
      }
      var parsed = JSON.parse(raw);
      return mergeConfig(defaultConfig, parsed);
    } catch (_error) {
      return deepClone(defaultConfig);
    }
  }

  function mergeConfig(base, incoming) {
    var merged = deepClone(base);

    if (!incoming || typeof incoming !== "object") {
      return merged;
    }

    merged.brand = Object.assign({}, merged.brand, incoming.brand || {});
    merged.brand.logos = normalizeBrandLogos(merged.brand.logos, {
      src: merged.brand.logoSrc,
      fileName: merged.brand.logoFileName,
      x: incoming.layout && incoming.layout.logo ? incoming.layout.logo.x : 0,
      y: incoming.layout && incoming.layout.logo ? incoming.layout.logo.y : 0
    });
    merged.hero = Object.assign({}, merged.hero, incoming.hero || {});
    merged.theme = Object.assign({}, merged.theme, incoming.theme || {});
    merged.background = Object.assign({}, merged.background, incoming.background || {});

    var incomingLayout = incoming.layout || {};
    merged.layout = {
      logo: Object.assign({}, merged.layout.logo, incomingLayout.logo || {}),
      nav: Object.assign({}, merged.layout.nav, incomingLayout.nav || {}),
      hero: Object.assign({}, merged.layout.hero, incomingLayout.hero || {}),
      cta: Object.assign({}, merged.layout.cta, incomingLayout.cta || {})
    };

    if (Array.isArray(incoming.tabs) && incoming.tabs.length) {
      merged.tabs = incoming.tabs.map(function (tab) {
        return {
          label: String(tab.label || "New Tab"),
          sectionId: String(tab.sectionId || slugify(tab.label || "new-tab")),
          sectionTitle: String(tab.sectionTitle || tab.label || "New Section"),
          sectionText: String(tab.sectionText || "Add section content here."),
          sectionFontFamily: String(tab.sectionFontFamily || ""),
          sectionTitleColor: String(tab.sectionTitleColor || merged.theme.textColor),
          sectionTextColor: String(tab.sectionTextColor || merged.theme.mutedColor),
          sectionBackgroundColor: String(tab.sectionBackgroundColor || merged.theme.surfaceColor),
          navFontFamily: String(tab.navFontFamily || ""),
          navTextColor: String(tab.navTextColor || merged.theme.textColor),
          navBackgroundColor: String(tab.navBackgroundColor || merged.theme.surfaceColor),
          sectionBackgroundSrc: String(tab.sectionBackgroundSrc || ""),
          sectionBackgroundFileName: String(tab.sectionBackgroundFileName || ""),
          sectionBackgroundTransparency: normalizeTabImageTransparency(tab.sectionBackgroundTransparency, 36),
          galleryLayout: String(tab.galleryLayout || "horizontal"),
          galleryImageTransparency: normalizeTabImageTransparency(tab.galleryImageTransparency, 0),
          galleryImages: Array.isArray(tab.galleryImages) ? tab.galleryImages.map(function (image) {
            return {
              src: String((image && image.src) || ""),
              fileName: String((image && image.fileName) || "")
            };
          }) : createEmptyGallery()
        };
      });
    }

    if (incoming.hero && Array.isArray(incoming.hero.buttons) && incoming.hero.buttons.length) {
      merged.hero.buttons = incoming.hero.buttons.map(function (button) {
        return {
          label: String(button.label || "Button"),
          href: String(button.href || "#")
        };
      });
    }

    return merged;
  }

  function swapTabs(indexA, indexB) {
    swapArrayItems(state.tabs, indexA, indexB);
  }

  function swapArrayItems(items, indexA, indexB) {
    var temp = items[indexA];
    items[indexA] = items[indexB];
    items[indexB] = temp;
  }

  function fontOptionsMarkup(selectedFont, includeDefault) {
    var options = [];
    if (includeDefault) {
      options.push("<option value=\"\"" + (selectedFont ? "" : " selected") + ">Use Site Font</option>");
    }
    FONT_FAMILIES.forEach(function (font) {
      options.push("<option value=\"" + escapeAttr(font) + "\"" + (selectedFont === font ? " selected" : "") + ">" + escapeHtml(font) + "</option>");
    });
    return options.join("");
  }

  function normalizeFontFamily(value) {
    var candidate = String(value || "").trim();
    if (!candidate) {
      return "";
    }
    return FONT_FAMILIES.indexOf(candidate) >= 0 ? candidate : "";
  }

  function normalizeImageSrc(value) {
    var src = String(value || "").trim();
    return src;
  }

  function sanitizeFileName(value) {
    var name = String(value || "").trim();
    if (!name) {
      return "";
    }
    return name.replace(/[\\/:*?"<>|]/g, "-");
  }

  function createDefaultLogo(index) {
    return {
      src: "",
      fileName: "",
      x: index === 0 ? 0 : 76,
      y: 0,
      size: 72,
      rotation: 0,
      transparency: 0
    };
  }

  function createDefaultLogos() {
    return [createDefaultLogo(0), createDefaultLogo(1)];
  }

  function normalizeRotation(value) {
    var parsed = parseInt(value, 10);
    if (Number.isNaN(parsed)) {
      parsed = 0;
    }
    return clamp(parsed, -180, 180);
  }

  function normalizeBrandLogos(value, legacyPrimary) {
    var defaults = createDefaultLogos();
    var legacy = legacyPrimary || {};
    var source = Array.isArray(value) ? value.slice(0, 2) : [];

    if (!source.length && (legacy.src || legacy.fileName)) {
      source.push({
        src: legacy.src,
        fileName: legacy.fileName,
        x: legacy.x,
        y: legacy.y
      });
    }

    while (source.length < 2) {
      source.push(defaults[source.length]);
    }

    return [0, 1].map(function (index) {
      var item = source[index] || defaults[index];
      return {
        src: normalizeImageSrc(item.src),
        fileName: sanitizeFileName(item.fileName),
        x: parseInt(item.x, 10) || 0,
        y: parseInt(item.y, 10) || 0,
        size: clamp(parseInt(item.size, 10) || defaults[index].size, 1, 1200),
        rotation: normalizeRotation(item.rotation),
        transparency: clamp(parseInt(item.transparency, 10) || 0, 0, 95)
      };
    });
  }

  function ensureTwoLogos(brand) {
    var legacy = {
      src: brand.logoSrc,
      fileName: brand.logoFileName,
      x: 0,
      y: 0
    };
    return normalizeBrandLogos(brand.logos, legacy);
  }

  function setLogoSize(index, value, keepCenter) {
    var logoIndex = clamp(parseInt(index, 10) || 0, 0, 1);
    var logo = state.brand.logos[logoIndex];
    var nextSize = clamp(parseInt(value, 10) || 0, 1, 1200);
    var previousSize = clamp(parseInt(logo.size, 10) || 72, 1, 1200);
    if (keepCenter && nextSize !== previousSize) {
      var delta = nextSize - previousSize;
      logo.x -= Math.round(delta / 2);
      logo.y -= Math.round(delta / 2);
    }
    logo.size = nextSize;
  }

  function createEmptyGallery() {
    return [
      { src: "", fileName: "" },
      { src: "", fileName: "" },
      { src: "", fileName: "" },
      { src: "", fileName: "" }
    ];
  }

  function normalizeGalleryImages(value) {
    var items = Array.isArray(value) ? value.slice(0, 4) : [];
    while (items.length < 4) {
      items.push({ src: "", fileName: "" });
    }
    return items.map(function (item) {
      return {
        src: normalizeImageSrc(item && item.src),
        fileName: sanitizeFileName(item && item.fileName)
      };
    });
  }

  function ensureGallerySlots(tab) {
    tab.galleryImages = normalizeGalleryImages(tab.galleryImages);
  }

  function normalizeGalleryLayout(value) {
    var candidate = String(value || "").trim().toLowerCase();
    if (candidate === "vertical" || candidate === "split" || candidate === "horizontal") {
      return candidate;
    }
    return "horizontal";
  }

  function normalizeTabImageTransparency(value, fallbackValue) {
    var parsed = parseInt(value, 10);
    if (Number.isNaN(parsed)) {
      return clamp(fallbackValue, 0, 95);
    }
    return clamp(parsed, 0, 95);
  }

  function galleryLayoutOptionsMarkup(selected) {
    var mode = normalizeGalleryLayout(selected);
    return [
      "<option value=\"horizontal\"" + (mode === "horizontal" ? " selected" : "") + ">Horizontal Row</option>",
      "<option value=\"vertical\"" + (mode === "vertical" ? " selected" : "") + ">Vertical Stack</option>",
      "<option value=\"split\"" + (mode === "split" ? " selected" : "") + ">Split 2 Left / 2 Right</option>"
    ].join("");
  }

  function getGalleryFileName(tab, index) {
    ensureGallerySlots(tab);
    return tab.galleryImages[index] && tab.galleryImages[index].fileName
      ? tab.galleryImages[index].fileName
      : "not set";
  }

  function uniqueSectionId(base) {
    var slug = slugify(base || "section");
    var seen = {};
    state.tabs.forEach(function (tab) {
      seen[tab.sectionId] = true;
    });

    if (!seen[slug]) {
      return slug;
    }

    var counter = 2;
    while (seen[slug + "-" + counter]) {
      counter += 1;
    }
    return slug + "-" + counter;
  }

  function slugify(value) {
    return String(value || "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  function getFontHref(fontFamily) {
    var maps = {
      "Sora": "https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&display=swap",
      "Space Grotesk": "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap",
      "Manrope": "https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;700;800&display=swap",
      "Plus Jakarta Sans": "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;700;800&display=swap",
      "Outfit": "https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;700;800&display=swap",
      "DM Sans": "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;900&display=swap",
      "Archivo": "https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;700;800&display=swap",
      "Karla": "https://fonts.googleapis.com/css2?family=Karla:wght@400;500;700;800&display=swap",
      "Merriweather": "https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700;900&display=swap",
      "Playfair Display": "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;800&display=swap",
      "Cormorant Garamond": "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&display=swap",
      "Bricolage Grotesque": "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;500;700;800&display=swap"
    };
    return maps[fontFamily] || maps.Sora;
  }

  function getAllFontsHref() {
    return "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=Sora:wght@400;600;700;800&family=Manrope:wght@400;500;700;800&family=Plus+Jakarta+Sans:wght@400;500;700;800&family=Outfit:wght@400;500;700;800&family=DM+Sans:wght@400;500;700;900&family=Archivo:wght@400;500;700;800&family=Karla:wght@400;500;700;800&family=Merriweather:wght@400;700;900&family=Playfair+Display:wght@400;600;700;800&family=Cormorant+Garamond:wght@400;500;600;700&family=Bricolage+Grotesque:wght@400;500;700;800&display=swap";
  }

  function downloadFile(filename, content, mimeType) {
    var blob = new Blob([content], { type: mimeType });
    downloadBlob(blob, filename);
  }

  function downloadBlob(blob, filename) {
    var url = URL.createObjectURL(blob);
    var anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  }

  function dataUrlToBlob(dataUrl) {
    var parts = String(dataUrl || "").split(",");
    if (parts.length < 2) {
      return new Blob([""], { type: "application/octet-stream" });
    }
    var mimeMatch = parts[0].match(/data:([^;]+);base64/i);
    var mime = mimeMatch && mimeMatch[1] ? mimeMatch[1] : "application/octet-stream";
    var binary = atob(parts[1]);
    var length = binary.length;
    var bytes = new Uint8Array(length);
    for (var index = 0; index < length; index += 1) {
      bytes[index] = binary.charCodeAt(index);
    }
    return new Blob([bytes], { type: mime });
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function transparencyToOpacity(transparency) {
    var normalized = clamp(parseInt(transparency, 10) || 0, 0, 100);
    return String((100 - normalized) / 100);
  }

  function deepClone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function normalizeHex(value, fallback) {
    var raw = String(value || "").trim();
    if (/^#[0-9a-fA-F]{6}$/.test(raw)) {
      return raw;
    }
    return fallback;
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function escapeAttr(value) {
    return escapeHtml(value).replace(/`/g, "");
  }
})();
