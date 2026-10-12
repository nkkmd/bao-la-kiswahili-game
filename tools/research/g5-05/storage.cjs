"use strict";
const fs=require("node:fs"),path=require("node:path"),zlib=require("node:zlib"),M=require("../g5-01/measurement.cjs");
function atomic(file,value) {
 const fd=fs.openSync(file+".tmp","w");try{fs.writeFileSync(fd,JSON.stringify(value,null,2)+"\n");fs.fsyncSync(fd);}finally{fs.closeSync(fd);}fs.renameSync(file+".tmp",file);
}
function recorder(directory,technical,spec) {
 const file=path.join(directory,"STATE_READS.jsonl"),fd=fs.openSync(file,"wx"),ids=new Set(technical);let journalBytes=0;
 function observe(state,context) {
   const id=M.rawKey(state);if(ids.has(id))return;
   const line=JSON.stringify({id,state,context})+"\n";
   fs.writeSync(fd,line);fs.fsyncSync(fd);ids.add(id);journalBytes+=Buffer.byteLength(line);
   if(Buffer.byteLength(line)>4096)throw Error("STATE-RECORD-SIZE-CONTRACT");
 }
 function snapshot(evidence,meta,safetyCheck=true) {
   evidence.supplyReadIdentities=[...ids].sort();
   const bytes=Buffer.from(JSON.stringify(evidence)),combined=bytes.length+journalBytes;
   if(combined>spec.maxEvidenceBytes)throw Error("EVIDENCE-BYTE-LIMIT");
   const fd=fs.openSync(path.join(directory,"EVIDENCE.json.gz.tmp"),"w");
   try{fs.writeFileSync(fd,zlib.gzipSync(bytes));fs.fsyncSync(fd);}finally{fs.closeSync(fd);}
   fs.renameSync(path.join(directory,"EVIDENCE.json.gz.tmp"),path.join(directory,"EVIDENCE.json.gz"));
   atomic(path.join(directory,"CHECKPOINT.json"),{...meta,scientificSeedsRead:evidence.scientificSeedsRead,sourcesSaved:evidence.sources.length,domainsSaved:evidence.domains.length,
     activeSource:evidence.activeSource?.seed??null,activeDomain:evidence.activeDomain?.rootKey??null,
     rawEvidenceBytes:bytes.length,stateJournalBytes:journalBytes,combinedRawBytes:combined,complete:false,resumeAuthorized:false});
   if(safetyCheck&&combined>spec.maxEvidenceBytes-spec.storageReserveBytes)throw Error("EVIDENCE-RESERVE-LIMIT");
 }
 return {observe,snapshot,ids,get journalBytes(){return journalBytes;},close(){fs.closeSync(fd);}};
}
module.exports={atomic,recorder};
