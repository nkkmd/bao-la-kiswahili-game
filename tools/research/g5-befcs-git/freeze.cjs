"use strict";
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),{hash}=require('../g5-befcs-workload/registry.cjs');
const root=path.resolve(__dirname,'../../..'),docs='doc/research-generation-5/befcs-git-20261014',old='doc/research-generation-5/befcs-prefix-20261014';
function save(n,files){fs.mkdirSync(path.join(root,docs),{recursive:true});fs.writeFileSync(path.join(root,docs,n),JSON.stringify({evidenceClass:'TECHNICAL-AUTHENTICATED-GIT-FIXTURE',scientificSeedsRead:0,scientificLeaseCreated:false,scientificStudyRegistered:false,files:Object.fromEntries([...new Set(files)].sort().map(p=>[p,hash(fs.readFileSync(path.join(root,p)))]))},null,2)+'\n');}
if(process.argv[2]==='--inputs'){
 const protectedFiles=[...Object.keys(JSON.parse(fs.readFileSync(path.join(root,old,'PROTECTED_INPUTS.json'))).files),...Object.keys(JSON.parse(fs.readFileSync(path.join(root,old,'SOURCE_MANIFEST.json'))).files),...cp.execFileSync('git',['ls-files',old],{cwd:root,encoding:'utf8'}).trim().split('\n')];save('PROTECTED_INPUTS.json',protectedFiles);
 save('SOURCE_MANIFEST.json',[...fs.readdirSync(__dirname).map(n=>'tools/research/g5-befcs-git/'+n),'test/g5-befcs-git.test.cjs','.github/workflows/g5-befcs-git-preflight.yml',docs+'/TECHNICAL_CONTRACT.md',docs+'/PROTECTED_INPUTS.json',...protectedFiles]);
}else if(process.argv[2]==='--outputs')save('OUTPUT_BINDING.json',[docs+'/results/RESULT.json',docs+'/results/TECHNICAL_EVIDENCE.json.gz']);else throw Error('FREEZE-MODE-REQUIRED');
