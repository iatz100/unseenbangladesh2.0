/* Unseen Bangladesh 2.0 — shared component behaviour: side menu, about dialog, current-page link.
   Markup and styles come from the build (assets/components + assets/css/components.css). No design here. */
(() => {
  const d = document, body = d.body;
  requestAnimationFrame(() => d.documentElement.classList.add("sc-components-ready"));

  const btn = d.getElementById("sc-menu-btn");
  const closeBtn = d.getElementById("sc-menu-x");
  const scrim = d.getElementById("sc-scrim");
  const side = d.getElementById("sc-side");

  const setMenu = open => {
    body.classList.toggle("sc-menu-open", open);
    btn.setAttribute("aria-expanded", String(open));
    (open ? closeBtn : btn).focus({ preventScroll: true });
  };

  if (btn && closeBtn && scrim && side) {
    btn.addEventListener("click", () => setMenu(true));
    closeBtn.addEventListener("click", () => setMenu(false));
    scrim.addEventListener("click", () => setMenu(false));
    d.addEventListener("keydown", e => {
      if (e.key === "Escape" && body.classList.contains("sc-menu-open")) setMenu(false);
    });
    side.querySelectorAll("a").forEach(a => a.addEventListener("click", () => body.classList.remove("sc-menu-open")));
    addEventListener("resize", () => { if (innerWidth >= 1024) body.classList.remove("sc-menu-open"); });

    // mark the current page in the side menu ("/guide/" === "/guide/index.html")
    const norm = p => p.replace(/index\.html$/, "").replace(/\/+$/, "") || "/";
    const here = norm(location.pathname);
    side.querySelectorAll(".sc-side-nav a[href]").forEach(a => {
      if (norm(new URL(a.href).pathname) === here) a.setAttribute("aria-current", "page");
    });
  }

  const about = d.getElementById("sc-about");
  if (about) {
    const openAbout = () => about.showModal();
    const sideAbout = d.getElementById("sc-side-about");
    const footAbout = d.getElementById("sc-footer-about");
    if (sideAbout) sideAbout.addEventListener("click", () => { body.classList.remove("sc-menu-open"); openAbout(); });
    if (footAbout) footAbout.addEventListener("click", openAbout);
    about.addEventListener("click", e => {
      if (e.target === about || e.target.closest("[data-close]")) about.close();
    });
  }
})();
