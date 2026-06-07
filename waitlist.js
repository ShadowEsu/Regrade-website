(function () {
  var LS_KEY = 'regrade_waitlist_v1';

  function cfg() {
    return (typeof window !== 'undefined' && window.REGRADE_CONFIG) || {};
  }

  function inbox() {
    var email = String(cfg().waitlistEmail || '').trim();
    return email && email.indexOf('@') > 0 ? email : 'prestonjaysusanto@gmail.com';
  }

  function isOk(data) {
    if (!data) return false;
    return data.success === true || data.success === 'true';
  }

  function showError(form, message) {
    var old = form.querySelector('.waitlist-error');
    if (old) old.remove();
    var el = document.createElement('p');
    el.className = 'waitlist-error';
    el.setAttribute('role', 'alert');
    el.style.cssText =
      'margin-top:12px;font-size:14px;color:#c7553f;text-align:center;width:100%';
    el.textContent = message;
    form.appendChild(el);
  }

  function showSuccess(form) {
    form.className = 'signup done';
    form.innerHTML =
      '<p class="waitlist-success" role="status" tabindex="-1">' +
      '<span class="ck">✓</span> You\u2019re on the list \u2014 we\u2019ll email you when iOS opens.' +
      '</p>';
    scrollToCta(form);
    var msg = form.querySelector('.waitlist-success');
    if (msg) msg.focus({ preventScroll: true });
  }

  function scrollToCta(form) {
    var section = document.getElementById('cta');
    var target = section || form;
    if (typeof window.regradeScrollTo === 'function') {
      window.regradeScrollTo(target, { block: 'center' });
      return;
    }
    target.scrollIntoView({ block: 'center' });
  }

  function recordLocal(name, email) {
    try {
      var prev = JSON.parse(localStorage.getItem(LS_KEY) || '[]');
      if (!Array.isArray(prev)) return;
      prev.push({ name: name, email: email, source: 'website', ts: new Date().toISOString() });
      localStorage.setItem(LS_KEY, JSON.stringify(prev));
    } catch (_) {
      /* ignore */
    }
  }

  async function submitToFormSubmit(name, email) {
    var res = await fetch('https://formsubmit.co/ajax/' + encodeURIComponent(inbox()), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        name: name,
        email: email,
        _subject: 'Regrade waitlist — ' + name + ' (' + email + ')',
        message:
          'New Regrade waitlist signup\n\nName: ' +
          name +
          '\nEmail: ' +
          email +
          '\nSource: regradeapp.tech\nTime: ' +
          new Date().toISOString(),
        _captcha: 'false',
        _template: 'table',
      }),
    });
    var data = await res.json().catch(function () {
      return {};
    });
    return isOk(data);
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

  function clearJoinedParam() {
    try {
      var params = new URLSearchParams(window.location.search);
      if (!params.has('joined')) return;
      params.delete('joined');
      var qs = params.toString();
      window.history.replaceState({}, document.title, window.location.pathname + (qs ? '?' + qs : '') + window.location.hash);
    } catch (_) {
      /* ignore */
    }
  }

  function initForm() {
    var form = document.getElementById('signup');
    if (!form) return;

    if (new URLSearchParams(window.location.search).get('joined') === '1') {
      showSuccess(form);
      clearJoinedParam();
      return;
    }

    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      var nameInput = document.getElementById('signupName');
      var emailInput = document.getElementById('signupEmail');
      var name = ((nameInput && nameInput.value) || '').trim();
      var email = ((emailInput && emailInput.value) || '').trim().toLowerCase();

      if (!name) {
        showError(form, 'Please enter your name.');
        if (nameInput) nameInput.focus();
        return;
      }
      if (!email || email.indexOf('@') < 1 || email.indexOf('.') < 1) {
        showError(form, 'Enter a valid school email.');
        if (emailInput) emailInput.focus();
        return;
      }

      var old = form.querySelector('.waitlist-error');
      if (old) old.remove();

      var btn = form.querySelector('button[type="submit"]');
      if (btn) {
        btn.disabled = true;
        btn.textContent = 'Saving…';
      }

      try {
        var ok = await submitToFormSubmit(name, email);
        if (!ok) throw new Error('delivery failed');
        recordLocal(name, email);
        showSuccess(form);
      } catch (err) {
        console.error('Waitlist signup failed:', err);
        if (btn) {
          btn.disabled = false;
          btn.textContent = 'Reserve my spot';
        }
        showError(form, 'Could not save your spot. Please try again in a moment.');
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
