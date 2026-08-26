#!/usr/bin/env node
"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const E = require("../../public/engine.js");
const AI = require("../../public/ai.js");
const { seededRandom } = require("../benchmark.js");

const ROOT = path.resolve(__dirname, "../..");
const DEFAULT_OUT = path.join(ROOT, "artifacts/local/position-evaluation-empirical-outcome-calibration-replication/stage0-technical-v1");

function ensure(ok, message) { if (!ok) throw new Error(message); }
function sha256(value) { return crypto.createHash("sha256").update(value).digest("hex"); }
function parseOut(argv) {
  const i = argv.indexOf("--out");
  return i >= 0 ? path.resolve(argv[i + 1]) : DEFAULT_OUT;
}
function stable(value) {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stable).join(",")}]`;
  return `{${Object.keys(value).sort().map((k) => `${JSON.stringify(k)}:${stable(value[k])}`).join(",")}}`;
}
function rawState(state) {
  const required = ["pits","reserve","houseOwned","player","phase","winner","pending"];
  for (const field of required) ensure(Object.prototype.hasOwnProperty.call(state, field), `missing raw field ${field}`);
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
function rawKey(state) { return sha256(stable(rawState(state))); }
function representedSeeds(state) {
  const s = rawState(state);
  return s.pits.flat(2).reduce((a,b) => a + b, 0) + s.reserve[0] + s.reserve[1] + s.pending[0] + s.pending[1];
}
function fitIsotonic(rows) {
  const sorted = [...rows].sort((a,b) => a.z - b.z || a.id.localeCompare(b.id));
  const support = [];
  for (const row of sorted) {
    const last = support[support.length - 1];
    if (last && last.z === row.z) { last.weight += 1; last.sumY += row.y; }
    else support.push({ z: row.z, weight: 1, sumY: row.y });
  }
  const blocks = [];
  for (const point of support) {
    blocks.push({ minZ: point.z, maxZ: point.z, weight: point.weight, sumY: point.sumY, mean: point.sumY / point.weight });
    while (blocks.length >= 2 && blocks.at(-2).mean > blocks.at(-1).mean) {
      const r = blocks.pop(), l = blocks.pop();
      const weight = l.weight + r.weight, sumY = l.sumY + r.sumY;
      blocks.push({ minZ: l.minZ, maxZ: r.maxZ, weight, sumY, mean: sumY / weight });
    }
  }
  return blocks;
}
function bootstrapIndex(replicate, phase, draw, n) {
  return Number(BigInt(`0x${sha256(`PEOCR-S2-BOOT-v1|${replicate}|${phase}|${draw}`)}`) % BigInt(n));
}
function analyzeFixture(state) {
  const options = {
    evaluationProfile: "bao", searchProfile: "phase2", maxDepth: 2, timeLimitMs: Infinity,
    quiescenceDepth: 1, orderQuiescenceCaptures: false, adaptive: false,
    stableBestDepths: 0, aspirationWindow: 0,
  };
  return AI.analyzeMove(state, "hard", seededRandom(991), options);
}

function main() {
  const out = parseOut(process.argv.slice(2));
  const productionText = fs.readFileSync(path.join(out, "production.json"), "utf8");
  const production = JSON.parse(productionText);
  ensure(production.studyId === "PEOCR-STUDY1", "production study mismatch");
  ensure(production.passedProduction === true, "production did not pass");

  const gates = {};
  gates.productionFileHash = sha256(productionText) === JSON.parse(
    fs.readFileSync(path.join(out, "production-result.json"), "utf8")
  ).productionFileSha256;

  const fixtures = production.technical.fixtures;
  gates.phaseFixtures = fixtures.some((x) => x.state.phase === "namua") && fixtures.some((x) => x.state.phase === "mtaji");
  gates.rawIdentity = fixtures.every((x) => rawKey(x.state) === x.stateKey);
  gates.seedConservation = fixtures.every((x) => representedSeeds(x.state) === 64);
  gates.evaluation = fixtures.every((x) => {
    const actor = x.state.player;
    const a = AI.evaluate(x.state, actor);
    const b = AI.evaluate(x.state, actor);
    const o = AI.evaluate(x.state, 1 - actor);
    return Object.is(a, b) && Math.abs(a + o) <= 1e-9 && Object.is(a, x.actorEvalA);
  });
  gates.search = fixtures.every((x) => {
    const result = analyzeFixture(x.state);
    return AI.moveKey(result.move) === x.analysis.moveKeyA
      && Object.is(result.stats.rootScore, x.analysis.rootScoreA)
      && result.stats.completedDepth === 2 && result.stats.timedOut === false;
  });

  const isoRows = [
    { id:"a",z:-2,y:0 },{ id:"b",z:-1,y:1 },{ id:"c",z:0,y:0 },
    { id:"d",z:1,y:1 },{ id:"e",z:2,y:1 },{ id:"f",z:2,y:0 },
  ];
  gates.pava = stable(fitIsotonic(isoRows)) === stable(production.technical.pava.blocks);

  const metricRows = production.technical.properScoreRows;
  gates.metrics = metricRows.every((row) => {
    const b = (row.p - row.y) ** 2;
    const ll = -(row.y * Math.log(row.p) + (1 - row.y) * Math.log(1 - row.p));
    return Math.abs(b - row.brier) <= 1e-15 && Math.abs(ll - row.logLoss) <= 1e-15;
  });

  const bootstrap = Array.from({ length: 32 }, (_, i) => bootstrapIndex(7, "namua", i, 19));
  gates.bootstrap = stable(bootstrap) === stable(production.technical.bootstrapProbe);

  const specFiles = {
    stage0: "doc/position-evaluation-empirical-outcome-calibration-replication/preregistration/STAGE_0_TECHNICAL_SPEC.json",
    stage1: "doc/position-evaluation-empirical-outcome-calibration-replication/preregistration/STAGE_1_DEVELOPMENT_SPEC.json",
    stage2: "doc/position-evaluation-empirical-outcome-calibration-replication/preregistration/STAGE_2_FORMAL_SPEC.json",
  };
  gates.specHashes = Object.entries(specFiles).every(([key, file]) =>
    sha256(fs.readFileSync(path.join(ROOT, file), "utf8")) === production.provenance.specSha256[key]);

  gates.authorizationClosed = JSON.parse(fs.readFileSync(path.join(ROOT, specFiles.stage1), "utf8")).stage1GenerationAuthorized === false
    && JSON.parse(fs.readFileSync(path.join(ROOT, specFiles.stage2), "utf8")).stage2GenerationAuthorized === false;

  const passed = Object.values(gates).every(Boolean);
  const result = {
    schemaVersion: 1,
    studyId: "PEOCR-STUDY1",
    stageId: "PEOCR-S0-TECHNICAL-2026-08-26-v1",
    scientificInferenceAuthorized: false,
    confirmatoryReuseAllowed: false,
    passed,
    decision: passed ? "STAGE0-TECHNICAL-PASS" : "TECHNICALLY-INVALID",
    gates,
    verifiedProductionFileSha256: sha256(productionText),
  };
  fs.writeFileSync(path.join(out, "independent-verification.json"), `${JSON.stringify(result, null, 2)}\n`);
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  if (!passed) process.exitCode = 1;
}
try { main(); } catch (error) {
  console.error(error.stack || error.message);
  process.exitCode = 1;
}
