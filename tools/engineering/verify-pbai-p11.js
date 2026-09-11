"use strict";
// 保存済みの元軌跡と対局を再構成する。時間制限付き対局の再測定は行わない。
const C=require('./lib/pbai-p11-common.js');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
C.requireSupervision();
const B=C.load(), files=fs.readdirSync(C.OUT), seen={raw:new Set(),prefix:new Set(),trajectory:new Set()};
for(const r of C.knownIdentities())for(const k of Object.keys(seen))if(r[k])seen[k].add(r[k]);
let sourceRoots=0,matchGames=0,matchPlies=0;
for(const name of Object.keys(C.SPEC.matches).map(n=>n+'-matches')) {
  const f=path.join(C.OUT,name+'-source.json');if(!fs.existsSync(f))continue;
  const source=C.read(f), config=C.SPEC.matches[name.replace('-matches','')];
  assert.equal(source.rows.length,config.pairsPerPhase*2);
  assert.equal(JSON.stringify(source.config),JSON.stringify(config));
  // Reconstruct every attempted source seed, including rejected roots, from a separate PRNG implementation.
  const accepted=source.rows.map(r=>r.seed); let acceptedAt=0;
  const auditSeen={};for(const k of Object.keys(seen))auditSeen[k]=new Set(seen[k]);
  for(const [auditIndex,audit] of source.audit.entries()) {
    assert.ok(audit.seed>=config.seedBase&&audit.seed<config.seedBase+C.SPEC.population.blockSize);
    if(auditIndex)assert.ok(audit.seed>source.audit[auditIndex-1].seed);
    assert.equal(audit.phase,(audit.seed-config.seedBase)%2===0?'namua':'mtaji');
    let value=audit.seed>>>0;
    const random=()=>{value=(value+1831565813)>>>0;let z=Math.imul(value^(value>>>15),value|1);z=(z^(z+Math.imul(z^(z>>>7),z|61)))>>>0;return ((z^(z>>>14))>>>0)/4294967296;};
    let state=B.E.initialState(),selected=null;const keys=[];
    for(let ply=1;ply<=96&&state.winner===null;ply++) {
      const variants=B.E.moveVariants(state),move=variants[Math.floor(random()*variants.length)];
      keys.push(B.A.moveKey(move));state=B.E.applyMove(state,move).state;
      const bounds=C.SPEC.population[audit.phase+'Range'];
      if(!selected&&ply>=bounds[0]&&ply<=bounds[1]&&state.winner===null&&state.phase===audit.phase&&B.E.moveVariants(state).length>=2)selected=state;
    }
    const ids={raw:selected?C.raw(selected):null,prefix:C.sha(keys.slice(0,12)),trajectory:C.sha(keys)};
    for(const k of Object.keys(ids))assert.equal(ids[k],audit[k]);
    const reason=!selected?'no-root':Object.keys(auditSeen).find(k=>auditSeen[k].has(ids[k]));
    assert.equal(audit.reason,reason||null);assert.equal(audit.accepted,!reason);
    if(!reason)assert.equal(accepted[acceptedAt++],audit.seed);
    for(const k of Object.keys(ids))if(ids[k])auditSeen[k].add(ids[k]);
  }
  assert.equal(acceptedAt,source.rows.length);

  for(const [index,r] of source.rows.entries()) {
    let s=B.E.initialState(),chosen=null;const keys=[];
    for(const [n,m] of r.moves.entries()) {
      assert.ok(B.E.moveVariants(s).some(v=>B.A.moveKey(v)===B.A.moveKey(m)));
      s=B.E.applyMove(s,m).state;keys.push(B.A.moveKey(m));
      const [min,max]=C.SPEC.population[r.phase+'Range'];
      if(!chosen&&n+1>=min&&n+1<=max&&s.phase===r.phase&&s.winner===null&&B.E.moveVariants(s).length>=2)chosen={state:s,ply:n+1};
    }
    assert.equal(JSON.stringify(chosen.state),JSON.stringify(r.state));assert.equal(chosen.ply,r.ply);
    assert.equal(C.sha(keys.slice(0,12)),r.prefix);assert.equal(C.sha(keys),r.trajectory);assert.equal(C.raw(r.state),r.raw);
    for(const k of Object.keys(seen)) {assert.ok(!seen[k].has(r[k]),`Split collision: ${k}`);seen[k].add(r[k]);}
    sourceRoots++;
    if(sourceRoots%128===0)console.log(JSON.stringify({stage:'verify',sourceRoots}));
  }
  for(const audit of source.audit)for(const k of Object.keys(seen))if(audit[k])seen[k].add(audit[k]);
}
for(const f of files.filter(f=>/^.+-pair-\d+\.json$/.test(f))) {
  const pair=C.read(path.join(C.OUT,f)),config=C.SPEC.matches[pair.name];
  const r=C.read(path.join(C.OUT,pair.name+'-matches-source.json')).rows[pair.index];
  assert.equal(JSON.stringify(pair.root),JSON.stringify(r.state));assert.equal(pair.seed,r.seed);assert.equal(pair.phase,r.phase);assert.equal(pair.raw,r.raw);
  assert.equal(pair.games.length,2);assert.equal(JSON.stringify(pair.games.map(g=>g.side)),'[0,1]');
  for(const g of pair.games) {
    assert.ok(g.plies.length<=C.SPEC.search.maxMatchPlies);
    let s=pair.root;const keys=[];
    for(const [n,p] of g.plies.entries()) {
      assert.equal(p.seed,(960000001+Object.keys(C.SPEC.matches).indexOf(pair.name)*10000000+pair.index*1000+g.side*200+n)>>>0);
      assert.equal(p.stats.allocatedTimeMs,config.timeLimitMs);
      assert.ok(p.stats.completedDepth<=config.maxDepth);
      for(const v of [p.stats.rootScore,p.stats.elapsedMs,p.elapsedMs])assert.ok(Number.isFinite(v));
      assert.ok(p.elapsedMs>=0&&p.stats.elapsedMs>=0);
      assert.equal(p.actor,s.player===g.side?'logic':'baseline'); if(p.actor==='logic'){assert.equal(p.stats.evaluationCandidate,'PBAI-C015-v1');assert.equal(p.stats.evaluationFallback,false);}
      assert.ok(B.E.moveVariants(s).some(m=>B.A.moveKey(m)===B.A.moveKey(p.move)));
      s=B.E.applyMove(s,p.move).state;keys.push(B.A.moveKey(p.move));matchPlies++;
    }
    assert.equal(JSON.stringify(s),JSON.stringify(g.finalState));assert.equal(s.winner===null?.5:Number(s.winner===g.side),g.score);
    assert.ok(s.winner!==null||g.plies.length===160);assert.equal(C.sha([pair.raw,keys]),g.trajectory);matchGames++;
  }
  assert.equal(C.mean(pair.games.map(g=>g.score)),pair.points);
}
C.write(path.join(C.OUT,'replay-verification.json'),{passed:true,sourceRoots,matchGames,matchPlies,timedMatchesRerun:false,scope:'source regeneration, all saved moves and outcomes; same frozen rules engine'});
