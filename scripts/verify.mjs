import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const requiredFiles = [
  ".editorconfig",
  ".nojekyll",
  "AGENTS.md",
  "CHANGELOG.md",
  "README.md",
  "SECURITY.md",
  "favicon.svg",
  "index.html",
  "script.js",
  "styles.css",
];

const html = read("index.html");
const css = read("styles.css");
const script = read("script.js");

const checks = [
  ["all required project files exist", requiredFiles.every((file) => existsSync(resolve(projectRoot, file)))],
  ["HTML has a responsive viewport", html.includes('name="viewport"')],
  ["HTML loads local CSS and JavaScript", html.includes('href="styles.css"') && html.includes('src="script.js"')],
  ["HTML contains no remote assets", !/(?:src|href)=["']https?:\/\//i.test(html)],
  ["CSS contains no remote assets", !/url\(["']?https?:\/\//i.test(css)],
  ["privacy-preserving referrer metadata is present", html.includes('name="referrer" content="no-referrer"')],
  ["interactive controls use buttons", ["start-button", "stop-button", "sound-toggle", "reset-button"].every((id) => html.includes(`id="${id}"`))],
  ["status updates use a live region", html.includes('aria-live="polite"')],
  ["the document has no duplicate IDs", hasUniqueIds(html)],
  ["reduced motion is supported", css.includes("prefers-reduced-motion: reduce")],
  ["touch interaction is optimized", css.includes("touch-action: manipulation")],
  ["the eight-attempt ending is configured", script.includes("const MAX_ATTEMPTS = 8")],
  ["Web Audio API is used", script.includes("AudioContext") && script.includes("createOscillator")],
  ["all nine alarm antics are present", countAntics(script) === 9],
  ["no dynamic code evaluation is used", !/\beval\s*\(|\bnew\s+Function\s*\(/.test(script)],
];

let failed = false;

for (const [label, passed] of checks) {
  console.log(`${passed ? "✓" : "✗"} ${label}`);
  failed ||= !passed;
}

if (failed) {
  process.exitCode = 1;
}

function read(file) {
  const path = resolve(projectRoot, file);

  if (!existsSync(path)) {
    return "";
  }

  return readFileSync(path, "utf8");
}

function hasUniqueIds(markup) {
  const ids = [...markup.matchAll(/\sid=["']([^"']+)["']/g)].map((match) => match[1]);
  return new Set(ids).size === ids.length;
}

function countAntics(source) {
  const anticsBlock = source.match(/const antics = \[([\s\S]*?)\n  \];/);

  if (!anticsBlock) {
    return 0;
  }

  return [...anticsBlock[1].matchAll(/\n    \{\n      message:/g)].length;
}
