#!/usr/bin/env node
/**
 * Build step for Netlify (and local preview): compiles the individual
 * CMS-editable JSON files under /content — the files staff actually edit
 * through the Decap CMS admin panel — into the aggregated JSON files the
 * static site fetches at runtime (/data/*.json).
 *
 * Why this exists: this site has no client-side build tooling (no React/
 * Vite/etc — plain HTML/CSS/JS), and folder-based CMS collections (one file
 * per menu item, per gallery photo, etc.) have no way to be "listed" by a
 * browser fetching static files directly. This script is the one small piece
 * of server-side work needed to bridge that gap: it runs once per deploy
 * (including deploys triggered automatically by a staff member saving an
 * edit in the CMS) and produces plain arrays the browser can fetch directly.
 *
 * Zero npm dependencies — only Node's built-in fs/path — so there's nothing
 * to install and nothing to go out of date.
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const CONTENT_DIR = path.join(ROOT, "content");
const OUT_DIR = path.join(ROOT, "data");

function readJSONFilesInDir(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => {
      const full = path.join(dir, f);
      const raw = fs.readFileSync(full, "utf8");
      try {
        return JSON.parse(raw);
      } catch (err) {
        throw new Error(`Invalid JSON in content/${path.relative(CONTENT_DIR, full)}: ${err.message}`);
      }
    });
}

function sortByOrder(items) {
  return items.slice().sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));
}

function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  // Folder collections: one file per item, aggregated into a single array,
  // ordered by each item's own "order" field (set via drag/number in the CMS).
  const collections = {
    "menu-items.json": sortByOrder(readJSONFilesInDir(path.join(CONTENT_DIR, "menu-items"))),
    "signature-dishes.json": sortByOrder(readJSONFilesInDir(path.join(CONTENT_DIR, "signature-dishes"))),
    "gallery.json": sortByOrder(readJSONFilesInDir(path.join(CONTENT_DIR, "gallery"))),
    "testimonials.json": sortByOrder(readJSONFilesInDir(path.join(CONTENT_DIR, "testimonials"))),
    "features.json": sortByOrder(readJSONFilesInDir(path.join(CONTENT_DIR, "features"))),
  };

  for (const [file, data] of Object.entries(collections)) {
    fs.writeFileSync(path.join(OUT_DIR, file), JSON.stringify(data, null, 2) + "\n");
    console.log(`  data/${file}  (${data.length} item${data.length === 1 ? "" : "s"})`);
  }

  // Singleton "file collection" settings — copied straight through.
  const settingsFiles = ["restaurant.json", "hero.json", "about.json", "sections.json", "menu-categories.json"];
  for (const file of settingsFiles) {
    const src = path.join(CONTENT_DIR, "settings", file);
    const dest = path.join(OUT_DIR, file);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
      console.log(`  data/${file}`);
    } else {
      console.warn(`  ! content/settings/${file} is missing — the site will fall back to its built-in defaults for this section.`);
    }
  }

  console.log("Content build complete.");
}

main();
