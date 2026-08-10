(function () {
  var cfg = window.REGRADE_CONFIG;
  if (!cfg || !cfg.supabaseUrl || !cfg.supabaseAnonKey) return;

  var key = "regrade_vid_v1";
  var id = localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(key, id);
  }

  fetch(cfg.supabaseUrl + "/rest/v1/rpc/register_visitor", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: cfg.supabaseAnonKey,
      Authorization: "Bearer " + cfg.supabaseAnonKey,
    },
    body: JSON.stringify({
      p_visitor_id: id,
      p_path: window.location.pathname || "/",
    }),
  }).catch(function () {});

  setInterval(function () {
    fetch(cfg.supabaseUrl + "/rest/v1/rpc/register_visitor", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: cfg.supabaseAnonKey,
        Authorization: "Bearer " + cfg.supabaseAnonKey,
      },
      body: JSON.stringify({
        p_visitor_id: id,
        p_path: window.location.pathname || "/",
      }),
    }).catch(function () {});
  }, 60000);
})();
