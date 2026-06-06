(function () {
  var LS_KEY = 'regrade_waitlist_v1';

  function cfg() {
    return (typeof window !== 'undefined' && window.REGRADE_CONFIG) || {};
  }

  function inbox() {
    var email = String(cfg().waitlistEmail || '').trim();
    return email && email.indexOf('@') > 0 ? email : 'prestonjaysusanto@gmail.com';
  }

  function showSuccess(form) {
    form.className = 'signup done';
    form.innerHTML =
      '<span class="ck">✓</span> You\u2019re on the list \u2014 we\u2019ll email you when iOS opens.';
  }

  function initCounter() {
    var el = document.getElementById('ctaCount');
    if (!el) return;
    var target = 2843;
    var shown = false;
    new IntersectionObserver(
      function (entries) {
        if (!entries[0].isIntersecting || shown) return;
        shown = true;
        var start = null;
        function frame(t) {
          if (start === null) start = t;
          var p = Math.min(1, (t - start) / 1400);
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(eased * target).toLocaleString('en-US');
          if (p < 1) requestAnimationFrame(frame);
          else el.textContent = target.toLocaleString('en-US');
        }
        requestAnimationFrame(frame);
      },
      { threshold: 0.4 }
    ).observe(el);
  }

  function initForm() {
    var form = document.getElementById('signup');
    if (!form) return;

    var next = document.getElementById('signupNext');
    if (next) {
      next.value = window.location.origin + '/?joined=1#cta';
    }

    form.action = 'https://formsubmit.co/' + encodeURIComponent(inbox());

    if (new URLSearchParams(window.location.search).get('joined') === '1') {
      showSuccess(form);
      try {
        var params = new URLSearchParams(window.location.search);
        params.delete('joined');
        var qs = params.toString();
        window.history.replaceState({}, document.title, window.location.pathname + (qs ? '?' + qs : '') + window.location.hash);
      } catch (_) {
        /* ignore */
      }
      return;
    }

    form.addEventListener('submit', function () {
      var input = document.getElementById('signupEmail');
      var email = ((input && input.value) || '').trim().toLowerCase();
      if (!email) return;
      try {
        var prev = JSON.parse(localStorage.getItem(LS_KEY) || '[]');
        if (Array.isArray(prev)) {
          prev.push({ email: email, source: 'website', ts: new Date().toISOString() });
          localStorage.setItem(LS_KEY, JSON.stringify(prev));
        }
      } catch (_) {
        /* ignore */
      }
      var btn = form.querySelector('button[type="submit"]');
      if (btn) {
        btn.disabled = true;
        btn.textContent = 'Saving…';
      }
    });
  }

  function boot() {
    initCounter();
    initForm();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
