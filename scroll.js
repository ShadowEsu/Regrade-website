(function () {
  var FAST = 450;
  var NORMAL = 700;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function ease(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function navOffset() {
    var nav = document.getElementById('nav');
    return nav ? nav.offsetHeight : 0;
  }

  function scrollToY(targetY, duration) {
    var y = Math.max(0, targetY);
    duration = duration || NORMAL;
    if (reduced || duration <= 0) {
      window.scrollTo(0, y);
      return;
    }
    var startY = window.scrollY;
    var delta = y - startY;
    if (Math.abs(delta) < 2) return;
    var start = null;
    function frame(t) {
      if (start === null) start = t;
      var p = Math.min(1, (t - start) / duration);
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
      y -= navOffset() + 12;
    }
    scrollToY(y, opts.duration);
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

    var instant = hash === '#cta' || a.classList.contains('scroll-cta');
    var duration = instant ? FAST : NORMAL;
    scrollToElement(target, { duration: duration });

    if (hash === '#cta') {
      setTimeout(function () {
        var input = document.getElementById('signupName') || document.getElementById('signupEmail');
        if (input) input.focus({ preventScroll: true });
      }, instant ? 80 : 400);
    }

    history.pushState(null, '', hash);
  });
})();
