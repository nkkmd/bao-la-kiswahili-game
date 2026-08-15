#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const E = require("../../public/engine.js");
const AI = require("../../public/ai.js");
const { hashValue } = require("./lib/position-typology-features.js");
const TM = require("./lib/tactical-motif-features.js");
const Formal = require("./lib/tactical-motif-stage2-formal.js");
const C = require("./lib/tactical-motif-stage2-corpus.js");
const Evaluator = require("./evaluate-tactical-motif-stage2-formal.js");

function parseArgs(argv) {
  const options = { phase: "status", output: C.DEFAULT_OUTPUT, force: false };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === "--force") {
      options.force = true;
      continue;
    }
    const value = argv[++i];
    if (value === undefined) throw new Error(`Missing value for ${argv[i - 1]}`);
    if (argv[i - 1] === "--phase") options.phase = value;
    else if (argv[i - 1] === "--output") options.output = path.resolve(value);
    else throw new Error(`Unknown argument: ${argv[i - 1]}`);
  }
  if (!["status", "generate", "select", "measure", "evaluate"].includes(options.phase)) {
    throw new Error(`Invalid phase: ${options.phase}`);
  }
  return options;
}

function median(values) {
  if (!values.length) return null;
  const sorted = values.slice().sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
}

function traceCandidate(trace, depth, moveKey) {
  const result = trace.results.find((row) => row.depth === depth);
  const candidate = result?.candidates.find((row) => row.moveKey === moveKey);
  if (!candidate) throw new Error(`Missing exact-root move ${moveKey} at D${depth}`);
  return candidate;
}

function status(output, spec, specSha256, candidates, candidateSha256) {
  const gamesDir = path.join(output, "games");
  const measurementsDir = path.join(output, "measurements");
  const measurementFilesByCandidate = {};
  for (const candidate of candidates.formalCandidates) {
    const dir = path.join(measurementsDir, candidate.candidateId);
    measurementFilesByCandidate[candidate.candidateId] = fs.existsSync(dir)
      ? fs.readdirSync(dir).filter((file) => /^selected-\d+\.json$/.test(file)).length
      : 0;
  }
  return {
    stageId: spec.stageId,
    specSha256,
    candidateDefinitionSha256: candidateSha256,
    output,
    authorizationFilePresent: fs.existsSync(C.AUTH_PATH),
    sourceFileSha256: C.sourceFileSha256(),
    generatedGames: fs.existsSync(gamesDir)
      ? fs.readdirSync(gamesDir).filter((file) => /^game-\d+\.json$/.test(file)).length
      : 0,
    expectedGames: spec.population.games,
    hasManifest: fs.existsSync(path.join(output, "manifest.json")),
    hasVerification: fs.existsSync(path.join(output, "verification.json")),
    hasSelectionAudit: fs.existsSync(path.join(output, "selection-audit.json")),
    measurementFilesByCandidate,
    hasMeasurementManifest: fs.existsSync(path.join(output, "measurement-manifest.json")),
    hasFormalResult: fs.existsSync(path.join(output, "stage2-formal-result.json")),
  };
}

function generate(output, spec, specSha256, candidates, candidateSha256, auth, force) {
  const provenance = C.provenance();
  if (provenance.sourceTreeDirty) throw new Error("Frozen Stage 2 scientific source tree is dirty");
  const games = [];
  for (let index = 0; index < spec.population.games; index += 1) {
    const file = C.gamePath(output, index);
    let game = !force && fs.existsSync(file) ? C.readJson(file) : null;
    if (game && (game.specSha256 !== specSha256
      || game.candidateDefinitionSha256 !== candidateSha256)) {
      throw new Error(`Stage 2 generation binding mismatch: ${file}`);
    }
    if (!game) {
      game = C.runGame(spec, specSha256, candidateSha256, index);
      C.writeJson(file, game);
    }
    games.push(game);
    console.error(`[tm stage2 generate] ${index + 1}/${spec.population.games}`);
  }

  const trajectoryCounts = new Map();
  const conditionCounts = new Map();
  for (const game of games) {
    trajectoryCounts.set(game.historicalTrajectoryHash,
      (trajectoryCounts.get(game.historicalTrajectoryHash) || 0) + 1);
    conditionCounts.set(game.conditionId, (conditionCounts.get(game.conditionId) || 0) + 1);
  }
  const summary = {
    games: games.length,
    uniqueHistoricalTrajectories: trajectoryCounts.size,
    duplicateHistoricalTrajectoryGroups: [...trajectoryCounts.values()].filter((count) => count > 1).length,
    largestHistoricalTrajectoryGroup: Math.max(...trajectoryCounts.values()),
    distinctOpeningPrefixes: new Set(games.map((game) => game.openingPrefix.hash)).size,
    conditionCounts: Object.fromEntries([...conditionCounts].sort()),
  };
  const manifest = {
    schemaVersion: 1,
    stageId: spec.stageId,
    specSha256,
    candidateDefinitionSha256: candidateSha256,
    formalExperiment: true,
    scientificInferenceAuthorized: true,
    stage1FormalObservationReuseAllowed: false,
    authorizationSha256: auth.authorizationSha256,
    generatedAt: new Date().toISOString(),
    population: spec.population,
    formalCandidateIds: candidates.formalCandidates.map((candidate) => candidate.candidateId),
    summary,
    summaryHash: hashValue(summary),
    provenance,
  };
  C.writeJson(path.join(output, "manifest.json"), manifest);
  return manifest;
}

