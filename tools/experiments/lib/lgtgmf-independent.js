"use strict";

const { createHash } = require("node:crypto");

const STATE_FIELDS = ["pits", "reserve", "houseOwned", "player", "phase", "winner", "pending"];
const MOVE_FIELDS = ["type", "phase", "row", "index", "direction", "side", "houseChoice", "houseTwo"];

function invariant(ok, message) {
  if (!ok) throw new Error(message);
}

function canon(value) {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canon).join(",")}]`;
  return `{${Object.keys(value).sort().map((k) => `${JSON.stringify(k)}:${canon(value[k])}`).join(",")}}`;
}

function digest(text) {
  return createHash("sha256").update(String(text), "utf8").digest("hex");
}

function digestSet(values) {
  return digest([...values].sort().join("\n"));
}

function rawSnapshot(s) {
  invariant(s && typeof s === "object" && !Array.isArray(s), "invalid state object");
  for (const f of STATE_FIELDS) invariant(Object.prototype.hasOwnProperty.call(s, f), `missing field ${f}`);
  invariant(Array.isArray(s.pits) && s.pits.length === 2, "bad pits");
  const pits = s.pits.map((rows) => {
    invariant(Array.isArray(rows) && rows.length === 2, "bad rows");
    return rows.map((r) => {
      invariant(Array.isArray(r) && r.length === 8 && r.every((x) => Number.isInteger(x) && x >= 0), "bad pit row");
      return [...r];
    });
  });
  invariant(Array.isArray(s.reserve) && s.reserve.length === 2 && s.reserve.every((x) => Number.isInteger(x) && x >= 0), "bad reserve");
  invariant(Array.isArray(s.houseOwned) && s.houseOwned.length === 2 && s.houseOwned.every((x) => typeof x === "boolean"), "bad houseOwned");
  invariant(s.player === 0 || s.player === 1, "bad player");
  invariant(s.phase === "namua" || s.phase === "mtaji", "bad phase");
  invariant(s.winner === null || s.winner === 0 || s.winner === 1, "bad winner");
  invariant(Array.isArray(s.pending) && s.pending.length === 2 && s.pending.every((x) => Number.isInteger(x) && x >= 0), "bad pending");
  const raw = { pits, reserve: [...s.reserve], houseOwned: [...s.houseOwned], player: s.player, phase: s.phase, winner: s.winner, pending: [...s.pending] };
  const n = pits.flat(2).reduce((a,b) => a+b, 0) + raw.reserve[0] + raw.reserve[1] + raw.pending[0] + raw.pending[1];
  invariant(n === 64, `seed invariant ${n}`);
  return raw;
}

function rawId(s) {
  return digest(canon(rawSnapshot(s)));
}

function moveId(m) {
  invariant(m && typeof m === "object" && !Array.isArray(m), "invalid move");
  const values = MOVE_FIELDS.map((f) => {
    if (f === "houseTwo") return m.houseTwo === true ? "true" : "false";
    return m[f] === undefined || m[f] === null ? "" : String(m[f]);
  });
  return values.join(":");
}

function frac(a,b) {
  return { numerator: String(a), denominator: String(b), defined: BigInt(b) !== 0n };
}

function addHist(obj, value, weight = 1n) {
  const k = String(value);
  obj[k] = String(BigInt(obj[k] || "0") + weight);
}

function permute(rows, mode, salt) {
  const r = rows.slice();
  if (mode === "descending") return r.reverse();
  if (mode === "shuffled") return r.sort((a,b) => digest(`${salt}|${a.order}`).localeCompare(digest(`${salt}|${b.order}`)) || a.order.localeCompare(b.order));
  return r;
}

function reconstruct({ engine, rootState, targetDepth, traversalOrder = "ascending" }) {
  invariant(Number.isInteger(targetDepth) && targetDepth >= 0, "invalid target depth");
  const root = rawId(rootState);
  let frontier = Object.create(null);
  frontier[root] = { state: engine.clone(rootState), paths: 1n, starts: Object.create(null) };
  const layerRecords = [];
  const edgeRecords = [];
  const everyState = new Set([root]);
  const everyEdge = new Set();
  const immediate = Object.create(null);
  const survival = Object.create(null);
  let firstReconvergenceDepth = null;

  for (let d = 0; d <= targetDepth; d += 1) {
    const ids = Object.keys(frontier).sort();
    let occurrence = 0n;
    let terminalOccurrence = 0n;
    let reconvergent = 0;
    let ones = 0;
    const widthByState = Object.create(null);
    const widthByPath = Object.create(null);
    for (const id of ids) {
      const row = frontier[id];
      occurrence += row.paths;
      const terminal = row.state.winner !== null;
      const width = terminal ? 0 : engine.moveVariants(row.state).length;
      invariant(terminal || width > 0, `zero legal width ${id}`);
      addHist(widthByState, width);
      addHist(widthByPath, width, row.paths);
      if (width === 1) ones += 1;
      if (terminal) terminalOccurrence += row.paths;
      if (Object.keys(row.starts).length >= 2) reconvergent += 1;
    }
    if (firstReconvergenceDepth === null && reconvergent > 0) firstReconvergenceDepth = d;
    layerRecords.push({
      depth: d,
      treeNodeOccurrences: String(occurrence),
      uniqueRawStateCount: ids.length,
      terminalOccurrenceCount: String(terminalOccurrence),
      replyWidthHistogram: widthByState,
      treeOccurrenceReplyWidthHistogram: widthByPath,
      unitWidthStateCount: ones,
      stateSetSha256: digestSet(ids),
      reconvergentRawStateCount: reconvergent,
      cumulativeUniqueRawStateCount: everyState.size,
    });
    if (d === targetDepth) break;

    const next = Object.create(null);
    const transitions = new Map();
    const inboundTransitions = Object.create(null);
    const inboundParents = Object.create(null);
    let treeEdges = 0n;
    let expand=0, compress=0, same=0, reopen=0, extinct=0;
    const parentRows = ids.map((id) => ({ order:id, id, row:frontier[id] }));
    for (const parentRec of permute(parentRows, traversalOrder, d+17)) {
      const parent = parentRec.row;
      const parentTerminal = parent.state.winner !== null;
      const legal = parentTerminal ? [] : engine.moveVariants(parent.state).map((move) => ({ move, id:moveId(move) })).sort((a,b) => a.id.localeCompare(b.id));
      invariant(parentTerminal || legal.length > 0, `zero moves ${parentRec.id}`);
      for (const moveRec of permute(legal.map((x) => ({ order:x.id, ...x })), traversalOrder, d+811)) {
        const after = engine.applyMove(parent.state, moveRec.move).state;
        if (after.reason === "relay-limit") {
          const err = new Error(`relay-limit ${parentRec.id}`); err.code = "MOVE-NONTERMINATION"; throw err;
        }
        const cid = rawId(after);
        const e = `${parentRec.id}|${moveRec.id}|${cid}`;
        transitions.set(e, true); everyEdge.add(e);
        treeEdges += parent.paths;
        if (!next[cid]) next[cid] = { state: engine.clone(after), paths:0n, starts:Object.create(null) };
        next[cid].paths += parent.paths;
        if (d === 0) next[cid].starts[moveRec.id] = BigInt(next[cid].starts[moveRec.id] || 0n) + parent.paths;
        else for (const [label, count] of Object.entries(parent.starts)) next[cid].starts[label] = BigInt(next[cid].starts[label] || 0n) + BigInt(count);
        (inboundTransitions[cid] ||= new Set()).add(e);
        (inboundParents[cid] ||= new Set()).add(parentRec.id);
        const childTerminal = after.winner !== null;
        const cw = childTerminal ? 0 : engine.moveVariants(after).length;
        invariant(childTerminal || cw > 0, `zero child moves ${cid}`);
        const pw = legal.length;
        if (cw > pw) expand++; else if (cw < pw) compress++; else same++;
        if (pw === 1 && cw >= 2) reopen++;
        if (childTerminal) extinct++;
        if (d === 0) { immediate[moveRec.id] = cw; survival[moveRec.id] = 1; }
      }
    }
    for (const rec of Object.values(next)) {
      for (const label of Object.keys(rec.starts)) survival[label] = Math.max(survival[label] || 0, d+1);
    }
    let duplicates = 0, multi = 0;
    const arrivalHist = Object.create(null), parentHist = Object.create(null);
    for (const cid of Object.keys(next)) {
      const am = inboundTransitions[cid].size, pm = inboundParents[cid].size;
      duplicates += Math.max(0, am-1); if (pm >= 2) multi++;
      addHist(arrivalHist, am); addHist(parentHist, pm);
    }
    const transitionIds = [...transitions.keys()].sort();
    edgeRecords.push({
      depth:d,
      treeEdgeOccurrences:String(treeEdges),
      uniqueTransitionCount:transitionIds.length,
      transitionSetSha256:digestSet(transitionIds),
      arrivalTransitionCount:transitionIds.length,
      duplicateEncounterCount:duplicates,
      duplicateEncounterFraction:frac(duplicates, transitionIds.length),
      multiParentRawStateCount:multi,
      arrivalMultiplicityHistogram:arrivalHist,
      parentMultiplicityHistogram:parentHist,
      widthExpansionCount:expand,
      widthCompressionCount:compress,
      widthStableCount:same,
      branchReopeningCount:reopen,
      branchExtinctionCount:extinct,
    });
    frontier = next;
    for (const id of Object.keys(frontier)) everyState.add(id);
  }

  for (let d=0; d<layerRecords.length; d++) {
    const lr=layerRecords[d];
    lr.treeNodeExcess=String(BigInt(lr.treeNodeOccurrences)-BigInt(lr.uniqueRawStateCount));
    lr.treeToUniqueRawRatio=frac(lr.treeNodeOccurrences,lr.uniqueRawStateCount);
    if (d<edgeRecords.length) {
      const er=edgeRecords[d];
      er.treeEdgeToUniqueTransitionRatio=frac(er.treeEdgeOccurrences,er.uniqueTransitionCount);
      er.graphTransitionBranching=frac(er.uniqueTransitionCount,lr.uniqueRawStateCount);
      er.graphStateExpansion=frac(layerRecords[d+1].uniqueRawStateCount,lr.uniqueRawStateCount);
    }
  }

  const subtree = Object.create(null);
  let replay = Object.create(null);
  replay[root] = { state:engine.clone(rootState), starts:Object.create(null), paths:1n };
  for (let d=0; d<targetDepth; d++) {
    const out=Object.create(null);
    for (const pid of Object.keys(replay).sort()) {
      const p=replay[pid];
      const moves=p.state.winner!==null?[]:engine.moveVariants(p.state).map((m)=>({m,id:moveId(m)})).sort((a,b)=>a.id.localeCompare(b.id));
      for (const mr of moves) {
        const child=engine.applyMove(p.state,mr.m).state;
        invariant(child.reason!=="relay-limit","relay-limit replay");
        const cid=rawId(child);
        if(!out[cid]) out[cid]={state:engine.clone(child),starts:Object.create(null),paths:0n};
        out[cid].paths+=p.paths;
        if(d===0) out[cid].starts[mr.id]=BigInt(out[cid].starts[mr.id]||0n)+p.paths;
        else for(const [label,count] of Object.entries(p.starts)) out[cid].starts[label]=BigInt(out[cid].starts[label]||0n)+BigInt(count);
      }
    }
    for(const rec of Object.values(out)) for(const [label,count] of Object.entries(rec.starts)) {
      (subtree[label] ||= Object.create(null))[String(d+1)] = String(BigInt((subtree[label]||{})[String(d+1)]||"0")+BigInt(count));
    }
    replay=out;
  }

  for (const label of Object.keys(survival).sort()) {
    subtree[label] ||= Object.create(null);
    for (let d = 1; d <= targetDepth; d += 1) if (subtree[label][String(d)] === undefined) subtree[label][String(d)] = "0";
  }
  const branchSurvival=Object.keys(survival).sort().map((label)=>({rootMoveKey:label,branchSurvivalLength:survival[label],rightCensored:survival[label]===targetDepth}));
  const core={
    schemaVersion:1,
    rootRawKey:root,
    targetDepth,
    traversalOrder,
    complete:true,
    representation:{mode:"RAW-ONLY",identityFields:STATE_FIELDS,validatedTransformSet:[],pendingRequired:true},
    moveIdentityFields:MOVE_FIELDS,
    rootLegalMoveCount:rootState.winner!==null?0:engine.moveVariants(rootState).length,
    layers:layerRecords,
    parentLayers:edgeRecords,
    firstReconvergenceDepth,
    immediateReplyWidth:immediate,
    branchSurvival,
    rootMoveSubtreeOccurrences:subtree,
    cumulative:{distinctRawStates:everyState.size,uniqueGlobalTransitions:everyEdge.size,cumulativeRawStateSetSha256:digestSet(everyState),cumulativeGlobalRawGraphEdgeSetSha256:digestSet(everyEdge)},
  };
  const h={...core}; delete h.traversalOrder;
  core.measurementCoreSha256=digest(canon(h));
  return core;
}

function syntheticCheck(graph,targetDepth,traversalOrder="ascending") {
  invariant(graph && graph.nodes && graph.nodes[graph.root],"bad graph");
  let level=Object.create(null); level[graph.root]={paths:1n,starts:new Set()};
  const layers=[], parents=[]; let first=null;
  for(let d=0;d<=targetDepth;d++){
    const ids=Object.keys(level).sort(); let pathCount=0n,recon=0;
    for(const id of ids){pathCount+=level[id].paths;if(level[id].starts.size>=2)recon++;}
    if(first===null&&recon>0)first=d;
    layers.push({depth:d,treeNodeOccurrences:String(pathCount),uniqueStateCount:ids.length,reconvergentStateCount:recon,stateSetSha256:digestSet(ids)});
    if(d===targetDepth)break;
    const out=Object.create(null),edgeSet=new Set(),arrT=Object.create(null),arrP=Object.create(null);let edgePaths=0n,ex=0,co=0,st=0,ro=0,et=0;
    const plist=permute(ids.map((id)=>({order:id,id})),traversalOrder,d+31);
    for(const pr of plist){const p=graph.nodes[pr.id],moves=permute((p.moves||[]).slice().sort((a,b)=>a.id.localeCompare(b.id)).map((m)=>({order:m.id,...m})),traversalOrder,d+919);for(const m of moves){
      const c=graph.nodes[m.to];invariant(c,`missing ${m.to}`);const key=`${pr.id}|${m.id}|${m.to}`;edgeSet.add(key);edgePaths+=level[pr.id].paths;
      if(!out[m.to])out[m.to]={paths:0n,starts:new Set()};out[m.to].paths+=level[pr.id].paths;if(d===0)out[m.to].starts.add(m.id);else for(const x of level[pr.id].starts)out[m.to].starts.add(x);
      (arrT[m.to] ||= new Set()).add(key);(arrP[m.to] ||= new Set()).add(pr.id);const pw=(p.moves||[]).length,cw=c.terminal?0:(c.moves||[]).length;if(cw>pw)ex++;else if(cw<pw)co++;else st++;if(pw===1&&cw>=2)ro++;if(c.terminal)et++;
    }}
    let dup=0,multi=0;for(const id of Object.keys(out)){dup+=Math.max(0,arrT[id].size-1);if(arrP[id].size>=2)multi++;}
    parents.push({depth:d,treeEdgeOccurrences:String(edgePaths),uniqueTransitionCount:edgeSet.size,duplicateEncounterCount:dup,multiParentStateCount:multi,widthExpansionCount:ex,widthCompressionCount:co,widthStableCount:st,branchReopeningCount:ro,branchExtinctionCount:et,transitionSetSha256:digestSet(edgeSet)});level=out;
  }
  const result={graphId:graph.id,targetDepth,traversalOrder,layers,parentLayers:parents,firstReconvergenceDepth:first};const h={...result};delete h.traversalOrder;result.coreSha256=digest(canon(h));return result;
}

module.exports={STATE_FIELDS,MOVE_FIELDS,canon,digest,digestSet,rawSnapshot,rawId,moveId,reconstruct,syntheticCheck};
