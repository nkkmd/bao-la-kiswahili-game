"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "../..");
const SOURCE_FILES = Object.freeze([
  "public/engine.js",
  "doc/RULES_BASELINE.md",
  "tools/experiments/lib/restricted-endgame-transition.js",
  "tools/experiments/lib/restricted-endgame-independent-verifier.js",
  "tools/experiments/lib/restricted-endgame-retrograde.js",
  "tools/experiments/lib/restricted-endgame-retrograde-independent.js",
  "tools/experiments/lib/restricted-endgame-tablebase.js",
  "tools/experiments/lib/restricted-endgame-tablebase-independent.js",
  "tools/experiments/validate-restricted-endgame-stage1-spec.js",
  "tools/experiments/run-restricted-endgame-stage1-exact.js",
  "tools/experiments/verify-restricted-endgame-stage1-exact.js"
]);

function sha256(buffer) {
  return crypto.createHash("sha256").update(buffer).digest("hex");
}

const hashes = Object.fromEntries(SOURCE_FILES.map((file) => {
  const full = path.join(ROOT, file);
  if (!fs.existsSync(full)) throw new Error(`Missing source ${file}`);
  return [file, sha256(fs.readFileSync(full))];
}));

process.stdout.write(`${JSON.stringify({
  technicalOnly: true,
  scientificOutcomeGenerationAuthorized: false,
  sourceFiles: SOURCE_FILES,
  sourceFileSha256: hashes,
}, null, 2)}\n`);
