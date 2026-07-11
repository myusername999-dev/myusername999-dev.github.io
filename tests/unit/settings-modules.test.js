import { describe, expect, it } from "vitest";
import { applyColorsToScope } from "../../tools/configurator/settings/colors.settings.js";
import { applyFontsToScope } from "../../tools/configurator/settings/fonts.settings.js";
import { applyButtonTitlesToScope } from "../../tools/configurator/settings/buttons.settings.js";
import { applyLogosToScope } from "../../tools/configurator/settings/logos.settings.js";

describe("settings modules", () => {
  it("applies colors to scoped settings", () => {
    const scoped = {};
    applyColorsToScope(scoped, {
      bgColor: "#010101",
      textColor: "#020202",
      accentColor: "#030303",
      mutedColor: "#040404",
      surfaceColor: "#050505",
      buttonTextColor: "#060606"
    });
    expect(scoped.theme.textColor).toBe("#020202");
  });

  it("applies fonts to scoped settings", () => {
    const scoped = {};
    applyFontsToScope(scoped, {
      fontFamily: "Sora",
      headingSize: 62,
      bodySize: 18,
      buttonTextSize: 16,
      heroTitleFontFamily: "Sora",
      heroSubtitleFontFamily: "Manrope"
    });
    expect(scoped.theme.fontFamily).toBe("Sora");
    expect(scoped.hero.subtitleFontFamily).toBe("Manrope");
  });

  it("applies button titles to scoped settings", () => {
    const scoped = {};
    applyButtonTitlesToScope(scoped, [{ label: "Contact", href: "contact.html" }]);
    expect(scoped.hero.buttons[0].label).toBe("Contact");
  });

  it("applies logos to scoped settings", () => {
    const scoped = {};
    applyLogosToScope(scoped, [{ src: "images/logo.png", fileName: "logo.png", x: 1, y: 2, size: 100, rotation: 0, transparency: 0 }]);
    expect(scoped.brand.logos[0].fileName).toBe("logo.png");
  });
});
