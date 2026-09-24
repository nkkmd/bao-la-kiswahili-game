#!/usr/bin/env node
"use strict";

function need(x,m){if(!x)throw new Error(m);}
function choose(n,k){
  if(!Number.isInteger(n)||!Number.isInteger(k)||n<0||k<0||k>n)return 0;
  k=Math.min(k,n-k);
  let v=1;
  for(let i=1;i<=k;i++)v=v*(n-k+i)/i;
  return v;
}
function hypergeomPmf(N,K,n){
  need(Number.isInteger(N)&&Number.isInteger(K)&&Number.isInteger(n),"hypergeom integer inputs required");
  need(N>=0&&K>=0&&K<=N&&n>=0&&n<=N,"hypergeom range mismatch");
  const den=choose(N,n), out=new Map();
  const lo=Math.max(0,n-(N-K)), hi=Math.min(n,K);
  for(let x=lo;x<=hi;x++)out.set(x,choose(K,x)*choose(N-K,n-x)/den);
  const mass=[...out.values()].reduce((a,b)=>a+b,0);
  need(Math.abs(mass-1)<1e-12,`hypergeom mass mismatch ${mass}`);
  return out;
}
function convolve(a,b){
  const out=new Map();
  for(const [x,p] of a)for(const [y,q] of b)out.set(x+y,(out.get(x+y)||0)+p*q);
  const mass=[...out.values()].reduce((s,p)=>s+p,0);
  need(Math.abs(mass-1)<1e-12,`convolution mass mismatch ${mass}`);
  return out;
}
function phaseRow(x,label){
  need(x&&Number.isInteger(x.highChanged)&&Number.isInteger(x.lowChanged),`${label} counts required`);
  need(x.highChanged>=0&&x.highChanged<=12&&x.lowChanged>=0&&x.lowChanged<=12,`${label} counts out of range`);
  const K=x.highChanged+x.lowChanged, unchanged=24-K;
  return {phase:label,highChanged:x.highChanged,lowChanged:x.lowChanged,K,unchanged,
    supportPass:K>=6&&unchanged>=6};
}
function exactStratifiedTest(namua,mtaji){
  const a=phaseRow(namua,"namua"), b=phaseRow(mtaji,"mtaji");
  if(!a.supportPass||!b.supportPass){
    return {estimable:false,decision:"NON-ESTIMABLE",reason:"PER-PHASE-SUPPORT",phases:{namua:a,mtaji:b}};
  }
  const pmf=convolve(hypergeomPmf(24,a.K,12),hypergeomPmf(24,b.K,12));
  const observedT=a.highChanged+b.highChanged, KTotal=a.K+b.K;
  let lower=0,upper=0;
  for(const [t,p] of pmf){if(t<=observedT)lower+=p;if(t>=observedT)upper+=p;}
  const pTwoSided=Math.min(1,2*Math.min(lower,upper));
  const signedCountDifference=2*observedT-KTotal;
  const direction=signedCountDifference>0?"HIGHER-IN-HIGH":signedCountDifference<0?"LOWER-IN-HIGH":"ZERO-DIRECTION";
  const riskDifference=signedCountDifference/24;
  return {estimable:true,decision:"PENDING-HOLM",observedT,KTotal,signedCountDifference,riskDifference,direction,pTwoSided,
    lowerTail:lower,upperTail:upper,phases:{namua:a,mtaji:b}};
}
function holm12(tests,alpha=1/20){
  need(Array.isArray(tests)&&tests.length===12,"Holm family must contain exactly 12 tests");
  need(alpha===1/20,"Holm family alpha must remain 1/20");
  const sorted=tests.map((x,i)=>({...x,_i:i})).sort((a,b)=>a.pTwoSided-b.pTwoSided||String(a.testId).localeCompare(String(b.testId)));
  let still=true, prevAdj=0;
  for(let i=0;i<12;i++){
    const divisor=12-i, cutoff=alpha/divisor;
    const rawAdj=Math.min(1,sorted[i].pTwoSided*divisor);
    const adjustedP=Math.max(prevAdj,rawAdj);
    prevAdj=adjustedP;
    const significant=still&&sorted[i].pTwoSided<=cutoff;
    if(!significant)still=false;
    Object.assign(sorted[i],{holmRank:i+1,holmCutoff:cutoff,holmAdjustedP:adjustedP,holmSignificant:significant});
  }
  const byOriginal=Array(12);
  for(const x of sorted)byOriginal[x._i]=Object.fromEntries(Object.entries(x).filter(([k])=>k!=="_i"));
  return byOriginal;
}
function formalDecision(x){
  if(!x.estimable)return "NON-ESTIMABLE";
  need(typeof x.holmSignificant==="boolean","Holm result required");
  if(!x.holmSignificant)return "NOT-GENERALIZED";
  if(x.direction==="HIGHER-IN-HIGH")return "GENERALIZATION-CONFIRMED";
  if(x.direction==="LOWER-IN-HIGH")return "COUNTEREXAMPLE-CONFIRMED";
  return "NOT-GENERALIZED";
}
module.exports={choose,hypergeomPmf,convolve,exactStratifiedTest,holm12,formalDecision};
