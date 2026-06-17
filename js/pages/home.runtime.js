(function () {
  var button = document.querySelector('.hamburger');
  var root = document.querySelector('.home-root');

  if (!button || !root) {
    return;
  }

  button.addEventListener('click', function () {
    var open = root.classList.toggle('nav-open');
    button.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
})();
