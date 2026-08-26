#!/usr/bin/env node
"use strict";

const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const CandidateAI = require("../../public/ai.js");
const Population = require("./lib/pbai-p1-decision-population.js");

const ROOT = path.resolve(__dirname, "../..");
const SPEC_PATH = "doc/ai-engineering/public-ai-improvement-program-1/candidates/PBAI-C001-v1-development-measurement-spec.json";
const CONTRACT_PATH = "doc/ai-engineering/public-ai-improvement-program-1/candidates/PBAI-C001-v1.json";

function readJson(rel) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, rel), "utf8"));
}

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

function sha256File(file) {
  return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}

function sha(value) {
  return crypto.createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

function rootRef(root) {
  return { seed: root.seed, ply: root.ply, phase: root.phase, rawKey: root.rawKey };
}

function stableRootOrder(a, b) {
  return a.populationRankHash.localeCompare(b.populationRankHash) || a.seed - b.seed || a.ply - b.ply;
}

function selectedTargets(population, limit) {
  return population.roots.map((root) => {
    const moves = Population.sortedMoves(root.state);
    return { ...root, moves, allCapture: moves.length >= 2 && moves.every((move) => move.type === "capture") };
  }).filter((root) => root.phase === "namua" && root.allCapture)
    .sort(stableRootOrder)
    .slice(0, limit);
}

function candidateFor(reference, moveKey) {
  const row = reference.candidates.find((item) => item.moveKey === moveKey);
  if (!row) throw new Error(`Move absent from reference: ${moveKey}`);
  return row;
}

function severeLoss(reference, moveKey) {
  const selected = candidateFor(reference, moveKey);
  const worst = Math.min(...reference.candidates.map((item) => item.score));
  const uniqueWorst = selected.score === worst
    && reference.candidates.filter((item) => item.score === worst).length === 1;
  const lossMateWhileBestNot = selected.scoreClass === "root-loss-mate-domain"
    && reference.bestScoreClass !== "root-loss-mate-domain";
  return uniqueWorst || lossMateWhileBestNot;
}

function catastrophicNewLoss(root, reference, baselineMoveKey, candidateMoveKey) {
  if (!severeLoss(reference, candidateMoveKey) || severeLoss(reference, baselineMoveKey)) return false;
  const selected = candidateFor(reference, candidateMoveKey);
  const immediateTerminalLoss = selected.immediateTerminal !== null
    && selected.immediateTerminal.winner !== root.state.player;
  const lossMateWithNonLossAvailable = selected.scoreClass === "root-loss-mate-domain"
    && reference.candidates.some((item) => item.scoreClass !== "root-loss-mate-domain");
  return immediateTerminalLoss || lossMateWithNonLossAvailable;
}

function normalizedRankLoss(reference, moveKey) {
  const selected = candidateFor(reference, moveKey);
  return (selected.scoreRank - 1) / Math.max(1, reference.legalMoveCount - 1);
}

function mean(values) {
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function median(values) {
  const ordered = values.slice().sort((a, b) => a - b);
  const mid = Math.floor(ordered.length / 2);
  return ordered.length % 2 ? ordered[mid] : (ordered[mid - 1] + ordered[mid]) / 2;
}

function runSearch(ai, root, options) {
  return ai.analyzeMove(root.state, "hard", () => 0.5, options);
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const spec = readJson(SPEC_PATH);
  const contract = readJson(CONTRACT_PATH);
  const baselineRoot = path.resolve(args.baselineRoot);
  const BaselineAI = require(path.join(baselineRoot, "public/ai.js"));
  const Diagnostic = require(path.join(baselineRoot, "tools/experiments/lib/position-complexity-search-diagnostic.js"));

  assert.equal(spec.status, "FROZEN-BEFORE-DEVELOPMENT-BENEFIT-OBSERVATION");
  assert.equal(spec.premetric.status, "PASS");
  assert.equal(spec.premetric.candidateBenefitMetricsObservedBeforePass, false);
  assert.equal(spec.premetric.d4ReferenceEvaluatedBeforePass, false);
  assert.equal(spec.firewall.validationSeedAccessAuthorized, false);
  assert.equal(spec.firewall.releaseHoldoutSeedAccessAuthorized, false);
  assert.equal(contract.candidateSpecificBenefitGate.metrics.searchWork, "stats.nodes + stats.quiescenceNodes");
  assert.equal(sha256File(path.join(ROOT, "public/ai.js")), spec.candidatePublicAiSha256);
  assert.equal(sha256File(path.join(ROOT, "public/engine.js")), spec.publicEngineSha256);
  assert.equal(sha256File(path.join(baselineRoot, "public/ai.js")), "2823dbcf96c7a47489301ecd768a63975aa8b4e12b62cc4629fc8283ef5dff9e");

  const block = spec.developmentPopulation.sourceSeedBlock;
  const population = Population.materializeSplit({ split: "development", start: block.start, end: block.end, maximumPlies: 160 });
  assert.equal(Population.populationDigest(population), spec.developmentPopulation.populationDigest);
  const targets = selectedTargets(population, spec.developmentPopulation.selectedTargetCount);
  assert.equal(targets.length, 64);
  assert.equal(sha(targets.map(rootRef)), spec.developmentPopulation.selectedTargetRefsSha256);

  const baselineOptions = { evaluationProfile: "bao", maxDepth: 3, timeLimitMs: Infinity, quiescenceDepth: 1 };
  const candidateOptions = { ...baselineOptions, pbaiC001NamuaForcedCaptureLegacy: true };
  const rows = [];

  for (const root of targets) {
    const reference = Diagnostic.analyzeRootCandidates(root.state, 4, {
      evaluationProfile: "bao",
      quiescenceDepth: 1,
      orderQuiescenceCaptures: false,
    });
    assert.equal(reference.searchSemantics, spec.reference.semantics);
    const baseline = runSearch(BaselineAI, root, baselineOptions);
    const candidate = runSearch(CandidateAI, root, candidateOptions);
    const baselineMoveKey = BaselineAI.moveKey(baseline.move);
    const candidateMoveKey = CandidateAI.moveKey(candidate.move);
    const baselineWork = baseline.stats.nodes + baseline.stats.quiescenceNodes;
    const candidateWork = candidate.stats.nodes + candidate.stats.quiescenceNodes;
    if (baselineWork <= 0) throw new Error("Baseline searchWork must be positive");
    rows.push({
      ref: rootRef(root),
      legalMoveCount: reference.legalMoveCount,
      baseline: {
        moveKey: baselineMoveKey,
        topSetAgreement: reference.topSetMoveKeys.includes(baselineMoveKey),
        normalizedRankLoss: normalizedRankLoss(reference, baselineMoveKey),
        severeLoss: severeLoss(reference, baselineMoveKey),
        searchWork: baselineWork,
        nodes: baseline.stats.nodes,
        quiescenceNodes: baseline.stats.quiescenceNodes,
      },
      candidate: {
        moveKey: candidateMoveKey,
        topSetAgreement: reference.topSetMoveKeys.includes(candidateMoveKey),
        normalizedRankLoss: normalizedRankLoss(reference, candidateMoveKey),
        severeLoss: severeLoss(reference, candidateMoveKey),
        searchWork: candidateWork,
        nodes: candidate.stats.nodes,
        quiescenceNodes: candidate.stats.quiescenceNodes,
        triggered: candidate.stats.pbaiC001Triggered === true,
      },
      catastrophicNewLoss: catastrophicNewLoss(root, reference, baselineMoveKey, candidateMoveKey),
      searchWorkRatioCandidateOverBaseline: candidateWork / baselineWork,
      d4Reference: {
        bestScore: reference.bestScore,
        bestScoreClass: reference.bestScoreClass,
        topSetMoveKeys: reference.topSetMoveKeys,
      },
    });
  }

  const baselineTop = mean(rows.map((row) => row.baseline.topSetAgreement ? 1 : 0));
  const candidateTop = mean(rows.map((row) => row.candidate.topSetAgreement ? 1 : 0));
  const baselineRank = mean(rows.map((row) => row.baseline.normalizedRankLoss));
  const candidateRank = mean(rows.map((row) => row.candidate.normalizedRankLoss));
  const baselineSevere = mean(rows.map((row) => row.baseline.severeLoss ? 1 : 0));
  const candidateSevere = mean(rows.map((row) => row.candidate.severeLoss ? 1 : 0));
  const catastrophicCount = rows.filter((row) => row.catastrophicNewLoss).length;
  const ratios = rows.map((row) => row.searchWorkRatioCandidateOverBaseline);
  const medianRatio = median(ratios);
  const fractionAbove2 = mean(ratios.map((ratio) => ratio > 2 ? 1 : 0));
  const triggerFailures = rows.filter((row) => !row.candidate.triggered).length;

  const observed = {
    baselineTopSetAgreement: baselineTop,
    candidateTopSetAgreement: candidateTop,
    topSetAgreementDeltaCandidateMinusBaseline: candidateTop - baselineTop,
    baselineMeanNormalizedRankLoss: baselineRank,
    candidateMeanNormalizedRankLoss: candidateRank,
    meanNormalizedRankLossDeltaCandidateMinusBaseline: candidateRank - baselineRank,
    baselineSevereLossRate: baselineSevere,
    candidateSevereLossRate: candidateSevere,
    severeLossRateExcessOverBaseline: candidateSevere - baselineSevere,
    catastrophicNewLossCount: catastrophicCount,
    medianSearchWorkRatioCandidateOverBaseline: medianRatio,
    fractionRootsWithSearchWorkRatioAbove2: fractionAbove2,
    candidateTriggerFailureCount: triggerFailures,
  };
  const gate = spec.developmentGate;
  const gates = {
    topSetAgreement: observed.topSetAgreementDeltaCandidateMinusBaseline >= gate.topSetAgreementDeltaCandidateMinusBaselineMinimum,
    normalizedRankLoss: observed.meanNormalizedRankLossDeltaCandidateMinusBaseline <= gate.meanNormalizedRankLossDeltaCandidateMinusBaselineMaximum,
    severeLoss: observed.severeLossRateExcessOverBaseline <= gate.severeLossRateExcessOverBaselineMaximum,
    catastrophicNewLoss: observed.catastrophicNewLossCount <= gate.catastrophicNewLossCountMaximum,
    medianSearchWork: observed.medianSearchWorkRatioCandidateOverBaseline <= gate.medianSearchWorkRatioCandidateOverBaselineMaximum,
    highSearchWorkTail: observed.fractionRootsWithSearchWorkRatioAbove2 <= gate.fractionRootsWithSearchWorkRatioAbove2Maximum,
    triggerCoverage: observed.candidateTriggerFailureCount <= gate.candidateTriggerFailureCountMaximum,
  };
  const pass = Object.values(gates).every(Boolean);

  const report = {
    schemaVersion: 1,
    program: "PBAI-P1",
    phase: "PBAI-E-DEVELOPMENT-BENEFIT",
    candidateId: "PBAI-C001",
    candidateVersion: "PBAI-C001-v1",
    measurementSpec: SPEC_PATH,
    candidatePublicAiSha256: spec.candidatePublicAiSha256,
    baselineMain: spec.baselineMain,
    populationDigest: Population.populationDigest(population),
    selectedTargets: targets.length,
    referenceSemantics: spec.reference.semantics,
    observed,
    frozenGate: gate,
    gates,
    developmentPass: pass,
    decision: pass ? "DEVELOPMENT-PASS/VALIDATION-ELIGIBLE-BUT-NOT-YET-AUTHORIZED" : "DEVELOPMENT-BENEFIT-FAIL/HOLD",
    validationSeedsAccessed: false,
    releaseHoldoutSeedsAccessed: false,
    validationAuthorizedByThisResult: false,
    releaseHoldoutAuthorizedByThisResult: false,
    publicAdoptionAuthorizedByThisResult: false,
    aiGen3PromotionAuthorizedByThisResult: false,
    sameVersionRetuningAllowed: false,
    rows,
  };

  const text = `${JSON.stringify(report, null, 2)}\n`;
  if (args.output) {
    const output = path.resolve(ROOT, args.output);
    fs.mkdirSync(path.dirname(output), { recursive: true });
    fs.writeFileSync(output, text);
  }
  process.stdout.write(text);
  if (!pass) process.exitCode = 2;
}

main();
