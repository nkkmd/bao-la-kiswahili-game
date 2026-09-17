#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const E = require("../../public/engine.js");
const P = require("./lib/lgttci-compatibility-production.js");
const I = require("./lib/lgttci-compatibility-independent.js");

const ROOT = path.resolve(__dirname, "../..");
const SPEC_PATH = path.join(ROOT, "doc/local-game-tree-geometry-transfer-compatibility-instrument/prereg/STAGE_1R_RETEST_SPEC.json");
const AUTH_PATH = path.join(ROOT, "doc/local-game-tree-geometry-transfer-compatibility-instrument/authorizations/STAGE_1R_EXECUTION_AUTHORIZATION.json");

function need(x, m) { if (!x) throw new Error(m); }
function stable(x) { return P.stable(x); }
function exact(a, b, label) { need(stable(a) === I.stable(b), `${label} production/independent mismatch`); }
function sha256Text(x) { return crypto.createHash("sha256").update(x, "utf8").digest("hex"); }
function hashByte(label, seed) { return parseInt(sha256Text(`${label}${seed}`).slice(0, 2), 16); }
function policyForSlot(seed) { return seed % 2 ? P.P1 : P.P2; }
function familyForSlot(seed) { return hashByte("LGTTCI-S1R-SILGM-RF|", seed) % 2 === 0 ? P.RF1 : P.RF2; }
function phaseForSlot(seed) { return hashByte("LGTTCI-S1R-SILGM-PHASE|", seed) % 2 === 0 ? "namua" : "mtaji"; }
function atomicWrite(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const tmp = `${file}.tmp-${process.pid}`;
  fs.writeFileSync(tmp, `${JSON.stringify(value)}\n`, "utf8");
  fs.renameSync(tmp, file);
}
function parseArgs() {
  const a = process.argv.slice(2); const out = {};
  for (let i = 0; i < a.length; i += 1) {
    if (a[i].startsWith("--")) out[a[i].slice(2)] = a[i + 1] && !a[i + 1].startsWith("--") ? a[++i] : true;
  }
  return out;
}
function inBlock(block, seed, spec) {
  const r = spec.freshSeedSlots.primary[block];
  return r && seed >= r.seedStart && seed <= r.seedEnd;
}
function stripRow(row) {
  if (!row) return null;
  return { ply: row.ply, phase: row.phase, terminal: row.terminal, rootLegalWidth: row.rootLegalWidth, rawStateSha256: row.rawStateSha256, state: row.state };
}
function main() {
  const args = parseArgs();
  const spec = JSON.parse(fs.readFileSync(SPEC_PATH, "utf8"));
  const block = String(args.block || "");
  const slotSeed = Number(args["slot-seed"]);
  const effectiveSeed = Number(args["effective-seed"] || slotSeed);
  const output = args.output;
  const technical = Boolean(args["technical-fixture"]);
  need(["SFCDF", "SILGM", "GCLD"].includes(block), "invalid block");
  need(Number.isInteger(slotSeed) && Number.isInteger(effectiveSeed), "seed required");
  need(output, "--output required");
  if (!technical) {
    need(fs.existsSync(AUTH_PATH), "Stage 1R final execution authorization absent");
    const auth = JSON.parse(fs.readFileSync(AUTH_PATH, "utf8"));
    need(auth.decision === "LGTTCI-STAGE1R-EXECUTION-AUTHORIZED", "Stage 1R not authorized");
    need(inBlock(block, slotSeed, spec), "slot seed outside frozen primary block");
    need(effectiveSeed === slotSeed || effectiveSeed === slotSeed + 1000000, "effective seed is not primary or paired reserve");
  }
  const policyId = policyForSlot(slotSeed);
  const a = P.replay(E, policyId, effectiveSeed, 80);
  const b = I.replay(E, policyId, effectiveSeed, 80);
  exact(a, b, `${block} replay slot=${slotSeed} effective=${effectiveSeed}`);
  const base = { schemaVersion: 1, stageId: spec.stageId, block, slotSeed, effectiveSeed, seedRole: effectiveSeed === slotSeed ? "PRIMARY" : "PAIRED-RESERVE", policyId, trajectorySha256: a.trajectorySha256 };
  let payload;
  if (block === "SFCDF") {
    const anchors = {};
    for (const familyId of [P.RF1, P.RF2]) {
      const pa = P.selectAnchors(a.rows, familyId); const ia = I.selectAnchors(a.rows, familyId); exact(pa, ia, `SFCDF anchors ${familyId}`);
      anchors[familyId] = { complete: pa.complete, namua: stripRow(pa.namua), mtaji: stripRow(pa.mtaji) };
    }
    payload = { ...base, anchors };
  } else if (block === "SILGM") {
    const familyId = familyForSlot(slotSeed); const phase = phaseForSlot(slotSeed);
    const pa = P.selectAnchors(a.rows, familyId); const ia = I.selectAnchors(a.rows, familyId); exact(pa, ia, "SILGM anchors");
    const root = phase === "namua" ? pa.namua : pa.mtaji;
    payload = { ...base, familyId, phase, root: stripRow(root) };
  } else {
    const checkpoints = [20, 28, 40, 52, 60].map(ply => stripRow(a.rows.find(r => r.ply === ply && !r.terminal) || null));
    payload = { ...base, checkpoints };
  }
  atomicWrite(path.resolve(output), payload);
  process.stdout.write(`${JSON.stringify({event:"SOURCE-UNIT-COMPUTED",block,slotSeed,effectiveSeed,output:path.resolve(output)})}\n`);
}
main();
