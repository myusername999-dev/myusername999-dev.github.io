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

  var menuButton = document.getElementById('contactMenuToggle');
  var root = document.querySelector('.contact-root');
  var nav = document.getElementById('contactNav');

  if (preview && root) {
    var cbg = params.get('cbg');
    var ctxt = params.get('ctxt');
    var cmut = params.get('cmut');
    var cacc = params.get('cacc');
    var csurface = params.get('csurface');
    var cline = params.get('cline');
    var ctabtransparent = params.get('ctabtransparent');

    if (cbg) { root.style.setProperty('--contact-bg-color', cbg); }
    if (ctxt) { root.style.setProperty('--contact-text-color', ctxt); }
    if (cmut) { root.style.setProperty('--contact-muted-color', cmut); }
    if (cacc) { root.style.setProperty('--contact-accent-color', cacc); }
    if (csurface) { root.style.setProperty('--contact-surface-color', csurface); }
    if (cline) { root.style.setProperty('--contact-line-color', cline); }

    if (nav && ctabtransparent === '1') {
      nav.classList.add('transparent-tabs');
    } else if (nav && ctabtransparent === '0') {
      nav.classList.remove('transparent-tabs');
    }
  }

  if (menuButton && root) {
    menuButton.addEventListener('click', function () {
      var open = root.classList.toggle('nav-open');
      menuButton.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  var form = document.getElementById('contactForm');

  if (!form) {
    return;
  }

  var titleNode = document.querySelector('.contact-hero h1');
  var introNode = document.querySelector('.contact-hero p');
  var submitButton = form.querySelector('button[type="submit"]');
  var noteNode = document.querySelector('.contact-note');
  var endpoint = (form.getAttribute('action') || '').trim();
  var subjectPrefix = (form.getAttribute('data-subject-prefix') || 'Website Contact Request').trim();

  if (preview) {
    endpoint = (params.get('cform') || endpoint).trim();
    subjectPrefix = (params.get('csubject') || subjectPrefix).trim();

    if (params.get('ctitle') && titleNode) {
      titleNode.textContent = params.get('ctitle');
    }

    if (params.get('cintro') && introNode) {
      introNode.textContent = params.get('cintro');
    }

    if (params.get('csubmit') && submitButton) {
      submitButton.textContent = params.get('csubmit');
    }
  }

  if (endpoint) {
    form.setAttribute('action', endpoint);
  }

  form.setAttribute('data-subject-prefix', subjectPrefix);

  var hiddenSubject = form.querySelector('input[name="_subject"]');

  if (hiddenSubject) {
    hiddenSubject.value = subjectPrefix + ' - Website';
  }

  if (noteNode) {
    noteNode.textContent = endpoint
      ? 'Submitting sends your message securely via Formspree.'
      : 'Add a Formspree endpoint to enable submit.';
  }

  if (!endpoint) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
    });
  }
})();
