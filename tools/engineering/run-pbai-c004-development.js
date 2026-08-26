#!/usr/bin/env node
"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const AI = require("../../public/ai.js");
const Population = require("./lib/pbai-p1-decision-population.js");
const Diagnostic = require("../experiments/lib/position-complexity-search-diagnostic.js");

const ROOT = path.resolve(__dirname, "../..");
const CONTRACT_PATH = "doc/ai-engineering/public-ai-improvement-program-1/candidates/PBAI-C004-v1.json";

function readJson(rel) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, rel), "utf8"));
}

function sha256File(rel) {
  return crypto.createHash("sha256").update(fs.readFileSync(path.join(ROOT, rel))).digest("hex");
}

function parseArgs(argv) {
  const options = { output: null };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === "--output") {
      options.output = argv[++i];
      if (!options.output) throw new Error("--output requires a path");
    } else {
      throw new Error(`Unknown argument: ${argv[i]}`);
    }
  }
  return options;
}

function rootOrder(a, b) {
  return a.populationRankHash.localeCompare(b.populationRankHash)
    || a.seed - b.seed || a.ply - b.ply;
}

function exactD23(root) {
  const trace = Diagnostic.analyzeDepthTrace(root.state, [2, 3], {
    evaluationProfile: "bao",
    quiescenceDepth: 1,
    orderQuiescenceCaptures: false,
  });
  const d2 = trace.results.find((item) => item.depth === 2);
  const d3 = trace.results.find((item) => item.depth === 3);
  const transition = trace.transitions.find((item) => item.fromDepth === 2 && item.toDepth === 3);
  if (!d2 || !d3 || !transition) throw new Error("Missing exact D2/D3 result");
  return {
    root,
    ref: Population.rootRef(root),
    populationRankHash: root.populationRankHash,
    topSetDisjoint: transition.topSetDisjoint,
    canonicalBestChanged: transition.canonicalBestChanged,
  };
}

function analyze(root, enabled) {
  return AI.analyzeMove(root.state, "hard", () => 0.5, {
    timeLimitMs: Infinity,
    maxDepth: 4,
    evaluationProfile: "bao",
    quiescenceDepth: 1,
    orderQuiescenceCaptures: false,
    pbaiC004D23RootTtFirst: enabled,
  });
}

function exactD4(root) {
  return Diagnostic.analyzeRootCandidates(root.state, 4, {
    evaluationProfile: "bao",
    quiescenceDepth: 1,
    orderQuiescenceCaptures: false,
  });
}

function referenceCandidate(reference, moveKey) {
  const candidate = reference.candidates.find((item) => item.moveKey === moveKey);
  if (!candidate) throw new Error(`Selected move missing from D4 reference: ${moveKey}`);
  return candidate;
}

function isSevereLoss(reference, moveKey) {
  const selected = referenceCandidate(reference, moveKey);
  const worst = Math.min(...reference.candidates.map((item) => item.score));
  const uniqueWorst = selected.score === worst
    && reference.candidates.filter((item) => item.score === worst).length === 1;
  const lossMateWhileBestIsNot = selected.scoreClass === "root-loss-mate-domain"
    && reference.bestScoreClass !== "root-loss-mate-domain";
  return uniqueWorst || lossMateWhileBestIsNot;
}

function catastrophicNewLoss(root, reference, baselineMoveKey, candidateMoveKey) {
  if (!isSevereLoss(reference, candidateMoveKey) || isSevereLoss(reference, baselineMoveKey)) return false;
  const selected = referenceCandidate(reference, candidateMoveKey);
  const immediateTerminalLoss = selected.immediateTerminal !== null
    && selected.immediateTerminal.winner !== root.state.player;
  const lossMateWithNonLossAvailable = selected.scoreClass === "root-loss-mate-domain"
    && reference.candidates.some((item) => item.scoreClass !== "root-loss-mate-domain");
  return immediateTerminalLoss || lossMateWithNonLossAvailable;
}

