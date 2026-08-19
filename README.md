# HOPR — Product Analytics Practice Website

A multi-page static carpooling product designed specifically for Product Owner / Product Analytics practice.

## Pages
- `index.html` — landing page
- `find-rides.html` — search + results
- `ride.html?id=R101` — ride detail + request
- `offer-ride.html` — publish ride
- `how-it-works.html` — product funnel / analytics questions
- `dashboard.html` — user dashboard
- `profile.html` — profile update
- `signup.html` — mock signup / activation

## Important
This is a frontend-only practice product. There is no real backend, payment system, authentication server, or real ride booking. Forms and requests use browser localStorage / simulated states.

## Analytics
Edit `assets/js/analytics.js`:
- `mixpanelToken: ""`
- `gaMeasurementId: ""`

You can use either tool or both.

### Core events
- page_view_custom
- hero_find_rides
- hero_offer_ride
- nav_find_rides
- nav_offer_ride
- ride_search
- ride_viewed
- ride_detail_viewed
- ride_request_started
- ride_request_completed
- ride_publish_started
- ride_published
- sign_up_started
- sign_up_completed
- profile_updated
- analytics_ready

### Useful event properties
- from
- to
- search_date
- departure_window
- results_count
- ride_id
- driver_id
- fare
- seats_available
- city
- signup_method
- preferred_commute

## GitHub Pages
1. Create a GitHub repository, e.g. `hopr-product-analytics`.
2. Upload all files and folders from this project.
3. GitHub → repository → Settings → Pages.
4. Under Build and deployment, choose `Deploy from a branch`.
5. Select `main` and `/ (root)`.
6. Save.
7. Wait for deployment. Open the generated `github.io` URL.

## Local test
You can double-click `index.html` for a quick visual test. For best results, use VS Code + Live Server or any simple local web server.

## Analytics learning goal
Do not only look at total event counts. Practise:
- acquisition
- activation
- engagement
- conversion
- retention
- funnel analysis
- cohort analysis
- segmentation
- path analysis
- event properties
- user profiles
- conversion rate
- drop-off
- DAU/WAU/MAU
- stickiness
- average rides per active user
- repeat search rate
- search-to-request conversion
- request completion rate
