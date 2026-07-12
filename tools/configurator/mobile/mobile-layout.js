function normalizePreviewDevice(value) {
  return String(value || "desktop").toLowerCase() === "mobile" ? "mobile" : "desktop";
}

function getPreviewConfigForDevice(state, previewDevice) {
  const mode = normalizePreviewDevice(previewDevice);
  if (mode !== "mobile") {
    return state;
  }

  const clone = structuredClone(state);
  clone.layout.nav = { ...(clone.layout.mobileNav || { x: 0, y: 0 }) };
  clone.layout.heroTitle = { ...(clone.layout.mobileHeroTitle || { x: 0, y: 0 }) };
  clone.layout.heroSubtitle = { ...(clone.layout.mobileHeroSubtitle || { x: 0, y: 0 }) };
  clone.layout.cta = { ...(clone.layout.mobileCta || { x: 0, y: 0 }) };

  return clone;
}

function updateDragPositionByDevice(state, previewDevice, dragKey, x, y) {
  const mode = normalizePreviewDevice(previewDevice);
  if (mode === "mobile") {
    if (dragKey === "nav") {
      state.layout.mobileNav = { x, y };
      return;
    }
    if (dragKey === "heroTitle") {
      state.layout.mobileHeroTitle = { x, y };
      return;
    }
    if (dragKey === "heroSubtitle") {
      state.layout.mobileHeroSubtitle = { x, y };
      return;
    }
    if (dragKey === "cta") {
      state.layout.mobileCta = { x, y };
      return;
    }
  }

  state.layout[dragKey] = { x, y };
}

export { normalizePreviewDevice, getPreviewConfigForDevice, updateDragPositionByDevice };
