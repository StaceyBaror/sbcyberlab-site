(function () {
  // Year
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  // Helpers
  function getParam(name) {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.has(name)) return searchParams.get(name);

    // Support legacy: #contact?sent=1
    const hash = window.location.hash || "";
    const qIndex = hash.indexOf("?");
    if (qIndex >= 0) {
      const hashParams = new URLSearchParams(hash.slice(qIndex + 1));
      if (hashParams.has(name)) return hashParams.get(name);
    }
    return null;
  }

  // Success banner (Formspree redirect)
  const banner = document.getElementById("success-banner");
  if (banner && getParam("sent") === "1") {
    banner.hidden = false;
  }

  // Nav
  const toggle = document.querySelector(".nav-toggle");
  const menu = document.querySelector("#nav-menu");
  if (!toggle || !menu) return;

  function closeMenu() {
    toggle.setAttribute("aria-expanded", "false");
    menu.classList.remove("show");
  }

  function openMenu() {
    toggle.setAttribute("aria-expanded", "true");
    menu.classList.add("show");
  }

  toggle.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    isOpen ? closeMenu() : openMenu();
  });

  // Close on link click
  menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeMenu));

  // Close on Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });

  // Close when clicking outside
  document.addEventListener("click", (e) => {
    const target = e.target;
    if (!(target instanceof Element)) return;
    const clickInside = menu.contains(target) || toggle.contains(target);
    if (!clickInside) closeMenu();
  });

  // Keep state consistent on resize/orientation changes
  window.addEventListener("resize", closeMenu);
})();
