"use strict";
function need(x,m){if(!x)throw new Error(m);}
function gcd(a,b){a=a<0n?-a:a;b=b<0n?-b:b;while(b){const t=a%b;a=b;b=t;}return a||1n;}
function q(n,d=1n){n=BigInt(n);d=BigInt(d);need(d!==0n,"zero denominator");if(d<0n){n=-n;d=-d;}const g=gcd(n,d);return{numerator:String(n/g),denominator:String(d/g),defined:true};}
function undef(){return{numerator:"0",denominator:"0",defined:false};}
function toPair(x){need(x&&x.defined===true,"undefined rational");return[BigInt(x.numerator),BigInt(x.denominator)];}
function cmp(a,b){const[an,ad]=toPair(a),[bn,bd]=toPair(b);const z=an*bd-bn*ad;return z<0n?-1:z>0n?1:0;}
function mulInt(a,n){const[an,ad]=toPair(a);return q(an*BigInt(n),ad);}
function min(a,b){return cmp(a,b)<=0?a:b;}
function max(a,b){return cmp(a,b)>=0?a:b;}
function choose(n,k){n=BigInt(n);k=BigInt(k);if(k<0n||k>n)return 0n;k=k>n-k?n-k:k;let r=1n;for(let i=1n;i<=k;i++)r=r*(n-k+i)/i;return r;}
function exactSignTest(positive,negative,ties=0){
  positive=Number(positive);negative=Number(negative);ties=Number(ties);
  need(Number.isInteger(positive)&&positive>=0&&Number.isInteger(negative)&&negative>=0&&Number.isInteger(ties)&&ties>=0,"invalid counts");
  const nonzero=positive+negative;
  if(nonzero===0)return{positive,negative,ties,nonzero,pValue:undef(),estimable:false};
  const k=Math.min(positive,negative);let tail=0n;for(let i=0;i<=k;i++)tail+=choose(nonzero,i);
  const den=1n<<BigInt(nonzero);let num=2n*tail;if(num>den)num=den;
  return{positive,negative,ties,nonzero,pValue:q(num,den),estimable:true};
}
function holm8(rows){
  need(Array.isArray(rows)&&rows.length===8,"8 tests required");
  const one=q(1n),sorted=rows.map(r=>({...r})).sort((a,b)=>cmp(a.pValue,b.pValue)||String(a.testId).localeCompare(String(b.testId)));
  const out={};let prev=q(0n);
  for(let i=0;i<8;i++){let adj=min(one,mulInt(sorted[i].pValue,8-i));adj=max(prev,adj);prev=adj;out[sorted[i].testId]={...sorted[i],holmAdjustedPValue:adj,holmRank:i+1};}
  return rows.map(r=>out[r.testId]);
}
function significantAtFamilyAlpha(row){return cmp(row.holmAdjustedPValue,q(1n,20n))<=0;}
function decision({estimable,holmSignificant,medianSign,expectedSign}){
  if(!estimable)return"NON-ESTIMABLE";
  if(!holmSignificant)return"NOT-GENERALIZED";
  need(medianSign===1||medianSign===-1,"significant row must have nonzero median direction");
  need(expectedSign===1||expectedSign===-1,"invalid expected sign");
  return medianSign===expectedSign?"GENERALIZATION-CONFIRMED":"COUNTEREXAMPLE-CONFIRMED";
}
module.exports={q,cmp,exactSignTest,holm8,significantAtFamilyAlpha,decision};
