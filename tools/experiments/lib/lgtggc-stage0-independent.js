"use strict";

const crypto = require("node:crypto");
const V = require("./lgtgmiv-stage1-independent.js");

const P1 = "LGTGGC-P1-UNIFORM-LEGAL";
const P2 = "LGTGGC-P2-MAX-CAPTURE";
const RF1 = "LGTGGC-RF1-EARLY-ANCHOR";
const RF2 = "LGTGGC-RF2-LATE-ANCHOR";

function assert(x, m) { if (!x) throw new Error(m); }
function copy(x) { return structuredClone(x); }
function encode(x) {
  if (x === null || typeof x !== "object") return JSON.stringify(x);
  if (Array.isArray(x)) return "[" + x.map(encode).join(",") + "]";
  const keys = Object.keys(x).sort();
  return "{" + keys.map(k => JSON.stringify(k) + ":" + encode(x[k])).join(",") + "}";
}
function hash(x) { return crypto.createHash("sha256").update(typeof x === "string" ? x : encode(x), "utf8").digest("hex"); }
function random(seed) {
  let value = seed >>> 0;
  return () => {
    value += 0x6D2B79F5;
    let x = value;
    x = Math.imul(x ^ (x >>> 15), x | 1);
    x ^= x + Math.imul(x ^ (x >>> 7), x | 61);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}
function moves(E, state) {
  if (state.winner !== null) return [];
  const rows = E.moveVariants(state).map(move => ({ move: copy(move), moveKey: V.moveKey(move) }));
  rows.sort((a, b) => a.moveKey.localeCompare(b.moveKey));
  assert(rows.length !== 0, "no legal moves in live state");
  return rows;
}
function capturedNow(E, state, move) {
  const result = E.applyMove(copy(state), copy(move));
  assert(result && result.state && Array.isArray(result.events), "missing authoritative move events");
  let total = 0;
  for (let i = 0; i < result.events.length; i++) {
    const e = result.events[i];
    if (e && e.kind === "capture") total += Number(e.count || 0);
  }
  assert(Number.isSafeInteger(total) && total >= 0, "capture total invalid");
  return total;
}
function policyChoice(E, state, policy, u) {
  assert(typeof u === "number" && u >= 0 && u < 1, "invalid random draw");
  const all = moves(E, state);
  const amounts = all.map(row => capturedNow(E, state, row.move));
  let pool = all, maximum = null;
  if (policy === P2) {
    maximum = amounts.reduce((a, b) => a > b ? a : b, 0);
    pool = all.filter((_, i) => amounts[i] === maximum);
  } else assert(policy === P1, "unknown source policy " + policy);
  const selected = pool[Math.floor(u * pool.length)];
  return {
    move: copy(selected.move), moveKey: selected.moveKey, legalCount: all.length,
    candidatePoolCount: pool.length, maxCapture: maximum, captureCounts: amounts,
    nonconstantCaptureCounts: new Set(amounts).size > 1
  };
}
function replay(E, policy, seed, maxPly = 72) {
  assert(Number.isInteger(seed), "seed required");
  let state = E.initialState(), r = random(seed);
  const moveKeys = [], choices = [];
  let variableCapturePoints = 0;
  for (let ply = 1; ply <= maxPly && state.winner === null; ply++) {
    const choice = policyChoice(E, state, policy, r());
    if (choice.nonconstantCaptureCounts) variableCapturePoints += 1;
    moveKeys.push(choice.moveKey);
    choices.push({ply, moveKey:choice.moveKey, legalCount:choice.legalCount, candidatePoolCount:choice.candidatePoolCount, maxCapture:choice.maxCapture, captureCounts:choice.captureCounts});
    const applied = E.applyMove(state, choice.move);
    state = applied.state;
    if (state.reason === "relay-limit") return {policyId:policy, seed, moveKeys, choices, trajectorySha256:hash(moveKeys.join("\n")), terminal:false, relayLimit:true, nonconstantCaptureChoicePoints:variableCapturePoints};
  }
  return {policyId:policy, seed, moveKeys, choices, trajectorySha256:hash(moveKeys.join("\n")), terminal:state.winner !== null, relayLimit:state.reason === "relay-limit", nonconstantCaptureChoicePoints:variableCapturePoints, finalState:copy(state)};
}
function anchors(rows, family) {
  assert(Array.isArray(rows), "anchor rows required");
  const xs = Array.from(rows).sort((a,b) => a.ply-b.ply);
  let n = null, m = null;
  if (family === RF1) {
    n = xs.find(x => x.ply === 24 && x.terminal !== true && x.phase === "namua") || null;
    m = xs.find(x => x.ply >= 44 && x.terminal !== true && x.phase === "mtaji") || null;
  } else if (family === RF2) {
    n = xs.find(x => x.ply === 32 && x.terminal !== true && x.phase === "namua") || null;
    m = xs.find(x => x.ply === 56 && x.terminal !== true && x.phase === "mtaji") || null;
  } else throw new Error("unknown root family " + family);
  return {familyId:family, namua:n ? copy(n) : null, mtaji:m ? copy(m) : null, complete:Boolean(n && m)};
}
function magnitude(x) { x = BigInt(x); return x < 0n ? -x : x; }
function common(a,b){a=magnitude(a);b=magnitude(b);while(b!==0n){const t=a%b;a=b;b=t;}return a;}
function fraction(n,d=1n){n=BigInt(n);d=BigInt(d);if(d===0n)return{numerator:"0",denominator:"0",defined:false};if(d<0n){n=-n;d=-d;}const g=common(n,d);return{numerator:String(n/g),denominator:String(d/g),defined:true};}
function plus(a,b){assert(a.defined&&b.defined,"fraction undefined");return fraction(BigInt(a.numerator)*BigInt(b.denominator)+BigInt(b.numerator)*BigInt(a.denominator),BigInt(a.denominator)*BigInt(b.denominator));}
function times(a,b){assert(a.defined&&b.defined,"fraction undefined");return fraction(BigInt(a.numerator)*BigInt(b.numerator),BigInt(a.denominator)*BigInt(b.denominator));}
function compare(a,b){assert(a.defined&&b.defined,"fraction undefined");const l=BigInt(a.numerator)*BigInt(b.denominator),r=BigInt(b.numerator)*BigInt(a.denominator);return l===r?0:l<r?-1:1;}
function comb(n,k){n=BigInt(n);k=BigInt(k);if(k<0n||k>n)return 0n;if(k>n-k)k=n-k;let out=1n;for(let i=1n;i<=k;i++)out=out*(n-k+i)/i;return out;}
function hg(N,K,n){N=BigInt(N);K=BigInt(K);n=BigInt(n);const den=comb(N,n),lo=Number(n>N-K?n-(N-K):0n),hi=Number(n<K?n:K),rows=[];for(let x=lo;x<=hi;x++)rows.push({x,p:fraction(comb(K,BigInt(x))*comb(N-K,n-BigInt(x)),den)});return rows;}
function convolution(a,b){const table=new Map();for(const x of a)for(const y of b){const key=x.x+y.x;table.set(key,plus(table.get(key)||fraction(0n),times(x.p,y.p)));}return Array.from(table.entries()).sort((a,b)=>a[0]-b[0]).map(([x,p])=>({x,p}));}
function stratifiedTwoSided(strata){assert(Array.isArray(strata)&&strata.length,"strata missing");let dist=[{x:0,p:fraction(1n)}],observed=0,changed=0;for(const s of strata){observed+=s.changedHigh;changed+=s.changedTotal;dist=convolution(dist,hg(s.total,s.changedTotal,s.highN));}let lo=fraction(0n),hi=fraction(0n);for(const row of dist){if(row.x<=observed)lo=plus(lo,row.p);if(row.x>=observed)hi=plus(hi,row.p);}let p=times(compare(lo,hi)<=0?lo:hi,fraction(2n));if(compare(p,fraction(1n))>0)p=fraction(1n);return{observed,changedTotal:changed,distribution:dist,lowerTail:lo,upperTail:hi,pTwoSided:p,direction:2*observed>changed?"HIGHER-IN-HIGH":2*observed<changed?"LOWER-IN-HIGH":"ZERO-DIRECTION"};}
function holm(rows){const sorted=rows.map(x=>({...x})).sort((a,b)=>compare(a.pValue,b.pValue)||a.id.localeCompare(b.id));const adjusted={},thresholds={};let prior=fraction(0n);for(let i=0;i<sorted.length;i++){let a=times(sorted[i].pValue,fraction(BigInt(sorted.length-i)));if(compare(a,fraction(1n))>0)a=fraction(1n);if(compare(a,prior)<0)a=prior;prior=a;adjusted[sorted[i].id]=a;thresholds[sorted[i].id]=fraction(1n,BigInt(20*(sorted.length-i)));}return{adjusted,thresholds};}

module.exports = { P1, P2, RF1, RF2, stable:encode, digest:hash, rng:random, legalRows:moves, immediateCaptureCount:capturedNow, chooseMove:policyChoice, replay, selectAnchors:anchors, q:fraction, add:plus, mul:times, cmp:compare, choose:comb, hypergeom:hg, convolve:convolution, twoSidedStratified:stratifiedTwoSided, holm, stateKey:V.stateKey, moveKey:V.moveKey };
