(function () {
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  const toggle = document.querySelector(".nav-toggle");
  const menu = document.querySelector("#nav-menu");

  function getParam(name) {
    // Standard querystring
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.has(name)) return searchParams.get(name);

    // If someone ever places params after the hash, support that too: #contact?sent=1
    const hash = window.location.hash || "";
    const qIndex = hash.indexOf("?");
    if (qIndex >= 0) {
      const hashParams = new URLSearchParams(hash.slice(qIndex + 1));
      if (hashParams.has(name)) return hashParams.get(name);
    }
    return null;
  }

  // Show on-site success message after Formspree redirect
  const banner = document.getElementById("success-banner");
  if (banner && getParam("sent") === "1") {
    banner.hidden = false;
  }

  if (!toggle || !menu) return;

  function closeMenu() {
    toggle.setAttribute("aria-expanded", "false");
    menu.classList.remove("show");
  }

  toggle.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!isOpen));
    menu.classList.toggle("show");
  });

  menu.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });

  document.addEventListener("click", (e) => {
    const target = e.target;
    if (!(target instanceof Element)) return;
    const clickInside = menu.contains(target) || toggle.contains(target);
    if (!clickInside) closeMenu();
  });

  window.addEventListener("resize", () => {
    // If user rotates phone / resizes, keep state consistent
    closeMenu();
  });
})();
