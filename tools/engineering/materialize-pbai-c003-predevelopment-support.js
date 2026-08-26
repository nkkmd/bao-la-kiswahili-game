#!/usr/bin/env node
"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const E = require("../../public/engine.js");
const ORISC = require("../experiments/lib/orisc-representation-production.js");
const Population = require("./lib/pbai-p1-decision-population.js");

const ROOT = path.resolve(__dirname, "../..");
const SPEC_PATH = "doc/ai-engineering/public-ai-improvement-program-1/candidates/PBAI-C003-v1-predevelopment-support-spec.json";
const ORACLE_PATH = "doc/restricted-endgame-winning-regions/results/STAGE_1_EXACT_RESULT.json";

function readJson(rel) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, rel), "utf8"));
}

function sha256File(rel) {
  return crypto.createHash("sha256").update(fs.readFileSync(path.join(ROOT, rel))).digest("hex");
}

function parseArgs(argv) {
  const options = { output: null };
  for (let index = 0; index < argv.length; index += 1) {
    if (argv[index] === "--output") {
      options.output = argv[index + 1];
      if (!options.output) throw new Error("--output requires a path");
      index += 1;
    } else {
      throw new Error(`Unknown argument: ${argv[index]}`);
    }
  }
  return options;
}

function oracleKeySets(oracle, expectedNonterminalCount) {
  const nonterminal = new Set();
  const terminal = new Set();
  for (const row of oracle.stateRows) {
    const { stateKey, ruleState } = row;
    ORISC.assertRawStateShape(ruleState);
    const recomputed = ORISC.stateKey(ruleState);
    if (recomputed !== stateKey) throw new Error(`Oracle RAW key mismatch: ${stateKey}`);
    if (ruleState.winner === null) nonterminal.add(stateKey);
    else terminal.add(stateKey);
  }
  if (nonterminal.size !== expectedNonterminalCount) {
    throw new Error(`Unexpected nonterminal oracle count: ${nonterminal.size}`);
  }
  if (nonterminal.size + terminal.size !== oracle.domain.stateCount) {
    throw new Error("Oracle key-set cardinality mismatch");
  }
  return { nonterminal, terminal };
}

