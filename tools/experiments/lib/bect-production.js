"use strict";

const U = require("./lgtgmiv-stage1-production.js");

const STUDY_ID = "BECT-STUDY1";
const HORIZON = 5;
const METRICS = [
  "BECT-M1-ROOT-LEGAL-WIDTH",
  "BECT-M2-CUMULATIVE-TREE-OCCURRENCE",
  "BECT-M3-GLOBAL-DISTINCT-RAW-STATES",
  "BECT-M4-CUMULATIVE-TREE-RAW-RATIO",
  "BECT-M5-DUPLICATE-TRANSITION-FRACTION",
  "BECT-M6-UNIT-WIDTH-OCCUPANCY-FRACTION",
  "BECT-M7-BRANCH-REOPENING-FRACTION",
  "BECT-M8-BRANCH-EXTINCTION-FRACTION"
];

function need(x,m){if(!x)throw new Error(m);}
function clone(x){return JSON.parse(JSON.stringify(x));}
function abs(x){return x<0n?-x:x;}
function gcd(a,b){a=abs(a);b=abs(b);while(b!==0n){const t=a%b;a=b;b=t;}return a===0n?1n:a;}
function fraction(n,d=1n){n=BigInt(n);d=BigInt(d);if(d===0n)return{numerator:String(n),denominator:"0",defined:false};if(d<0n){n=-n;d=-d;}const g=gcd(n,d);return{numerator:String(n/g),denominator:String(d/g),defined:true};}
function asFraction(x){if(x&&typeof x==="object"&&Object.prototype.hasOwnProperty.call(x,"defined"))return x.defined?fraction(BigInt(x.numerator),BigInt(x.denominator)):{numerator:String(x.numerator||0),denominator:String(x.denominator||0),defined:false};return fraction(BigInt(x),1n);}
function subtract(a,b){a=asFraction(a);b=asFraction(b);if(!a.defined||!b.defined)return{numerator:"0",denominator:"0",defined:false};return fraction(BigInt(a.numerator)*BigInt(b.denominator)-BigInt(b.numerator)*BigInt(a.denominator),BigInt(a.denominator)*BigInt(b.denominator));}
function sign(x){x=asFraction(x);if(!x.defined)return"UNDEFINED";const n=BigInt(x.numerator);return n>0n?"UP":n<0n?"DOWN":"ZERO";}
function sumBig(xs,field){return xs.reduce((a,x)=>a+BigInt(x[field]||0),0n);}
function positiveHistogramCount(h){let n=0n;for(const [k,v] of Object.entries(h||{}))if(BigInt(k)>0n)n+=BigInt(v);return n;}

function deriveLevel(measurement){
  const c=measurement.reconstructionCore;
  need(c&&c.targetDepth===HORIZON,"BECT requires relative depth 5 reconstruction");
  const layers=c.layers||[], parents=c.parentLayers||[];
  need(layers.length===HORIZON+1&&parents.length===HORIZON,"unexpected reconstruction layer count");
  const tree=sumBig(layers,"treeNodeOccurrences");
  const raw=BigInt(c.cumulative.distinctRawStates);
  const dup=sumBig(parents,"duplicateEncounterCount");
  const uniqueTrans=sumBig(parents,"uniqueTransitionCount");
  const unit=layers.reduce((a,x)=>a+BigInt(x.unitWidthStateCount||0),0n);
  const nonterminal=layers.reduce((a,x)=>a+positiveHistogramCount(x.replyWidthHistogram),0n);
  const reopen=sumBig(parents,"branchReopeningCount");
  const extinct=sumBig(parents,"branchExtinctionCount");
  const classified=parents.reduce((a,x)=>a+BigInt(x.widthExpansionCount||0)+BigInt(x.widthCompressionCount||0)+BigInt(x.widthStableCount||0),0n);
  const levels={};
  levels[METRICS[0]]=fraction(BigInt(c.rootLegalMoveCount),1n);
  levels[METRICS[1]]=fraction(tree,1n);
  levels[METRICS[2]]=fraction(raw,1n);
  levels[METRICS[3]]=fraction(tree,raw);
  levels[METRICS[4]]=fraction(dup,uniqueTrans);
  levels[METRICS[5]]=fraction(unit,nonterminal);
  levels[METRICS[6]]=fraction(reopen,classified);
  levels[METRICS[7]]=fraction(extinct,classified);
  return {rootRawSha256:c.rootRawSha256,targetDepth:c.targetDepth,levels,primitiveTotals:{treeNodeOccurrences:String(tree),distinctRawStates:String(raw),duplicateEncounterCount:String(dup),uniqueTransitionCount:String(uniqueTrans),unitWidthStateCount:String(unit),positiveReplyWidthStatePresence:String(nonterminal),branchReopeningCount:String(reopen),branchExtinctionCount:String(extinct),classifiedReplyWidthTransitions:String(classified)}};
}

