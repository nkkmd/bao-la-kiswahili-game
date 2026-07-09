"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const E = require("../public/engine.js");
const AI = require("../public/ai.js");
const WeightConfig = require("../public/ai-weights.js");

const candidateWeights = process.env.BAO_AI_WEIGHTS
  ? WeightConfig.validateWeights(JSON.parse(fs.readFileSync(process.env.BAO_AI_WEIGHTS, "utf8")))
  : null;
const candidateAdjustments = process.env.BAO_AI_ADJUSTMENTS
  ? WeightConfig.validateAdjustments(JSON.parse(fs.readFileSync(process.env.BAO_AI_ADJUSTMENTS, "utf8")))
  : null;
const evaluationProfile = process.env.BAO_AI_PROFILE || "bao";

const DIAGNOSTICS = process.env.BAO_TACTICAL_DIAG === "1";

function envOptions() {
  return {
    evaluationProfile,
    evaluationWeights: candidateWeights,
    evaluationAdjustments: candidateAdjustments,
    diagnostics: DIAGNOSTICS,
  };
}

function state(overrides) {
  return { ...E.initialState(), reason: "", pending: [0, 0], ...overrides };
}

function hardAnalysis(position, maxDepth, options = envOptions()) {
  return AI.analyzeMove(position, "hard", () => 0, {
    maxDepth,
    timeLimitMs: Infinity,
    evaluationProfile: options.evaluationProfile || "bao",
    evaluationWeights: options.evaluationWeights || null,
    evaluationAdjustments: options.evaluationAdjustments || null,
  });
}

function captureTotal(events) {
  return events.filter((event) => event.kind === "capture")
    .reduce((sum, event) => sum + event.count, 0);
}

function largestReplyCapture(position) {
  return E.moveVariants(position).reduce((largest, reply) => {
    return Math.max(largest, captureTotal(E.applyMove(position, reply).events));
  }, 0);
}

function moveMatches(move, expected) {
  return Object.entries(expected).every(([key, value]) => move[key] === value);
}

function assertMoveMatches(move, expected, message) {
  assert.ok(moveMatches(move, expected), `${message}: got ${AI.moveKey(move)}`);
}

function frontOccupied(position, player) {
  return position.pits[player][E.FRONT].filter((value) => value > 0).length;
}

function diagnostic(caseInfo, analysis, options = envOptions()) {
  if (!options.diagnostics) return;
  const move = analysis.move;
  const next = E.applyMove(caseInfo.position, move).state;
  const player = caseInfo.position.player;
  const profile = options.evaluationProfile || "bao";
  console.log(JSON.stringify({
    category: caseInfo.category,
    name: caseInfo.name,
    profile,
    depth: caseInfo.depth,
    move: AI.moveKey(move),
    rootEval: AI.evaluateWithProfile(
      caseInfo.position, player, profile, options.evaluationWeights, options.evaluationAdjustments,
    ),
    nextEval: AI.evaluateWithProfile(
      next, player, profile, options.evaluationWeights, options.evaluationAdjustments,
    ),
    rootBreakdown: AI.evaluationBreakdown(caseInfo.position, player, {
      evaluationProfile: profile,
      evaluationWeights: options.evaluationWeights,
      evaluationAdjustments: options.evaluationAdjustments,
    }),
    stats: analysis.stats,
  }));
}

const relayPosition = state({
  pits: [
    [[1, 1, 1, 1, 0, 1, 1, 0], [1, 1, 1, 1, 0, 1, 1, 2]],
    [[0, 0, 1, 0, 7, 1, 0, 1], [0, 0, 0, 0, 0, 0, 0, 1]],
  ],
  reserve: [19, 20], houseOwned: [false, true], player: 1, turn: 6,
});

const nyumbaPosition = state({
  pits: [
    [[0, 1, 0, 0, 12, 1, 1, 1], [0, 0, 0, 0, 1, 2, 2, 0]],
    [[1, 2, 3, 0, 11, 0, 1, 1], [0, 1, 1, 0, 2, 1, 3, 0]],
  ],
  reserve: [8, 8], houseOwned: [true, true], player: 0, turn: 29,
});

const nyumbaPreservationPosition = state({
  pits: [
    [[0, 0, 0, 0, 8, 0, 5, 1], [0, 0, 0, 0, 0, 0, 0, 1]],
    [[1, 1, 3, 1, 0, 1, 1, 0], [1, 1, 1, 1, 1, 0, 0, 0]],
  ],
  reserve: [18, 18], houseOwned: [true, false], player: 0, turn: 9,
});

const mtajiEndurancePosition = state({
  phase: "mtaji",
  reserve: [0, 0],
  houseOwned: [false, false],
  player: 0,
  turn: 50,
  pits: [
    [[1, 0, 2, 0, 1, 0, 0, 2], [0, 2, 0, 0, 0, 0, 0, 0]],
    [[0, 1, 0, 0, 1, 0, 1, 0], [0, 0, 0, 2, 0, 0, 0, 0]],
  ],
});