function requireVerification(output, specSha256, candidateSha256) {
  const file = path.join(output, "verification.json");
  if (!fs.existsSync(file)) throw new Error("Stage 2 selection blocked: verification.json absent");
  const verification = C.readJson(file);
  if (verification.specSha256 !== specSha256
    || verification.candidateDefinitionSha256 !== candidateSha256
    || verification.passed !== true
    || verification.fullSearchRecomputation !== true) {
    throw new Error("Stage 2 selection blocked: full replay/search verification did not pass");
  }
  return verification;
}

function selectedAudit(candidate, selected, rawCount, eligibleTrajectoryCount, duplicateRuleStates, spec) {
  const openingCounts = selected.reduce((counts, row) => {
    counts[row.openingPrefixHash] = (counts[row.openingPrefixHash] || 0) + 1;
    return counts;
  }, {});
  const conditionCounts = selected.reduce((counts, row) => {
    counts[row.conditionId] = (counts[row.conditionId] || 0) + 1;
    return counts;
  }, {});
  const preview = {
    uniqueHistoricalTrajectories: new Set(selected.map((row) => row.historicalTrajectoryHash)).size,
    uniqueRuleStates: new Set(selected.map((row) => row.ruleStateKey)).size,
    distinctOpeningPrefixes: Object.keys(openingCounts).length,
    maximumSingleOpeningPrefixShare: Formal.maxShare(openingCounts, selected.length),
    generationStrata: Object.keys(conditionCounts).length,
    maximumSingleGenerationStratumShare: Formal.maxShare(conditionCounts, selected.length),
  };
  preview.gates = Formal.estimabilityGates(preview, spec);
  preview.estimablePreview = Object.values(preview.gates).every(Boolean);
  return {
    candidateId: candidate.candidateId,
    phase: candidate.phase,
    canonicalCandidateKey: candidate.canonicalCandidateKey,
    eligibleHistoricalTrajectories: eligibleTrajectoryCount,
    selectedBeforeRuleStateCollapse: rawCount,
    duplicateSelectedRuleStatesCollapsed: duplicateRuleStates,
    selectedUniqueRuleStates: selected.length,
    replacementPerformed: false,
    openingPrefixCounts: openingCounts,
    conditionCounts,
    prospectiveEstimabilityPreview: preview,
  };
}

