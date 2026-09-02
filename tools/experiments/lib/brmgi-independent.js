"use strict";

const V = require("./lgtgmiv-stage1-independent.js");

const STUDY_ID = "BRMGI-STUDY1";
const HORIZON = 5;
const IDS = [
  "BRMGI-M1-ROOT-LEGAL-WIDTH",
  "BRMGI-M2-CUMULATIVE-TREE-OCCURRENCE",
  "BRMGI-M3-GLOBAL-DISTINCT-RAW-STATES",
  "BRMGI-M4-DUPLICATE-TRANSITION-FRACTION",
  "BRMGI-M5-CUMULATIVE-TREE-RAW-RATIO",
  "BRMGI-M6-UNIT-WIDTH-OCCUPANCY-FRACTION",
];

function assertOk(x,m){if(!x)throw new Error(m);}
function copy(x){return JSON.parse(JSON.stringify(x));}
function magnitude(x){return x<0n?-x:x;}
function divisor(a,b){a=magnitude(BigInt(a));b=magnitude(BigInt(b));while(b!==0n){const r=a%b;a=b;b=r;}return a===0n?1n:a;}
function rational(n,d=1n){n=BigInt(n);d=BigInt(d);if(d===0n)return{numerator:String(n),denominator:"0",defined:false};if(d<0n){n=-n;d=-d;}const g=divisor(n,d);return{numerator:String(n/g),denominator:String(d/g),defined:true};}
function normalize(x){if(x&&typeof x==="object"&&Object.prototype.hasOwnProperty.call(x,"defined"))return x.defined?rational(x.numerator,x.denominator):{numerator:String(x.numerator||0),denominator:String(x.denominator||0),defined:false};return rational(x,1n);}
function difference(a,b){const x=normalize(a),y=normalize(b);if(!x.defined||!y.defined)return{numerator:"0",denominator:"0",defined:false};return rational(BigInt(x.numerator)*BigInt(y.denominator)-BigInt(y.numerator)*BigInt(x.denominator),BigInt(x.denominator)*BigInt(y.denominator));}
function direction(x){x=normalize(x);if(!x.defined)return"UNDEFINED";const n=BigInt(x.numerator);return n>0n?"POSITIVE":n<0n?"NEGATIVE":"ZERO";}
function total(rows,key){let n=0n;for(const row of rows)n+=BigInt(row[key]||0);return n;}
function nonterminalPresence(hist){let n=0n;for(const k of Object.keys(hist||{}))if(BigInt(k)>0n)n+=BigInt(hist[k]);return n;}
function endpoints(m){const c=m.reconstructionCore;assertOk(c&&c.targetDepth===5,"BRMGI independent requires relative depth 5");const ls=c.layers||[],ps=c.parentLayers||[];assertOk(ls.length===6&&ps.length===5,"BRMGI independent layer shape mismatch");const tree=total(ls,"treeNodeOccurrences"),raw=BigInt(c.cumulative.distinctRawStates),dup=total(ps,"duplicateEncounterCount"),edges=total(ps,"uniqueTransitionCount");let unit=0n,nonterm=0n;for(const row of ls){unit+=BigInt(row.unitWidthStateCount||0);nonterm+=nonterminalPresence(row.replyWidthHistogram);}const values=Object.create(null);values[IDS[0]]=rational(c.rootLegalMoveCount);values[IDS[1]]=rational(tree);values[IDS[2]]=rational(raw);values[IDS[3]]=rational(dup,edges);values[IDS[4]]=rational(tree,raw);values[IDS[5]]=rational(unit,nonterm);return{values,primitiveTotals:{treeNodeOccurrences:String(tree),distinctRawStates:String(raw),duplicateEncounterCount:String(dup),uniqueTransitionCount:String(edges),unitWidthStateCount:String(unit),positiveReplyWidthStatePresence:String(nonterm)}};}
function source(state,id){return{phase:state.phase,sourceSeed:null,selectedPly:null,rootRawSha256:V.stateKey(state),sourceTrajectorySha256:V.digest(`BRMGI-TECHNICAL:${id}`),openingPrefixSha256:V.digest(`BRMGI-TECHNICAL-PREFIX:${id}`),openingPrefixLength:0,rootState:copy(state)};}
function measureState(E,state,id){const m=V.measureRoot(E,source(state,id),5);return{rootRawSha256:V.stateKey(state),reconstructionCoreSha256:m.rootReconstructionCoreSha256,familyCoreSha256:m.rootFamilyCoreSha256,endpoint:endpoints(m)};}
function moves(E,state){if(state.winner!==null)return[];const a=E.moveVariants(state).map(move=>({move,key:V.moveKey(move)}));a.sort((x,y)=>x.key.localeCompare(y.key));return a;}
function physical(move){const x=copy(move);delete x.houseChoice;return V.moveKey(x);}
function transition(E,state,move){const pre=copy(state),r=E.applyMove(state,move);return{pre,move:copy(move),post:copy(r.state),events:copy(r.events||[])};}
function labels(t){const out=[];const mover=t.pre.player;if(t.move.type==="capture")out.push("BRMGI-E1-CAPTURE-SOURCE-MOVE");if(t.pre.phase==="namua"&&t.post.phase==="namua"&&t.pre.reserve[mover]-t.post.reserve[mover]===1)out.push("BRMGI-E0-NAMUA-RESERVE-DECREMENT-NONTRANSITION");if(t.pre.phase==="namua"&&t.post.phase==="mtaji")out.push("BRMGI-E3-RESERVE-EXHAUSTION-NAMUA-TO-MTAJI");return out.sort();}
function housePairs(E,state){const bins=new Map();for(const x of moves(E,state)){if(x.move.phase!=="namua"||x.move.type!=="capture"||!x.move.houseChoice)continue;const k=physical(x.move);if(!bins.has(k))bins.set(k,[]);bins.get(k).push(x.move);}const result=[];for(const k of [...bins.keys()].sort()){const a=bins.get(k),stop=a.find(m=>m.houseChoice==="stop"),use=a.find(m=>m.houseChoice==="use");if(!stop||!use)continue;const s=transition(E,state,stop),u=transition(E,state,use),p=state.player;if(V.stateKey(s.post)===V.stateKey(u.post))continue;if(state.houseOwned[p]!==true||s.post.houseOwned[p]!==true||u.post.houseOwned[p]!==false)continue;result.push({physicalMoveKey:k,stop:s,use:u});}return result;}
function nearestControl(rows,j){assertOk(Array.isArray(rows)&&j>=0&&j<rows.length,"invalid independent control input");const event=rows[j];let i=j-1;while(i>=0){const r=rows[i];if(r.phase!==event.phase)return-1;if(r.primaryEligible&&r.moveType!=="capture")return i;i--;}return-1;}
function delta(post,pre){const o=Object.create(null);for(const id of IDS)o[id]=difference(post.endpoint.values[id],pre.endpoint.values[id]);return o;}
function contrast(a,b){const o=Object.create(null);for(const id of IDS)o[id]=difference(a[id],b[id]);return o;}
module.exports={STUDY_ID,HORIZON,METRICS:IDS,fraction:rational,subtract:difference,sign:direction,deriveEndpoints:endpoints,technicalSource:source,measureState,canonicalMoves:moves,physicalMoveKey:physical,applyComplete:transition,eventLabels:labels,nyumbaPairs:housePairs,controlIndex:nearestControl,delta,contrast,canonical:V.canonical,digest:V.digest,stateKey:V.stateKey,moveKey:V.moveKey};
