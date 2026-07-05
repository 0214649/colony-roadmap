#!/usr/bin/env node
/* ============================================================
   colony — private-room encryptor
   ------------------------------------------------------------
   Reads PRIVATE sources from the colony-design vault, encrypts
   them client-side-decryptable (AES-GCM 256, key from passphrase
   via PBKDF2-SHA-256 × 600k), writes ciphertext-only blobs into
   private/*.enc.js. PLAINTEXT NEVER TOUCHES THIS PUBLIC REPO.

   usage:  node tools/encrypt.mjs            (passphrase via env)
           COLONY_PASS='...' node tools/encrypt.mjs
   Update flow: edit the vault → run this → commit the blobs.
   ============================================================ */
import { webcrypto as crypto } from "node:crypto";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { execSync } from "node:child_process";
import { homedir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ITER = 600000;
const VAULT = join(homedir(), "colony", "colony-design");
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCES = [
  { key: "bible",  file: join(VAULT, "design-bible.md") },
  { key: "heroes", file: join(VAULT, "heroes-artifacts.md") },
];

const pass = process.env.COLONY_PASS || process.argv[2];
if (!pass || pass.length < 12) {
  console.error("refusing: set COLONY_PASS to the passphrase (min 12 chars)");
  process.exit(1);
}

const b64 = (buf) => Buffer.from(buf).toString("base64");
const vaultCommit = execSync("git rev-parse --short HEAD", { cwd: VAULT }).toString().trim();

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

mkdirSync(join(ROOT, "private"), { recursive: true });
for (const s of SOURCES) {
  const md = readFileSync(s.file, "utf8");
  // meta rides INSIDE the ciphertext — nothing about the vault is public
  const payload = JSON.stringify({ meta: { generated: new Date().toISOString().slice(0, 10), vault: vaultCommit }, md });
  const blob = await encrypt(payload);
  const out = "// colony — encrypted private room (ciphertext only; see tools/encrypt.mjs)\n"
    + 'window.COLONY_BLOBS = window.COLONY_BLOBS || {};\n'
    + "COLONY_BLOBS[" + JSON.stringify(s.key) + "] = " + JSON.stringify(blob) + ";\n";
  writeFileSync(join(ROOT, "private", s.key + ".enc.js"), out);
  console.log("sealed", s.key, "←", s.file, `(${md.length} chars, vault ${vaultCommit})`);
}
