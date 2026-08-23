#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const E = require("../../public/engine.js");
const AI = require("../../public/ai.js");
const { seededRandom } = require("../benchmark.js");
const {
  extractPositionTypologyObservation,
  hashValue,
  identityKeys,
  stableStringify,
} = require("./lib/position-typology-features.js");
const BM = require("./lib/blunder-misvaluation-patterns.js");
const Contract = require("./lib/blunder-misvaluation-stage1-contract.js");
const Tactical = require("./lib/tactical-motif-features.js");
const Formal = require("./lib/blunder-misvaluation-stage2-formal.js");
const C = require("./lib/blunder-misvaluation-stage2-corpus.js");

function sameSearch(actual, stored) {
  for (const key of [
    "completedDepth", "nodes", "quiescenceNodes", "cutoffs", "evaluations", "rootScore", "timedOut",
  ]) {
    if (actual?.[key] !== stored?.[key]) throw new Error(`Search diagnostic mismatch: ${key}`);
  }
}

function verifyGame(record, gameIndex, spec, specSha256, candidateSha256, recomputeSearch = true) {
  if (record.stageId !== spec.stageId
      || record.specSha256 !== specSha256
      || record.candidateDefinitionSha256 !== candidateSha256
      || record.gameIndex !== gameIndex) {
    throw new Error(`Stage 2 game identity mismatch: ${gameIndex}`);
  }
  const seed = spec.population.seedStart + gameIndex;
  const condition = C.conditionForGame(spec, gameIndex);
  if (record.seed !== seed || record.conditionId !== condition.id) {
    throw new Error(`Stage 2 seed/condition mismatch: ${gameIndex}`);
  }
  const expectedGameId = `bmp-s2-${String(gameIndex).padStart(4, "0")}`;
  if (record.gameId !== expectedGameId) throw new Error(`Stage 2 gameId mismatch: ${gameIndex}`);

  const random = seededRandom(seed);
  let state = E.initialState();
  const observations = [];
  for (let ply = 0; ply <= spec.population.maxPly; ply += 1) {
    const observation = extractPositionTypologyObservation(state, {
      gameId: record.gameId,
      conditionId: condition.id,
      seed,
      ply,
    });
    observations.push(observation);
    const storedObservation = record.observations[observations.length - 1];
    if (!storedObservation || stableStringify(observation) !== stableStringify(storedObservation)) {
      throw new Error(`Stage 2 observation mismatch game ${gameIndex} ply ${ply}`);
    }
    if (state.winner !== null || ply === spec.population.maxPly) break;

    const stored = record.moves[ply];
    if (!stored || stored.ply !== ply) throw new Error(`Stage 2 missing move game ${gameIndex} ply ${ply}`);
    let move;
    let search = null;
    if (ply < spec.population.opening.plies) {
      const legal = E.moveVariants(state);
      move = legal[Math.floor(random() * legal.length)];
      if (stored.source !== "opening-random") {
        throw new Error(`Stage 2 opening source mismatch game ${gameIndex} ply ${ply}`);
      }
    } else if (recomputeSearch) {
      const result = C.aiMove(state, condition, random);
      move = result.move;
      search = {
        completedDepth: result.stats.completedDepth,
        nodes: result.stats.nodes,
        quiescenceNodes: result.stats.quiescenceNodes,
        cutoffs: result.stats.cutoffs,
        evaluations: result.stats.evaluations,
        rootScore: result.stats.rootScore,
        timedOut: result.stats.timedOut,
      };
      if (stored.source !== "trajectory-ai") {
        throw new Error(`Stage 2 AI source mismatch game ${gameIndex} ply ${ply}`);
      }
      sameSearch(search, stored.generationSearch);
    } else {
      move = E.moveVariants(state).find((candidate) => AI.moveKey(candidate) === stored.moveKey);
      if (!move) throw new Error(`Stored Stage 2 move not legal game ${gameIndex} ply ${ply}`);
    }

    if (AI.moveKey(move) !== stored.moveKey || stableStringify(move) !== stableStringify(stored.move)) {
      throw new Error(`Stage 2 move mismatch game ${gameIndex} ply ${ply}`);
    }
    if (stored.beforeHistoricalStateHash !== observation.identity.historicalStateHash
        || stored.beforeRuleStateKey !== observation.identity.ruleStateKey) {
      throw new Error(`Stage 2 before-identity mismatch game ${gameIndex} ply ${ply}`);
    }
    const applied = E.applyMove(state, move);
    const after = identityKeys(applied.state);
    if (stored.afterHistoricalStateHash !== after.historicalStateHash
        || stored.afterRuleStateKey !== after.ruleStateKey) {
      throw new Error(`Stage 2 after-identity mismatch game ${gameIndex} ply ${ply}`);
    }
    state = applied.state;
  }

  const historicalTrajectoryHash = hashValue(observations.map((row) => row.identity.historicalStateHash));
  const ruleTrajectoryHash = hashValue(observations.map((row) => row.identity.ruleStateKey));
  const openingPrefix = C.openingPrefixIdentity(record.moves, spec);
  if (historicalTrajectoryHash !== record.historicalTrajectoryHash
      || ruleTrajectoryHash !== record.ruleTrajectoryHash
      || stableStringify(openingPrefix) !== stableStringify(record.openingPrefix)) {
    throw new Error(`Stage 2 trajectory/opening mismatch game ${gameIndex}`);
  }
  if (record.plies !== record.moves.length || record.observations.length !== observations.length) {
    throw new Error(`Stage 2 length mismatch game ${gameIndex}`);
  }
  return {
    gameIndex,
    seed,
    conditionId: condition.id,
    historicalTrajectoryHash,
    ruleTrajectoryHash,
    openingPrefixHash: openingPrefix.hash,
    plies: record.plies,
  };
}

