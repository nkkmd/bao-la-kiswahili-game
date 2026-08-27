#!/usr/bin/env node
"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const E = require("../../public/engine.js");
const Legacy = require("./lib/position-complexity-search-diagnostic.js");
const SRDR = require("./lib/search-reliability-decision-robustness.js");

const STAGE_ID = "SRDR-S0-TECHNICAL-2026-08-27-v1";
const BASELINE_MAIN = "db6980bffb7e6853751914da628db8936c76d81e";
const SPEC_PATH = "doc/search-reliability-decision-robustness/preregistration/STAGE_0_TECHNICAL_SPEC.json";
const EXPECTED_SPEC_SHA256 = "12868cad547afbafb8ba60912e10aa3901076789265a29e68059193ab1d04b26";
const SOURCE_PATHS = [
  "public/engine.js",
  "public/ai.js",
  "public/ai-weights.js",
  "tools/experiments/lib/position-complexity-search-diagnostic.js",
  "tools/experiments/lib/search-reliability-decision-robustness.js",
  "tools/experiments/run-search-reliability-stage0.js",
  "tools/experiments/verify-search-reliability-stage0.js",
  "test/search-reliability-decision-robustness-stage0.test.js",
  SPEC_PATH,
];
const BASE_OPTIONS = {
  evaluationProfile: "bao",
  quiescenceDepth: 1,
  orderQuiescenceCaptures: false,
  legalMoveOrdering: "engine",
};

function parseArgs(argv) {
  let output = null;
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === "--output") output = argv[++i];
    else throw new Error(`Unknown argument: ${argv[i]}`);
  }
  return { output };
}

function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function canonicalize(value) {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonicalize(value[key])]));
  }
  return value;
}

function stableHash(value) {
  return sha256(JSON.stringify(canonicalize(value)));
}

function fileSha256(relativePath) {
  return sha256(fs.readFileSync(path.resolve(relativePath)));
}

function forcedWinFixture() {
  return {
    pits: [
      [[1, 0, 0, 0, 0, 0, 0, 0], Array(8).fill(0)],
      [[1, 1, 0, 0, 0, 0, 0, 2], Array(8).fill(0)],
    ],
    reserve: [0, 0],
    houseOwned: [false, false],
    player: 1,
    phase: "mtaji",
    winner: null,
    reason: "",
    turn: 50,
    pending: [0, 0],
  };
}

function scoreMap(result) {
  return Object.fromEntries(result.candidates.map(({ moveKey, score }) => [moveKey, score]));
}

function compactCondition(condition) {
  if (!condition.result) return {
    mode: condition.mode,
    completedDepth: condition.completedDepth,
    nodeBudget: condition.nodeBudget,
    nodeBudgetUsed: condition.nodeBudgetUsed,
    budgetExhausted: condition.budgetExhausted,
    attemptedDepth: condition.attemptedDepth,
    abortedDepth: condition.abortedDepth,
    estimable: condition.estimable,
    nonEstimableReason: condition.nonEstimableReason,
  };
  return {
    mode: condition.mode,
    requestedDepth: condition.requestedDepth,
    requestedMaxDepth: condition.requestedMaxDepth,
    completedDepth: condition.completedDepth,
    nodeBudget: condition.nodeBudget,
    nodeBudgetUsed: condition.nodeBudgetUsed,
    budgetExhausted: condition.budgetExhausted,
    attemptedDepth: condition.attemptedDepth,
    abortedDepth: condition.abortedDepth,
    completedDepths: condition.completedDepths,
    budgetUsedAtCompletedDepths: condition.budgetUsedAtCompletedDepths,
    estimable: condition.estimable ?? true,
    result: {
      rawIdentityKey: condition.result.rawIdentityKey,
      phase: condition.result.phase,
      depth: condition.result.depth,
      options: condition.result.options,
      legalMoveCount: condition.result.legalMoveCount,
      bestScore: condition.result.bestScore,
      bestScoreClass: condition.result.bestScoreClass,
      secondBestScore: condition.result.secondBestScore,
      bestSecondGap: condition.result.bestSecondGap,
      topSetMoveKeys: condition.result.topSetMoveKeys,
      canonicalBestMoveKey: condition.result.canonicalBestMoveKey,
      aggregateCounters: condition.result.aggregateCounters,
      scoreByMoveKey: scoreMap(condition.result),
      scoreRankByMoveKey: Object.fromEntries(condition.result.candidates.map(({ moveKey, scoreRank }) => [moveKey, scoreRank])),
    },
    principalVariation: condition.principalVariation,
  };
}

function exactLegacyAgreement(state, depth) {
  const legacy = Legacy.analyzeRootCandidates(state, depth, BASE_OPTIONS);
  const current = SRDR.analyzeExactCondition(state, depth, BASE_OPTIONS);
  return {
    depth,
    current: compactCondition(current),
    legacy: {
      bestScore: legacy.bestScore,
      topSetMoveKeys: legacy.topSetMoveKeys,
      canonicalBestMoveKey: legacy.canonicalBestMoveKey,
      scoreByMoveKey: scoreMap(legacy),
    },
    allRootScoresEqual: JSON.stringify(scoreMap(current.result)) === JSON.stringify(scoreMap(legacy)),
    topSetEqual: JSON.stringify(current.result.topSetMoveKeys) === JSON.stringify(legacy.topSetMoveKeys),
    bestScoreEqual: current.result.bestScore === legacy.bestScore,
  };
}

