#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const E = require("../../public/engine.js");
const AI = require("../../public/ai.js");
const { hashValue } = require("./lib/position-typology-features.js");
const BM = require("./lib/blunder-misvaluation-patterns.js");
const Contract = require("./lib/blunder-misvaluation-stage1-contract.js");
const Tactical = require("./lib/tactical-motif-features.js");
const Formal = require("./lib/blunder-misvaluation-stage2-formal.js");
const C = require("./lib/blunder-misvaluation-stage2-corpus.js");
const Evaluator = require("./evaluate-blunder-misvaluation-stage2-formal.js");

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

function countFiles(dir, pattern) {
  return fs.existsSync(dir) ? fs.readdirSync(dir).filter((file) => pattern.test(file)).length : 0;
}

function status(output, spec, specSha256, candidates, candidateSha256) {
  const measurements = {};
  for (const group of candidates.supportGroups) {
    measurements[group.supportGroupId] = countFiles(
      path.join(output, "measurements", group.supportGroupId),
      /^selected-\d+\.json$/,
    );
  }
  return {
    stageId: spec.stageId,
    specSha256,
    candidateDefinitionSha256: candidateSha256,
    output,
    authorizationFilePresent: fs.existsSync(C.AUTH_PATH),
    sourceFileSha256: C.sourceFileSha256(),
    generatedGames: countFiles(path.join(output, "games"), /^game-\d+\.json$/),
    expectedGames: spec.population.games,
    hasManifest: fs.existsSync(path.join(output, "manifest.json")),
    hasCorpusVerification: fs.existsSync(path.join(output, "verification.json")),
    hasSelectionAudit: fs.existsSync(path.join(output, "selection-audit.json")),
    measurementFilesBySupportGroup: measurements,
    hasMeasurementManifest: fs.existsSync(path.join(output, "measurement-manifest.json")),
    hasMeasurementVerification: fs.existsSync(path.join(output, "measurement-verification.json")),
    hasFormalResult: fs.existsSync(path.join(output, "stage2-formal-result.json")),
  };
}

function generate(output, spec, specSha256, candidateSha256, auth, force) {
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
    console.error(`[bmp stage2 generate] ${index + 1}/${spec.population.games}`);
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
    studyId: "BMP-STUDY1",
    stageId: spec.stageId,
    specSha256,
    candidateDefinitionSha256: candidateSha256,
    formalExperiment: true,
    scientificInferenceAuthorized: true,
    confirmatoryReuseOfStage1DataAllowed: false,
    authorizationSha256: auth.authorizationSha256,
    generatedAt: new Date().toISOString(),
    population: spec.population,
    formalCandidateIds: candidatesIds(auth.authorization, spec),
    summary,
    summaryHash: hashValue(summary),
    provenance,
  };
  C.writeJson(path.join(output, "manifest.json"), manifest);
  return manifest;
}

function candidatesIds(auth, spec) {
  if (Array.isArray(auth.formalCandidateIds)) return auth.formalCandidateIds.slice();
  return spec.candidateFreeze.formalCandidateIds.slice();
}

function requireCorpusVerification(output, specSha256, candidateSha256) {
  const file = path.join(output, "verification.json");
  if (!fs.existsSync(file)) throw new Error("Stage 2 selection blocked: verification.json absent");
  const verification = C.readJson(file);
  if (verification.specSha256 !== specSha256
      || verification.candidateDefinitionSha256 !== candidateSha256
      || verification.passed !== true
      || verification.fullSearchRecomputation !== true) {
    throw new Error("Stage 2 selection blocked: independent full replay/search verification did not pass");
  }
  return verification;
}

function countBy(rows, field) {
  const counts = {};
  for (const row of rows) counts[row[field]] = (counts[row[field]] || 0) + 1;
  return counts;
}

