#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const P = require("./lib/orisc-representation-production.js");
const I = require("./lib/orisc-representation-independent.js");

function parseArgs(argv) {
  const args = {
    repositoryResult: null,
    originalProduction: null,
    originalIndependent: null,
    output: null,
  };
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === "--repository-result") args.repositoryResult = path.resolve(argv[++index]);
    else if (token === "--original-production") args.originalProduction = path.resolve(argv[++index]);
    else if (token === "--original-independent") args.originalIndependent = path.resolve(argv[++index]);
    else if (token === "--output") args.output = path.resolve(argv[++index]);
    else throw new Error(`Unknown argument ${token}`);
  }
  for (const [key, value] of Object.entries(args)) {
    if (!value) throw new Error(`Missing required argument --${key.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)}`);
  }
  return args;
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function rowsFromRepository(result) {
  if (!Array.isArray(result.stateRows)) throw new Error("repository result stateRows missing");
  return result.stateRows;
}

function rowsFromProduction(result) {
  if (!Array.isArray(result?.solution?.rows)) throw new Error("original production solution.rows missing");
  return result.solution.rows;
}

function rowsFromIndependent(result) {
  if (!Array.isArray(result?.independent?.solution?.rows)) throw new Error("original independent solution.rows missing");
  return result.independent.solution.rows;
}

function byKey(rows, label) {
  const map = new Map();
  for (const row of rows) {
    if (typeof row.stateKey !== "string") throw new Error(`${label} row missing stateKey`);
    if (map.has(row.stateKey)) throw new Error(`${label} duplicate stateKey ${row.stateKey}`);
    map.set(row.stateKey, row);
  }
  return map;
}

function sameJson(a, b) {
  return P.stableStringify(a) === P.stableStringify(b);
}

function identityFieldDiffs(a, b) {
  const fields = [];
  for (const field of P.RAW_IDENTITY_FIELDS) {
    if (!sameJson(a[field], b[field])) fields.push(field);
  }
  return fields;
}

function rowAudit(row) {
  const productionSerialization = P.stateSerialization(row.ruleState);
  const independentSerialization = I.serialize(row.ruleState);
  const productionKey = P.stateKey(row.ruleState);
  const independentKey = I.key(row.ruleState);
  return {
    stateKey: row.stateKey,
    terminal: row.ruleState.winner !== null,
    winner: row.ruleState.winner,
    pending: row.ruleState.pending,
    representedSeedsProduction: P.representedSeeds(row.ruleState),
    representedSeedsIndependent: I.seedCount(row.ruleState),
    serializersEqual: productionSerialization === independentSerialization,
    keysEqual: productionKey === independentKey,
    productionKeyMatchesStored: productionKey === row.stateKey,
    independentKeyMatchesStored: independentKey === row.stateKey,
    productionRecomputedKey: productionKey,
    independentRecomputedKey: independentKey,
  };
}

function summarizeAudits(audits) {
  return {
    rows: audits.length,
    representedSeedTotals: [...new Set(audits.map((row) => row.representedSeedsProduction))].sort((a, b) => a - b),
    serializerDisagreements: audits.filter((row) => !row.serializersEqual).length,
    recomputedKeyDisagreements: audits.filter((row) => !row.keysEqual).length,
    storedKeyMismatchRows: audits.filter((row) => !row.productionKeyMatchesStored || !row.independentKeyMatchesStored).length,
  };
}