function main() {
  const { output } = parseArgs(process.argv.slice(2));
  const initial = E.initialState();
  const mtaji = forcedWinFixture();
  const beforeInitial = JSON.stringify(initial);
  const beforeMtaji = JSON.stringify(mtaji);

  const initialExact = [1, 2, 3].map((depth) => exactLegacyAgreement(initial, depth));
  const mtajiExact = exactLegacyAgreement(mtaji, 4);
  const d1Cost = initialExact[0].current.nodeBudgetUsed;
  const d2Cost = initialExact[1].current.nodeBudgetUsed;
  const d3Cost = initialExact[2].current.nodeBudgetUsed;

  const budgetGrid = [
    { id: "below-d1", budget: d1Cost - 1 },
    { id: "last-complete-d1", budget: d1Cost + d2Cost - 1 },
    { id: "through-d2", budget: d1Cost + d2Cost },
    { id: "through-d3", budget: d1Cost + d2Cost + d3Cost },
  ].map(({ id, budget }) => ({
    id,
    budget,
    condition: compactCondition(SRDR.analyzeBudgetCondition(initial, 3, budget, BASE_OPTIONS)),
  }));

  const quiescenceDepthGrid = [0, 1, 2].map((quiescenceDepth) => ({
    quiescenceDepth,
    condition: compactCondition(SRDR.analyzeExactCondition(initial, 2, {
      ...BASE_OPTIONS,
      quiescenceDepth,
    })),
  }));
  const quiescenceOrderingGrid = [false, true].map((orderQuiescenceCaptures) => ({
    orderQuiescenceCaptures,
    condition: compactCondition(SRDR.analyzeExactCondition(initial, 2, {
      ...BASE_OPTIONS,
      orderQuiescenceCaptures,
    })),
  }));
  const moveOrderingGrid = ["engine", "canonical", "reverse-canonical"].map((legalMoveOrdering) => ({
    legalMoveOrdering,
    condition: compactCondition(SRDR.analyzeExactCondition(initial, 2, {
      ...BASE_OPTIONS,
      legalMoveOrdering,
    })),
  }));

  const repeatedA = compactCondition(SRDR.analyzeExactCondition(initial, 2, BASE_OPTIONS));
  const repeatedB = compactCondition(SRDR.analyzeExactCondition(initial, 2, BASE_OPTIONS));
  const specSha256 = fileSha256(SPEC_PATH);
  if (specSha256 !== EXPECTED_SPEC_SHA256) {
    throw new Error(`Stage 0 spec hash mismatch: ${specSha256}`);
  }

  const result = {
    schemaVersion: 1,
    stageId: STAGE_ID,
    studyId: "SRDR-STUDY1",
    programLabel: "G2-02",
    researchGeneration: "Research Generation 2",
    baselineMain: BASELINE_MAIN,
    technicalOnly: true,
    scientificInferenceAuthorized: false,
    confirmatoryReuseAllowed: false,
    scientificSeedConsumed: false,
    reservedScientificSeedBlocksTouched: false,
    formalEvidenceAuthorized: false,
    searchSemantics: SRDR.SEARCH_SEMANTICS,
    specSha256,
    sourceFileSha256: Object.fromEntries(SOURCE_PATHS.map((sourcePath) => [sourcePath, fileSha256(sourcePath)])),
    fixtureIds: ["engine-initial-namua", "forced-win-mtaji"],
    fixtureRawIdentitySha256: {
      "engine-initial-namua": sha256(SRDR.rawIdentityKey(initial)),
      "forced-win-mtaji": sha256(SRDR.rawIdentityKey(mtaji)),
    },
    stateMutationAudit: {
      initialUnchanged: JSON.stringify(initial) === beforeInitial,
      mtajiUnchanged: JSON.stringify(mtaji) === beforeMtaji,
    },
    exactLegacyAgreement: {
      initial: initialExact,
      mtaji: mtajiExact,
    },
    deterministicReplayAudit: {
      firstHash: stableHash(repeatedA),
      secondHash: stableHash(repeatedB),
      equal: stableHash(repeatedA) === stableHash(repeatedB),
    },
    budgetAudit: {
      exactStandaloneNodeCosts: { depth1: d1Cost, depth2: d2Cost, depth3: d3Cost },
      grid: budgetGrid,
      partialIterationRule: "discard-partial-iteration-use-last-complete-all-root-candidates",
      pvBudgetRule: "canonical PV reconstruction is measurement postprocessing and does not consume decision node budget",
    },
    quiescenceAudit: {
      depthGrid: quiescenceDepthGrid,
      captureOrderingGrid: quiescenceOrderingGrid,
    },
    moveOrderingAudit: moveOrderingGrid,
    pvAudit: {
      semantics: repeatedA.principalVariation.semantics,
      firstMoveEqualsCanonicalBest: repeatedA.principalVariation.moveKeys[0]
        === repeatedA.result.canonicalBestMoveKey,
      scoreEqualsBestScore: repeatedA.principalVariation.score === repeatedA.result.bestScore,
    },
  };
  result.resultHash = stableHash(result);
  const text = `${JSON.stringify(result, null, 2)}\n`;
  if (output) {
    fs.mkdirSync(path.dirname(path.resolve(output)), { recursive: true });
    fs.writeFileSync(output, text);
  } else process.stdout.write(text);
}

main();
