function applyButtonTitlesToScope(scopedSettings, buttons) {
  scopedSettings.hero = scopedSettings.hero || {};
  scopedSettings.hero.buttons = Array.isArray(buttons)
    ? buttons.map((button) => ({
        label: String(button.label || ""),
        href: String(button.href || "#")
      }))
    : [];
}

export { applyButtonTitlesToScope };
