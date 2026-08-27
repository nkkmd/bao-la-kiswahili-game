#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const E = require("../../public/engine.js");
const C = require("./lib/search-reliability-stage1-common.js");
const M = require("./lib/search-reliability-stage1-measurement.js");

const spec = JSON.parse(fs.readFileSync("doc/search-reliability-decision-robustness/preregistration/STAGE_1_DEVELOPMENT_SPEC.json", "utf8"));
const technicalSpec = C.cloneJson(spec);
technicalSpec.population.maxPly = 40;
const trajectories = [99003101, 99003102, 99003103, 99003104].map((seed) => C.generateTrajectory(seed, technicalSpec));
const selection = C.selectStates(trajectories, technicalSpec);
if (!selection.selected.length) throw new Error("technical preauthorization smoke selected zero states");
const row = selection.selected[0];
const measured = M.measureState(row, spec);
const ids = spec.searchGrid.conditions.map((x) => x.id);
if (JSON.stringify(Object.keys(measured.conditions)) !== JSON.stringify(ids)) throw new Error("scientific grid condition identity mismatch");
for (const id of ["D1_Q1", "D2_Q1", "D3_Q1", "D2_Q0", "D2_Q2"]) {
  const c = measured.conditions[id];
  if (!c.estimable || c.completedDepth !== spec.searchGrid.conditions.find((x) => x.id === id).depth) throw new Error(`exact condition incomplete: ${id}`);
  if (c.principalVariation.moveKeys[0] !== c.result.canonicalBestMoveKey) throw new Error(`PV first move mismatch: ${id}`);
}
for (const id of ["B64_Q1_MAXD3", "B256_Q1_MAXD3", "B1024_Q1_MAXD3"]) {
  const configured = spec.searchGrid.conditions.find((x) => x.id === id);
  const c = measured.conditions[id];
  if (c.nodeBudget !== configured.nodeBudget) throw new Error(`node budget identity mismatch: ${id}`);
  if (c.completedDepth < 0 || c.completedDepth > configured.maxDepth) throw new Error(`invalid completed depth: ${id}`);
  if (!c.estimable && c.result !== null) throw new Error(`nonestimable budget condition has result: ${id}`);
}
if (C.rawStateKey(row.state) !== row.rawStateKey) throw new Error("selected state RAW identity mismatch");
if (C.rawStateKey(E.initialState()) === row.rawStateKey && row.ply > 0) throw new Error("technical selected state unexpectedly equals initial RAW state");
console.log(JSON.stringify({
  smokeId: "SRDR-S1-PREAUTH-SMOKE-2026-08-27-v1",
  passed: true,
  technicalSeeds: [99003101, 99003102, 99003103, 99003104],
  selectedTechnicalStates: selection.selected.length,
  measuredTechnicalState: { phase: row.phase, ply: row.ply, legalMoveCount: row.legalMoveCount },
  budgetCompletedDepths: Object.fromEntries(["B64_Q1_MAXD3", "B256_Q1_MAXD3", "B1024_Q1_MAXD3"].map((id) => [id, measured.conditions[id].completedDepth])),
  scientificInferenceAuthorized: false,
  scientificOutcomeGenerationAuthorized: false,
  scientificSeedConsumed: false,
  reservedScientificSeedBlocksTouched: false
}, null, 2));
