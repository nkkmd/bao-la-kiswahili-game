"use strict";
const assert = require("node:assert/strict"), fs = require("node:fs"), path = require("node:path"), zlib = require("node:zlib");
const B = require("../g5-04/core.cjs"), D = require("../g5-source-design/core.cjs");
const P = require("../g5-01/transition/runtime-engine.cjs"), I = require("../g5-01/transition/independent-engine.cjs");
const M = require("../g5-01/measurement.cjs");
function priorFirewall() {
  const base = path.resolve(__dirname,"../../../doc/research-generation-5");
  const ids = new Set();
  for (const location of ["g5-01/development","g5-02","g5-03","g5-04"]) {
    const e = JSON.parse(zlib.gunzipSync(fs.readFileSync(path.join(base,location,"results/EVIDENCE.json.gz"))));
    for (const id of e.developmentReadIdentities ?? e.supplyReadIdentities) ids.add(id);
  }
  return ids;
}
function preliminary(s,width,spec) {
  return s.winner === null && s.phase === "mtaji" && s.reserve.every(v=>v===0)
    && width >= spec.minWidth && width <= spec.maxWidth;
}
function screen(state,spec,observe=()=>{},api={P,I}) {
  const choices=B.sorted(api.P.moveVariantsForSearch(state));
  assert.deepEqual(choices.map(c=>c.key),B.sorted(api.I.moveVariants(state,{mode:"runtime"})).map(c=>c.key),"SCREEN-MOVESET-MISMATCH");
  const result={rootKey:M.rawKey(state),width:choices.length,status:null,branches:[]};
  observe(state,"SCREEN-ROOT");
  for(const {key,move}of choices) {
    const runtime=api.P.applyMoveForSearch(state,move).state;observe(runtime,"SCREEN-RUNTIME-CHILD");
    const exact=api.I.applyMove(state,move,{maxMicrostates:spec.maxMicrostates});
    if(exact.state)observe(exact.state,"SCREEN-INDEPENDENT-CHILD");
    if(runtime.reason==="relay-limit" || exact.status!=="TERMINATED") {
      result.status=runtime.reason==="relay-limit"?"SCREEN-RUNTIME-GUARD":"SCREEN-"+exact.status;
      result.stopped={key,move,runtimeState:runtime,independent:exact};return result;
    }
    assert.deepEqual(B.normalize(exact.state),B.normalize(runtime),"SCREEN-TRANSITION-MISMATCH");
    const replies=B.sorted(api.P.moveVariantsForSearch(runtime)).map(c=>c.key);
    assert.deepEqual(replies,B.sorted(api.I.moveVariants(exact.state,{mode:"runtime"})).map(c=>c.key),"REPLY-MOVESET-MISMATCH");
    result.branches.push({key,to:M.rawKey(runtime),state:runtime,replyKeys:replies});
  }
  result.status=D.classify({nonterminal:state.winner===null,phase:state.phase,reserve:state.reserve,width:choices.length},
    result.branches.map(b=>({nonterminal:b.state.winner===null,width:b.replyKeys.length,mode:D.replyMode(b.replyKeys)})),spec);
  return result;
}
function chooseRepresentative(last,exclusions) {
  if(!last)return {candidate:null,selectionStatus:"NO-STRUCTURAL-ROOT"};
  const overlap=[last.raw,...last.screen.branches.map(b=>b.to)].some(id=>exclusions.has(id));
  return {candidate:overlap?null:{state:last.state,raw:last.raw,ply:last.ply,width:last.screen.width},
    selectionStatus:overlap?"LATEST-ROOT-OVERLAP-EXCLUDED":"LATEST-ROOT-FROZEN"};
}
function generateSource(seed,spec,exclusions,check=()=>{},hooks={},fixtureApi=null) {
  assert.ok(Number.isInteger(seed)&&seed>0&&seed<=4294967295);
  const api=fixtureApi??{P,I}, observe=hooks.observe??(()=>{}),progress=hooks.progress??(()=>{});
  let state=api.P.initialState(),random=seed,last=null;
  const source={seed,trace:[],screens:[],stop:null,finalState:state,lastEligible:null,candidate:null,selectionStatus:null};
  progress(source);observe(state,"SOURCE-INITIAL");
  function finish(stop) {
    source.stop=stop;source.finalState=state;source.lastEligible=last;
    if(["NATURAL-TERMINAL","PLY-LIMIT"].includes(stop))Object.assign(source,chooseRepresentative(last,exclusions));
    else {source.candidate=null;source.selectionStatus="SOURCE-FAILURE-NO-CANDIDATE";}
    progress(source);return source;
  }
  try {
    for(let ply=0;ply<=spec.maxPly;ply++) {
      check();source.finalState=state;
      if(state.winner!==null)return finish("NATURAL-TERMINAL");
      const choices=B.sorted(api.P.moveVariantsForSearch(state));
      assert.deepEqual(choices.map(c=>c.key),B.sorted(api.I.moveVariants(state,{mode:"runtime"})).map(c=>c.key),"SOURCE-MOVESET-MISMATCH");
      assert.ok(choices.length,"SOURCE-NONTERMINAL-NO-MOVES");
      if(preliminary(state,choices.length,spec)) {
        const examined={ply,...screen(state,spec,observe,api)};source.screens.push(examined);
        if(examined.status==="MIXED-REPLY-ELIGIBLE")last={state,raw:M.rawKey(state),ply,screen:examined};
        source.lastEligible=last;
        if(examined.status.startsWith("SCREEN-"))return finish(examined.status);
      }
      if(ply===spec.maxPly)return finish("PLY-LIMIT");
      const picked=B.draw(random,choices.length),{key,move}=choices[picked.index];
      const runtime=api.P.applyMoveForSearch(state,move).state;observe(runtime,"SOURCE-RUNTIME-CHILD");
      const exact=api.I.applyMove(state,move,{maxMicrostates:spec.maxMicrostates});
      if(exact.state)observe(exact.state,"SOURCE-INDEPENDENT-CHILD");
      if(runtime.reason==="relay-limit"||exact.status!=="TERMINATED") {
        source.stopped={moveKey:key,move,randomBefore:random,draws:picked.values,runtimeState:runtime,independent:exact};
        return finish(runtime.reason==="relay-limit"?"RUNTIME-GUARD":exact.status);
      }
      assert.deepEqual(B.normalize(exact.state),B.normalize(runtime),"SOURCE-TRANSITION-MISMATCH");
      source.trace.push({ply,moveKey:key,move,randomBefore:random,draws:picked.values,rawBefore:M.rawKey(state),rawAfter:M.rawKey(runtime)});
      state=runtime;random=picked.randomState;source.finalState=state;
      if((ply+1)%32===0)progress(source);
    }
  } catch(error) {
    source.failure=error.message;source.stop="SOURCE-INTERRUPTED";source.finalState=state;
    source.lastEligible=last;source.candidate=null;source.selectionStatus="SOURCE-FAILURE-NO-CANDIDATE";
    // 保存callbackは資源停止のためthrowする場合がある。呼出元は同じsource参照を保持する。
    return source;
  }
  throw Error("Unreachable source end");
}

