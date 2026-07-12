function normalizePublishScope(scope) {
  const value = String(scope || "all").toLowerCase();
  return ["home", "privacy", "contact", "all"].includes(value) ? value : "all";
}

function buildPublishTargets(scope) {
  const publishScope = normalizePublishScope(scope);
  return {
    home: publishScope === "home" || publishScope === "all",
    privacy: publishScope === "privacy" || publishScope === "all",
    contact: publishScope === "contact" || publishScope === "all"
  };
}

export { normalizePublishScope, buildPublishTargets };
