"use strict";
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),Storage=require('../g5-branch-envelope/storage.cjs');
function captureTree(root,limit,hooks={}){const files={},paths={},journals={},vanishedTemporaries=[];let used=0;
 function walk(directory){for(const name of fs.readdirSync(directory).sort()){assert.match(name,/^[A-Za-z0-9_.-]+$/);const file=path.join(directory,name);let stat;try{hooks.beforeStat?.(file);stat=fs.lstatSync(file);}catch(error){if(error.code==='ENOENT'&&name.endsWith('.tmp')){vanishedTemporaries.push(path.relative(root,file).split(path.sep).join('/'));continue;}throw error;}assert.ok(!stat.isSymbolicLink());if(stat.isDirectory()){walk(file);continue;}assert.ok(stat.isFile());const relative=path.relative(root,file).split(path.sep).join('/'),key='path-'+Buffer.from(relative).toString('hex');assert.ok(used+stat.size<=limit,'GLOBAL-CAPTURE-LIMIT');let bytes;try{hooks.beforeRead?.(file);bytes=fs.readFileSync(file);}catch(error){if(error.code==='ENOENT'&&name.endsWith('.tmp')){vanishedTemporaries.push(relative);continue;}throw error;}used+=bytes.length;assert.ok(used<=limit);files[key]=bytes;paths[key]=relative;
 if(name.endsWith('.jsonl')){const end=bytes.lastIndexOf(10)+1;const rows=end?Storage.replayJournal(bytes.subarray(0,end)):[];journals[key]={prefixBytes:end,rows:rows.length,tailBytes:bytes.length-end};}
 }}
 if(fs.existsSync(root))walk(root);files['COVERAGE.json']=Buffer.from(JSON.stringify({paths,journals,vanishedTemporaries,savedBytes:used,complete:false,solution:null,resumeAuthorized:false})+'\n');return {files,journals,used};
}
module.exports={captureTree};
