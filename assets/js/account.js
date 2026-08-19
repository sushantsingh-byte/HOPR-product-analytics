document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("signup-form");
  if (form) {
    form.addEventListener("submit", e => {
      e.preventDefault();
      const name = document.getElementById("signup-name").value.trim();
      const email = document.getElementById("signup-email").value.trim();
      const city = document.getElementById("signup-city").value;
      const userId = "demo_" + btoa(email).replace(/[^a-z0-9]/gi,"").slice(0,16);
      localStorage.setItem("hopr_user", JSON.stringify({name,email,city,userId}));
      track("sign_up_started", {signup_method:"email",city});
      track("sign_up_completed", {signup_method:"email",city});
      identifyUser(userId, {name, city});
      const box = document.getElementById("signup-success");
      box.classList.remove("hidden");
      box.innerHTML = `<b>Account created.</b><br>Demo user ${name} is now identified for analytics.`;
    });
  }

  const profile = document.getElementById("profile-form");
  if (profile) {
    profile.addEventListener("submit", e => {
      e.preventDefault();
      const traits = {
        name:document.getElementById("name").value,
        city:document.getElementById("city").value,
        preferred_commute:document.getElementById("commute").value,
        phone_status:document.getElementById("phone").value
      };
      track("profile_updated", traits);
      identifyUser("demo_profile_user", traits);
      const box = document.getElementById("profile-success");
      box.classList.remove("hidden");
      box.textContent = "Profile saved. Check Mixpanel/GA4 for profile_updated.";
    });
  }
});