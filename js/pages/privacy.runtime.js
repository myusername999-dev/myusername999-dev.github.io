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
  var mq = window.matchMedia('(max-width: 760px)');

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
