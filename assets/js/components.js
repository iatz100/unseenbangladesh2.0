/* Unseen Bangladesh 2.0 — shared components: behaviour only.
   The header, side menu and footer markup is written into every page at build time (npm run build),
   so it is already in the HTML before the first paint. This script wires up the menu, the language and
   theme toggles and the scroll background tint. It fetches nothing. */
(() => {
  const d = document, root = d.documentElement, body = d.body;
  requestAnimationFrame(() => root.classList.add("sc-components-ready"));

  /* ---------- page background follows the scroll position (set directly, no easing) ---------- */
  const TINT = {
    light: { top: [233, 245, 231], bottom: [251, 233, 230] },   // light green at the top, light red at the bottom
    dark:  { top: [18, 34, 31],    bottom: [42, 26, 28] }      // the same idea in dark colours
  };
  const paint = () => {
    const pal = TINT[root.getAttribute("data-theme") === "dark" ? "dark" : "light"];
    const span = Math.max(1, d.documentElement.scrollHeight - innerHeight);
    const t = Math.min(1, Math.max(0, scrollY / span));
    const c = pal.top.map((g, i) => Math.round(g + (pal.bottom[i] - g) * t));
    root.style.setProperty("--page-bg", `rgb(${c[0]}, ${c[1]}, ${c[2]})`);
  };
  addEventListener("scroll", paint, { passive: true });
  addEventListener("resize", paint);
  paint();

  const init = () => {
    const btn = d.getElementById("sc-menu-btn");
    const closeBtn = d.getElementById("sc-menu-x");
    const scrim = d.getElementById("sc-scrim");
    const side = d.getElementById("sc-side");

    const setMenu = open => {
      body.classList.toggle("sc-menu-open", open);
      if (side) side.inert = !open;
      if (btn) btn.setAttribute("aria-expanded", String(open));
      (open ? closeBtn : btn) && (open ? closeBtn : btn).focus({ preventScroll: true });
    };

    if (btn && closeBtn && scrim && side) {
      side.inert = true;
      btn.addEventListener("click", () => setMenu(true));
      closeBtn.addEventListener("click", () => setMenu(false));
      scrim.addEventListener("click", () => setMenu(false));
      d.addEventListener("keydown", e => {
        if (e.key === "Escape" && body.classList.contains("sc-menu-open")) setMenu(false);
      });
      side.querySelectorAll("a").forEach(a => a.addEventListener("click", () => body.classList.remove("sc-menu-open")));
      addEventListener("resize", () => { if (innerWidth >= 1024) body.classList.remove("sc-menu-open"); });

      // mark the current page in the side menu and header nav
      const norm = p => p.replace(/index\.html$/, "").replace(/\/+$/, "") || "/";
      const here = norm(location.pathname);
      d.querySelectorAll(".sc-side-nav a[href], .sc-header-nav a[href]").forEach(a => {
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

    /* ---------- theme: light is the default; the choice is remembered on this device.
       The bootstrap script in <head> has already set data-theme before the first paint. ---------- */
    const applyTheme = theme => {
      const dark = theme === "dark";
      root.setAttribute("data-theme", dark ? "dark" : "light");
      root.classList.add("sc-no-anim");                              // no colour fade while switching
      requestAnimationFrame(() => requestAnimationFrame(() => root.classList.remove("sc-no-anim")));
      const label = dark ? "লাইট মোড চালু করুন / Switch to light mode" : "ডার্ক মোড চালু করুন / Switch to dark mode";
      d.querySelectorAll("#sc-theme, #sc-theme-side").forEach(b => { b.setAttribute("aria-pressed", String(dark)); b.setAttribute("aria-label", label); b.setAttribute("title", label); });
      const meta = d.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute("content", dark ? "#0f1a18" : "#0f6b4f");
      paint();
    };
    const readTheme = () => { try { return localStorage.getItem("ub.theme") === "dark" ? "dark" : "light"; } catch (e) { return "light"; } };
    const saveTheme = t => { try { localStorage.setItem("ub.theme", t); } catch (e) {} };
    applyTheme(readTheme());
    d.querySelectorAll("#sc-theme, #sc-theme-side").forEach(b => b.addEventListener("click", () => {
      const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      saveTheme(next);
      applyTheme(next);
    }));

    /* ---------- language: Bengali is the default; the choice is remembered on this device ---------- */
    const applyLang = lang => {
      if (lang === "en") root.setAttribute("data-lang", "en"); else root.removeAttribute("data-lang");
      root.lang = lang === "en" ? "en" : "bn";
      if (window.UBI18N) window.UBI18N.apply(lang === "en" ? "en" : "bn");
      d.querySelectorAll("#sc-lang, #sc-lang-side").forEach(b => b.setAttribute("aria-pressed", String(lang === "en")));
    };
    const readLang = () => { try { return localStorage.getItem("ub.lang") || "bn"; } catch (e) { return "bn"; } };
    const saveLang = lang => { try { localStorage.setItem("ub.lang", lang); } catch (e) {} };
    applyLang(readLang());
    d.querySelectorAll("#sc-lang, #sc-lang-side").forEach(b => b.addEventListener("click", () => {
      const next = root.getAttribute("data-lang") === "en" ? "bn" : "en";
      saveLang(next);
      applyLang(next);
    }));
  };

  if (!window.__ubComponents) { window.__ubComponents = true; init(); }
  d.dispatchEvent(new Event("ub:components-ready"));          // page scripts that need the header/menu wait for this
})();
