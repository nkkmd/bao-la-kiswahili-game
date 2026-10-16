"use strict";
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto'),zlib=require('node:zlib');
const {Transform}=require('node:stream'),{pipeline}=require('node:stream/promises');
const MAX_ARCHIVE=16*1024*1024,IMAGE_BYTES=192*1024*1024;
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
function manifestValid(m){
 assert.equal(m.evidenceClass,'TECHNICAL-RUNTIME-CAPSULE');assert.equal(m.scientificSeedsRead,0);assert.equal(m.finalScientificInputSet,false);
 assert.match(m.sourceCommit,/^[a-f0-9]{40}$/);assert.ok(m.files.length>0);const seen=new Set();let total=0;
 for(const f of m.files){assert.ok(typeof f.path==='string'&&!path.isAbsolute(f.path)&&!f.path.split('/').some(x=>!x||x==='.'||x==='..'));
 assert.ok(f.path.startsWith('tools/')||(f.path.startsWith('public/')&&f.path.split('/').length===2&&f.path.endsWith('.js')));
 assert.ok(!seen.has(f.path));seen.add(f.path);assert.ok(['100644','100755'].includes(f.mode));assert.match(f.gitBlob,/^[a-f0-9]{40}$/);assert.match(f.sha256,/^[a-f0-9]{64}$/);
 assert.ok(Number.isSafeInteger(f.bytes)&&f.bytes>=0);total+=f.bytes;}
 assert.equal(total,m.totalBytes);assert.ok(total<=32*1024*1024);return true;
}
function verifyCode(root,m){manifestValid(m);for(const f of m.files){const p=path.join(root,f.path),s=fs.lstatSync(p);assert.ok(s.isFile()&&!s.isSymbolicLink());const b=fs.readFileSync(p);
 assert.equal(b.length,f.bytes);assert.equal(hash(b),f.sha256,f.path);assert.equal(crypto.createHash('sha1').update(Buffer.concat([Buffer.from('blob '+b.length+'\0'),b])).digest('hex'),f.gitBlob);assert.equal(Boolean(s.mode&0o100),f.mode==='100755');}
 return {files:m.files.length,bytes:m.totalBytes,sourceCommit:m.sourceCommit};}
async function seal(image,destination,maxBytes=MAX_ARCHIVE){
 assert.ok(Number.isSafeInteger(maxBytes)&&maxBytes>0&&maxBytes<=MAX_ARCHIVE);let compressed=0,raw=0;const h=crypto.createHash('sha256'),a=crypto.createHash('sha256');
 const tap=new Transform({transform(b,e,cb){raw+=b.length;h.update(b);cb(null,b);}}),limit=new Transform({transform(b,e,cb){if(compressed+b.length>maxBytes)return cb(Error('ARCHIVE-BYTE-LIMIT'));compressed+=b.length;a.update(b);cb(null,b);}});
 await pipeline(fs.createReadStream(image),tap,zlib.createGzip({level:6}),limit,fs.createWriteStream(destination,{flags:'wx',mode:0o600}));
 return {rawBytes:raw,imageSha256:h.digest('hex'),archiveBytes:compressed,archiveSha256:a.digest('hex')};
}
function payloadValid(bytes,meta){assert.ok(Buffer.isBuffer(bytes)&&bytes.length<=MAX_ARCHIVE);assert.equal(bytes.length,meta.archiveBytes);assert.equal(hash(bytes),meta.archiveSha256);assert.equal(meta.rawBytes,IMAGE_BYTES);assert.match(meta.imageSha256,/^[a-f0-9]{64}$/);assert.equal(meta.scientificSeedsRead,0);assert.equal(meta.evidenceClass,'TECHNICAL-SEALED-RUNTIME-IMAGE');assert.equal(meta.finalScientificInputSet,false);assert.equal(meta.sourceCommit,'484e3f659480a21fec2009fd4a355f9323191c17');assert.match(meta.sourceManifestSha256,/^[a-f0-9]{64}$/);}
module.exports={MAX_ARCHIVE,IMAGE_BYTES,hash,manifestValid,verifyCode,seal,payloadValid};
