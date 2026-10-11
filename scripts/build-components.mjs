#!/usr/bin/env node
/*
 * Unseen Bangladesh 2.0 — shared component build.
 *
 * Source of truth (the only place these are edited):
 *   assets/components/header.html
 *   assets/components/side-menu.html
 *   assets/components/footer.html
 *   assets/css/components.css
 *   assets/js/components.js            (behaviour only)
 *
 * For every .html page in the project it:
 *   1. keeps exactly one <div data-component="..."></div> placeholder per component and removes any
 *      copy of the master markup (components.js loads the master file once, at run time);
 *   2. regenerates assets/js/components-data.js (the masters that mount.js injects at run time);
 *   3. makes sure components.css is the last stylesheet in <head> and components.js
 *      is loaded before </body>, with correct relative paths;
 *   4. fails if a page holds its own copy of a component, or page CSS targets sc- classes.
 *
 * Usage:
 *   node scripts/build-components.mjs          write the changes
 *   node scripts/build-components.mjs --check  change nothing; exit 1 if any page is out of date
 */
import { readFile, writeFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CHECK = process.argv.includes("--check");

const COMPONENTS = [
  { name: "header", file: "assets/components/header.html" },
  { name: "side-menu", file: "assets/components/side-menu.html" },
  { name: "footer", file: "assets/components/footer.html" },
];
const CSS_FILE = "assets/css/components.css";
const JS_FILE = "assets/js/components.js";
const REQUIRED_IDS = ["sc-menu-btn", "sc-menu-x", "sc-scrim", "sc-side", "sc-side-about", "sc-footer-about", "sc-about"];
const SKIP_DIRS = new Set(["node_modules", ".git", ".vercel", "assets", "scripts", "dist"]);

const isRelative = v => v && !/^(#|\/|[a-z][a-z0-9+.-]*:)/i.test(v);
const blockRe = name => new RegExp(`<!-- sc:${name}:start -->[\\s\\S]*?<!-- sc:${name}:end -->`);
const placeholderRe = name => new RegExp(`<div\\s+data-component="${name}"\\s*>\\s*</div>`);

async function findPages(dir, out = []) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    if (e.isDirectory()) {
      if (!SKIP_DIRS.has(e.name)) await findPages(path.join(dir, e.name), out);
    } else if (e.name.endsWith(".html")) {
      out.push(path.join(dir, e.name));
    }
  }
  return out;
}

const depthOf = file => path.relative(ROOT, path.dirname(file)).split(path.sep).filter(Boolean).length;
const toPageUrl = (p, depth) => (depth === 0 ? "./" : "../".repeat(depth)) + p.replace(/^\.\//, "");

function rewriteUrls(html, depth) {
  return html.replace(/\b(href|src)="([^"]*)"/g, (m, attr, v) =>
    isRelative(v) ? `${attr}="${toPageUrl(v, depth)}"` : m
  );
}

