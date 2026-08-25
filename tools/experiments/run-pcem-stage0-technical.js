#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { performance } = require("node:perf_hooks");
const E = require("../../public/engine.js");
const Raw = require("./lib/ssgtc-representation-production.js");
const P = require("./lib/practical-comeback-stage0-production.js");

const STUDY_ID = "PCEM-STUDY1";
const STAGE_ID = "PCEM-S0-TECHNICAL-2026-08-25-v1";
const BASELINE_MAIN = "587472b7e1a3f6e390cdfea6ed0d8e0971d5711d";
const SEEDS = Array.from({ length: 16 }, (_, i) => 23100001 + i);
const OPPONENT_POLICIES = ["P_MEDIUM_D1_TOP3", "P_SHALLOW_UNIFORM"];

function ensure(ok, message) { if (!ok) throw new Error(message); }
function parseOut(argv) {
  const i = argv.indexOf("--out");
  return i >= 0 ? path.resolve(argv[i + 1]) : path.resolve(__dirname, "../../artifacts/local/practical-comeback-error-inducing-moves/stage0-technical-v1");
}
function trajectory(seed) {
  const rng = P.seededRandom(seed);
  let state = E.initialState();
  const rows = [];
  for (let ply = 0; ply <= 80; ply += 1) {
    Raw.assertStudyState(state);
    rows.push({ ply, state: Raw.rawRuleState(state), phase: state.phase, winner: state.winner,
      legalMoveCount: state.winner === null ? P.exactLegalMoves(state).length : 0 });
    if (state.winner !== null || ply === 80) break;
    const legal = P.exactLegalMoves(state);
    state = P.applyExactMove(state, legal[Math.floor(rng() * legal.length)]).state;
  }
  return rows;
}
function chooseRoots() {
  for (const seed of SEEDS) {
    const rows = trajectory(seed);
    const namua = rows.find((r) => r.ply >= 12 && r.phase === "namua" && r.winner === null && r.legalMoveCount >= 2);
    const mtaji = rows.find((r) => r.phase === "mtaji" && r.winner === null && r.legalMoveCount >= 2);
    if (namua && mtaji) return { seed, roots: [
      { fixtureId: "TECH-INITIAL", sourcePly: 0, state: Raw.rawRuleState(E.initialState()) },
      { fixtureId: "TECH-NAMUA", sourcePly: namua.ply, state: namua.state },
      { fixtureId: "TECH-MTAJI", sourcePly: mtaji.ply, state: mtaji.state },
    ] };
  }
  throw new Error("Frozen technical seed menu did not yield both phase fixtures");
}
function seedability(root, policyId) {
  const choices = [];
  let repeatable = true;
  for (let seed = 1; seed <= 8; seed += 1) {
    const a = P.selectPolicyMove(root, policyId, P.seededRandom(seed));
    const b = P.selectPolicyMove(root, policyId, P.seededRandom(seed));
    repeatable &&= a.moveKey === b.moveKey;
    choices.push(a.moveKey);
  }
  return { repeatable, distinctChoices: new Set(choices).size };
}