function replayTrajectory(seed, maximumPlies, keys) {
  const random = Population.seededRandom(seed);
  let state = E.initialState();
  const nonterminalHits = [];
  const terminalHits = [];
  let statesScanned = 0;

  for (let ply = 0; ply <= maximumPlies; ply += 1) {
    ORISC.assertRawStateShape(state);
    const rawKey = ORISC.stateKey(state);
    statesScanned += 1;
    if (keys.nonterminal.has(rawKey)) nonterminalHits.push({ seed, ply, rawKey });
    if (keys.terminal.has(rawKey)) terminalHits.push({ seed, ply, rawKey });

    if (state.winner !== null || ply === maximumPlies) break;
    const moves = Population.sortedMoves(state);
    if (!moves.length) break;
    const move = moves[Math.floor(random() * moves.length)];
    state = E.applyMove(state, move).state;
  }
  return { statesScanned, nonterminalHits, terminalHits };
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const spec = readJson(SPEC_PATH);
  const oracle = readJson(ORACLE_PATH);

  for (const key of [
    "candidateImplementationObserved",
    "candidateCodeUsed",
    "candidateBenefitMetricsObserved",
    "searchScoresOrReferenceValuesMeasured",
    "oracleSolutionValuesInspectedForSupport",
    "publicCodeChangeAuthorized",
    "validationSeedBlockAccessAuthorized",
    "releaseHoldoutSeedBlockAccessAuthorized",
    "developmentAuthorizationGrantedBySupportResult",
    "aiGen3PromotionAuthorized",
  ]) {
    if (spec.firewall[key] !== false) throw new Error(`Support firewall open: ${key}`);
  }
  if (spec.identityContract.aiStateKeyAllowed !== false) throw new Error("AI.stateKey must remain prohibited");
  if (spec.supportMeasurement.oracleSolutionFieldsUsedForSupport !== false) {
    throw new Error("Oracle solution fields must not be used for support");
  }

  if (oracle.formalDecision !== "EXACT-SOLVED-WITHIN-FROZEN-DOMAIN") {
    throw new Error("Unexpected restricted-endgame formal decision");
  }
  if (oracle.identities.domainSha256 !== spec.researchEvidence.domainSha256
      || oracle.identities.stateSetSha256 !== spec.researchEvidence.stateSetSha256
      || oracle.domain.stateCount !== spec.researchEvidence.stateCount) {
    throw new Error("Frozen oracle identity drift");
  }

  const keys = oracleKeySets(oracle, spec.researchEvidence.nonterminalStateCountExpected);
  const block = spec.developmentTrajectoryProbe.sourceSeedBlock;
  if (block.end - block.start + 1 !== spec.developmentTrajectoryProbe.trajectoryCount) {
    throw new Error("Trajectory count does not match seed block");
  }

  const allNonterminalHits = [];
  const allTerminalHits = [];
  const trajectoryHits = [];
  let statesScanned = 0;
  for (let seed = block.start; seed <= block.end; seed += 1) {
    const replay = replayTrajectory(seed, spec.developmentTrajectoryProbe.maximumPlies, keys);
    statesScanned += replay.statesScanned;
    allNonterminalHits.push(...replay.nonterminalHits);
    allTerminalHits.push(...replay.terminalHits);
    if (replay.nonterminalHits.length) {
      trajectoryHits.push({
        seed,
        firstPly: replay.nonterminalHits[0].ply,
        rawKeys: [...new Set(replay.nonterminalHits.map((hit) => hit.rawKey))].sort(),
        hitCount: replay.nonterminalHits.length,
      });
    }
  }

  const uniqueNonterminal = [...new Set(allNonterminalHits.map((hit) => hit.rawKey))].sort();
  const uniqueTerminal = [...new Set(allTerminalHits.map((hit) => hit.rawKey))].sort();
  const supportPass = trajectoryHits.length >= spec.supportMeasurement.minimumTrajectoriesWithNonterminalOracleHit
    && uniqueNonterminal.length >= spec.supportMeasurement.minimumUniqueNonterminalOracleStatesHit;

  const report = {
    schemaVersion: 1,
    program: "PBAI-P1",
    phase: "PBAI-D-PREDEVELOPMENT-SUPPORT",
    candidateId: "PBAI-C003",
    candidateVersion: "PBAI-C003-v1",
    specPath: SPEC_PATH,
    status: supportPass ? "SUPPORT-PASS" : "NON-ESTIMABLE-PRACTICAL-REACHABILITY-HOLD",
    baselineId: spec.baselineId,
    globalGateSpecId: spec.globalGateSpecId,
    sourceBinding: {
      publicEngineSha256: sha256File("public/engine.js"),
      publicAiSha256: sha256File("public/ai.js"),
      expectedPublicEngineSha256: "e6acf1fe4d97db67dbcfadc3a785e802342ae0b0cbaec35f53eb8e77424cfc1c",
      expectedPublicAiSha256: "2823dbcf96c7a47489301ecd768a63975aa8b4e12b62cc4629fc8283ef5dff9e",
      oracleDomainSha256: oracle.identities.domainSha256,
      oracleStateSetSha256: oracle.identities.stateSetSha256,
    },
    identityAudit: {
      implementation: spec.identityContract.implementation,
      requiredFields: ORISC.RAW_IDENTITY_FIELDS,
      aiStateKeyUsed: false,
      symmetryCanonicalizationUsed: false,
      seatCanonicalizationUsed: false,
      reflectionCanonicalizationUsed: false,
      oracleStoredKeysRecomputed: oracle.domain.stateCount,
      oracleStoredKeyMismatches: 0,
      nonterminalOracleKeyCount: keys.nonterminal.size,
      terminalOracleKeyCount: keys.terminal.size,
    },
    trajectoryProbe: {
      sourceSeedBlock: block,
      trajectoryCount: spec.developmentTrajectoryProbe.trajectoryCount,
      maximumPlies: spec.developmentTrajectoryProbe.maximumPlies,
      statesScanned,
      trajectoriesWithNonterminalOracleHit: trajectoryHits.length,
      nonterminalOracleHitVisits: allNonterminalHits.length,
      uniqueNonterminalOracleStatesHit: uniqueNonterminal.length,
      uniqueNonterminalOracleStateKeysHit: uniqueNonterminal,
      trajectoryHits,
      terminalOracleHitVisitsDescriptiveOnly: allTerminalHits.length,
      uniqueTerminalOracleStatesHitDescriptiveOnly: uniqueTerminal.length,
      uniqueTerminalOracleStateKeysHitDescriptiveOnly: uniqueTerminal,
    },
    supportGate: {
      minimumTrajectoriesWithNonterminalOracleHit: spec.supportMeasurement.minimumTrajectoriesWithNonterminalOracleHit,
      minimumUniqueNonterminalOracleStatesHit: spec.supportMeasurement.minimumUniqueNonterminalOracleStatesHit,
      trajectoryGatePassed: trajectoryHits.length >= spec.supportMeasurement.minimumTrajectoriesWithNonterminalOracleHit,
      uniqueStateGatePassed: uniqueNonterminal.length >= spec.supportMeasurement.minimumUniqueNonterminalOracleStatesHit,
      supportPass,
    },
    firewall: {
      candidateImplementationObserved: false,
      candidateCodeUsed: false,
      candidateBenefitMetricsObserved: false,
      searchScoresOrReferenceValuesMeasured: false,
      oracleSolutionValuesInspectedForSupport: false,
      validationSeedsAccessed: false,
      releaseHoldoutSeedsAccessed: false,
      publicCodeChanged: false,
      developmentAuthorizationGrantedByThisResult: false,
      publicAdoptionAuthorizedByThisResult: false,
      aiGen3PromotionAuthorizedByThisResult: false,
      researchGeneration2EvidenceIncluded: false,
    },
    decision: supportPass
      ? "SUPPORT-PASS-ELIGIBLE-FOR-EXACT-CANDIDATE-CONTRACT-FREEZE"
      : "NON-ESTIMABLE-PRACTICAL-REACHABILITY/HOLD-NO-DEVELOPMENT",
    interpretationBoundary: {
      exactnessGeneralizesBeyondFrozen8StateDomain: false,
      allMtajiSolved: false,
      allEndgamesSolved: false,
      engineEvaluationValidated: false,
      practicalFrequencyGeneralizesBeyondThisFrozenTrajectoryProbe: false,
    },
  };

  if (report.sourceBinding.publicEngineSha256 !== report.sourceBinding.expectedPublicEngineSha256) {
    throw new Error("Frozen public engine hash mismatch");
  }
  if (report.sourceBinding.publicAiSha256 !== report.sourceBinding.expectedPublicAiSha256) {
    throw new Error("Frozen public AI hash mismatch");
  }

  const serialized = `${JSON.stringify(report, null, 2)}\n`;
  if (args.output) {
    const absolute = path.resolve(ROOT, args.output);
    fs.mkdirSync(path.dirname(absolute), { recursive: true });
    fs.writeFileSync(absolute, serialized);
  }
  process.stdout.write(serialized);
}

main();
