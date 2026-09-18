"use strict";

const crypto=require("node:crypto");
const Source=require("./lgttci-compatibility-production.js");
const Measure=require("./sfcdf-stage1-production.js");
const Stats=require("./sfcdf-production.js");

const STUDY_ID="SFCDF-TRANSFER-STUDY1";
const P1="SFCDFT-P1-UNIFORM-LEGAL",P2="SFCDFT-P2-MIN-IMMEDIATE-CAPTURE";
const RF1="SFCDFT-RF1-MID-ANCHOR",RF2="SFCDFT-RF2-OFFSET-ANCHOR";
const C1="SFCDF-C1-UNIT-WIDTH-OCCUPANCY-FRACTION",C6="SFCDF-C6-CUMULATIVE-TREE-RAW-RATIO";

function need(x,m){if(!x)throw new Error(m);}
function stable(x){if(x===null||typeof x!=="object")return JSON.stringify(x);if(Array.isArray(x))return`[${x.map(stable).join(",")}]`;return`{${Object.keys(x).sort().map(k=>`${JSON.stringify(k)}:${stable(x[k])}`).join(",")}}`;}
function digest(x){return crypto.createHash("sha256").update(typeof x==="string"?x:stable(x),"utf8").digest("hex");}
function mapPolicy(x){if(x===P1)return Source.P1;if(x===P2)return Source.P2;throw new Error(`unknown SFCDFT policy ${x}`);}
function mapFamily(x){if(x===RF1)return Source.RF1;if(x===RF2)return Source.RF2;throw new Error(`unknown SFCDFT family ${x}`);}
function clone(x){return JSON.parse(JSON.stringify(x));}
function replay(E,policyId,seed,maxPly=80){
  const r=Source.replay(E,mapPolicy(policyId),seed,maxPly);
  need(r.moveKeys.length>=0,"move key array missing");
  return {policyId,seed,moveKeys:r.moveKeys,rows:r.rows,trajectorySha256:r.trajectorySha256,openingPrefixSha256:digest(r.moveKeys.slice(0,16).join("\n")),openingPrefixLength:Math.min(16,r.moveKeys.length),terminal:r.terminal};
}
function selectAnchors(replayResult,familyId){
  const a=Source.selectAnchors(replayResult.rows,mapFamily(familyId));
  const decorate=row=>row?{
    phase:row.phase,sourceSeed:replayResult.seed,selectedPly:row.ply,
    rootRawSha256:row.rawStateSha256,sourceTrajectorySha256:replayResult.trajectorySha256,
    openingPrefixSha256:replayResult.openingPrefixSha256,openingPrefixLength:replayResult.openingPrefixLength,
    rootState:clone(row.state),rootLegalWidth:row.rootLegalWidth
  }:null;
  return {familyId,namua:decorate(a.namua),mtaji:decorate(a.mtaji),complete:Boolean(a.complete)};
}
function sourceOnly(x){return x?{phase:x.phase,sourceSeed:x.sourceSeed,selectedPly:x.selectedPly,rootRawSha256:x.rootRawSha256,sourceTrajectorySha256:x.sourceTrajectorySha256,openingPrefixSha256:x.openingPrefixSha256,openingPrefixLength:x.openingPrefixLength,rootLegalWidth:x.rootLegalWidth}:null;}
function measureRoot(E,source){return Measure.measureRoot(E,source);}
function comparePair(pairId,n,m){
  const x=Measure.comparePair(pairId,n,m);
  return {pairId,candidates:{[C1]:x.candidates[C1],[C6]:x.candidates[C6]}};
}
function fraction(n,d){return Stats.fraction(BigInt(n),BigInt(d));}
function leq(a,b){need(a&&b&&a.defined&&b.defined,"defined fractions required");return BigInt(a.numerator)*BigInt(b.denominator)<=BigInt(b.numerator)*BigInt(a.denominator);}
function signP(pos,neg){return Stats.signTestTwoSided(pos,neg);}
function holm(slots){
  need(Array.isArray(slots)&&slots.length===8,"exactly 8 frozen test slots required");
  const rows=slots.map(x=>({...x,rawP:x.estimable===false?fraction(1n,1n):x.rawP}));
  rows.sort((a,b)=>{const l=BigInt(a.rawP.numerator)*BigInt(b.rawP.denominator),r=BigInt(b.rawP.numerator)*BigInt(a.rawP.denominator);return l<r?-1:l>r?1:String(a.slotId).localeCompare(String(b.slotId));});
  let open=true;
  for(let i=0;i<rows.length;i++){
    const threshold=fraction(1n,BigInt(20*(rows.length-i))),rawPass=leq(rows[i].rawP,threshold);
    rows[i].holmRank=i+1;rows[i].holmThreshold=threshold;rows[i].holmPass=open&&rawPass&&rows[i].estimable!==false;
    if(!rawPass)open=false;
  }
  return rows.sort((a,b)=>String(a.slotId).localeCompare(String(b.slotId)));
}
function claimDecision(claimId,slots,{technicalInvalid=false}={}){
  need([C1,C6].includes(claimId),"unknown claim endpoint");
  if(technicalInvalid)return"TECHNICAL-INVALID";
  need(Array.isArray(slots)&&slots.length===4,"claim requires four frozen cells");
  const expected=claimId===C1?1:-1;
  const opposite=slots.some(x=>x.estimable!==false&&x.holmPass===true&&x.direction===-expected);
  if(opposite)return"COUNTEREXAMPLE-BOUNDARY-DETECTED";
  if(slots.every(x=>x.estimable!==false&&x.holmPass===true&&x.direction===expected))return"GENERALIZES-WITHIN-FROZEN-DOMAIN";
  if(slots.some(x=>x.estimable===false))return"NON-ESTIMABLE";
  return"NOT-CONFIRMED";
}
function summarizeSigns(rows,candidateId){
  let comparable=0,positive=0,negative=0,zero=0;
  for(const row of rows){const c=row.candidates[candidateId];if(!c||c.sign===null)continue;comparable++;if(c.sign>0)positive++;else if(c.sign<0)negative++;else zero++;}
  const nonZero=positive+negative,direction=positive>negative?1:negative>positive?-1:0;
  return {comparable,positive,negative,zero,nonZero,direction,estimable:comparable===rows.length&&nonZero>=12,rawP:signP(positive,negative)};
}
module.exports={STUDY_ID,P1,P2,RF1,RF2,C1,C6,stable,digest,mapPolicy,mapFamily,replay,selectAnchors,sourceOnly,measureRoot,comparePair,fraction,signP,holm,claimDecision,summarizeSigns,stateKey:Source.stateKey,moveKey:Source.moveKey};
