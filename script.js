/* SB Cyber Lab — script.js (V3.0): navigation + banners + UX hardening */
(function () {
  "use strict";

  // ----------------------------
  // Year
  // ----------------------------
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // ----------------------------
  // Helpers
  // ----------------------------
  function getParam(name) {
    // 1) Query string (?sent=1)
    const sp = new URLSearchParams(window.location.search);
    if (sp.has(name)) return sp.get(name);

    // 2) Hash query legacy (#contact?sent=1)
    const hash = window.location.hash || "";
    const qIndex = hash.indexOf("?");
    if (qIndex >= 0) {
      const hp = new URLSearchParams(hash.slice(qIndex + 1));
      if (hp.has(name)) return hp.get(name);
    }

    // 3) Hash-only legacy (#sent=1)
    if (hash.startsWith("#")) {
      const h = hash.slice(1);
      const hp2 = new URLSearchParams(h);
      if (hp2.has(name)) return hp2.get(name);
    }

    return null;
  }

  function isMobileNavActive() {
    // Mirrors your CSS breakpoint where nav becomes a dropdown (max-width: 720px)
    // Use matchMedia so behavior stays correct even if CSS changes in future.
    return window.matchMedia("(max-width: 720px)").matches;
  }

  // ----------------------------
  // Success banner (Formspree redirect)
  // ----------------------------
  const banner = document.getElementById("success-banner");
  if (banner) {
    const sent = getParam("sent");
    if (sent === "1" || sent === "true" || sent === "yes") {
      banner.hidden = false;

      // Optional: focus for accessibility if banner is visible
      if (!banner.hasAttribute("tabindex")) banner.setAttribute("tabindex", "-1");
      banner.focus({ preventScroll: true });
    }
  }

  // ----------------------------
  // Mobile nav toggle
  // ----------------------------
  const toggle = document.querySelector(".nav-toggle");
  const menu = document.querySelector("#nav-menu");

  if (!toggle || !menu) return;

  // Ensure ARIA baseline
  toggle.setAttribute("aria-expanded", "false");
  menu.classList.remove("show");

  function closeMenu() {
    toggle.setAttribute("aria-expanded", "false");
    menu.classList.remove("show");
  }

  function openMenu() {
    toggle.setAttribute("aria-expanded", "true");
    menu.classList.add("show");

    // Focus first link for keyboard users (only on mobile dropdown)
    const firstLink = menu.querySelector("a");
    if (firstLink) firstLink.focus({ preventScroll: true });
  }

  function toggleMenu() {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    isOpen ? closeMenu() : openMenu();
  }

  // Click toggle
  toggle.addEventListener("click", (e) => {
    // Don’t let the click bubble into the “outside click” handler
    e.stopPropagation();

    // Only act like a dropdown on mobile layout.
    // On desktop, the menu is already visible and this should be a no-op.
    if (!isMobileNavActive()) return;

    toggleMenu();
  });

  // Close on link click (mobile only)
  menu.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      if (isMobileNavActive()) closeMenu();
    })
  );

  // Close on Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });

  // Close when clicking outside (mobile only)
  document.addEventListener("click", (e) => {
    if (!isMobileNavActive()) return;

    const target = e.target;
    if (!(target instanceof Element)) return;

    const clickInside = menu.contains(target) || toggle.contains(target);
    if (!clickInside) closeMenu();
  });

  // Keep state consistent on resize / orientation changes
  let resizeTimer = null;
  window.addEventListener("resize", () => {
    // Debounce to avoid jank during resize
    if (resizeTimer) window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      // Always close on breakpoint changes to prevent stuck open state
      closeMenu();
    }, 120);
  });

  // Also close when changing orientation (some mobile browsers don’t fire resize reliably)
  window.addEventListener("orientationchange", closeMenu);
})();
