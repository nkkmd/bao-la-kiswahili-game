"use strict";

const V = require("./lgtgmiv-stage1-independent.js");

const STUDY_ID="BECT-STUDY1";
const HORIZON=5;
const IDS=["BECT-M1-ROOT-LEGAL-WIDTH","BECT-M2-CUMULATIVE-TREE-OCCURRENCE","BECT-M3-GLOBAL-DISTINCT-RAW-STATES","BECT-M4-CUMULATIVE-TREE-RAW-RATIO","BECT-M5-DUPLICATE-TRANSITION-FRACTION","BECT-M6-UNIT-WIDTH-OCCUPANCY-FRACTION","BECT-M7-BRANCH-REOPENING-FRACTION","BECT-M8-BRANCH-EXTINCTION-FRACTION"];

function assert(v,m){if(!v)throw Error(m);}
function copy(v){return JSON.parse(JSON.stringify(v));}
function magnitude(n){return n<0n?-n:n;}
function divisor(a,b){a=magnitude(a);b=magnitude(b);while(b){[a,b]=[b,a%b];}return a||1n;}
function q(num,den=1n){num=BigInt(num);den=BigInt(den);if(den===0n)return{numerator:String(num),denominator:"0",defined:false};if(den<0n){num=-num;den=-den;}const d=divisor(num,den);return{numerator:String(num/d),denominator:String(den/d),defined:true};}
function qread(v){if(v&&typeof v==="object"&&"defined" in v)return v.defined?q(v.numerator,v.denominator):{numerator:String(v.numerator||0),denominator:String(v.denominator||0),defined:false};return q(v,1n);}
function minus(right,left){right=qread(right);left=qread(left);if(!right.defined||!left.defined)return{numerator:"0",denominator:"0",defined:false};return q(BigInt(right.numerator)*BigInt(left.denominator)-BigInt(left.numerator)*BigInt(right.denominator),BigInt(right.denominator)*BigInt(left.denominator));}
function direction(v){v=qread(v);if(!v.defined)return"UNDEFINED";const n=BigInt(v.numerator);if(n===0n)return"ZERO";return n>0n?"UP":"DOWN";}
function total(rows,key){let s=0n;for(const row of rows)s+=BigInt(row[key]||0);return s;}
function positiveWidths(hist){return Object.keys(hist||{}).reduce((n,k)=>BigInt(k)>0n?n+BigInt(hist[k]):n,0n);}

function deriveLevel(measurement){
  const c=measurement.reconstructionCore;
  assert(c&&c.targetDepth===5,"independent BECT depth mismatch");
  const L=c.layers||[],P=c.parentLayers||[];
  assert(L.length===6&&P.length===5,"independent BECT layer mismatch");
  const tree=total(L,"treeNodeOccurrences"),raw=BigInt(c.cumulative.distinctRawStates),dup=total(P,"duplicateEncounterCount"),trans=total(P,"uniqueTransitionCount"),unit=total(L,"unitWidthStateCount");
  let positive=0n,classified=0n;
  for(const x of L)positive+=positiveWidths(x.replyWidthHistogram);
  let reopening=0n,extinction=0n;
  for(const x of P){reopening+=BigInt(x.branchReopeningCount||0);extinction+=BigInt(x.branchExtinctionCount||0);classified+=BigInt(x.widthExpansionCount||0)+BigInt(x.widthCompressionCount||0)+BigInt(x.widthStableCount||0);}
  const levels=Object.create(null);
  levels[IDS[0]]=q(c.rootLegalMoveCount);
  levels[IDS[1]]=q(tree);
  levels[IDS[2]]=q(raw);
  levels[IDS[3]]=q(tree,raw);
  levels[IDS[4]]=q(dup,trans);
  levels[IDS[5]]=q(unit,positive);
  levels[IDS[6]]=q(reopening,classified);
  levels[IDS[7]]=q(extinction,classified);
  return{rootRawSha256:c.rootRawSha256,targetDepth:5,levels,primitiveTotals:{treeNodeOccurrences:String(tree),distinctRawStates:String(raw),duplicateEncounterCount:String(dup),uniqueTransitionCount:String(trans),unitWidthStateCount:String(unit),positiveReplyWidthStatePresence:String(positive),branchReopeningCount:String(reopening),branchExtinctionCount:String(extinction),classifiedReplyWidthTransitions:String(classified)}};
}

