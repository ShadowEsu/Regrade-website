(function () {
  var LS_KEY = 'regrade_waitlist_v1';

  function cfg() {
    return (typeof window !== 'undefined' && window.REGRADE_CONFIG) || {};
  }

  function inbox() {
    var email = String(cfg().waitlistEmail || '').trim();
    return email && email.indexOf('@') > 0 ? email : 'prestonjaysusanto@gmail.com';
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

  function buildMessage(email) {
    return (
      'New Regrade waitlist signup\n\n' +
      'Email: ' +
      email +
      '\nNotify: ' +
      inbox() +
      '\nSource: regradeapp.tech\nTime: ' +
      new Date().toISOString()
    );
  }

  async function submitToWeb3Forms(email) {
    var key = String(cfg().web3formsAccessKey || '').trim();
    if (!key) return false;

    var fd = new FormData();
    fd.append('access_key', key);
    fd.append('name', email.split('@')[0] || 'Waitlist');
    fd.append('email', email);
    fd.append('subject', 'Regrade waitlist — ' + email);
    fd.append('message', buildMessage(email));
    fd.append('botcheck', '');

    var res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: fd,
      headers: { Accept: 'application/json' },
    });
    var data = await res.json().catch(function () {
      return {};
    });
    return isOk(data);
  }

  function isOk(data) {
    if (!data) return false;
    return data.success === true || data.success === 'true';
  }

  async function submitToFormSubmit(email) {
    var res = await fetch('https://formsubmit.co/ajax/' + encodeURIComponent(inbox()), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        email: email,
        _subject: 'Regrade waitlist — ' + email,
        message: buildMessage(email),
        _template: 'table',
        _captcha: 'false',
      }),
    });
    var data = await res.json().catch(function () {
      return {};
    });
    return isOk(data);
  }

  async function submitWaitlist(email) {
    var results = await Promise.allSettled([
      submitToWeb3Forms(email),
      submitToFormSubmit(email),
    ]);
    return results.some(function (r) {
      return r.status === 'fulfilled' && r.value === true;
    });
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
        var ok = await submitWaitlist(email);
        if (!ok) {
          throw new Error('Waitlist delivery failed');
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
