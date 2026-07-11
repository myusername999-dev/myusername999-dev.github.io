function createStateFixture() {
  return {
    display: {
      pageMode: "home"
    },
    settingsByPage: {
      home: {
        theme: { textColor: "#111111" }
      },
      privacy: {
        theme: { textColor: "#222222" }
      },
      contact: {
        theme: { textColor: "#333333" }
      }
    },
    layout: {
      nav: { x: 1, y: 2 },
      heroTitle: { x: 3, y: 4 },
      heroSubtitle: { x: 5, y: 6 },
      cta: { x: 7, y: 8 },
      mobileNav: { x: 11, y: 12 },
      mobileHeroTitle: { x: 13, y: 14 },
      mobileHeroSubtitle: { x: 15, y: 16 },
      mobileCta: { x: 17, y: 18 }
    }
  };
}

export { createStateFixture };
