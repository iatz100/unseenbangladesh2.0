// Places the theme snippet (theme-head.html) at the very top of <head> in every page.
//   node scripts/inject-theme-head.mjs <site-folder>          insert / move / refresh the snippet
//   node scripts/inject-theme-head.mjs <site-folder> --check  verify only; exit 1 if any page is wrong
// Rules checked/enforced per page:
//   - exactly one snippet block (between the ub-theme markers)
//   - the block comes before any stylesheet, <style> or <script> in <head>
// Re-running is safe: an existing block is removed and re-inserted at the correct place.
import { readFile, writeFile, readdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const snippet = (await readFile(join(here, "..", "theme-head.html"), "utf8")).trim();

const args = process.argv.slice(2);
const checkOnly = args.includes("--check");
const siteDir = args.find(a => !a.startsWith("--"));
if (!siteDir) { console.error("Usage: node scripts/inject-theme-head.mjs <site-folder> [--check]"); process.exit(1); }

const START = "<!-- ub-theme:start -->", END = "<!-- ub-theme:end -->";
const BLOCK = new RegExp(START + "[\\s\\S]*?" + END + "\\n?");
const HEAD_OPEN = /<head(\s[^>]*)?>\s*\n?/i;              // matches <head>, never <header>
const CHARSET = /<meta[^>]*charset[^>]*>\s*\n?/i;
const IS_PAGE = /<html[\s>]/i;
const LOADER = /<(link\b[^>]*rel=["']?stylesheet|style\b|script\b)/i;
const SKIP = new Set(["node_modules", ".git", ".vercel"]);

async function* htmlFiles(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    if (SKIP.has(e.name)) continue;
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* htmlFiles(p);
    else if (e.name.endsWith(".html")) yield p;
  }
}

let changed = 0, good = 0, scanned = 0;
const problems = [];
for await (const file of htmlFiles(siteDir)) {
  const src = await readFile(file, "utf8");
  if (!IS_PAGE.test(src)) continue;                      // component fragments are not pages
  scanned++;

  if (checkOnly) {
    const count = src.split(START).length - 1;
    const pos = src.indexOf(START);
    if (count !== 1) { problems.push(`${file}: snippet count ${count} (expected 1)`); continue; }
    const headAt = src.search(HEAD_OPEN);
    if (headAt < 0 || pos < headAt) { problems.push(`${file}: snippet is outside <head>`); continue; }
    const beforeSnippet = src.slice(headAt, pos).replace(HEAD_OPEN, "");
    if (LOADER.test(beforeSnippet)) { problems.push(`${file}: a stylesheet/script comes before the snippet`); continue; }
    good++; continue;
  }

  const html = src.replace(BLOCK, "");                    // drop any old copy, wherever it sits
  const head = html.match(HEAD_OPEN);
  if (!head) { problems.push(`${file}: no <head> found`); continue; }
  let at = head.index + head[0].length;
  const cs = html.match(CHARSET);
  if (cs && cs.index > head.index) at = cs.index + cs[0].length;   // after <meta charset> if present
  const next = html.slice(0, at) + snippet + "\n" + html.slice(at);
  if (next !== src) { await writeFile(file, next, "utf8"); changed++; }
  else good++;
}

if (checkOnly) {
  if (scanned === 0) problems.push(`${siteDir}: no HTML pages found`);
  if (problems.length) { console.error("theme check FAILED:\n  " + problems.join("\n  ")); process.exit(1); }
  console.log(`theme check OK: ${good} page(s)`);
} else {
  if (problems.length) console.warn("warnings:\n  " + problems.join("\n  "));
  console.log(`theme snippet: ${changed} page(s) changed, ${good} already correct`);
}
