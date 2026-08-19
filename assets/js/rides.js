const sampleRides = [
  {id:"R101", driver:"Aarav Khanna", initials:"AK", rating:4.9, rides:128, from:"Noida Sector 62", to:"Cyber Hub, Gurugram", time:"08:15 AM", date:"Today", seats:2, fare:85, badge:"Top rated", car:"Hyundai Verna", note:"AC · Music · Small luggage okay"},
  {id:"R102", driver:"Meera Sharma", initials:"MS", rating:4.8, rides:74, from:"Noida Sector 18", to:"Golf Course Road", time:"08:40 AM", date:"Today", seats:1, fare:70, badge:"Fast match", car:"Honda City", note:"Quiet ride · No smoking"},
  {id:"R103", driver:"Kabir Singh", initials:"KS", rating:4.7, rides:91, from:"Botanical Garden", to:"Cyber City", time:"09:05 AM", date:"Today", seats:3, fare:95, badge:"3 seats", car:"Kia Seltos", note:"AC · Flexible pickup"},
  {id:"R104", driver:"Ishita Rao", initials:"IR", rating:4.9, rides:56, from:"Noida Sector 137", to:"MG Road", time:"09:20 AM", date:"Today", seats:2, fare:90, badge:"Highly rated", car:"Tata Nexon", note:"Pet-free · AC"}
];

function renderRides(list) {
  const box = document.getElementById("ride-results");
  if (!box) return;
  box.innerHTML = list.map(r => `
    <article class="ride-card">
      <div class="ride-main">
        <div class="avatar">${r.initials}</div>
        <div class="ride-route"><div><b>${r.from}</b><span>→</span><b>${r.to}</b></div><small>${r.date} · ${r.time} · ${r.seats} seats left</small></div>
        <div class="ride-price"><strong>₹${r.fare}</strong><small>per seat</small></div>
      </div>
      <div class="ride-meta"><span>★ ${r.rating} · ${r.rides} rides</span><span>${r.car}</span><span>${r.note}</span><span class="badge">${r.badge}</span></div>
      <div class="ride-actions"><a class="btn btn-secondary btn-sm" href="ride.html?id=${r.id}" onclick="track('ride_viewed',{ride_id:'${r.id}',driver:'${r.driver}',fare:${r.fare}})">View details</a><button class="btn btn-primary btn-sm" onclick="requestRide('${r.id}')">Request seat</button></div>
    </article>`).join("");
  const count = document.getElementById("result-count");
  if (count) count.textContent = list.length + " rides";
}

function requestRide(id) {
  const ride = sampleRides.find(r => r.id === id);
  track("ride_request_started", {ride_id:id, fare:ride?.fare, seats_available:ride?.seats});
  localStorage.setItem("hopr_requested_ride", id);
  alert("Demo request submitted for " + (ride ? ride.driver : "this ride") + ". This is a simulated confirmation.");
  track("ride_request_completed", {ride_id:id, conversion:true});
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("ride-search-form");
  if (form) {
    renderRides(sampleRides);
    form.addEventListener("submit", e => {
      e.preventDefault();
      const from = document.getElementById("from").value;
      const to = document.getElementById("to").value;
      const date = document.getElementById("date").value;
      const time = document.getElementById("time").value;
      track("ride_search", {from, to, search_date:date, departure_window:time, results_count:sampleRides.length});
      document.getElementById("results-title").textContent = `${from} → ${to}`;
      renderRides(sampleRides);
    });
  }

  const detail = document.getElementById("ride-detail");
  if (detail) {
    const id = new URLSearchParams(location.search).get("id") || "R101";
    const r = sampleRides.find(x => x.id === id) || sampleRides[0];
    track("ride_detail_viewed", {ride_id:r.id, driver_id:r.initials, fare:r.fare});
    detail.innerHTML = `
      <a class="back-link" href="find-rides.html">← Back to rides</a>
      <section class="detail-grid">
        <div class="detail-main">
          <span class="eyebrow">${r.badge}</span><h1>${r.from} → ${r.to}</h1>
          <p class="lead">${r.date} · ${r.time} · ${r.seats} seats available</p>
          <div class="route-line"><span class="route-dot"></span><div><b>${r.from}</b><small>Pickup point · 8:15 AM</small></div></div>
          <div class="route-line"><span class="route-dot end"></span><div><b>${r.to}</b><small>Destination · estimated 9:05 AM</small></div></div>
          <div class="detail-section"><h3>Ride details</h3><p>${r.note}. Driver drives a ${r.car}. Contribution is shown before you request a seat.</p></div>
        </div>
        <aside class="booking-card"><div class="driver-row"><div class="avatar large">${r.initials}</div><div><h3>${r.driver}</h3><p>★ ${r.rating} · ${r.rides} completed rides</p></div></div><hr><div class="booking-price"><span>Contribution</span><strong>₹${r.fare}</strong><small>per seat</small></div><button class="btn btn-primary btn-wide" onclick="requestRide('${r.id}')">Request a seat</button><p class="fine">No real payment is processed in this practice build.</p></aside>
      </section>`;
  }

  const offer = document.getElementById("offer-form");
  if (offer) {
    offer.addEventListener("submit", e => {
      e.preventDefault();
      const payload = {
        pickup:document.getElementById("pickup").value,
        destination:document.getElementById("destination").value,
        date:document.getElementById("ride-date").value,
        time:document.getElementById("ride-time").value,
        seats:Number(document.getElementById("seats").value),
        fare:Number(document.getElementById("fare").value)
      };
      localStorage.setItem("hopr_last_offered_ride", JSON.stringify(payload));
      track("ride_publish_started", payload);
      track("ride_published", payload);
      const success = document.getElementById("offer-success");
      success.classList.remove("hidden");
      success.innerHTML = "<b>Ride published successfully.</b><br>Your sample ride is stored locally. Open the analytics tool and inspect the ride_published event.";
      offer.querySelector("button").disabled = true;
    });
  }
});