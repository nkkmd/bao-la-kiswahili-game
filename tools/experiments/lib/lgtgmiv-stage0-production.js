"use strict";
const crypto=require("node:crypto");
const RAW=["pits","reserve","houseOwned","player","phase","winner","pending"];
const MOV=["type","phase","row","index","direction","side","houseChoice","houseTwo"];
const FAMS=["LGTGMIV-F1-TREE-OCCURRENCE","LGTGMIV-F2-RAW-GRAPH","LGTGMIV-F3-TRANSPOSITION-RECONVERGENCE","LGTGMIV-F4-TREE-GRAPH-RELATION","LGTGMIV-F5-REPLY-GEOMETRY"];
const stable=v=>v===null||typeof v!=="object"?JSON.stringify(v):Array.isArray(v)?`[${v.map(stable).join(",")}]`:`{${Object.keys(v).sort().map(k=>`${JSON.stringify(k)}:${stable(v[k])}`).join(",")}}`;
const sha=s=>crypto.createHash("sha256").update(s,"utf8").digest("hex");
const setHash=a=>sha([...a].sort().join("\n"));
function raw(s){const o={};for(const k of RAW){if(!Object.prototype.hasOwnProperty.call(s,k))throw Error(`raw:${k}`);o[k]=Array.isArray(s[k])?JSON.parse(JSON.stringify(s[k])):s[k]}return o}
const stateKey=s=>sha(stable(raw(s)));
function normMove(m){const o={};for(const k of MOV.slice(0,7))if(m[k]!==undefined)o[k]=m[k];o.houseTwo=m.houseTwo===true;return o}
const moveKey=m=>stable(normMove(m));
const ratio=(n,d)=>({numerator:String(n),denominator:String(d),defined:BigInt(d)!==0n});
function inc(h,k,n=1n){k=String(k);h[k]=String(BigInt(h[k]||"0")+BigInt(n))}
function ordered(a,mode,salt){const x=a.slice();if(mode==="descending")return x.reverse();if(mode==="permuted")return x.sort((p,q)=>sha(`${salt}|${p.sortKey}`).localeCompare(sha(`${salt}|${q.sortKey}`))||p.sortKey.localeCompare(q.sortKey));return x}
function measure(fx,D,opts={}){
 const parentOrder=opts.parentOrder||"ascending",moveOrder=opts.moveOrder||"ascending";
 const rk=stateKey(fx.nodes[fx.root].state);let layers=[new Map([[rk,{key:rk,node:fx.nodes[fx.root],occ:1n,labels:new Map()}]])];
 const ls=[],ps=[],globalStates=new Set([rk]),globalEdges=new Set();let first=null;const rootSurv=new Map(),immediate={};
 for(let d=0;d<=D;d++){
  const layer=layers[d],uw={},ow={};let occ=0n,term=0n,reconv=0,unit=0;
  for(const e of layer.values()){const w=e.node.moves.length;occ+=e.occ;if(e.node.state.winner!==null)term+=e.occ;if(e.labels.size>=2)reconv++;inc(uw,w);inc(ow,w,e.occ);if(w===1)unit++}
  if(first===null&&reconv>0)first=d;
  ls.push({depth:d,treeNodeOccurrences:String(occ),uniqueRawStateCount:layer.size,terminalOccurrenceCount:String(term),replyWidthHistogram:uw,treeOccurrenceReplyWidthHistogram:ow,unitWidthStateCount:unit,reconvergentRawStateCount:reconv,cumulativeUniqueRawStateCount:globalStates.size,stateSetSha256:setHash(layer.keys())});
  if(d===D)break;
  const next=new Map(),edges=new Map(),arrivals=new Map();let treeEdges=0n,wx=0,wc=0,ws=0,reopen=0,extinct=0;
  const pars=[...layer.values()].sort((a,b)=>a.key.localeCompare(b.key)).map(value=>({value,sortKey:value.key}));
  for(const wrap of ordered(pars,parentOrder,d)){
   const p=wrap.value,pw=p.node.moves.length;
   const ms=p.node.moves.map(t=>({t,key:moveKey(t.move)})).sort((a,b)=>a.key.localeCompare(b.key)).map(value=>({value,sortKey:value.key}));
   for(const mw of ordered(ms,moveOrder,d+97)){
    const {t,key:mk}=mw.value,cnode=fx.nodes[t.to],ck=stateKey(cnode.state),ek=`${p.key}|${mk}|${ck}`;edges.set(ek,{from:p.key,move:mk,to:ck});globalEdges.add(ek);treeEdges+=p.occ;
    let c=next.get(ck);if(!c){c={key:ck,node:cnode,occ:0n,labels:new Map()};next.set(ck,c)}c.occ+=p.occ;
    if(d===0)c.labels.set(mk,(c.labels.get(mk)||0n)+p.occ);else for(const [lab,n] of p.labels)c.labels.set(lab,(c.labels.get(lab)||0n)+n);
    let ar=arrivals.get(ck);if(!ar){ar={edges:new Set(),parents:new Set()};arrivals.set(ck,ar)}ar.edges.add(ek);ar.parents.add(p.key);
    const cw=cnode.moves.length;if(cw>pw)wx++;else if(cw<pw)wc++;else ws++;if(pw===1&&cw>=2)reopen++;if(cnode.state.winner!==null)extinct++;
    if(d===0){immediate[mk]=cw;rootSurv.set(mk,1)}else for(const lab of c.labels.keys())rootSurv.set(lab,Math.max(rootSurv.get(lab)||0,d+1));
   }
  }
  let dup=0,multi=0;const ah={},ph={};for(const ar of arrivals.values()){const a=ar.edges.size,p=ar.parents.size;dup+=Math.max(0,a-1);if(p>=2)multi++;inc(ah,a);inc(ph,p)}
  ps.push({depth:d,treeEdgeOccurrences:String(treeEdges),uniqueTransitionCount:edges.size,transitionSetSha256:setHash(edges.keys()),duplicateEncounterCount:dup,duplicateEncounterFraction:ratio(dup,edges.size),multiParentRawStateCount:multi,arrivalMultiplicityHistogram:ah,parentMultiplicityHistogram:ph,widthExpansionCount:wx,widthCompressionCount:wc,widthStableCount:ws,branchReopeningCount:reopen,branchExtinctionCount:extinct});
  layers.push(next);for(const k of next.keys())globalStates.add(k);
 }
 for(let d=0;d<ls.length;d++){ls[d].treeNodeExcess=String(BigInt(ls[d].treeNodeOccurrences)-BigInt(ls[d].uniqueRawStateCount));ls[d].treeToUniqueRawRatio=ratio(ls[d].treeNodeOccurrences,ls[d].uniqueRawStateCount);if(d<ps.length){ps[d].treeEdgeToUniqueTransitionRatio=ratio(ps[d].treeEdgeOccurrences,ps[d].uniqueTransitionCount);ps[d].graphTransitionBranching=ratio(ps[d].uniqueTransitionCount,ls[d].uniqueRawStateCount);ps[d].graphStateExpansion=ratio(ls[d+1].uniqueRawStateCount,ls[d].uniqueRawStateCount)}}
 const labels=[...rootSurv.keys()].sort(),membership=[],mults=[],overlaps=[];
 for(let d=0;d<layers.length;d++){const rows=[],h={};for(const [k,e] of [...layers[d]].sort((a,b)=>a[0].localeCompare(b[0]))){const labs=[...e.labels.keys()].sort();inc(h,labs.length);rows.push(`${d}|${k}|${labs.join(",")}`)}membership.push({depth:d,rootBranchMembershipSha256:setHash(rows)});mults.push({depth:d,histogram:h});const pairs=[];if(d){const sets=new Map(labels.map(l=>[l,new Set()]));for(const [k,e] of layers[d])for(const l of e.labels.keys())sets.get(l)?.add(k);for(let i=0;i<labels.length;i++)for(let j=i+1;j<labels.length;j++){const a=sets.get(labels[i]),b=sets.get(labels[j]);let n=0;for(const x of a)if(b.has(x))n++;pairs.push({rootMoveA:labels[i],rootMoveB:labels[j],overlap:ratio(n,a.size+b.size-n)})}}overlaps.push({depth:d,pairs})}
 const branch={rootMoveLabels:labels,rootBranchLabelMultiplicityHistograms:mults,rootBranchPairOverlapByDepth:overlaps,rootBranchMembershipByDepth:membership,rootBranchMembershipDigestSha256:setHash(membership.map(x=>`${x.depth}|${x.rootBranchMembershipSha256}`))};
 const subtree={};for(const lab of labels){subtree[lab]={};for(let d=1;d<layers.length;d++){let n=0n;for(const e of layers[d].values())n+=e.labels.get(lab)||0n;subtree[lab][String(d)]=String(n)}}
 const surv=labels.map(l=>({rootMoveKey:l,branchSurvivalLength:rootSurv.get(l),rightCensored:rootSurv.get(l)===D}));
 const narrowRecords=[],nh={};for(let sd=0;sd<D;sd++)for(const [sk,se] of layers[sd]){if(se.node.moves.length!==1)continue;let inboundUnit=false;if(sd>0){for(const [pk,pe] of layers[sd-1])if(pe.node.moves.length===1&&pe.node.moves.some(t=>stateKey(fx.nodes[t.to].state)===sk))inboundUnit=true}if(inboundUnit)continue;let d=sd,key=sk,states=[sk],trans=[],end="WIDTH-CHANGE",right=false;while(d<D){const e=layers[d].get(key);if(!e||e.node.moves.length!==1)break;const t=e.node.moves[0],mk=moveKey(t.move),ck=stateKey(fx.nodes[t.to].state);trans.push(`${key}|${mk}|${ck}`);states.push(ck);d++;const ce=layers[d].get(ck);if(ce?.node.state.winner!==null){end="TERMINAL";break}if(d===D&&ce?.node.moves.length===1){end="HORIZON-CENSORED";right=true;break}if(!ce||ce.node.moves.length!==1)break}const len=Math.max(1,states.length-(end==="TERMINAL"||end==="WIDTH-CHANGE"?1:0));const r={startDepth:sd,startRawKey:sk,length:len,rightCensored:right,endDisposition:end,stateRawKeys:states,transitionKeys:trans};r.runSha256=sha(stable(r));narrowRecords.push(r);inc(nh,len)}narrowRecords.sort((a,b)=>a.startDepth-b.startDepth||a.startRawKey.localeCompare(b.startRawKey));
 const narrow={semantics:"maximal unit-width chains in the depth-labelled unique RAW graph",records:narrowRecords,lengthHistogram:nh,recordsDigestSha256:setHash(narrowRecords.map(x=>x.runSha256))};
 const cumulative={distinctRawStates:globalStates.size,uniqueGlobalTransitions:globalEdges.size,cumulativeRawStateSetSha256:setHash(globalStates),cumulativeGlobalRawGraphEdgeSetSha256:setHash(globalEdges)};
 const recon={schemaVersion:1,representation:{mode:"RAW-ONLY",identityFields:RAW,validatedTransformSet:[]},moveIdentityFields:MOV,rootRawSha256:rk,targetDepth:D,layers:ls,parentLayers:ps,firstReconvergenceDepth:first,immediateReplyWidth:immediate,branchSurvival:surv,rootMoveSubtreeOccurrences:subtree,rootBranchGeometry:branch,narrowPathGeometry:narrow,cumulative};
 const families={
  [FAMS[0]]:{rootLegalMoveCount:fx.nodes[fx.root].moves.length,layers:ls.map(x=>({depth:x.depth,treeNodeOccurrences:x.treeNodeOccurrences,terminalOccurrenceCount:x.terminalOccurrenceCount})),branchSurvival:surv,rootMoveSubtreeOccurrences:subtree},
  [FAMS[1]]:{layers:ls.map(x=>({depth:x.depth,uniqueRawStateCount:x.uniqueRawStateCount,cumulativeUniqueRawStateCount:x.cumulativeUniqueRawStateCount,stateSetSha256:x.stateSetSha256})),parentLayers:ps.map(x=>({depth:x.depth,uniqueTransitionCount:x.uniqueTransitionCount,transitionSetSha256:x.transitionSetSha256})),cumulative},
  [FAMS[2]]:{layers:ls.map(x=>({depth:x.depth,reconvergentRawStateCount:x.reconvergentRawStateCount})),parentLayers:ps.map(x=>({depth:x.depth,duplicateEncounterCount:x.duplicateEncounterCount,multiParentRawStateCount:x.multiParentRawStateCount,arrivalMultiplicityHistogram:x.arrivalMultiplicityHistogram,parentMultiplicityHistogram:x.parentMultiplicityHistogram})),firstReconvergenceDepth:first,rootBranchGeometry:branch},
  [FAMS[3]]:{layers:ls.map(x=>({depth:x.depth,treeNodeExcess:x.treeNodeExcess,treeToUniqueRawRatio:x.treeToUniqueRawRatio})),parentLayers:ps.map(x=>({depth:x.depth,treeEdgeToUniqueTransitionRatio:x.treeEdgeToUniqueTransitionRatio,duplicateEncounterFraction:x.duplicateEncounterFraction,graphStateExpansion:x.graphStateExpansion,graphTransitionBranching:x.graphTransitionBranching}))},
  [FAMS[4]]:{immediateReplyWidth:immediate,layers:ls.map(x=>({depth:x.depth,replyWidthHistogram:x.replyWidthHistogram,treeOccurrenceReplyWidthHistogram:x.treeOccurrenceReplyWidthHistogram,unitWidthStateCount:x.unitWidthStateCount})),parentLayers:ps.map(x=>({depth:x.depth,widthExpansionCount:x.widthExpansionCount,widthCompressionCount:x.widthCompressionCount,widthStableCount:x.widthStableCount,branchReopeningCount:x.branchReopeningCount,branchExtinctionCount:x.branchExtinctionCount})),narrowPathGeometry:narrow}
 };
 const familyDigests=Object.fromEntries(FAMS.map(f=>[f,sha(stable(families[f]))]));
 return{fixtureId:fx.id,rootRawSha256:rk,reconstructionCore:recon,rootReconstructionCoreSha256:sha(stable(recon)),families,rootFamilyCoreSha256:familyDigests};
}
function buildStage(records,stageId){const rs=records.slice().sort((a,b)=>a.fixtureId.localeCompare(b.fixtureId)||a.rootRawSha256.localeCompare(b.rootRawSha256));const rcore={schemaVersion:1,studyId:"LGTGMIV-STUDY1",stageId,contract:"LGTGMIV-CANONICAL-v1",roots:rs.map(r=>({fixtureId:r.fixtureId,rootRawSha256:r.rootRawSha256,rootReconstructionCoreSha256:r.rootReconstructionCoreSha256}))};const sr=sha(stable(rcore));const sf={};for(const f of FAMS)sf[f]=sha(stable(rs.map(r=>({fixtureId:r.fixtureId,rootFamilyCoreSha256:r.rootFamilyCoreSha256[f]}))));const sci={schemaVersion:1,studyId:"LGTGMIV-STUDY1",stageId,stageReconstructionCoreSha256:sr,stageFamilyCoreSha256:sf};return{orderedFixtureIds:rs.map(r=>r.fixtureId),stageReconstructionCoreSha256:sr,stageFamilyCoreSha256:sf,stageScientificCoreSha256:sha(stable(sci)),scientificCore:sci}}
module.exports={FAMILIES:FAMS,stable,sha,stateKey,moveKey,measure,buildStage};
