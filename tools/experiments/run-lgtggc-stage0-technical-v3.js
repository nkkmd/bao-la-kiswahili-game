"use strict";

const fs = require("node:fs");
const path = require("node:path");
const cp = require("node:child_process");

const SOURCE = path.join(__dirname, "run-lgtggc-stage0-technical-v2.js");
const GENERATED = path.join(__dirname, ".lgtggc-stage0-v3-generated.js");
const OUTPUT = process.argv[2] || "artifacts/local/lgtggc-stage0-v3/result.json";

function replaceExactlyOnce(text, before, after, label) {
  const first = text.indexOf(before);
  if (first < 0) throw new Error(`${label}: source token missing`);
  if (text.indexOf(before, first + before.length) >= 0) throw new Error(`${label}: source token not unique`);
  return text.slice(0, first) + after + text.slice(first + before.length);
}

let text = fs.readFileSync(SOURCE, "utf8");
text = replaceExactlyOnce(
  text,
  'const STAGE_ID = "LGTGGC-S0-TECHNICAL-2026-09-04-v2";',
  'const STAGE_ID = "LGTGGC-S0-TECHNICAL-2026-09-04-v3";',
  "stage-id"
);
text = replaceExactlyOnce(
  text,
  'const OUT = process.argv[2] || "artifacts/local/lgtggc-stage0-v2/result.json";',
  'const OUT = process.argv[2] || "artifacts/local/lgtggc-stage0-v3/result.json";',
  "output-path"
);
text = replaceExactlyOnce(
  text,
  'details.gcldTechnical = { endpoints:Object.fromEntries(gIds.map(id=>[id,gep[id]]), controlCount:glp.controlCount };',
  'details.gcldTechnical = { endpoints:Object.fromEntries(gIds.map(id=>[id,gep[id]])), controlCount:glp.controlCount };',
  "syntax-fix"
);

try {
  fs.writeFileSync(GENERATED, text, "utf8");
  cp.execFileSync(process.execPath, ["--check", GENERATED], { stdio: "inherit" });
  cp.execFileSync(process.execPath, [GENERATED, OUTPUT], { stdio: "inherit" });
} finally {
  try { fs.unlinkSync(GENERATED); } catch (_) {}
}
