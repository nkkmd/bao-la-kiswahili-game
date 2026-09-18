"use strict";

function need(x,m){if(!x)throw new Error(m);}
function gcd(a,b){a=a<0n?-a:a;b=b<0n?-b:b;while(b)[a,b]=[b,a%b];return a;}
function q(n,d=1n){n=BigInt(n);d=BigInt(d);if(d===0n)return{numerator:"0",denominator:"0",defined:false};if(d<0n){n=-n;d=-d;}const g=gcd(n,d);return{numerator:String(n/g),denominator:String(d/g),defined:true};}
function cmp(a,b){need(a.defined&&b.defined,"defined rational required");const l=BigInt(a.numerator)*BigInt(b.denominator),r=BigInt(b.numerator)*BigInt(a.denominator);return l<r?-1:l>r?1:0;}
function choose(n,k){n=BigInt(n);k=BigInt(k);if(k<0n||k>n)return 0n;if(k>n-k)k=n-k;let x=1n;for(let i=1n;i<=k;i++)x=x*(n-k+i)/i;return x;}
function signTest(pos,neg){pos=Number(pos);neg=Number(neg);const n=pos+neg;if(!n)return q(1n,1n);const t=Math.min(pos,neg);let c=0n;for(let k=0;k<=t;k++)c+=choose(n,k);const den=1n<<BigInt(n);let num=2n*c;if(num>den)num=den;return q(num,den);}
function direction(positive,negative){return positive>negative?"MTAJI-GREATER":negative>positive?"NAMUA-GREATER":"TIE";}
function holm(rows){
  need(Array.isArray(rows)&&rows.length===4,"four cells required");
  const sorted=rows.map(x=>({...x})).sort((a,b)=>cmp(a.rawP,b.rawP)||a.cellId.localeCompare(b.cellId));
  let open=true;
  for(let i=0;i<sorted.length;i++){
    const threshold=q(1n,BigInt(40*(4-i)));
    const rawPass=cmp(sorted[i].rawP,threshold)<=0;
    sorted[i].holmRank=i+1;sorted[i].holmThreshold=threshold;sorted[i].holmPass=open&&rawPass;
    if(!rawPass)open=false;
  }
  return sorted.sort((a,b)=>a.cellId.localeCompare(b.cellId));
}
function evaluateClaim(cells,historicalDirection){
  need(["MTAJI-GREATER","NAMUA-GREATER"].includes(historicalDirection),"historical direction required");
  need(Array.isArray(cells)&&cells.length===4,"four cells required");
  const ids=new Set(cells.map(x=>x.cellId));need(ids.size===4,"unique cell ids required");
  if(cells.some(x=>x.technicalValid===false))return{decision:"TECHNICAL-INVALID",historicalDirection,cells:[]};
  if(cells.some(x=>x.estimable===false||x.comparable!==24||(x.positive+x.negative)<16))return{decision:"NON-ESTIMABLE",historicalDirection,cells:[]};
  const measured=cells.map(x=>{
    need(x.positive+x.negative+x.zero===x.comparable,"cell counts inconsistent");
    return {...x,nonZero:x.positive+x.negative,observedDirection:direction(x.positive,x.negative),rawP:signTest(x.positive,x.negative)};
  });
  const adjusted=holm(measured);
  const significantOpposite=adjusted.some(x=>x.holmPass&&x.observedDirection!=="TIE"&&x.observedDirection!==historicalDirection);
  const allHistorical=adjusted.every(x=>x.holmPass&&x.observedDirection===historicalDirection);
  const decision=significantOpposite?"COUNTEREXAMPLE-BOUNDARY-DETECTED":allHistorical?"GENERALIZES-WITHIN-FROZEN-DOMAIN":"NOT-CONFIRMED";
  return{decision,historicalDirection,cells:adjusted};
}
module.exports={q,cmp,choose,signTest,holm,evaluateClaim};
