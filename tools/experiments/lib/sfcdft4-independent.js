"use strict";

const crypto = require("node:crypto");
const L = require("./lgttci-compatibility-independent.js");
const S = require("./sfcdf-independent.js");

const STUDY_ID = "SFCDFT-STUDY4";
const C1 = "SFCDF-C1-UNIT-WIDTH-OCCUPANCY-FRACTION";
const C6 = "SFCDF-C6-CUMULATIVE-TREE-RAW-RATIO";
const P1 = L.P1;
const P2 = L.P2;
const RF1 = L.RF1;
const RF2 = L.RF2;

function assertOk(value, message) { if (!value) throw new Error(message); }
function clone(value) { return JSON.parse(JSON.stringify(value)); }
function hashText(value) { return crypto.createHash("sha256").update(String(value), "utf8").digest("hex"); }
function canonical(value) { return L.stable(value); }
function digest(value) { return hashText(typeof value === "string" ? value : canonical(value)); }

function policyForSeed(seed) {
  assertOk(Number.isInteger(seed), "independent seed must be integer");
  return (seed & 1) === 1 ? P1 : P2;
}

function familyForSeed(stageId, seed) {
  assertOk(typeof stageId === "string" && stageId !== "", "independent stageId required");
  assertOk(Number.isInteger(seed), "independent seed must be integer");
  const byte = Number.parseInt(hashText(stageId + "|RF|" + seed).slice(0, 2), 16);
  return (byte & 1) === 0 ? RF1 : RF2;
}

function domainId(policyId, familyId) {
  const values = new Map([
    [`${P1}|${RF1}`, "SFCDFT4-D1-P1-RF1"],
    [`${P1}|${RF2}`, "SFCDFT4-D2-P1-RF2"],
    [`${P2}|${RF1}`, "SFCDFT4-D3-P2-RF1"],
    [`${P2}|${RF2}`, "SFCDFT4-D4-P2-RF2"]
  ]);
  const value = values.get(`${policyId}|${familyId}`);
  assertOk(value, `independent unknown policy/family ${policyId}/${familyId}`);
  return value;
}

function openingPrefix(moveKeys, pairComplete) {
  assertOk(Array.isArray(moveKeys), "independent moveKeys array required");
  if (moveKeys.length < 16) {
    assertOk(!pairComplete, "independent complete candidate requires at least 16 moves");
    return { openingPrefixAvailable: false, openingPrefixLength: moveKeys.length, openingPrefixSha256: null };
  }
  let text = "";
  for (let i = 0; i < 16; i += 1) text += (i === 0 ? "" : "\n") + moveKeys[i];
  return { openingPrefixAvailable: true, openingPrefixLength: 16, openingPrefixSha256: hashText(text) };
}

function blankAnchors(familyId) {
  return { familyId, namua: null, mtaji: null, complete: false };
}

function considerAnchor(anchors, row) {
  if (!row || row.terminal) return anchors;
  switch (anchors.familyId) {
    case RF1:
      if (anchors.namua === null && row.ply === 20 && row.phase === "namua") anchors.namua = clone(row);
      if (anchors.mtaji === null && row.ply >= 40 && row.phase === "mtaji") anchors.mtaji = clone(row);
      break;
    case RF2:
      if (anchors.namua === null && row.ply === 28 && row.phase === "namua") anchors.namua = clone(row);
      if (anchors.mtaji === null && row.ply === 52 && row.phase === "mtaji") anchors.mtaji = clone(row);
      break;
    default:
      throw new Error(`independent unknown root family ${anchors.familyId}`);
  }
  anchors.complete = anchors.namua !== null && anchors.mtaji !== null;
  return anchors;
}

