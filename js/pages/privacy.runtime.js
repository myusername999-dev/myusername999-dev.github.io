(function () {
  var params = new URLSearchParams(window.location.search);
  var preview = params.get('configuratorPreview') === '1';
  var device = (params.get('pdevice') || '').toLowerCase();

  if (preview) {
    if (device === 'mobile') {
      document.body.classList.add('preview-force-mobile');
      document.body.classList.remove('preview-force-desktop');
    } else if (device === 'desktop') {
      document.body.classList.add('preview-force-desktop');
      document.body.classList.remove('preview-force-mobile');
    }
  }

  var toggle = document.getElementById('privacyMenuToggle');
  var topBand = document.querySelector('.top-band');
  var nav = document.getElementById('topNav');
  var root = document.querySelector('.privacy-root');
  var mq = window.matchMedia('(max-width: 760px)');

  if (preview && root) {
    var pbg = params.get('pbg');
    var ptxt = params.get('ptxt');
    var pmut = params.get('pmut');
    var pline = params.get('pline');
    var pacc = params.get('pacc');
    var pcard = params.get('pcard');
    var ptabtxt = params.get('ptabtxt');
    var ptabbg = params.get('ptabbg');
    var ptop = params.get('ptop');
    var phero = params.get('phero');
    var pcardpad = params.get('pcardpad');
    var pgap = params.get('pgap');
    var ptabtransparent = params.get('ptabtransparent');

    if (pbg) { root.style.setProperty('--privacy-bg-color', pbg); }
    if (ptxt) { root.style.setProperty('--privacy-text-color', ptxt); }
    if (pmut) { root.style.setProperty('--privacy-muted-color', pmut); }
    if (pline) { root.style.setProperty('--privacy-line-color', pline); }
    if (pacc) { root.style.setProperty('--privacy-accent-color', pacc); }
    if (pcard) { root.style.setProperty('--privacy-card-color', pcard); }
    if (ptabtxt) { root.style.setProperty('--privacy-tab-text-color', ptabtxt); }
    if (ptabbg) { root.style.setProperty('--privacy-tab-bg-color', ptabbg); }
    if (ptop) {
      var top = parseInt(ptop, 10);
      if (!Number.isNaN(top)) {
        root.style.setProperty('--privacy-top-band-height', top + 'px');
        root.style.setProperty('--privacy-mobile-top-band-height', Math.max(42, top - 12) + 'px');
      }
    }
    if (phero) {
      var heroPad = parseInt(phero, 10);
      if (!Number.isNaN(heroPad)) {
        root.style.setProperty('--privacy-hero-top-padding', heroPad + 'px');
      }
    }
    if (pcardpad) {
      var cardPad = parseInt(pcardpad, 10);
      if (!Number.isNaN(cardPad)) {
        root.style.setProperty('--privacy-card-padding', cardPad + 'px');
        root.style.setProperty('--privacy-mobile-card-padding', Math.max(14, cardPad - 4) + 'px');
      }
    }
    if (pgap) {
      var gap = parseInt(pgap, 10);
      if (!Number.isNaN(gap)) {
        root.style.setProperty('--privacy-layout-gap', gap + 'px');
      }
    }

    if (nav && ptabtransparent === '1') {
      nav.classList.add('transparent-tabs');
    } else if (nav && ptabtransparent === '0') {
      nav.classList.remove('transparent-tabs');
    }
  }

  if (!toggle || !topBand || !nav) {
    return;
  }

  function isMobileMode() {
    return document.body.classList.contains('preview-force-mobile') || mq.matches;
  }

  function closeMenu() {
    topBand.classList.remove('nav-open');
    toggle.setAttribute('aria-expanded', 'false');
  }

  toggle.addEventListener('click', function (event) {
    if (!isMobileMode()) {
      return;
    }

    event.stopPropagation();
    var open = topBand.classList.toggle('nav-open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  nav.addEventListener('click', function (event) {
    if (event.target && event.target.tagName === 'A') {
      closeMenu();
    }
  });

  document.addEventListener('click', function (event) {
    if (!isMobileMode() || !topBand.classList.contains('nav-open')) {
      return;
    }

    if (!topBand.contains(event.target)) {
      closeMenu();
    }
  });

  window.addEventListener('resize', function () {
    if (!isMobileMode()) {
      closeMenu();
    }
  });

  window.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      closeMenu();
    }
  });
})();