function select(output, spec, specSha256, candidates, candidateSha256) {
  requireVerification(output, specSha256, candidateSha256);
  const games = C.readGames(output, spec);
  const representatives = C.representativeGames(games);
  const selectedArtifacts = [];
  const auditByCandidate = {};

  for (const candidate of candidates.formalCandidates) {
    const raw = [];
    let eligibleTrajectoryCount = 0;
    for (const game of representatives) {
      const eligible = [];
      for (const observation of game.observations) {
        if (observation.terminal
          || observation.ply < spec.candidateSpecificRootSelection.minimumPly
          || observation.phase !== candidate.phase
          || observation.features.actor.legalMoveCount < spec.candidateSpecificRootSelection.minimumLegalMoveCount
          || !Formal.rootSatisfiesCandidate(observation.features.actor, candidate)) {
          continue;
        }
        const state = C.stateFromObservation(observation);
        const matchingMoves = Formal.canonicalMatchingMoves(E.moveVariants(state), candidate);
        if (!matchingMoves.length) continue;
        eligible.push({
          observation,
          state,
          matchingMoveCount: matchingMoves.length,
          rank: C.candidateSelectionRank(candidate.candidateId, game, observation, spec),
        });
      }
      if (!eligible.length) continue;
      eligibleTrajectoryCount += 1;
      eligible.sort((left, right) => left.rank.localeCompare(right.rank)
        || left.observation.identity.ruleStateKey.localeCompare(right.observation.identity.ruleStateKey)
        || left.observation.ply - right.observation.ply);
      const chosen = eligible[0];
      raw.push({
        candidateId: candidate.candidateId,
        historicalTrajectoryHash: game.historicalTrajectoryHash,
        ruleTrajectoryHash: game.ruleTrajectoryHash,
        seed: game.seed,
        gameId: game.gameId,
        conditionId: game.conditionId,
        openingPrefixHash: game.openingPrefix.hash,
        selectionRank: chosen.rank,
        ply: chosen.observation.ply,
        ruleStateKey: chosen.observation.identity.ruleStateKey,
        historicalStateHash: chosen.observation.identity.historicalStateHash,
        matchingMoveCount: chosen.matchingMoveCount,
        observation: chosen.observation,
        state: chosen.state,
      });
    }

    const byRuleState = new Map();
    for (const row of raw) {
      const current = byRuleState.get(row.ruleStateKey);
      if (!current
        || row.historicalTrajectoryHash < current.historicalTrajectoryHash
        || (row.historicalTrajectoryHash === current.historicalTrajectoryHash && row.seed < current.seed)) {
        byRuleState.set(row.ruleStateKey, row);
      }
    }
    const selected = [...byRuleState.values()]
      .sort((left, right) => left.historicalTrajectoryHash.localeCompare(right.historicalTrajectoryHash));
    const selectionHash = hashValue(selected.map((row) => ({
      candidateId: row.candidateId,
      historicalTrajectoryHash: row.historicalTrajectoryHash,
      ruleStateKey: row.ruleStateKey,
      ply: row.ply,
      conditionId: row.conditionId,
      openingPrefixHash: row.openingPrefixHash,
      selectionRank: row.selectionRank,
    })));
    auditByCandidate[candidate.candidateId] = {
      ...selectedAudit(
        candidate,
        selected,
        raw.length,
        eligibleTrajectoryCount,
        raw.length - selected.length,
        spec,
      ),
      selectionHash,
    };
    selectedArtifacts.push({ candidateId: candidate.candidateId, selectionHash, selected });
  }

  const globalSelectionHash = hashValue(selectedArtifacts.map(({ candidateId, selectionHash, selected }) => ({
    candidateId,
    selectionHash,
    selectedRuleStateKeys: selected.map((row) => row.ruleStateKey),
  })));
  const audit = {
    schemaVersion: 1,
    stageId: spec.stageId,
    specSha256,
    candidateDefinitionSha256: candidateSha256,
    generatedGames: games.length,
    uniqueHistoricalTrajectories: representatives.length,
    candidateCount: candidates.formalCandidates.length,
    replacementPerformed: false,
    candidateSelection: auditByCandidate,
    selectionHash: globalSelectionHash,
    selectionIntegrityPassed: true,
    note: "Prospective estimability preview does not block measurement and cannot authorize corpus extension.",
  };
  C.writeJson(path.join(output, "selection-audit.json"), audit);
  C.writeJson(path.join(output, "selected-states.json"), {
    schemaVersion: 1,
    stageId: spec.stageId,
    specSha256,
    candidateDefinitionSha256: candidateSha256,
    selectionHash: globalSelectionHash,
    candidates: selectedArtifacts,
  });
  return audit;
}

