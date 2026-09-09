"use strict";
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const C=require('../tools/engineering/lib/pbai-p9-common'),{search}=require('../tools/engineering/lib/pbai-p9-search');
const dir=path.join(C.ROOT,'tools/engineering/browser/pbai-p9'),fixtures=require('../tools/engineering/browser/pbai-p9/fixtures.json');
test('既知9局面で毎手Workerの両評価器が固定参照と一致する',async()=>{
 for(const f of fixtures.rows)for(const actor of ['baseline','logic']){
  const r=await search(actor,f.state,f.seed,C.options(2,Infinity));const{elapsedMs,...stats}=r.stats;
  assert.equal(r.type,'result');assert.equal(r.id,f.seed);assert.equal(JSON.stringify({move:r.move,stats}),JSON.stringify(f.expected[actor]));
 }
});
test('静的生成したゲート評価器が参照実装と一致し、状態を変更しない',()=>{
 const text=fs.readFileSync(path.join(dir,'logic-evaluator.js'),'utf8');assert.ok(!/new Function|\beval\(/.test(text));
 const ctx=vm.createContext({});vm.runInContext(text,ctx);const old=C.compile(C.model());
 for(const f of fixtures.rows){const before=JSON.stringify(f.state);for(const p of [0,1])assert.equal(ctx.BaoLogicGate.evaluate(f.state,p),old.evaluate(f.state,p));assert.equal(JSON.stringify(f.state),before);}
 for(const name of ['engine.js','ai-weights.js','ai-config.js'])assert.equal(fs.readFileSync(path.join(dir,name),'utf8'),fs.readFileSync(path.join(C.ROOT,'public',name),'utf8'));
 assert.equal(fs.readFileSync(path.join(dir,'baseline-ai.js'),'utf8'),fs.readFileSync(path.join(C.ROOT,'public/ai.js'),'utf8'));
});
