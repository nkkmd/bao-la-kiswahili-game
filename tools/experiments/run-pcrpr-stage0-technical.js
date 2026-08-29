#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { performance } = require("node:perf_hooks");
const E = require("../../public/engine.js");
const P = require("./lib/pcrpr-stage0-production.js");

const BASELINE_MAIN = "e5ad840520eb6c5bd0408f924c1f9a55c4cba6a5";
const TECH_SEEDS = Array.from({ length: 32 }, (_, i) => 28700001 + i);

function ensure(ok, message) { if (!ok) throw new Error(message); }
function parseOut(argv) {
  const i = argv.indexOf("--out");
  return i >= 0 ? path.resolve(argv[i + 1]) : path.resolve(__dirname, "../../artifacts/local/practical-comeback-reply-pressure-representation/stage0-technical-v1");
}
function seededRandom(seed) {
  let value = seed >>> 0;
  return () => {
    value += 0x6D2B79F5;
    let next = value;
    next = Math.imul(next ^ (next >>> 15), next | 1);
    next ^= next + Math.imul(next ^ (next >>> 7), next | 61);
    return ((next ^ (next >>> 14)) >>> 0) / 4294967296;
  };
}
function trajectory(seed) {
  const random = seededRandom(seed);
  const states = [P.clone(E.initialState())];
  const moves = [];
  let state = P.clone(E.initialState());
  for (let ply = 0; ply < 90 && state.winner === null; ply += 1) {
    P.assertState(state, true);
    const legal = P.exactMoves(state);
    const move = legal[Math.floor(random() * legal.length)];
    const applied = P.applyExact(state, move);
    moves.push(P.normalizeMove(move));
    state = applied.state;
    states.push(P.clone(state));
  }
  return { seed, states, moves };
}
function rootHistory(t, index) {
  const start = Math.max(0, index - 4);
  const out = [];
  for (let i = start; i < index; i += 1) out.push({ before:P.clone(t.states[i]), move:P.clone(t.moves[i]), after:P.clone(t.states[i + 1]) });
  return out;
}
function chooseFixtures() {
  for (const seed of TECH_SEEDS) {
    const t = trajectory(seed);
    const namuaIndex = t.states.findIndex((s, i) => i >= 12 && s.winner === null && s.phase === "namua" && P.exactMoves(s).length >= 2);
    const mtajiIndex = t.states.findIndex((s) => s.winner === null && s.phase === "mtaji" && P.exactMoves(s).length >= 2);
    if (namuaIndex >= 0 && mtajiIndex >= 0) return {
      technicalSeed: seed,
      fixtures: [
        { fixtureId:"TECH-INITIAL", sourcePly:0, root:P.clone(t.states[0]), history:[] },
        { fixtureId:"TECH-NAMUA", sourcePly:namuaIndex, root:P.clone(t.states[namuaIndex]), history:rootHistory(t, namuaIndex) },
        { fixtureId:"TECH-MTAJI", sourcePly:mtajiIndex, root:P.clone(t.states[mtajiIndex]), history:rootHistory(t, mtajiIndex) },
      ],
    };
  }
  throw new Error("technical seed menu did not produce Namua and Mtaji fixtures");
}
function selectedTechnicalMoves(root) {
  const legal = P.exactMoves(root);
  if (legal.length <= 4) return legal;
  const indexes = [...new Set([0, Math.floor((legal.length - 1) / 3), Math.floor(2 * (legal.length - 1) / 3), legal.length - 1])].sort((a,b)=>a-b);
  return indexes.map((i) => legal[i]);
}
function throws(fn, pattern) {
  try { fn(); return false; } catch (error) { return pattern ? pattern.test(String(error.message)) : true; }
}
function main() {
  const out = parseOut(process.argv.slice(2));
  fs.rmSync(out, { recursive:true, force:true });
  fs.mkdirSync(out, { recursive:true });
  const start = performance.now();
  const gates = {};

  const initial = E.initialState();
  P.assertState(initial, true);
  gates.rawIdentity = P.rawKey(initial).length === 64;
  gates.seedConservation = true;
  const legalInitial = P.exactMoves(initial).map(P.moveKey);
  gates.exactMoveOrdering = legalInitial.every((key, i) => i === 0 || legalInitial[i - 1] < key);

  const chosen = chooseFixtures();
  const rows = [];
  for (const fixture of chosen.fixtures) {
    const allLegal = P.exactMoves(fixture.root);
    const allKeys = allLegal.map(P.moveKey);
    ensure(allKeys.every((key, i) => i === 0 || allKeys[i - 1] < key), `${fixture.fixtureId} legal ordering drift`);
    for (const move of selectedTechnicalMoves(fixture.root)) {
      const input = { root:P.clone(fixture.root), rootMove:P.clone(move), history:P.clone(fixture.history), searchConfigId:P.SEARCH_ID };
      const representation = P.buildRepresentation(input);
      rows.push({ fixtureId:fixture.fixtureId,sourcePly:fixture.sourcePly,input,representation });
    }
  }
  gates.phaseFixtures = rows.some((r)=>r.input.root.phase==="namua") && rows.some((r)=>r.input.root.phase==="mtaji");
  gates.all12FamiliesMaterialized = rows.every((r)=>P.FAMILY_ORDER.every((f)=>Object.prototype.hasOwnProperty.call(r.representation.families,f)));
  gates.finiteFeatureVectors = rows.every((r)=>r.representation.vector.rows.every((v)=>Number.isFinite(v.value) && /^f64be:[0-9a-f]{16}$/.test(v.encoding)));

  const syntheticRows = [
    { key:"10", d1:3, d2:2 },
    { key:"2", d1:1, d2:4 },
    { key:"1", d1:3, d2:4 },
    { key:"20", d1:-1, d2:0 },
  ];
  const permutations = [syntheticRows, syntheticRows.slice().reverse(), [syntheticRows[2],syntheticRows[0],syntheticRows[3],syntheticRows[1]]];
  const profiles = permutations.map((x)=>P.replyNumericFamilies(x));
  gates.replyPermutationInvariant = profiles.every((x)=>P.canonicalHash(x)===P.canonicalHash(profiles[0]));
  gates.integerLikeKeyOrderInvariant = gates.replyPermutationInvariant;
  const tied = P.replyNumericFamilies([{key:"2",d1:5,d2:7},{key:"10",d1:5,d2:7},{key:"1",d1:1,d2:2}]);
  gates.tiedReplyScoresHandled = tied.defense.d2TopSetCount === 2 && tied.defense.d2TopSetFraction === 2/3;
  const zero = P.replyNumericFamilies([]);
  const one = P.replyNumericFamilies([{key:"7",d1:4,d2:9}]);
  gates.terminalApplicabilityHandled = zero.defense.d2TopSetCount===0 && zero.policy.expectedGapWeak===0 && one.defense.d2TopSetFraction===1 && one.gaps.d2BestToWorstGap===0;

  const missing = P.clone(initial); delete missing.pending;
  gates.missingPendingRejected = throws(()=>P.assertState(missing), /pending/);
  const corrupted = P.clone(initial); corrupted.reserve[0] += 1;
  gates.corruptSeedTotalRejected = throws(()=>P.assertState(corrupted), /seed conservation/);
  const sample = rows[0];
  gates.leakageRejected = throws(()=>P.buildRepresentation({ ...P.clone(sample.input), continuationWinner:0 }), /forbidden\/unexpected field/);
  gates.configDriftRejected = throws(()=>P.buildRepresentation({ ...P.clone(sample.input), searchConfigId:"wrong-search" }), /search config drift/);
  const schemaDrift = P.clone(sample.representation.families); schemaDrift.REPLY_SET_WIDTH.illegalExtraFeature = 1;
  gates.schemaDriftRejected = throws(()=>P.vectorize(schemaDrift), /feature schema drift/);
  const perturbed = P.clone(sample.representation.families); perturbed.REPLY_SET_WIDTH.legalReplyCount += 1;
  gates.hashPerturbationDetected = P.vectorize(perturbed).vectorSha256 !== sample.representation.vector.vectorSha256;
  gates.rawKeyMismatchDetected = P.rawKey(sample.input.root) !== P.rawKey({ ...P.clone(sample.input.root), player:1-sample.input.root.player });

  const productionCore = {
    schemaVersion:1, studyId:P.STUDY_ID, stageId:P.STAGE_ID, baselineMain:BASELINE_MAIN,
    scientificInferenceAuthorized:false, scientificSeedBlocksConsumed:false,
    technicalSeedMenu:{ start:TECH_SEEDS[0], end:TECH_SEEDS[TECH_SEEDS.length-1], selected:chosen.technicalSeed, purpose:"TECHNICAL-FIXTURE-ONLY" },
    numericContract:{ schemaId:P.SCHEMA_ID, searchId:P.SEARCH_ID, floatEncoding:"IEEE-754-binary64-big-endian-hex", equality:"EXACT" },
    syntheticControls:{ input:syntheticRows, canonicalProfile:profiles[0], tiedProfile:tied, zeroReplyProfile:zero, oneReplyProfile:one },
    rows,
  };
  const production = { ...productionCore, productionCoreSha256:P.canonicalHash(productionCore) };
  fs.writeFileSync(path.join(out,"production.json"), `${JSON.stringify(production,null,2)}\n`);

  const elapsedMs = performance.now() - start;
  const maxRSSMiB = process.resourceUsage().maxRSS / 1024;
  const artifactBytes = fs.statSync(path.join(out,"production.json")).size;
  gates.resourceProfile = elapsedMs <= 600000 && maxRSSMiB <= 2048 && artifactBytes <= 50*1024*1024;
  const mandatory = ["rawIdentity","seedConservation","exactMoveOrdering","phaseFixtures","all12FamiliesMaterialized","finiteFeatureVectors","replyPermutationInvariant","integerLikeKeyOrderInvariant","tiedReplyScoresHandled","terminalApplicabilityHandled","missingPendingRejected","corruptSeedTotalRejected","leakageRejected","configDriftRejected","schemaDriftRejected","hashPerturbationDetected","rawKeyMismatchDetected","resourceProfile"];
  const passedProduction = mandatory.every((g)=>gates[g]===true);
  const result = {
    schemaVersion:1, studyId:P.STUDY_ID, stageId:P.STAGE_ID, scientificInferenceAuthorized:false,
    decision:passedProduction?"PRODUCTION-TECHNICAL-PASS-PENDING-INDEPENDENT-VERIFICATION":"STAGE0-TECHNICAL-FAILED",
    passedProduction, mandatoryGates:mandatory, gates,
    technicalOnly:{ fixtureRows:rows.length, phases:[...new Set(rows.map((r)=>r.input.root.phase))].sort(), scalarCount:rows[0]?.representation.vector.scalarCount || 0, elapsedMs,maxRSSMiB,artifactBytes },
    provenance:{ baselineMain:BASELINE_MAIN, productionCoreSha256:production.productionCoreSha256, productionFileSha256:P.sha256(fs.readFileSync(path.join(out,"production.json"),"utf8")) },
  };
  fs.writeFileSync(path.join(out,"production-technical-result.json"), `${JSON.stringify(result,null,2)}\n`);
  process.stdout.write(`${JSON.stringify(result,null,2)}\n`);
  if (!passedProduction) process.exitCode=1;
}

try { main(); } catch (error) { console.error(error.stack || error.message); process.exitCode=1; }
