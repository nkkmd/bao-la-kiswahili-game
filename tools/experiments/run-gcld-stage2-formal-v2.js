#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "../..");
const LEGACY_PATH = path.join(
  ROOT,
  "doc/continuous-local-geometry-representation/results/stage-2/STAGE_2_SELECTION.json"
);

const originalReadFileSync = fs.readFileSync.bind(fs);
const legacyText = originalReadFileSync(LEGACY_PATH, "utf8");
const legacy = JSON.parse(legacyText);

function need(condition, message) {
  if (!condition) throw new Error(message);
}

need(legacy.studyId === "CLGR-STUDY1", "unexpected G3-09 Stage 2 study identity");
need(legacy.stageId === "CLGR-S2-FORMAL-2026-09-03-v1", "unexpected G3-09 Stage 2 stage identity");
need(Array.isArray(legacy.identityRows), "G3-09 Stage 2 identityRows missing");
need(legacy.identityRows.length === 72, "unexpected G3-09 Stage 2 identity row count");

const forbiddenTopLevel = [
  "measurements",
  "coordinates",
  "pairwiseDistances",
  "distanceMatrix",
  "neighborhoods",
  "formalResult",
  "scientificResult",
  "scientificSummary"
];
for (const key of forbiddenTopLevel) {
  need(!(key in legacy), `G3-09 Stage 2 selection unexpectedly contains scientific payload field: ${key}`);
}

const identityRows = legacy.identityRows.map((row, index) => {
  need(typeof row.rootRawSha256 === "string", `legacy identity root missing at ${index}`);
  need(typeof row.sourceTrajectorySha256 === "string", `legacy trajectory identity missing at ${index}`);
  need(typeof row.openingPrefixSha256 === "string", `legacy opening-prefix identity missing at ${index}`);
  return {
    rootRawSha256: row.rootRawSha256,
    sourceTrajectorySha256: row.sourceTrajectorySha256,
    openingPrefixSha256: row.openingPrefixSha256
  };
});

const projectedObject = {
  schemaVersion: 1,
  studyId: "CLGR-STUDY1",
  stageId: "CLGR-S2-FORMAL-2026-09-03-v1",
  scientificOutcomeFieldsRetained: false,
  identityRows
};
const projected = JSON.stringify(projectedObject, null, 2) + "\n";

if (process.argv.includes("--identity-projection-check-only")) {
  console.log(JSON.stringify({
    passed: true,
    sourceStudyId: legacy.studyId,
    sourceStageId: legacy.stageId,
    sourceIdentityRowCount: legacy.identityRows.length,
    projectedIdentityRowCount: identityRows.length,
    projectedFieldsPerRow: ["rootRawSha256", "sourceTrajectorySha256", "openingPrefixSha256"],
    scientificOutcomeFieldsRetained: false,
    stage2FreshSeedAccess: false,
    protectedDepth10Access: false
  }));
  process.exit(0);
}

fs.readFileSync = function patchedReadFileSync(file, options) {
  const resolved = path.resolve(String(file));
  if (resolved === LEGACY_PATH) {
    if (typeof options === "string") return projected;
    if (options && typeof options === "object" && options.encoding) return projected;
    return Buffer.from(projected, "utf8");
  }
  return originalReadFileSync(file, options);
};

require("./run-gcld-stage2-formal.js");