function selectionPreview(selected, spec) {
  const openingCounts = countBy(selected, "openingPrefixHash");
  const conditionCounts = countBy(selected, "conditionId");
  const summary = {
    uniqueHistoricalTrajectories: new Set(selected.map((row) => row.historicalTrajectoryHash)).size,
    uniqueRuleStates: new Set(selected.map((row) => row.ruleStateKey)).size,
    distinctOpeningPrefixes: Object.keys(openingCounts).length,
    maximumSingleOpeningPrefixShare: Formal.maxShare(openingCounts, selected.length),
    generationStrata: Object.keys(conditionCounts).length,
    maximumSingleGenerationStratumShare: Formal.maxShare(conditionCounts, selected.length),
  };
  summary.gates = Formal.estimabilityGates(summary, spec);
  summary.estimablePreview = Object.values(summary.gates).every(Boolean);
  return { ...summary, openingPrefixCounts: openingCounts, conditionCounts };
}

function select(output, spec, specSha256, candidates, candidateSha256) {
  requireCorpusVerification(output, specSha256, candidateSha256);
  const stage1 = C.loadStage1IdentitySets();
  const games = C.readGames(output, spec);
  const representatives = C.representativeGames(games);

  const preFirewall = {
    representativeHistoricalTrajectories: representatives.length,
    trajectoryOverlapDropped: 0,
    openingOverlapDropped: 0,
  };
  const firewallEligible = [];
  for (const game of representatives) {
    if (stage1.historicalTrajectoryHashes.has(game.historicalTrajectoryHash)) {
      preFirewall.trajectoryOverlapDropped += 1;
      continue;
    }
    if (stage1.openingPrefixHashes.has(game.openingPrefix.hash)) {
      preFirewall.openingOverlapDropped += 1;
      continue;
    }
    firewallEligible.push(game);
  }

  const selectedArtifacts = [];
  const auditByGroup = {};
  for (const group of candidates.supportGroups) {
    const rawSelected = [];
    let eligibleHistoricalTrajectories = 0;
    for (const game of firewallEligible) {
      const eligible = [];
      for (const observation of game.observations) {
        if (observation.terminal
            || observation.ply < spec.supportGroupSelection.minimumPly
            || observation.phase !== group.phase
            || observation.features.actor.legalMoveCount < spec.supportGroupSelection.minimumLegalMoveCount
            || !Formal.rootSatisfiesSupport(observation.features.actor, group)) {
          continue;
        }
        const state = C.stateFromObservation(observation);
        const matchingMoves = Formal.canonicalMatchingMoves(E.moveVariants(state), group);
        if (!matchingMoves.length) continue;
        eligible.push({
          observation,
          state,
          matchingMoveCount: matchingMoves.length,
          selectionRank: C.supportGroupSelectionRank(group, game, observation),
        });
      }
      if (!eligible.length) continue;
      eligibleHistoricalTrajectories += 1;
      eligible.sort((a, b) => a.selectionRank.localeCompare(b.selectionRank)
        || a.observation.identity.ruleStateKey.localeCompare(b.observation.identity.ruleStateKey)
        || a.observation.ply - b.observation.ply);
      const chosen = eligible[0];
      rawSelected.push({
        supportGroupId: group.supportGroupId,
        historicalTrajectoryHash: game.historicalTrajectoryHash,
        ruleTrajectoryHash: game.ruleTrajectoryHash,
        seed: game.seed,
        gameId: game.gameId,
        conditionId: game.conditionId,
        openingPrefixHash: game.openingPrefix.hash,
        selectionRank: chosen.selectionRank,
        ply: chosen.observation.ply,
        ruleStateKey: chosen.observation.identity.ruleStateKey,
        historicalStateHash: chosen.observation.identity.historicalStateHash,
        matchingMoveCount: chosen.matchingMoveCount,
        observation: chosen.observation,
        state: chosen.state,
      });
    }

    const ruleStateFirewallKept = rawSelected.filter((row) => !stage1.ruleStateKeys.has(row.ruleStateKey));
    const ruleStateOverlapDropped = rawSelected.length - ruleStateFirewallKept.length;
    const byRuleState = new Map();
    for (const row of ruleStateFirewallKept) {
      const current = byRuleState.get(row.ruleStateKey);
      if (!current
          || row.historicalTrajectoryHash.localeCompare(current.historicalTrajectoryHash) < 0
          || (row.historicalTrajectoryHash === current.historicalTrajectoryHash && row.seed < current.seed)) {
        byRuleState.set(row.ruleStateKey, row);
      }
    }
    const selected = [...byRuleState.values()].sort((a, b) =>
      a.historicalTrajectoryHash.localeCompare(b.historicalTrajectoryHash)
      || a.ruleStateKey.localeCompare(b.ruleStateKey));
    const selectionHash = hashValue(selected.map((row) => ({
      supportGroupId: row.supportGroupId,
      historicalTrajectoryHash: row.historicalTrajectoryHash,
      ruleStateKey: row.ruleStateKey,
      ply: row.ply,
      conditionId: row.conditionId,
      openingPrefixHash: row.openingPrefixHash,
      selectionRank: row.selectionRank,
    })));
    const preview = selectionPreview(selected, spec);
    auditByGroup[group.supportGroupId] = {
      supportGroupId: group.supportGroupId,
      phase: group.phase,
      sourceStage1CandidateIds: group.sourceStage1CandidateIds,
      eligibleHistoricalTrajectories,
      selectedBeforeStage1RuleStateFirewall: rawSelected.length,
      stage1RuleStateOverlapDropped: ruleStateOverlapDropped,
      duplicateSelectedRuleStatesCollapsed: ruleStateFirewallKept.length - selected.length,
      selectedUniqueRuleStates: selected.length,
      replacementPerformed: false,
      alternateRootAfterRuleStateOverlapPerformed: false,
      selectionHash,
      prospectiveEstimabilityPreview: preview,
    };
    selectedArtifacts.push({ supportGroupId: group.supportGroupId, selectionHash, selected });
  }

  const finalOverlap = {
    historicalTrajectoryHash: selectedArtifacts.flatMap((group) => group.selected)
      .filter((row) => stage1.historicalTrajectoryHashes.has(row.historicalTrajectoryHash)).length,
    openingPrefixHash: selectedArtifacts.flatMap((group) => group.selected)
      .filter((row) => stage1.openingPrefixHashes.has(row.openingPrefixHash)).length,
    ruleStateKey: selectedArtifacts.flatMap((group) => group.selected)
      .filter((row) => stage1.ruleStateKeys.has(row.ruleStateKey)).length,
  };
  const requiredOverlap = spec.stage1IdentityFirewall.requiredFinalOverlapCounts;
  const firewallPassed = Object.keys(requiredOverlap).every((key) => finalOverlap[key] === requiredOverlap[key]);
  if (!firewallPassed) throw new Error("Stage 1 identity firewall final overlap is nonzero");

  const selectionHash = hashValue(selectedArtifacts.map((group) => ({
    supportGroupId: group.supportGroupId,
    selectionHash: group.selectionHash,
    selectedRuleStateKeys: group.selected.map((row) => row.ruleStateKey),
  })));
  const audit = {
    schemaVersion: 1,
    studyId: "BMP-STUDY1",
    stageId: spec.stageId,
    specSha256,
    candidateDefinitionSha256: candidateSha256,
    generatedGames: games.length,
    representativeHistoricalTrajectories: representatives.length,
    stage1IdentityReference: {
      identityHash: stage1.identityHash,
      counts: stage1.counts,
    },
    preSelectionFirewall: preFirewall,
    supportGroupSelection: auditByGroup,
    finalStage1OverlapCounts: finalOverlap,
    stage1IdentityFirewallPassed: firewallPassed,
    replacementPerformed: false,
    seedExtensionPerformed: false,
    selectionHash,
    selectionIntegrityPassed: true,
    note: "Estimability preview is prospective only; low support does not authorize extension or replacement.",
  };
  C.writeJson(path.join(output, "selection-audit.json"), audit);
  C.writeJson(path.join(output, "selected-states.json"), {
    schemaVersion: 1,
    studyId: "BMP-STUDY1",
    stageId: spec.stageId,
    specSha256,
    candidateDefinitionSha256: candidateSha256,
    selectionHash,
    supportGroups: selectedArtifacts,
  });
  return audit;
}

