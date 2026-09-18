"use strict";

const crypto = require("node:crypto");
const L = require("./lgttci-compatibility-independent.js");
const S = require("./sfcdf-independent.js");

const STUDY_ID = "SFCDFT-STUDY1";
const C1 = "SFCDF-C1-UNIT-WIDTH-OCCUPANCY-FRACTION";
const C6 = "SFCDF-C6-CUMULATIVE-TREE-RAW-RATIO";
const P1 = L.P1, P2 = L.P2, RF1 = L.RF1, RF2 = L.RF2;

function assertOk(v, m) { if (!v) throw new Error(m); }
function hashText(text) { return crypto.createHash("sha256").update(String(text), "utf8").digest("hex"); }
function canonical(v) { return L.stable(v); }
function digest(v) { return hashText(typeof v === "string" ? v : canonical(v)); }
function copy(v) { return JSON.parse(JSON.stringify(v)); }

function policyForSeed(seed) {
  assertOk(Number.isInteger(seed), "independent seed must be integer");
  return (seed & 1) === 1 ? P1 : P2;
}
function familyForSeed(stageId, seed) {
  assertOk(typeof stageId === "string" && stageId !== "", "independent stageId required");
  assertOk(Number.isInteger(seed), "independent seed must be integer");
  const byte = parseInt(hashText(stageId + "|RF|" + seed).substring(0, 2), 16);
  return (byte & 1) === 0 ? RF1 : RF2;
}
function domainId(policyId, familyId) {
  const table = new Map([
    [`${P1}|${RF1}`, "SFCDFT-D1-P1-RF1"],
    [`${P1}|${RF2}`, "SFCDFT-D2-P1-RF2"],
    [`${P2}|${RF1}`, "SFCDFT-D3-P2-RF1"],
    [`${P2}|${RF2}`, "SFCDFT-D4-P2-RF2"]
  ]);
  const id = table.get(`${policyId}|${familyId}`);
  assertOk(id, `independent unknown policy/family domain ${policyId}/${familyId}`);
  return id;
}
function openingPrefix(moveKeys) {
  assertOk(Array.isArray(moveKeys) && moveKeys.length >= 16, "independent opening prefix requires >=16 moves");
  let text = "";
  for (let i = 0; i < 16; i++) text += (i ? "\n" : "") + moveKeys[i];
  return { openingPrefixLength: 16, openingPrefixSha256: hashText(text) };
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
    openingPrefixLength: prefix.openingPrefixLength,
    openingPrefixSha256: prefix.openingPrefixSha256,
    moveCount: replay.moveKeys.length,
    terminal: replay.terminal,
    anchors,
    replay
  };
}
function endpointPair(E, rootRow, sourceIdentity) {
  assertOk(rootRow && rootRow.state && Number.isInteger(rootRow.ply), "independent root row required");
  assertOk(sourceIdentity && Number.isInteger(sourceIdentity.seed), "independent source seed required");
  assertOk(typeof sourceIdentity.trajectorySha256 === "string", "independent source trajectory identity required");
  assertOk(typeof sourceIdentity.openingPrefixSha256 === "string" && sourceIdentity.openingPrefixLength === 16, "independent opening-prefix identity required");
  const source = Object.create(null);
  source.phase = rootRow.phase;
  source.sourceSeed = sourceIdentity.seed;
  source.selectedPly = rootRow.ply;
  source.rootRawSha256 = rootRow.rawStateSha256;
  source.sourceTrajectorySha256 = sourceIdentity.trajectorySha256;
  source.openingPrefixSha256 = sourceIdentity.openingPrefixSha256;
  source.openingPrefixLength = sourceIdentity.openingPrefixLength;
  source.rootState = copy(rootRow.state);
  const measured = S.measureRoot(E, source);
  const e = Object.create(null);
  e[C1] = measured.sfcdf.endpoints[C1];
  e[C6] = measured.sfcdf.endpoints[C6];
  assertOk(e[C1] && e[C6], "independent C1/C6 endpoint missing");
  return { rootRawSha256: rootRow.rawStateSha256, ply: rootRow.ply, phase: rootRow.phase, endpoints: e, measurementDigest: digest(measured) };
}
function abs(n) { return n < 0n ? -n : n; }
function reduce(n, d) {
  n = BigInt(n); d = BigInt(d);
  if (d === 0n) return { numerator: "0", denominator: "0", defined: false };
  if (d < 0n) { n = -n; d = -d; }
  let a = abs(n), b = abs(d);
  while (b !== 0n) { const r = a % b; a = b; b = r; }
  const g = a === 0n ? 1n : a;
  return { numerator: String(n / g), denominator: String(d / g), defined: true };
}
function subtract(a, b) {
  if (!a || !b || !a.defined || !b.defined) return reduce(0n, 0n);
  const an = BigInt(a.numerator), ad = BigInt(a.denominator), bn = BigInt(b.numerator), bd = BigInt(b.denominator);
  return reduce(an * bd - bn * ad, ad * bd);
}
function sign(q) {
  if (!q || !q.defined) return null;
  const n = BigInt(q.numerator);
  return n === 0n ? 0 : n > 0n ? 1 : -1;
}
function ratioLE(a, b) {
  assertOk(a && b && a.defined && b.defined, "independent defined fractions required");
  return BigInt(a.numerator) * BigInt(b.denominator) <= BigInt(b.numerator) * BigInt(a.denominator);
}
function fixedEightHolm(slots) {
  assertOk(Array.isArray(slots) && slots.length === 8, "independent exactly eight formal slots required");
  const rows = [];
  for (const slot of slots) {
    assertOk(slot && typeof slot.id === "string", "independent slot id required");
    const estimable = slot.estimable !== false;
    rows.push({
      id: slot.id,
      estimable,
      positive: Number(slot.positive),
      negative: Number(slot.negative),
      rawP: estimable ? S.signTestTwoSided(Number(slot.positive), Number(slot.negative)) : reduce(1n, 1n)
    });
  }
  rows.sort((a, b) => {
    const left = BigInt(a.rawP.numerator) * BigInt(b.rawP.denominator);
    const right = BigInt(b.rawP.numerator) * BigInt(a.rawP.denominator);
    if (left !== right) return left < right ? -1 : 1;
    return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
  });
  let stillOpen = true;
  for (let rank0 = 0; rank0 < 8; rank0++) {
    const threshold = reduce(1n, BigInt(20 * (8 - rank0)));
    const passes = rows[rank0].estimable && ratioLE(rows[rank0].rawP, threshold);
    rows[rank0].holmRank = rank0 + 1;
    rows[rank0].holmThreshold = threshold;
    rows[rank0].holmPass = stillOpen && passes;
    if (!passes) stillOpen = false;
  }
  rows.sort((a, b) => a.id.localeCompare(b.id));
  return { familySize: 8, familyAlpha: reduce(1n, 20n), slots: rows };
}

module.exports = {
  STUDY_ID, C1, C6, P1, P2, RF1, RF2,
  canonical, digest, policyForSeed, familyForSeed, domainId, openingPrefix,
  replaySource, endpointPair, fraction: reduce, subtract, sign, fixedEightHolm,
  stateKey: L.stateKey, moveKey: L.moveKey, preflight: L.preflightContinuous
};