function rootMetric(item) {
  const reference = exactD4(item.root);
  const off = analyze(item.root, false);
  const on = analyze(item.root, true);
  const offKey = AI.moveKey(off.move);
  const onKey = AI.moveKey(on.move);
  const ratio = off.stats.nodes === 0 ? 1 : on.stats.nodes / off.stats.nodes;
  return {
    ref: item.ref,
    phase: item.root.phase,
    baseline: {
      moveKey: offKey,
      rootScore: off.stats.rootScore,
      nodes: off.stats.nodes,
      quiescenceNodes: off.stats.quiescenceNodes,
      cutoffs: off.stats.cutoffs,
      cacheHits: off.stats.cacheHits,
      cacheStores: off.stats.cacheStores,
      evaluationRequests: off.stats.evaluationRequests,
      evaluations: off.stats.evaluations,
      triggerCount: off.stats.pbaiC004TriggerCount,
      rootTtFirstDepths: off.stats.pbaiC004RootTtFirstDepths,
    },
    candidate: {
      moveKey: onKey,
      rootScore: on.stats.rootScore,
      nodes: on.stats.nodes,
      quiescenceNodes: on.stats.quiescenceNodes,
      cutoffs: on.stats.cutoffs,
      cacheHits: on.stats.cacheHits,
      cacheStores: on.stats.cacheStores,
      evaluationRequests: on.stats.evaluationRequests,
      evaluations: on.stats.evaluations,
      triggerCount: on.stats.pbaiC004TriggerCount,
      rootTtFirstDepths: on.stats.pbaiC004RootTtFirstDepths,
    },
    nodeRatioCandidateOverBaseline: ratio,
    d4Reference: {
      bestScore: reference.bestScore,
      bestScoreClass: reference.bestScoreClass,
      topSetMoveKeys: reference.topSetMoveKeys,
    },
    rootScoreMismatch: off.stats.rootScore !== on.stats.rootScore,
    candidateOutsideD4TopSet: !reference.topSetMoveKeys.includes(onKey),
    catastrophicNewLoss: catastrophicNewLoss(item.root, reference, offKey, onKey),
  };
}

function median(values) {
  if (!values.length) return null;
  const ordered = values.slice().sort((a, b) => a - b);
  const middle = Math.floor(ordered.length / 2);
  return ordered.length % 2 ? ordered[middle] : (ordered[middle - 1] + ordered[middle]) / 2;
}

const CONTROL_EQUALITY_FIELDS = [
  "moveKey", "rootScore", "nodes", "quiescenceNodes", "cutoffs", "cacheHits",
  "cacheStores", "evaluationRequests", "evaluations",
];

