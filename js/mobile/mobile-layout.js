function normalizePreviewDevice(value) {
  return String(value || "desktop").toLowerCase() === "mobile" ? "mobile" : "desktop";
}

function cloneState(state) {
  return structuredClone(state);
}

function getMobileLayout(state, key) {
  const overrides = state.mobile && state.mobile.layout;
  if (overrides && overrides[key]) {
    return overrides[key];
  }

  const legacyKeys = {
    nav: "mobileNav",
    heroTitle: "mobileHeroTitle",
    heroSubtitle: "mobileHeroSubtitle",
    cta: "mobileCta"
  };
  return state.layout[legacyKeys[key]] || state.layout[key] || { x: 0, y: 0 };
}

function getMobileLogoOverride(state, index) {
  const overrides = state.mobile && state.mobile.brand && state.mobile.brand.logos;
  const desktopLogo = state.brand && state.brand.logos && state.brand.logos[index];
  return (overrides && overrides[index]) || desktopLogo || { x: 0, y: 0, size: 72 };
}

function isLogoDragKey(dragKey) {
  return /^logo-[01]$/.test(dragKey);
}

function logoIndexFromDragKey(dragKey) {
  return Number.parseInt(String(dragKey).replace("logo-", ""), 10);
}

function getPreviewConfigForDevice(state, previewDevice) {
  const mode = normalizePreviewDevice(previewDevice);
  if (mode !== "mobile") {
    return state;
  }

  const clone = cloneState(state);
  ["nav", "heroTitle", "heroSubtitle", "cta"].forEach((key) => {
    clone.layout[key] = { ...getMobileLayout(clone, key) };
  });

  if (clone.mobile && clone.mobile.theme) {
    clone.theme = { ...clone.theme, ...clone.mobile.theme };
  }

  if (clone.brand && Array.isArray(clone.brand.logos)) {
    clone.brand.logos = clone.brand.logos.map((logo, index) => ({
      ...logo,
      ...getMobileLogoOverride(clone, index)
    }));
  }

  return clone;
}

function ensureMobileOverrides(state) {
  state.mobile = state.mobile || {};
  state.mobile.layout = state.mobile.layout || {};
  state.mobile.brand = state.mobile.brand || {};
  state.mobile.brand.logos = state.mobile.brand.logos || [];
}

function updateDragPositionByDevice(state, previewDevice, dragKey, x, y) {
  const mode = normalizePreviewDevice(previewDevice);
  if (mode === "mobile") {
    ensureMobileOverrides(state);
    if (isLogoDragKey(dragKey)) {
      const index = logoIndexFromDragKey(dragKey);
      const fallback = getMobileLogoOverride(state, index);
      state.mobile.brand.logos[index] = { ...fallback, x, y };
      return;
    }
    state.mobile.layout[dragKey] = { x, y };
    const legacyKeys = {
      nav: "mobileNav",
      heroTitle: "mobileHeroTitle",
      heroSubtitle: "mobileHeroSubtitle",
      cta: "mobileCta"
    };
    if (legacyKeys[dragKey]) {
      state.layout[legacyKeys[dragKey]] = { x, y };
    }
    return;
  }

  if (isLogoDragKey(dragKey)) {
    const index = logoIndexFromDragKey(dragKey);
    state.brand.logos[index].x = x;
    state.brand.logos[index].y = y;
    return;
  }
  state.layout[dragKey] = { x, y };
}

function updateLogoSizeByDevice(state, previewDevice, index, size) {
  const normalizedSize = Math.max(1, Math.min(1200, Number.parseInt(size, 10) || 1));
  if (normalizePreviewDevice(previewDevice) === "mobile") {
    ensureMobileOverrides(state);
    const fallback = getMobileLogoOverride(state, index);
    state.mobile.brand.logos[index] = { ...fallback, size: normalizedSize };
    return;
  }
  state.brand.logos[index].size = normalizedSize;
}

export {
  getMobileLogoOverride,
  getPreviewConfigForDevice,
  normalizePreviewDevice,
  updateDragPositionByDevice,
  updateLogoSizeByDevice
};
