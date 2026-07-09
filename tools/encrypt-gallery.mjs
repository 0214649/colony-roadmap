#!/usr/bin/env node
/* ============================================================
   colony — the gallery sealer
   ------------------------------------------------------------
   Seals the sprite-gallery catalogue + its image bundles into
   private/gallery*.enc.js — ciphertext only, same AES-GCM(256)
   / PBKDF2-SHA-256×600k scheme as tools/encrypt.mjs, same
   passphrase, so the glass unlocks every private room at once.

   The plaintext (catalogue.json + bundles/*.json of base64 webp
   thumbnails) lives ONLY in a build dir OUTSIDE this repo. No
   thumbnail file ever lands in the public tree — a gated page
   can't hide an image FILE, but an encrypted blob can.

   usage:  COLONY_PASS='…' COLONY_GALLERY_BUILD='/abs/build/dir' \
             node tools/encrypt-gallery.mjs
     build dir must contain: catalogue.json  and  bundles/<key>.json
   ============================================================ */
import { webcrypto as crypto } from "node:crypto";
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from "node:fs";
import { join, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";

const ITER = 600000;
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const BUILD = process.env.COLONY_GALLERY_BUILD;
const pass = process.env.COLONY_PASS || process.argv[2];

if (!pass || pass.length < 12) { console.error("refusing: set COLONY_PASS (min 12 chars)"); process.exit(1); }
if (!BUILD) { console.error("refusing: set COLONY_GALLERY_BUILD to the build dir"); process.exit(1); }

const b64 = (buf) => Buffer.from(buf).toString("base64");
async function encrypt(plaintext) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const base = await crypto.subtle.importKey("raw", new TextEncoder().encode(pass), "PBKDF2", false, ["deriveKey"]);
  const key = await crypto.subtle.deriveKey(
    { name: "PBKDF2", hash: "SHA-256", salt, iterations: ITER },
    base, { name: "AES-GCM", length: 256 }, false, ["encrypt"]);
  const ct = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, new TextEncoder().encode(plaintext));
  return { v: 1, iter: ITER, salt: b64(salt), iv: b64(iv), ct: b64(ct) };
}
async function seal(key, plaintextStr) {
  const blob = await encrypt(plaintextStr);
  const out = "// colony — encrypted gallery blob (ciphertext only; see tools/encrypt-gallery.mjs)\n"
    + "window.COLONY_BLOBS = window.COLONY_BLOBS || {};\n"
    + "COLONY_BLOBS[" + JSON.stringify(key) + "] = " + JSON.stringify(blob) + ";\n";
  writeFileSync(join(ROOT, "private", key + ".enc.js"), out);
  return out.length;
}

mkdirSync(join(ROOT, "private"), { recursive: true });

// 1) the catalogue (metadata only — small, decrypted on unlock)
const cat = readFileSync(join(BUILD, "catalogue.json"), "utf8");
let n = await seal("gallery", cat);
console.log("sealed gallery (catalogue)", (n / 1024).toFixed(0) + "kb");

// 2) the image bundles (base64 thumbnails — lazy-decrypted per group)
const bdir = join(BUILD, "bundles");
let total = n, count = 0;
for (const f of readdirSync(bdir).filter((x) => x.endsWith(".json")).sort()) {
  const key = "gallery-" + basename(f, ".json"); // e.g. gallery-img-00
  const sz = await seal(key, readFileSync(join(bdir, f), "utf8"));
  total += sz; count++;
}
console.log("sealed", count, "image bundles ·", (total / 1e6).toFixed(1) + "mb total ciphertext");
