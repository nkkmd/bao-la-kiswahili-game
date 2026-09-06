"use strict";
// Independent source reconstruction and game replay. No production selection,
// measurement, gate, or candidate transition implementation is imported.
const fs=require("node:fs"),crypto=require("node:crypto"),assert=require("node:assert/strict"),cp=require("node:child_process");
const C=require("./lib/pbai-p4-common.js"); // Only frozen baseline loading and paths.
const stage=process.argv[2],dir=C.OUT+"/"+stage;
const read=p=>JSON.parse(fs.readFileSync(p,"utf8"));
const hash=x=>crypto.createHash("sha256").update(JSON.stringify(x)).digest("hex");
const raw=s=>hash([s.pits,s.reserve,s.houseOwned,s.player,s.phase,s.winner,s.pending]);
function random(seed){let v=seed;return()=>{v=(v+1831565813)>>>0;let t=Math.imul(v^(v>>>15),v|1);t=(t^(t+Math.imul(t^(t>>>7),t|61)))>>>0;return ((t^(t>>>14))>>>0)/4294967296;};}
const B=C.baseline(),names=["development","validation","holdout"],prior=[];
for(const s of names.slice(0,names.indexOf(stage)))for(const k of ["roots","games"]){const p=C.OUT+"/"+s+"/"+k+"-source.json";if(fs.existsSync(p))prior.push(...read(p).rows);}
const blocked={raw:new Set(prior.map(r=>r.raw)),prefix:new Set(prior.map(r=>r.prefix)),trajectory:new Set(prior.map(r=>r.trajectory))};
let sourceSeeds=0,sourceRoots=0,gameMoves=0,games=0;
for(const kind of ["roots","games"]){
 const file=dir+"/"+kind+"-source.json";if(!fs.existsSync(file))continue;
 const data=read(file),selected=[];
 for(const log of data.audit){
  sourceSeeds++;let s=B.E.initialState(),u=random(log.seed),chosen;const moves=[];
  for(let turn=1;turn<=96&&s.winner===null;turn++){
   const list=B.E.moveVariants(s),m=list[Math.trunc(u()*list.length)];moves.push(B.A.moveKey(m));s=B.E.applyMove(s,m).state;
   const inWindow=log.phase==="namua"?turn>=12&&turn<=40:turn>=44&&turn<=88;
   if(chosen===undefined&&inWindow&&s.phase===log.phase&&s.winner===null&&B.E.moveVariants(s).length>1)chosen={state:s,ply:turn};
  }
  const prefix=hash(moves.slice(0,12)),trajectory=hash(moves);assert.equal(prefix,log.prefix);assert.equal(trajectory,log.trajectory);
  let reason="NO-ROOT";
  if(chosen){const r=raw(chosen.state);reason=blocked.raw.has(r)?"DUPLICATE-RAW":blocked.prefix.has(prefix)?"DUPLICATE-PREFIX":blocked.trajectory.has(trajectory)?"DUPLICATE-TRAJECTORY":null;
   if(reason===null){selected.push({seed:log.seed,phase:log.phase,raw:r,prefix,trajectory,...chosen});blocked.raw.add(r);blocked.prefix.add(prefix);blocked.trajectory.add(trajectory);}}
  assert.equal(reason,log.reason);
 }
 assert.deepEqual(selected,data.rows);assert.equal(selected.length,data.n*2);sourceRoots+=selected.length;
 if(kind==="roots")for(let i=0;i<data.rows.length;i++){
  const op=dir+`/operation-${i}.json`;if(!fs.existsSync(op))continue;
  for(const row of read(op)){
   assert.equal(row.seed,data.rows[i].seed);assert.equal(row.phase,data.rows[i].phase);
   for(const mode of ["baseline","candidate"]){
    const move=row[mode].analysis.move;
    assert(B.E.moveVariants(data.rows[i].state).some(m=>B.A.moveKey(m)===B.A.moveKey(move)));
    B.E.applyMove(data.rows[i].state,move);
   }
  }
 }
 if(kind==="games")for(let i=0;i<data.rows.length;i++){
  const f=dir+`/pair-${i}.json`;if(!fs.existsSync(f))continue;
  const pair=read(f),root=data.rows[i];assert.equal(pair.seed,root.seed);assert.deepEqual(pair.games.map(g=>g.candidateSeat).sort(),[0,1]);
  for(const game of pair.games){games++;let state=root.state;const raws=[raw(state)];
   for(let j=0;j<game.moves.length;j++){const move=game.moves[j];assert(state.winner===null);assert(B.E.moveVariants(state).some(m=>B.A.moveKey(m)===B.A.moveKey(move)));
    assert.equal(game.stats[j].mode,state.player===game.candidateSeat?"candidate":"baseline");
    state=B.E.applyMove(state,move).state;raws.push(raw(state));gameMoves++;}
   assert.deepEqual(state,game.final);assert.deepEqual(raws,game.raws);assert.equal(hash(raws),game.trajectory);
   assert.equal(game.score,state.winner===null?.5:state.winner===game.candidateSeat?1:0);
   assert.equal(game.winner,state.winner);if(state.winner===null)assert.equal(game.moves.length,160);
   assert.equal(game.reason,state.winner===null?"160-ply-cap":state.reason);
  }
  assert.equal(pair.score,(pair.games[0].score+pair.games[1].score)/2);
 }
}
const result={passed:true,stage,sourceSeeds,sourceRoots,games,gameMoves,baselineOnlyReplay:true,productionSelectionImported:false,productionGatesImported:false,sourceIdentityMismatches:0,gameReplayMismatches:0};
if(process.argv.includes("--check"))assert.deepEqual(read(dir+"/independent-replay.json"),result);
else C.write(dir+"/independent-replay.json",result);console.log(JSON.stringify(result));
