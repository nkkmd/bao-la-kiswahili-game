"use strict";

const crypto=require("node:crypto");
const Source=require("./lgttci-compatibility-independent.js");
const Measure=require("./sfcdf-stage1-independent.js");
const Stats=require("./sfcdf-independent.js");

const STUDY_ID="SFCDF-TRANSFER-STUDY1";
const P1="SFCDFT-P1-UNIFORM-LEGAL",P2="SFCDFT-P2-MIN-IMMEDIATE-CAPTURE";
const RF1="SFCDFT-RF1-MID-ANCHOR",RF2="SFCDFT-RF2-OFFSET-ANCHOR";
const C1="SFCDF-C1-UNIT-WIDTH-OCCUPANCY-FRACTION",C6="SFCDF-C6-CUMULATIVE-TREE-RAW-RATIO";

function assertOk(x,m){if(!x)throw new Error(m);}
function canonical(x){if(x===null||typeof x!=="object")return JSON.stringify(x);if(Array.isArray(x))return`[${x.map(canonical).join(",")}]`;const ks=Object.keys(x).sort();return`{${ks.map(k=>`${JSON.stringify(k)}:${canonical(x[k])}`).join(",")}}`;}
function hash(x){return crypto.createHash("sha256").update(typeof x==="string"?x:canonical(x),"utf8").digest("hex");}
function policy(x){if(x===P1)return Source.P1;if(x===P2)return Source.P2;throw new Error(`independent unknown SFCDFT policy ${x}`);}
function family(x){if(x===RF1)return Source.RF1;if(x===RF2)return Source.RF2;throw new Error(`independent unknown SFCDFT family ${x}`);}
function copy(x){return structuredClone(x);}
function replay(E,policyId,seed,maxPly=80){
  const r=Source.replay(E,policy(policyId),seed,maxPly);
  return {policyId,seed,moveKeys:[...r.moveKeys],rows:r.rows,trajectorySha256:r.trajectorySha256,openingPrefixSha256:hash(r.moveKeys.slice(0,16).join("\n")),openingPrefixLength:Math.min(16,r.moveKeys.length),terminal:r.terminal};
}
function selectAnchors(replayResult,familyId){
  const a=Source.selectAnchors(replayResult.rows,family(familyId));
  function wrap(row){if(!row)return null;return{phase:row.phase,sourceSeed:replayResult.seed,selectedPly:row.ply,rootRawSha256:row.rawStateSha256,sourceTrajectorySha256:replayResult.trajectorySha256,openingPrefixSha256:replayResult.openingPrefixSha256,openingPrefixLength:replayResult.openingPrefixLength,rootState:copy(row.state),rootLegalWidth:row.rootLegalWidth};}
  return {familyId,namua:wrap(a.namua),mtaji:wrap(a.mtaji),complete:a.complete===true};
}
function publicSource(x){if(!x)return null;const {phase,sourceSeed,selectedPly,rootRawSha256,sourceTrajectorySha256,openingPrefixSha256,openingPrefixLength,rootLegalWidth}=x;return{phase,sourceSeed,selectedPly,rootRawSha256,sourceTrajectorySha256,openingPrefixSha256,openingPrefixLength,rootLegalWidth};}
function measureRoot(E,source){return Measure.measureRoot(E,source);}
function comparePair(pairId,n,m){const z=Measure.comparePair(pairId,n,m);const c=Object.create(null);c[C1]=z.candidates[C1];c[C6]=z.candidates[C6];return{pairId,candidates:c};}
function ratio(n,d){return Stats.fraction(BigInt(n),BigInt(d));}
function lessOrEqual(a,b){assertOk(a&&b&&a.defined&&b.defined,"independent defined fractions required");return BigInt(a.numerator)*BigInt(b.denominator)<=BigInt(b.numerator)*BigInt(a.denominator);}
function pSign(pos,neg){return Stats.signTestTwoSided(pos,neg);}
function holm(slots){
  assertOk(Array.isArray(slots)&&slots.length===8,"independent exactly 8 slots required");
  const xs=slots.map(s=>({...s,rawP:s.estimable===false?ratio(1n,1n):s.rawP}));
  xs.sort((a,b)=>{const x=BigInt(a.rawP.numerator)*BigInt(b.rawP.denominator),y=BigInt(b.rawP.numerator)*BigInt(a.rawP.denominator);if(x<y)return-1;if(x>y)return 1;return String(a.slotId).localeCompare(String(b.slotId));});
  let gate=true;
  for(let rank=0;rank<xs.length;rank++){
    const t=ratio(1n,BigInt(20*(xs.length-rank)));
    const pass=lessOrEqual(xs[rank].rawP,t);
    xs[rank].holmRank=rank+1;xs[rank].holmThreshold=t;xs[rank].holmPass=gate&&pass&&xs[rank].estimable!==false;
    if(!pass)gate=false;
  }
  xs.sort((a,b)=>String(a.slotId).localeCompare(String(b.slotId)));
  return xs;
}
function claimDecision(claimId,slots,opts={}){
  assertOk(claimId===C1||claimId===C6,"independent unknown claim");
  if(opts.technicalInvalid===true)return"TECHNICAL-INVALID";
  assertOk(Array.isArray(slots)&&slots.length===4,"independent claim requires 4 cells");
  const wanted=claimId===C1?1:-1;
  for(const s of slots)if(s.estimable!==false&&s.holmPass===true&&s.direction===-wanted)return"COUNTEREXAMPLE-BOUNDARY-DETECTED";
  let all=true;for(const s of slots)if(s.estimable===false||s.holmPass!==true||s.direction!==wanted)all=false;
  if(all)return"GENERALIZES-WITHIN-FROZEN-DOMAIN";
  for(const s of slots)if(s.estimable===false)return"NON-ESTIMABLE";
  return"NOT-CONFIRMED";
}
function summarizeSigns(rows,candidateId){
  let comparable=0,positive=0,negative=0,zero=0;
  for(const row of rows){const x=row.candidates[candidateId];if(!x||x.sign===null)continue;comparable++;if(x.sign===1)positive++;else if(x.sign===-1)negative++;else zero++;}
  const nonZero=positive+negative;
  return{comparable,positive,negative,zero,nonZero,direction:positive>negative?1:negative>positive?-1:0,estimable:comparable===rows.length&&nonZero>=12,rawP:pSign(positive,negative)};
}
module.exports={STUDY_ID,P1,P2,RF1,RF2,C1,C6,stable:canonical,digest:hash,mapPolicy:policy,mapFamily:family,replay,selectAnchors,sourceOnly:publicSource,measureRoot,comparePair,fraction:ratio,signP:pSign,holm,claimDecision,summarizeSigns,stateKey:Source.stateKey,moveKey:Source.moveKey};
