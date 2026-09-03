"use strict";

const crypto = require("node:crypto");
const E = require("../../../public/engine.js");
const AI = require("../../../public/ai.js");
const U = require("./lgtgmiv-stage1-independent.js");

const HORIZON = 5;
const WIN = 1_000_000;
class IndependentBudgetExhausted extends Error {}

function need(x, m) { if (!x) throw new Error(m); }
function gcd(a, b) { a = a < 0n ? -a : a; b = b < 0n ? -b : b; while (b) [a, b] = [b, a % b]; return a; }
function fraction(n, d) { n = BigInt(n); d = BigInt(d); if (d === 0n) return { numerator: "0", denominator: "0", defined: false }; if (d < 0n) { n = -n; d = -d; } const g = gcd(n, d); return { numerator: String(n / g), denominator: String(d / g), defined: true }; }
function cmpQ(a, b) { need(a && b && a.defined && b.defined, "defined rational required"); const x = BigInt(a.numerator) * BigInt(b.denominator), y = BigInt(b.numerator) * BigInt(a.denominator); return x < y ? -1 : x > y ? 1 : 0; }
function addQ(a, b) { return fraction(BigInt(a.numerator) * BigInt(b.denominator) + BigInt(b.numerator) * BigInt(a.denominator), BigInt(a.denominator) * BigInt(b.denominator)); }
function subQ(a, b) { return fraction(BigInt(a.numerator) * BigInt(b.denominator) - BigInt(b.numerator) * BigInt(a.denominator), BigInt(a.denominator) * BigInt(b.denominator)); }
function stable(v) { if (v === null || typeof v !== "object") return JSON.stringify(v); if (Array.isArray(v)) return `[${v.map(stable).join(",")}]`; return `{${Object.keys(v).sort().map(k => `${JSON.stringify(k)}:${stable(v[k])}`).join(",")}}`; }
function digest(v) { return crypto.createHash("sha256").update(stable(v), "utf8").digest("hex"); }
function sum(rows, field) { return rows.reduce((a, x) => a + BigInt(x[field]), 0n); }
function deriveGeometry(measurement) {
  const r = measurement && measurement.reconstructionCore; need(r, "independent reconstruction required");
  need(r.targetDepth === HORIZON, "depth 5 required"); need(r.representation && r.representation.mode === "RAW-ONLY", "RAW-only required");
  need(Array.isArray(r.representation.validatedTransformSet) && r.representation.validatedTransformSet.length === 0, "transforms forbidden");
  let positive = 0n; for (const row of r.layers) for (const [w, c] of Object.entries(row.replyWidthHistogram || {})) if (BigInt(w) > 0n) positive += BigInt(c);
  const tree = sum(r.layers, "treeNodeOccurrences"), dup = sum(r.parentLayers, "duplicateEncounterCount"), transitions = r.parentLayers.reduce((a, x) => a + BigInt(x.uniqueTransitionCount), 0n), unit = sum(r.layers, "unitWidthStateCount"), distinct = BigInt(r.cumulative.distinctRawStates);
  return { rootRawSha256: r.rootRawSha256, metrics: {
    "SILGM-G1-ROOT-LEGAL-WIDTH": fraction(r.rootLegalMoveCount, 1n),
    "SILGM-G2-CUMULATIVE-TREE-OCCURRENCE": fraction(tree, 1n),
    "SILGM-G3-DUPLICATE-TRANSITION-FRACTION": fraction(dup, transitions),
    "SILGM-G4-CUMULATIVE-TREE-RAW-RATIO": fraction(tree, distinct),
    "SILGM-G5-UNIT-WIDTH-OCCUPANCY-FRACTION": fraction(unit, positive),
  }, upstreamRootReconstructionCoreSha256: measurement.rootReconstructionCoreSha256, upstreamFamilyCoreSha256: measurement.rootFamilyCoreSha256 };
}
function sourceFor(state, seed = 31709001, ply = 24) { return { phase: state.phase, sourceSeed: seed, selectedPly: ply, rootRawSha256: U.stateKey(state), sourceTrajectorySha256: digest({ technical: true, seed, ply }), openingPrefixSha256: digest({ technicalPrefix: true, seed, ply }), openingPrefixLength: 0, rootState: structuredClone(state) }; }
function measureGeometry(state, seed, ply) { return deriveGeometry(U.measureRoot(E, sourceFor(state, seed, ply), HORIZON)); }
function moveKey(m) { return AI.moveKey(m); }
function legal(s) { return E.moveVariants(s).slice().sort((a, b) => moveKey(a).localeCompare(moveKey(b))); }
function terminalScore(s, player, ply) { return s.winner === null ? null : (s.winner === player ? WIN - ply : -WIN + ply); }
function evaluator(s, player) { return AI.evaluateWithProfile(s, player, "bao"); }
function consume(budget) { if (budget.limit !== null && budget.used >= budget.limit) { budget.exhausted = true; throw new IndependentBudgetExhausted(); } budget.used += 1; }
function qsearch(s, alpha, beta, player, ply, left, budget) {
  consume(budget); const t = terminalScore(s, player, ply); if (t !== null) return t;
  const moves = legal(s).filter(m => m.type === "capture"); if (!moves.length || left === 0) return evaluator(s, player);
  const max = s.player === player; let best = max ? -Infinity : Infinity;
  for (const m of moves) { const v = qsearch(E.applyMove(s, m).state, alpha, beta, player, ply + 1, left - 1, budget); if (max) { best = Math.max(best, v); alpha = Math.max(alpha, best); } else { best = Math.min(best, v); beta = Math.min(beta, best); } if (beta <= alpha) break; }
  return best;
}
function ab(s, depth, alpha, beta, player, ply, qDepth, budget) {
  consume(budget); const t = terminalScore(s, player, ply); if (t !== null) return t; if (depth === 0) return qsearch(s, alpha, beta, player, ply, qDepth, budget);
  const moves = legal(s); if (!moves.length) return s.player === player ? -WIN + ply : WIN - ply;
  const max = s.player === player; let best = max ? -Infinity : Infinity;
  for (const m of moves) { const v = ab(E.applyMove(s, m).state, depth - 1, alpha, beta, player, ply + 1, qDepth, budget); if (max) { best = Math.max(best, v); alpha = Math.max(alpha, best); } else { best = Math.min(best, v); beta = Math.min(beta, best); } if (beta <= alpha) break; }
  return best;
}
function depthSearch(s, depth, qDepth, budget) {
  const player = s.player, rows = [];
  for (const m of legal(s)) rows.push({ moveKey: moveKey(m), score: ab(E.applyMove(s, m).state, depth - 1, -Infinity, Infinity, player, 1, qDepth, budget) });
  rows.sort((a, b) => b.score - a.score || a.moveKey.localeCompare(b.moveKey));
  const bestScore = rows[0].score, top = rows.filter(x => x.score === bestScore).map(x => x.moveKey).sort(), second = rows.length >= 2 ? rows[1].score : null;
  return { depth, candidates: rows, canonicalBestMoveKey: top[0], topSetMoveKeys: top, bestScore, secondBestScore: second, bestSecondGap: second === null ? null : bestScore - second };
}
function exhaustiveQ(s, player, ply, left) { const t = terminalScore(s, player, ply); if (t !== null) return t; const moves = legal(s).filter(m => m.type === "capture"); if (!moves.length || left === 0) return evaluator(s, player); const xs = moves.map(m => exhaustiveQ(E.applyMove(s, m).state, player, ply + 1, left - 1)); return s.player === player ? Math.max(...xs) : Math.min(...xs); }
function pvTail(s, depth, player, ply, qDepth) {
  const t = terminalScore(s, player, ply); if (t !== null || depth === 0) return { score: t !== null ? t : exhaustiveQ(s, player, ply, qDepth), moves: [] };
  const moves = legal(s); if (!moves.length) return { score: s.player === player ? -WIN + ply : WIN - ply, moves: [] };
  const max = s.player === player; let pick = null;
  for (const m of moves) { const child = pvTail(E.applyMove(s, m).state, depth - 1, player, ply + 1, qDepth), x = { score: child.score, key: moveKey(m), tail: child.moves }; if (!pick || (max && x.score > pick.score) || (!max && x.score < pick.score) || (x.score === pick.score && x.key < pick.key)) pick = x; }
  return { score: pick.score, moves: [pick.key, ...pick.tail] };
}
function pv(s, result, qDepth) { const root = legal(s).find(m => moveKey(m) === result.canonicalBestMoveKey); need(root, "PV root missing"); const tail = pvTail(E.applyMove(s, root).state, result.depth - 1, s.player, 1, qDepth); need(tail.score === result.bestScore, "PV score mismatch"); return [moveKey(root), ...tail.moves]; }
function conditionResult(state, c) {
  let raw;
  if (c.kind === "exact-depth") { const budget = { limit: null, used: 0, exhausted: false }, r = depthSearch(state, c.depth, c.quiescenceDepth, budget); raw = { estimable: true, completedDepth: c.depth, result: r, pv: pv(state, r, c.quiescenceDepth) }; }
  else { const budget = { limit: c.nodeBudget, used: 0, exhausted: false }, completed = []; for (let d = 1; d <= c.maxDepth; d++) { try { completed.push(depthSearch(state, d, c.quiescenceDepth, budget)); } catch (e) { if (!(e instanceof IndependentBudgetExhausted)) throw e; break; } } const r = completed.length ? completed[completed.length - 1] : null; raw = r ? { estimable: true, completedDepth: r.depth, result: r, pv: pv(state, r, c.quiescenceDepth) } : { estimable: false, completedDepth: 0 }; }
  if (!raw.estimable) return raw;
  const r = raw.result; need(r.candidates.length >= 2, "ranking requires >=2 moves"); for (const x of r.candidates) need(Number.isSafeInteger(x.score), "unsafe score");
  return { estimable: true, completedDepth: raw.completedDepth, canonicalBestMoveKey: r.canonicalBestMoveKey, topSetMoveKeys: r.topSetMoveKeys.slice().sort(), bestScore: r.bestScore, secondBestScore: r.secondBestScore, bestSecondGap: r.bestSecondGap, ranking: r.candidates.map(x => ({ moveKey: x.moveKey, score: x.score })).sort((a, b) => a.moveKey.localeCompare(b.moveKey)), pvMoveKeys: raw.pv.slice() };
}
function rel(a, b) { return a < b ? -1 : a > b ? 1 : 0; }
function endpoints(a, b) {
  need(a.estimable && b.estimable, "both estimable"); const A = new Map(a.ranking.map(x => [x.moveKey, x.score])), B = new Map(b.ranking.map(x => [x.moveKey, x.score])); need(A.size === B.size && [...A.keys()].every(k => B.has(k)), "move universe differs");
  let churn = 0; const keys = [...A.keys()].sort(); for (let i = 0; i < keys.length; i++) for (let j = i + 1; j < keys.length; j++) if (rel(A.get(keys[i]), A.get(keys[j])) !== rel(B.get(keys[i]), B.get(keys[j]))) churn = 1;
  const pa = a.pvMoveKeys.slice(0, 2), pb = b.pvMoveKeys.slice(0, 2); while (pa.length < 2) pa.push("<TERMINATED>"); while (pb.length < 2) pb.push("<TERMINATED>");
  return { "SILGM-E1-CANONICAL-BEST-CHANGE": Number(a.canonicalBestMoveKey !== b.canonicalBestMoveKey), "SILGM-E2-TOPSET-CHANGE": Number(JSON.stringify(a.topSetMoveKeys) !== JSON.stringify(b.topSetMoveKeys)), "SILGM-E3-RANKING-PREORDER-CHANGE": churn, "SILGM-E4-BEST-SECOND-GAP-CHANGE": Number(a.bestSecondGap !== b.bestSecondGap), "SILGM-E5-PV-PREFIX2-CHANGE": Number(JSON.stringify(pa) !== JSON.stringify(pb)) };
}
function midpoint(values) { need(values.length > 1, "values required"); const a = values.slice().sort(cmpQ), n = a.length; if (n % 2) return a[(n - 1) / 2]; return fraction(BigInt(a[n/2-1].numerator) * BigInt(a[n/2].denominator) + BigInt(a[n/2].numerator) * BigInt(a[n/2-1].denominator), 2n * BigInt(a[n/2-1].denominator) * BigInt(a[n/2].denominator)); }
function riskDifference(rows, metricId, threshold, endpointId) { let hn=0, ln=0, hc=0n, lc=0n; for (const r of rows) { const c = cmpQ(r.geometry[metricId], threshold); if (c > 0) { hn++; hc += BigInt(r.endpoints[endpointId]); } else if (c < 0) { ln++; lc += BigInt(r.endpoints[endpointId]); } } if (!hn || !ln) return { defined: false }; return { defined: true, highN: hn, lowN: ln, highChanged: Number(hc), lowChanged: Number(lc), value: subQ(fraction(hc, hn), fraction(lc, ln)) }; }
function choose(n, k) { n = BigInt(n); k = BigInt(k); if (k < 0n || k > n) return 0n; if (k > n-k) k = n-k; let x=1n; for(let i=1n;i<=k;i++)x=x*(n-k+i)/i; return x; }
function hypergeom(N,K,n){N=BigInt(N);K=BigInt(K);n=BigInt(n);const den=choose(N,n),lo=Number(n>N-K?n-(N-K):0n),hi=Number(n<K?n:K),out=[];for(let x=lo;x<=hi;x++)out.push({x,p:fraction(choose(K,x)*choose(N-K,n-BigInt(x)),den)});return out;}
function convolve(a,b){const m=new Map();for(const x of a)for(const y of b){const k=x.x+y.x,old=m.get(k)||fraction(0n,1n),p=fraction(BigInt(x.p.numerator)*BigInt(y.p.numerator),BigInt(x.p.denominator)*BigInt(y.p.denominator));m.set(k,addQ(old,p));}return[...m].sort((x,y)=>x[0]-y[0]).map(([x,p])=>({x,p}));}
function exactStratifiedTail(strata,direction){let dist=[{x:0,p:fraction(1n,1n)}],observed=0;for(const s of strata){observed+=s.changedHigh;dist=convolve(dist,hypergeom(s.total,s.changedTotal,s.highN));}let p=fraction(0n,1n);for(const r of dist)if((direction==="HIGHER-IN-HIGH"&&r.x>=observed)||(direction==="LOWER-IN-HIGH"&&r.x<=observed))p=addQ(p,r.p);return{observed,distribution:dist,p};}

module.exports = { fraction, cmpQ, stable, digest, deriveGeometry, measureGeometry, sourceFor, conditionResult, endpoints, midpoint, riskDifference, choose, hypergeom, convolve, exactStratifiedTail, stateKey: U.stateKey, moveKey: U.moveKey };
