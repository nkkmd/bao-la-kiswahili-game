"use strict";

const U = require("./lgtgmiv-stage1-production.js");

const STUDY_ID = "RRCLGR-STUDY1";
const HORIZON = 5;
const REPRESENTATION_ID = "RRCLGR-R1-EXACT-SQUASHED-L1";
const AXES = [
  "RRCLGR-A1-ROOT-LEGAL-WIDTH",
  "RRCLGR-A2-CUMULATIVE-TREE-OCCURRENCE",
  "RRCLGR-A3-CUMULATIVE-DISTINCT-RAW-STATES",
  "RRCLGR-A4-CUMULATIVE-TREE-RAW-RATIO",
  "RRCLGR-A5-DUPLICATE-TRANSITION-FRACTION",
  "RRCLGR-A6-UNIT-WIDTH-OCCUPANCY-FRACTION"
];

function need(x,m){if(!x)throw new Error(m);}
function clone(x){return JSON.parse(JSON.stringify(x));}
function abs(x){return x<0n?-x:x;}
function gcd(a,b){a=abs(BigInt(a));b=abs(BigInt(b));while(b){const r=a%b;a=b;b=r;}return a;}
function rational(n,d=1n){n=BigInt(n);d=BigInt(d);if(d===0n)return{numerator:"0",denominator:"0",defined:false};if(d<0n){n=-n;d=-d;}const g=gcd(n,d);return{numerator:String(n/g),denominator:String(d/g),defined:true};}
function defined(q,label){need(q&&q.defined===true,`${label} undefined`);need(BigInt(q.denominator)>0n,`${label} denominator invalid`);return q;}
function add(a,b){defined(a,"left");defined(b,"right");return rational(BigInt(a.numerator)*BigInt(b.denominator)+BigInt(b.numerator)*BigInt(a.denominator),BigInt(a.denominator)*BigInt(b.denominator));}
function subtract(a,b){defined(a,"left");defined(b,"right");return rational(BigInt(a.numerator)*BigInt(b.denominator)-BigInt(b.numerator)*BigInt(a.denominator),BigInt(a.denominator)*BigInt(b.denominator));}
function absolute(a){defined(a,"value");return rational(abs(BigInt(a.numerator)),BigInt(a.denominator));}
function compare(a,b){defined(a,"left");defined(b,"right");const x=BigInt(a.numerator)*BigInt(b.denominator),y=BigInt(b.numerator)*BigInt(a.denominator);return x<y?-1:x>y?1:0;}
function squash(q){defined(q,"axis");const n=BigInt(q.numerator),d=BigInt(q.denominator);need(n>=0n,"negative geometry axis");return rational(n,n+d);}
function sum(rows,field){return rows.reduce((a,x)=>a+BigInt(x[field]),0n);}
function positiveWidthPresence(layers){let total=0n;for(const row of layers)for(const [w,c] of Object.entries(row.replyWidthHistogram||{}))if(BigInt(w)>0n)total+=BigInt(c);return total;}

function deriveAxes(measurement){
  need(measurement&&measurement.reconstructionCore,"reconstructionCore required");
  const r=measurement.reconstructionCore;
  need(r.targetDepth===HORIZON,"RRCLGR requires relative depth 5");
  need(r.representation&&r.representation.mode==="RAW-ONLY","RAW-only required");
  need(Array.isArray(r.representation.validatedTransformSet)&&r.representation.validatedTransformSet.length===0,"transform set must be empty");
  need(Array.isArray(r.layers)&&r.layers.length===6,"six depth layers required");
  need(Array.isArray(r.parentLayers)&&r.parentLayers.length===5,"five parent layers required");
  const tree=sum(r.layers,"treeNodeOccurrences");
  const raw=BigInt(r.cumulative.distinctRawStates);
  const dup=sum(r.parentLayers,"duplicateEncounterCount");
  const transitions=sum(r.parentLayers,"uniqueTransitionCount");
  const unit=sum(r.layers,"unitWidthStateCount");
  const live=positiveWidthPresence(r.layers);
  const axes={
    [AXES[0]]:rational(r.rootLegalMoveCount,1n),
    [AXES[1]]:rational(tree,1n),
    [AXES[2]]:rational(raw,1n),
    [AXES[3]]:rational(tree,raw),
    [AXES[4]]:rational(dup,transitions),
    [AXES[5]]:rational(unit,live)
  };
  for(const id of AXES)defined(axes[id],id);
  return{rootRawSha256:r.rootRawSha256,axes,rawPrimitives:{rootLegalMoveCount:String(r.rootLegalMoveCount),treeNodeOccurrencesDepth0To5:String(tree),distinctRawStatesDepth0To5:String(raw),duplicateEncounterCountDepth0To4:String(dup),uniqueTransitionCountDepth0To4:String(transitions),unitWidthStatePresenceDepth0To5:String(unit),nonterminalRawStatePresenceDepth0To5:String(live)}};
}
function represent(d){const coordinates={};for(const id of AXES)coordinates[id]=squash(d.axes[id]);return{representationId:REPRESENTATION_ID,rootRawSha256:d.rootRawSha256,coordinates};}
function distance(a,b){let total=rational(0n,1n);for(const id of AXES)total=add(total,absolute(subtract(a.coordinates[id],b.coordinates[id])));return total;}
function distanceRows(reps){const xs=[...reps].sort((a,b)=>a.rootRawSha256.localeCompare(b.rootRawSha256)),out=[];for(let i=0;i<xs.length;i++)for(let j=i+1;j<xs.length;j++)out.push({rootA:xs[i].rootRawSha256,rootB:xs[j].rootRawSha256,distance:distance(xs[i],xs[j])});return out;}
function neighbors(reps,k=3){need(Number.isInteger(k)&&k>0,"k invalid");const xs=[...reps].sort((a,b)=>a.rootRawSha256.localeCompare(b.rootRawSha256));need(xs.length>k,"insufficient roots");const out=[];for(const x of xs){const ds=xs.filter(y=>y.rootRawSha256!==x.rootRawSha256).map(y=>({rootRawSha256:y.rootRawSha256,distance:distance(x,y)}));ds.sort((a,b)=>compare(a.distance,b.distance)||a.rootRawSha256.localeCompare(b.rootRawSha256));const cutoff=ds[k-1].distance;out.push({rootRawSha256:x.rootRawSha256,cutoff,neighbors:ds.filter(r=>compare(r.distance,cutoff)<=0).map(r=>r.rootRawSha256).sort()});}return out;}