function buildClosure(root, spec, globalCheck = () => {}, excluded = new Set(), hooks = {}) {
  const observe = hooks.observe ?? (()=>{}), progress = hooks.progress ?? (()=>{});
  const start = performance.now(), rootKey = M.rawKey(root), states = new Map([[rootKey, structuredClone(root)]]);
  const queue = [rootKey], nodes = [], edges = []; let stop = null, stopWitness = null;
  const stopIf = code => { stop = code; };
  const check = () => { try { globalCheck(); return true; } catch (e) { stopIf(e.message); return false; } };
  observe(root,"CLOSURE-ROOT");
  try {
  outer: for (let n = 0; n < queue.length; n++) {
    if (!check()) break;
    if (excluded.has(queue[n])) { stopIf("PRIOR-READ-OVERLAP"); stopWitness = { raw: queue[n] }; break; }
    if (performance.now() - start > spec.maxDomainMs) { stopIf("TIME-LIMIT"); break; }
    const id = queue[n], state = states.get(id), moves = B.sorted(P.moveVariantsForSearch(state));
    assert.deepEqual(B.sorted(I.moveVariants(state, { mode: "runtime" })).map(x => x.key), moves.map(x => x.key), "Closure move set differs");
    const node = { id, player: state.player, winner: state.winner, moves: [] };
    if (state.winner === null) assert.ok(moves.length, "Nonterminal closure state without moves");
    for (const { key, move } of moves) {
      if (!check()) break outer;
      if (performance.now() - start > spec.maxDomainMs) { stopIf("TIME-LIMIT"); break outer; }
      if (edges.length >= spec.maxEdges) { stopIf("EDGE-LIMIT"); break outer; }
      const child = P.applyMoveForSearch(state, move).state; observe(child,"CLOSURE-RUNTIME-CHILD");
      if (child.reason === "relay-limit") { stopIf("RUNTIME-GUARD"); stopWitness={from:id,moveKey:key,raw:M.rawKey(child),state:child,runtimeGuardOnly:true}; break outer; }
      const exact = I.applyMove(state, move, { maxMicrostates: spec.maxMicrostates });
      if(exact.state)observe(exact.state,"CLOSURE-INDEPENDENT-CHILD");
      if (exact.status !== "TERMINATED") { stopIf(exact.status); stopWitness={from:id,moveKey:key,raw:M.rawKey(child),state:child,independent:exact}; break outer; }
      assert.deepEqual(B.normalize(exact.state), B.normalize(child), "Closure child differs");
      const to = M.rawKey(child);
      if (excluded.has(to)) {
        stopIf("PRIOR-READ-OVERLAP"); stopWitness = { from: id, moveKey: key, raw: to, state: child }; break outer;
      }
      if (!states.has(to)) {
        if (states.size >= spec.maxStates) {
          stopIf("STATE-LIMIT"); stopWitness = { from: id, moveKey: key, raw: to, state: child }; break outer;
        }
        states.set(to, child); queue.push(to);
      }
      node.moves.push({ key, to }); edges.push({ from: id, moveKey: key, to });
      if(edges.length%128===0)progress({rootKey,states:[...states].map(([id,state])=>({id,state})),nodes,edges,complete:false,status:"IN-PROGRESS",solution:null});
    }
    nodes.push(node);
  }
  } catch(error) { stopIf(error.message); }
  const fullStates = [...states].map(([id, state]) => ({ id, state }));
  if (stop) return { status: stop, stopWitness, complete: false, rootKey, states: fullStates, nodes, edges, solution: null,
    elapsedMs: Math.round(performance.now() - start) };
  const solution = require("../../experiments/lib/restricted-endgame-retrograde.js").solveRetrograde(nodes), independent = require("../../experiments/lib/restricted-endgame-retrograde-independent.js").solveIndependent(nodes);
  assert.deepEqual(solution, independent, "Independent solution differs");
  if (performance.now() - start > spec.maxDomainMs) {
    return { status: "TIME-LIMIT", complete: false, rootKey, states: fullStates, nodes, edges, solution: null,
      elapsedMs: Math.round(performance.now() - start) };
  }
  return { status: "COMPLETE-INDEPENDENT-AGREEMENT", complete: true, rootKey, states: fullStates,
    nodes, edges, solution, elapsedMs: Math.round(performance.now() - start) };
}

module.exports = {preliminary,screen,chooseRepresentative,generateSource,buildClosure,priorFirewall,technicalFirewall:B.technicalFirewall,domainGroups:B.domainGroups,normalize:B.normalize};