function verifyCorpus(output, spec, specSha256, candidateSha256, recomputeSearch) {
  const manifest = C.readJson(path.join(output, "manifest.json"));
  if (manifest.stageId !== spec.stageId
      || manifest.specSha256 !== specSha256
      || manifest.candidateDefinitionSha256 !== candidateSha256
      || manifest.summary.games !== spec.population.games) {
    throw new Error("Stage 2 manifest/spec/candidate mismatch");
  }
  const verified = [];
  for (let index = 0; index < spec.population.games; index += 1) {
    const file = C.gamePath(output, index);
    if (!fs.existsSync(file)) throw new Error(`Missing Stage 2 game ${index}`);
    verified.push(verifyGame(
      C.readJson(file), index, spec, specSha256, candidateSha256, recomputeSearch,
    ));
    console.error(`[bmp stage2 verify corpus] ${index + 1}/${spec.population.games}`);
  }
  const conditionCounts = verified.reduce((counts, row) => {
    counts[row.conditionId] = (counts[row.conditionId] || 0) + 1;
    return counts;
  }, {});
  const result = {
    schemaVersion: 1,
    studyId: "BMP-STUDY1",
    stageId: spec.stageId,
    specSha256,
    candidateDefinitionSha256: candidateSha256,
    passed: true,
    fullSearchRecomputation: recomputeSearch,
    gamesVerified: verified.length,
    uniqueHistoricalTrajectories: new Set(verified.map((row) => row.historicalTrajectoryHash)).size,
    distinctOpeningPrefixes: new Set(verified.map((row) => row.openingPrefixHash)).size,
    conditionCounts,
    verificationIdentityHash: hashValue(verified),
    verifiedAt: new Date().toISOString(),
    provenance: C.provenance(),
  };
  C.writeJson(path.join(output, "verification.json"), result);
  return result;
}

