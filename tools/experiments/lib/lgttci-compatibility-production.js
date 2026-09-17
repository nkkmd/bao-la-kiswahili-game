"use strict";

const crypto = require("node:crypto");
const Raw = require("./lgtgmiv-stage1-production.js");
const Continuous = require("./crclgr-production.js");
const Search = require("./silgm-production.js");

const P1 = "LGTTCI-P1-UNIFORM-LEGAL";
const P2 = "LGTTCI-P2-MIN-IMMEDIATE-CAPTURE";
const RF1 = "LGTTCI-RF1-MID-ANCHOR";
const RF2 = "LGTTCI-RF2-OFFSET-ANCHOR";

function need(x, message) { if (!x) throw new Error(message); }
function clone(x) { return JSON.parse(JSON.stringify(x)); }
function stable(x) {
  if (x === null || typeof x !== "object") return JSON.stringify(x);
  if (Array.isArray(x)) return `[${x.map(stable).join(",")}]`;
  return `{${Object.keys(x).sort().map(k => `${JSON.stringify(k)}:${stable(x[k])}`).join(",")}}`;
}
function digest(x) { return crypto.createHash("sha256").update(typeof x === "string" ? x : stable(x), "utf8").digest("hex"); }
function rng(seed) {
  let v = seed >>> 0;
  return () => {
    v += 0x6D2B79F5;
    let n = v;
    n = Math.imul(n ^ (n >>> 15), n | 1);
    n ^= n + Math.imul(n ^ (n >>> 7), n | 61);
    return ((n ^ (n >>> 14)) >>> 0) / 4294967296;
  };
}
function legalRows(E, state) {
  if (state.winner !== null) return [];
  return E.moveVariants(state).map(move => ({ move, moveKey: Raw.moveKey(move) })).sort((a, b) => a.moveKey.localeCompare(b.moveKey));
}
function immediateCaptureCount(E, state, move) {
  const applied = E.applyMove(clone(state), clone(move));
  need(applied && applied.state && Array.isArray(applied.events), "applyMove event contract unavailable");
  let n = 0;
  for (const event of applied.events) if (event && event.kind === "capture") n += Number(event.count || 0);
  need(Number.isSafeInteger(n) && n >= 0, "invalid immediate capture count");
  return n;
}
function chooseMove(E, state, policyId, u) {
  need(Number.isFinite(u) && u >= 0 && u < 1, "u outside [0,1)");
  const legal = legalRows(E, state);
  need(legal.length > 0, "nonterminal state without legal moves");
  let pool = legal;
  let captureCounts = null;
  if (policyId === P2) {
    captureCounts = legal.map(row => immediateCaptureCount(E, state, row.move));
    const minCapture = Math.min(...captureCounts);
    pool = legal.filter((_, index) => captureCounts[index] === minCapture);
  } else need(policyId === P1, `unknown policy ${policyId}`);
  const index = Math.floor(u * pool.length);
  const selected = pool[index];
  return { move: clone(selected.move), moveKey: selected.moveKey, legalCount: legal.length, poolCount: pool.length, captureCounts };
}
function replay(E, policyId, seed, maxPly = 80) {
  need(Number.isInteger(seed), "seed must be integer");
  const random = rng(seed);
  let state = E.initialState();
  const rows = [];
  const moveKeys = [];
  for (let ply = 1; ply <= maxPly && state.winner === null; ply++) {
    const choice = chooseMove(E, state, policyId, random());
    moveKeys.push(choice.moveKey);
    const applied = E.applyMove(state, choice.move);
    state = applied.state;
    need(state.reason !== "relay-limit", `relay-limit seed=${seed} ply=${ply}`);
    rows.push({
      ply,
      phase: state.phase,
      terminal: state.winner !== null,
      rootLegalWidth: state.winner === null ? E.moveVariants(state).length : 0,
      rawStateSha256: Raw.stateKey(state),
      state: clone(state)
    });
  }
  return { policyId, seed, moveKeys, rows, trajectorySha256: digest(moveKeys.join("\n")), terminal: state.winner !== null };
}
function selectAnchors(rows, familyId) {
  const active = rows.filter(row => !row.terminal);
  let namua = null, mtaji = null;
  if (familyId === RF1) {
    namua = active.find(row => row.ply === 20 && row.phase === "namua") || null;
    mtaji = active.find(row => row.ply >= 40 && row.phase === "mtaji") || null;
  } else if (familyId === RF2) {
    namua = active.find(row => row.ply === 28 && row.phase === "namua") || null;
    mtaji = active.find(row => row.ply === 52 && row.phase === "mtaji") || null;
  } else throw new Error(`unknown root family ${familyId}`);
  return { familyId, namua: namua ? clone(namua) : null, mtaji: mtaji ? clone(mtaji) : null, complete: Boolean(namua && mtaji) };
}
function sourceFor(state, seed, ply) {
  return {
    phase: state.phase,
    sourceSeed: seed,
    selectedPly: ply,
    rootRawSha256: Raw.stateKey(state),
    sourceTrajectorySha256: digest({ technical: true, seed }),
    openingPrefixSha256: digest({ technicalPrefix: true, seed, ply }),
    openingPrefixLength: 0,
    rootState: clone(state)
  };
}
function classifySearch(E, state, condition) {
  const width = E.moveVariants(state).length;
  if (width < 2) return { estimable: false, reasonCode: "ROOT-LEGAL-WIDTH-LT2", rootLegalWidth: width, helperCalled: false };
  const result = Search.conditionResult(state, condition);
  return { ...result, reasonCode: result.estimable ? "ELIGIBLE" : "SEARCH-NON-ESTIMABLE", rootLegalWidth: width, helperCalled: true };
}
function measureRaw(E, state, seed, ply) { return Search.measureGeometry(E, state, seed, ply); }
function preflightContinuous(E, state, seed, ply, limits) { return Continuous.boundedPreflight(E, sourceFor(state, seed, ply), limits); }
function measureContinuous(E, state, seed, ply) { return Continuous.measureRoot(E, sourceFor(state, seed, ply)); }

module.exports = { P1, P2, RF1, RF2, stable, digest, rng, legalRows, immediateCaptureCount, chooseMove, replay, selectAnchors, sourceFor, classifySearch, measureRaw, preflightContinuous, measureContinuous, stateKey: Raw.stateKey, moveKey: Raw.moveKey };
