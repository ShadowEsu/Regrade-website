(function () {
  var DURATION = 1200;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function ease(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function navOffset() {
    var nav = document.getElementById('nav');
    return nav ? nav.offsetHeight : 0;
  }

  function scrollToY(targetY) {
    var y = Math.max(0, targetY);
    if (reduced) {
      window.scrollTo(0, y);
      return;
    }
    var startY = window.scrollY;
    var delta = y - startY;
    if (Math.abs(delta) < 2) return;
    var start = null;
    function frame(t) {
      if (start === null) start = t;
      var p = Math.min(1, (t - start) / DURATION);
      window.scrollTo(0, startY + delta * ease(p));
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  function scrollToElement(el, opts) {
    opts = opts || {};
    var block = opts.block || 'start';
    var rect = el.getBoundingClientRect();
    var y = window.scrollY + rect.top;
    if (block === 'center') {
      y -= (window.innerHeight - rect.height) / 2;
    } else {
      y -= navOffset() + 8;
    }
    scrollToY(y);
  }

  window.regradeScrollTo = scrollToElement;

  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a) return;
    var hash = a.getAttribute('href');
    if (!hash || hash === '#') return;
    var target = document.querySelector(hash);
    if (!target) return;
    e.preventDefault();
    scrollToElement(target);
    history.pushState(null, '', hash);
  });
})();
