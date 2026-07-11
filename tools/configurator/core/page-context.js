const PAGE_MODES = ["home", "privacy", "contact"];

function normalizePageMode(value) {
  const mode = String(value || "home").toLowerCase();
  return PAGE_MODES.includes(mode) ? mode : "home";
}

function getActivePageScope(state) {
  const mode = normalizePageMode(state?.display?.pageMode);
  if (!state?.settingsByPage || typeof state.settingsByPage !== "object") {
    return mode;
  }
  return state.settingsByPage[mode] ? mode : "home";
}

function applyScopedSetting(state, path, value) {
  const scope = getActivePageScope(state);
  const scoped = state.settingsByPage[scope];

  if (!scoped) {
    throw new Error("Active scope is missing settings container");
  }

  const parts = String(path).split(".").filter(Boolean);
  if (!parts.length) {
    throw new Error("Setting path is required");
  }

  let cursor = scoped;
  for (let i = 0; i < parts.length - 1; i += 1) {
    const key = parts[i];
    if (!cursor[key] || typeof cursor[key] !== "object") {
      cursor[key] = {};
    }
    cursor = cursor[key];
  }

  cursor[parts[parts.length - 1]] = value;
  return state;
}

export { PAGE_MODES, normalizePageMode, getActivePageScope, applyScopedSetting };
