/* Unseen Bangladesh 2.0 — shared components: loader + behaviour.
   Pages contain only placeholders: <div data-component="header|side-menu|footer"></div>.
   The master files in assets/components/ are fetched once per page and put in place of their placeholder,
   so the header, side menu and footer exist exactly once in the page. Their styles come from
   assets/css/components.css. Every URL inside a master is resolved against the site root, so the same
   files work from any folder depth. */
(() => {
  const d = document, root = d.documentElement;
  requestAnimationFrame(() => root.classList.add("sc-components-ready"));

  /* ---------- 1. locate the site root from this script's own address ---------- */
  const self = d.currentScript || d.querySelector('script[src$="components.js"]');
  const siteRoot = new URL("../../", self && self.src ? self.src : location.href);
  const assetRoot = new URL("assets/", siteRoot).href;

  /* ---------- 2. put each master in place of its placeholder ----------
     Masters are kept in sessionStorage for this VERSION, so every page after the first one inserts the
     header, side menu and footer during the same script run: no waiting, no empty header, no flash.
     Bump VERSION whenever a file in assets/components/ changes. */
  const VERSION = "2026-10-11h";
  const storeKey = name => `ub.comp.${VERSION}.${name}`;
  const cached = name => { try { return sessionStorage.getItem(storeKey(name)); } catch (e) { return null; } };
  const keep = (name, html) => { try { sessionStorage.setItem(storeKey(name), html); } catch (e) {} };
  const localise = html => html.replace(/(href|src)="assets\//g, (m, a) => `${a}="${assetRoot}`);
  const fromNetwork = (name, tries = 2) => fetch(new URL(`assets/components/${name}.html`, siteRoot), { cache: "force-cache" })
    .then(r => { if (!r.ok) throw new Error(`${name}: HTTP ${r.status}`); return r.text(); })
    .then(html => { keep(name, html); return html; })
    .catch(err => (tries > 1 ? new Promise(res => setTimeout(res, 800)).then(() => fromNetwork(name, tries - 1)) : Promise.reject(err)));
  const fill = (slot, html) => { if (slot.isConnected) slot.replaceWith(d.createRange().createContextualFragment(localise(html))); };

  const place = () => {
    const seen = new Set(), waiting = [];
    [...d.querySelectorAll("[data-component]")].forEach(slot => {
      const name = slot.getAttribute("data-component");
      if (seen.has(name) || d.querySelector(`.sc-${name === "side-menu" ? "side" : name}`)) { slot.remove(); return; }   // never a second copy
      seen.add(name);
      const html = cached(name);
      if (html) fill(slot, html);                                                    // synchronous path
      else waiting.push(fromNetwork(name).then(h => fill(slot, h)).catch(err => console.warn("component not loaded:", err.message)));
    });
    return waiting.length ? Promise.all(waiting) : null;
  };

  /* ---------- 3. behaviour (runs once, after the components are in place) ---------- */
  const init = () => {
    const body = d.body;
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
      side.inert = true;                                             // hidden menu is not focusable
      btn.addEventListener("click", () => setMenu(true));
      closeBtn.addEventListener("click", () => setMenu(false));
      scrim.addEventListener("click", () => setMenu(false));
      d.addEventListener("keydown", e => {
        if (e.key === "Escape" && body.classList.contains("sc-menu-open")) setMenu(false);
      });
      side.querySelectorAll("a").forEach(a => a.addEventListener("click", () => body.classList.remove("sc-menu-open")));
      addEventListener("resize", () => { if (innerWidth >= 1024) body.classList.remove("sc-menu-open"); });

      // mark the current page in the side menu and header nav ("/guide/" === "/guide/index.html")
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

    // language toggle: Bengali is the default; the choice is remembered on this device
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
      saveLang(next); applyLang(next);
    }));
  };

  let ready = false;
  const finish = () => {
    if (ready) return; ready = true;
    if (!window.__ubComponents) { window.__ubComponents = true; init(); }
    d.dispatchEvent(new Event("ub:components-ready"));          // page scripts that need the header/menu wait for this
  };
  const pending = place();
  if (pending && pending.then) pending.then(finish); else finish();
})();
