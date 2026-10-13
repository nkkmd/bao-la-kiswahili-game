"use strict";
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path'),cp=require('node:child_process');
const {verify}=require('../tools/research/g5-befcs-remote-review/verify.cjs');
function archive(fn){const d=fs.mkdtempSync(path.join(os.tmpdir(),'saved-remote-tamper-'));try{const zip=path.resolve(__dirname,'../doc/research-generation-5/befcs-remote-joined-20261014/results-v2/host-oom/CI_ARTIFACT.zip');cp.execFileSync('python3',['-c','import zipfile,sys;zipfile.ZipFile(sys.argv[1]).extractall(sys.argv[2])',zip,d]);fn(d);}finally{fs.rmSync(d,{recursive:true,force:true});}}
test('生bundleの祖先ではないACKへ差し替えた記録を拒否する',()=>archive(d=>{assert.equal(verify(d).fixturePassed,true);const p=d+'/control/ACK-0.json',r=JSON.parse(fs.readFileSync(p));r.remoteCommit='0'.repeat(40);fs.writeFileSync(p,JSON.stringify(r));assert.throws(()=>verify(d));}));
test('原RESULTと異なるSCENARIOの技術完了への昇格を拒否する',()=>archive(d=>{const p=d+'/SCENARIO.json',r=JSON.parse(fs.readFileSync(p));r.technicalComplete=true;fs.writeFileSync(p,JSON.stringify(r));assert.throws(()=>verify(d));}));
