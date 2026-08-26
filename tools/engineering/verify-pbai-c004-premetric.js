#!/usr/bin/env node
"use strict";

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

function classify(root) {
  const trace = Diagnostic.analyzeDepthTrace(root.state, [2, 3], {
    evaluationProfile: "bao",
    quiescenceDepth: 1,
    orderQuiescenceCaptures: false,
  });
  const d2 = trace.results.find((item) => item.depth === 2);
  const d3 = trace.results.find((item) => item.depth === 3);
  const transition = trace.transitions.find((item) => item.fromDepth === 2 && item.toDepth === 3);
  if (!d2 || !d3 || !transition) throw new Error("Missing exact D2/D3 classification");
  return {
    root,
    ref: Population.rootRef(root),
    populationRankHash: root.populationRankHash,
    topSetDisjoint: transition.topSetDisjoint,
    canonicalBestChanged: transition.canonicalBestChanged,
    d2CanonicalBestMoveKey: d2.canonicalBestMoveKey,
    d3CanonicalBestMoveKey: d3.canonicalBestMoveKey,
  };
}

function analyze(root, enabled) {
  return AI.analyzeMove(root.state, "hard", () => 0.5, {
    timeLimitMs: Infinity,
    maxDepth: 3,
    evaluationProfile: "bao",
    quiescenceDepth: 1,
    orderQuiescenceCaptures: false,
    pbaiC004D23RootTtFirst: enabled,
  });
}

const EQUALITY_STATS = [
  "nodes", "quiescenceNodes", "cutoffs", "cacheHits", "cacheStores",
  "historyUpdates", "aspirationResearches", "evaluationRequests", "evaluations",
  "evaluationCacheHits", "evaluationCacheStores", "evaluationCachePeak",
  "evaluationCacheEvictions", "completedDepth", "rootScore", "timedOut",
  "earlyStopped", "stableIterations", "rootBestChanges",
];

