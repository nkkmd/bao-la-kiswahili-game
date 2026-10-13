"use strict";
const fs=require('node:fs'),os=require('node:os'),path=require('node:path'),cp=require('node:child_process'),assert=require('node:assert/strict'),zlib=require('node:zlib');
const F=require('./fixture.cjs'),{hash}=require('../g5-branch-envelope/storage.cjs');
const root=path.resolve(__dirname,'../../..'),docs=path.join(root,'doc/research-generation-5/befcs-prefix-20261014');
function bindings(){for(const n of ['SOURCE_MANIFEST.json','PROTECTED_INPUTS.json'])for(const [p,h]of Object.entries(JSON.parse(fs.readFileSync(path.join(docs,n))).files))assert.equal(hash(fs.readFileSync(path.join(root,p))),h,p);return true;}
function replay(rows){for(const row of rows){const input={};for(const [key,value]of Object.entries(row.input))input[key]=key==='checkpoint'?value:Buffer.from(value,'base64');assert.deepEqual(F.validate(input),row.verification);assert.equal(row.scientificSeedsConsumed,0);}return true;}
function write(target=path.join(docs,'results')) {
  bindings();const directory=fs.mkdtempSync(path.join(os.tmpdir(),'befcs-prefix-'));const rows=[];
  try{for(const mode of F.modes){const d=path.join(directory,mode),child=cp.spawnSync(process.execPath,[path.join(__dirname,'fixture.cjs'),d,mode],{encoding:'utf8',timeout:30000});
    assert.equal(child.error,undefined);if(mode==='resource-stop')assert.equal(child.status,0,child.stderr);else assert.equal(child.signal,'SIGKILL',child.stderr);
    const value=F.input(d),verification=F.validate(value);const input=Object.fromEntries(Object.entries(value).map(([k,v])=>[k,k==='checkpoint'?v:v.toString('base64')]));
    rows.push({mode,signal:child.signal,exitCode:child.status,input,verification,scientificSeedsConsumed:0,scientificLeaseCreated:false,scientificStudyRegistered:false});}
    replay(rows);const bytes=Buffer.from(JSON.stringify(rows));fs.mkdirSync(target,{recursive:true});fs.writeFileSync(path.join(target,'TECHNICAL_EVIDENCE.json.gz'),zlib.gzipSync(bytes));
    const result={decision:'SAVED-SOURCE-PREFIX-FIXTURE-PASS-SCIENCE-GATES-PENDING',sourceManifestSha256:hash(fs.readFileSync(path.join(docs,'SOURCE_MANIFEST.json'))),evidenceSha256:hash(bytes),
      cases:rows.map(({mode,signal,exitCode,verification})=>({mode,signal,exitCode,verification})),scientificSeedsConsumed:0,scientificLeaseCreated:false,scientificStudyRegistered:false,
      conservativeReadIdentities:103355,formalRelationRegistered:false,publicAiChanged:false,scienceHostReleased:false};
    fs.writeFileSync(path.join(target,'RESULT.json'),JSON.stringify(result,null,2)+'\n');return result;
  }finally{fs.rmSync(directory,{recursive:true,force:true});}
}
function check(){bindings();const bytes=zlib.gunzipSync(fs.readFileSync(path.join(docs,'results/TECHNICAL_EVIDENCE.json.gz'))),result=JSON.parse(fs.readFileSync(path.join(docs,'results/RESULT.json')));assert.equal(hash(bytes),result.evidenceSha256);assert.equal(hash(fs.readFileSync(path.join(docs,'SOURCE_MANIFEST.json'))),result.sourceManifestSha256);replay(JSON.parse(bytes));return result;}
if(require.main===module){assert.ok(['--write','--check','--ci-fixture','--bindings'].includes(process.argv[2]));const result=process.argv[2]==='--bindings'?bindings():process.argv[2]==='--check'?check():write(process.argv[2]==='--ci-fixture'?path.join(root,'artifacts/local/befcs-prefix'):undefined);console.log(JSON.stringify(result));}
module.exports={write,check,replay,bindings};