function replaySource(E, stageId, seed, maxPly = 240, options = {}) {
  assertOk(E && typeof E.initialState === "function" && typeof E.applyMove === "function", "independent engine contract unavailable");
  assertOk(Number.isInteger(seed), "independent seed must be integer");
  assertOk(Number.isInteger(maxPly) && maxPly > 0, "independent maxPly must be positive integer");
  const policyId = policyForSeed(seed);
  const familyId = familyForSeed(stageId, seed);
  const random = L.rng(seed);
  const applySelectedMove = typeof options.applySelectedMove === "function"
    ? options.applySelectedMove
    : (state, move, context) => E.applyMove(state, move, context?.recording);

  let state = E.initialState();
  const rows = [];
  const moveKeys = [];
  const anchors = blankAnchors(familyId);
  let stopReason = null;
  let engineGuard = null;

  for (let ply = 1; ply <= maxPly && state.winner === null; ply += 1) {
    const selected = L.chooseMove(E, state, policyId, random());
    moveKeys.push(selected.moveKey);
    const applied = applySelectedMove(state, clone(selected.move), { ply, seed, policyId, familyId, recording: { snapshots: false } });
    assertOk(applied && applied.state, `independent selected move state missing ply=${ply}`);
    state = applied.state;

    if (state.reason === "relay-limit") {
      stopReason = "ENGINE-GUARD";
      engineGuard = { kind: "relay-limit", ply };
      break;
    }

    const terminal = state.winner !== null;
    const row = {
      ply,
      phase: state.phase,
      terminal,
      rootLegalWidth: terminal ? 0 : E.moveVariants(state).length,
      rawStateSha256: L.stateKey(state),
      state: clone(state)
    };
    rows.push(row);
    considerAnchor(anchors, row);

    if (anchors.complete) {
      stopReason = "PAIR-COMPLETE";
      break;
    }
    if (terminal) {
      stopReason = "NATURAL-TERMINAL";
      break;
    }
  }

  if (stopReason === null) stopReason = "MAX-SOURCE-PLY";

  const pairComplete = Boolean(anchors.complete);
  const prefix = openingPrefix(moveKeys, pairComplete);
  let candidateStatus = "NO-CANDIDATE-ROOT-SHORTAGE";
  if (pairComplete) candidateStatus = "CANDIDATE-PAIR-COMPLETE";
  else if (stopReason === "ENGINE-GUARD") candidateStatus = "NO-CANDIDATE-ENGINE-GUARD-CENSORING";

  if (pairComplete) {
    assertOk(prefix.openingPrefixAvailable === true && prefix.openingPrefixLength === 16 && typeof prefix.openingPrefixSha256 === "string", "independent complete candidate prefix invalid");
    assertOk(stopReason === "PAIR-COMPLETE", "independent complete pair stop mismatch");
    const latestAnchorPly = anchors.namua.ply > anchors.mtaji.ply ? anchors.namua.ply : anchors.mtaji.ply;
    assertOk(moveKeys.length === latestAnchorPly, "independent post-candidate continuation detected");
  }
  if (candidateStatus === "NO-CANDIDATE-ENGINE-GUARD-CENSORING") {
    assertOk(engineGuard && engineGuard.kind === "relay-limit", "independent engine guard metadata absent");
    assertOk(!pairComplete, "independent engine guard cannot contain complete pair");
  }

  const trajectory = hashText(moveKeys.join("\n"));
  return {
    studyId: STUDY_ID,
    stageId,
    seed,
    policyId,
    familyId,
    domainId: domainId(policyId, familyId),
    candidateStatus,
    pairComplete,
    stopReason,
    engineGuard,
    scientificTerminal: stopReason === "NATURAL-TERMINAL",
    engineWinnerPresentAtStop: state.winner !== null,
    postCandidateContinuationCount: 0,
    sourceTrajectorySha256: trajectory,
    openingPrefixAvailable: prefix.openingPrefixAvailable,
    openingPrefixLength: prefix.openingPrefixLength,
    openingPrefixSha256: prefix.openingPrefixSha256,
    moveCount: moveKeys.length,
    anchors: clone(anchors),
    replay: {
      policyId,
      seed,
      moveKeys: clone(moveKeys),
      rows: clone(rows),
      trajectorySha256: trajectory,
      stopReason,
      engineGuard: clone(engineGuard),
      scientificTerminal: stopReason === "NATURAL-TERMINAL"
    }
  };
}

