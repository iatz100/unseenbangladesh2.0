// Inserts the theme snippet (theme-head.html) into the <head> of every .html file under a folder.
// Usage: node scripts/inject-theme-head.mjs <site-folder>
// - Placed right after <meta name="viewport"> (or right after <head> if there is none).
// - Idempotent: re-running replaces the block between the ub-theme markers instead of duplicating it.
import { readFile, writeFile, readdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const snippet = (await readFile(join(here, "..", "theme-head.html"), "utf8")).trim();
const siteDir = process.argv[2];
if (!siteDir) { console.error("Usage: node scripts/inject-theme-head.mjs <site-folder>"); process.exit(1); }

const SKIP = new Set(["node_modules", ".git", ".vercel"]);
async function* htmlFiles(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    if (SKIP.has(e.name)) continue;
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* htmlFiles(p);
    else if (e.name.endsWith(".html")) yield p;
  }
}

const VIEWPORT = /<meta[^>]*name=["']viewport["'][^>]*>/i;
const HEAD_TAG = /<head(\s[^>]*)?>/i; // matches <head>, not <header>
const IS_PAGE = /<html[\s>]/i;
let changed = 0, skipped = 0;
for await (const file of htmlFiles(siteDir)) {
  let html = await readFile(file, "utf8");
  if (!IS_PAGE.test(html)) { continue; } // component fragments are not full pages
  const START = "<!-- ub-theme:start -->", END = "<!-- ub-theme:end -->";
  let next;
  if (html.includes(START) && html.includes(END)) {
    next = html.replace(new RegExp(START + "[\\s\\S]*?" + END), snippet);
  } else if (VIEWPORT.test(html)) {
    next = html.replace(VIEWPORT, m => m + "\n" + snippet);
  } else if (HEAD_TAG.test(html)) {
    next = html.replace(HEAD_TAG, m => m + "\n" + snippet);
  } else {
    console.warn("SKIP (no <head>):", file); skipped++; continue;
  }
  if (next !== html) { await writeFile(file, next, "utf8"); changed++; }
}
console.log(`theme snippet: ${changed} file(s) updated, ${skipped} skipped`);
