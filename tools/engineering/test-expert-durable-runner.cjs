'use strict';
// 新規棋力集団を使わず、別ジョブ間のチェックポイント受渡しと改ざん検出を確認する。
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const {execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'../..'),out=path.join(root,'artifacts/local/expert-runner-preflight');
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const sourceCommit=execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).trim();
const E=require('../../public/engine.js');
function validate(packet){const payload=JSON.parse(packet.payload);assert.equal(sha(packet.payload),packet.sha256);assert.equal(payload.sourceCommit,sourceCommit);assert.equal(payload.kind,'KNOWN-FIXTURE-TRANSPORT-ONLY');assert.equal(payload.strengthSeedsConsumed,false);assert.deepEqual(payload.next,E.applyMove(payload.state,payload.move).state);return payload;}
const mode=process.argv[2];fs.mkdirSync(out,{recursive:true});
if(mode==='produce'){
 const state=E.initialState(),move=E.moveVariants(state)[0],payload=JSON.stringify({kind:'KNOWN-FIXTURE-TRANSPORT-ONLY',sourceCommit,strengthSeedsConsumed:false,state,move,next:E.applyMove(state,move).state});
 const packet={payload,sha256:sha(payload)};validate(packet);
 fs.writeFileSync(path.join(out,'checkpoint.json'),JSON.stringify(packet)+'\n',{flag:'wx'});
 console.log(JSON.stringify({produced:true,sourceCommit,strengthSeedsConsumed:false}));
}else if(mode==='consume'){
 const packet=JSON.parse(fs.readFileSync(path.join(out,'checkpoint.json'),'utf8'));validate(packet);
 assert.throws(()=>validate({...packet,payload:packet.payload+' '}));
 const wrong=JSON.stringify({...JSON.parse(packet.payload),sourceCommit:'wrong'});assert.throws(()=>validate({payload:wrong,sha256:sha(wrong)}));
 fs.writeFileSync(path.join(out,'verification.json'),JSON.stringify({passed:true,sourceCommit,strengthSeedsConsumed:false,checks:['cross-job checkpoint hash','same source commit','known legal transition','tampering rejected','wrong provenance rejected'],scope:'infrastructure only; no P10 restart; not a 12-hour endurance test'})+'\n',{flag:'wx'});
 console.log(JSON.stringify({passed:true,sourceCommit,strengthSeedsConsumed:false}));
}else throw Error('Expected produce or consume');