function measureOne(selected, group, groupCandidates, index, spec, specSha256, candidateSha256, selectionHash) {
  const state = selected.state;
  const legalMoves = E.moveVariants(state).slice().sort((a, b) => AI.moveKey(a).localeCompare(AI.moveKey(b)));
  const matchingMoves = Formal.canonicalMatchingMoves(legalMoves, group);
  if (!matchingMoves.length) throw new Error(`No frozen candidate move at ${group.supportGroupId}/${index}`);
  const candidateMove = matchingMoves[0];
  const candidateMoveKey = AI.moveKey(candidateMove);
  const rootSearch = spec.formalMeasurement.rootSearch;
  const d3Root = BM.analyzeRootDecisionLoss(state, rootSearch.depth, {
    evaluationProfile: rootSearch.evaluationProfile,
    quiescenceDepth: rootSearch.quiescenceDepth,
    orderQuiescenceCaptures: rootSearch.orderQuiescenceCaptures,
  });
  const candidate = d3Root.candidates.find((row) => row.moveKey === candidateMoveKey);
  if (!candidate) throw new Error(`Missing D3 candidate move: ${candidateMoveKey}`);
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
    schemaVersion: 1,
    studyId: "BMP-STUDY1",
    stageId: spec.stageId,
    specSha256,
    candidateDefinitionSha256: candidateSha256,
    selectionHash,
    supportGroupId: group.supportGroupId,
    selectedIndex: index,
    historicalTrajectoryHash: selected.historicalTrajectoryHash,
    ruleStateKey: selected.ruleStateKey,
    seed: selected.seed,
    gameId: selected.gameId,
    conditionId: selected.conditionId,
    openingPrefixHash: selected.openingPrefixHash,
    phase: selected.observation.phase,
    ply: selected.ply,
    candidateMoveKey,
    matchingMoveCount: matchingMoves.length,
    candidateMove: JSON.parse(JSON.stringify(candidateMove)),
    transition,
    responseEnvelope,
    d3Reference: {
      searchSemantics: d3Root.searchSemantics,
      depth: d3Root.depth,
      options: d3Root.options,
      legalMoveCount: d3Root.legalMoveCount,
      bestScore: d3Root.bestScore,
      bestScoreClass: d3Root.bestScoreClass,
      stateMedianScore: d3Root.stateMedianScore,
      topSetMoveKeys: d3Root.topSetMoveKeys,
    },
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

function measure(output, spec, specSha256, candidates, candidateSha256, force) {
  const audit = C.readJson(path.join(output, "selection-audit.json"));
  if (audit.specSha256 !== specSha256
      || audit.candidateDefinitionSha256 !== candidateSha256
      || audit.selectionIntegrityPassed !== true
      || audit.stage1IdentityFirewallPassed !== true) {
    throw new Error("Stage 2 measurement blocked: selection/firewall integrity failed");
  }
  const selectedArtifact = C.readJson(path.join(output, "selected-states.json"));
  if (selectedArtifact.selectionHash !== audit.selectionHash) throw new Error("Stage 2 selection hash mismatch");

  const counts = {};
  const identities = [];
  let allFinite = true;
  for (const selectedGroup of selectedArtifact.supportGroups) {
    const group = Formal.supportGroupById(candidates, selectedGroup.supportGroupId);
    const groupCandidates = candidates.formalCandidates.filter((row) => row.supportGroupId === group.supportGroupId);
    counts[group.supportGroupId] = selectedGroup.selected.length;
    for (let index = 0; index < selectedGroup.selected.length; index += 1) {
      const file = C.supportGroupMeasurementPath(output, group.supportGroupId, index);
      let row = !force && fs.existsSync(file) ? C.readJson(file) : null;
      if (!row) {
        row = measureOne(
          selectedGroup.selected[index], group, groupCandidates, index,
          spec, specSha256, candidateSha256, selectedArtifact.selectionHash,
        );
        C.writeJson(file, row);
      }
      if (row.specSha256 !== specSha256
          || row.candidateDefinitionSha256 !== candidateSha256
          || row.selectionHash !== selectedArtifact.selectionHash
          || row.ruleStateKey !== selectedGroup.selected[index].ruleStateKey
          || row.supportGroupId !== group.supportGroupId) {
        throw new Error(`Stage 2 measurement identity mismatch: ${group.supportGroupId}/${index}`);
      }
      if (!row.d3CandidateTable.every((item) => Number.isFinite(item.score))) allFinite = false;
      identities.push({
        supportGroupId: row.supportGroupId,
        historicalTrajectoryHash: row.historicalTrajectoryHash,
        ruleStateKey: row.ruleStateKey,
        candidateMoveKey: row.candidateMoveKey,
        d3CandidateTable: row.d3CandidateTable,
        formal: row.formal,
        formalByCandidate: row.formalByCandidate,
      });
      console.error(`[bmp stage2 measure] ${group.supportGroupId} ${index + 1}/${selectedGroup.selected.length}`);
    }
  }
  const manifest = {
    schemaVersion: 1,
    studyId: "BMP-STUDY1",
    stageId: spec.stageId,
    specSha256,
    candidateDefinitionSha256: candidateSha256,
    selectionHash: selectedArtifact.selectionHash,
    completedMeasurementsBySupportGroup: counts,
    totalCompletedMeasurements: Object.values(counts).reduce((sum, count) => sum + count, 0),
    allFormalD3CandidateTablesFinite: allFinite,
    measurementIntegrityPassed: allFinite,
    measurementHash: hashValue(identities),
    provenance: C.provenance(),
  };
  C.writeJson(path.join(output, "measurement-manifest.json"), manifest);
  return manifest;
}

function requireMeasurementVerification(output, specSha256, candidateSha256, selectionHash, measurementHash) {
  const file = path.join(output, "measurement-verification.json");
  if (!fs.existsSync(file)) throw new Error("Formal evaluation blocked: measurement-verification.json absent");
  const verification = C.readJson(file);
  if (verification.specSha256 !== specSha256
      || verification.candidateDefinitionSha256 !== candidateSha256
      || verification.selectionHash !== selectionHash
      || verification.measurementHash !== measurementHash
      || verification.passed !== true
      || verification.measurementHashMatches !== true
      || verification.stage1IdentityFirewallPassed !== true) {
    throw new Error("Formal evaluation blocked: independent measurement verification did not pass");
  }
  return verification;
}

function evaluate(output, spec, specSha256, candidates, candidateSha256) {
  const selectionAudit = C.readJson(path.join(output, "selection-audit.json"));
  const measurementManifest = C.readJson(path.join(output, "measurement-manifest.json"));
  requireMeasurementVerification(
    output, specSha256, candidateSha256,
    selectionAudit.selectionHash, measurementManifest.measurementHash,
  );
  const rowsBySupportGroup = Evaluator.loadRows(output, measurementManifest);
  const result = Evaluator.evaluateFromRows({
    spec,
    specSha256,
    candidates,
    candidateSha256,
    selectionAudit,
    measurementManifest,
    rowsBySupportGroup,
  });
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
    result = generate(options.output, spec, specSha256, candidateSha256, auth, options.force);
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
  countBy,
  evaluate,
  generate,
  measure,
  measureOne,
  parseArgs,
  requireCorpusVerification,
  requireMeasurementVerification,
  select,
  selectionPreview,
  status,
};
