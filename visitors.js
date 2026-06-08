(function () {
  var VID_KEY = 'regrade_vid_v1';
  var REG_KEY = 'regrade_vid_registered';

  function cfg() {
    return (typeof window !== 'undefined' && window.REGRADE_CONFIG) || {};
  }

  function uuid() {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0;
      var v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  function supabaseReady(c) {
    return c.supabaseUrl && c.supabaseAnonKey;
  }

  function rpc(c, fn, body) {
    var url = String(c.supabaseUrl).replace(/\/$/, '') + '/rest/v1/rpc/' + fn;
    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        apikey: c.supabaseAnonKey,
        Authorization: 'Bearer ' + c.supabaseAnonKey,
      },
      body: JSON.stringify(body || {}),
    });
  }

  function boot() {
    var c = cfg();
    if (!supabaseReady(c)) return;

    var vid = localStorage.getItem(VID_KEY);
    if (!vid) {
      vid = uuid();
      try {
        localStorage.setItem(VID_KEY, vid);
      } catch (_) {
        return;
      }
    }

    if (localStorage.getItem(REG_KEY) === vid) return;

    rpc(c, 'register_visitor', {
      p_visitor_id: vid,
      p_path: location.pathname || '/',
    })
      .then(function (res) {
        if (!res.ok) throw new Error('register failed');
        return res.json();
      })
      .then(function () {
        try {
          localStorage.setItem(REG_KEY, vid);
        } catch (_) {
          /* ignore */
        }
      })
      .catch(function () {
        /* silent — tracking should never break the page */
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
