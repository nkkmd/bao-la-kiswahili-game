#!/usr/bin/env node
"use strict";

const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const CandidateAI = require("../../public/ai.js");
const Population = require("./lib/pbai-p1-decision-population.js");

const ROOT = path.resolve(__dirname, "../..");
const SUPPORT_PATH = path.join(ROOT, "doc/ai-engineering/public-ai-improvement-program-1/candidates/PBAI-C001-v1-predevelopment-support-result.json");
const CONTRACT_PATH = path.join(ROOT, "doc/ai-engineering/public-ai-improvement-program-1/candidates/PBAI-C001-v1.json");

function parseArgs(argv) {
  const out = { baselineRoot: null, output: null };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === "--baseline-root") out.baselineRoot = argv[++i];
    else if (argv[i] === "--output") out.output = argv[++i];
    else throw new Error(`Unknown argument: ${argv[i]}`);
  }
  if (!out.baselineRoot) throw new Error("--baseline-root is required");
  return out;
}

function sha(value) {
  return crypto.createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

function ref(root) {
  return { seed: root.seed, ply: root.ply, phase: root.phase, rawKey: root.rawKey };
}

function stableRootOrder(a, b) {
  return a.populationRankHash.localeCompare(b.populationRankHash) || a.seed - b.seed || a.ply - b.ply;
}

function classify(root) {
  const moves = Population.sortedMoves(root.state);
  return {
    ...root,
    legalMoveCount: moves.length,
    allCapture: moves.length >= 2 && moves.every((move) => move.type === "capture"),
    anyNonCapture: moves.some((move) => move.type !== "capture"),
  };
}

function deterministicRandom(seed) {
  return Population.seededRandom(seed);
}

function statsComparable(stats) {
  const copy = { ...stats };
  delete copy.elapsedMs;
  delete copy.pbaiC001Triggered;
  return copy;
}

function resultComparable(result, ai) {
  return {
    move: ai.moveKey(result.move),
    stats: statsComparable(result.stats),
  };
}

function run(ai, state, options, randomSeed = 0xC001) {
  return ai.analyzeMove(state, "hard", deterministicRandom(randomSeed), options);
}

function assertExact(label, left, right, leftAI = CandidateAI, rightAI = CandidateAI) {
  assert.deepEqual(resultComparable(left, leftAI), resultComparable(right, rightAI), label);
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const support = JSON.parse(fs.readFileSync(SUPPORT_PATH, "utf8"));
  const contract = JSON.parse(fs.readFileSync(CONTRACT_PATH, "utf8"));
  const baselineRoot = path.resolve(args.baselineRoot);
  const BaselineAI = require(path.join(baselineRoot, "public/ai.js"));

  assert.equal(contract.mechanism.featureFlag, "pbaiC001NamuaForcedCaptureLegacy");
  assert.equal(contract.validationAndHoldoutFirewall.validationExecutionAuthorizedNow, false);
  assert.equal(contract.validationAndHoldoutFirewall.releaseHoldoutExecutionAuthorizedNow, false);

  const block = support.developmentPopulation.sourceSeedBlock;
  const population = Population.materializeSplit({
    split: "development",
    start: block.start,
    end: block.end,
    maximumPlies: support.developmentPopulation.maximumTrajectoryPlies,
  });
  assert.equal(Population.populationDigest(population), support.developmentPopulation.populationDigest);

  const rows = population.roots.map(classify).sort(stableRootOrder);
  const targets = rows.filter((root) => root.phase === "namua" && root.allCapture).slice(0, 64);
  const mtajiControls = rows.filter((root) => root.phase === "mtaji").slice(0, 32);
  const namuaControls = rows.filter(
    (root) => root.phase === "namua" && root.legalMoveCount >= 2 && root.anyNonCapture,
  ).slice(0, 20);

  assert.equal(targets.length, 64);
  assert.equal(mtajiControls.length, 32);
  assert.equal(namuaControls.length, 20);
  assert.equal(sha(targets.map(ref)), support.targetSupport.selectedRefsSha256);
  assert.equal(sha(mtajiControls.map(ref)), support.controls.mtaji.selectedRefsSha256);
  assert.equal(sha(namuaControls.map(ref)), support.controls.namuaNonForced.selectedRefsSha256);

  const baseOptions = { evaluationProfile: "bao", maxDepth: 3, timeLimitMs: Infinity, quiescenceDepth: 1 };
  const onOptions = { ...baseOptions, pbaiC001NamuaForcedCaptureLegacy: true };
  const offOptions = { ...baseOptions, pbaiC001NamuaForcedCaptureLegacy: false };
  const explicitLegacy = { ...baseOptions, searchProfile: "legacy" };

  let targetTriggerFailures = 0;
  let featureOffBaselineMismatches = 0;
  let targetLegacyRoutingMismatches = 0;
  for (const root of targets) {
    const baseline = run(BaselineAI, root.state, baseOptions, root.seed);
    const off = run(CandidateAI, root.state, offOptions, root.seed);
    const on = run(CandidateAI, root.state, onOptions, root.seed);
    const legacy = run(CandidateAI, root.state, explicitLegacy, root.seed);
    if (on.stats.pbaiC001Triggered !== true) targetTriggerFailures += 1;
    try { assertExact("feature-off baseline mismatch", off, baseline, CandidateAI, BaselineAI); }
    catch { featureOffBaselineMismatches += 1; }
    try { assertExact("eligible route != existing legacy path", on, legacy); }
    catch { targetLegacyRoutingMismatches += 1; }
  }

  let controlTriggerFailures = 0;
  let controlEquivalenceMismatches = 0;
  let controlBaselineMismatches = 0;
  for (const root of [...mtajiControls, ...namuaControls]) {
    const baseline = run(BaselineAI, root.state, baseOptions, root.seed);
    const off = run(CandidateAI, root.state, offOptions, root.seed);
    const on = run(CandidateAI, root.state, onOptions, root.seed);
    if (on.stats.pbaiC001Triggered === true) controlTriggerFailures += 1;
    try { assertExact("control on/off mismatch", on, off); }
    catch { controlEquivalenceMismatches += 1; }
    try { assertExact("control feature-off baseline mismatch", off, baseline, CandidateAI, BaselineAI); }
    catch { controlBaselineMismatches += 1; }
  }

  const probe = targets[0];
  const easyOff = CandidateAI.analyzeMove(probe.state, "easy", deterministicRandom(991), {});
  const easyOn = CandidateAI.analyzeMove(probe.state, "easy", deterministicRandom(991), { pbaiC001NamuaForcedCaptureLegacy: true });
  assertExact("easy changed", easyOn, easyOff);
  const normalOff = CandidateAI.analyzeMove(probe.state, "normal", deterministicRandom(992), { evaluationProfile: "bao" });
  const normalOn = CandidateAI.analyzeMove(probe.state, "normal", deterministicRandom(992), { evaluationProfile: "bao", pbaiC001NamuaForcedCaptureLegacy: true });
  assertExact("normal changed", normalOn, normalOff);
  const mctsBase = { evaluationProfile: "bao", searchProfile: "mcts", timeLimitMs: Infinity, mctsIterations: 32 };
  const mctsOff = CandidateAI.analyzeMove(probe.state, "hard", deterministicRandom(993), mctsBase);
  const mctsOn = CandidateAI.analyzeMove(probe.state, "hard", deterministicRandom(993), { ...mctsBase, pbaiC001NamuaForcedCaptureLegacy: true });
  assertExact("MCTS changed", mctsOn, mctsOff);
  const legacyOff = CandidateAI.analyzeMove(probe.state, "hard", deterministicRandom(994), explicitLegacy);
  const legacyOn = CandidateAI.analyzeMove(probe.state, "hard", deterministicRandom(994), { ...explicitLegacy, pbaiC001NamuaForcedCaptureLegacy: true });
  assertExact("explicit legacy changed", legacyOn, legacyOff);

  const report = {
    schemaVersion: 1,
    program: "PBAI-P1",
    candidateVersion: "PBAI-C001-v1",
    phase: "PBAI-E-PREMETRIC-SAFETY",
    status: "PASS",
    populationDigest: Population.populationDigest(population),
    selectedTargets: targets.length,
    controls: { mtaji: mtajiControls.length, namuaNonForced: namuaControls.length },
    checks: {
      targetTriggerFailures,
      featureOffBaselineMismatches,
      targetLegacyRoutingMismatches,
      controlTriggerFailures,
      controlEquivalenceMismatches,
      controlBaselineMismatches,
      easyUnchanged: true,
      normalUnchanged: true,
      mctsUnchanged: true,
      explicitLegacyUnchanged: true,
    },
    candidateBenefitMetricsObservedBeforePass: false,
    d4ReferenceEvaluated: false,
    validationSeedsAccessed: false,
    releaseHoldoutSeedsAccessed: false,
    publicAdoptionAuthorized: false,
    aiGen3PromotionAuthorized: false,
  };

  for (const [name, value] of Object.entries(report.checks)) {
    if (typeof value === "number") assert.equal(value, 0, `${name} must be zero`);
    else assert.equal(value, true, `${name} must be true`);
  }

  const text = `${JSON.stringify(report, null, 2)}\n`;
  if (args.output) {
    const output = path.resolve(ROOT, args.output);
    fs.mkdirSync(path.dirname(output), { recursive: true });
    fs.writeFileSync(output, text);
  }
  process.stdout.write(text);
}

main();
