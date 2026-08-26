#!/usr/bin/env node
"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "../..");
const AI_PATH = path.join(ROOT, "public/ai.js");
const BASELINE_SHA256 = "2823dbcf96c7a47489301ecd768a63975aa8b4e12b62cc4629fc8283ef5dff9e";
const FEATURE = "pbaiC001NamuaForcedCaptureLegacy";
const ORIGINAL = "    if (options.searchProfile !== \"legacy\") {\n";
const REPLACEMENT = [
  `    const pbaiC001Enabled = options.${FEATURE} === true;`,
  "    const pbaiC001Eligible = pbaiC001Enabled",
  "      && (level === \"hard\" || level === \"expert\")",
  "      && options.searchProfile !== \"legacy\"",
  "      && state.winner === null",
  "      && state.phase === \"namua\"",
  "      && choices.length >= 2",
  "      && choices.every((move) => move.type === \"capture\");",
  "    if (pbaiC001Enabled) stats.pbaiC001Triggered = pbaiC001Eligible;",
  "    if (options.searchProfile !== \"legacy\" && !pbaiC001Eligible) {",
  "",
].join("\n");

function sha256(buffer) {
  return crypto.createHash("sha256").update(buffer).digest("hex");
}

function count(text, needle) {
  return text.split(needle).length - 1;
}

function validateApplied(text) {
  if (count(text, `options.${FEATURE}`) !== 1) {
    throw new Error("C001 feature marker count must be exactly 1");
  }
  for (const required of [
    "state.phase === \"namua\"",
    "choices.length >= 2",
    "choices.every((move) => move.type === \"capture\")",
    "options.searchProfile !== \"legacy\" && !pbaiC001Eligible",
    "stats.pbaiC001Triggered = pbaiC001Eligible",
  ]) {
    if (!text.includes(required)) throw new Error(`Missing C001 source invariant: ${required}`);
  }
  for (const forbidden of [
    "PBAI-C004",
    "D23Instability",
    "capture-branch-expansion",
  ]) {
    if (text.includes(forbidden)) throw new Error(`Scientific/closed-candidate marker leaked: ${forbidden}`);
  }
}

function main() {
  const mode = process.argv[2] || "--check";
  if (!["--check", "--apply"].includes(mode)) throw new Error("Use --check or --apply");
  const before = fs.readFileSync(AI_PATH);
  const beforeText = before.toString("utf8");
  const alreadyApplied = beforeText.includes(`options.${FEATURE}`);

  if (mode === "--check") {
    if (!alreadyApplied) throw new Error("PBAI-C001-v1 source transform is not applied");
    validateApplied(beforeText);
    process.stdout.write(`${JSON.stringify({ applied: true, sha256: sha256(before), bytes: before.length })}\n`);
    return;
  }

  if (alreadyApplied) {
    validateApplied(beforeText);
    process.stdout.write(`${JSON.stringify({ applied: true, unchanged: true, sha256: sha256(before), bytes: before.length })}\n`);
    return;
  }
  if (sha256(before) !== BASELINE_SHA256) {
    throw new Error(`Refuse to transform non-baseline public/ai.js: ${sha256(before)}`);
  }
  if (count(beforeText, ORIGINAL) !== 1) {
    throw new Error("Expected exactly one enhanced/legacy branch marker");
  }
  const afterText = beforeText.replace(ORIGINAL, REPLACEMENT);
  validateApplied(afterText);
  fs.writeFileSync(AI_PATH, afterText);
  const after = fs.readFileSync(AI_PATH);
  process.stdout.write(`${JSON.stringify({
    applied: true,
    unchanged: false,
    beforeSha256: sha256(before),
    afterSha256: sha256(after),
    beforeBytes: before.length,
    afterBytes: after.length,
    addedBytes: after.length - before.length,
  })}\n`);
}

main();