function recomputeMeasurement(selected, group, groupCandidates, spec) {
  const gameIndex = selected.seed - spec.population.seedStart;
  if (!Number.isInteger(gameIndex) || gameIndex < 0 || gameIndex >= spec.population.games) {
    throw new Error(`Invalid selected Stage 2 seed: ${selected.seed}`);
  }
  const game = C.readJson(C.gamePath(selected.__output, gameIndex));
  if (game.gameId !== selected.gameId
      || game.historicalTrajectoryHash !== selected.historicalTrajectoryHash
      || game.openingPrefix.hash !== selected.openingPrefixHash) {
    throw new Error(`Selected root/game binding mismatch: ${group.supportGroupId}/${selected.seed}`);
  }
  const observation = game.observations.find((row) => row.ply === selected.ply);
  if (!observation
      || observation.identity.ruleStateKey !== selected.ruleStateKey
      || observation.identity.historicalStateHash !== selected.historicalStateHash) {
    throw new Error(`Selected root observation mismatch: ${group.supportGroupId}/${selected.seed}`);
  }
  if (observation.phase !== group.phase
      || !Formal.rootSatisfiesSupport(observation.features.actor, group)) {
    throw new Error(`Selected root no longer satisfies frozen support: ${group.supportGroupId}/${selected.seed}`);
  }
  const state = C.stateFromObservation(observation);
  const legalMoves = E.moveVariants(state).slice().sort((a, b) => AI.moveKey(a).localeCompare(AI.moveKey(b)));
  const matching = Formal.canonicalMatchingMoves(legalMoves, group);
  if (!matching.length) throw new Error(`No frozen candidate move during verification: ${group.supportGroupId}`);
  const candidateMove = matching[0];
  const candidateMoveKey = AI.moveKey(candidateMove);
  const rootSearch = spec.formalMeasurement.rootSearch;
  const d3Root = BM.analyzeRootDecisionLoss(state, rootSearch.depth, {
    evaluationProfile: rootSearch.evaluationProfile,
    quiescenceDepth: rootSearch.quiescenceDepth,
    orderQuiescenceCaptures: rootSearch.orderQuiescenceCaptures,
  });
  const candidate = d3Root.candidates.find((row) => row.moveKey === candidateMoveKey);
  if (!candidate) throw new Error(`Missing verified D3 candidate: ${candidateMoveKey}`);
  const transition = Tactical.summarizeMoveTransition(state, candidateMove);
  const responseEnvelope = Tactical.summarizeReplyEnvelope(state, candidateMove);
  const moveRecord = { transition, responseEnvelope };
  const formalByCandidate = Object.fromEntries(groupCandidates.map((formalCandidate) => [
    formalCandidate.formalCandidateId,
    {
      failureToken: formalCandidate.failureToken,
      failureTokenHolds: Formal.failureTokenHolds(moveRecord, formalCandidate),
    },
  ]));
  const d3CandidateTable = d3Root.candidates.map((row) => ({
    moveKey: row.moveKey,
    score: row.score,
    scoreClass: row.scoreClass,
    scoreRank: row.scoreRank,
    isTopSet: row.isTopSet,
    isBelowStateMedian: row.isBelowStateMedian,
    normalizedRankLoss: row.normalizedRankLoss,
    decisionLoss: {
      bestDomain: row.decisionLoss.bestDomain,
      candidateDomain: row.decisionLoss.candidateDomain,
      domainDrop: row.decisionLoss.domainDrop,
      crossDomain: row.decisionLoss.crossDomain,
      rawRegret: row.decisionLoss.rawRegret,
    },
    d3Inferior: Contract.d3InferiorEvent(row),
  })).sort((a, b) => a.moveKey.localeCompare(b.moveKey));
  return {
    supportGroupId: group.supportGroupId,
    historicalTrajectoryHash: selected.historicalTrajectoryHash,
    ruleStateKey: selected.ruleStateKey,
    candidateMoveKey,
    d3CandidateTable,
    formal: {
      d3Score: candidate.score,
      d3ScoreClass: candidate.scoreClass,
      d3ScoreRank: candidate.scoreRank,
      d3TopSet: candidate.isTopSet,
      d3Inferior: Contract.d3InferiorEvent(candidate),
      normalizedRankLoss: candidate.normalizedRankLoss,
    },
    formalByCandidate,
  };
}

function storedMeasurementCore(row) {
  return {
    supportGroupId: row.supportGroupId,
    historicalTrajectoryHash: row.historicalTrajectoryHash,
    ruleStateKey: row.ruleStateKey,
    candidateMoveKey: row.candidateMoveKey,
    d3CandidateTable: row.d3CandidateTable,
    formal: row.formal,
    formalByCandidate: row.formalByCandidate,
  };
}

