(function () {
  var LS_KEY = 'regrade_waitlist_v1';

  function cfg() {
    return (typeof window !== 'undefined' && window.REGRADE_CONFIG) || {};
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
      '<span class="ck">✓</span> You\u2019re on the list \u2014 we\u2019ll email you when iOS opens.';
  }

  function recordLocal(email) {
    try {
      var prev = JSON.parse(localStorage.getItem(LS_KEY) || '[]');
      if (!Array.isArray(prev)) return;
      prev.push({ email: email, source: 'website', ts: new Date().toISOString() });
      localStorage.setItem(LS_KEY, JSON.stringify(prev));
    } catch (_) {
      /* ignore */
    }
  }

  async function submitToWeb3Forms(email) {
    var key = String(cfg().web3formsAccessKey || '').trim();
    if (!key) return false;

    var notify = String(cfg().waitlistEmail || '').trim() || 'prestonjaysusanto@gmail.com';
    var fd = new FormData();
    fd.append('access_key', key);
    fd.append('email', email);
    fd.append('subject', 'Regrade waitlist — ' + email);
    fd.append(
      'message',
      'New Regrade waitlist signup\n\nEmail: ' +
        email +
        '\nNotify: ' +
        notify +
        '\nSource: regradeapp.tech\nTime: ' +
        new Date().toISOString()
    );

    var res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: fd,
      headers: { Accept: 'application/json' },
    });
    var data = await res.json().catch(function () {
      return {};
    });
    return !!(data && data.success);
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

    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      var input = document.getElementById('signupEmail');
      var email = ((input && input.value) || '').trim().toLowerCase();
      if (!email || email.indexOf('@') < 1 || email.indexOf('.') < 1) {
        showError(form, 'Enter a valid school email.');
        return;
      }

      var btn = form.querySelector('button[type="submit"]');
      if (btn) {
        btn.disabled = true;
        btn.textContent = 'Saving…';
      }

      try {
        var ok = await submitToWeb3Forms(email);
        if (!ok) {
          throw new Error('Web3Forms submission failed');
        }
        recordLocal(email);
        showSuccess(form);
      } catch (err) {
        console.error('Waitlist signup failed:', err);
        if (btn) {
          btn.disabled = false;
          btn.textContent = 'Reserve my spot';
        }
        showError(form, 'Could not save your email. Please try again in a moment.');
      }
    });
  }

  initCounter();
  initForm();
})();
