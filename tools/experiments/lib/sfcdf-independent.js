"use strict";

const V = require("./lgtgmiv-stage1-independent.js");

const STUDY_ID = "SFCDF-STUDY1";
const HORIZON = 5;
const CANDIDATES = [
  "SFCDF-C1-UNIT-WIDTH-OCCUPANCY-FRACTION",
  "SFCDF-C2-WIDTH-COMPRESSION-FRACTION",
  "SFCDF-C3-LONGEST-UNIT-WIDTH-RUN",
  "SFCDF-C4-RECONVERGENT-STATE-OCCUPANCY-FRACTION",
  "SFCDF-C5-ROOT-BRANCH-OVERLAP-FRACTION",
  "SFCDF-C6-CUMULATIVE-TREE-RAW-RATIO"
];

function assertOk(v, m) { if (!v) throw new Error(m); }
function abs(x){return x<0n?-x:x;}
function reducePair(n,d){
  n=BigInt(n);d=BigInt(d);
  if(d===0n)return{numerator:"0",denominator:"0",defined:false};
  if(d<0n){n=-n;d=-d;}
  let a=abs(n),b=abs(d);while(b!==0n){const r=a%b;a=b;b=r;}const g=a===0n?d:a;
  return{numerator:String(n/g),denominator:String(d/g),defined:true};
}
function delta(x,y){if(!x||!y||!x.defined||!y.defined)return reducePair(0n,0n);return reducePair(BigInt(x.numerator)*BigInt(y.denominator)-BigInt(y.numerator)*BigInt(x.denominator),BigInt(x.denominator)*BigInt(y.denominator));}
function direction(q){if(!q||!q.defined)return null;const n=BigInt(q.numerator);return n===0n?0:n>0n?1:-1;}
function addField(rows,name){let z=0n;for(const r of rows)z+=BigInt(r[name]);return z;}
function countPositiveWidthStates(layers){let z=0n;for(const layer of layers){const h=layer.replyWidthHistogram||{};for(const k of Object.keys(h)){if(Number(k)>0)z+=BigInt(h[k]);}}return z;}
function maxUnitRun(narrow){const rec=(narrow&&narrow.records)||[];return rec.reduce((m,r)=>Math.max(m,Number(r.length)||0),0);}
function overlapRatio(g){
  const labs=[...(g.rootMoveLabels||[])]; const total=BigInt(labs.length*(labs.length-1)/2); if(total===0n)return reducePair(0n,0n);
  const seen=new Map();
  for(const row of g.rootBranchPairOverlapByDepth||[]){if(row.depth<1||row.depth>HORIZON)continue;for(const p of row.pairs||[]){if(!p.overlap||!p.overlap.defined||BigInt(p.overlap.numerator)<=0n)continue;const pair=[p.rootMoveA,p.rootMoveB].sort();seen.set(pair.join("\u0000"),true);}}
  return reducePair(BigInt(seen.size),total);
}
function deriveFromMeasurement(measurement){
  assertOk(measurement&&measurement.reconstructionCore,"measurement reconstructionCore required");
  const core=measurement.reconstructionCore;
  assertOk(core.targetDepth===HORIZON,"SFCDF requires relative depth 5");
  assertOk(core.representation&&core.representation.mode==="RAW-ONLY","RAW-only representation required");
  assertOk(Array.isArray(core.representation.validatedTransformSet)&&core.representation.validatedTransformSet.length===0,"validated transform set must be empty");
  assertOk(core.layers.length===6&&core.parentLayers.length===5,"complete depth layers required");

  const unit=addField(core.layers,"unitWidthStateCount");
  const positive=countPositiveWidthStates(core.layers);
  const cmp=addField(core.parentLayers,"widthCompressionCount");
  const exp=addField(core.parentLayers,"widthExpansionCount");
  const stb=addField(core.parentLayers,"widthStableCount");
  const compared=cmp+exp+stb;
  const longest=maxUnitRun(core.narrowPathGeometry);
  const reconv=addField(core.layers.slice(1),"reconvergentRawStateCount");
  let nonroot=0n;for(const row of core.layers.slice(1))nonroot+=BigInt(row.uniqueRawStateCount);
  const tree=addField(core.layers,"treeNodeOccurrences");
  const raw=BigInt(core.cumulative.distinctRawStates);
  const reopen=addField(core.parentLayers,"branchReopeningCount");
  const extinct=addField(core.parentLayers,"branchExtinctionCount");

  const endpoints=Object.create(null);
  endpoints["SFCDF-C1-UNIT-WIDTH-OCCUPANCY-FRACTION"]=reducePair(unit,positive);
  endpoints["SFCDF-C2-WIDTH-COMPRESSION-FRACTION"]=reducePair(cmp,compared);
  endpoints["SFCDF-C3-LONGEST-UNIT-WIDTH-RUN"]=reducePair(BigInt(longest),1n);
  endpoints["SFCDF-C4-RECONVERGENT-STATE-OCCUPANCY-FRACTION"]=reducePair(reconv,nonroot);
  endpoints["SFCDF-C5-ROOT-BRANCH-OVERLAP-FRACTION"]=overlapRatio(core.rootBranchGeometry);
  endpoints["SFCDF-C6-CUMULATIVE-TREE-RAW-RATIO"]=reducePair(tree,raw);

  return {
    rootRawSha256:core.rootRawSha256,
    targetDepth:core.targetDepth,
    constructSeparation:{corridorCandidates:CANDIDATES.slice(0,3),funnelCandidates:CANDIDATES.slice(3),combinedClassDefined:false},
    rawPrimitives:{
      unitWidthStatePresenceDepth0To5:String(unit),
      positiveReplyRawStatePresenceDepth0To5:String(positive),
      widthCompressionTransitionCountDepth0To4:String(cmp),
      widthExpansionTransitionCountDepth0To4:String(exp),
      widthStableTransitionCountDepth0To4:String(stb),
      widthComparisonTransitionCountDepth0To4:String(compared),
      branchReopeningCountDepth0To4:String(reopen),
      branchExtinctionCountDepth0To4:String(extinct),
      longestUnitWidthRun:longest,
      unitWidthRunLengthHistogram:(core.narrowPathGeometry&&core.narrowPathGeometry.lengthHistogram)||{},
      narrowPathRecordsDigestSha256:core.narrowPathGeometry?core.narrowPathGeometry.recordsDigestSha256:null,
      reconvergentRawStatePresenceDepth1To5:String(reconv),
      nonRootUniqueRawStatePresenceDepth1To5:String(nonroot),
      treeOccurrenceCountDepth0To5:String(tree),
      distinctRawStatesDepth0To5:String(raw),
      rootLegalMoveCount:core.rootLegalMoveCount,
      replyWidthHistogramByDepth:core.layers.map(r=>({depth:r.depth,histogram:r.replyWidthHistogram})),
      reconvergentRawStateCountByDepth:core.layers.map(r=>({depth:r.depth,count:r.reconvergentRawStateCount})),
      widthTransitionCountsByParentDepth:core.parentLayers.map(r=>({depth:r.depth,expansion:r.widthExpansionCount,compression:r.widthCompressionCount,stable:r.widthStableCount,reopening:r.branchReopeningCount,extinction:r.branchExtinctionCount}))
    },
    endpoints
  };
}
function measureRoot(engine,source){const u=V.measureRoot(engine,source,HORIZON);return{upstreamRootReconstructionCoreSha256:u.rootReconstructionCoreSha256,upstreamFamilyCoreSha256:{"LGTGMIV-F1-TREE-OCCURRENCE":u.rootFamilyCoreSha256["LGTGMIV-F1-TREE-OCCURRENCE"],"LGTGMIV-F2-RAW-GRAPH":u.rootFamilyCoreSha256["LGTGMIV-F2-RAW-GRAPH"],"LGTGMIV-F3-TRANSPOSITION-RECONVERGENCE":u.rootFamilyCoreSha256["LGTGMIV-F3-TRANSPOSITION-RECONVERGENCE"],"LGTGMIV-F4-TREE-GRAPH-RELATION":u.rootFamilyCoreSha256["LGTGMIV-F4-TREE-GRAPH-RELATION"],"LGTGMIV-F5-REPLY-GEOMETRY":u.rootFamilyCoreSha256["LGTGMIV-F5-REPLY-GEOMETRY"]},source:u.source,sfcdf:deriveFromMeasurement(u)};}
function comparePair(pairId,namuaRoot,mtajiRoot){const out=Object.create(null);for(const id of CANDIDATES){const d=delta(mtajiRoot.sfcdf.endpoints[id],namuaRoot.sfcdf.endpoints[id]);out[id]={namua:namuaRoot.sfcdf.endpoints[id],mtaji:mtajiRoot.sfcdf.endpoints[id],deltaMtajiMinusNamua:d,sign:direction(d)};}return{pairId,candidates:out};}
function minComparable(id,n){return id==="SFCDF-C5-ROOT-BRANCH-OVERLAP-FRACTION"?Math.ceil(n*5/6):n;}
function summarizeDevelopment(rows,n){assertOk(rows.length===n,"development pair count mismatch");const summaries=Object.create(null),promotedCandidates=[];for(const id of CANDIDATES){const counts={comparable:0,positive:0,negative:0,zero:0};for(const row of rows){const s=row.candidates[id].sign;if(s===null)continue;counts.comparable++;if(s>0)counts.positive++;else if(s<0)counts.negative++;else counts.zero++;}const nonZero=counts.positive+counts.negative,dominant=Math.max(counts.positive,counts.negative),dir=counts.positive>counts.negative?"MTAJI-GREATER":counts.negative>counts.positive?"NAMUA-GREATER":null,coveragePass=counts.comparable>=minComparable(id,n),nonZeroPass=3*nonZero>=2*counts.comparable,dominancePass=dir!==null&&3*dominant>=2*nonZero,promote=coveragePass&&nonZeroPass&&dominancePass;summaries[id]={...counts,nonZero,dominant,direction:dir,coveragePass,nonZeroPass,dominancePass,promote};if(promote)promotedCandidates.push({candidateId:id,direction:dir});}return{expectedPairs:n,summaries,promotedCandidates};}
function combination(n,k){n=BigInt(n);k=BigInt(k);if(k<0n||k>n)return 0n;if(k>n-k)k=n-k;let a=1n,j=1n;while(j<=k){a=a*(n-k+j)/j;j++;}return a;}
function signTestTwoSided(pos,neg){const n=pos+neg;if(n===0)return reducePair(1n,1n);const tail=Math.min(pos,neg);let mass=0n,k=0;while(k<=tail){mass+=combination(n,k);k++;}const den=1n<<BigInt(n);let num=2n*mass;if(num>den)num=den;return reducePair(num,den);}
function ratioLE(a,b){assertOk(a.defined&&b.defined,"defined fractions required");return BigInt(a.numerator)*BigInt(b.denominator)<=BigInt(b.numerator)*BigInt(a.denominator);}
function validateFormal(rows,promoted,n){assertOk(rows.length===n,"formal pair count mismatch");const frozen=new Map(promoted.map(x=>[x.candidateId,x.direction])),results=[];for(const entry of frozen){const id=entry[0],frozenDirection=entry[1];let comparable=0,positive=0,negative=0,zero=0;for(const row of rows){const s=row.candidates[id].sign;if(s===null)continue;comparable++;if(s>0)positive++;else if(s<0)negative++;else zero++;}const nonZero=positive+negative,observedDirection=positive>negative?"MTAJI-GREATER":negative>positive?"NAMUA-GREATER":null;results.push({candidateId:id,frozenDirection,comparable,positive,negative,zero,nonZero,observedDirection,coveragePass:comparable>=minComparable(id,n),nonZeroPass:3*nonZero>=2*comparable,directionPass:observedDirection===frozenDirection,rawP:signTestTwoSided(positive,negative)});}results.sort((a,b)=>{const x=BigInt(a.rawP.numerator)*BigInt(b.rawP.denominator),y=BigInt(b.rawP.numerator)*BigInt(a.rawP.denominator);return x<y?-1:x>y?1:a.candidateId.localeCompare(b.candidateId);});let open=true;for(let i=0;i<results.length;i++){const threshold=reducePair(1n,BigInt(20*(results.length-i))),rawPass=ratioLE(results[i].rawP,threshold);results[i].holmRank=i+1;results[i].holmThreshold=threshold;results[i].holmPass=open&&rawPass;results[i].confirmed=results[i].holmPass&&results[i].coveragePass&&results[i].nonZeroPass&&results[i].directionPass;if(!rawPass)open=false;}results.sort((a,b)=>a.candidateId.localeCompare(b.candidateId));return{expectedPairs:n,alpha:reducePair(1n,20n),candidates:results,confirmedCandidates:results.filter(x=>x.confirmed).map(x=>x.candidateId)};}

module.exports={STUDY_ID,HORIZON,CANDIDATES,upstreamImplementation:"LGTGMIV-INDEPENDENT",fraction:reducePair,deriveFromMeasurement,measureRoot,comparePair,summarizeDevelopment,signTestTwoSided,validateFormal};