function auditRoot(item) {
  const off = analyze(item.root, false);
  const on = analyze(item.root, true);
  const mismatches = [];
  if (AI.moveKey(off.move) !== AI.moveKey(on.move)) mismatches.push("selectedMoveKey");
  for (const key of EQUALITY_STATS) {
    if (off.stats[key] !== on.stats[key]) mismatches.push(key);
  }
  if (off.stats.pbaiC004TriggerCount !== 0 || off.stats.pbaiC004RootTtFirstDepths !== 0) {
    mismatches.push("featureOffCandidateStats");
  }
  if (on.stats.pbaiC004RootTtFirstDepths !== 0) mismatches.push("candidateEffectBeforeD4");
  return {
    ref: item.ref,
    stratum: item.topSetDisjoint
      ? "primary"
      : item.canonicalBestChanged ? "boundary" : "negativeControl",
    exactD2CanonicalBestMoveKey: item.d2CanonicalBestMoveKey,
    exactD3CanonicalBestMoveKey: item.d3CanonicalBestMoveKey,
    selectedMoveKeyOff: AI.moveKey(off.move),
    selectedMoveKeyOn: AI.moveKey(on.move),
    rootScore: off.stats.rootScore,
    featureOffTriggerCount: off.stats.pbaiC004TriggerCount,
    featureOnTriggerCount: on.stats.pbaiC004TriggerCount,
    featureOnRootTtFirstDepths: on.stats.pbaiC004RootTtFirstDepths,
    d3FeatureOnOffMismatchFields: mismatches,
  };
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const contract = readJson(CONTRACT_PATH);
  if (contract.candidateVersion !== "PBAI-C004-v1") throw new Error("Unexpected C004 contract");
  if (!contract.validationAndHoldoutFirewall.developmentExecutionAllowedAfterContractMerge) {
    throw new Error("Development is not authorized by contract");
  }
  if (contract.validationAndHoldoutFirewall.releaseHoldoutExecutionAuthorizedNow !== false) {
    throw new Error("Release holdout firewall is open");
  }

  const block = contract.candidateSpecificPopulation.developmentSourceSeedBlock;
  const population = Population.materializeSplit({
    split: "development",
    start: block.start,
    end: block.end,
    maximumPlies: 160,
  });
  const digest = Population.populationDigest(population);
  if (digest !== contract.predevelopmentSupport.populationDigest) {
    throw new Error(`Development population digest drift: ${digest}`);
  }

  const measured = population.roots.map(classify).sort(rootOrder);
  const primary = measured.filter((item) => item.topSetDisjoint)
    .slice(0, contract.candidateSpecificPopulation.primaryTarget.maximumRoots.development);
  const boundary = measured.filter((item) => !item.topSetDisjoint && item.canonicalBestChanged)
    .slice(0, contract.candidateSpecificPopulation.boundaryTriggerStratum.selectionMaximum.development);
  const controls = measured.filter((item) => !item.topSetDisjoint && !item.canonicalBestChanged)
    .slice(0, contract.candidateSpecificPopulation.negativeControl.selection.development);

  if (primary.length !== contract.candidateSpecificPopulation.primaryTarget.developmentSupportAlreadyObserved) {
    throw new Error(`Primary support drift: ${primary.length}`);
  }
  if (boundary.length !== contract.candidateSpecificPopulation.boundaryTriggerStratum.developmentSupportAlreadyObserved) {
    throw new Error(`Boundary support drift: ${boundary.length}`);
  }
  if (measured.filter((item) => !item.topSetDisjoint && !item.canonicalBestChanged).length
      !== contract.candidateSpecificPopulation.negativeControl.developmentSupportAlreadyObserved) {
    throw new Error("Negative-control support drift");
  }

  const primaryAudits = primary.map(auditRoot);
  const boundaryAudits = boundary.map(auditRoot);
  const controlAudits = controls.map(auditRoot);

  const primaryTriggerFailures = primaryAudits.filter((item) =>
    item.featureOnTriggerCount < contract.candidateSpecificBenefitGate.primaryTargetRuntimeCoverageGate.featureOnTriggerMinimumPerSelectedRoot
    || item.featureOffTriggerCount > contract.candidateSpecificBenefitGate.primaryTargetRuntimeCoverageGate.featureOffTriggerMaximumPerSelectedRoot);
  const controlTriggerFailures = controlAudits.filter((item) =>
    item.featureOnTriggerCount > contract.candidateSpecificBenefitGate.negativeControlGate.featureOnTriggerCountMaximumPerRoot);
  const d3EqualityFailures = [...primaryAudits, ...boundaryAudits, ...controlAudits]
    .filter((item) => item.d3FeatureOnOffMismatchFields.length > 0);

  const pass = primaryTriggerFailures.length === 0
    && controlTriggerFailures.length === 0
    && d3EqualityFailures.length === 0;
  const report = {
    schemaVersion: 1,
    program: "PBAI-P1",
    phase: "PBAI-E-PREMETRIC-SAFETY",
    candidateId: "PBAI-C004",
    candidateVersion: "PBAI-C004-v1",
    contractPath: CONTRACT_PATH,
    populationDigest: digest,
    populationSupport: population.support,
    strata: {
      primarySelected: primary.length,
      boundarySelected: boundary.length,
      negativeControlsSelected: controls.length,
      negativeControlTotalSupport: measured.filter((item) => !item.topSetDisjoint && !item.canonicalBestChanged).length,
    },
    candidateBenefitMetricsObserved: false,
    d4CandidateMetricsObserved: false,
    validationSeedsAccessed: false,
    releaseHoldoutSeedsAccessed: false,
    primaryTriggerFailures: primaryTriggerFailures.map((item) => item.ref),
    controlTriggerFailures: controlTriggerFailures.map((item) => item.ref),
    d3EqualityFailures: d3EqualityFailures.map((item) => ({ ref: item.ref, fields: item.d3FeatureOnOffMismatchFields })),
    boundaryTriggerCounts: boundaryAudits.map((item) => ({ ref: item.ref, triggerCount: item.featureOnTriggerCount })),
    pass,
    decision: pass ? "PREMETRIC-SAFETY-PASS" : "PREMETRIC-SAFETY-FAIL-HOLD",
    primaryAudits,
    boundaryAudits,
    controlAudits,
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
