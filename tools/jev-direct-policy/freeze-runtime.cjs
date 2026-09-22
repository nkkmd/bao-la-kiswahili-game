#!/usr/bin/env node
'use strict';
const fs=require('node:fs');
const path=require('node:path');
const C=require('./core.cjs');
const files=['core.cjs','live-ledger.cjs','live-client.cjs','stats.cjs','run.cjs','protocol.json','source-manifest.json'];
const design=path.join(__dirname,'design','openings.json');
C.assert(fs.existsSync(design),'OPENINGS_MISSING');const O=JSON.parse(fs.readFileSync(design,'utf8')),{openingsHash,...payload}=O;
C.assert(C.sha256(payload)===openingsHash&&openingsHash===C.protocol.openings.openingsHash,'OPENINGS_HASH_MISMATCH');
const hashes=Object.fromEntries(files.map(name=>[name,C.sha256(fs.readFileSync(path.join(__dirname,name)))]));
const unsigned={schema:'bao-jev-direct-policy-runtime-manifest-v1',studyId:C.protocol.id,protocolHash:C.sha256(C.protocol),openingsHash,files:hashes};
const manifest={...unsigned,manifestHash:C.sha256(unsigned)};
console.log(JSON.stringify(manifest,null,2));
