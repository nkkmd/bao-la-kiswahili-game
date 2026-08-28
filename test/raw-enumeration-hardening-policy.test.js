"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const read = (relative) => fs.readFileSync(path.join(ROOT, relative), "utf8");
const json = (relative) => JSON.parse(read(relative));

const policyPath = "doc/research-program-decisions/2026-08-28-post-g2-05-raw-enumeration-hardening.md";
const policy = read(policyPath);
const disposition = read("doc/deep-raw-state-space-enumeration/checkpoints/2026-08-28-pr71-review-disposition.md");
const stage2 = json("doc/deep-raw-state-space-enumeration/results/STAGE_2_FORMAL_RESULT.json");
const current = read("doc/deep-raw-state-space-enumeration/CURRENT_STATUS.md");
const formalWorkflow = read(".github/workflows/drsse-stage2-formal.yml");
const closureWorkflow = read(".github/workflows/drsse-study1-closure-ci.yml");

// The follow-up is prospective only: the accepted G2-05 evidence remains immutable.
assert.ok(policy.includes("PROSPECTIVE PROGRAM-LEVEL IMPLEMENTATION REQUIREMENT"));
assert.ok(policy.includes("not a retroactive amendment to `DRSSE-STUDY1`"));
assert.ok(policy.includes("must not be edited or rerun under the same formal identity"));
assert.equal(stage2.formalDecision, "EXACT-WITHIN-FROZEN-DEPTH-9-DOMAIN");
assert.equal(stage2.acceptedHeadSha, "9199a3d25ea38978673f94bfcd4250aa3b5411fa");
assert.equal(stage2.targetComplete, true);
assert.equal(stage2.verification.fullIndependentExactRecomputationPerformed, true);
assert.equal(stage2.verification.fullIndependentExactRecomputationPassed, true);
assert.ok(current.includes("STUDY COMPLETE / MAIN INTEGRATION COMPLETE"));

// H1: a resource/admin incomplete run cannot keep exact prefix claims without
// fresh independent prefix re-enumeration.
assert.ok(policy.includes("Independent verification of every claimed-complete layer after a resource/admin stop"));
assert.ok(policy.includes("re-enumerate the complete domain through `lastCompleteDepth`"));
assert.ok(policy.includes("must not receive an exact scientific label"));
assert.ok(disposition.includes("resource-censored formal outcome must independently re-enumerate all claimed-complete layers"));

// H2: exact completion requires a final ambient/resource check after final
// scientific materialization and before targetComplete/exact classification.
assert.ok(policy.includes("Final ambient/resource recheck before exact completion classification"));
assert.ok(policy.includes("after the final transition work and final scientific materialization/serialization"));
assert.ok(policy.includes("before setting `targetComplete=true`"));
assert.ok(policy.includes("forced artifact-size cap at or after final materialization"));
assert.ok(disposition.includes("recheck ambient/resource caps after final transition/materialization before classifying completion"));

// Future scientific use requires a new prospective source identity; the old
// Stage 2 workflow remains archived rather than repaired in place.
assert.ok(policy.includes("New source identity and authorization"));
assert.ok(policy.includes("new Git blob/source identities"));
assert.ok(policy.includes("fresh source freeze before outcome generation"));
assert.ok(formalWorkflow.includes("workflow_dispatch"));
assert.ok(!formalWorkflow.includes("\n  push:"));

// G2-12 must explicitly carry the hardening boundary if it consumes exact RAW
// enumeration prefixes, and estimation remains a separate evidence class.
assert.ok(policy.includes("G2-12 — State-Space / Game-Tree Growth Estimation Study 1"));
assert.ok(policy.includes("complete independently verified RAW layers = exact bounded evidence"));
assert.ok(policy.includes("estimation / extrapolation beyond those layers = separate prospective estimator evidence"));

// The closure workflow itself must support read-only main audits for later
// administrative changes and must run this policy test.
assert.ok(closureWorkflow.includes("- main"));
assert.ok(closureWorkflow.includes("node test/raw-enumeration-hardening-policy.test.js"));
assert.ok(closureWorkflow.includes(policyPath));

console.log("Prospective RAW enumeration hardening policy audit: PASS");
