"use strict";
const fs=require('node:fs'),path=require('node:path');
const C=require('./lib/pbai-p9-common.js'),O=require('./lib/pbai-p7-compiler.js');
const out=path.join(C.ROOT,'tools/engineering/browser/pbai-p9');
const write=(name,text)=>fs.writeFileSync(path.join(out,name),text);
const source=name=>fs.readFileSync(path.join(C.ROOT,'public',name),'utf8');
const once=(s,a,b)=>{if(s.split(a).length!==2)throw Error('Unique build anchor');return s.replace(a,b);};
for(const name of ['engine.js','ai-weights.js','ai-config.js'])write(name,source(name));
write('baseline-ai.js',source('ai.js'));
write('candidate-ai.js',once(source('ai.js'),'const rawEvaluator = evaluatorFor(','const rawEvaluator = options.pbaiC015LogicGate === true ? root.BaoLogicGate.evaluate : evaluatorFor('));
const model=O.compile(C.model());
write('logic-evaluator.js',`"use strict";\n(function(root){\n${O.validate.toString()}\nfunction raw(s,p){${model.code}}\nconst clip=v=>Math.max(-1,Math.min(1,v));\nfunction evaluate(s,p){if(s.winner!==null)return s.winner===p?1000000:-1000000;validate(s,p);return Math.trunc(1024*(clip(raw(s,p))-clip(raw(s,1-p)))/2);}\nroot.BaoLogicGate={evaluate,raw,modelSha256:${JSON.stringify(C.SPEC.modelSha256)}};\n})(typeof window==='undefined'?globalThis:window);\n`);
const seeded=`\n// Deterministic test transport; public search logic is unchanged.\nself.addEventListener('message',e=>{let a=e.data.seed>>>0;Math.random=()=>{a+=0x6D2B79F5;let t=a;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return ((t^(t>>>14))>>>0)/4294967296;};});\n`;
for(const actor of ['baseline','logic']){
 let s=once(source('ai-worker.js'),'"./ai.js"',actor==='logic'?'"./logic-evaluator.js", "./candidate-ai.js"':'"./baseline-ai.js"');
 s=once(s,'function runSearch(',seeded+'\nfunction runSearch(');
 if(actor==='logic')s=once(s,'message.options || {},','{ ...(message.options || {}), pbaiC015LogicGate: true },');
 write(actor+'-worker.js',s);
}
const B=C.load(true),old=C.compile(C.model());
const fixtures=[{name:'標準初期局面',state:B.E.initialState()},...require('../../test/tactical.test.js').tacticalCases.map(t=>({name:t.category,state:t.position}))];
const stable=a=>{const {elapsedMs,...stats}=a.stats;return {move:a.move,stats};};
for(const [i,r] of fixtures.entries()){
 r.seed=866000001+i;
 r.expected={baseline:stable(B.A.analyzeMove(r.state,'hard',C.rng(r.seed),C.options(2,Infinity))),logic:stable(B.A.analyzeMove(r.state,'hard',C.rng(r.seed),C.options(2,Infinity,old.evaluate)))};
}
write('fixtures.json',JSON.stringify({knownOnly:true,rows:fixtures})+'\n');
console.log(JSON.stringify({built:true,fixtures:fixtures.length,model:model.stats,runtimeDynamicCompilation:false}));