function measureOne(selected, candidate, index, spec, specSha256, candidateSha256, globalSelectionHash) {
  const state = selected.state;
  const rootSearch = spec.measurement.rootSearch;
  const exactRootTrace = TM.analyzeExactRootValues(state, rootSearch.depths, {
    evaluationProfile: rootSearch.evaluationProfile,
    quiescenceDepth: rootSearch.quiescenceDepth,
    orderQuiescenceCaptures: rootSearch.orderQuiescenceCaptures,
  });
  const matchingMoves = Formal.canonicalMatchingMoves(E.moveVariants(state), candidate);
  if (!matchingMoves.length) throw new Error(`No canonical move at selected root: ${candidate.candidateId}/${index}`);
  const candidateMove = matchingMoves[0];
  const candidateMoveKey = AI.moveKey(candidateMove);
  const transition = TM.summarizeMoveTransition(state, candidateMove);
  const responseEnvelope = TM.summarizeReplyEnvelope(state, candidateMove);
  const moveRecord = { transition, responseEnvelope };

  const d1 = traceCandidate(exactRootTrace, 1, candidateMoveKey);
  const d2 = traceCandidate(exactRootTrace, 2, candidateMoveKey);
  const d3 = traceCandidate(exactRootTrace, 3, candidateMoveKey);
  const d3Result = exactRootTrace.results.find((result) => result.depth === 3);
  const d3Scores = d3Result.candidates.map((row) => row.score);
  const stateMedian = median(d3Scores);
  const stateMin = Math.min(...d3Scores);
  const stateWorstCount = d3Result.candidates.filter((row) => row.score === stateMin).length;
  const noncandidateScores = d3Result.candidates
    .filter((row) => {
      const legal = E.moveVariants(state).find((move) => AI.moveKey(move) === row.moveKey);
      return legal && !Formal.moveMatchesCandidate(legal, candidate);
    })
    .map((row) => row.score);
  const bestNoncandidate = noncandidateScores.length ? Math.max(...noncandidateScores) : null;

  const rootCandidateSearch = d3Result.candidates.map((row) => ({
    moveKey: row.moveKey,
    matchesCanonicalAbstraction: E.moveVariants(state).some((move) =>
      AI.moveKey(move) === row.moveKey && Formal.moveMatchesCandidate(move, candidate)),
    d1Score: traceCandidate(exactRootTrace, 1, row.moveKey).score,
    d2Score: traceCandidate(exactRootTrace, 2, row.moveKey).score,
    d3Score: row.score,
    d3IsTopSet: row.isTopSet,
  })).sort((left, right) => left.moveKey.localeCompare(right.moveKey));

  const formal = {
    structuralSuccess: Formal.candidateConsequenceHolds(moveRecord, candidate),
    d3IsTopSet: d3.isTopSet,
    d3AtOrAboveStateMedian: d3.score >= stateMedian,
    d3UniqueWorst: d3.score === stateMin && stateWorstCount === 1,
    d3StateMedian: stateMedian,
    d3ScoreMinusStateMedian: d3.score - stateMedian,
    d3BestNoncandidateScore: bestNoncandidate,
    d3ScoreMinusBestNoncandidate: bestNoncandidate === null ? null : d3.score - bestNoncandidate,
  };
  const diagnostic = {
    pairedStage1Rank: candidate.pairedDiagnosticDefinition.stage1Rank,
    pairedCandidateKey: candidate.pairedDiagnosticDefinition.candidateKey,
    pairedPreconditionHolds: Formal.pairedPreconditionHolds(selected.observation.features.actor, candidate),
    pairedConsequenceHolds: Formal.pairedConsequenceHolds(moveRecord, candidate),
    decisionUse: false,
  };

  const rowCore = {
    schemaVersion: 1,
    stageId: spec.stageId,
    specSha256,
    candidateDefinitionSha256: candidateSha256,
    selectionHash: globalSelectionHash,
    candidateId: candidate.candidateId,
    selectedIndex: index,
    historicalTrajectoryHash: selected.historicalTrajectoryHash,
    ruleStateKey: selected.ruleStateKey,
    seed: selected.seed,
    gameId: selected.gameId,
    conditionId: selected.conditionId,
    openingPrefixHash: selected.openingPrefixHash,
    phase: candidate.phase,
    ply: selected.ply,
    rootActorFeatures: selected.observation.features.actor,
    canonicalCandidateKey: candidate.canonicalCandidateKey,
    candidateMove: {
      moveKey: candidateMoveKey,
      move: JSON.parse(JSON.stringify(candidateMove)),
      matchingMoveCount: matchingMoves.length,
      transition,
      responseEnvelope,
      search: { d1, d2, d3 },
    },
    rootCandidateSearch,
    formal,
    diagnostic,
  };
  return { ...rowCore, measurementIdentityHash: hashValue(rowCore) };
}

