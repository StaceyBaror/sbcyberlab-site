(function () {
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  const toggle = document.querySelector(".nav-toggle");
  const menu = document.querySelector("#nav-menu");

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

  // Close on link click
  menu.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", closeMenu);
  });

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
})();