function main() {
  const out = parseOut(process.argv.slice(2));
  fs.rmSync(out, { recursive: true, force: true });
  fs.mkdirSync(out, { recursive: true });
  const start = performance.now();
  const gates = {};
  const initial = E.initialState();
  Raw.assertStudyState(initial);
  gates.rawShape = true;
  gates.seedConservation = Raw.representedSeeds(initial) === 64;
  const missing = Raw.clone(initial); delete missing.pending;
  try { Raw.assertStudyState(missing); gates.missingPendingRejected = false; }
  catch (e) { gates.missingPendingRejected = /pending/.test(e.message); }

  const selected = chooseRoots();
  const roots = [];
  let continuationRows = 0;
  let accountedRows = 0;
  for (const fixture of selected.roots) {
    Raw.assertStudyState(fixture.state);
    const legal = P.exactLegalMoves(fixture.state);
    const d2a = P.referenceSearch(fixture.state, 2);
    const d2b = P.referenceSearch(fixture.state, 2);
    const d3a = P.referenceSearch(fixture.state, 3);
    const d3b = P.referenceSearch(fixture.state, 3);
    ensure(P.canonicalHash(d2a) === P.canonicalHash(d2b), "D2 reference nondeterminism");
    ensure(P.canonicalHash(d3a) === P.canonicalHash(d3b), "D3 reference nondeterminism");
    const replies = legal.map((move) => P.replyAudit(fixture.state, move, 2));
    const policyProbe = Object.fromEntries(OPPONENT_POLICIES.map((id) => [id, seedability(fixture.state, id)]));
    const continuations = [];
    for (const move of legal) for (const opponentPolicyId of OPPONENT_POLICIES) for (let replicateIndex = 0; replicateIndex < 2; replicateIndex += 1) {
      const record = P.runAsymmetricContinuation(fixture.state, move, replicateIndex, {
        actorPolicyId: "P_REFERENCE_D2_BEST", opponentPolicyId, maxPostRootPlies: 16,
      });
      continuations.push(record); continuationRows += 1;
      if (record.outcome && record.outcome.category !== "TECHNICALLY_INVALID") accountedRows += 1;
    }
    roots.push({ fixtureId: fixture.fixtureId, sourcePly: fixture.sourcePly,
      rawStateKey: Raw.stateKey(fixture.state), rawState: Raw.rawRuleState(fixture.state),
      phase: fixture.state.phase, legalMoveKeys: legal.map(Raw.moveKey),
      reference: { D2: d2a, D3: d3a }, replies, policyProbe, continuations });
  }

  gates.phaseFixtures = roots.some((r) => r.phase === "namua") && roots.some((r) => r.phase === "mtaji");
  gates.legalMoveEnumeration = roots.every((r) => r.legalMoveKeys.length >= 2 && new Set(r.legalMoveKeys).size === r.legalMoveKeys.length);
  gates.replyEnumeration = roots.every((r) => r.replies.length === r.legalMoveKeys.length && r.replies.every((x) => x.legalReplyCount === x.legalReplyMoveKeys.length));
  gates.referenceFinite = roots.every((r) => [r.reference.D2, r.reference.D3].every((t) => t.candidates.every((c) => Number.isFinite(c.score))));
  gates.policySeedability = roots.every((r) => OPPONENT_POLICIES.every((id) => r.policyProbe[id].repeatable))
    && OPPONENT_POLICIES.every((id) => roots.some((r) => r.policyProbe[id].distinctChoices >= 2));
  gates.outcomeAccounting = continuationRows > 0 && accountedRows === continuationRows;
  gates.commonRngBinding = roots.every((r) => {
    const m = new Map();
    for (const x of r.continuations) { const k = `${x.opponentPolicyId}|${x.replicateIndex}`; const s = m.get(k) || new Set(); s.add(x.seed32); m.set(k, s); }
    return [...m.values()].every((s) => s.size === 1);
  });
  gates.replyReferenceIdentifiable = roots.every((r) => r.replies.every((x) => x.terminalAfterRootMove || x.referenceBestReplyMoveKeys.length >= 1));

  const production = { schemaVersion: 1, studyId: STUDY_ID, stageId: STAGE_ID, baselineMain: BASELINE_MAIN,
    scientificInferenceAuthorized: false, confirmatoryReuseAllowed: false,
    design: { selectedTechnicalTrajectorySeed: selected.seed, seedMenu: SEEDS, referenceDepths: [2,3], replyReferenceDepth: 2,
      continuationReplicates: 2, continuationHorizon: 16, actorPolicyId: "P_REFERENCE_D2_BEST", opponentPolicyIds: OPPONENT_POLICIES,
      searchSemantics: P.SEARCH_SEMANTICS, stageSalt: P.STAGE_SALT }, roots };
  production.productionSha256 = P.canonicalHash(production);
  const productionPath = path.join(out, "production.json");
  fs.writeFileSync(productionPath, `${JSON.stringify(production, null, 2)}\n`);
  const elapsedMs = performance.now() - start;
  const maxRSSMiB = process.resourceUsage().maxRSS / 1024;
  const artifactBytes = fs.statSync(productionPath).size;
  gates.resourceProfile = elapsedMs <= 120000 && maxRSSMiB <= 1024 && artifactBytes <= 25 * 1024 * 1024;
  const passedProduction = Object.values(gates).every(Boolean);
  const result = { schemaVersion: 1, studyId: STUDY_ID, stageId: STAGE_ID, scientificInferenceAuthorized: false,
    decision: passedProduction ? "PRODUCTION-TECHNICAL-PASS-PENDING-INDEPENDENT-VERIFICATION" : "TECHNICALLY-INVALID",
    passedProduction, gates, technicalOnly: { fixtureCount: roots.length, phasesCovered: [...new Set(roots.map((r) => r.phase))].sort(),
      continuationRows, accountedRows, resource: { elapsedMs, maxRSSMiB, artifactBytes } },
    provenance: { baselineMain: BASELINE_MAIN, productionSha256: production.productionSha256, productionFileSha256: P.sha256(fs.readFileSync(productionPath, "utf8")) } };
  fs.writeFileSync(path.join(out, "production-technical-result.json"), `${JSON.stringify(result, null, 2)}\n`);
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  if (!passedProduction) process.exitCode = 1;
}
try { main(); } catch (error) { console.error(error.stack || error.message); process.exitCode = 1; }