function verifyMeasurement(output, spec, specSha256, candidates, candidateSha256) {
  const corpusVerification = C.readJson(path.join(output, "verification.json"));
  if (corpusVerification.passed !== true
      || corpusVerification.fullSearchRecomputation !== true
      || corpusVerification.specSha256 !== specSha256
      || corpusVerification.candidateDefinitionSha256 !== candidateSha256) {
    throw new Error("Measurement verification blocked: corpus verification did not pass");
  }
  const selectionAudit = C.readJson(path.join(output, "selection-audit.json"));
  const selectedArtifact = C.readJson(path.join(output, "selected-states.json"));
  const manifest = C.readJson(path.join(output, "measurement-manifest.json"));
  if (selectionAudit.selectionIntegrityPassed !== true
      || selectionAudit.stage1IdentityFirewallPassed !== true
      || selectedArtifact.selectionHash !== selectionAudit.selectionHash
      || manifest.selectionHash !== selectionAudit.selectionHash
      || manifest.specSha256 !== specSha256
      || manifest.candidateDefinitionSha256 !== candidateSha256
      || manifest.measurementIntegrityPassed !== true) {
    throw new Error("Measurement verification binding/integrity mismatch");
  }

  const stage1 = C.loadStage1IdentitySets();
  const finalOverlap = { historicalTrajectoryHash: 0, openingPrefixHash: 0, ruleStateKey: 0 };
  const identities = [];
  let verifiedRows = 0;
  for (const selectedGroup of selectedArtifact.supportGroups) {
    const group = Formal.supportGroupById(candidates, selectedGroup.supportGroupId);
    const groupCandidates = candidates.formalCandidates.filter((row) => row.supportGroupId === group.supportGroupId);
    const expectedCount = manifest.completedMeasurementsBySupportGroup[group.supportGroupId];
    if (expectedCount !== selectedGroup.selected.length) {
      throw new Error(`Measurement count mismatch for ${group.supportGroupId}`);
    }
    for (let index = 0; index < selectedGroup.selected.length; index += 1) {
      const selected = { ...selectedGroup.selected[index], __output: output };
      if (stage1.historicalTrajectoryHashes.has(selected.historicalTrajectoryHash)) {
        finalOverlap.historicalTrajectoryHash += 1;
      }
      if (stage1.openingPrefixHashes.has(selected.openingPrefixHash)) {
        finalOverlap.openingPrefixHash += 1;
      }
      if (stage1.ruleStateKeys.has(selected.ruleStateKey)) {
        finalOverlap.ruleStateKey += 1;
      }
      const recomputed = recomputeMeasurement(selected, group, groupCandidates, spec);
      const stored = C.readJson(C.supportGroupMeasurementPath(output, group.supportGroupId, index));
      if (stored.stageId !== spec.stageId
          || stored.specSha256 !== specSha256
          || stored.candidateDefinitionSha256 !== candidateSha256
          || stored.selectionHash !== selectionAudit.selectionHash) {
        throw new Error(`Stored measurement binding mismatch: ${group.supportGroupId}/${index}`);
      }
      const storedCore = storedMeasurementCore(stored);
      if (stableStringify(recomputed) !== stableStringify(storedCore)) {
        throw new Error(`Independent formal measurement mismatch: ${group.supportGroupId}/${index}`);
      }
      identities.push(recomputed);
      verifiedRows += 1;
      console.error(`[bmp stage2 verify measurement] ${group.supportGroupId} ${index + 1}/${selectedGroup.selected.length}`);
    }
  }

  const required = spec.stage1IdentityFirewall.requiredFinalOverlapCounts;
  const firewallPassed = Object.keys(required).every((key) => finalOverlap[key] === required[key]);
  const measurementHash = hashValue(identities);
  const core = {
    schemaVersion: 1,
    studyId: "BMP-STUDY1",
    stageId: spec.stageId,
    specSha256,
    candidateDefinitionSha256: candidateSha256,
    selectionHash: selectionAudit.selectionHash,
    measurementHash,
    expectedMeasurementHash: manifest.measurementHash,
    measurementHashMatches: measurementHash === manifest.measurementHash,
    verifiedMeasurementRows: verifiedRows,
    finalStage1OverlapCounts: finalOverlap,
    stage1IdentityFirewallPassed: firewallPassed,
    independentFormalD3CandidateTableRecomputation: true,
    independentCandidateMatcherAndFailureRecomputation: true,
    passed: measurementHash === manifest.measurementHash && firewallPassed,
    verifiedAt: new Date().toISOString(),
    provenance: C.provenance(),
  };
  const result = { ...core, verificationHash: hashValue(core) };
  if (!result.passed) throw new Error("Independent Stage 2 measurement verification failed");
  C.writeJson(path.join(output, "measurement-verification.json"), result);
  return result;
}

function parseArgs(argv) {
  const options = { phase: "corpus", output: C.DEFAULT_OUTPUT, recomputeSearch: true };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === "--no-search-recompute") {
      options.recomputeSearch = false;
      continue;
    }
    const value = argv[++i];
    if (value === undefined) throw new Error(`Missing value for ${argv[i - 1]}`);
    if (argv[i - 1] === "--phase") options.phase = value;
    else if (argv[i - 1] === "--output") options.output = path.resolve(value);
    else throw new Error(`Unknown argument: ${argv[i - 1]}`);
  }
  if (!["corpus", "measurement"].includes(options.phase)) {
    throw new Error(`Invalid verification phase: ${options.phase}`);
  }
  return options;
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const { spec, specSha256 } = C.loadSpec();
  const { candidates, candidateSha256 } = C.loadCandidates();
  C.loadAuthorization(specSha256, candidateSha256);
  const result = options.phase === "corpus"
    ? verifyCorpus(options.output, spec, specSha256, candidateSha256, options.recomputeSearch)
    : verifyMeasurement(options.output, spec, specSha256, candidates, candidateSha256);
  console.log(JSON.stringify(result, null, 2));
}

if (require.main === module) main();

module.exports = {
  parseArgs,
  recomputeMeasurement,
  sameSearch,
  storedMeasurementCore,
  verifyCorpus,
  verifyGame,
  verifyMeasurement,
};
