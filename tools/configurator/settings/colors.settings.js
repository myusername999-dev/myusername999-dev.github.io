function applyColorsToScope(scopedSettings, colors) {
  scopedSettings.theme = scopedSettings.theme || {};
  Object.assign(scopedSettings.theme, {
    bgColor: colors.bgColor,
    textColor: colors.textColor,
    accentColor: colors.accentColor,
    mutedColor: colors.mutedColor,
    surfaceColor: colors.surfaceColor,
    buttonTextColor: colors.buttonTextColor
  });
}

export { applyColorsToScope };
