"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const E = require("../../public/engine.js");
const AI = require("../../public/ai.js");

const ROOT = path.resolve(__dirname, "../..");
const PROGRAM = "doc/ai-engineering/public-ai-improvement-program-3";
const SPEC_PATH = path.join(ROOT, PROGRAM, "candidates/PBAI-C010-v1-predevelopment-support-spec.json");
const MANIFEST_PATH = path.join(ROOT, PROGRAM, "candidates/PBAI-C010-v1-predevelopment-support-run-manifest.json");
const DEFAULT_OUTPUT_DIR = path.join(ROOT, "artifacts/pbai-p3/c010/predevelopment-support");
const WIN_SCORE = 1_000_000;

class IndependentReserveStop extends Error {
  constructor() {
    super("independent support probe reserve exhausted");
    this.name = "IndependentReserveStop";
  }
}

function assert(value, message) {
  if (!value) throw new Error(message);
}

function digest(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function sourceHash(relative) {
  return digest(fs.readFileSync(path.join(ROOT, relative)));
}

function copy(value) {
  return JSON.parse(JSON.stringify(value));
}

function independentMoveKey(move) {
  if (!move) return "";
  return [
    move.type,
    move.phase,
    move.row,
    move.index,
    move.direction,
    move.side,
    move.houseChoice,
    Boolean(move.houseTwo),
  ].join(":");
}

function randomStream(seed) {
  let state = seed >>> 0;
  return function next() {
    state += 0x6D2B79F5;
    let mixed = state;
    mixed = Math.imul(mixed ^ (mixed >>> 15), mixed | 1);
    mixed ^= mixed + Math.imul(mixed ^ (mixed >>> 7), mixed | 61);
    return ((mixed ^ (mixed >>> 14)) >>> 0) / 4294967296;
  };
}

function authoritativeState(state) {
  return {
    pits: copy(state.pits),
    reserve: copy(state.reserve),
    houseOwned: copy(state.houseOwned),
    player: state.player,
    phase: state.phase,
    winner: state.winner,
    pending: copy(state.pending),
  };
}

function authoritativeHash(state) {
  assert(Array.isArray(state.pending) && state.pending.length === 2, "independent pending check failed");
  return digest(Buffer.from(JSON.stringify(authoritativeState(state)), "utf8"));
}

function legalInCanonicalOrder(state) {
  return E.moveVariants(state).slice().sort((left, right) => {
    return independentMoveKey(left).localeCompare(independentMoveKey(right));
  });
}

function independentlyAssignPhases(spec, manifest) {
  const ranked = Array.from(
    { length: spec.sourcePopulation.seedEnd - spec.sourcePopulation.seedStart + 1 },
    (_, offset) => spec.sourcePopulation.seedStart + offset,
  ).map((seed) => ({
    seed,
    key: digest(Buffer.from([manifest.phaseAssignment.salt, seed].join("|"), "utf8")),
  }));
  ranked.sort((left, right) => left.key === right.key
    ? left.seed - right.seed : left.key < right.key ? -1 : 1);
  const result = new Map();
  ranked.forEach((item, index) => result.set(
    item.seed,
    index < manifest.phaseAssignment.assignedCounts.namua ? "namua" : "mtaji",
  ));
  return result;
}

function independentlyGenerate(seed, phase, spec, manifest) {
  const random = randomStream(seed);
  let position = E.initialState();
  let chosen = null;
  const stateHashes = [];
  for (let ply = 0; ply <= spec.sourcePopulation.maximumPliesPerTrajectory; ply += 1) {
    const rawHash = authoritativeHash(position);
    stateHashes.push(rawHash);
    const moves = position.winner === null ? legalInCanonicalOrder(position) : [];
    if (position.winner === null && position.phase === phase
      && moves.length >= spec.sourcePopulation.minimumLegalMoveCount) {
      const rank = digest(Buffer.from(
        [manifest.rootSelection.salt, seed, ply, rawHash].join("|"), "utf8",
      ));
      if (chosen === null || rank < chosen.rank || (rank === chosen.rank && ply < chosen.ply)) {
        chosen = { seed, phase, ply, rawHash, rank, state: copy(position) };
      }
    }
    if (position.winner !== null || ply === spec.sourcePopulation.maximumPliesPerTrajectory) break;
    assert(moves.length > 0, `nonterminal trajectory has no move seed=${seed} ply=${ply}`);
    position = E.applyMove(position, moves[Math.floor(random() * moves.length)]).state;
  }
  return {
    seed,
    phase,
    trajectoryHash: digest(Buffer.from(JSON.stringify(stateHashes), "utf8")),
    root: chosen,
  };
}

function independentlySelectRoots(all) {
  const byTrajectory = new Map();
  let trajectoryDuplicates = 0;
  for (const item of all.sort((a, b) => a.seed - b.seed)) {
    if (byTrajectory.has(item.trajectoryHash)) trajectoryDuplicates += 1;
    else byTrajectory.set(item.trajectoryHash, item);
  }
  const available = [...byTrajectory.values()].filter(({ root }) => root !== null);
  const byRaw = new Map();
  let rawDuplicates = 0;
  for (const item of available) {
    const existing = byRaw.get(item.root.rawHash);
    if (!existing) byRaw.set(item.root.rawHash, item);
    else {
      rawDuplicates += 1;
      const replacement = item.root.rank < existing.root.rank
        || (item.root.rank === existing.root.rank && item.seed < existing.seed);
      if (replacement) byRaw.set(item.root.rawHash, item);
    }
  }
  return {
    roots: [...byRaw.values()].sort((a, b) => a.seed - b.seed),
    source: {
      uniqueTrajectories: byTrajectory.size,
      duplicateTrajectories: trajectoryDuplicates,
      trajectoriesWithAssignedPhaseRoot: available.length,
      unavailableAssignedPhaseRoots: byTrajectory.size - available.length,
      duplicateRawRoots: rawDuplicates,
    },
  };
}

function validateGroups(groups, width) {
  assert(Array.isArray(groups) && groups.length > 0, "ranking groups missing");
  const keys = groups.flat();
  assert(keys.length === width, "ranking width mismatch");
  assert(new Set(keys).size === keys.length, "ranking move keys are not unique");
  for (const group of groups) {
    const sorted = group.slice().sort();
    assert(JSON.stringify(group) === JSON.stringify(sorted), "tie group key order mismatch");
  }
  return keys.slice().sort();
}

function independentChangeCount(before, after, width) {
  const keys = validateGroups(before, width);
  assert(JSON.stringify(keys) === JSON.stringify(validateGroups(after, width)), "ranking move set changed");
  const locate = (groups) => {
    const location = Object.create(null);
    for (let group = 0; group < groups.length; group += 1) {
      for (const key of groups[group]) location[key] = group;
    }
    return location;
  };
  const earlier = locate(before);
  const later = locate(after);
  let changed = 0;
  for (let i = 0; i < keys.length; i += 1) {
    for (let j = i + 1; j < keys.length; j += 1) {
      const oldRelation = earlier[keys[i]] === earlier[keys[j]]
        ? 0 : earlier[keys[i]] < earlier[keys[j]] ? 1 : -1;
      const newRelation = later[keys[i]] === later[keys[j]]
        ? 0 : later[keys[i]] < later[keys[j]] ? 1 : -1;
      if (oldRelation !== newRelation) changed += 1;
    }
  }
  return changed;
}

function independentlyTopThree(groups) {
  const selected = [];
  for (const group of groups) {
    for (const key of group.slice().sort()) {
      if (selected.length < 3) selected.push(key);
    }
    if (selected.length === 3) break;
  }
  return selected;
}

function independentHigh(phase, width, spec) {
  if (phase === "namua") return width > spec.trigger.rootLegalWidth.NamuaStrictlyGreaterThan;
  assert(phase === "mtaji", `unknown phase ${phase}`);
  return width > spec.trigger.rootLegalWidth.MtajiStrictlyGreaterThan;
}

function independentControl(high, churn) {
  if (high) return churn ? "trigger" : "high-width/no-churn";
  return churn ? "low-or-equal-width/churn" : "low-or-equal-width/no-churn";
}

function takeNode(counter) {
  if (counter.used === counter.limit) throw new IndependentReserveStop();
  counter.used += 1;
}

function terminalValue(state, player, ply) {
  if (state.winner === null) return null;
  return state.winner === player ? WIN_SCORE - ply : -WIN_SCORE + ply;
}

function quietValue(state, bounds, player, ply, left, counter) {
  takeNode(counter);
  const terminal = terminalValue(state, player, ply);
  if (terminal !== null) return terminal;
  const captures = E.moveVariants(state).filter(({ type }) => type === "capture");
  if (left === 0 || captures.length === 0) return AI.evaluateWithProfile(state, player, "bao");
  const maximize = state.player === player;
  let best = maximize ? -Infinity : Infinity;
  for (const move of captures) {
    const score = quietValue(
      E.applyMove(state, move).state, bounds, player, ply + 1, left - 1, counter,
    );
    if (maximize) {
      if (score > best) best = score;
      if (best > bounds.alpha) bounds.alpha = best;
    } else {
      if (score < best) best = score;
      if (best < bounds.beta) bounds.beta = best;
    }
    if (bounds.beta <= bounds.alpha) break;
  }
  return best;
}

function independentSearch(state, depth, alpha, beta, player, ply, counter) {
  takeNode(counter);
  const terminal = terminalValue(state, player, ply);
  if (terminal !== null) return terminal;
  if (depth === 0) return quietValue(state, { alpha, beta }, player, ply, 1, counter);
  const moves = E.moveVariants(state);
  if (moves.length === 0) return state.player === player ? -WIN_SCORE + ply : WIN_SCORE - ply;
  const maximize = state.player === player;
  let value = maximize ? -Infinity : Infinity;
  for (const move of moves) {
    const child = independentSearch(E.applyMove(state, move).state, depth - 1, alpha, beta, player, ply + 1, counter);
    if (maximize) {
      value = Math.max(value, child);
      alpha = Math.max(alpha, value);
    } else {
      value = Math.min(value, child);
      beta = Math.min(beta, value);
    }
    if (beta <= alpha) break;
  }
  return value;
}

function independentlyProbe(state, keys, baselineNodes) {
  const limit = Math.min(Math.floor(baselineNodes / 2), 32768);
  const counter = { limit, used: 0 };
  let complete = false;
  let reserveExhausted = false;
  let technicalError = null;
  try {
    assert(keys.length === 3, "independent top3 size is not three");
    const legal = new Map(E.moveVariants(state).map((move) => [independentMoveKey(move), move]));
    for (const key of keys) {
      assert(legal.has(key), `independent probe key is not legal: ${key}`);
      independentSearch(E.applyMove(state, legal.get(key)).state, 3, -Infinity, Infinity, state.player, 1, counter);
    }
    complete = true;
  } catch (error) {
    if (error instanceof IndependentReserveStop) reserveExhausted = true;
    else technicalError = String(error && error.message ? error.message : error);
  }
  return { reserve: limit, nodes: counter.used, complete, reserveExhausted, technicalError };
}

function expectedPublicSelection(reconstructedRows, manifest) {
  const ranked = reconstructedRows.filter((row) => row.trigger).map((row) => ({
    seed: row.seed,
    phase: row.phase,
    rank: digest(Buffer.from([manifest.publicBudgetSubset.salt, row.rawDigest].join("|"), "utf8")),
  }));
  const selected = new Set();
  for (const phase of ["namua", "mtaji"]) {
    ranked.filter((row) => row.phase === phase)
      .sort((a, b) => a.rank === b.rank ? a.seed - b.seed : a.rank < b.rank ? -1 : 1)
      .slice(0, manifest.publicBudgetSubset.maximumPerPhase)
      .forEach((row) => selected.add(row.seed));
  }
  return selected;
}

function independentSummary(rows, source, technicalFailures, instrumentationMismatches, spec) {
  const count = (predicate) => rows.reduce((total, row) => total + (predicate(row) ? 1 : 0), 0);
  const phaseCount = (phase, predicate) => count((row) => row.phase === phase && predicate(row));
  const counts = {
    selectedUniqueTrajectories: rows.length,
    selectedRoots: { namua: phaseCount("namua", () => true), mtaji: phaseCount("mtaji", () => true) },
    d2D3Complete: {
      namua: phaseCount("namua", (row) => row.fixedComplete),
      mtaji: phaseCount("mtaji", (row) => row.fixedComplete),
    },
    trigger: {
      total: count((row) => row.trigger),
      namua: phaseCount("namua", (row) => row.trigger),
      mtaji: phaseCount("mtaji", (row) => row.trigger),
    },
    probeComplete: {
      total: count((row) => row.probe.complete),
      namua: phaseCount("namua", (row) => row.probe.complete),
      mtaji: phaseCount("mtaji", (row) => row.probe.complete),
    },
    controls: {
      highWidthNoChurn: count((row) => row.control === "high-width/no-churn"),
      lowOrEqualWidthChurn: count((row) => row.control === "low-or-equal-width/churn"),
      lowOrEqualWidthNoChurn: count((row) => row.control === "low-or-equal-width/no-churn"),
    },
    publicReachable: {},
    technicalFailures,
    instrumentationSemanticMismatches: instrumentationMismatches,
    source,
  };
  for (const id of ["standard-hard", "standard-expert"]) {
    counts.publicReachable[id] = {
      total: count((row) => row.public[id]?.trigger === true),
      namua: phaseCount("namua", (row) => row.public[id]?.trigger === true),
      mtaji: phaseCount("mtaji", (row) => row.public[id]?.trigger === true),
      attempted: count((row) => row.public[id]?.attempted === true),
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
    technicalFailures: technicalFailures <= gate.technicalFailureMaximum,
    instrumentationSemanticMismatches: instrumentationMismatches <= gate.instrumentationSemanticMismatchMaximum,
  };
  return { counts, checks };
}

function parseDir(argv) {
  const index = argv.indexOf("--output-dir");
  return index < 0 ? DEFAULT_OUTPUT_DIR : path.resolve(argv[index + 1]);
}

function main(argv = process.argv.slice(2)) {
  const outputDir = parseDir(argv);
  const specText = fs.readFileSync(SPEC_PATH, "utf8");
  const manifestText = fs.readFileSync(MANIFEST_PATH, "utf8");
  const spec = JSON.parse(specText);
  const manifest = JSON.parse(manifestText);
  const resultPath = path.join(outputDir, manifest.artifacts.compactResult);
  const fullPath = path.join(outputDir, manifest.artifacts.fullTrace);
  const resultText = fs.readFileSync(resultPath, "utf8");
  const fullText = fs.readFileSync(fullPath, "utf8");
  const production = JSON.parse(resultText);
  const fullRows = fullText.trim().split(/\r?\n/).filter(Boolean).map((line) => JSON.parse(line));

  assert(production.supportSpecSha256 === digest(Buffer.from(specText, "utf8")), "support spec hash mismatch");
  assert(production.runManifestSha256 === digest(Buffer.from(manifestText, "utf8")), "run manifest hash mismatch");
  assert(production.fullTrace.sha256 === digest(Buffer.from(fullText, "utf8")), "full trace hash mismatch");
  assert(production.candidateCodeUsed === false && production.candidateMoveSelectionPerformed === false,
    "candidate code or move selection leaked into support result");
  assert(production.candidateBenefitMetricsObserved === false && production.d5ReferenceAccessed === false,
    "benefit evidence leaked into support result");
  for (const [relative, expected] of Object.entries(manifest.sourceBindings)) {
    assert(sourceHash(relative) === expected, `independent source hash mismatch: ${relative}`);
    assert(production.sourceSha256[relative] === expected, `production source hash mismatch: ${relative}`);
  }

  const phaseMap = independentlyAssignPhases(spec, manifest);
  const all = [];
  for (let seed = spec.sourcePopulation.seedStart; seed <= spec.sourcePopulation.seedEnd; seed += 1) {
    all.push(independentlyGenerate(seed, phaseMap.get(seed), spec, manifest));
  }
  const selected = independentlySelectRoots(all);
  const stateBySeed = new Map(selected.roots.map((item) => [item.seed, item]));
  const fullBySeed = new Map(fullRows.map((row) => [row.seed, row]));
  const compactBySeed = new Map(production.deterministicCore.rows.map((row) => [row.seed, row]));
  let rowClassificationMismatches = 0;
  let sourceIdentityMismatches = 0;
  let probeMismatches = 0;
  const reconstructedRows = [];

  if (stateBySeed.size !== fullBySeed.size || stateBySeed.size !== compactBySeed.size) sourceIdentityMismatches += 1;
  for (const item of selected.roots) {
    const full = fullBySeed.get(item.seed);
    const compact = compactBySeed.get(item.seed);
    if (!full || !compact) {
      sourceIdentityMismatches += 1;
      continue;
    }
    const identityMatches = full.phase === item.root.phase
      && full.trajectoryDigest === item.trajectoryHash
      && full.rootPly === item.root.ply
      && full.rawDigest === item.root.rawHash
      && full.rawDigest === authoritativeHash(item.root.state)
      && full.rootLegalWidth === E.moveVariants(item.root.state).length;
    if (!identityMatches) sourceIdentityMismatches += 1;
    let changes = null;
    let churn = false;
    let high = false;
    let trigger = false;
    let control = null;
    let top3 = [];
    try {
      if (full.fixed.complete) {
        changes = independentChangeCount(full.fixed.d2Groups, full.fixed.d3Groups, full.rootLegalWidth);
        churn = changes > 0;
        high = independentHigh(full.phase, full.rootLegalWidth, spec);
        trigger = high && churn;
        control = independentControl(high, churn);
        top3 = independentlyTopThree(full.fixed.d3Groups);
      }
    } catch {
      rowClassificationMismatches += 1;
    }
    const top3Hash = top3.length ? digest(Buffer.from(JSON.stringify(top3), "utf8")) : null;
    const classificationMatches = compact.fixed.preorderChangeCount === changes
      && compact.fixed.churn === churn
      && compact.fixed.highWidth === high
      && compact.fixed.trigger === trigger
      && compact.fixed.controlClass === control
      && compact.fixed.top3Digest === top3Hash
      && full.fixed.preorderChangeCount === changes
      && full.fixed.churn === churn
      && full.fixed.highWidth === high
      && full.fixed.trigger === trigger
      && full.fixed.controlClass === control
      && JSON.stringify(full.fixed.top3 || []) === JSON.stringify(top3);
    if (!classificationMatches) rowClassificationMismatches += 1;

    let probe = { reserve: compact.probe.reserve, nodes: compact.probe.nodes, complete: false,
      reserveExhausted: compact.probe.reserveExhausted, technicalError: compact.probe.technicalError };
    if (trigger) {
      probe = independentlyProbe(item.root.state, top3, compact.fixed.baselineNodes);
      if (JSON.stringify(probe) !== JSON.stringify(compact.probe)
        || JSON.stringify(probe) !== JSON.stringify(full.probe)) probeMismatches += 1;
    } else if (compact.probe.complete || compact.probe.nodes !== 0) probeMismatches += 1;

    const publicReconstructed = {};
    for (const id of ["standard-hard", "standard-expert"]) {
      const observed = full.public[id];
      if (!observed) {
        publicReconstructed[id] = { attempted: false };
        continue;
      }
      let publicChanges = null;
      let publicTrigger = false;
      if (observed.d2D3Complete) {
        publicChanges = independentChangeCount(
          observed.d2Groups, observed.d3Groups, full.rootLegalWidth,
        );
        publicTrigger = high && publicChanges > 0;
      }
      publicReconstructed[id] = {
        attempted: true,
        trigger: publicTrigger,
        preorderChangeCount: publicChanges,
      };
      if (compact.public[id].attempted !== true
        || compact.public[id].trigger !== publicTrigger
        || compact.public[id].preorderChangeCount !== publicChanges) rowClassificationMismatches += 1;
    }
    reconstructedRows.push({
      seed: item.seed,
      phase: item.root.phase,
      rawDigest: item.root.rawHash,
      fixedComplete: full.fixed.complete,
      trigger,
      control,
      probe,
      public: publicReconstructed,
    });
  }

  const expectedPublic = expectedPublicSelection(reconstructedRows, manifest);
  for (const row of reconstructedRows) {
    for (const id of ["standard-hard", "standard-expert"]) {
      if (Boolean(row.public[id]?.attempted) !== expectedPublic.has(row.seed)) rowClassificationMismatches += 1;
    }
  }

  const technicalFailures = fullRows.filter((row) => !row.fixed.complete).length
    + fullRows.filter((row) => row.probe.technicalError !== null).length
    + fullRows.reduce((total, row) => total + Object.values(row.public)
      .filter((entry) => entry?.technicalError).length, 0);
  const instrumentationMismatches = fullRows.filter((row) => !(row.fixed.moveMatch
    && row.fixed.rootScoreMatch && row.fixed.statsMatch)).length;
  const source = {
    frozenSeeds: spec.sourcePopulation.maximumTrajectories,
    phaseAssigned: {
      namua: [...phaseMap.values()].filter((phase) => phase === "namua").length,
      mtaji: [...phaseMap.values()].filter((phase) => phase === "mtaji").length,
    },
    ...selected.source,
  };
  const independent = independentSummary(
    reconstructedRows, source, technicalFailures, instrumentationMismatches, spec,
  );
  const aggregateMatches = JSON.stringify(independent.counts) === JSON.stringify(production.deterministicCore.counts)
    && JSON.stringify(independent.checks) === JSON.stringify(production.deterministicCore.checks);
  const independentMismatchCount = rowClassificationMismatches + sourceIdentityMismatches + probeMismatches;
  const verifierPassed = aggregateMatches && independentMismatchCount === 0;
  const allGateChecksPass = Object.values(independent.checks).every(Boolean)
    && independentMismatchCount <= spec.supportGate.productionIndependentRowClassificationMismatchMaximum;
  const supportPass = verifierPassed && allGateChecksPass;
  let disposition;
  if (!verifierPassed) disposition = spec.failureSemantics.technicalOrVerifierFailure;
  else if (!supportPass) disposition = spec.failureSemantics.supportGateFailure;
  else disposition = spec.failureSemantics.supportPass;
  const verification = {
    schemaVersion: 1,
    program: spec.program,
    stage: spec.stage,
    candidateVersion: spec.candidateVersion,
    supportSpecId: spec.specId,
    supportSpecSha256: digest(Buffer.from(specText, "utf8")),
    runManifestId: manifest.manifestId,
    runManifestSha256: digest(Buffer.from(manifestText, "utf8")),
    productionResult: {
      path: path.relative(ROOT, resultPath),
      sha256: digest(Buffer.from(resultText, "utf8")),
    },
    fullTrace: {
      path: path.relative(ROOT, fullPath),
      sha256: digest(Buffer.from(fullText, "utf8")),
      hashMatchesProduction: production.fullTrace.sha256 === digest(Buffer.from(fullText, "utf8")),
    },
    productionRunnerImported: false,
    productionTriggerImplementationImported: false,
    productionTop3ImplementationImported: false,
    productionProbeImplementationImported: false,
    sourceRootSelectionReconstructed: true,
    rootRankingPreorderReconstructedFromScoreFreeTieGroups: true,
    numericRootScoresRead: false,
    candidateBenefitMetricsRead: false,
    sourceIdentityMismatches,
    rowClassificationMismatches,
    probeMismatches,
    productionIndependentRowClassificationMismatches: independentMismatchCount,
    aggregateMatchesProduction: aggregateMatches,
    counts: independent.counts,
    checks: {
      ...independent.checks,
      independentReconstruction: independentMismatchCount
        <= spec.supportGate.productionIndependentRowClassificationMismatchMaximum,
    },
    verificationPassed: verifierPassed,
    supportPass,
    disposition,
    candidateImplementationAuthorized: false,
    developmentBenchmarkAuthorized: false,
    validationAuthorized: false,
    releaseHoldoutAuthorized: false,
    publicDeploymentAuthorized: false,
  };
  const outputPath = path.join(outputDir, manifest.artifacts.independentVerification);
  fs.writeFileSync(outputPath, `${JSON.stringify(verification, null, 2)}\n`);
  console.log(JSON.stringify(verification, null, 2));
  if (!verifierPassed) process.exitCode = 1;
}

if (require.main === module) main();

module.exports = {
  independentChangeCount,
  independentControl,
  independentlyProbe,
  independentlyTopThree,
};
