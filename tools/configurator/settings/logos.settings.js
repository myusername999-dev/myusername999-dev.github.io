function applyLogosToScope(scopedSettings, logos) {
  scopedSettings.brand = scopedSettings.brand || {};
  scopedSettings.brand.logos = Array.isArray(logos)
    ? logos.map((logo) => ({
        src: String(logo.src || ""),
        fileName: String(logo.fileName || ""),
        x: Number(logo.x || 0),
        y: Number(logo.y || 0),
        size: Number(logo.size || 120),
        rotation: Number(logo.rotation || 0),
        transparency: Number(logo.transparency || 0)
      }))
    : [];
}

export { applyLogosToScope };