const tacticalCases = [
  {
    category: "forced-win",
    name: "hard AI takes an immediate victory",
    depth: 2,
    position: state({
      phase: "mtaji", reserve: [0, 0], player: 1, houseOwned: [false, false],
      pits: [
        [[1, 0, 0, 0, 0, 0, 0, 0], Array(8).fill(0)],
        [[1, 1, 0, 0, 0, 0, 0, 2], Array(8).fill(0)],
      ],
    }),
    assert(analysis, position) {
      assert.equal(E.applyMove(position, analysis.move).state.winner, 1,
        "hard AI takes an immediate victory");
    },
  },
  {
    category: "capture-relay",
    name: "hard AI recognizes a capture relay",
    depth: 1,
    position: relayPosition,
    assert(analysis, position) {
      const result = E.applyMove(position, analysis.move);
      assert.ok(result.events.filter((event) => event.kind === "capture").length >= 2,
        "hard AI recognizes a capture relay");
    },
  },
  {
    category: "nyumba-destruction",
    name: "hard AI can choose to use the nyumba",
    depth: 1,
    position: nyumbaPosition,
    assert(analysis, position) {
      assert.equal(analysis.move.houseChoice, "use", "hard AI can choose to use the nyumba");
      assert.equal(E.applyMove(position, analysis.move).state.houseOwned[0], false,
        "using the nyumba consumes its ownership");
    },
  },
  {
    category: "nyumba-preservation",
    name: "hard AI can preserve the nyumba",
    depth: 2,
    position: nyumbaPreservationPosition,
    assert(analysis, position) {
      assert.notEqual(analysis.move.houseChoice, "use", "hard AI can preserve the nyumba");
      assert.equal(E.applyMove(position, analysis.move).state.houseOwned[0], true,
        "the preserving move keeps nyumba ownership");
    },
  },
  {
    category: "namua-endgame",
    name: "last reserve placement enters mtaji with a playable board shape",
    depth: 2,
    position: (() => {
      const position = E.initialState();
      position.reserve = [1, 0];
      position.player = 0;
      return position;
    })(),
    assert(analysis, position) {
      const result = E.applyMove(position, analysis.move).state;
      assert.equal(result.phase, "mtaji", "hard AI crosses from namua to mtaji");
      assert.ok(E.moveVariants(result).length > 0, "the resulting mtaji position remains playable");
      assert.ok(frontOccupied(result, 0) >= 3, "the mtaji transition keeps a resilient front row");
    },
  },
  {
    category: "two-ply-counter-avoidance",
    name: "hard AI limits the opponent's largest immediate reply",
    depth: 2,
    position: relayPosition,
    assert(analysis, position) {
      const next = E.applyMove(position, analysis.move).state;
      assert.equal(largestReplyCapture(next), 1,
        "hard AI limits the opponent's largest immediate reply");
    },
  },
  {
    category: "mtaji-endurance",
    name: "hard AI keeps mtaji mobility and front-row durability over a quiet move",
    depth: 3,
    position: mtajiEndurancePosition,
    assert(analysis, position) {
      assertMoveMatches(analysis.move, {
        type: "takata", phase: "mtaji", row: E.FRONT, index: 2, direction: "right",
      }, "hard AI chooses the mtaji endurance move");
      const result = E.applyMove(position, analysis.move).state;
      assert.equal(result.winner, null, "the endurance move does not collapse immediately");
      assert.ok(frontOccupied(result, 0) >= 4, "the endurance move keeps the front row broad");
      assert.ok(E.moveVariants(result).length >= 2, "the endurance move preserves mobility");
    },
  },
];

function runTacticalSuite(options = envOptions()) {
  const failures = [];
  for (const caseInfo of tacticalCases) {
    const analysis = hardAnalysis(caseInfo.position, caseInfo.depth, options);
    diagnostic(caseInfo, analysis, options);
    try {
      caseInfo.assert(analysis, caseInfo.position);
    } catch (error) {
      failures.push({
        category: caseInfo.category,
        name: caseInfo.name,
        message: error.message,
        move: AI.moveKey(analysis.move),
      });
    }
  }
  return {
    total: tacticalCases.length,
    passed: tacticalCases.length - failures.length,
    failures,
  };
}

if (require.main === module) {
  const result = runTacticalSuite();
  assert.deepEqual(result.failures, [], "Bao tactical cases pass");
  assert.ok(new Set(tacticalCases.map((caseInfo) => caseInfo.category)).size >= 6,
    "tactical suite covers at least six Bao tactical categories");
  console.log("Bao tactical tests passed");
}

module.exports = { tacticalCases, runTacticalSuite };
