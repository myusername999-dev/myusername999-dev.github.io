(function () {
  "use strict";

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
    var match = input.match(/translate\(\s*(-?\d+(?:\.\d+)?)px\s*,\s*(-?\d+(?:\.\d+)?)px\s*\)/i);
    if (!match) {
      return null;
    }
    return {
      x: parseInt(match[1], 10) || 0,
      y: parseInt(match[2], 10) || 0
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

  function extractRootStyle(html, className) {
    var re = new RegExp("<[^>]*class=\\\"[^\\\"]*" + className + "[^\\\"]*\\\"[^>]*style=\\\"([^\\\"]*)\\\"", "i");
    var match = String(html || "").match(re);
    return match ? String(match[1] || "") : "";
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
    var regex = /data-drag-key=\"([^\"]+)\"[^>]*style=\"([^\"]*)\"/gi;
    var match = regex.exec(source);
    while (match) {
      var dragKey = String(match[1] || "").trim();
      var styleText = String(match[2] || "");
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
    }

    var heroSubtitle = extractFirstText(html, [
      /hero-subtitle-slot[\s\S]*?<p[^>]*>([\s\S]*?)<\/p>/i,
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
    var title = extractFirstText(html, [
      /<h1[^>]*>([\s\S]*?)<\/h1>/i,
      /<title[^>]*>([\s\S]*?)<\/title>/i
    ]);
    var intro = extractFirstText(html, [/\<p[^>]*\>([\s\S]*?)\<\/p\>/i]);
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

    return {
      patch: patch,
      importedFields: importedFields,
      warnings: importedFields.length ? [] : ["No CONTACT fields could be extracted."]
    };
  }

  function extractPrivacyPatch(html) {
    var title = extractFirstText(html, [
      /<h1[^>]*>([\s\S]*?)<\/h1>/i,
      /<title[^>]*>([\s\S]*?)<\/title>/i
    ]);
    var intro = extractFirstText(html, [/\<p[^>]*\>([\s\S]*?)\<\/p\>/i]);
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
