/* HOPR Product Analytics */

window.HOPR_ANALYTICS = {
  mixpanelToken: "7334537f0cb8f90b792ca5243a019483",
  gaMeasurementId: ""
};

(function () {

  const cfg = window.HOPR_ANALYTICS;

  let mixpanelReady = false;

  // =========================
  // MIXPANEL INITIALIZATION
  // =========================

  function loadMixpanel() {

    if (!cfg.mixpanelToken) {
      console.warn("[HOPR] Mixpanel token is missing");
      return;
    }

    const script = document.createElement("script");

    script.src =
      "https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js";

    script.async = true;

    script.onload = function () {

      console.log("[HOPR] Mixpanel SDK loaded");

      try {

        if (!window.mixpanel) {
          console.error("[HOPR] Mixpanel object not found");
          return;
        }

        window.mixpanel.init(
          cfg.mixpanelToken,
          {
            persistence: "localStorage",
            debug: true,
            track_pageview: false
          }
        );

        mixpanelReady = true;

        console.log("[HOPR] Mixpanel initialized successfully");

        // Send test event
        window.mixpanel.track(
          "analytics_ready",
          {
            provider: "mixpanel",
            environment: "practice"
          }
        );

      } catch (error) {

        console.error(
          "[HOPR] Mixpanel initialization failed:",
          error
        );

      }

    };

    script.onerror = function () {

      console.error(
        "[HOPR] Could not load Mixpanel SDK"
      );

    };

    document.head.appendChild(script);
  }


  // =========================
  // TRACK EVENT
  // =========================

  window.track = function (eventName, properties) {

    const props = Object.assign(
      {
        page:
          location.pathname.split("/").pop()
          || "index.html",

        page_title:
          document.title,

        environment:
          "practice",

        timestamp_client:
          new Date().toISOString()

      },
      properties || {}
    );


    // Console log
    console.log(
      "[HOPR EVENT]",
      eventName,
      props
    );


    // Mixpanel
    if (
      mixpanelReady &&
      window.mixpanel
    ) {

      window.mixpanel.track(
        eventName,
        props
      );

      console.log(
        "[HOPR] Sent to Mixpanel:",
        eventName
      );

    } else {

      console.warn(
        "[HOPR] Mixpanel not ready yet:",
        eventName
      );

    }

  };


  // =========================
  // IDENTIFY USER
  // =========================

  window.identifyUser = function (
    userId,
    traits
  ) {

    if (
      mixpanelReady &&
      window.mixpanel
    ) {

      window.mixpanel.identify(userId);

      if (traits) {

        window.mixpanel.people.set(
          traits
        );

      }

      console.log(
        "[HOPR] User identified:",
        userId
      );

    }

  };


  // =========================
  // START MIXPANEL
  // =========================

  loadMixpanel();


  // =========================
  // PAGE EVENTS
  // =========================

  document.addEventListener(
    "DOMContentLoaded",
    function () {

      track(
        "page_view_custom",
        {
          referrer:
            document.referrer || "direct"
        }
      );


      // CTA / navigation events

      document
        .querySelectorAll("[data-track]")
        .forEach(function (element) {

          element.addEventListener(
            "click",
            function () {

              track(
                element.dataset.track,
                {
                  element_text:
                    (
                      element.innerText || ""
                    )
                    .trim()
                    .slice(0, 80)
                }
              );

            }
          );

        });

    }
  );

})();
