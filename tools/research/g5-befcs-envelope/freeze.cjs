"use strict";
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),crypto=require('node:crypto');
const base=path.resolve(__dirname,'../../..'),directory='doc/research-generation-5/befcs-envelope-20261013',old='doc/research-generation-5/befcs-pipeline-20261013';
function save(name,files){fs.writeFileSync(path.join(base,directory,name),JSON.stringify({evidenceClass:'TECHNICAL-ENVELOPE-FIXTURE',scientificSeedsRead:0,scientificLeaseCreated:false,scientificStudyRegistered:false,files:Object.fromEntries([...new Set(files)].sort().map(p=>[p,crypto.createHash('sha256').update(fs.readFileSync(path.join(base,p))).digest('hex')]))},null,2)+'\n');}
if(process.argv[2]!=='--inputs')throw Error('INPUT-FREEZE-REQUIRED');
const protectedFiles=Object.keys(JSON.parse(fs.readFileSync(path.join(base,old,'PROTECTED_INPUTS.json'))).files),priorDocs=cp.execFileSync('git',['ls-files',old],{cwd:base,encoding:'utf8'}).trim().split('\n');
save('PROTECTED_INPUTS.json',[...protectedFiles,...priorDocs,...Object.keys(JSON.parse(fs.readFileSync(path.join(base,old,'SOURCE_MANIFEST.json'))).files)]);
save('SOURCE_MANIFEST.json',[...fs.readdirSync(__dirname).map(n=>'tools/research/g5-befcs-envelope/'+n),'test/g5-befcs-envelope.test.cjs','.github/workflows/g5-befcs-envelope-preflight.yml',directory+'/TECHNICAL_CONTRACT.md',directory+'/PROTECTED_INPUTS.json',directory+'/results/REMOTE_TRANSPORT_RECEIPT.json',directory+'/results/CI_INITIAL_FAILURE.json',...Object.keys(JSON.parse(fs.readFileSync(path.join(base,old,'SOURCE_MANIFEST.json'))).files)]);
