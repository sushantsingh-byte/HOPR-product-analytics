/* HOPR Product Analytics — Mixpanel */

window.HOPR_ANALYTICS = {
  mixpanelToken: "9cfb41711184c3c4988c94858ff5af9d",
  gaMeasurementId: ""
};

(function () {
  var cfg = window.HOPR_ANALYTICS;
  var mixpanelReady = false;
  var queue = []; // SDK load hone se pehle ke events yahan wait karenge

  function flushQueue() {
    while (queue.length) {
      var job = queue.shift();
      try { job(); } catch (e) { console.error("[HOPR] Queued call failed:", e); }
    }
  }

  function whenReady(fn) {
    if (mixpanelReady && window.mixpanel) { fn(); } else { queue.push(fn); }
  }

  // =========================
  // MIXPANEL INITIALIZATION
  // =========================
  function loadMixpanel() {
    if (!cfg.mixpanelToken) {
      console.warn("[HOPR] Mixpanel token is missing");
      return;
    }
    var script = document.createElement("script");
    script.src = "https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js";
    script.async = true;

    script.onload = function () {
      if (!window.mixpanel || !window.mixpanel.init) {
        console.error("[HOPR] Mixpanel object not found");
        return;
      }
      try {
        window.mixpanel.init(cfg.mixpanelToken, {
          persistence: "localStorage",
          debug: true,                 // live hone ke baad false kar dena
          track_pageview: false,       // hum apna page_view_custom bhejte hain
          api_transport: "sendBeacon"  // page change hone par bhi event na chhute
        });
        mixpanelReady = true;
        console.log("[HOPR] Mixpanel initialized successfully");

        // Agar user pehle signup kar chuka hai toh har page par usko identify karo
        try {
          var saved = JSON.parse(localStorage.getItem("hopr_user") || "null");
          if (saved && saved.userId) { window.mixpanel.identify(saved.userId); }
        } catch (e) {}

        window.mixpanel.track("analytics_ready", { provider: "mixpanel", environment: "practice" });
        flushQueue();
      } catch (error) {
        console.error("[HOPR] Mixpanel initialization failed:", error);
      }
    };

    script.onerror = function () {
      console.error("[HOPR] Could not load Mixpanel SDK (ad-blocker on hai kya?)");
    };

    document.head.appendChild(script);
  }

  // =========================
  // TRACK EVENT
  // =========================
  window.track = function (eventName, properties) {
    var props = Object.assign({
      page: location.pathname.split("/").pop() || "index.html",
      page_title: document.title,
      environment: "practice",
      timestamp_client: new Date().toISOString()
    }, properties || {});

    console.log("[HOPR EVENT]", eventName, props);

    whenReady(function () {
      window.mixpanel.track(eventName, props);
      console.log("[HOPR] Sent to Mixpanel:", eventName);
    });
  };

  // =========================
  // IDENTIFY USER
  // =========================
  window.identifyUser = function (userId, traits) {
    whenReady(function () {
      window.mixpanel.identify(userId);
      if (traits) { window.mixpanel.people.set(traits); }
      console.log("[HOPR] User identified:", userId);
    });
  };

  loadMixpanel();

  // =========================
  // PAGE + CLICK EVENTS
  // =========================
  document.addEventListener("DOMContentLoaded", function () {
    track("page_view_custom", { referrer: document.referrer || "direct" });
  });

  // Event delegation: header/footer ya baad mein bane buttons bhi track honge
  document.addEventListener("click", function (e) {
    var el = e.target.closest ? e.target.closest("[data-track]") : null;
    if (!el) return;
    track(el.dataset.track, {
      element_text: (el.innerText || "").trim().slice(0, 80)
    });
  });
})();
