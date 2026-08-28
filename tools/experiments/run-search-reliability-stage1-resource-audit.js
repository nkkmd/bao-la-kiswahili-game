#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const E = require("../../public/engine.js");
const AI = require("../../public/ai.js");
const { seededRandom } = require("../benchmark.js");
const S = require("./lib/search-reliability-decision-robustness.js");

const AUDIT_ID = "SRDR-PRESTAGE1-RESOURCE-AUDIT-2026-08-27-v1";
const TECHNICAL_SEEDS = [99002001, 99002002, 99002003, 99002004];
const TARGET_PLIES = new Set([8, 16, 24, 32, 40, 44, 52, 60]);
const SEARCH_OPTIONS = Object.freeze({
  evaluationProfile: "bao",
  quiescenceDepth: 1,
  orderQuiescenceCaptures: false,
  legalMoveOrdering: "canonical",
});

function parseArgs(argv) {
  const out = { output: null };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === "--output") out.output = argv[++i];
    else throw new Error(`Unknown argument: ${argv[i]}`);
  }
  return out;
}

function sha256(value) { return crypto.createHash("sha256").update(value).digest("hex"); }

function generateTechnicalStates(seed) {
  const random = seededRandom(seed);
  let state = E.initialState();
  const rows = [];
  for (let ply = 0; ply <= 80; ply += 1) {
    if (TARGET_PLIES.has(ply) && state.winner === null) {
      rows.push({ seed, ply, phase: state.phase, state: JSON.parse(JSON.stringify(state)) });
    }
    if (state.winner !== null || ply === 80) break;
    let move;
    if (ply < 8) {
      const legal = E.moveVariants(state);
      move = legal[Math.floor(random() * legal.length)];
    } else {
      const result = AI.analyzeMove(state, "hard", random, {
        searchProfile: "phase2",
        evaluationProfile: "bao",
        maxDepth: 2,
        timeLimitMs: Infinity,
        quiescenceDepth: 1,
        orderQuiescenceCaptures: false,
        adaptive: false,
        stableBestDepths: 0,
        aspirationWindow: 0,
      });
      if (result.stats.timedOut || result.stats.completedDepth !== 2) {
        throw new Error("technical trajectory generator did not complete frozen D2 continuation");
      }
      move = result.move;
    }
    state = E.applyMove(state, move).state;
  }
  return rows;
}

function quantile(values, q) {
  if (!values.length) return null;
  const sorted = values.slice().sort((a, b) => a - b);
  return sorted[Math.floor(q * (sorted.length - 1))];
}

function summarize(values) {
  return {
    n: values.length,
    min: Math.min(...values),
    p25: quantile(values, 0.25),
    median: quantile(values, 0.5),
    p75: quantile(values, 0.75),
    p90: quantile(values, 0.9),
    max: Math.max(...values),
  };
}

function auditState(row) {
  const exact = [1, 2, 3].map((depth) => S.analyzeExactCondition(row.state, depth, SEARCH_OPTIONS));
  const requiredCumulativeBudget = [];
  let cumulative = 0;
  for (const condition of exact) {
    cumulative += condition.nodeBudgetUsed;
    requiredCumulativeBudget.push({ depth: condition.completedDepth, budget: cumulative });
  }
  const quiescence = [0, 1, 2].map((quiescenceDepth) => {
    const condition = S.analyzeExactCondition(row.state, 2, { ...SEARCH_OPTIONS, quiescenceDepth });
    return {
      quiescenceDepth,
      nodeBudgetUsed: condition.nodeBudgetUsed,
      legalMoveCount: condition.result.legalMoveCount,
      topSetSize: condition.result.topSetSize,
      pvLength: condition.principalVariation.nominalPlyLength,
    };
  });
  return {
    seed: row.seed,
    ply: row.ply,
    phase: row.phase,
    rawIdentitySha256: sha256(S.rawIdentityKey(row.state)),
    legalMoveCount: exact[0].result.legalMoveCount,
    exact: exact.map((condition) => ({
      depth: condition.completedDepth,
      nodes: condition.nodeBudgetUsed,
      topSetSize: condition.result.topSetSize,
      pvLength: condition.principalVariation.nominalPlyLength,
    })),
    requiredCumulativeBudget,
    quiescence,
  };
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const all = TECHNICAL_SEEDS.flatMap(generateTechnicalStates);
  const seen = new Set();
  const unique = [];
  for (const row of all) {
    const key = S.rawIdentityKey(row.state);
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(row);
  }
  const namua = unique.filter((row) => row.phase === "namua").slice(0, 6);
  const mtaji = unique.filter((row) => row.phase === "mtaji").slice(0, 6);
  if (namua.length < 4 || mtaji.length < 4) {
    throw new Error(`technical resource audit lacks phase coverage: namua=${namua.length}, mtaji=${mtaji.length}`);
  }
  const states = [...namua, ...mtaji].map(auditState);
  const byDepth = Object.fromEntries([1, 2, 3].map((depth) => [depth, summarize(states.map((row) =>
    row.exact.find((x) => x.depth === depth).nodes))]));
  const cumulativeByDepth = Object.fromEntries([1, 2, 3].map((depth) => [depth, summarize(states.map((row) =>
    row.requiredCumulativeBudget.find((x) => x.depth === depth).budget))]));
  const q2Nodes = summarize(states.map((row) => row.quiescence.find((x) => x.quiescenceDepth === 2).nodeBudgetUsed));
  const result = {
    schemaVersion: 1,
    auditId: AUDIT_ID,
    technicalOnly: true,
    scientificInferenceAuthorized: false,
    scientificOutcomeGenerationAuthorized: false,
    formalEvidenceAuthorized: false,
    confirmatoryReuseAllowed: false,
    technicalSeeds: TECHNICAL_SEEDS,
    scientificSeedConsumed: false,
    reservedScientificSeedBlocksTouched: false,
    generator: "8-ply seeded-uniform opening then frozen phase2 D2 continuation; max ply 80",
    selection: "fixed target plies; first six unique RAW states per phase; outcome-blind technical resource planning only",
    searchOptions: SEARCH_OPTIONS,
    states,
    summary: { byDepth, cumulativeByDepth, q2Nodes },
  };
  result.resultHash = sha256(JSON.stringify(result));
  const text = `${JSON.stringify(result, null, 2)}\n`;
  if (args.output) {
    fs.mkdirSync(path.dirname(path.resolve(args.output)), { recursive: true });
    fs.writeFileSync(args.output, text);
  } else process.stdout.write(text);
}

main();
