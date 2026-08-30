#!/usr/bin/env node
"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const { performance } = require("node:perf_hooks");
const E = require("../../public/engine.js");
const P = require("./lib/tmgc-stage0-production.js");
const I = require("./lib/tmgc-stage0-independent.js");

const ROOT = path.resolve(__dirname, "../..");
const OUT = path.resolve(process.argv[2] || "artifacts/local/tmgc-stage0-technical");
const STAGE_ID = "TMGC-S0-TECHNICAL-2026-08-30-v1";
const CANDIDATE_PATH = path.join(ROOT, "doc/tactical-motifs/preregistration/STAGE_2_FORMAL_CANDIDATES.json");
const SPEC_PATH = path.join(ROOT, "doc/tactical-motifs/preregistration/STAGE_2_FORMAL_SPEC.json");
const AUTH_PATH = path.join(ROOT, "doc/tactical-motifs/preregistration/STAGE_2_FORMAL_AUTHORIZATION.json");
const REF_PATH = path.join(ROOT, "doc/tactical-motif-generalization-counterexample/preregistration/UPSTREAM_C03_FROZEN_REFERENCE.json");

function sha256(value) { return crypto.createHash("sha256").update(value).digest("hex"); }
function readText(file) { return fs.readFileSync(file, "utf8"); }
function readJson(file) { return JSON.parse(readText(file)); }
function assert(condition, message) { if (!condition) throw new Error(message); }
function clone(value) { return JSON.parse(JSON.stringify(value)); }