function classifySeries(rows){
  need(Array.isArray(rows)&&rows.length>=4,"at least four ordered rows required");
  for(let i=1;i<rows.length;i++)need(rows[i].ply===rows[i-1].ply+1,"rows must be adjacent ordered plies");
  const metric={};
  for(const id of METRICS){
    const deltas=[];
    for(let i=0;i<rows.length-1;i++){
      const samePhase=rows[i].phase===rows[i+1].phase;
      const value=samePhase?subtract(rows[i+1].levels[id],rows[i].levels[id]):{numerator:"0",denominator:"0",defined:false};
      deltas.push({fromPly:rows[i].ply,toPly:rows[i+1].ply,phaseEligible:samePhase,value,sign:sign(value)});
    }
    const events=[];
    for(let i=1;i<deltas.length-1;i++){
      const prev=deltas[i-1],cur=deltas[i],next=deltas[i+1];
      const primaryEligible=prev.value.defined&&cur.value.defined&&next.value.defined&&rows[i-1].phase===rows[i].phase&&rows[i].phase===rows[i+1].phase&&rows[i+1].phase===rows[i+2].phase;
      if(!primaryEligible)continue;
      let direction=null;
      if(cur.sign==="UP"&&(prev.sign==="DOWN"||prev.sign==="ZERO"))direction="UP";
      if(cur.sign==="DOWN"&&(prev.sign==="UP"||prev.sign==="ZERO"))direction="DOWN";
      if(!direction)continue;
      let disposition="STALL";
      if(next.sign===direction)disposition="PERSISTENCE";
      else if((direction==="UP"&&next.sign==="DOWN")||(direction==="DOWN"&&next.sign==="UP"))disposition="REVERSAL";
      else if(next.sign==="UNDEFINED")disposition="UNDEFINED";
      events.push({onsetFromPly:cur.fromPly,onsetToPly:cur.toPly,direction,disposition,previousSign:prev.sign,onsetSign:cur.sign,nextSign:next.sign,phase:rows[i].phase});
    }
    metric[id]={deltas,events};
  }
  return metric;
}

function eventBalance(classified,id,direction){
  const events=(classified[id]||{}).events||[];
  let onset=0,persistence=0,reversal=0,stall=0;
  for(const e of events)if(e.direction===direction){onset++;if(e.disposition==="PERSISTENCE")persistence++;else if(e.disposition==="REVERSAL")reversal++;else if(e.disposition==="STALL")stall++;}
  return{metricId:id,direction,onsetCount:onset,persistenceCount:persistence,reversalCount:reversal,stallCount:stall,balance:persistence-reversal,balanceSign:persistence>reversal?"POSITIVE":persistence<reversal?"NEGATIVE":"ZERO"};
}

function rng(seed){let value=seed>>>0;return()=>{value+=0x6D2B79F5;let n=value;n=Math.imul(n^(n>>>15),n|1);n^=n+Math.imul(n^(n>>>7),n|61);return((n^(n>>>14))>>>0)/4294967296;};}
function legal(E,state){if(state.winner!==null)return[];return E.moveVariants(state).map(move=>({move,key:U.moveKey(move)})).sort((a,b)=>a.key.localeCompare(b.key));}
function descriptor(seed,ply,state,path){return{phase:state.phase,sourceSeed:seed,selectedPly:ply,rootRawSha256:U.stateKey(state),sourceTrajectorySha256:U.digest(path.join("\n")),openingPrefixSha256:U.digest(path.slice(0,16).join("\n")),openingPrefixLength:Math.min(16,path.length),rootState:clone(state)};}
function replay(E,seed,maxPly){let state=E.initialState(),random=rng(seed),path=[],rows=[];for(let ply=1;ply<=maxPly&&state.winner===null;ply++){const options=legal(E,state);need(options.length>0,"nonterminal zero legal moves");const chosen=options[Math.floor(random()*options.length)];const parent=clone(state);path.push(chosen.key);state=E.applyMove(state,chosen.move).state;need(state.reason!=="relay-limit",`relay-limit ${seed}/${ply}`);rows.push({ply,moveKey:chosen.key,parentRawSha256:U.stateKey(parent),root:descriptor(seed,ply,state,path)});}return{seed,path,rows};}
function measureRoot(E,source){const upstream=U.measureRoot(E,source,HORIZON);return{source:upstream.source,upstreamRootReconstructionCoreSha256:upstream.rootReconstructionCoreSha256,upstreamFamilyCoreSha256:upstream.rootFamilyCoreSha256,bect:deriveLevel(upstream)};}

module.exports={STUDY_ID,HORIZON,METRICS,fraction,subtract,sign,deriveLevel,classifySeries,eventBalance,replay,measureRoot,canonical:U.canonical,digest:U.digest,stateKey:U.stateKey,moveKey:U.moveKey};
