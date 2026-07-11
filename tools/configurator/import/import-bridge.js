(function () {
  "use strict";

  function escapeRegex(value) {
    return String(value || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function getAttributeValue(attributesText, attributeName) {
    var re = new RegExp("(?:^|\\s)" + escapeRegex(attributeName) + "\\s*=\\s*(\"([^\"]*)\"|'([^']*)')", "i");
    var match = String(attributesText || "").match(re);
    if (!match) {
      return "";
    }
    return String(typeof match[2] === "string" ? match[2] : (match[3] || ""));
  }

  function getTagAttributeValue(tagText, attributeName) {
    var attributesText = String(tagText || "").replace(/^<[^\s>]+\s*|\/?\s*>$/g, "");
    return getAttributeValue(attributesText, attributeName);
  }

  function findTagByClass(html, className) {
    var source = String(html || "");
    var tagRe = /<([a-z0-9-]+)\b([^>]*)>/gi;
    var match = tagRe.exec(source);
    while (match) {
      var attributesText = String(match[2] || "");
      var classAttr = getAttributeValue(attributesText, "class");
      if (classAttr && new RegExp("(?:^|\\s)" + escapeRegex(className) + "(?:\\s|$)", "i").test(classAttr)) {
        return "<" + String(match[1] || "") + attributesText + ">";
      }
      match = tagRe.exec(source);
    }
    return "";
  }

  function stripTags(value) {
    return String(value || "")
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function decodeHtml(value) {
    return String(value || "")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");
  }

  function parseStyleDeclarations(styleText) {
    var declarations = {};
    String(styleText || "")
      .split(";")
      .forEach(function (row) {
        var entry = String(row || "").trim();
        if (!entry) {
          return;
        }
        var separator = entry.indexOf(":");
        if (separator < 0) {
          return;
        }
        var key = entry.slice(0, separator).trim();
        var value = entry.slice(separator + 1).trim();
        if (!key) {
          return;
        }
        declarations[key] = value;
      });
    return declarations;
  }

  function parseTranslate(styleText) {
    var input = String(styleText || "");

    function toInt(value) {
      var number = parseFloat(String(value || ""));
      if (isNaN(number)) {
        return 0;
      }
      return Math.round(number);
    }

    var match = input.match(/translate(?:3d)?\(\s*(-?\d+(?:\.\d+)?)px\s*,\s*(-?\d+(?:\.\d+)?)px(?:\s*,\s*-?\d+(?:\.\d+)?(?:px)?)?\s*\)/i);
    if (match) {
      return {
        x: toInt(match[1]),
        y: toInt(match[2])
      };
    }

    var xMatch = input.match(/translateX\(\s*(-?\d+(?:\.\d+)?)px\s*\)/i);
    var yMatch = input.match(/translateY\(\s*(-?\d+(?:\.\d+)?)px\s*\)/i);
    if (!xMatch && !yMatch) {
      return null;
    }

    return {
      x: xMatch ? toInt(xMatch[1]) : 0,
      y: yMatch ? toInt(yMatch[1]) : 0
    };
  }

  function readCssVarNumber(styleMap, key) {
    var raw = String((styleMap && styleMap[key]) || "");
    var match = raw.match(/-?\d+(?:\.\d+)?/);
    if (!match) {
      return null;
    }
    return parseInt(match[0], 10);
  }

  function readCssVarText(styleMap, key) {
    return String((styleMap && styleMap[key]) || "").trim();
  }

  function normalizeColorToken(value) {
    var token = String(value || "").trim().toLowerCase();
    if (!token) {
      return "";
    }
    return token.replace(/\s+/g, "");
  }

  function isNearWhiteColor(value) {
    var token = normalizeColorToken(value);
    if (!token) {
      return false;
    }
    if (token === "#fff" || token === "#ffffff" || token === "white" || token === "rgb(255,255,255)" || token === "rgba(255,255,255,1)") {
      return true;
    }
    return false;
  }

  function hasLowConfidenceThemeColors(themePatch) {
    var theme = themePatch && typeof themePatch === "object" ? themePatch : {};
    var keys = ["bgColor", "textColor", "accentColor", "mutedColor", "surfaceColor", "buttonTextColor"];
    var tokens = [];
    var whiteCount = 0;

    keys.forEach(function (key) {
      var token = normalizeColorToken(theme[key]);
      if (!token) {
        return;
      }
      tokens.push(token);
      if (isNearWhiteColor(token)) {
        whiteCount += 1;
      }
    });

    if (!tokens.length) {
      return false;
    }

    var unique = {};
    tokens.forEach(function (token) {
      unique[token] = true;
    });
    var uniqueCount = Object.keys(unique).length;

    return whiteCount >= 4 || uniqueCount <= 2;
  }

  function extractRootStyle(html, className) {
    var tag = findTagByClass(html, className);
    if (!tag) {
      return "";
    }
    return String(getTagAttributeValue(tag, "style") || "");
  }

  function extractFirstText(html, patterns) {
    var source = String(html || "");
    for (var index = 0; index < patterns.length; index += 1) {
      var regex = patterns[index];
      var match = source.match(regex);
      if (match && match[1]) {
        return decodeHtml(stripTags(match[1]));
      }
    }
    return "";
  }

  function extractDragPositions(html) {
    var positions = {};
    var source = String(html || "");
    var regex = /<[^>]+>/gi;
    var match = regex.exec(source);
    while (match) {
      var tagText = String(match[0] || "");
      var dragKey = String(getTagAttributeValue(tagText, "data-drag-key") || "").trim();
      var styleText = String(getTagAttributeValue(tagText, "style") || "");
      var translate = parseTranslate(styleText);
      if (dragKey && translate) {
        positions[dragKey] = translate;
      }
      match = regex.exec(source);
    }
    return positions;
  }

  function extractHomePatch(html) {
    var rootStyle = extractRootStyle(html, "home-root");
    var styleMap = parseStyleDeclarations(rootStyle);
    var dragPositions = extractDragPositions(html);
    var patch = {
      brand: {},
      hero: {},
      theme: {},
      layout: {}
    };
    var importedFields = [];
    var warnings = [];

    var titleText = extractFirstText(html, [/\<title[^>]*\>([\s\S]*?)\<\/title\>/i]);
    if (titleText) {
      var brandName = titleText.split(" - ")[0].trim();
      if (brandName) {
        patch.brand.name = brandName;
        importedFields.push("brand.name");
      }
    }

    var heroTitle = extractFirstText(html, [
      /hero-title-slot[\s\S]*?<h1[^>]*>([\s\S]*?)<\/h1>/i,
      /<h1[^>]*>([\s\S]*?)<\/h1>/i
    ]);
    if (heroTitle) {
      patch.hero.title = heroTitle;
      importedFields.push("hero.title");
    } else if (patch.brand && patch.brand.name) {
      patch.hero.title = String(patch.brand.name);
      importedFields.push("hero.title");
      warnings.push("HOME hero title was empty in source markup; used brand name as fallback.");
    }

    var heroSubtitle = extractFirstText(html, [
      /hero-subtitle-slot[\s\S]*?<p[^>]*>([\s\S]*?)<\/p>/i,
      /<h1[^>]*>[\s\S]*?<\/h1>\s*<p[^>]*>([\s\S]*?)<\/p>/i,
      /<p[^>]*>([\s\S]*?)<\/p>/i
    ]);
    if (heroSubtitle) {
      patch.hero.subtitle = heroSubtitle;
      importedFields.push("hero.subtitle");
    }

    var themeMap = {
      "--preview-bg": "bgColor",
      "--preview-text": "textColor",
      "--preview-accent": "accentColor",
      "--preview-muted": "mutedColor",
      "--preview-surface": "surfaceColor",
      "--preview-button-text": "buttonTextColor"
    };
    Object.keys(themeMap).forEach(function (cssVar) {
      var value = readCssVarText(styleMap, cssVar);
      if (value) {
        patch.theme[themeMap[cssVar]] = value;
        importedFields.push("theme." + themeMap[cssVar]);
      }
    });

    var headingSize = readCssVarNumber(styleMap, "--preview-heading-size");
    if (headingSize !== null) {
      patch.theme.headingSize = headingSize;
      importedFields.push("theme.headingSize");
    }
    var bodySize = readCssVarNumber(styleMap, "--preview-body-size");
    if (bodySize !== null) {
      patch.theme.bodySize = bodySize;
      importedFields.push("theme.bodySize");
    }

    var fontFamilyMatch = readCssVarText(styleMap, "font-family").match(/'([^']+)'/);
    if (fontFamilyMatch && fontFamilyMatch[1]) {
      patch.theme.fontFamily = String(fontFamilyMatch[1]);
      importedFields.push("theme.fontFamily");
    } else {
      var fallbackFontMatch = String(html || "").match(/family=([^\"'&\s>]+)/i);
      if (fallbackFontMatch && fallbackFontMatch[1]) {
        patch.theme.fontFamily = decodeURIComponent(String(fallbackFontMatch[1])).replace(/\+/g, " ").trim();
        if (patch.theme.fontFamily) {
          importedFields.push("theme.fontFamily");
        }
      }
    }

    var backgroundMatch = String(html || "").match(/<div[^>]*class=(?:\"[^\"]*home-bg[^\"]*\"|'[^']*home-bg[^']*')[^>]*style=(?:\"([^\"]*)\"|'([^']*)')/i);
    if (backgroundMatch) {
      var backgroundStyle = String(backgroundMatch[1] || backgroundMatch[2] || "");
      var srcMatch = backgroundStyle.match(/background-image\s*:\s*url\((?:'|")?([^'"\)]+)(?:'|")?\)/i);
      if (srcMatch && srcMatch[1]) {
        patch.background = patch.background || {};
        patch.background.src = String(srcMatch[1]);
        importedFields.push("background.src");
      }
      var xMatch = backgroundStyle.match(/background-position\s*:\s*(-?\d+(?:\.\d+)?)%\s+(-?\d+(?:\.\d+)?)%/i);
      if (xMatch) {
        patch.background = patch.background || {};
        patch.background.x = parseInt(xMatch[1], 10) || 0;
        patch.background.y = parseInt(xMatch[2], 10) || 0;
        importedFields.push("background.x");
        importedFields.push("background.y");
      }
    }

    ["nav", "heroTitle", "heroSubtitle", "cta"].forEach(function (key) {
      if (dragPositions[key]) {
        patch.layout[key] = dragPositions[key];
        importedFields.push("layout." + key);
      }
    });

    var mobileMap = {
      "--mobile-nav-x": ["mobileNav", "x"],
      "--mobile-nav-y": ["mobileNav", "y"],
      "--mobile-hero-title-x": ["mobileHeroTitle", "x"],
      "--mobile-hero-title-y": ["mobileHeroTitle", "y"],
      "--mobile-hero-subtitle-x": ["mobileHeroSubtitle", "x"],
      "--mobile-hero-subtitle-y": ["mobileHeroSubtitle", "y"],
      "--mobile-cta-x": ["mobileCta", "x"],
      "--mobile-cta-y": ["mobileCta", "y"]
    };
    Object.keys(mobileMap).forEach(function (cssVar) {
      var target = mobileMap[cssVar];
      var num = readCssVarNumber(styleMap, cssVar);
      if (num === null) {
        return;
      }
      patch.layout[target[0]] = patch.layout[target[0]] || {};
      patch.layout[target[0]][target[1]] = num;
      importedFields.push("layout." + target[0] + "." + target[1]);
    });

    if (hasLowConfidenceThemeColors(patch.theme)) {
      ["bgColor", "textColor", "accentColor", "mutedColor", "surfaceColor", "buttonTextColor"].forEach(function (key) {
        if (Object.prototype.hasOwnProperty.call(patch.theme, key)) {
          delete patch.theme[key];
        }
      });
      importedFields = importedFields.filter(function (field) {
        return !/^theme\.(bgColor|textColor|accentColor|mutedColor|surfaceColor|buttonTextColor)$/.test(String(field || ""));
      });
      warnings.push("HOME theme colors looked low-confidence and were preserved from the existing draft.");
    }

    if (!importedFields.length) {
      warnings.push("No HOME fields could be extracted.");
    }

    return {
      patch: patch,
      importedFields: importedFields,
      warnings: warnings
    };
  }

  function extractContactPatch(html) {
    var rootStyle = extractRootStyle(html, "contact-root");
    var styleMap = parseStyleDeclarations(rootStyle);
    var title = extractFirstText(html, [
      /contact-hero[\s\S]*?<h1[^>]*>([\s\S]*?)<\/h1>/i,
      /<h1[^>]*>([\s\S]*?)<\/h1>/i,
      /<title[^>]*>([\s\S]*?)<\/title>/i
    ]);
    var intro = extractFirstText(html, [
      /contact-hero[\s\S]*?<h1[^>]*>[\s\S]*?<\/h1>\s*<p[^>]*>([\s\S]*?)<\/p>/i,
      /<h1[^>]*>[\s\S]*?<\/h1>\s*<p[^>]*>([\s\S]*?)<\/p>/i,
      /\<p[^>]*\>([\s\S]*?)\<\/p\>/i
    ]);
    var patch = { contact: {} };
    var importedFields = [];

    if (title) {
      patch.contact.title = title;
      importedFields.push("contact.title");
    }
    if (intro) {
      patch.contact.intro = intro;
      importedFields.push("contact.intro");
    }

    var submitButtonMatch = String(html || "").match(/<button[^>]*type=(?:\"submit\"|'submit')[^>]*>([\s\S]*?)<\/button>/i);
    var submitInputMatch = String(html || "").match(/<input[^>]*type=(?:\"submit\"|'submit')[^>]*value=(?:\"([^\"]*)\"|'([^']*)')/i);
    var submitLabel = submitButtonMatch && submitButtonMatch[1]
      ? decodeHtml(stripTags(submitButtonMatch[1]))
      : String((submitInputMatch && (submitInputMatch[1] || submitInputMatch[2])) || "").trim();
    if (submitLabel) {
      patch.contact.submitLabel = submitLabel;
      importedFields.push("contact.submitLabel");
    }

    var subjectPrefixMatch = String(html || "").match(/<form[^>]*data-subject-prefix=(?:\"([^\"]*)\"|'([^']*)')/i);
    var hiddenSubjectMatch = String(html || "").match(/<input[^>]*name=(?:\"_subject\"|'_subject')[^>]*value=(?:\"([^\"]*)\"|'([^']*)')/i);
    var subjectPrefix = String(
      (subjectPrefixMatch && (subjectPrefixMatch[1] || subjectPrefixMatch[2]))
      || (hiddenSubjectMatch && (hiddenSubjectMatch[1] || hiddenSubjectMatch[2]))
      || ""
    ).trim();
    if (subjectPrefix) {
      patch.contact.emailSubject = String(subjectPrefix).replace(/\s*-\s*Website$/i, "").trim();
      importedFields.push("contact.emailSubject");
    }

    var formEndpointMatch = String(html || "").match(/<form[^>]*action=(?:\"([^\"]*)\"|'([^']*)')/i);
    var formEndpoint = String((formEndpointMatch && (formEndpointMatch[1] || formEndpointMatch[2])) || "").trim();
    if (formEndpoint) {
      patch.contact.formEndpoint = formEndpoint;
      importedFields.push("contact.formEndpoint");
    }

    var recipientEmailMatch = String(html || "").match(/mailto:([^\"'\s<]+)/i);
    if (recipientEmailMatch && recipientEmailMatch[1]) {
      patch.contact.recipientEmail = String(recipientEmailMatch[1]);
      importedFields.push("contact.recipientEmail");
    }

    var contactColorMap = {
      "--contact-bg-color": "bgColor",
      "--contact-text-color": "textColor",
      "--contact-muted-color": "mutedColor",
      "--contact-accent-color": "accentColor",
      "--contact-surface-color": "surfaceColor",
      "--contact-line-color": "lineColor",
      "--contact-tab-text-color": "tabTextColor",
      "--contact-tab-bg-color": "tabBgColor"
    };
    Object.keys(contactColorMap).forEach(function (cssVar) {
      var value = readCssVarText(styleMap, cssVar);
      if (!value) {
        return;
      }
      patch.contact[contactColorMap[cssVar]] = value;
      importedFields.push("contact." + contactColorMap[cssVar]);
    });

    if (/<nav[^>]*class=(?:\"[^\"]*transparent-tabs[^\"]*\"|'[^']*transparent-tabs[^']*')/i.test(String(html || ""))) {
      patch.contact.topTabsTransparent = true;
      importedFields.push("contact.topTabsTransparent");
    }

    return {
      patch: patch,
      importedFields: importedFields,
      warnings: importedFields.length ? [] : ["No CONTACT fields could be extracted."]
    };
  }

  function extractPrivacyPatch(html) {
    var rootStyle = extractRootStyle(html, "privacy-root");
    var styleMap = parseStyleDeclarations(rootStyle);
    var title = extractFirstText(html, [
      /<section[^>]*class=(?:\"[^\"]*hero[^\"]*\"|'[^']*hero[^']*')[^>]*>[\s\S]*?<h1[^>]*>([\s\S]*?)<\/h1>/i,
      /<h1[^>]*>([\s\S]*?)<\/h1>/i,
      /<title[^>]*>([\s\S]*?)<\/title>/i
    ]);
    var intro = extractFirstText(html, [
      /<section[^>]*class=(?:\"[^\"]*hero[^\"]*\"|'[^']*hero[^']*')[^>]*>[\s\S]*?<h1[^>]*>[\s\S]*?<\/h1>\s*<p[^>]*>([\s\S]*?)<\/p>/i,
      /<h1[^>]*>[\s\S]*?<\/h1>\s*<p[^>]*>([\s\S]*?)<\/p>/i,
      /\<p[^>]*\>([\s\S]*?)\<\/p\>/i
    ]);
    var patch = { privacy: {} };
    var importedFields = [];

    if (title) {
      patch.privacy.title = title;
      importedFields.push("privacy.title");
    }
    if (intro) {
      patch.privacy.intro = intro;
      importedFields.push("privacy.intro");
    }

    var policyMap = [
      { key: "scopeText", label: /scope/i },
      { key: "dataText", label: /data\s+we\s+process|data/i },
      { key: "noCookiesText", label: /no\s+cookies/i },
      { key: "noMarketingText", label: /no\s+marketing/i },
      { key: "howUseText", label: /how\s+we\s+use|how\s+use/i },
      { key: "enforcementText", label: /enforcement|compliance|governance/i }
    ];
    policyMap.forEach(function (entry) {
      var re = new RegExp("<h2[^>]*>(?:[\\s\\S]*?)(?:" + entry.label.source + ")(?:[\\s\\S]*?)<\\/h2>[\\s\\S]*?<p[^>]*>([\\s\\S]*?)<\\/p>", "i");
      var text = extractFirstText(html, [re]);
      if (!text) {
        return;
      }
      patch.privacy[entry.key] = text;
      importedFields.push("privacy." + entry.key);
    });

    var privacyColorMap = {
      "--privacy-bg-color": "bgColor",
      "--privacy-text-color": "textColor",
      "--privacy-muted-color": "mutedColor",
      "--privacy-line-color": "lineColor",
      "--privacy-accent-color": "accentColor",
      "--privacy-card-color": "cardColor",
      "--privacy-tab-text-color": "tabTextColor",
      "--privacy-tab-bg-color": "tabBgColor"
    };
    Object.keys(privacyColorMap).forEach(function (cssVar) {
      var value = readCssVarText(styleMap, cssVar);
      if (!value) {
        return;
      }
      patch.privacy[privacyColorMap[cssVar]] = value;
      importedFields.push("privacy." + privacyColorMap[cssVar]);
    });

    var privacyNumberMap = {
      "--privacy-top-band-height": "topBandHeight",
      "--privacy-hero-top-padding": "heroTopPadding",
      "--privacy-card-padding": "cardPadding",
      "--privacy-layout-gap": "layoutGap"
    };
    Object.keys(privacyNumberMap).forEach(function (cssVar) {
      var number = readCssVarNumber(styleMap, cssVar);
      if (number === null) {
        return;
      }
      patch.privacy[privacyNumberMap[cssVar]] = number;
      importedFields.push("privacy." + privacyNumberMap[cssVar]);
    });

    if (/<nav[^>]*class=(?:\"[^\"]*transparent-tabs[^\"]*\"|'[^']*transparent-tabs[^']*')/i.test(String(html || ""))) {
      patch.privacy.topTabsTransparent = true;
      importedFields.push("privacy.topTabsTransparent");
    }

    return {
      patch: patch,
      importedFields: importedFields,
      warnings: importedFields.length ? [] : ["No PRIVACY fields could be extracted."]
    };
  }

  function mergeImportPatches(basePatch, incomingPatch) {
    var base = basePatch && typeof basePatch === "object" ? basePatch : {};
    var incoming = incomingPatch && typeof incomingPatch === "object" ? incomingPatch : {};
    var merged = Array.isArray(base) ? base.slice() : Object.assign({}, base);

    Object.keys(incoming).forEach(function (key) {
      var nextValue = incoming[key];
      var previousValue = merged[key];
      if (
        nextValue && typeof nextValue === "object" && !Array.isArray(nextValue)
        && previousValue && typeof previousValue === "object" && !Array.isArray(previousValue)
      ) {
        merged[key] = mergeImportPatches(previousValue, nextValue);
        return;
      }
      merged[key] = nextValue;
    });

    return merged;
  }

  function buildImportReport(pageResults) {
    var pages = pageResults || {};
    var summary = {
      importedFieldsCount: 0,
      warningsCount: 0,
      failedPages: [],
      pages: pages
    };

    Object.keys(pages).forEach(function (pageName) {
      var pageResult = pages[pageName] || {};
      summary.importedFieldsCount += Array.isArray(pageResult.importedFields) ? pageResult.importedFields.length : 0;
      summary.warningsCount += Array.isArray(pageResult.warnings) ? pageResult.warnings.length : 0;
      if (pageResult.success === false) {
        summary.failedPages.push(pageName);
      }
    });

    summary.message = summary.failedPages.length
      ? "Live import completed with issues: " + summary.failedPages.join(", ") + "."
      : "Live import completed.";

    return summary;
  }

  window.ConfiguratorImportBridge = {
    parseStyleDeclarations: parseStyleDeclarations,
    parseTranslate: parseTranslate,
    extractDragPositions: extractDragPositions,
    extractHomePatch: extractHomePatch,
    extractContactPatch: extractContactPatch,
    extractPrivacyPatch: extractPrivacyPatch,
    mergeImportPatches: mergeImportPatches,
    buildImportReport: buildImportReport
  };
})();
