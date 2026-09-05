"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const vm = require("node:vm");
const { execFileSync } = require("node:child_process");
const E = require("../../public/engine.js");
const AI = require("../../public/ai.js");
const Weights = require("../../public/ai-weights.js");

const ROOT = path.resolve(__dirname, "../..");
const PROGRAM = "doc/ai-engineering/public-ai-improvement-program-3";
const SPEC_PATH = path.join(ROOT, PROGRAM, "candidates/PBAI-C010-v1-predevelopment-support-spec.json");
const MANIFEST_PATH = path.join(ROOT, PROGRAM, "candidates/PBAI-C010-v1-predevelopment-support-run-manifest.json");
const DEFAULT_OUTPUT_DIR = path.join(ROOT, "artifacts/pbai-p3/c010/predevelopment-support");
const AI_PATH = path.join(ROOT, "public/ai.js");
const WIN = 1_000_000;

class ProbeBudgetExhausted extends Error {
  constructor() {
    super("support probe node reserve exhausted");
    this.name = "ProbeBudgetExhausted";
  }
}

function ensure(value, message) {
  if (!value) throw new Error(message);
}

function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function fileSha256(relative) {
  return sha256(fs.readFileSync(path.join(ROOT, relative)));
}

function readJson(relativeOrAbsolute) {
  return JSON.parse(fs.readFileSync(relativeOrAbsolute, "utf8"));
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function git(...args) {
  return execFileSync("git", args, { cwd: ROOT, encoding: "utf8" }).trim();
}

function mulberry32(seed) {
  let value = seed >>> 0;
  return () => {
    value += 0x6D2B79F5;
    let next = value;
    next = Math.imul(next ^ (next >>> 15), next | 1);
    next ^= next + Math.imul(next ^ (next >>> 7), next | 61);
    return ((next ^ (next >>> 14)) >>> 0) / 4294967296;
  };
}

function rawObject(state) {
  ensure(Array.isArray(state.pending) && state.pending.length === 2, "authoritative pending is required");
  return {
    pits: state.pits.map((rows) => rows.map((row) => row.slice())),
    reserve: state.reserve.slice(),
    houseOwned: state.houseOwned.slice(),
    player: state.player,
    phase: state.phase,
    winner: state.winner,
    pending: state.pending.slice(),
  };
}

function rawDigest(state) {
  return sha256(Buffer.from(JSON.stringify(rawObject(state)), "utf8"));
}

function sortedMoves(state) {
  return E.moveVariants(state).slice().sort((a, b) => AI.moveKey(a).localeCompare(AI.moveKey(b)));
}

function phaseAssignments(spec, manifest) {
  const seeds = [];
  for (let seed = spec.sourcePopulation.seedStart; seed <= spec.sourcePopulation.seedEnd; seed += 1) {
    seeds.push({
      seed,
      rank: sha256(Buffer.from(`${manifest.phaseAssignment.salt}|${seed}`, "utf8")),
    });
  }
  seeds.sort((a, b) => a.rank.localeCompare(b.rank) || a.seed - b.seed);
  const namuaCount = manifest.phaseAssignment.assignedCounts.namua;
  ensure(namuaCount + manifest.phaseAssignment.assignedCounts.mtaji === seeds.length,
    "phase assignment count does not match frozen seed count");
  return new Map(seeds.map((item, index) => [item.seed, index < namuaCount ? "namua" : "mtaji"]));
}

function generateTrajectoryRoot(spec, manifest, seed, assignedPhase) {
  const random = mulberry32(seed);
  let state = E.initialState();
  let selected = null;
  const identitySequence = [];
  for (let ply = 0; ply <= spec.sourcePopulation.maximumPliesPerTrajectory; ply += 1) {
    const digest = rawDigest(state);
    identitySequence.push(digest);
    if (state.winner === null && state.phase === assignedPhase) {
      const legal = sortedMoves(state);
      if (legal.length >= spec.sourcePopulation.minimumLegalMoveCount) {
        const rank = sha256(Buffer.from(
          `${manifest.rootSelection.salt}|${seed}|${ply}|${digest}`, "utf8",
        ));
        const candidate = { seed, ply, phase: assignedPhase, rawDigest: digest, rank, state: clone(state) };
        if (!selected || candidate.rank < selected.rank
          || (candidate.rank === selected.rank && candidate.ply < selected.ply)) selected = candidate;
      }
    }
    if (state.winner !== null || ply === spec.sourcePopulation.maximumPliesPerTrajectory) break;
    const legal = sortedMoves(state);
    if (!legal.length) break;
    state = E.applyMove(state, legal[Math.floor(random() * legal.length)]).state;
  }
  return {
    seed,
    assignedPhase,
    trajectoryDigest: sha256(Buffer.from(JSON.stringify(identitySequence), "utf8")),
    root: selected,
  };
}

function selectUniqueRoots(generated) {
  const trajectoryMap = new Map();
  let duplicateTrajectories = 0;
  for (const item of generated.slice().sort((a, b) => a.seed - b.seed)) {
    if (trajectoryMap.has(item.trajectoryDigest)) duplicateTrajectories += 1;
    else trajectoryMap.set(item.trajectoryDigest, item);
  }
  const withRoots = [...trajectoryMap.values()].filter((item) => item.root);
  const rootMap = new Map();
  let duplicateRawRoots = 0;
  for (const item of withRoots) {
    const current = rootMap.get(item.root.rawDigest);
    if (!current) rootMap.set(item.root.rawDigest, item);
    else {
      duplicateRawRoots += 1;
      if (item.root.rank < current.root.rank
        || (item.root.rank === current.root.rank && item.seed < current.seed)) {
        rootMap.set(item.root.rawDigest, item);
      }
    }
  }
  return {
    rows: [...rootMap.values()].sort((a, b) => a.seed - b.seed),
    uniqueTrajectories: trajectoryMap.size,
    duplicateTrajectories,
    trajectoriesWithAssignedPhaseRoot: withRoots.length,
    unavailableAssignedPhaseRoots: trajectoryMap.size - withRoots.length,
    duplicateRawRoots,
  };
}

function replaceExactlyOnce(source, before, after, label) {
  const first = source.indexOf(before);
  ensure(first >= 0, `instrumentation anchor missing: ${label}`);
  ensure(source.indexOf(before, first + before.length) < 0, `instrumentation anchor repeated: ${label}`);
  return source.replace(before, after);
}

function instrumentedAi() {
  let source = fs.readFileSync(AI_PATH, "utf8");
  source = replaceExactlyOnce(
    source,
    "    let bestMove = choices[0].move;\n    for (let index = 0; index < choices.length; index += 1) {",
    "    let bestMove = choices[0].move;\n    const __pbaiP3RootValues = ply === 0 ? [] : null;\n    for (let index = 0; index < choices.length; index += 1) {",
    "root-value-array",
  );
  source = replaceExactlyOnce(
    source,
    "      if ((maximizing && value > best) || (!maximizing && value < best)) {",
    "      if (__pbaiP3RootValues) __pbaiP3RootValues.push({ moveKey: moveKey(choice.move), score: value });\n      if ((maximizing && value > best) || (!maximizing && value < best)) {",
    "root-value-capture",
  );
  source = replaceExactlyOnce(
    source,
    "    storeTable(context, key, { depth, value: storedValue, flag, bestMove: moveKey(bestMove) });\n    return best;\n  }\n\n  function performanceNow()",
    "    storeTable(context, key, { depth, value: storedValue, flag, bestMove: moveKey(bestMove) });\n    if (__pbaiP3RootValues && typeof root.__PBAI_P3_TRACE_SINK__ === \"function\") {\n      root.__PBAI_P3_TRACE_SINK__({ depth, values: __pbaiP3RootValues });\n    }\n    return best;\n  }\n\n  function performanceNow()",
    "root-trace-sink",
  );
  const traces = [];
  const moduleObject = { exports: {} };
  const sandbox = {
    BaoEngine: E,
    BaoAIWeights: Weights,
    module: moduleObject,
    exports: moduleObject.exports,
    console,
    performance,
    __PBAI_P3_TRACE_SINK__: (trace) => traces.push(clone(trace)),
  };
  sandbox.globalThis = sandbox;
  vm.runInNewContext(source, sandbox, { filename: "public/ai.js#pbai-p3-passive-trace" });
  return {
    analyze(state, level, options) {
      traces.length = 0;
      const result = moduleObject.exports.analyzeMove(clone(state), level, () => 0, options);
      return { result, traces: clone(traces) };
    },
    transformedSourceSha256: sha256(Buffer.from(source, "utf8")),
  };
}

function rankingGroups(values) {
  ensure(Array.isArray(values) && values.length > 0, "completed iteration has no root values");
  const seen = new Set();
  const ranked = values.map(({ moveKey, score }) => {
    ensure(typeof moveKey === "string" && moveKey.length > 0, "root move key missing");
    ensure(Number.isFinite(score), `non-finite root search-return score for ${moveKey}`);
    ensure(!seen.has(moveKey), `duplicate root move key ${moveKey}`);
    seen.add(moveKey);
    return { moveKey, score };
  }).sort((a, b) => b.score - a.score || a.moveKey.localeCompare(b.moveKey));
  const groups = [];
  for (const item of ranked) {
    const latest = groups[groups.length - 1];
    if (!latest || latest.score !== item.score) groups.push({ score: item.score, keys: [item.moveKey] });
    else latest.keys.push(item.moveKey);
  }
  return groups.map((group) => group.keys.slice().sort());
}

function relationMap(groups) {
  const map = new Map();
  groups.forEach((group, index) => group.forEach((key) => map.set(key, index)));
  return map;
}

function preorderChangeCount(d2Groups, d3Groups) {
  const a = relationMap(d2Groups);
  const b = relationMap(d3Groups);
  const keys = [...a.keys()].sort();
  ensure(keys.length === b.size && keys.every((key) => b.has(key)), "D2/D3 root move set mismatch");
  let changes = 0;
  for (let left = 0; left < keys.length; left += 1) {
    for (let right = left + 1; right < keys.length; right += 1) {
      const relationD2 = Math.sign(a.get(keys[right]) - a.get(keys[left]));
      const relationD3 = Math.sign(b.get(keys[right]) - b.get(keys[left]));
      if (relationD2 !== relationD3) changes += 1;
    }
  }
  return changes;
}

function topThree(groups) {
  return groups.flatMap((group) => group.slice().sort()).slice(0, 3);
}

function isHighWidth(phase, width, spec) {
  const threshold = phase === "namua"
    ? spec.trigger.rootLegalWidth.NamuaStrictlyGreaterThan
    : spec.trigger.rootLegalWidth.MtajiStrictlyGreaterThan;
  return width > threshold;
}

function controlClass(highWidth, churn) {
  if (highWidth && !churn) return "high-width/no-churn";
  if (!highWidth && churn) return "low-or-equal-width/churn";
  if (!highWidth && !churn) return "low-or-equal-width/no-churn";
  return "trigger";
}

function deterministicStats(stats) {
  return Object.fromEntries(Object.entries(stats).filter(([key]) => key !== "elapsedMs"));
}

function fixedMeasurement(instrumented, state, spec) {
  const condition = spec.conditions.deterministicFixedDepth;
  const options = {
    evaluationProfile: condition.evaluationProfile,
    maxDepth: condition.maxDepth,
    timeLimitMs: Infinity,
    quiescenceDepth: condition.quiescenceDepth,
  };
  const plain = AI.analyzeMove(clone(state), condition.level, () => 0, options);
  const observed = instrumented.analyze(state, condition.level, options);
  const moveMatch = AI.moveKey(plain.move) === AI.moveKey(observed.result.move);
  const rootScoreMatch = Object.is(plain.stats.rootScore, observed.result.stats.rootScore);
  const statsMatch = JSON.stringify(deterministicStats(plain.stats))
    === JSON.stringify(deterministicStats(observed.result.stats));
  const byDepth = new Map(observed.traces.map((trace) => [trace.depth, trace]));
  const d2 = byDepth.get(2);
  const d3 = byDepth.get(3);
  const complete = observed.result.stats.completedDepth === 3 && !observed.result.stats.timedOut
    && Boolean(d2) && Boolean(d3);
  if (!complete) return {
    complete: false,
    completedDepth: observed.result.stats.completedDepth,
    baselineNodes: observed.result.stats.nodes,
    moveMatch,
    rootScoreMatch,
    statsMatch,
    error: "D2/D3 trace incomplete",
  };
  const d2Groups = rankingGroups(d2.values);
  const d3Groups = rankingGroups(d3.values);
  const changes = preorderChangeCount(d2Groups, d3Groups);
  return {
    complete: true,
    completedDepth: observed.result.stats.completedDepth,
    completedDepths: observed.traces.map((trace) => trace.depth),
    baselineNodes: observed.result.stats.nodes,
    moveMatch,
    rootScoreMatch,
    statsMatch,
    d2Groups,
    d3Groups,
    preorderChangeCount: changes,
    churn: changes > 0,
    top3: topThree(d3Groups),
    error: null,
  };
}

function consumeProbeNode(budget) {
  if (budget.nodes >= budget.limit) throw new ProbeBudgetExhausted();
  budget.nodes += 1;
}

function terminalScore(state, player, ply) {
  if (state.winner === null) return null;
  return state.winner === player ? WIN - ply : -WIN + ply;
}

function probeQuiescence(state, alpha, beta, player, ply, remaining, budget) {
  consumeProbeNode(budget);
  const terminal = terminalScore(state, player, ply);
  if (terminal !== null) return terminal;
  const captures = E.moveVariants(state).filter((move) => move.type === "capture");
  if (!captures.length || remaining === 0) return AI.evaluateWithProfile(state, player, "bao");
  const maximizing = state.player === player;
  let best = maximizing ? -Infinity : Infinity;
  for (const move of captures) {
    const value = probeQuiescence(
      E.applyMove(state, move).state, alpha, beta, player, ply + 1, remaining - 1, budget,
    );
    if (maximizing) {
      best = Math.max(best, value);
      alpha = Math.max(alpha, best);
    } else {
      best = Math.min(best, value);
      beta = Math.min(beta, best);
    }
    if (beta <= alpha) break;
  }
  return best;
}

function probeSearch(state, depth, alpha, beta, player, ply, budget) {
  consumeProbeNode(budget);
  const terminal = terminalScore(state, player, ply);
  if (terminal !== null) return terminal;
  if (depth === 0) return probeQuiescence(state, alpha, beta, player, ply, 1, budget);
  const legal = E.moveVariants(state);
  if (!legal.length) return state.player === player ? -WIN + ply : WIN - ply;
  const maximizing = state.player === player;
  let best = maximizing ? -Infinity : Infinity;
  for (const move of legal) {
    const value = probeSearch(
      E.applyMove(state, move).state, depth - 1, alpha, beta, player, ply + 1, budget,
    );
    if (maximizing) {
      best = Math.max(best, value);
      alpha = Math.max(alpha, best);
    } else {
      best = Math.min(best, value);
      beta = Math.min(beta, best);
    }
    if (beta <= alpha) break;
  }
  return best;
}

function boundedProbe(state, top3, baselineNodes) {
  const reserve = Math.min(Math.floor(baselineNodes * 0.5), 32768);
  const budget = { limit: reserve, nodes: 0 };
  let complete = false;
  let reserveExhausted = false;
  let technicalError = null;
  try {
    const legal = E.moveVariants(state);
    const byKey = new Map(legal.map((move) => [AI.moveKey(move), move]));
    ensure(top3.length === 3, "trigger root must provide exactly three top moves");
    for (const key of top3) {
      const move = byKey.get(key);
      ensure(move, `probe move is not legal: ${key}`);
      probeSearch(E.applyMove(state, move).state, 3, -Infinity, Infinity, state.player, 1, budget);
    }
    complete = true;
  } catch (error) {
    if (error instanceof ProbeBudgetExhausted) reserveExhausted = true;
    else technicalError = String(error && error.message ? error.message : error);
  }
  return { reserve, nodes: budget.nodes, complete, reserveExhausted, technicalError };
}

function publicMeasurement(instrumented, state, condition, width, spec) {
  const observed = instrumented.analyze(state, condition.level, {
    evaluationProfile: "bao",
    maxDepth: condition.maxDepth,
    timeLimitMs: condition.timeLimitMs,
    quiescenceDepth: 1,
  });
  const byDepth = new Map(observed.traces.map((trace) => [trace.depth, trace]));
  const d2 = byDepth.get(2);
  const d3 = byDepth.get(3);
  const complete = Boolean(d2 && d3);
  let d2Groups = null;
  let d3Groups = null;
  let changes = null;
  let churn = false;
  if (complete) {
    d2Groups = rankingGroups(d2.values);
    d3Groups = rankingGroups(d3.values);
    changes = preorderChangeCount(d2Groups, d3Groups);
    churn = changes > 0;
  }
  const highWidth = isHighWidth(state.phase, width, spec);
  return {
    attempted: true,
    completedDepth: observed.result.stats.completedDepth,
    timedOut: observed.result.stats.timedOut,
    elapsedMs: observed.result.stats.elapsedMs,
    nodes: observed.result.stats.nodes,
    d2D3Complete: complete,
    d2Groups,
    d3Groups,
    preorderChangeCount: changes,
    trigger: complete && highWidth && churn,
  };
}

function publicSelection(rows, manifest) {
  const eligible = rows.filter((row) => row.fixed.trigger).map((row) => ({
    row,
    rank: sha256(Buffer.from(`${manifest.publicBudgetSubset.salt}|${row.rawDigest}`, "utf8")),
  }));
  const selected = [];
  for (const phase of ["namua", "mtaji"]) {
    selected.push(...eligible.filter((item) => item.row.phase === phase)
      .sort((a, b) => a.rank.localeCompare(b.rank) || a.row.seed - b.row.seed)
      .slice(0, manifest.publicBudgetSubset.maximumPerPhase));
  }
  return selected.sort((a, b) => a.rank.localeCompare(b.rank));
}

function summarize(rows, source, technicalFailures, instrumentationMismatches, spec) {
  const phaseCount = (predicate, phase) => rows.filter((row) => row.phase === phase && predicate(row)).length;
  const total = (predicate) => rows.filter(predicate).length;
  const counts = {
    selectedUniqueTrajectories: rows.length,
    selectedRoots: { namua: phaseCount(() => true, "namua"), mtaji: phaseCount(() => true, "mtaji") },
    d2D3Complete: {
      namua: phaseCount((row) => row.fixed.complete, "namua"),
      mtaji: phaseCount((row) => row.fixed.complete, "mtaji"),
    },
    trigger: {
      total: total((row) => row.fixed.trigger),
      namua: phaseCount((row) => row.fixed.trigger, "namua"),
      mtaji: phaseCount((row) => row.fixed.trigger, "mtaji"),
    },
    probeComplete: {
      total: total((row) => row.probe.complete),
      namua: phaseCount((row) => row.probe.complete, "namua"),
      mtaji: phaseCount((row) => row.probe.complete, "mtaji"),
    },
    controls: {
      highWidthNoChurn: total((row) => row.fixed.controlClass === "high-width/no-churn"),
      lowOrEqualWidthChurn: total((row) => row.fixed.controlClass === "low-or-equal-width/churn"),
      lowOrEqualWidthNoChurn: total((row) => row.fixed.controlClass === "low-or-equal-width/no-churn"),
    },
    publicReachable: {},
    technicalFailures,
    instrumentationSemanticMismatches: instrumentationMismatches,
    source,
  };
  for (const condition of ["standard-hard", "standard-expert"]) {
    counts.publicReachable[condition] = {
      total: total((row) => row.public[condition]?.trigger === true),
      namua: phaseCount((row) => row.public[condition]?.trigger === true, "namua"),
      mtaji: phaseCount((row) => row.public[condition]?.trigger === true, "mtaji"),
      attempted: total((row) => row.public[condition]?.attempted === true),
    };
  }
  const gate = spec.supportGate;
  const checks = {
    selectedUniqueTrajectories: counts.selectedUniqueTrajectories >= gate.selectedUniqueTrajectoriesMinimum,
    selectedRootsNamua: counts.selectedRoots.namua >= gate.selectedRootsPerPhaseMinimum,
    selectedRootsMtaji: counts.selectedRoots.mtaji >= gate.selectedRootsPerPhaseMinimum,
    d2D3CompleteNamua: counts.d2D3Complete.namua >= gate.d2D3CompleteRootsPerPhaseMinimum,
    d2D3CompleteMtaji: counts.d2D3Complete.mtaji >= gate.d2D3CompleteRootsPerPhaseMinimum,
    triggerTotal: counts.trigger.total >= gate.eligibleTriggerRootsMinimum,
    triggerNamua: counts.trigger.namua >= gate.eligibleTriggerRootsPerPhaseMinimum,
    triggerMtaji: counts.trigger.mtaji >= gate.eligibleTriggerRootsPerPhaseMinimum,
    probeCompleteTotal: counts.probeComplete.total >= gate.probeCompleteTriggerRootsMinimum,
    probeCompleteNamua: counts.probeComplete.namua >= gate.probeCompleteTriggerRootsPerPhaseMinimum,
    probeCompleteMtaji: counts.probeComplete.mtaji >= gate.probeCompleteTriggerRootsPerPhaseMinimum,
    highWidthNoChurnControl: counts.controls.highWidthNoChurn >= gate.highWidthNoChurnControlsMinimum,
    lowOrEqualWidthChurnControl: counts.controls.lowOrEqualWidthChurn >= gate.lowOrEqualWidthChurnControlsMinimum,
    lowOrEqualWidthNoChurnControl: counts.controls.lowOrEqualWidthNoChurn >= gate.lowOrEqualWidthNoChurnControlsMinimum,
    publicHardTotal: counts.publicReachable["standard-hard"].total >= gate.publicHardReachableTriggersMinimum,
    publicHardNamua: counts.publicReachable["standard-hard"].namua >= gate.publicHardReachableTriggersPerPhaseMinimum,
    publicHardMtaji: counts.publicReachable["standard-hard"].mtaji >= gate.publicHardReachableTriggersPerPhaseMinimum,
    publicExpertTotal: counts.publicReachable["standard-expert"].total >= gate.publicExpertReachableTriggersMinimum,
    publicExpertNamua: counts.publicReachable["standard-expert"].namua >= gate.publicExpertReachableTriggersPerPhaseMinimum,
    publicExpertMtaji: counts.publicReachable["standard-expert"].mtaji >= gate.publicExpertReachableTriggersPerPhaseMinimum,
    technicalFailures: counts.technicalFailures <= gate.technicalFailureMaximum,
    instrumentationSemanticMismatches: counts.instrumentationSemanticMismatches
      <= gate.instrumentationSemanticMismatchMaximum,
  };
  return { counts, checks, allExceptIndependentPass: Object.values(checks).every(Boolean) };
}

function compactRow(row) {
  const publicCompact = {};
  for (const [id, value] of Object.entries(row.public)) {
    publicCompact[id] = value ? {
      attempted: value.attempted,
      completedDepth: value.completedDepth,
      timedOut: value.timedOut,
      elapsedMs: value.elapsedMs,
      nodes: value.nodes,
      d2D3Complete: value.d2D3Complete,
      preorderChangeCount: value.preorderChangeCount,
      trigger: value.trigger,
    } : { attempted: false };
  }
  return {
    seed: row.seed,
    phase: row.phase,
    trajectoryDigest: row.trajectoryDigest,
    rootPly: row.rootPly,
    rawDigest: row.rawDigest,
    rootLegalWidth: row.rootLegalWidth,
    fixed: {
      complete: row.fixed.complete,
      completedDepth: row.fixed.completedDepth,
      completedDepths: row.fixed.completedDepths || [],
      baselineNodes: row.fixed.baselineNodes,
      preorderChangeCount: row.fixed.preorderChangeCount ?? null,
      churn: row.fixed.churn || false,
      highWidth: row.fixed.highWidth || false,
      trigger: row.fixed.trigger || false,
      controlClass: row.fixed.controlClass || null,
      top3Digest: row.fixed.top3 ? sha256(Buffer.from(JSON.stringify(row.fixed.top3), "utf8")) : null,
      featureOffMoveMatch: row.fixed.moveMatch,
      featureOffRootScoreMatch: row.fixed.rootScoreMatch,
      featureOffStatsMatch: row.fixed.statsMatch,
    },
    probe: row.probe,
    public: publicCompact,
  };
}

function parseOutputDir(argv) {
  const index = argv.indexOf("--output-dir");
  return index < 0 ? DEFAULT_OUTPUT_DIR : path.resolve(argv[index + 1]);
}

function validateInputs(spec, manifest) {
  ensure(spec.specId === manifest.supportSpecId, "support spec identity mismatch");
  ensure(spec.candidateVersion === manifest.candidateVersion, "candidate identity mismatch");
  ensure(spec.baselineId === manifest.baselineId, "baseline identity mismatch");
  ensure(spec.status === "FROZEN-EXECUTION-NOT-AUTHORIZED", "frozen support spec changed");
  ensure(manifest.status === "FROZEN-BEFORE-SUPPORT-OUTCOME", "run manifest not frozen");
  ensure(manifest.executionAuthorized === true, "P3-D execution not authorized");
  ensure(manifest.candidateCodeAllowed === false && manifest.candidateBenefitMetricsAllowed === false,
    "candidate or benefit work leaked into support manifest");
  ensure(spec.authorization.candidateImplementationAuthorizedNow === false,
    "candidate implementation unexpectedly authorized");
  for (const [relative, expected] of Object.entries(manifest.sourceBindings)) {
    ensure(fileSha256(relative) === expected, `source binding mismatch: ${relative}`);
  }
  ensure(spec.sourcePopulation.seedEnd - spec.sourcePopulation.seedStart + 1
    === spec.sourcePopulation.maximumTrajectories, "support seed range size mismatch");
}

function main(argv = process.argv.slice(2)) {
  const specText = fs.readFileSync(SPEC_PATH, "utf8");
  const manifestText = fs.readFileSync(MANIFEST_PATH, "utf8");
  const spec = JSON.parse(specText);
  const manifest = JSON.parse(manifestText);
  validateInputs(spec, manifest);
  ensure(git("status", "--porcelain") === "", "execution requires a clean pre-generation worktree");
  const executionCommit = git("rev-parse", "HEAD");
  const outputDir = parseOutputDir(argv);
  fs.mkdirSync(outputDir, { recursive: true });
  const sourceSha256 = Object.fromEntries(Object.keys(manifest.sourceBindings)
    .map((relative) => [relative, fileSha256(relative)]));
  const environment = {
    schemaVersion: 1,
    manifestId: manifest.manifestId,
    executionCommit,
    branch: git("rev-parse", "--abbrev-ref", "HEAD"),
    node: process.version,
    platform: process.platform,
    release: os.release(),
    arch: process.arch,
    cpuModel: os.cpus()[0]?.model || null,
    logicalCpuCount: os.cpus().length,
    totalMemoryBytes: os.totalmem(),
    sourceSha256,
  };
  const environmentText = `${JSON.stringify(environment, null, 2)}\n`;
  fs.writeFileSync(path.join(outputDir, manifest.artifacts.environment), environmentText);

  const assignments = phaseAssignments(spec, manifest);
  const generated = [];
  for (let seed = spec.sourcePopulation.seedStart; seed <= spec.sourcePopulation.seedEnd; seed += 1) {
    generated.push(generateTrajectoryRoot(spec, manifest, seed, assignments.get(seed)));
  }
  const selected = selectUniqueRoots(generated);
  const instrumented = instrumentedAi();
  const rows = [];
  let technicalFailures = 0;
  let instrumentationMismatches = 0;
  for (const item of selected.rows) {
    let fixed;
    let fixedFailureCounted = false;
    try {
      fixed = fixedMeasurement(instrumented, item.root.state, spec);
    } catch (error) {
      technicalFailures += 1;
      fixedFailureCounted = true;
      fixed = {
        complete: false,
        completedDepth: 0,
        baselineNodes: 0,
        moveMatch: false,
        rootScoreMatch: false,
        statsMatch: false,
        error: String(error && error.message ? error.message : error),
      };
    }
    if (!fixed.complete && !fixedFailureCounted) technicalFailures += 1;
    if (!(fixed.moveMatch && fixed.rootScoreMatch && fixed.statsMatch)) instrumentationMismatches += 1;
    const width = E.moveVariants(item.root.state).length;
    const highWidth = fixed.complete && isHighWidth(item.root.phase, width, spec);
    const trigger = fixed.complete && highWidth && fixed.churn;
    fixed.highWidth = highWidth;
    fixed.trigger = trigger;
    fixed.controlClass = fixed.complete ? controlClass(highWidth, fixed.churn) : null;
    let probe = {
      reserve: fixed.complete ? Math.min(Math.floor(fixed.baselineNodes * 0.5), 32768) : 0,
      nodes: 0,
      complete: false,
      reserveExhausted: false,
      technicalError: null,
    };
    if (trigger) {
      probe = boundedProbe(item.root.state, fixed.top3, fixed.baselineNodes);
      if (probe.technicalError) technicalFailures += 1;
    }
    rows.push({
      seed: item.seed,
      phase: item.root.phase,
      trajectoryDigest: item.trajectoryDigest,
      rootPly: item.root.ply,
      rawDigest: item.root.rawDigest,
      rootLegalWidth: width,
      fixed,
      probe,
      public: {},
      _state: item.root.state,
    });
  }

  const selectedPublic = publicSelection(rows, manifest);
  const publicIds = manifest.publicBudgetSubset.conditions.map((condition) => condition.id);
  for (const row of rows) for (const id of publicIds) row.public[id] = null;
  for (const condition of manifest.publicBudgetSubset.conditions) {
    for (const item of selectedPublic.slice().sort((a, b) => a.rank.localeCompare(b.rank))) {
      try {
        item.row.public[condition.id] = publicMeasurement(
          instrumented, item.row._state, condition, item.row.rootLegalWidth, spec,
        );
      } catch (error) {
        technicalFailures += 1;
        item.row.public[condition.id] = {
          attempted: true,
          completedDepth: 0,
          timedOut: null,
          elapsedMs: null,
          nodes: 0,
          d2D3Complete: false,
          d2Groups: null,
          d3Groups: null,
          preorderChangeCount: null,
          trigger: false,
          technicalError: String(error && error.message ? error.message : error),
        };
      }
    }
  }

  const sourceSummary = {
    frozenSeeds: spec.sourcePopulation.maximumTrajectories,
    phaseAssigned: {
      namua: [...assignments.values()].filter((phase) => phase === "namua").length,
      mtaji: [...assignments.values()].filter((phase) => phase === "mtaji").length,
    },
    uniqueTrajectories: selected.uniqueTrajectories,
    duplicateTrajectories: selected.duplicateTrajectories,
    trajectoriesWithAssignedPhaseRoot: selected.trajectoriesWithAssignedPhaseRoot,
    unavailableAssignedPhaseRoots: selected.unavailableAssignedPhaseRoots,
    duplicateRawRoots: selected.duplicateRawRoots,
  };
  const summary = summarize(rows, sourceSummary, technicalFailures, instrumentationMismatches, spec);
  const fullRows = rows.map((row) => {
    const copy = { ...row };
    delete copy._state;
    return copy;
  });
  const fullTraceText = `${fullRows.map((row) => JSON.stringify(row)).join("\n")}\n`;
  const fullTracePath = path.join(outputDir, manifest.artifacts.fullTrace);
  fs.writeFileSync(fullTracePath, fullTraceText);
  const compactRows = rows.map(compactRow);
  const deterministicCore = {
    source: sourceSummary,
    counts: summary.counts,
    checks: summary.checks,
    rows: compactRows,
  };
  const result = {
    schemaVersion: 1,
    program: spec.program,
    stage: spec.stage,
    candidateVersion: spec.candidateVersion,
    supportSpecId: spec.specId,
    supportSpecSha256: sha256(Buffer.from(specText, "utf8")),
    runManifestId: manifest.manifestId,
    runManifestSha256: sha256(Buffer.from(manifestText, "utf8")),
    baselineId: spec.baselineId,
    executionCommit,
    sourceSha256,
    instrumentedSourceTransform: "passive-root-return-trace/v1",
    instrumentedSourceSha256: instrumented.transformedSourceSha256,
    candidateCodeUsed: false,
    candidateMoveSelectionPerformed: false,
    candidateBenefitMetricsObserved: false,
    d5ReferenceAccessed: false,
    gameOutcomeMetricObserved: false,
    developmentSeedsAccessed: false,
    validationSeedsAccessed: false,
    releaseHoldoutSeedsAccessed: false,
    researchGeneration4ScientificEvidenceAccessed: false,
    fullTrace: {
      path: path.relative(ROOT, fullTracePath),
      rows: fullRows.length,
      sha256: sha256(Buffer.from(fullTraceText, "utf8")),
      numericRootScoresPersisted: false,
    },
    environment: {
      path: path.relative(ROOT, path.join(outputDir, manifest.artifacts.environment)),
      sha256: sha256(Buffer.from(environmentText, "utf8")),
    },
    deterministicCore,
    deterministicCoreSha256: sha256(Buffer.from(JSON.stringify(deterministicCore), "utf8")),
    decision: {
      productionChecksPass: summary.allExceptIndependentPass,
      independentVerificationPending: true,
      supportPass: false,
      disposition: "PRODUCTION-COMPLETE / INDEPENDENT-VERIFICATION-PENDING",
      candidateImplementationAuthorized: false,
      developmentBenchmarkAuthorized: false,
      validationAuthorized: false,
      releaseHoldoutAuthorized: false,
      publicDeploymentAuthorized: false,
    },
  };
  const resultPath = path.join(outputDir, manifest.artifacts.compactResult);
  fs.writeFileSync(resultPath, `${JSON.stringify(result, null, 2)}\n`);
  console.log(JSON.stringify({
    executionCommit,
    fullTraceSha256: result.fullTrace.sha256,
    deterministicCoreSha256: result.deterministicCoreSha256,
    counts: summary.counts,
    checks: summary.checks,
    decision: result.decision,
  }, null, 2));
}

if (require.main === module) main();

module.exports = {
  boundedProbe,
  controlClass,
  fixedMeasurement,
  instrumentedAi,
  phaseAssignments,
  preorderChangeCount,
  rankingGroups,
  topThree,
};
