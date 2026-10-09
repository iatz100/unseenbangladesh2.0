/* Unseen Bangladesh 2.0 — shared component behaviour: theme (light/dark), side menu, about dialog, current-page link.
   Markup and styles come from the build (assets/components + assets/css/components.css). No design here. */
(() => {
  const d = document, root = d.documentElement, body = d.body;
  requestAnimationFrame(() => root.classList.add("sc-components-ready"));

  /* ---------- theme (light / dark) ---------- */
  const THEME_KEY = "ub-theme";
  const mq = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;

  const readSaved = () => {
    try {
      const v = localStorage.getItem(THEME_KEY);
      return v === "dark" || v === "light" ? v : null;
    } catch (e) { return null; }
  };
  const saveTheme = t => { try { localStorage.setItem(THEME_KEY, t); } catch (e) {} };
  const resolveTheme = () => readSaved() || (mq && mq.matches ? "dark" : "light");
  const isDark = () => root.getAttribute("data-theme") === "dark";

  const applyTheme = t => {
    root.setAttribute("data-theme", t);
    d.querySelectorAll("[data-theme-toggle]").forEach(b => b.setAttribute("aria-pressed", String(t === "dark")));
  };

  // apply immediately (the <head> snippet already set this; this keeps the toggles in sync)
  applyTheme(resolveTheme());

  // re-sync when restored from back/forward cache, when another tab changes the saved
  // preference, and once the DOM is ready (toggles exist)
  addEventListener("pageshow", () => applyTheme(resolveTheme()));
  addEventListener("storage", e => { if (e.key === THEME_KEY) applyTheme(resolveTheme()); });
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", () => applyTheme(resolveTheme()));

  d.querySelectorAll("[data-theme-toggle]").forEach(b => {
    b.addEventListener("click", () => {
      const next = isDark() ? "light" : "dark";
      saveTheme(next);
      applyTheme(next);
    });
  });

  // follow the device setting only while the visitor has not chosen a theme
  if (mq) {
    const onSystemChange = e => { if (!readSaved()) applyTheme(e.matches ? "dark" : "light"); };
    if (mq.addEventListener) mq.addEventListener("change", onSystemChange);
    else if (mq.addListener) mq.addListener(onSystemChange);
  }

  /* ---------- side menu ---------- */
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

  /* ---------- about dialog ---------- */
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