function classifySeries(rows){
  assert(Array.isArray(rows)&&rows.length>=4,"independent series too short");
  rows.forEach((r,i)=>{if(i)assert(r.ply===rows[i-1].ply+1,"independent nonadjacent series");});
  const result=Object.create(null);
  for(const id of IDS){
    const ds=[];
    for(let j=0;j+1<rows.length;j++){
      const eligible=rows[j].phase===rows[j+1].phase;
      const value=eligible?minus(rows[j+1].levels[id],rows[j].levels[id]):{numerator:"0",denominator:"0",defined:false};
      ds.push({fromPly:rows[j].ply,toPly:rows[j+1].ply,phaseEligible:eligible,value,sign:direction(value)});
    }
    const ev=[];
    for(let j=1;j+1<ds.length;j++){
      const a=ds[j-1],b=ds[j],c=ds[j+1];
      if(!(a.value.defined&&b.value.defined&&c.value.defined))continue;
      const ph=rows[j].phase;
      if(rows[j-1].phase!==ph||rows[j+1].phase!==ph||rows[j+2].phase!==ph)continue;
      let dir=null;
      if(b.sign==="UP"&&(a.sign==="DOWN"||a.sign==="ZERO"))dir="UP";
      else if(b.sign==="DOWN"&&(a.sign==="UP"||a.sign==="ZERO"))dir="DOWN";
      if(dir===null)continue;
      let disposition="STALL";
      if(c.sign===dir)disposition="PERSISTENCE";
      else if((dir==="UP"&&c.sign==="DOWN")||(dir==="DOWN"&&c.sign==="UP"))disposition="REVERSAL";
      else if(c.sign==="UNDEFINED")disposition="UNDEFINED";
      ev.push({onsetFromPly:b.fromPly,onsetToPly:b.toPly,direction:dir,disposition,previousSign:a.sign,onsetSign:b.sign,nextSign:c.sign,phase:ph});
    }
    result[id]={deltas:ds,events:ev};
  }
  return result;
}

function eventBalance(classified,id,dir){let onset=0,p=0,r=0,s=0;for(const e of ((classified[id]||{}).events||[])){if(e.direction!==dir)continue;onset++;if(e.disposition==="PERSISTENCE")p++;else if(e.disposition==="REVERSAL")r++;else if(e.disposition==="STALL")s++;}const b=p-r;return{metricId:id,direction:dir,onsetCount:onset,persistenceCount:p,reversalCount:r,stallCount:s,balance:b,balanceSign:b>0?"POSITIVE":b<0?"NEGATIVE":"ZERO"};}

function random(seed){let x=seed>>>0;return()=>{x+=0x6D2B79F5;let t=x;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296;};}
function options(E,state){if(state.winner!==null)return[];const a=E.moveVariants(state).map(move=>({move,id:V.moveKey(move)}));a.sort((x,y)=>x.id.localeCompare(y.id));return a;}
function describe(seed,ply,state,moves){return{phase:state.phase,sourceSeed:seed,selectedPly:ply,rootRawSha256:V.stateKey(state),sourceTrajectorySha256:V.digest(moves.join("\n")),openingPrefixSha256:V.digest(moves.slice(0,16).join("\n")),openingPrefixLength:Math.min(16,moves.length),rootState:copy(state)};}
function replay(E,seed,maxPly){let state=E.initialState(),r=random(seed),moves=[],rows=[];for(let ply=1;ply<=maxPly&&state.winner===null;ply++){const legal=options(E,state);assert(legal.length>0,"independent nonterminal zero move");const choice=legal[Math.floor(r()*legal.length)],parent=copy(state);moves.push(choice.id);state=E.applyMove(state,choice.move).state;assert(state.reason!=="relay-limit",`independent relay-limit ${seed}/${ply}`);rows.push({ply,moveKey:choice.id,parentRawSha256:V.stateKey(parent),root:describe(seed,ply,state,moves)});}return{seed,path:moves,rows};}
function measureRoot(E,source){const upstream=V.measureRoot(E,source,5);return{source:upstream.source,upstreamRootReconstructionCoreSha256:upstream.rootReconstructionCoreSha256,upstreamFamilyCoreSha256:upstream.rootFamilyCoreSha256,bect:deriveLevel(upstream)};}

module.exports={STUDY_ID,HORIZON,METRICS:IDS,fraction:q,subtract:minus,sign:direction,deriveLevel,classifySeries,eventBalance,replay,measureRoot,canonical:V.canonical,digest:V.digest,stateKey:V.stateKey,moveKey:V.moveKey};
