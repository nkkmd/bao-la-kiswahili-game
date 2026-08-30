"use strict";

const crypto = require("node:crypto");
const E = require("../../../public/engine.js");
const AI = require("../../../public/ai.js");

const SEMANTICS = "psrre-stage0-independent/technical-only/v1";

function deepCopy(v){return JSON.parse(JSON.stringify(v));}
function canonical(v){
  if(Array.isArray(v)) return "["+v.map(canonical).join(",")+"]";
  if(v!==null && typeof v==="object"){
    const ks=Object.keys(v).sort(); const xs=[];
    for(const k of ks) xs.push(JSON.stringify(k)+":"+canonical(v[k]));
    return "{"+xs.join(",")+"}";
  }
  return JSON.stringify(v);
}
function digest(s){return crypto.createHash("sha256").update(s,"utf8").digest("hex");}
function f64(x){const a=new ArrayBuffer(8);new DataView(a).setFloat64(0,x,false);return Buffer.from(a).toString("hex");}
function rawObject(s){
  const o={}; o.pits=deepCopy(s.pits);o.reserve=deepCopy(s.reserve);o.houseOwned=deepCopy(s.houseOwned);
  o.player=s.player;o.phase=s.phase;o.winner=s.winner;o.pending=deepCopy(s.pending);return o;
}
function rawHash(s){return digest(canonical(rawObject(s)));}
function moves(s){return E.moveVariants(s).map(deepCopy).sort((x,y)=>AI.moveKey(x).localeCompare(AI.moveKey(y)));}
function technicalObservable(s){
  const snapshot=JSON.stringify(s), actor=s.player, opp=actor===0?1:0, ms=moves(s);
  const types=new Map(), next=[];
  for(const m of ms){
    types.set(m.type,(types.get(m.type)||0)+1);
    const n=E.applyMove(s,m).state;
    next.push({moveKey:AI.moveKey(m),rawHash:rawHash(n),phase:n.phase,player:n.player,winner:n.winner,replyWidth:n.winner===null?moves(n).length:0});
  }
  function scan(p){
    let total=0,occupied=0,maxPit=0;
    for(const row of [E.FRONT,E.BACK]) for(let i=0;i<8;i++){const x=s.pits[p][row][i];total+=x;if(x>0)occupied++;if(x>maxPit)maxPit=x;}
    return {total,occupied,maxPit};
  }
  const typeObj={}; for(const k of Array.from(types.keys()).sort()) typeObj[k]=types.get(k);
  const out={semantics:SEMANTICS,rawHash:rawHash(s),phase:s.phase,player:actor,reserveActor:s.reserve[actor],reserveOpponent:s.reserve[opp],
    pendingActor:s.pending[actor],pendingOpponent:s.pending[opp],houseOwnedActor:s.houseOwned[actor],houseOwnedOpponent:s.houseOwned[opp],
    actorPits:scan(actor),opponentPits:scan(opp),legalMoveCount:ms.length,moveTypeCounts:typeObj,successor:next};
  if(JSON.stringify(s)!==snapshot) throw new Error("independent observable mutated source state");
  return out;
}
function med(a){
  const b=a.slice().sort((x,y)=>x-y),n=b.length;
  if(n&1) return b[(n-1)>>1];
  return (b[n/2-1]+b[n/2])/2;
}
function robustScale(matrix){
  if(matrix.length===0) throw new Error("empty matrix");
  const d=matrix[0].length,center=new Array(d),scale=new Array(d),zeros=[];
  for(let j=0;j<d;j++){
    const c=[]; for(let i=0;i<matrix.length;i++){const x=matrix[i][j];if(x===null||!Number.isFinite(x)) throw new Error("undefined/missing technical fixture value");c.push(x);}
    center[j]=med(c); const dev=c.map(x=>Math.abs(x-center[j]));scale[j]=med(dev);if(scale[j]===0)zeros.push(j);
  }
  const transformed=[];for(const r of matrix){const z=[];for(let j=0;j<d;j++)z.push(scale[j]===0?0:(r[j]-center[j])/scale[j]);transformed.push(z);}
  return {center,scale,zeroVarianceColumns:zeros,transformed};
}
function cov(matrix){
  const n=matrix.length,d=matrix[0].length,m=Array(d).fill(0);
  for(let j=0;j<d;j++){let s=0;for(let i=0;i<n;i++)s+=matrix[i][j];m[j]=s/n;}
  const c=Array.from({length:d},()=>Array(d).fill(0));
  for(let i=0;i<d;i++)for(let j=0;j<d;j++){let s=0;for(let r=0;r<n;r++)s+=(matrix[r][i]-m[i])*(matrix[r][j]-m[j]);c[i][j]=s/(n-1);}
  return {mean:m,matrix:c};
}
function diagonalEigen(c){
  const d=c.length;
  for(let i=0;i<d;i++)for(let j=0;j<d;j++)if(i!==j&&c[i][j]!==0)return null;
  const xs=[];for(let j=0;j<d;j++){const v=Array(d).fill(0);v[j]=1;xs.push({value:c[j][j],vector:v,anchor:j});}
  xs.sort((a,b)=>b.value-a.value||a.anchor-b.anchor);return xs;
}
function jacobi(c){
  const diag=diagonalEigen(c);if(diag)return diag;
  const n=c.length,A=c.map(r=>r.slice()),V=Array.from({length:n},(_,i)=>Array.from({length:n},(_,j)=>i===j?1:0));
  let loops=0;
  while(loops++<128){
    let pair=null;
    for(let i=0;i<n;i++)for(let j=i+1;j<n;j++){const z=Math.abs(A[i][j]);if(pair===null||z>pair.z){pair={i,j,z};}}
    if(pair===null||pair.z===0)break;
    const p=pair.i,q=pair.j,theta=0.5*Math.atan2(2*A[p][q],A[q][q]-A[p][p]),co=Math.cos(theta),si=Math.sin(theta);
    for(let k=0;k<n;k++){if(k===p||k===q)continue;const x=A[k][p],y=A[k][q];A[k][p]=A[p][k]=co*x-si*y;A[k][q]=A[q][k]=si*x+co*y;}
    const x=A[p][p],y=A[q][q],z=A[p][q];A[p][p]=co*co*x-2*si*co*z+si*si*y;A[q][q]=si*si*x+2*si*co*z+co*co*y;A[p][q]=A[q][p]=0;
    for(let k=0;k<n;k++){const x0=V[k][p],y0=V[k][q];V[k][p]=co*x0-si*y0;V[k][q]=si*x0+co*y0;}
  }
  const out=[];
  for(let j=0;j<n;j++){let v=V.map(r=>r[j]),a=0;for(let i=1;i<n;i++)if(Math.abs(v[i])>Math.abs(v[a]))a=i;if(v[a]<0)v=v.map(x=>-x);out.push({value:A[j][j],vector:v,anchor:a});}
  out.sort((a,b)=>b.value-a.value||a.anchor-b.anchor||canonical(a.vector).localeCompare(canonical(b.vector)));return out;
}
function pca(matrix,k){
  const C=cov(matrix),es=jacobi(C.matrix).slice(0,k),scores=[];
  for(const r of matrix){const row=[];for(const e of es){let s=0;for(let j=0;j<r.length;j++)s+=(r[j]-C.mean[j])*e.vector[j];row.push(s);}scores.push(row);}
  return {mean:C.mean,covariance:C.matrix,eigenvalues:es.map(e=>e.value),loadings:es.map(e=>e.vector),anchors:es.map(e=>e.anchor),scores};
}
function d2(a,b){let z=0;for(let i=0;i<a.length;i++){const q=a[i]-b[i];z+=q*q;}return z;}
function sig(xs){return xs.slice().sort((a,b)=>a-b).join(",");}
function ward(matrix,k){
  let groups=[];for(let i=0;i<matrix.length;i++)groups.push({members:[i],n:1,mean:matrix[i].slice()});
  const merges=[];
  while(groups.length>k){
    const cand=[];
    for(let a=0;a<groups.length;a++)for(let b=a+1;b<groups.length;b++){
      const A=groups[a],B=groups[b],cost=(A.n*B.n/(A.n+B.n))*d2(A.mean,B.mean),key=[sig(A.members),sig(B.members)].sort().join("|");
      cand.push({a,b,cost,key});
    }
    cand.sort((x,y)=>x.cost-y.cost||x.key.localeCompare(y.key));const best=cand[0],A=groups[best.a],B=groups[best.b],n=A.n+B.n;
    const mean=[];for(let j=0;j<A.mean.length;j++)mean.push((A.mean[j]*A.n+B.mean[j]*B.n)/n);
    const m={members:A.members.concat(B.members).sort((x,y)=>x-y),n,mean};merges.push({left:sig(A.members),right:sig(B.members),cost:best.cost,merged:sig(m.members)});
    const keep=[];for(let i=0;i<groups.length;i++)if(i!==best.a&&i!==best.b)keep.push(groups[i]);keep.push(m);keep.sort((x,y)=>sig(x.members).localeCompare(sig(y.members)));groups=keep;
  }
  return {clusters:groups.map(g=>g.members),centroids:groups.map(g=>g.mean),merges};
}
function combos(n,k){
  const out=[];function go(prefix,start){if(prefix.length===k){out.push(prefix.slice());return;}for(let i=start;i<n;i++)go(prefix.concat([i]),i+1);}go([],0);return out;
}
function assignments(matrix,medoids){
  const out=[];
  for(const r of matrix){let best={cluster:0,medoidIndex:medoids[0],distance2:d2(r,matrix[medoids[0]])};
    for(let j=1;j<medoids.length;j++){const z=d2(r,matrix[medoids[j]]);if(z<best.distance2||(z===best.distance2&&medoids[j]<best.medoidIndex))best={cluster:j,medoidIndex:medoids[j],distance2:z};}
    out.push(best);}
  return out;
}
function pam(matrix,k){
  const choices=combos(matrix.length,k);let best=null;
  for(const ms of choices){const as=assignments(matrix,ms);let cost=0;for(const a of as)cost+=a.distance2;const key=ms.join(",");
    if(best===null||cost<best.cost||(cost===best.cost&&key<best.key))best={medoids:ms.slice(),assignments:as,cost,key};}
  return {medoids:best.medoids,assignments:best.assignments,cost:best.cost};
}
function assignFrozen(points,prototypes){
  const out=[];for(const p of points){let label=0,best=d2(p,prototypes[0]);for(let j=1;j<prototypes.length;j++){const z=d2(p,prototypes[j]);if(z<best){label=j;best=z;}}out.push({label,distance2:best});}return out;
}
module.exports={SEMANTICS,stableStringify:canonical,binary64Hex:f64,rawIdentityObject:rawObject,rawIdentityHash:rawHash,technicalObservable,robustScale,pca,ward,pam,assignFrozen};