function buildPage(src, file, masters) {
  const depth = depthOf(file);
  const errors = [], warnings = [];
  let html = src;

  // every page holds ONE placeholder per component; the master is loaded by components.js at run time
  for (const { name } of COMPONENTS) {
    const placeholder = `<div data-component="${name}"></div>`;
    if (blockRe(name).test(html)) html = html.replace(blockRe(name), placeholder);
    else if (placeholderRe(name).test(html)) html = html.replace(placeholderRe(name), placeholder);
    else errors.push(`no <div data-component="${name}"></div> placeholder`);
    const count = html.split(`data-component="${name}"`).length - 1;
    if (count !== 1) errors.push(`data-component="${name}" appears ${count} times (expected 1)`);
  }

  // load the shared CSS (last in <head>) and JS (before </body>), depth-correct, exactly once
  html = html.replace(/<link[^>]*components\.css"[^>]*>\s*/g, "");
  html = html.replace(/<script[^>]*components\.js"[^>]*><\/script>\s*/g, "");
  const cssTag = `<link rel="stylesheet" href="${toPageUrl(CSS_FILE, depth)}">`;
  const jsTag = `<script src="${toPageUrl(JS_FILE, depth)}"></script>`;
  if (/<\/head>/i.test(html)) html = html.replace(/<\/head>/i, `${cssTag}\n</head>`);
  else errors.push("no </head>");
  if (/<\/body>/i.test(html)) html = html.replace(/<\/body>/i, `${jsTag}\n</body>`);
  else errors.push("no </body>");

  // no copies of any component markup may be written into a page
  if (/<(header|footer|aside|dialog)\b[^>]*class="sc-|class="sc-(header|footer|side|scrim|about|lang|menu-btn|logo|f-)/.test(html)) errors.push("a component copy is written into the page");
  for (const id of REQUIRED_IDS) {
    if (html.includes(`id="${id}"`)) errors.push(`id="${id}" is written into the page (it belongs to the master component)`);
  }
  if (/<!-- sc:(header|side-menu|footer):(start|end) -->/.test(html)) errors.push("old injected block markers are still present");

  // page CSS must not target shared components
  for (const [, raw] of html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)) {
    const css = raw.replace(/\/\*[\s\S]*?\*\//g, "");
    if (/(^|[\s,}])(\.sc-|#sc-)/.test(css)) errors.push("page CSS targets sc- components (override is not allowed)");
    const bare = css.match(/(^|[\s,}])(header|footer|nav|aside|dialog)\s*[{,.:]/g);
    if (bare) warnings.push(`page CSS has bare element rules (${[...new Set(bare.map(s => s.trim().replace(/[{,.:]$/, "")))].join(", ")}); these can reach shared components`);
  }

  return { html, errors, warnings };
}

const masters = Object.fromEntries(
  await Promise.all(COMPONENTS.map(async c => [c.name, (await readFile(path.join(ROOT, c.file), "utf8")).trim()]))
);

let failed = false;
const outdated = [];
for (const file of await findPages(ROOT)) {
  const rel = path.relative(ROOT, file);
  const src = await readFile(file, "utf8");
  // only real HTML documents are pages; verification files and other .html fragments are left alone
  if (!/<html[\s>]/i.test(src)) { console.log(`skip  ${rel} (not an HTML document)`); continue; }
  const { html, errors, warnings } = buildPage(src, file, masters);
  for (const w of warnings) console.warn(`warn  ${rel}: ${w}`);
  if (errors.length) {
    failed = true;
    for (const e of errors) console.error(`error ${rel}: ${e}`);
    continue;
  }
  if (html !== src) {
    outdated.push(rel);
    if (!CHECK) await writeFile(file, html, "utf8");
  }
}

// the runtime loader (mount.js) reads the masters from assets/js/components-data.js, so that file must be
// regenerated from assets/components/*.html on every build; without this step, edits never reach the site
const DATA_FILE = "assets/js/components-data.js";
const dataJs = "/* generated by scripts/build-components.mjs from assets/components/*.html \u2014 do not edit */\n" +
  "window.UB_MASTERS={\n" +
  COMPONENTS.map(c => `  ${JSON.stringify(c.name)}: ${JSON.stringify(masters[c.name])}`).join(",\n") +
  "\n};\n";
{
  const dataPath = path.join(ROOT, DATA_FILE);
  const currentData = await readFile(dataPath, "utf8").catch(() => "");
  if (currentData !== dataJs) {
    outdated.push(DATA_FILE);
    if (!CHECK) await writeFile(dataPath, dataJs, "utf8");
  }
}

if (failed) {
  console.error("\nBuild failed. Fix the errors above.");
  process.exit(1);
}
if (CHECK && outdated.length) {
  console.error(`Out of date (run "npm run build"): ${outdated.join(", ")}`);
  process.exit(1);
}
console.log(CHECK ? "All pages match the master components." : `Built components into ${outdated.length} page(s)${outdated.length ? ": " + outdated.join(", ") : ""}.`);
