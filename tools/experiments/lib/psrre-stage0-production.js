"use strict";

const crypto = require("node:crypto");
const E = require("../../../public/engine.js");
const AI = require("../../../public/ai.js");

const SEMANTICS = "psrre-stage0-production/technical-only/v1";

function clone(v) { return JSON.parse(JSON.stringify(v)); }
function stableStringify(v) {
  if (v === null || typeof v !== "object") return JSON.stringify(v);
  if (Array.isArray(v)) return `[${v.map(stableStringify).join(",")}]`;
  return `{${Object.keys(v).sort().map(k => `${JSON.stringify(k)}:${stableStringify(v[k])}`).join(",")}}`;
}
function sha256Text(s) { return crypto.createHash("sha256").update(s, "utf8").digest("hex"); }
function binary64Hex(x) {
  const b = Buffer.allocUnsafe(8); b.writeDoubleBE(x, 0); return b.toString("hex");
}
function rawIdentityObject(s) {
  return {
    pits: clone(s.pits), reserve: clone(s.reserve), houseOwned: clone(s.houseOwned),
    player: s.player, phase: s.phase, winner: s.winner, pending: clone(s.pending),
  };
}
function rawIdentityHash(s) { return sha256Text(stableStringify(rawIdentityObject(s))); }

function sortedMoves(s) {
  return E.moveVariants(s).slice().sort((a,b)=>AI.moveKey(a).localeCompare(AI.moveKey(b)));
}
function technicalObservable(s) {
  const before = JSON.stringify(s);
  const actor = s.player, opp = 1 - actor;
  const moves = sortedMoves(s);
  const typeCounts = {};
  const successor = [];
  for (const m of moves) {
    typeCounts[m.type] = (typeCounts[m.type] || 0) + 1;
    const n = E.applyMove(s, m).state;
    successor.push({
      moveKey: AI.moveKey(m),
      rawHash: rawIdentityHash(n),
      phase: n.phase,
      player: n.player,
      winner: n.winner,
      replyWidth: n.winner === null ? sortedMoves(n).length : 0,
    });
  }
  function pits(p) {
    const vals = [...s.pits[p][E.FRONT], ...s.pits[p][E.BACK]];
    return {
      total: vals.reduce((a,b)=>a+b,0),
      occupied: vals.filter(x=>x>0).length,
      maxPit: Math.max(...vals),
    };
  }
  const out = {
    semantics: SEMANTICS,
    rawHash: rawIdentityHash(s),
    phase: s.phase,
    player: actor,
    reserveActor: s.reserve[actor],
    reserveOpponent: s.reserve[opp],
    pendingActor: s.pending[actor],
    pendingOpponent: s.pending[opp],
    houseOwnedActor: s.houseOwned[actor],
    houseOwnedOpponent: s.houseOwned[opp],
    actorPits: pits(actor),
    opponentPits: pits(opp),
    legalMoveCount: moves.length,
    moveTypeCounts: Object.fromEntries(Object.keys(typeCounts).sort().map(k=>[k,typeCounts[k]])),
    successor,
  };
  if (JSON.stringify(s) !== before) throw new Error("production observable mutated source state");
  return out;
}