function main(argv = process.argv.slice(2)) {
  const args = parseArgs(argv);
  const repository = readJson(args.repositoryResult);
  const production = readJson(args.originalProduction);
  const independent = readJson(args.originalIndependent);

  const repositoryRows = rowsFromRepository(repository);
  const productionRows = rowsFromProduction(production);
  const independentRows = rowsFromIndependent(independent);

  const repositoryMap = byKey(repositoryRows, "repository");
  const productionMap = byKey(productionRows, "production");
  const independentMap = byKey(independentRows, "independent");

  const repositoryKeys = [...repositoryMap.keys()].sort();
  const productionKeys = [...productionMap.keys()].sort();
  const independentKeys = [...independentMap.keys()].sort();
  const stateKeySetsEqual = sameJson(repositoryKeys, productionKeys) && sameJson(productionKeys, independentKeys);

  const originalProductionIndependentRowEquality = productionKeys.every((key) => {
    const p = productionMap.get(key);
    const i = independentMap.get(key);
    return i !== undefined && sameJson(p, i);
  });

  const repositoryDifferences = [];
  for (const key of productionKeys) {
    const p = productionMap.get(key);
    const r = repositoryMap.get(key);
    if (!r) {
      repositoryDifferences.push({ stateKey: key, kind: "MISSING-REPOSITORY-ROW", identityFields: null });
      continue;
    }
    const identityFields = identityFieldDiffs(p.ruleState, r.ruleState);
    const outcomeFields = [
      "status",
      "absoluteWinner",
      "dtf",
      "optimalMoveKeys",
      "recurrentMoveKeys",
      "sccId",
      "cyclicScc",
    ].filter((field) => !sameJson(p[field], r[field]));
    if (identityFields.length || outcomeFields.length) {
      repositoryDifferences.push({
        stateKey: key,
        kind: "ROW-DIFFERENCE",
        identityFields,
        outcomeFields,
        originalPending: p.ruleState.pending,
        repositoryPending: r.ruleState.pending,
        originalRepresentedSeeds: P.representedSeeds(p.ruleState),
        repositoryRepresentedSeeds: P.representedSeeds(r.ruleState),
      });
    }
  }

  const productionAudits = productionRows.map(rowAudit);
  const independentAudits = independentRows.map(rowAudit);
  const repositoryAudits = repositoryRows.map(rowAudit);

  const result = {
    schemaVersion: 1,
    studyId: "ORISC-STUDY1",
    stageId: "ORISC-STAGE0A-TECHNICAL-2026-08-25-v1",
    classification: "TECHNICAL-ONLY-PRIOR-PROVENANCE-AUDIT",
    technicalOnly: true,
    scientificOutcomeGenerated: false,
    formalRepresentationIntegrityDecisionGenerated: false,
    symmetryCandidateDecisionGenerated: false,
    mutatesUpstreamOracle: false,
    inputs: {
      repositoryResultPath: path.relative(process.cwd(), args.repositoryResult),
      originalProductionPath: args.originalProduction,
      originalIndependentPath: args.originalIndependent,
      originalWorkflowRunId: 32702596730,
      originalWorkflowArtifactId: 9511074442,
    },
    crossArtifact: {
      stateKeySetsEqual,
      originalProductionIndependentRowEquality,
      repositoryDifferenceRows: repositoryDifferences.length,
      repositoryDifferences,
    },
    originalProduction: {
      embeddedResultSha256: production.resultSha256,
      solutionSha256: production.solution.solutionSha256,
      audit: summarizeAudits(productionAudits),
      rows: productionAudits,
    },
    originalIndependent: {
      embeddedResultSha256: independent.resultSha256,
      productionResultSha256: independent.productionResultSha256,
      solutionSha256: independent.independent.solution.solutionSha256,
      verificationPassed: independent.passed,
      audit: summarizeAudits(independentAudits),
      rows: independentAudits,
    },
    repositoryFacing: {
      productionResultSha256Recorded: repository.identities?.productionResultSha256 ?? null,
      independentVerificationResultSha256Recorded: repository.identities?.independentVerificationResultSha256 ?? null,
      solutionSha256Recorded: repository.identities?.solutionSha256 ?? null,
      audit: summarizeAudits(repositoryAudits),
      rows: repositoryAudits,
    },
    interpretationBoundary: "Stage 0A reports prior technical provenance and representation observations only. It does not issue the ORISC Stage 1 formal integrity decision, does not alter REWR-STUDY1, and does not authorize or evaluate any nontrivial symmetry candidate.",
  };

  fs.mkdirSync(path.dirname(args.output), { recursive: true });
  fs.writeFileSync(args.output, `${JSON.stringify(result, null, 2)}\n`);
  process.stdout.write(`${JSON.stringify({
    stageId: result.stageId,
    technicalOnly: result.technicalOnly,
    scientificOutcomeGenerated: result.scientificOutcomeGenerated,
    stateKeySetsEqual: result.crossArtifact.stateKeySetsEqual,
    originalProductionIndependentRowEquality: result.crossArtifact.originalProductionIndependentRowEquality,
    repositoryDifferenceRows: result.crossArtifact.repositoryDifferenceRows,
    originalProductionAudit: result.originalProduction.audit,
    originalIndependentAudit: result.originalIndependent.audit,
    repositoryAudit: result.repositoryFacing.audit,
  }, null, 2)}\n`);
  return result;
}

if (require.main === module) main();
module.exports = { main, parseArgs };
