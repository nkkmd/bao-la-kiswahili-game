"use strict";

const crypto = require("node:crypto");
const L = require("./lgttci-compatibility-production.js");
const S = require("./sfcdf-production.js");

const STUDY_ID = "SFCDFT-STUDY1";
const C1 = "SFCDF-C1-UNIT-WIDTH-OCCUPANCY-FRACTION";
const C6 = "SFCDF-C6-CUMULATIVE-TREE-RAW-RATIO";
const P1 = L.P1;
const P2 = L.P2;
const RF1 = L.RF1;
const RF2 = L.RF2;

function need(x, m) { if (!x) throw new Error(m); }
function sha256Text(x) { return crypto.createHash("sha256").update(String(x), "utf8").digest("hex"); }
function canonical(x) { return L.stable(x); }
function digest(x) { return sha256Text(typeof x === "string" ? x : canonical(x)); }
function copy(x) { return JSON.parse(JSON.stringify(x)); }

function policyForSeed(seed) {
  need(Number.isInteger(seed), "seed must be integer");
  return seed % 2 === 1 ? P1 : P2;
}
function familyForSeed(stageId, seed) {
  need(typeof stageId === "string" && stageId.length > 0, "stageId required");
  need(Number.isInteger(seed), "seed must be integer");
  const byte = Number.parseInt(sha256Text(`${stageId}|RF|${seed}`).slice(0, 2), 16);
  return byte % 2 === 0 ? RF1 : RF2;
}
function domainId(policyId, familyId) {
  if (policyId === P1 && familyId === RF1) return "SFCDFT-D1-P1-RF1";
  if (policyId === P1 && familyId === RF2) return "SFCDFT-D2-P1-RF2";
  if (policyId === P2 && familyId === RF1) return "SFCDFT-D3-P2-RF1";
  if (policyId === P2 && familyId === RF2) return "SFCDFT-D4-P2-RF2";
  throw new Error(`unknown policy/family domain ${policyId}/${familyId}`);
}
function openingPrefix(moveKeys) {
  need(Array.isArray(moveKeys) && moveKeys.length >= 16, "at least 16 moves required for opening prefix");
  const keys = moveKeys.slice(0, 16);
  return { openingPrefixLength: 16, openingPrefixSha256: sha256Text(keys.join("\n")) };
}
function replaySource(E, stageId, seed, maxPly = 240) {
  const policyId = policyForSeed(seed);
  const familyId = familyForSeed(stageId, seed);
  const replay = L.replay(E, policyId, seed, maxPly);
  const prefix = openingPrefix(replay.moveKeys);
  const anchors = L.selectAnchors(replay.rows, familyId);
  return {
    stageId,
    seed,
    policyId,
    familyId,
    domainId: domainId(policyId, familyId),
    trajectorySha256: replay.trajectorySha256,
    ...prefix,
    moveCount: replay.moveKeys.length,
    terminal: replay.terminal,
    anchors,
    replay
  };
}
function endpointPair(E, rootRow, sourceIdentity) {
  need(rootRow && rootRow.state && Number.isInteger(rootRow.ply), "root row required");
  need(sourceIdentity && Number.isInteger(sourceIdentity.seed), "source identity seed required");
  need(typeof sourceIdentity.trajectorySha256 === "string", "source trajectory identity required");
  need(typeof sourceIdentity.openingPrefixSha256 === "string" && sourceIdentity.openingPrefixLength === 16, "source opening-prefix identity required");
  const source = {
    phase: rootRow.phase,
    sourceSeed: sourceIdentity.seed,
    selectedPly: rootRow.ply,
    rootRawSha256: rootRow.rawStateSha256,
    sourceTrajectorySha256: sourceIdentity.trajectorySha256,
    openingPrefixSha256: sourceIdentity.openingPrefixSha256,
    openingPrefixLength: sourceIdentity.openingPrefixLength,
    rootState: copy(rootRow.state)
  };
  const measured = S.measureRoot(E, source);
  const c1 = measured.sfcdf.endpoints[C1];
  const c6 = measured.sfcdf.endpoints[C6];
  need(c1 && c6, "C1/C6 endpoint missing");
  return {
    rootRawSha256: rootRow.rawStateSha256,
    ply: rootRow.ply,
    phase: rootRow.phase,
    endpoints: { [C1]: c1, [C6]: c6 },
    measurementDigest: digest(measured)
  };
}
function gcd(a, b) { a = a < 0n ? -a : a; b = b < 0n ? -b : b; while (b !== 0n) [a, b] = [b, a % b]; return a; }
function fraction(n, d) {
  n = BigInt(n); d = BigInt(d);
  if (d === 0n) return { numerator: "0", denominator: "0", defined: false };
  if (d < 0n) { n = -n; d = -d; }
  const g = gcd(n, d) || 1n;
  return { numerator: String(n / g), denominator: String(d / g), defined: true };
}
function subtract(a, b) {
  if (!a || !b || !a.defined || !b.defined) return fraction(0n, 0n);
  return fraction(BigInt(a.numerator) * BigInt(b.denominator) - BigInt(b.numerator) * BigInt(a.denominator), BigInt(a.denominator) * BigInt(b.denominator));
}
function sign(q) {
  if (!q || !q.defined) return null;
  const n = BigInt(q.numerator);
  return n > 0n ? 1 : n < 0n ? -1 : 0;
}
function leq(a, b) {
  need(a && b && a.defined && b.defined, "defined fractions required");
  return BigInt(a.numerator) * BigInt(b.denominator) <= BigInt(b.numerator) * BigInt(a.denominator);
}
function fixedEightHolm(slots) {
  need(Array.isArray(slots) && slots.length === 8, "exactly eight formal slots required");
  const rows = slots.map(slot => {
    need(slot && typeof slot.id === "string", "slot id required");
    const estimable = slot.estimable !== false;
    const rawP = estimable ? S.signTestTwoSided(Number(slot.positive), Number(slot.negative)) : fraction(1n, 1n);
    return { id: slot.id, estimable, positive: Number(slot.positive), negative: Number(slot.negative), rawP };
  });
  rows.sort((a, b) => {
    const l = BigInt(a.rawP.numerator) * BigInt(b.rawP.denominator);
    const r = BigInt(b.rawP.numerator) * BigInt(a.rawP.denominator);
    return l < r ? -1 : l > r ? 1 : a.id.localeCompare(b.id);
  });
  let open = true;
  for (let i = 0; i < rows.length; i++) {
    const threshold = fraction(1n, BigInt(20 * (8 - i)));
    const rawPass = rows[i].estimable && leq(rows[i].rawP, threshold);
    rows[i].holmRank = i + 1;
    rows[i].holmThreshold = threshold;
    rows[i].holmPass = open && rawPass;
    if (!rawPass) open = false;
  }
  rows.sort((a, b) => a.id.localeCompare(b.id));
  return { familySize: 8, familyAlpha: fraction(1n, 20n), slots: rows };
}

module.exports = {
  STUDY_ID, C1, C6, P1, P2, RF1, RF2,
  canonical, digest, policyForSeed, familyForSeed, domainId, openingPrefix,
  replaySource, endpointPair, fraction, subtract, sign, fixedEightHolm,
  stateKey: L.stateKey, moveKey: L.moveKey, preflight: L.preflightContinuous
};