function normalizedLimits(limits){
  const keys=["globalDistinctRawStates","uniqueCanonicalTransitions","parentExpansions","legalMoveVariantsEnumerated","treeNodeOccurrences"];
  const out={};for(const k of keys){need(Number.isInteger(limits[k])&&limits[k]>=0,`invalid preflight limit ${k}`);out[k]=BigInt(limits[k]);}return out;
}
function coreResult(eligible,reason,counters){return{eligible,reasonCode:reason,counters:{globalDistinctRawStates:String(counters.globalDistinctRawStates),uniqueCanonicalTransitions:String(counters.uniqueCanonicalTransitions),parentExpansions:String(counters.parentExpansions),legalMoveVariantsEnumerated:String(counters.legalMoveVariantsEnumerated),treeNodeOccurrences:String(counters.treeNodeOccurrences)}};}
function boundedPreflight(engine,source,limits){
  need(source&&source.rootState,"preflight source root required");
  const L=normalizedLimits(limits);
  const root=clone(source.rootState),rootKey=U.stateKey(root);
  let layer=new Map([[rootKey,{state:root,occ:1n}]]);
  const allStates=new Set([rootKey]),allEdges=new Set();
  const c={globalDistinctRawStates:1n,uniqueCanonicalTransitions:0n,parentExpansions:0n,legalMoveVariantsEnumerated:0n,treeNodeOccurrences:0n};
  if(c.globalDistinctRawStates>L.globalDistinctRawStates)return coreResult(false,"LIMIT_GLOBAL_DISTINCT_RAW_STATES",c);
  for(let depth=0;depth<=HORIZON;depth++){
    let layerOcc=0n;for(const e of layer.values())layerOcc+=e.occ;
    c.treeNodeOccurrences+=layerOcc;
    if(c.treeNodeOccurrences>L.treeNodeOccurrences)return coreResult(false,"LIMIT_TREE_NODE_OCCURRENCES",c);
    if(depth===HORIZON)break;
    const next=new Map();
    for(const [pk,parent] of [...layer.entries()].sort((a,b)=>a[0].localeCompare(b[0]))){
      c.parentExpansions++;
      if(c.parentExpansions>L.parentExpansions)return coreResult(false,"LIMIT_PARENT_EXPANSIONS",c);
      const moves=parent.state.winner!==null?[]:engine.moveVariants(parent.state).map(m=>({m,k:U.moveKey(m)})).sort((a,b)=>a.k.localeCompare(b.k));
      c.legalMoveVariantsEnumerated+=BigInt(moves.length);
      if(c.legalMoveVariantsEnumerated>L.legalMoveVariantsEnumerated)return coreResult(false,"LIMIT_LEGAL_MOVE_VARIANTS",c);
      for(const mv of moves){
        const child=engine.applyMove(parent.state,mv.m).state;
        if(child&&child.reason==="relay-limit")return coreResult(false,"RELAY_LIMIT",c);
        const ck=U.stateKey(child),edge=`${pk}|${mv.k}|${ck}`;
        if(!allEdges.has(edge)){allEdges.add(edge);c.uniqueCanonicalTransitions=BigInt(allEdges.size);if(c.uniqueCanonicalTransitions>L.uniqueCanonicalTransitions)return coreResult(false,"LIMIT_UNIQUE_CANONICAL_TRANSITIONS",c);}
        if(!allStates.has(ck)){allStates.add(ck);c.globalDistinctRawStates=BigInt(allStates.size);if(c.globalDistinctRawStates>L.globalDistinctRawStates)return coreResult(false,"LIMIT_GLOBAL_DISTINCT_RAW_STATES",c);}
        let e=next.get(ck);if(!e){e={state:clone(child),occ:0n};next.set(ck,e);}e.occ+=parent.occ;
      }
    }
    layer=next;
  }
  return coreResult(true,"ELIGIBLE",c);
}
function measureRoot(engine,source){const upstream=U.measureRoot(engine,source,HORIZON),d=deriveAxes(upstream);return{source:upstream.source,upstreamRootReconstructionCoreSha256:upstream.rootReconstructionCoreSha256,upstreamFamilyCoreSha256:upstream.rootFamilyCoreSha256,axes:d.axes,rawPrimitives:d.rawPrimitives,representation:represent(d)};}

module.exports={STUDY_ID,HORIZON,REPRESENTATION_ID,AXES,upstreamImplementation:"LGTGMIV-PRODUCTION",rational,add,subtract,absolute,compare,squash,deriveAxes,represent,distance,distanceRows,neighbors,boundedPreflight,measureRoot,canonical:U.canonical,digest:U.digest,stateKey:U.stateKey,moveKey:U.moveKey};