function median(xs) {
  const a = xs.slice().sort((x,y)=>x-y);
  const n = a.length;
  return n % 2 ? a[(n-1)/2] : (a[n/2-1] + a[n/2]) / 2;
}
function robustScale(matrix) {
  if (!matrix.length) throw new Error("empty matrix");
  const d = matrix[0].length;
  const center = [], scale = [];
  for (let j=0;j<d;j++) {
    const col = matrix.map(r=>r[j]);
    if (col.some(x=>x === null || !Number.isFinite(x))) throw new Error("undefined/missing technical fixture value");
    const m = median(col);
    const mad = median(col.map(x=>Math.abs(x-m)));
    center.push(m); scale.push(mad);
  }
  const transformed = matrix.map(row => row.map((x,j)=> scale[j] === 0 ? 0 : (x-center[j])/scale[j]));
  return { center, scale, zeroVarianceColumns: scale.map((x,j)=>x===0?j:null).filter(x=>x!==null), transformed };
}
function covariance(matrix) {
  const n = matrix.length, d = matrix[0].length;
  const mean = Array(d).fill(0);
  for (const r of matrix) for (let j=0;j<d;j++) mean[j] += r[j];
  for (let j=0;j<d;j++) mean[j] /= n;
  const c = Array.from({length:d},()=>Array(d).fill(0));
  for (const r of matrix) for (let i=0;i<d;i++) for (let j=0;j<d;j++) c[i][j] += (r[i]-mean[i])*(r[j]-mean[j]);
  for (let i=0;i<d;i++) for (let j=0;j<d;j++) c[i][j] /= (n-1);
  return { mean, matrix:c };
}
function canonicalBasisForDiagonal(cov) {
  const d=cov.length;
  for (let i=0;i<d;i++) for (let j=0;j<d;j++) if (i!==j && cov[i][j] !== 0) return null;
  return Array.from({length:d},(_,j)=>({value:cov[j][j], vector:Array.from({length:d},(_,i)=>i===j?1:0), anchor:j}));
}
function jacobiEigen(cov) {
  const diagonal = canonicalBasisForDiagonal(cov);
  if (diagonal) return diagonal.sort((a,b)=> b.value-a.value || a.anchor-b.anchor);
  const n=cov.length, a=cov.map(r=>r.slice());
  const v=Array.from({length:n},(_,i)=>Array.from({length:n},(_,j)=>i===j?1:0));
  for (let iter=0; iter<128; iter++) {
    let p=0,q=1,best=Math.abs(a[0][1]||0);
    for(let i=0;i<n;i++) for(let j=i+1;j<n;j++) {
      const z=Math.abs(a[i][j]);
      if (z>best) {best=z;p=i;q=j;}
    }
    if (best===0) break;
    const phi=0.5*Math.atan2(2*a[p][q], a[q][q]-a[p][p]);
    const c=Math.cos(phi), s=Math.sin(phi);
    for(let k=0;k<n;k++) if(k!==p && k!==q) {
      const akp=a[k][p], akq=a[k][q];
      a[k][p]=a[p][k]=c*akp-s*akq;
      a[k][q]=a[q][k]=s*akp+c*akq;
    }
    const app=a[p][p], aqq=a[q][q], apq=a[p][q];
    a[p][p]=c*c*app-2*s*c*apq+s*s*aqq;
    a[q][q]=s*s*app+2*s*c*apq+c*c*aqq;
    a[p][q]=a[q][p]=0;
    for(let k=0;k<n;k++) {
      const vkp=v[k][p], vkq=v[k][q];
      v[k][p]=c*vkp-s*vkq; v[k][q]=s*vkp+c*vkq;
    }
  }
  const out=[];
  for(let j=0;j<n;j++) {
    let vec=v.map(r=>r[j]);
    let anchor=0; for(let i=1;i<n;i++) if(Math.abs(vec[i])>Math.abs(vec[anchor])) anchor=i;
    if(vec[anchor]<0) vec=vec.map(x=>-x);
    out.push({value:a[j][j],vector:vec,anchor});
  }
  out.sort((x,y)=> y.value-x.value || x.anchor-y.anchor || stableStringify(x.vector).localeCompare(stableStringify(y.vector)));
  return out;
}
function pca(matrix, componentCount) {
  const cv=covariance(matrix);
  const eig=jacobiEigen(cv.matrix).slice(0,componentCount);
  const scores=matrix.map(r=>eig.map(e=>r.reduce((s,x,j)=>s+(x-cv.mean[j])*e.vector[j],0)));
  return { mean:cv.mean, covariance:cv.matrix, eigenvalues:eig.map(e=>e.value), loadings:eig.map(e=>e.vector), anchors:eig.map(e=>e.anchor), scores };
}
function sqdist(a,b){let s=0;for(let i=0;i<a.length;i++){const z=a[i]-b[i];s+=z*z;}return s;}
function clusterSignature(members){return members.slice().sort((a,b)=>a-b).join(",");}
function ward(matrix,k){
  let cs=matrix.map((r,i)=>({members:[i],n:1,mean:r.slice()}));
  const merges=[];
  while(cs.length>k){
    let best=null;
    for(let i=0;i<cs.length;i++) for(let j=i+1;j<cs.length;j++){
      const A=cs[i],B=cs[j],cost=(A.n*B.n/(A.n+B.n))*sqdist(A.mean,B.mean);
      const sig=[clusterSignature(A.members),clusterSignature(B.members)].sort().join("|");
      const cand={i,j,cost,sig};
      if(!best || cost<best.cost || (cost===best.cost && sig<best.sig)) best=cand;
    }
    const A=cs[best.i],B=cs[best.j],n=A.n+B.n;
    const mean=A.mean.map((x,t)=>(x*A.n+B.mean[t]*B.n)/n);
    const merged={members:A.members.concat(B.members).sort((a,b)=>a-b),n,mean};
    merges.push({left:clusterSignature(A.members),right:clusterSignature(B.members),cost:best.cost,merged:clusterSignature(merged.members)});
    cs=cs.filter((_,idx)=>idx!==best.i && idx!==best.j); cs.push(merged);
    cs.sort((x,y)=>clusterSignature(x.members).localeCompare(clusterSignature(y.members)));
  }
  return {clusters:cs.map(c=>c.members),centroids:cs.map(c=>c.mean),merges};
}
function combinations(n,k){
  const out=[]; const cur=[];
  function rec(start){ if(cur.length===k){out.push(cur.slice());return;} for(let i=start;i<n;i++){cur.push(i);rec(i+1);cur.pop();}}
  rec(0); return out;
}
function assignToMedoids(matrix, medoids){
  return matrix.map((r)=>{
    let best=0,bestD=sqdist(r,matrix[medoids[0]]);
    for(let j=1;j<medoids.length;j++){const d=sqdist(r,matrix[medoids[j]]); if(d<bestD || (d===bestD && medoids[j]<medoids[best])){best=j;bestD=d;}}
    return {cluster:best,medoidIndex:medoids[best],distance2:bestD};
  });
}
function pam(matrix,k){
  let best=null;
  for(const medoids of combinations(matrix.length,k)){
    const assignments=assignToMedoids(matrix,medoids);
    const cost=assignments.reduce((s,a)=>s+a.distance2,0);
    const sig=medoids.join(",");
    if(!best || cost<best.cost || (cost===best.cost && sig<best.sig)) best={medoids:medoids.slice(),assignments,cost,sig};
  }
  return {medoids:best.medoids,assignments:best.assignments,cost:best.cost};
}
function assignFrozen(points, prototypes){
  return points.map(p=>{
    let label=0,d=sqdist(p,prototypes[0]);
    for(let j=1;j<prototypes.length;j++){const z=sqdist(p,prototypes[j]); if(z<d){label=j;d=z;}}
    return {label,distance2:d};
  });
}
module.exports={SEMANTICS,stableStringify,binary64Hex,rawIdentityObject,rawIdentityHash,technicalObservable,robustScale,pca,ward,pam,assignFrozen};