function controlMismatchFields(metric) {
  return CONTROL_EQUALITY_FIELDS.filter((field) => metric.baseline[field] !== metric.candidate[field]);
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const contract = readJson(CONTRACT_PATH);
  const block = contract.candidateSpecificPopulation.developmentSourceSeedBlock;
  const population = Population.materializeSplit({
    split: "development",
    start: block.start,
    end: block.end,
    maximumPlies: 160,
  });
  const populationDigest = Population.populationDigest(population);
  if (populationDigest !== contract.predevelopmentSupport.populationDigest) {
    throw new Error(`Population digest drift: ${populationDigest}`);
  }

  const measured = population.roots.map(exactD23).sort(rootOrder);
  const primary = measured.filter((item) => item.topSetDisjoint)
    .slice(0, contract.candidateSpecificPopulation.primaryTarget.maximumRoots.development);
  const boundary = measured.filter((item) => !item.topSetDisjoint && item.canonicalBestChanged)
    .slice(0, contract.candidateSpecificPopulation.boundaryTriggerStratum.selectionMaximum.development);
  const controls = measured.filter((item) => !item.topSetDisjoint && !item.canonicalBestChanged)
    .slice(0, contract.candidateSpecificPopulation.negativeControl.selection.development);

  if (primary.length < contract.candidateSpecificPopulation.primaryTarget.minimumEstimableRoots.development) {
    throw new Error("Development primary support became non-estimable");
  }

  const primaryMetrics = primary.map(rootMetric);
  const boundaryMetrics = boundary.map(rootMetric);
  const controlMetrics = controls.map(rootMetric);

  const primaryRatios = primaryMetrics.map((item) => item.nodeRatioCandidateOverBaseline);
  const medianNodeRatio = median(primaryRatios);
  const fractionNonWorse = primaryMetrics.filter((item) => item.candidate.nodes <= item.baseline.nodes).length
    / primaryMetrics.length;
  const rootScoreMismatches = [...primaryMetrics, ...boundaryMetrics].filter((item) => item.rootScoreMismatch).length;
  const outsideTopSet = [...primaryMetrics, ...boundaryMetrics].filter((item) => item.candidateOutsideD4TopSet).length;
  const catastrophic = [...primaryMetrics, ...boundaryMetrics].filter((item) => item.catastrophicNewLoss).length;
  const primaryTriggerFailures = primaryMetrics.filter((item) =>
    item.candidate.triggerCount < contract.candidateSpecificBenefitGate.primaryTargetRuntimeCoverageGate.featureOnTriggerMinimumPerSelectedRoot
    || item.baseline.triggerCount > contract.candidateSpecificBenefitGate.primaryTargetRuntimeCoverageGate.featureOffTriggerMaximumPerSelectedRoot).length;

  const boundaryBaselineNodes = boundaryMetrics.reduce((sum, item) => sum + item.baseline.nodes, 0);
  const boundaryCandidateNodes = boundaryMetrics.reduce((sum, item) => sum + item.candidate.nodes, 0);
  const boundaryAggregateRatio = boundaryBaselineNodes === 0 ? 1 : boundaryCandidateNodes / boundaryBaselineNodes;

  const controlTriggerFailures = controlMetrics.filter((item) =>
    item.candidate.triggerCount > contract.candidateSpecificBenefitGate.negativeControlGate.featureOnTriggerCountMaximumPerRoot).length;
  const controlEqualityFailures = controlMetrics
    .map((item) => ({ ref: item.ref, fields: controlMismatchFields(item) }))
    .filter((item) => item.fields.length > 0);

  const gates = {
    support: primary.length >= contract.candidateSpecificPopulation.primaryTarget.minimumEstimableRoots.development,
    medianNodeRatio: medianNodeRatio <= contract.candidateSpecificBenefitGate.development.medianNodeRatioMaximum,
    fractionNonWorse: fractionNonWorse >= contract.candidateSpecificBenefitGate.development.fractionRootsCandidateNodesLessThanOrEqualBaselineMinimum,
    primaryTriggerCoverage: primaryTriggerFailures === 0,
    semanticRootScore: rootScoreMismatches <= contract.candidateSpecificBenefitGate.semanticSafetyOnPrimaryAndBoundaryRoots.rootScoreMismatchMaximum,
    semanticTopSet: outsideTopSet <= contract.candidateSpecificBenefitGate.semanticSafetyOnPrimaryAndBoundaryRoots.candidateSelectedMoveOutsideFrozenD4ReferenceTopSetMaximum,
    catastrophicNewLoss: catastrophic <= contract.candidateSpecificBenefitGate.semanticSafetyOnPrimaryAndBoundaryRoots.catastrophicNewLossMaximum,
    boundaryCost: boundary.length === 0
      || boundaryAggregateRatio <= contract.candidateSpecificBenefitGate.boundaryTriggerCostGate.aggregateNodeRatioCandidateOverBaselineMaximum,
    negativeControlTrigger: controlTriggerFailures === 0,
    negativeControlExactness: controlEqualityFailures.length === 0,
  };
  const pass = Object.values(gates).every(Boolean);

  const report = {
    schemaVersion: 1,
    program: "PBAI-P1",
    phase: "PBAI-E-DEVELOPMENT",
    candidateId: "PBAI-C004",
    candidateVersion: "PBAI-C004-v1",
    contractPath: CONTRACT_PATH,
    sourceBinding: {
      publicAiSha256: sha256File("public/ai.js"),
      publicEngineSha256: sha256File("public/engine.js"),
    },
    populationDigest,
    populationSupport: population.support,
    strata: {
      primarySelected: primary.length,
      boundarySelected: boundary.length,
      negativeControlsSelected: controls.length,
    },
    primarySummary: {
      medianNodeRatioCandidateOverBaseline: medianNodeRatio,
      fractionRootsCandidateNodesLessThanOrEqualBaseline: fractionNonWorse,
      rootScoreMismatchCountPrimaryAndBoundary: rootScoreMismatches,
      candidateOutsideD4TopSetCountPrimaryAndBoundary: outsideTopSet,
      catastrophicNewLossCountPrimaryAndBoundary: catastrophic,
      primaryTriggerFailureCount: primaryTriggerFailures,
    },
    boundarySummary: {
      baselineNodes: boundaryBaselineNodes,
      candidateNodes: boundaryCandidateNodes,
      aggregateNodeRatioCandidateOverBaseline: boundaryAggregateRatio,
    },
    negativeControlSummary: {
      triggerFailureCount: controlTriggerFailures,
      equalityFailureCount: controlEqualityFailures.length,
      equalityFailures: controlEqualityFailures,
    },
    gates,
    developmentPass: pass,
    decision: pass ? "DEVELOPMENT-PASS-ELIGIBLE-FOR-FRESH-VALIDATION" : "DEVELOPMENT-FAIL-HOLD",
    validationSeedsAccessed: false,
    releaseHoldoutSeedsAccessed: false,
    releaseHoldoutAuthorized: false,
    aiGen3PromotionAuthorized: false,
    primaryMetrics,
    boundaryMetrics,
    controlMetrics,
  };

  const serialized = `${JSON.stringify(report, null, 2)}\n`;
  if (args.output) {
    const absolute = path.resolve(ROOT, args.output);
    fs.mkdirSync(path.dirname(absolute), { recursive: true });
    fs.writeFileSync(absolute, serialized);
  }
  process.stdout.write(serialized);
  if (!pass) process.exitCode = 1;
}

main();
