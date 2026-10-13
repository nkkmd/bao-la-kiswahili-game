"use strict";
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const Storage=require('../g5-branch-envelope/storage.cjs'),{Stop}=require('../g5-branch-envelope/source.cjs');
function diskBytes(root){let bytes=0;if(!fs.existsSync(root))return 0;for(const item of fs.readdirSync(root)){const f=path.join(root,item),s=fs.lstatSync(f);assert.ok(!s.isSymbolicLink(),'EVIDENCE-SYMLINK-REFUSED');if(s.isDirectory())bytes+=diskBytes(f);else{assert.ok(s.isFile());bytes+=s.size;}}return bytes;}
function sharedStore(root,limits){
 assert.ok(limits.maxEvidenceBytes>limits.storageReserveBytes&&limits.storageReserveBytes>0);fs.mkdirSync(root,{recursive:true});assert.equal(fs.readdirSync(root).length,0,'EXISTING-WORKLOAD-REFUSED');let peak=0;
 function capacity(extra,critical=false){const used=diskBytes(root),bound=limits.maxEvidenceBytes-(critical?0:limits.storageReserveBytes);assert.ok(Number.isSafeInteger(extra)&&extra>=0);if(used+extra>bound)throw new Stop(critical?'GLOBAL-EVIDENCE-BYTE-LIMIT':'GLOBAL-EVIDENCE-RESERVE-LIMIT',{used,extra,bound});peak=Math.max(peak,used+extra);}
 function create(name){assert.match(name,/^[A-Za-z0-9_-]+$/);const directory=path.join(root,name),store=Storage.store(directory,limits),journals=new Map();
 return {directory,get usedBytes(){return store.usedBytes;},append(file,record,critical=false){const j=journals.get(file)??{seq:0,previous:'0'.repeat(64)},body={seq:j.seq,previous:j.previous,record};capacity(Buffer.byteLength(JSON.stringify({...body,hash:Storage.hash(JSON.stringify(body))})+'\n'),critical);const row=store.append(file,record,critical);journals.set(file,{seq:j.seq+1,previous:row.hash});return row;},snapshot(file,value,critical=false){const bytes=Buffer.isBuffer(value)?value:Buffer.from(JSON.stringify(value)+'\n');capacity(bytes.length,critical);store.snapshot(file,value,critical);},close(){store.close();}};
 }
 return {root,create,capacity,get usedBytes(){return diskBytes(root);},get peakBytes(){return peak;}};
}
module.exports={sharedStore,diskBytes};