function endpointPair(E, rootRow, sourceIdentity) {
  assertOk(rootRow && rootRow.state && Number.isInteger(rootRow.ply), "independent root row required");
  assertOk(sourceIdentity && Number.isInteger(sourceIdentity.seed), "independent source seed required");
  assertOk(typeof sourceIdentity.sourceTrajectorySha256 === "string", "independent source trajectory required");
  assertOk(sourceIdentity.candidateStatus === "CANDIDATE-PAIR-COMPLETE", "independent candidate source required");
  assertOk(sourceIdentity.openingPrefixAvailable === true && sourceIdentity.openingPrefixLength === 16, "independent candidate opening prefix required");
  const source = {
    phase: rootRow.phase,
    sourceSeed: sourceIdentity.seed,
    selectedPly: rootRow.ply,
    rootRawSha256: rootRow.rawStateSha256,
    sourceTrajectorySha256: sourceIdentity.sourceTrajectorySha256,
    openingPrefixSha256: sourceIdentity.openingPrefixSha256,
    openingPrefixLength: sourceIdentity.openingPrefixLength,
    rootState: clone(rootRow.state)
  };
  const measured = S.measureRoot(E, source);
  const c1 = measured.sfcdf.endpoints[C1];
  const c6 = measured.sfcdf.endpoints[C6];
  assertOk(c1 && c6, "independent C1/C6 endpoint missing");
  return {
    rootRawSha256: rootRow.rawStateSha256,
    ply: rootRow.ply,
    phase: rootRow.phase,
    endpoints: { [C1]: c1, [C6]: c6 },
    measurementDigest: digest(measured)
  };
}

function abs(n) { return n < 0n ? -n : n; }
function fraction(n, d) {
  n = BigInt(n); d = BigInt(d);
  if (d === 0n) return { numerator: "0", denominator: "0", defined: false };
  if (d < 0n) { n = -n; d = -d; }
  let a = abs(n), b = abs(d);
  while (b !== 0n) { const r = a % b; a = b; b = r; }
  const g = a === 0n ? 1n : a;
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
function ratioLE(a, b) {
  assertOk(a && b && a.defined && b.defined, "independent defined fractions required");
  return BigInt(a.numerator) * BigInt(b.denominator) <= BigInt(b.numerator) * BigInt(a.denominator);
}
function fixedEightHolm(slots) {
  assertOk(Array.isArray(slots) && slots.length === 8, "independent exactly eight formal slots required");
  const rows = slots.map((slot) => {
    assertOk(slot && typeof slot.id === "string", "independent slot id required");
    const estimable = slot.estimable !== false;
    return {
      id: slot.id,
      estimable,
      positive: Number(slot.positive),
      negative: Number(slot.negative),
      rawP: estimable ? S.signTestTwoSided(Number(slot.positive), Number(slot.negative)) : fraction(1n, 1n)
    };
  });
  rows.sort((a, b) => {
    const left = BigInt(a.rawP.numerator) * BigInt(b.rawP.denominator);
    const right = BigInt(b.rawP.numerator) * BigInt(a.rawP.denominator);
    return left < right ? -1 : left > right ? 1 : a.id.localeCompare(b.id);
  });
  let open = true;
  for (let index = 0; index < rows.length; index += 1) {
    const threshold = fraction(1n, BigInt(20 * (8 - index)));
    const rawPass = rows[index].estimable && ratioLE(rows[index].rawP, threshold);
    rows[index].holmRank = index + 1;
    rows[index].holmThreshold = threshold;
    rows[index].holmPass = open && rawPass;
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
