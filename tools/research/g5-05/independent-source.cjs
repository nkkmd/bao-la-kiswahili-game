"use strict";
// source選定を別経路で再生する。runtime・構造判定器・source生成器を呼ばない。
const assert=require("node:assert/strict"),I=require("../g5-01/transition/independent-engine.cjs"),M=require("../g5-01/measurement.cjs");
const initial=()=>({pits:Array.from({length:2},()=>[[0,0,0,0,6,2,2,0],Array(8).fill(0)]),reserve:[22,22],houseOwned:[true,true],player:0,phase:"namua",winner:null,reason:"",turn:1,pending:[0,0],takasia:null});
const normalize=s=>({...M.raw(s),reason:s.reason??"",turn:s.turn});
const order=moves=>[...moves].sort((a,b)=>M.moveKey(a)<M.moveKey(b)?-1:1);
function pre(s,width,spec) {return s.winner===null&&s.phase==="mtaji"&&s.reserve[0]===0&&s.reserve[1]===0&&width>=spec.minWidth&&width<=spec.maxWidth;}
function independentScreen(s,spec,api=I) {
  const moves=order(api.moveVariants(s,{mode:"runtime"})),result={rootKey:M.rawKey(s),width:moves.length,status:null,branches:[]};
  for(const move of moves) {
    const key=M.moveKey(move),exact=api.applyMove(s,move,{maxMicrostates:spec.maxMicrostates});
    const runtime=api.applyMove(s,move,{mode:"runtime"});
    if(runtime.state?.reason==="relay-limit"||exact.status!=="TERMINATED") {
      result.status=runtime.state?.reason==="relay-limit"?"SCREEN-RUNTIME-GUARD":"SCREEN-"+exact.status;
      result.stopped={key,move,runtimeState:runtime.state,independent:exact};return result;
    }
    const child=exact.state,replies=order(api.moveVariants(child,{mode:"runtime"})).map(M.moveKey);
    result.branches.push({key,to:M.rawKey(child),state:child,replyKeys:replies});
  }
  if(result.branches.some(b=>b.state.winner!==null))result.status="TERMINAL-CHILD-EXCLUDED";
  else if(result.branches.some(b=>b.replyKeys.length<1||b.replyKeys.length>spec.maxReplyWidth))result.status="REPLY-WIDTH-EXCLUDED";
  else {
    const modes=result.branches.map(b=>new Set(b.replyKeys.map(k=>JSON.parse(k).type)));
    result.status=modes.some(m=>m.size!==1||!["capture","takata"].includes([...m][0]))?"MODE-EXCLUDED"
      :modes.some(m=>m.has("capture"))&&modes.some(m=>m.has("takata"))?"MIXED-REPLY-ELIGIBLE":"HOMOGENEOUS-REPLY-EXCLUDED";
  }
  return result;
}
function replay(source,spec,exclusions,api=I,start=initial()) {
  let state=start,random=source.seed,screenIndex=0,last=null;
  function examine(ply) {
    const moves=order(api.moveVariants(state,{mode:"runtime"}));
    if(pre(state,moves.length,spec)) {
      const expected={ply,...independentScreen(state,spec,api)};
      assert.deepEqual(source.screens[screenIndex++],expected,"Independent screen differs");
      if(expected.status==="MIXED-REPLY-ELIGIBLE")last={state,raw:M.rawKey(state),ply,screen:expected};
      return expected;
    }
    return null;
  }
  function consume(row,width) {
    assert.equal(row.randomBefore,random);assert.ok(row.draws.length);
    const bound=Math.floor(4294967296/width)*width;
    row.draws.forEach((v,n)=>{let r=random>>>0;r^=r<<13;r^=r>>>17;r^=r<<5;random=r>>>0;
      assert.equal(v,random);assert.equal(v<bound,n===row.draws.length-1);});
    return random%width;
  }
  assert.ok(source.trace.length<=spec.maxPly);
  for(let ply=0;ply<source.trace.length;ply++) {
    assert.equal(state.winner,null);const examined=examine(ply);
    assert.ok(!examined?.status.startsWith("SCREEN-"),"Skipped fatal screen");
    const moves=order(api.moveVariants(state,{mode:"runtime"})),row=source.trace[ply];
    assert.equal(row.ply,ply);assert.equal(row.rawBefore,M.rawKey(state));
    const move=moves[consume(row,moves.length)];assert.equal(M.moveKey(move),row.moveKey);assert.equal(M.moveKey(row.move),row.moveKey);
    const next=api.applyMove(state,move,{maxMicrostates:spec.maxMicrostates});assert.equal(next.status,"TERMINATED");
    state=next.state;assert.equal(row.rawAfter,M.rawKey(state));
  }
  assert.deepEqual(normalize(state),normalize(source.finalState));
  const ply=source.trace.length;
  let examined=null;if(state.winner===null)examined=examine(ply);
  assert.equal(screenIndex,source.screens.length);assert.deepEqual(source.lastEligible,last);
  if(source.stop==="NATURAL-TERMINAL")assert.notEqual(state.winner,null);
  else if(source.stop==="PLY-LIMIT") {assert.equal(state.winner,null);assert.equal(ply,spec.maxPly);}
  else if(source.stop.startsWith("SCREEN-"))assert.equal(source.stop,examined.status);
  else {
    assert.ok(source.stopped,"Stopped source needs witness");
    const moves=order(api.moveVariants(state,{mode:"runtime"})),move=moves[consume(source.stopped,moves.length)];
    assert.equal(M.moveKey(move),source.stopped.moveKey);
    const exact=api.applyMove(state,move,{maxMicrostates:spec.maxMicrostates}),runtime=api.applyMove(state,move,{mode:"runtime"});
    assert.deepEqual(exact,source.stopped.independent);assert.deepEqual(runtime.state,source.stopped.runtimeState);
    assert.equal(source.stop,runtime.state.reason==="relay-limit"?"RUNTIME-GUARD":exact.status);
  }
  const regular=["NATURAL-TERMINAL","PLY-LIMIT"].includes(source.stop);
  const overlap=last&&[last.raw,...last.screen.branches.map(b=>b.to)].some(id=>exclusions.has(id));
  const candidate=regular&&last&&!overlap?{state:last.state,raw:last.raw,ply:last.ply,width:last.screen.width}:null;
  assert.deepEqual(source.candidate,candidate);
  assert.equal(source.selectionStatus,!regular?"SOURCE-FAILURE-NO-CANDIDATE":!last?"NO-STRUCTURAL-ROOT":overlap?"LATEST-ROOT-OVERLAP-EXCLUDED":"LATEST-ROOT-FROZEN");
  return state;
}
module.exports={initial,independentScreen,replay};
