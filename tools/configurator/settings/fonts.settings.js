function applyFontsToScope(scopedSettings, fonts) {
  scopedSettings.theme = scopedSettings.theme || {};
  scopedSettings.hero = scopedSettings.hero || {};

  scopedSettings.theme.fontFamily = fonts.fontFamily;
  scopedSettings.theme.headingSize = fonts.headingSize;
  scopedSettings.theme.bodySize = fonts.bodySize;
  scopedSettings.theme.buttonTextSize = fonts.buttonTextSize;
  scopedSettings.hero.titleFontFamily = fonts.heroTitleFontFamily;
  scopedSettings.hero.subtitleFontFamily = fonts.heroSubtitleFontFamily;
}

export { applyFontsToScope };
