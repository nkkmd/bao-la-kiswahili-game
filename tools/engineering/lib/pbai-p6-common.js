"use strict";
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const vm = require('node:vm');
const { performance } = require('node:perf_hooks');
const ROOT = path.resolve(__dirname, '../../..');
const DOC = path.join(ROOT, 'doc/ai-engineering/public-ai-improvement-program-6');
const OUT = path.join(ROOT, 'artifacts/pbai-p6/run');
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const SPEC = read(path.join(DOC, 'SPEC.json'));
const sha = v => crypto.createHash('sha256').update(typeof v === 'string' || Buffer.isBuffer(v) ? v : JSON.stringify(v)).digest('hex');
const raw = s => sha([s.pits, s.reserve, s.houseOwned, s.player, s.phase, s.winner, s.pending]);
const mean = a => a.reduce((s,v) => s+v, 0)/a.length;
const quantile = (a,p) => [...a].sort((a,b)=>a-b)[Math.max(0, Math.ceil(a.length*p)-1)];
const median = a => { const s=[...a].sort((a,b)=>a-b), n=s.length; return n%2?s[n>>1]:(s[n/2-1]+s[n/2])/2; };
function rng(seed) { let a=seed>>>0; return ()=>{ a+=0x6D2B79F5; let t=a; t=Math.imul(t^(t>>>15),t|1); t^=t+Math.imul(t^(t>>>7),t|61); return ((t^(t>>>14))>>>0)/4294967296; }; }
function write(p, v) { fs.mkdirSync(path.dirname(p),{recursive:true}); fs.writeFileSync(p,JSON.stringify(v)+'\n',{flag:'wx'}); }
function append(p,v) { fs.appendFileSync(p,JSON.stringify(v)+'\n'); }
function verifySources() { for(const [p,h] of Object.entries(SPEC.sourceHashes)) if(sha(fs.readFileSync(path.join(ROOT,p)))!==h) throw Error(`Source mismatch: ${p}`); }
function replaceOnce(s,from,to) { if(s.split(from).length!==2)throw Error(`Hook anchor must occur once: ${from}`); return s.replace(from,to); }
function load(hook=false) {
  verifySources();
  const ctx=vm.createContext({performance});
  for(const name of ['engine.js','ai-weights.js','ai.js']) {
    let s=fs.readFileSync(path.join(ROOT,'public',name),'utf8');
    if(name==='ai.js') {
      if(hook)s=replaceOnce(s,'const rawEvaluator = evaluatorFor(', 'const rawEvaluator = options.pbaiP6Evaluator || evaluatorFor(');
      s=replaceOnce(s,'root.BaoAI = api;', 'root.BaoAI = api; root.__p6Factory = createAI;');
    }
    vm.runInContext(s,ctx,{filename:name});
  }
  const E=ctx.BaoEngine, A=ctx.BaoAI;
  const light={...E,applyMove:E.applyMoveForSearch,moveVariants:E.moveVariantsForSearch};
  const fast=ctx.__p6Factory(light,true);
  return {E,A,fast,create:ctx.__p6Factory};
}
function options(depth=SPEC.search.maxDepth,time=SPEC.search.timeLimitMs,evaluator=null) {
  return {evaluationProfile:'bao',searchProfile:'phase2',pbaiC011LightweightTransitions:true,maxDepth:depth,timeLimitMs:time,...(evaluator?{pbaiP6Evaluator:evaluator}:{})};
}
function encode(s,p) {
  if(p!==0&&p!==1)throw Error('Invalid perspective');
  if(!['namua','mtaji'].includes(s.phase)||![0,1].includes(s.player))throw Error('Invalid state flags');
  const x=[];
  const bits=(n,k)=>{if(!Number.isSafeInteger(n)||n<0||n>=2**k)throw Error(`Encoding range: ${n}/${k}`);for(let j=0;j<k;j++)x.push(Math.floor(n/2**j)%2);};
  for(const side of [p,1-p])for(const row of [0,1])for(const n of s.pits[side][row]) { bits(n,7); for(const t of [1,2,4])x.push(Number(n>=t)); }
  for(const side of [p,1-p])bits(s.reserve[side],5);
  for(const side of [p,1-p])bits(s.pending[side],32);
  for(const side of [p,1-p]) { if(typeof s.houseOwned[side]!=='boolean')throw Error('Invalid house'); x.push(Number(s.houseOwned[side])); }
  x.push(Number(s.player===p),p,Number(s.phase==='mtaji'));
  if(x.length!==SPEC.encoding.dimensions)throw Error('Encoding dimension');
  return x;
}
const clip = v=>Math.max(-1,Math.min(1,v));
function finish(rawFn,s,p) { if(s.winner!==null)return s.winner===p?1000000:-1000000; return Math.trunc(1024*(clip(rawFn(encode(s,p)))-clip(rawFn(encode(s,1-p))))/2); }
function compile(model) {
  if(model.inputSize!==399)throw Error('Model dimension');
  if(model.kind==='logic') {
    let code='"use strict";\n'; let prev=[];
    model.layers.forEach((layer,l)=>{
      const names=Array.from({length:399},(_,i)=>`x[${i}]`).concat(prev);
      if(layer.a.length!==512||layer.b.length!==512||layer.gates.length!==512)throw Error('Gate width');
      prev=layer.a.map((a,i)=>{
        const b=layer.b[i],g=layer.gates[i],name=`g${l}_${i}`;
        if(!Number.isInteger(a)||!Number.isInteger(b)||!names[a]||!names[b]||!Number.isInteger(g)||g<0||g>15)throw Error('Gate model index');
        code+=`const ${name}=(${g} >>> ((${names[a]} << 1) | ${names[b]})) & 1;\n`;return name;
      });
    });
    if(model.layers.length!==3||model.weights.length!==512||![...model.weights,model.bias].every(Number.isSafeInteger))throw Error('Readout');
    code+=`return (${model.bias}${model.weights.map((w,i)=>`+(${w})*${prev[i]}`).join('')})/4096;`;
    const fn=new Function('x',code);
    return {evaluate:(s,p)=>finish(fn,s,p),raw:fn,codeBytes:Buffer.byteLength(code)};
  }
  if(model.kind==='linear') {
    if(model.weights.length!==399||![...model.weights,model.bias].every(Number.isSafeInteger))throw Error('Linear model');
    const fn=x=>(model.bias+model.weights.reduce((v,w,i)=>v+w*x[i],0))/4096;
    return {evaluate:(s,p)=>finish(fn,s,p),raw:fn};
  }
  if(model.kind==='mlp') {
    if(model.w1.length!==399||model.b1.length!==32||model.w2.length!==32||!Number.isFinite(model.b2)||model.w1.some(r=>r.length!==32||!r.every(Number.isFinite))||!model.b1.every(Number.isFinite)||!model.w2.every(Number.isFinite))throw Error('MLP model');
    const fn=x=>{const h=model.b1.slice();for(let i=0;i<399;i++)if(x[i])for(let j=0;j<32;j++)h[j]+=model.w1[i][j];return model.b2+h.reduce((v,h,j)=>v+Math.tanh(h)*model.w2[j],0);};
    return {evaluate:(s,p)=>finish(fn,s,p),raw:fn};
  }
  throw Error('Unknown model');
}
function referenceLogic(model,x) {
  let previous=[];
  for(const layer of model.layers) { const pool=x.concat(previous); previous=layer.gates.map((g,i)=>Math.floor(g/2**(2*pool[layer.a[i]]+pool[layer.b[i]]))%2); }
  return (model.bias+model.weights.reduce((v,w,i)=>v+w*previous[i],0))/4096;
}
function priorIdentities() {
  const rows=read(path.join(DOC,'KNOWN_IDENTITIES.json')).rows;
  for(const file of fs.readdirSync(OUT))if(file.endsWith('-source.json')) { const v=read(path.join(OUT,file)); rows.push(...v.rows,...v.audit); }
  return rows;
}
function select(name,config) {
  const B=load(), prior=priorIdentities(), seen={};
  for(const key of ['raw','prefix','trajectory'])seen[key]=new Set(prior.map(r=>r[key]).filter(Boolean));
  const perPhase=config.rootsPerPhase??config.pairsPerPhase;
  const counts={namua:0,mtaji:0}, rows=[], audit=[];
  for(let seed=config.seedBase;seed<config.seedBase+SPEC.population.blockSize&&(counts.namua<perPhase||counts.mtaji<perPhase);seed++) {
    const phase=(seed-config.seedBase)%2===0?'namua':'mtaji'; if(counts[phase]===perPhase)continue;
    append(path.join(OUT,'seed-access.jsonl'),{name,seed});
    let s=B.E.initialState(), chosen=null; const random=rng(seed), moves=[], keys=[];
    for(let ply=1;ply<=96&&s.winner===null;ply++) {
      const choices=B.E.moveVariants(s); if(!choices.length)throw Error('No legal source move');
      const m=choices[Math.floor(random()*choices.length)]; moves.push(m); keys.push(B.A.moveKey(m)); s=B.E.applyMove(s,m).state;
      const [min,max]=SPEC.population[phase+'Range'];
      if(!chosen&&s.winner===null&&s.phase===phase&&ply>=min&&ply<=max&&B.E.moveVariants(s).length>=2)chosen={state:s,ply};
    }
    const row={seed,phase,prefix:sha(keys.slice(0,12)),trajectory:sha(keys),raw:chosen?raw(chosen.state):null};
    const reason=!chosen?'no-root':['raw','prefix','trajectory'].find(k=>seen[k].has(row[k]));
    audit.push({...row,accepted:!reason,reason:reason||null});
    if(!reason) { rows.push({...row,...chosen,moves}); counts[phase]++; }
    for(const key of ['raw','prefix','trajectory'])if(row[key])seen[key].add(row[key]);
    append(path.join(OUT,`${name}-progress.jsonl`),{audit:audit.at(-1),row:reason?null:rows.at(-1)});
    if(rows.length&&rows.length%32===0&&!reason)console.log(JSON.stringify({stage:name,roots:rows.length}));
  }
  if(counts.namua!==perPhase||counts.mtaji!==perPhase)throw Error('Insufficient source block');
  const output={name,config,counts,rows,audit};write(path.join(OUT,name+'-source.json'),output);return rows;
}
function requireSupervision() { if(process.env.PBAI_P6_SUPERVISED!=='1')throw Error('Run the PBAI-P6 supervisor'); }
module.exports={ROOT,DOC,OUT,SPEC,read,sha,raw,rng,mean,median,quantile,write,append,load,options,encode,clip,finish,compile,referenceLogic,select,verifySources,requireSupervision};