function emptyPits() { return [Array(8).fill(0), Array(8).fill(0)]; }
function baseMtaji(backSeeds) {
  const pits = [emptyPits(), emptyPits()];
  pits[0][E.FRONT][E.HOUSE] = 1;
  pits[0][E.BACK][0] = backSeeds;
  pits[1][E.FRONT][E.HOUSE] = 1;
  pits[1][E.BACK][0] = 2;
  return {
    pits,
    reserve: [0, 0],
    houseOwned: [true, true],
    player: 0,
    phase: "mtaji",
    winner: null,
    reason: "",
    turn: 80,
    pending: [0, 0],
  };
}
function fixtures() {
  const positive = baseMtaji(2);
  const negative = baseMtaji(6);
  const frontBlocked = baseMtaji(2);
  frontBlocked.pits[0][E.FRONT][0] = 2;
  return [
    { id: "SYN-C03-PRIMARY-PASS", state: positive, expectedEligible: true, expectedStructural: true },
    { id: "SYN-C03-PRIMARY-FAIL", state: negative, expectedEligible: true, expectedStructural: false },
    { id: "SYN-C03-BACK-MOVE-INELIGIBLE", state: frontBlocked, expectedEligible: false, expectedStructural: null },
    { id: "SYN-C03-NAMUA-PHASE-CONTROL", state: E.initialState(), expectedEligible: false, expectedStructural: null },
  ];
}
function normalized(row) {
  const copy = clone(row);
  delete copy.semantics;
  return copy;
}
function compareRows(production, independent) {
  return P.stableStringify(normalized(production)) === I.stableStringify(normalized(independent));
}
function provenanceAudit(reference, auth) {
  const fileBindings = [
    [CANDIDATE_PATH, reference.candidateSource.sha256],
    [SPEC_PATH, reference.specSource.sha256],
    [AUTH_PATH, reference.authorizationSource.sha256],
  ].map(([file, expected]) => ({
    path: path.relative(ROOT, file),
    expected,
    actual: sha256(readText(file)),
  }));
  const sourceBindings = Object.entries(auth.authorizedSourceFileSha256).map(([relative, expected]) => {
    const file = path.join(ROOT, relative);
    return {
      path: relative,
      expected,
      actual: fs.existsSync(file) ? sha256(fs.readFileSync(file)) : null,
      exists: fs.existsSync(file),
    };
  });
  return {
    documentBindings: fileBindings,
    sourceBindings,
    documentBindingsPass: fileBindings.every((row) => row.actual === row.expected),
    sourceBindingsPass: sourceBindings.every((row) => row.exists && row.actual === row.expected),
  };
}
function helperSeparationAudit() {
  const file = path.join(ROOT, "tools/experiments/lib/tmgc-stage0-independent.js");
  const text = readText(file);
  const forbidden = [
    "tactical-motif-features",
    "tactical-motif-discovery",
    "tactical-motif-stage2-formal",
    "position-typology-features",
    "position-complexity-search-diagnostic",
  ];
  return {
    passed: forbidden.every((token) => !text.includes(token)),
    forbiddenTokensAbsent: Object.fromEntries(forbidden.map((token) => [token, !text.includes(token)])),
  };
}
function rawIdentityControl(state) {
  const metadata = clone(state);
  metadata.turn += 999;
  metadata.reason = "TECHNICAL-METADATA-SENTINEL";
  const pending = clone(state);
  pending.pending[0] += 1;
  return {
    productionIndependentEqual: P.analyzeFixture(state, c03()).rawIdentityHash === I.rawIdentityHash(state),
    turnReasonExcluded: I.rawIdentityHash(state) === I.rawIdentityHash(metadata),
    pendingIncluded: I.rawIdentityHash(state) !== I.rawIdentityHash(pending),
  };
}
let cachedC03 = null;
function c03() {
  if (cachedC03) return cachedC03;
  const candidates = readJson(CANDIDATE_PATH);
  cachedC03 = candidates.formalCandidates.find((row) => row.candidateId === "TM-S2-C03");
  if (!cachedC03) throw new Error("TM-S2-C03 missing from upstream candidate file");
  return cachedC03;
}
function phaseTransportAudit(candidate) {
  const engineText = readText(path.join(ROOT, "public/engine.js"));
  const start = engineText.indexOf("function legalNamuaMoves");
  const end = engineText.indexOf("function legalMtajiMoves");
  assert(start >= 0 && end > start, "Could not isolate legalNamuaMoves source");
  const namuaSource = engineText.slice(start, end);
  const directFamily = JSON.parse(candidate.moveAbstractionToken.slice(candidate.moveAbstractionToken.indexOf(":", 5) + 1));
  const namuaRowsAreFrontOnly = namuaSource.includes("row: FRONT") && !namuaSource.includes("row: BACK");
  const originalRequiresBackRow = directFamily.row === E.BACK;
  return {
    passed: namuaRowsAreFrontOnly && originalRequiresBackRow && candidate.phase === "mtaji",
    originalPhase: candidate.phase,
    originalRow: directFamily.row,
    namuaLegalMoveConstructionRows: "FRONT-only (plus pass)",
    directNamuaTransportDisposition: "TECHNICALLY-INELIGIBLE",
    reason: "Changing phase alone cannot yield the frozen row-1/back-row C03 move family in Namua; changing row would define a new construct rather than transport C03.",
  };
}
function main() {
  const wallStart = performance.now();
  fs.rmSync(OUT, { recursive: true, force: true });
  fs.mkdirSync(OUT, { recursive: true });

  const reference = readJson(REF_PATH);
  const auth = readJson(AUTH_PATH);
  const candidate = c03();
  assert(candidate.candidateId === reference.candidate.candidateId, "Upstream reference candidate ID mismatch");
  assert(candidate.canonicalCandidateKey === reference.candidate.canonicalCandidateKey, "Upstream reference candidate key mismatch");
  assert(candidate.consequence === reference.candidate.consequence, "Upstream reference consequence mismatch");
  assert(P.stableStringify(candidate.preconditions) === P.stableStringify(reference.candidate.preconditions), "Upstream reference precondition mismatch");

  const provenance = provenanceAudit(reference, auth);
  assert(provenance.documentBindingsPass, "Upstream document SHA-256 binding failed");
  assert(provenance.sourceBindingsPass, "Current source no longer matches first-generation authorization-bound source set");

  const fixtureRows = [];
  const runtimes = [];
  for (const fixture of fixtures()) {
    const start = performance.now();
    const production = P.analyzeFixture(fixture.state, candidate);
    const independent = I.analyzeFixture(fixture.state, candidate);
    const exact = compareRows(production, independent);
    assert(exact, `Production/independent mismatch at ${fixture.id}`);
    assert(production.eligible === fixture.expectedEligible, `Eligibility control failed at ${fixture.id}`);
    if (fixture.expectedStructural !== null) {
      assert(production.structuralSuccess === fixture.expectedStructural, `Structural control failed at ${fixture.id}`);
    }
    fixtureRows.push({
      id: fixture.id,
      expectedEligible: fixture.expectedEligible,
      expectedStructural: fixture.expectedStructural,
      productionIndependentExact: exact,
      analysis: production,
    });
    runtimes.push({ id: fixture.id, milliseconds: performance.now() - start });
  }

  const helperSeparation = helperSeparationAudit();
  assert(helperSeparation.passed, "Independent implementation imports prohibited shared motif/search helpers");
  const identity = rawIdentityControl(fixtures()[0].state);
  assert(Object.values(identity).every(Boolean), "RAW identity control failed");
  const phaseTransport = phaseTransportAudit(candidate);
  assert(phaseTransport.passed, "Phase-transport semantic audit failed");

  const result = {
    schemaVersion: "TMGC_STAGE0_CORE_TECHNICAL_RESULT_V1",
    studyId: "TMGC-STUDY1",
    stageId: STAGE_ID,
    stageType: "TECHNICAL_ONLY",
    scientificInferenceAuthorized: false,
    scientificSeedUseAllowed: false,
    reservedScientificSeedUse: false,
    formalStage0Disposition: "PENDING",
    interimCoreDisposition: "CORE-SEMANTICS-AND-PROVENANCE-PASS",
    upstreamCandidate: {
      candidateId: candidate.candidateId,
      canonicalCandidateKey: candidate.canonicalCandidateKey,
      consequence: candidate.consequence,
      pairedConsequence: candidate.pairedDiagnosticDefinition.consequence,
    },
    provenance,
    controls: {
      productionIndependentHelperSeparation: helperSeparation,
      rawIdentity: identity,
      phaseTransport,
      structuralPositiveControl: fixtureRows.find((row) => row.id === "SYN-C03-PRIMARY-PASS").analysis.structuralSuccess === true,
      structuralCounterexampleControl: fixtureRows.find((row) => row.id === "SYN-C03-PRIMARY-FAIL").analysis.structuralSuccess === false,
    },
    fixtures: fixtureRows,
    runtime: {
      perFixture: runtimes,
      totalMilliseconds: performance.now() - wallStart,
      maxRssKb: process.resourceUsage().maxRSS,
    },
    nextMandatoryWork: [
      "fresh-source-generator-feasibility",
      "outcome-independent-generalization-axis-freeze",
      "source-policy-balance-and-opening-prefix-diversity-gate-design",
      "stage1-stage2-firewall-tooling",
      "runtime-memory-artifact-size-shard-transfer-preflight",
      "runner-local-final-exact-comparison-feasibility"
    ]
  };
  const serialized = `${JSON.stringify(result, null, 2)}\n`;
  result.artifact = {
    jsonBytesBeforeArtifactField: Buffer.byteLength(serialized),
    sha256BeforeArtifactField: sha256(serialized),
  };
  fs.writeFileSync(path.join(OUT, "STAGE_0_CORE_TECHNICAL_RESULT.json"), `${JSON.stringify(result, null, 2)}\n`);
  fs.writeFileSync(path.join(OUT, "fixtures.json"), `${JSON.stringify(fixtures(), null, 2)}\n`);
  console.log(JSON.stringify(result, null, 2));
}

if (require.main === module) main();
