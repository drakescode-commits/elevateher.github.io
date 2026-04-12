document.addEventListener("DOMContentLoaded", () => {

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener("click", e => {
      e.preventDefault();
      document.querySelector(a.getAttribute("href"))
        .scrollIntoView({ behavior: "smooth" });
    });
  });

  // Form submit (conversion capture)
  const form = document.getElementById("bookingForm");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    form.innerHTML = `
      <div style="text-align:center;">
        <h3>Application Received 💎</h3>
        <p>We’ll be in touch within 24–48 hours.</p>
      </div>
    `;
  });

});