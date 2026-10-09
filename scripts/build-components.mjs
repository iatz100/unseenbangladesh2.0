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
 *   1. replaces <div data-component="..."></div> (or the block a previous build injected)
 *      with the master markup, rewriting relative URLs for the page's folder depth
 *      (guide/index.html gets ../assets/..., root pages get ./assets/...);
 *   2. makes sure components.css is the last stylesheet in <head> and components.js
 *      is loaded before </body>, with correct relative paths;
 *   3. fails if a page holds its own copy of a component, or page CSS targets sc- classes.
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

  for (const { name } of COMPONENTS) {
    const block = `<!-- sc:${name}:start -->\n${rewriteUrls(masters[name], depth)}\n<!-- sc:${name}:end -->`;
    if (blockRe(name).test(html)) html = html.replace(blockRe(name), block);
    else if (placeholderRe(name).test(html)) html = html.replace(placeholderRe(name), block);
    else errors.push(`no <div data-component="${name}"></div> placeholder`);
  }

  // load the shared CSS (last in <head>) and JS (before </body>), depth-correct, exactly once
  html = html.replace(/<link[^>]*components\.css"[^>]*>\s*/g, "");
  html = html.replace(/<script[^>]*components\.js"[^>]*><\/script>\s*/g, "");
  const cssTag = `<link rel="stylesheet" href="${toPageUrl(CSS_FILE, depth)}">`;
  const jsTag = `<script src="${toPageUrl(JS_FILE, depth)}" defer></script>`;
  if (/<\/head>/i.test(html)) html = html.replace(/<\/head>/i, `${cssTag}\n</head>`);
  else errors.push("no </head>");
  if (/<\/body>/i.test(html)) html = html.replace(/<\/body>/i, `${jsTag}\n</body>`);
  else errors.push("no </body>");

  // no hand-written copies of components outside the managed blocks
  const outside = html.replace(new RegExp(`<!-- sc:(header|side-menu|footer):start -->[\\s\\S]*?<!-- sc:\\1:end -->`, "g"), "");
  if (/(class|id)="[^"]*\bsc-/.test(outside)) errors.push("a component copy exists outside the managed block");
  for (const id of REQUIRED_IDS) {
    const n = html.split(`id="${id}"`).length - 1;
    if (n !== 1) errors.push(`id="${id}" appears ${n} times (expected 1)`);
  }

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

if (failed) {
  console.error("\nBuild failed. Fix the errors above.");
  process.exit(1);
}
if (CHECK && outdated.length) {
  console.error(`Out of date (run "npm run build"): ${outdated.join(", ")}`);
  process.exit(1);
}
console.log(CHECK ? "All pages match the master components." : `Built components into ${outdated.length} page(s)${outdated.length ? ": " + outdated.join(", ") : ""}.`);
