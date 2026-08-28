#!/usr/bin/env node
"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const crypto = require("node:crypto");

function parseArgs(argv) {
  let input = null;
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === "--input") input = argv[++i];
    else throw new Error(`Unknown argument: ${argv[i]}`);
  }
  if (!input) throw new Error("--input is required");
  return { input };
}

function sha256(value) { return crypto.createHash("sha256").update(value).digest("hex"); }

function main() {
  const { input } = parseArgs(process.argv.slice(2));
  const result = JSON.parse(fs.readFileSync(input, "utf8"));
  assert.equal(result.auditId, "SRDR-PRESTAGE1-RESOURCE-AUDIT-2026-08-27-v1");
  assert.equal(result.technicalOnly, true);
  assert.equal(result.scientificInferenceAuthorized, false);
  assert.equal(result.scientificOutcomeGenerationAuthorized, false);
  assert.equal(result.formalEvidenceAuthorized, false);
  assert.equal(result.confirmatoryReuseAllowed, false);
  assert.equal(result.scientificSeedConsumed, false);
  assert.equal(result.reservedScientificSeedBlocksTouched, false);
  assert.deepEqual(result.technicalSeeds, [99002001, 99002002, 99002003, 99002004]);
  assert.equal(result.states.length, 12);
  assert.equal(result.states.filter((x) => x.phase === "namua").length, 6);
  assert.equal(result.states.filter((x) => x.phase === "mtaji").length, 6);
  for (const row of result.states) {
    assert.equal(row.exact.length, 3);
    assert.equal(row.quiescence.length, 3);
    assert.equal(row.requiredCumulativeBudget.length, 3);
    let prior = 0;
    for (const item of row.requiredCumulativeBudget) {
      assert.ok(item.budget > prior, "cumulative budget must strictly increase by depth");
      prior = item.budget;
    }
    assert.deepEqual(row.exact.map((x) => x.depth), [1, 2, 3]);
    assert.deepEqual(row.quiescence.map((x) => x.quiescenceDepth), [0, 1, 2]);
  }
  const copy = JSON.parse(JSON.stringify(result));
  delete copy.resultHash;
  assert.equal(result.resultHash, sha256(JSON.stringify(copy)), "result hash mismatch");
  console.log(JSON.stringify({
    auditId: result.auditId,
    passed: true,
    states: result.states.length,
    phaseCounts: {
      namua: result.states.filter((x) => x.phase === "namua").length,
      mtaji: result.states.filter((x) => x.phase === "mtaji").length,
    },
    cumulativeBudgetSummary: result.summary.cumulativeByDepth,
    q2Nodes: result.summary.q2Nodes,
    resultHash: result.resultHash,
    scientificSeedConsumed: false,
  }, null, 2));
}

main();
