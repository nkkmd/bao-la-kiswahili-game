"use strict";

const V = require("./lgtgmiv-stage1-independent.js");

const STUDY_ID = "CLGR-STUDY1";
const HORIZON = 5;
const REPRESENTATION_ID = "CLGR-R1-EXACT-SQUASHED-L1";
const AXES = [
  "CLGR-A1-ROOT-LEGAL-WIDTH",
  "CLGR-A2-CUMULATIVE-TREE-OCCURRENCE",
  "CLGR-A3-CUMULATIVE-DISTINCT-RAW-STATES",
  "CLGR-A4-CUMULATIVE-TREE-RAW-RATIO",
  "CLGR-A5-DUPLICATE-TRANSITION-FRACTION",
  "CLGR-A6-UNIT-WIDTH-OCCUPANCY-FRACTION"
];

function assert(cond, text) { if (!cond) throw new Error(text); }
function magnitude(n) { n=BigInt(n); return n < 0n ? -n : n; }
function divisor(a,b) { a=magnitude(a); b=magnitude(b); while (b !== 0n) { const r=a%b; a=b; b=r; } return a; }
function makeFraction(top, bottom=1n) {
  let n=BigInt(top), d=BigInt(bottom);
  if (d === 0n) return { numerator:"0", denominator:"0", defined:false };
  if (d < 0n) { n=-n; d=-d; }
  const g=divisor(n,d);
  return { numerator:String(n/g), denominator:String(d/g), defined:true };
}
function valid(q,name) { assert(q && q.defined === true, `${name} undefined`); assert(BigInt(q.denominator)>0n, `${name} denominator invalid`); return q; }
function plus(a,b) { valid(a,"a"); valid(b,"b"); return makeFraction(BigInt(a.numerator)*BigInt(b.denominator)+BigInt(b.numerator)*BigInt(a.denominator), BigInt(a.denominator)*BigInt(b.denominator)); }
function minus(a,b) { valid(a,"a"); valid(b,"b"); return makeFraction(BigInt(a.numerator)*BigInt(b.denominator)-BigInt(b.numerator)*BigInt(a.denominator), BigInt(a.denominator)*BigInt(b.denominator)); }
function unsigned(q) { valid(q,"q"); return makeFraction(magnitude(q.numerator), BigInt(q.denominator)); }
function cmp(a,b) { valid(a,"a"); valid(b,"b"); const p=BigInt(a.numerator)*BigInt(b.denominator), q=BigInt(b.numerator)*BigInt(a.denominator); return p===q?0:(p<q?-1:1); }
function compress(q) { valid(q,"geometry"); const n=BigInt(q.numerator), d=BigInt(q.denominator); assert(n>=0n,"negative geometry quantity"); return makeFraction(n,n+d); }
function countField(items, field) { let value=0n; for (const item of items) value += BigInt(item[field]); return value; }
function positiveWidthCount(layers) {
  let total=0n;
  for (let i=0;i<layers.length;i++) {
    const histogram=layers[i].replyWidthHistogram || {};
    for (const key of Object.keys(histogram)) if (BigInt(key)>0n) total += BigInt(histogram[key]);
  }
  return total;
}
function extract(measurement) {
  assert(measurement && measurement.reconstructionCore,"reconstruction required");
  const c=measurement.reconstructionCore;
  assert(c.targetDepth===HORIZON,"wrong depth");
  assert(c.representation && c.representation.mode==="RAW-ONLY","wrong representation");
  assert(Array.isArray(c.representation.validatedTransformSet) && c.representation.validatedTransformSet.length===0,"transform set nonempty");
  assert(c.layers.length===6 && c.parentLayers.length===5,"incomplete layers");
  const tree=countField(c.layers,"treeNodeOccurrences");
  const raw=BigInt(c.cumulative.distinctRawStates);
  const duplicates=countField(c.parentLayers,"duplicateEncounterCount");
  const transitions=countField(c.parentLayers,"uniqueTransitionCount");
  const unit=countField(c.layers,"unitWidthStateCount");
  const live=positiveWidthCount(c.layers);
  const axes=Object.create(null);
  axes[AXES[0]]=makeFraction(c.rootLegalMoveCount,1n);
  axes[AXES[1]]=makeFraction(tree,1n);
  axes[AXES[2]]=makeFraction(raw,1n);
  axes[AXES[3]]=makeFraction(tree,raw);
  axes[AXES[4]]=makeFraction(duplicates,transitions);
  axes[AXES[5]]=makeFraction(unit,live);
  for (const id of AXES) valid(axes[id],id);
  return { rootRawSha256:c.rootRawSha256, axes, rawPrimitives:{ rootLegalMoveCount:String(c.rootLegalMoveCount), treeNodeOccurrencesDepth0To5:String(tree), distinctRawStatesDepth0To5:String(raw), duplicateEncounterCountDepth0To4:String(duplicates), uniqueTransitionCountDepth0To4:String(transitions), unitWidthStatePresenceDepth0To5:String(unit), nonterminalRawStatePresenceDepth0To5:String(live) } };
}
function encode(derived) {
  const coordinates=Object.create(null);
  for (let i=0;i<AXES.length;i++) coordinates[AXES[i]]=compress(derived.axes[AXES[i]]);
  return { representationId:REPRESENTATION_ID, rootRawSha256:derived.rootRawSha256, coordinates };
}
function metric(left,right) {
  assert(left && right && left.coordinates && right.coordinates,"coordinates required");
  let acc=makeFraction(0n,1n);
  for (let i=0;i<AXES.length;i++) acc=plus(acc,unsigned(minus(left.coordinates[AXES[i]],right.coordinates[AXES[i]])));
  return acc;
}
function pairs(reps) {
  const copy=Array.from(reps).sort((a,b)=>a.rootRawSha256.localeCompare(b.rootRawSha256));
  const out=[];
  for(let i=0;i<copy.length;i++) for(let j=i+1;j<copy.length;j++) out.push({rootA:copy[i].rootRawSha256,rootB:copy[j].rootRawSha256,distance:metric(copy[i],copy[j])});
  return out;
}
function neighborhood(reps,k=3) {
  assert(Number.isInteger(k)&&k>0,"invalid k");
  const copy=Array.from(reps).sort((a,b)=>a.rootRawSha256.localeCompare(b.rootRawSha256));
  assert(copy.length>k,"not enough roots");
  const all=[];
  for (const root of copy) {
    const others=[];
    for (const candidate of copy) if (candidate.rootRawSha256!==root.rootRawSha256) others.push({rootRawSha256:candidate.rootRawSha256,distance:metric(root,candidate)});
    others.sort((x,y)=>cmp(x.distance,y.distance)||x.rootRawSha256.localeCompare(y.rootRawSha256));
    const threshold=others[k-1].distance;
    const ids=[];
    for (const row of others) if (cmp(row.distance,threshold)<=0) ids.push(row.rootRawSha256);
    ids.sort();
    all.push({rootRawSha256:root.rootRawSha256,cutoff:threshold,neighbors:ids});
  }
  return all;
}
function resources(measurement) {
  const c=measurement.reconstructionCore;
  const e=countField(c.parentLayers,"uniqueTransitionCount");
  let parents=0n; for (let d=0;d<5;d++) parents += BigInt(c.layers[d].uniqueRawStateCount);
  const nodes=countField(c.layers,"treeNodeOccurrences");
  return {distinctRawStates:String(c.cumulative.distinctRawStates),uniqueTransitions:String(e),parentExpansions:String(parents),treeNodeOccurrences:String(nodes)};
}
function measureRoot(engine,source) {
  const upstream=V.measureRoot(engine,source,HORIZON);
  const d=extract(upstream);
  return {source:upstream.source,upstreamRootReconstructionCoreSha256:upstream.rootReconstructionCoreSha256,upstreamFamilyCoreSha256:upstream.rootFamilyCoreSha256,resourceView:resources(upstream),axes:d.axes,rawPrimitives:d.rawPrimitives,representation:encode(d)};
}

module.exports={STUDY_ID,HORIZON,REPRESENTATION_ID,AXES,upstreamImplementation:"LGTGMIV-INDEPENDENT",rational:makeFraction,add:plus,subtract:minus,absolute:unsigned,compare:cmp,squash:compress,deriveAxes:extract,represent:encode,distance:metric,distanceRows:pairs,neighbors:neighborhood,measureRoot,canonical:V.canonical,digest:V.digest,stateKey:V.stateKey,moveKey:V.moveKey};