function measure(output, spec, specSha256, candidates, candidateSha256, force) {
  const audit = C.readJson(path.join(output, "selection-audit.json"));
  const selectedArtifact = C.readJson(path.join(output, "selected-states.json"));
  if (audit.specSha256 !== specSha256
    || audit.candidateDefinitionSha256 !== candidateSha256
    || audit.selectionIntegrityPassed !== true
    || selectedArtifact.selectionHash !== audit.selectionHash) {
    throw new Error("Stage 2 measurement blocked: selection integrity binding failed");
  }

  const completedMeasurementsByCandidate = {};
  const measurementHashesByCandidate = {};
  let totalMeasurements = 0;
  const allIdentities = [];

  for (const candidate of candidates.formalCandidates) {
    const selectedGroup = selectedArtifact.candidates.find((group) => group.candidateId === candidate.candidateId);
    if (!selectedGroup) throw new Error(`Missing selected-state group: ${candidate.candidateId}`);
    const identities = [];
    for (let index = 0; index < selectedGroup.selected.length; index += 1) {
      const file = C.candidateMeasurementPath(output, candidate.candidateId, index);
      let row = !force && fs.existsSync(file) ? C.readJson(file) : null;
      if (!row) {
        row = measureOne(
          selectedGroup.selected[index],
          candidate,
          index,
          spec,
          specSha256,
          candidateSha256,
          audit.selectionHash,
        );
        C.writeJson(file, row);
      }
      const selected = selectedGroup.selected[index];
      if (row.specSha256 !== specSha256
        || row.candidateDefinitionSha256 !== candidateSha256
        || row.selectionHash !== audit.selectionHash
        || row.candidateId !== candidate.candidateId
        || row.ruleStateKey !== selected.ruleStateKey
        || row.historicalTrajectoryHash !== selected.historicalTrajectoryHash) {
        throw new Error(`Stage 2 measurement identity mismatch: ${candidate.candidateId}/${index}`);
      }
      identities.push(row.measurementIdentityHash);
      allIdentities.push({ candidateId: candidate.candidateId, measurementIdentityHash: row.measurementIdentityHash });
      console.error(`[tm stage2 measure] ${candidate.candidateId} ${index + 1}/${selectedGroup.selected.length}`);
    }
    completedMeasurementsByCandidate[candidate.candidateId] = selectedGroup.selected.length;
    measurementHashesByCandidate[candidate.candidateId] = hashValue(identities);
    totalMeasurements += selectedGroup.selected.length;
  }

  const manifest = {
    schemaVersion: 1,
    stageId: spec.stageId,
    specSha256,
    candidateDefinitionSha256: candidateSha256,
    selectionHash: audit.selectionHash,
    completedMeasurementsByCandidate,
    totalMeasurements,
    measurementHashesByCandidate,
    measurementHash: hashValue(allIdentities),
    measurementIntegrityPassed: true,
    provenance: C.provenance(),
  };
  C.writeJson(path.join(output, "measurement-manifest.json"), manifest);
  return manifest;
}

function evaluate(output, spec, specSha256, candidates, candidateSha256) {
  const selectionAudit = C.readJson(path.join(output, "selection-audit.json"));
  const measurementManifest = C.readJson(path.join(output, "measurement-manifest.json"));
  const rowsByCandidate = Evaluator.loadRows(output, measurementManifest);
  const result = Evaluator.evaluateFromRows({
    spec,
    specSha256,
    candidates,
    candidateSha256,
    selectionAudit,
    measurementManifest,
    rowsByCandidate,
  });
  result.evaluatedAt = new Date().toISOString();
  result.provenance = C.provenance();
  C.writeJson(path.join(output, "stage2-formal-result.json"), result);
  return result;
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const { spec, specSha256 } = C.loadSpec();
  const { candidates, candidateSha256 } = C.loadCandidates();
  if (options.phase === "status") {
    console.log(JSON.stringify(status(options.output, spec, specSha256, candidates, candidateSha256), null, 2));
    return;
  }
  const auth = C.loadAuthorization(specSha256, candidateSha256);
  let result;
  if (options.phase === "generate") {
    result = generate(options.output, spec, specSha256, candidates, candidateSha256, auth, options.force);
  } else if (options.phase === "select") {
    result = select(options.output, spec, specSha256, candidates, candidateSha256);
  } else if (options.phase === "measure") {
    result = measure(options.output, spec, specSha256, candidates, candidateSha256, options.force);
  } else if (options.phase === "evaluate") {
    result = evaluate(options.output, spec, specSha256, candidates, candidateSha256);
  }
  console.log(JSON.stringify(result, null, 2));
}

if (require.main === module) main();

module.exports = {
  evaluate,
  generate,
  measure,
  measureOne,
  median,
  parseArgs,
  requireVerification,
  select,
  status,
  traceCandidate,
};
