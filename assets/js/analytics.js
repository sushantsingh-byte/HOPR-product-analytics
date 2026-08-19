/* HOPR Product Analytics Lab
   Add your real IDs in this file. The website works even when IDs are blank.
   Mixpanel: https://mixpanel.com/
   GA4: https://analytics.google.com/
*/
window.HOPR_ANALYTICS = {
  mixpanelToken: "7334537f0cb8f90b792ca5243a019483",       // Example: "abc123..."
  gaMeasurementId: ""      // Example: "G-ABC123XYZ"
};

(function () {
  const cfg = window.HOPR_ANALYTICS;

  // Google Analytics 4
  if (cfg.gaMeasurementId) {
    const s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(cfg.gaMeasurementId);
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function(){ dataLayer.push(arguments); };
    gtag("js", new Date());
    gtag("config", cfg.gaMeasurementId, { send_page_view: true });
  }

  // Mixpanel
  if (cfg.mixpanelToken) {
    const s = document.createElement("script");
    s.src = "https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js";
    s.onload = function () {
      if (window.mixpanel) {
        mixpanel.init(cfg.mixpanelToken, {
          debug: true,
          persistence: "localStorage",
          track_pageview: false
        });
        window.HOPR_MIXPANEL_READY = true;
        track("analytics_ready", { provider: "mixpanel" });
      }
    };
    document.head.appendChild(s);
  }

  window.track = function(eventName, properties) {
    const props = Object.assign({
      page: location.pathname.split("/").pop() || "index.html",
      page_title: document.title,
      environment: "practice",
      timestamp_client: new Date().toISOString()
    }, properties || {});

    if (window.HOPR_ANALYTICS.gaMeasurementId && window.gtag) {
      window.gtag("event", eventName, props);
    }
    if (window.HOPR_MIXPANEL_READY && window.mixpanel) {
      window.mixpanel.track(eventName, props);
    }

    // Useful fallback: inspect events in browser console before configuring tools.
    console.log("[HOPR EVENT]", eventName, props);
  };

  window.identifyUser = function(userId, traits) {
    if (window.HOPR_MIXPANEL_READY && window.mixpanel) {
      mixpanel.identify(userId);
      if (traits) mixpanel.people.set(traits);
    }
    if (window.HOPR_ANALYTICS.gaMeasurementId && window.gtag) {
      gtag("set", "user_properties", traits || {});
    }
  };

  document.addEventListener("DOMContentLoaded", function () {
    track("page_view_custom", {
      referrer: document.referrer || "direct"
    });

    document.querySelectorAll("[data-track]").forEach(function(el) {
      el.addEventListener("click", function() {
        track(el.dataset.track, { element_text: (el.innerText || "").trim().slice(0, 80) });
      });
    });
  });
})();