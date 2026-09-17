"use strict";

const crypto = require("node:crypto");
const Raw = require("./lgtgmiv-stage1-independent.js");
const Continuous = require("./crclgr-independent.js");
const Search = require("./silgm-independent.js");

const P1 = "LGTTCI-P1-UNIFORM-LEGAL";
const P2 = "LGTTCI-P2-MIN-IMMEDIATE-CAPTURE";
const RF1 = "LGTTCI-RF1-MID-ANCHOR";
const RF2 = "LGTTCI-RF2-OFFSET-ANCHOR";

function assert(x, message) { if (!x) throw new Error(message); }
function copy(x) { return JSON.parse(JSON.stringify(x)); }
function canonical(x) {
  if (x === null || typeof x !== "object") return JSON.stringify(x);
  if (Array.isArray(x)) return `[${x.map(canonical).join(",")}]`;
  return `{${Object.keys(x).sort().map(k => `${JSON.stringify(k)}:${canonical(x[k])}`).join(",")}}`;
}
function hash(x) { return crypto.createHash("sha256").update(typeof x === "string" ? x : canonical(x), "utf8").digest("hex"); }
function randomFromSeed(seed) {
  let a = seed >>> 0;
  return () => {
    a += 0x6D2B79F5;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function legalRows(E, state) {
  if (state.winner !== null) return [];
  const out = [];
  for (const move of E.moveVariants(state)) out.push({ move, moveKey: Raw.moveKey(move) });
  out.sort((a, b) => a.moveKey.localeCompare(b.moveKey));
  return out;
}
function immediateCaptureCount(E, state, move) {
  const applied = E.applyMove(copy(state), copy(move));
  assert(applied && applied.state && Array.isArray(applied.events), "independent applyMove event contract unavailable");
  let total = 0;
  for (const event of applied.events) if (event && event.kind === "capture") total += Number(event.count || 0);
  assert(Number.isSafeInteger(total) && total >= 0, "independent invalid immediate capture count");
  return total;
}
function chooseMove(E, state, policyId, u) {
  assert(Number.isFinite(u) && u >= 0 && u < 1, "independent u outside [0,1)");
  const legal = legalRows(E, state);
  assert(legal.length > 0, "independent nonterminal state without legal moves");
  let indices = legal.map((_, i) => i);
  let captureCounts = null;
  if (policyId === P2) {
    captureCounts = legal.map(row => immediateCaptureCount(E, state, row.move));
    let min = captureCounts[0];
    for (const value of captureCounts) if (value < min) min = value;
    indices = indices.filter(i => captureCounts[i] === min);
  } else assert(policyId === P1, `independent unknown policy ${policyId}`);
  const selectedIndex = indices[Math.floor(u * indices.length)];
  return { move: copy(legal[selectedIndex].move), moveKey: legal[selectedIndex].moveKey, legalCount: legal.length, poolCount: indices.length, captureCounts };
}
function replay(E, policyId, seed, maxPly = 80) {
  assert(Number.isInteger(seed), "independent seed must be integer");
  const random = randomFromSeed(seed);
  let state = E.initialState();
  const rows = [];
  const moveKeys = [];
  for (let ply = 1; ply <= maxPly && state.winner === null; ply++) {
    const selected = chooseMove(E, state, policyId, random());
    moveKeys.push(selected.moveKey);
    state = E.applyMove(state, selected.move).state;
    assert(state.reason !== "relay-limit", `independent relay-limit seed=${seed} ply=${ply}`);
    rows.push({
      ply,
      phase: state.phase,
      terminal: state.winner !== null,
      rootLegalWidth: state.winner === null ? E.moveVariants(state).length : 0,
      rawStateSha256: Raw.stateKey(state),
      state: copy(state)
    });
  }
  return { policyId, seed, moveKeys, rows, trajectorySha256: hash(moveKeys.join("\n")), terminal: state.winner !== null };
}
function selectAnchors(rows, familyId) {
  const active = rows.filter(row => !row.terminal);
  let namua = null;
  let mtaji = null;
  if (familyId === RF1) {
    namua = active.find(row => row.ply === 20 && row.phase === "namua") || null;
    mtaji = active.find(row => row.ply >= 40 && row.phase === "mtaji") || null;
  } else if (familyId === RF2) {
    namua = active.find(row => row.ply === 28 && row.phase === "namua") || null;
    mtaji = active.find(row => row.ply === 52 && row.phase === "mtaji") || null;
  } else throw new Error(`independent unknown root family ${familyId}`);
  return { familyId, namua: namua ? copy(namua) : null, mtaji: mtaji ? copy(mtaji) : null, complete: Boolean(namua && mtaji) };
}
function sourceFor(state, seed, ply) {
  return {
    phase: state.phase,
    sourceSeed: seed,
    selectedPly: ply,
    rootRawSha256: Raw.stateKey(state),
    sourceTrajectorySha256: hash({ technical: true, seed }),
    openingPrefixSha256: hash({ technicalPrefix: true, seed, ply }),
    openingPrefixLength: 0,
    rootState: copy(state)
  };
}
function classifySearch(E, state, condition) {
  const width = E.moveVariants(state).length;
  if (width < 2) return { estimable: false, reasonCode: "ROOT-LEGAL-WIDTH-LT2", rootLegalWidth: width, helperCalled: false };
  const result = Search.conditionResult(state, condition);
  return { ...result, reasonCode: result.estimable ? "ELIGIBLE" : "SEARCH-NON-ESTIMABLE", rootLegalWidth: width, helperCalled: true };
}
function measureRaw(_E, state, seed, ply) { return Search.measureGeometry(state, seed, ply); }
function preflightContinuous(E, state, seed, ply, limits) { return Continuous.boundedPreflight(E, sourceFor(state, seed, ply), limits); }
function measureContinuous(E, state, seed, ply) { return Continuous.measureRoot(E, sourceFor(state, seed, ply)); }

module.exports = { P1, P2, RF1, RF2, stable: canonical, digest: hash, rng: randomFromSeed, legalRows, immediateCaptureCount, chooseMove, replay, selectAnchors, sourceFor, classifySearch, measureRaw, preflightContinuous, measureContinuous, stateKey: Raw.stateKey, moveKey: Raw.moveKey };
