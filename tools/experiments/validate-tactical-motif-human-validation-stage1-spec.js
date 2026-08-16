#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");

const ROOT = path.resolve(__dirname, "../..");
const DEFAULT_SPEC = path.join(ROOT, "doc/tactical-motif-human-validation/preregistration/STAGE_1_STIMULUS_SPEC.json");

function sha256(value) { return crypto.createHash("sha256").update(value).digest("hex"); }
function loadSpec(file = DEFAULT_SPEC) {
  const text = fs.readFileSync(file, "utf8");
  return { spec: JSON.parse(text), specSha256: sha256(text), file };
}
function assert(condition, message) { if (!condition) throw new Error(message); }
function rangesOverlap(a0, a1, b0, b1) { return Math.max(a0, b0) <= Math.min(a1, b1); }

function validateSpec(spec) {
  assert(spec.schemaVersion === 1, "schemaVersion must be 1");
  assert(spec.studyId === "TMHV-STUDY1", "unexpected studyId");
  assert(spec.stageId === "TMHV-S1-STIMULUS-2026-08-17-v1", "unexpected stageId");
  assert(spec.humanDataCollectionAuthorized === false, "Stage 1 cannot authorize human data");
  assert(spec.scientificHumanInferenceAuthorized === false, "Stage 1 cannot authorize human inference");
  assert(spec.machineStimulusDevelopmentOnly === true, "Stage 1 must remain machine-only");
  const p = spec.population;
  assert(p.games === 1536, "games must be 1536");
  assert(p.seedEnd - p.seedStart + 1 === p.games, "seed block must exactly match games");
  assert(p.opening.policy === "seeded-uniform-legal-moveVariants" && p.opening.plies === 8, "opening contract mismatch");
  assert(p.maxPly === 100 && p.earlyStopAllowed === false && p.outcomeDependentExtensionAllowed === false && p.replacementSamplingAllowed === false, "population stopping contract changed");
  assert(p.conditionAssignment.method === "game-index-modulo" && p.conditionAssignment.strata.length === 6, "six fixed strata required");
  assert(p.conditionAssignment.strata.every((x) => x.expectedGames === 256), "each stratum must contain 256 games");
  for (const old of p.forbiddenHistoricalSeedRanges) {
    assert(!rangesOverlap(p.seedStart, p.seedEnd, old.start, old.end), `fresh seed block overlaps ${old.stage}`);
  }
  const h = spec.historicalMachineEvidence;
  assert(h.candidateId === "TM-S2-C03", "historical candidate must be C03");
  assert(h.canonicalCandidateKey === "7a9ebacdc74234cf206b59696a92551b3e15f5e97336ef09a16e1efbf0042eba", "C03 canonical key mismatch");
  assert(h.machineDecision === "CONFIRMED" && h.humanDecisionUse === false, "machine/human evidence boundary changed");
  assert(JSON.stringify(spec.stimulusEligibility.controlClasses) === JSON.stringify(["P_ONLY","M_ONLY","MORPH_NEAR"]), "control classes changed");
  assert(spec.matching.outcomeBlind === true && spec.matching.controlReuseAllowed === false, "matching firewall changed");
  assert(spec.matching.sameHistoricalTrajectoryAllowed === false && spec.matching.sameOpeningPrefixAsTargetAllowed === false, "transferability matching firewall changed");
  assert(spec.rendering.actorNormalizedToSouth === true && spec.rendering.reverseColumns === false && spec.rendering.reverseDirections === false, "render orientation contract changed");
  assert(spec.rendering.showOpeningHistory === false && spec.rendering.showLegalMoveHighlights === false && spec.rendering.showMachineCandidateLabel === false, "blinding contract changed");
  assert(spec.authorization.generationAuthorizedBySpecAlone === false, "spec alone cannot authorize generation");
  return true;
}

function validateHistoricalBinding(spec) {
  const file = path.join(ROOT, spec.historicalMachineEvidence.candidateDefinitionPath);
  const text = fs.readFileSync(file, "utf8");
  const actual = sha256(text);
  assert(actual === spec.historicalMachineEvidence.candidateDefinitionSha256, `historical candidate file SHA-256 mismatch: ${actual}`);
  const parsed = JSON.parse(text);
  const c03 = parsed.formalCandidates.find((x) => x.candidateId === "TM-S2-C03");
  assert(c03 && c03.canonicalCandidateKey === spec.historicalMachineEvidence.canonicalCandidateKey, "frozen C03 unavailable");
  assert(c03.canonicalStage1Rank === 5 && c03.phase === "mtaji", "C03 rank/phase changed");
  assert(JSON.stringify(c03.preconditions) === JSON.stringify(["reusablePits=0-2"]), "C03 precondition changed");
  assert(c03.consequence === "actorNyumbaSeedsDeltaSign=0", "C03 consequence changed");
  return { actualSha256: actual, c03 };
}

function main() {
  const loaded = loadSpec();
  validateSpec(loaded.spec);
  const historical = validateHistoricalBinding(loaded.spec);
  console.log(JSON.stringify({passed:true,stageId:loaded.spec.stageId,specSha256:loaded.specSha256,historicalCandidateDefinitionSha256:historical.actualSha256,humanDataCollectionAuthorized:false}, null, 2));
}
if (require.main === module) main();
module.exports = { DEFAULT_SPEC, loadSpec, rangesOverlap, sha256, validateHistoricalBinding, validateSpec };
