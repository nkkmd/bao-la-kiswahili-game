// P7終了後の原因調査。元の検算からJSONで失われるゼロ符号の比較だけを変更。
// 正式結果の救済・昇格や時間制限付き対局の取り直しには使用しない。
"use strict";
// 保存済みの棋譜と教師を再構成する。時間制限付き対局の再測定は行わない。
const C=require('./lib/pbai-p7-common.js');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
assert.equal(C.read(path.join(C.OUT,'FINAL_RESULT.json')).decision,'TECHNICAL-INVALID / HOLD');
let signedZeroDifferences=0;
function equalAfterJson(a,b,...rest) {
 if(a===0&&b===0&&!Object.is(a,b))signedZeroDifferences++;
 else assert.equal(a,b,...rest);
}
const B=C.load(), files=fs.readdirSync(C.OUT), seen={raw:new Set(),prefix:new Set(),trajectory:new Set()};
for(const r of C.read(path.join(C.DOC,'P6_IDENTITIES.json')).rows.concat(C.read(path.join(C.ROOT,'doc/ai-engineering/public-ai-improvement-program-6/KNOWN_IDENTITIES.json')).rows))for(const k of Object.keys(seen))if(r[k])seen[k].add(r[k]);
let sourceRoots=0,teacherRoots=0,matchGames=0,matchPlies=0;
for(const name of ['development','development-matches','validation','validation-matches','holdout-matches']) {
  const f=path.join(C.OUT,name+'-source.json');if(!fs.existsSync(f))continue;
  const source=C.read(f);
  // Reconstruct every attempted source seed, including rejected roots, from a separate PRNG implementation.
  const accepted=source.rows.map(r=>r.seed); let acceptedAt=0;
  const auditSeen={};for(const k of Object.keys(seen))auditSeen[k]=new Set(seen[k]);
  for(const audit of source.audit) {
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
    for(const k of Object.keys(ids))equalAfterJson(ids[k],audit[k]);
    const reason=!selected?'no-root':Object.keys(auditSeen).find(k=>auditSeen[k].has(ids[k]));
    equalAfterJson(audit.reason,reason||null);equalAfterJson(audit.accepted,!reason);
    if(!reason)equalAfterJson(accepted[acceptedAt++],audit.seed);
    for(const k of Object.keys(ids))if(ids[k])auditSeen[k].add(ids[k]);
  }
  equalAfterJson(acceptedAt,source.rows.length);
  const labels=files.includes(name+'-dataset.json')?C.read(path.join(C.OUT,name+'-dataset.json')).rows:null;
  for(const [index,r] of source.rows.entries()) {
    let s=B.E.initialState(),chosen=null;const keys=[];
    for(const [n,m] of r.moves.entries()) {
      assert.ok(B.E.moveVariants(s).some(v=>B.A.moveKey(v)===B.A.moveKey(m)));
      s=B.E.applyMove(s,m).state;keys.push(B.A.moveKey(m));
      const [min,max]=C.SPEC.population[r.phase+'Range'];
      if(!chosen&&n+1>=min&&n+1<=max&&s.phase===r.phase&&s.winner===null&&B.E.moveVariants(s).length>=2)chosen={state:s,ply:n+1};
    }
    equalAfterJson(JSON.stringify(chosen.state),JSON.stringify(r.state));equalAfterJson(chosen.ply,r.ply);
    equalAfterJson(C.sha(keys.slice(0,12)),r.prefix);equalAfterJson(C.sha(keys),r.trajectory);equalAfterJson(C.raw(r.state),r.raw);
    for(const k of Object.keys(seen)) {assert.ok(!seen[k].has(r[k]),`Split collision: ${k}`);seen[k].add(r[k]);}
    sourceRoots++;
    if(labels) {
      const label=labels[index];equalAfterJson(label.seed,r.seed);equalAfterJson(JSON.stringify(label.state),JSON.stringify(r.state));
      const a=B.A.analyzeMove(r.state,'hard',C.rng(r.seed),C.options(3,Infinity));
      const stable=x=>{const {elapsedMs,...stats}=x.stats;return JSON.stringify({move:x.move,stats});};
      equalAfterJson(stable(a),stable(label.teacher));equalAfterJson(C.clip(a.stats.rootScore/1024),label.target);
      equalAfterJson(B.fast.evaluate(r.state,r.state.player),label.staticScore);teacherRoots++;
    }
    if(sourceRoots%128===0)console.log(JSON.stringify({stage:'verify',sourceRoots,teacherRoots}));
  }
  for(const audit of source.audit)for(const k of Object.keys(seen))if(audit[k])seen[k].add(audit[k]);
}
for(const f of files.filter(f=>/^.+-pair-\d+\.json$/.test(f))) {
  const pair=C.read(path.join(C.OUT,f));
  for(const g of pair.games) {
    let s=pair.root;const keys=[];
    for(const p of g.plies) {
      equalAfterJson(p.actor,s.player===g.side?'logic':'baseline');
      assert.ok(B.E.moveVariants(s).some(m=>B.A.moveKey(m)===B.A.moveKey(p.move)));
      s=B.E.applyMove(s,p.move).state;keys.push(B.A.moveKey(p.move));matchPlies++;
    }
    equalAfterJson(JSON.stringify(s),JSON.stringify(g.finalState));equalAfterJson(s.winner===null?.5:Number(s.winner===g.side),g.score);
    assert.ok(s.winner!==null||g.plies.length===160);equalAfterJson(C.sha([pair.raw,keys]),g.trajectory);matchGames++;
  }
  equalAfterJson(C.mean(pair.games.map(g=>g.score)),pair.points);
}
const optimized=require('./lib/pbai-p7-compiler.js').compile(C.model());
let equivalenceRows=0;
for(const name of ['development','validation']) {
 const file=path.join(C.OUT,name+'-evaluation.json');if(!fs.existsSync(file))continue;
 const evalRows=C.read(file).rows, data=C.read(path.join(C.OUT,name+'-dataset.json')).rows;
 for(let i=0;i<data.length;i++) {
  const s=data[i].state,p=s.player;
  equalAfterJson(evalRows[i].scores.previous,C.finish(x=>C.referenceLogic(C.model(),x),s,p));
  equalAfterJson(evalRows[i].scores.logic,optimized.evaluate(s,p));
 }
 const eq=C.read(path.join(C.OUT,name+'-equivalence.json'));
 equalAfterJson(eq.rows.length,data.length*2);
 for(const row of eq.rows){const a=structuredClone(row.previous),b=structuredClone(row.optimized);delete a.stats.elapsedMs;delete b.stats.elapsedMs;equalAfterJson(JSON.stringify(a),JSON.stringify(b));equivalenceRows++;}
}
C.write(path.join(C.OUT,'postclosure-replay-verification.json'),{passed:true,diagnosticOnly:true,formalDecisionUnchanged:true,signedZeroDifferences,sourceRoots,teacherRoots,matchGames,matchPlies,equivalenceRows,teacherRecomputation:'fixed depth only',timedMatchesRerun:false});
