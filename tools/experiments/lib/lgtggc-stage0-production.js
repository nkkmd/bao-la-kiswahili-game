"use strict";

const crypto = require("node:crypto");
const U = require("./lgtgmiv-stage1-production.js");

const P1 = "LGTGGC-P1-UNIFORM-LEGAL";
const P2 = "LGTGGC-P2-MAX-CAPTURE";
const RF1 = "LGTGGC-RF1-EARLY-ANCHOR";
const RF2 = "LGTGGC-RF2-LATE-ANCHOR";

function need(x, m) { if (!x) throw new Error(m); }
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
  const rows = E.moveVariants(state).map(move => ({ move, moveKey: U.moveKey(move) }));
  rows.sort((a, b) => a.moveKey.localeCompare(b.moveKey));
  need(rows.length > 0, "nonterminal state without legal move");
  return rows;
}
function immediateCaptureCount(E, state, move) {
  const applied = E.applyMove(clone(state), clone(move));
  need(applied && applied.state && Array.isArray(applied.events), "applyMove event contract unavailable");
  let n = 0;
  for (const e of applied.events) if (e && e.kind === "capture") n += Number(e.count || 0);
  need(Number.isSafeInteger(n) && n >= 0, "invalid capture event count");
  return n;
}
function chooseMove(E, state, policyId, u) {
  need(Number.isFinite(u) && u >= 0 && u < 1, "u outside [0,1)");
  const legal = legalRows(E, state);
  let pool = legal;
  let maxCapture = null;
  const captureCounts = legal.map(row => immediateCaptureCount(E, state, row.move));
  if (policyId === P2) {
    maxCapture = Math.max(...captureCounts);
    pool = legal.filter((_, i) => captureCounts[i] === maxCapture);
  } else need(policyId === P1, `unknown policy ${policyId}`);
  const idx = Math.floor(u * pool.length);
  const pick = pool[idx];
  return {
    move: clone(pick.move),
    moveKey: pick.moveKey,
    legalCount: legal.length,
    candidatePoolCount: pool.length,
    maxCapture,
    captureCounts,
    nonconstantCaptureCounts: new Set(captureCounts).size >= 2
  };
}
function replay(E, policyId, seed, maxPly = 72) {
  need(Number.isInteger(seed), "seed integer required");
  need(Number.isInteger(maxPly) && maxPly > 0, "maxPly invalid");
  let state = E.initialState();
  const random = rng(seed);
  const moveKeys = [], choices = [];
  let nonconstantCaptureChoicePoints = 0;
  for (let ply = 1; ply <= maxPly && state.winner === null; ply++) {
    const c = chooseMove(E, state, policyId, random());
    if (c.nonconstantCaptureCounts) nonconstantCaptureChoicePoints++;
    moveKeys.push(c.moveKey);
    choices.push({
      ply,
      moveKey: c.moveKey,
      legalCount: c.legalCount,
      candidatePoolCount: c.candidatePoolCount,
      maxCapture: c.maxCapture,
      captureCounts: c.captureCounts
    });
    const applied = E.applyMove(state, c.move);
    state = applied.state;
    if (state.reason === "relay-limit") return {
      policyId, seed, moveKeys, choices, trajectorySha256: digest(moveKeys.join("\n")),
      terminal: false, relayLimit: true, nonconstantCaptureChoicePoints
    };
  }
  return {
    policyId, seed, moveKeys, choices, trajectorySha256: digest(moveKeys.join("\n")),
    terminal: state.winner !== null, relayLimit: state.reason === "relay-limit", nonconstantCaptureChoicePoints,
    finalState: clone(state)
  };
}
function selectAnchors(rows, familyId) {
  need(Array.isArray(rows), "rows required");
  const sorted = rows.slice().sort((a, b) => a.ply - b.ply);
  let namua = null, mtaji = null;
  if (familyId === RF1) {
    namua = sorted.find(r => r.ply === 24 && !r.terminal && r.phase === "namua") || null;
    mtaji = sorted.find(r => r.ply >= 44 && !r.terminal && r.phase === "mtaji") || null;
  } else if (familyId === RF2) {
    namua = sorted.find(r => r.ply === 32 && !r.terminal && r.phase === "namua") || null;
    mtaji = sorted.find(r => r.ply === 56 && !r.terminal && r.phase === "mtaji") || null;
  } else throw new Error(`unknown root family ${familyId}`);
  return { familyId, namua: namua ? clone(namua) : null, mtaji: mtaji ? clone(mtaji) : null, complete: !!(namua && mtaji) };
}
function gcd(a, b) { a = a < 0n ? -a : a; b = b < 0n ? -b : b; while (b) [a, b] = [b, a % b]; return a; }
function q(n, d = 1n) {
  n = BigInt(n); d = BigInt(d);
  if (d === 0n) return { numerator: "0", denominator: "0", defined: false };
  if (d < 0n) { n = -n; d = -d; }
  const g = gcd(n, d);
  return { numerator: String(n / g), denominator: String(d / g), defined: true };
}
function add(a, b) { need(a.defined && b.defined, "defined rationals required"); return q(BigInt(a.numerator) * BigInt(b.denominator) + BigInt(b.numerator) * BigInt(a.denominator), BigInt(a.denominator) * BigInt(b.denominator)); }
function mul(a, b) { need(a.defined && b.defined, "defined rationals required"); return q(BigInt(a.numerator) * BigInt(b.numerator), BigInt(a.denominator) * BigInt(b.denominator)); }
function cmp(a, b) { need(a.defined && b.defined, "defined rationals required"); const l = BigInt(a.numerator) * BigInt(b.denominator), r = BigInt(b.numerator) * BigInt(a.denominator); return l < r ? -1 : l > r ? 1 : 0; }
function choose(n, k) { n = BigInt(n); k = BigInt(k); if (k < 0n || k > n) return 0n; if (k > n-k) k = n-k; let x = 1n; for (let i = 1n; i <= k; i++) x = x * (n-k+i) / i; return x; }
function hypergeom(N, K, n) {
  N = BigInt(N); K = BigInt(K); n = BigInt(n);
  const den = choose(N, n), lo = Number(n > N-K ? n-(N-K) : 0n), hi = Number(n < K ? n : K), out = [];
  for (let x = lo; x <= hi; x++) out.push({ x, p: q(choose(K, BigInt(x)) * choose(N-K, n-BigInt(x)), den) });
  return out;
}
function convolve(a, b) {
  const m = new Map();
  for (const x of a) for (const y of b) {
    const k = x.x + y.x;
    m.set(k, add(m.get(k) || q(0n), mul(x.p, y.p)));
  }
  return [...m].sort((a, b) => a[0]-b[0]).map(([x, p]) => ({ x, p }));
}
function twoSidedStratified(strata) {
  need(Array.isArray(strata) && strata.length > 0, "strata required");
  let dist = [{ x: 0, p: q(1n) }], observed = 0, changedTotal = 0;
  for (const s of strata) {
    need(Number.isInteger(s.total) && Number.isInteger(s.changedTotal) && Number.isInteger(s.highN) && Number.isInteger(s.changedHigh), "integer stratum required");
    observed += s.changedHigh;
    changedTotal += s.changedTotal;
    dist = convolve(dist, hypergeom(s.total, s.changedTotal, s.highN));
  }
  let lower = q(0n), upper = q(0n);
  for (const r of dist) {
    if (r.x <= observed) lower = add(lower, r.p);
    if (r.x >= observed) upper = add(upper, r.p);
  }
  let p = mul(cmp(lower, upper) <= 0 ? lower : upper, q(2n));
  if (cmp(p, q(1n)) > 0) p = q(1n);
  return {
    observed, changedTotal, distribution: dist, lowerTail: lower, upperTail: upper, pTwoSided: p,
    direction: 2 * observed > changedTotal ? "HIGHER-IN-HIGH" : 2 * observed < changedTotal ? "LOWER-IN-HIGH" : "ZERO-DIRECTION"
  };
}
function holm(rows) {
  const a = rows.map(r => ({...r})).sort((x, y) => cmp(x.pValue, y.pValue) || x.id.localeCompare(y.id));
  const m = a.length, adjusted = {}, thresholds = {};
  let prev = q(0n);
  for (let i = 0; i < m; i++) {
    let adj = mul(a[i].pValue, q(BigInt(m-i)));
    if (cmp(adj, q(1n)) > 0) adj = q(1n);
    if (cmp(adj, prev) < 0) adj = prev;
    prev = adj;
    adjusted[a[i].id] = adj;
    thresholds[a[i].id] = q(1n, BigInt(20 * (m-i)));
  }
  return { adjusted, thresholds };
}

module.exports = { P1, P2, RF1, RF2, stable, digest, rng, legalRows, immediateCaptureCount, chooseMove, replay, selectAnchors, q, add, mul, cmp, choose, hypergeom, convolve, twoSidedStratified, holm, stateKey: U.stateKey, moveKey: U.moveKey };
