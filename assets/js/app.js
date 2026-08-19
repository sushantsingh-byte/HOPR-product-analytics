document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("app-header");
  const footer = document.getElementById("app-footer");

  if (header) {
    header.innerHTML = `
      <header class="nav">
        <a class="brand" href="index.html" data-track="nav_logo"><span class="brand-mark">H</span> HOPR</a>
        <nav>
          <a href="find-rides.html" data-track="nav_find_rides">Find a ride</a>
          <a href="offer-ride.html" data-track="nav_offer_ride">Offer a ride</a>
          <a href="how-it-works.html" data-track="nav_how_it_works">How it works</a>
          <a href="dashboard.html" data-track="nav_dashboard">Dashboard</a>
        </nav>
        <a class="nav-profile" href="profile.html" data-track="nav_profile">SK</a>
      </header>`;
  }

  if (footer) {
    footer.innerHTML = `
      <footer class="footer">
        <div><a class="brand" href="index.html"><span class="brand-mark">H</span> HOPR</a><p>Carpooling made practical, social and measurable.</p></div>
        <div><b>Product</b><a href="find-rides.html">Find a ride</a><a href="offer-ride.html">Offer a ride</a><a href="how-it-works.html">How it works</a></div>
        <div><b>Practice</b><a href="dashboard.html">Dashboard</a><a href="profile.html">Profile</a><a href="signup.html">Sign up</a></div>
      </footer>`;
  }

  const dateInputs = document.querySelectorAll('input[type="date"]');
  const today = new Date().toISOString().split("T")[0];
  dateInputs.forEach(i => { if (!i.value) i.value = today; });

  const path = location.pathname.split("/").pop();
  document.querySelectorAll("nav a").forEach(a => {
    if (a.getAttribute("href") === path) a.classList.add("active");
  });
});