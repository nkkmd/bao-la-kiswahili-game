#!/usr/bin/env node
"use strict";
const fs=require('node:fs'),path=require('node:path');
const original=fs.readFileSync.bind(fs);
const ROOT=path.resolve(__dirname,'../..');
const DOC=path.join(ROOT,'doc/transposition-concentration-tree-graph-divergence');
const manifestPath=path.join(DOC,'prereg/UPSTREAM_IDENTITY_FIREWALL_V2.json');
const specV2Path=path.join(DOC,'prereg/STUDY_1_SPEC_V2.json');
const originalSpecPath=path.join(DOC,'prereg/STUDY_1_SPEC.json');
const upstream1=path.join(ROOT,'doc/local-game-tree-geometry-measurement-instrument-verification/results/stage-1/scientific-result.json');
const upstream2=path.join(ROOT,'doc/local-game-tree-geometry-measurement-instrument-verification/results/stage-2/scientific-result.json');
if(!fs.existsSync(manifestPath)||!fs.existsSync(specV2Path))throw new Error('technical refreeze v2 artifacts missing');
const manifestText=original(manifestPath,'utf8');
const manifest=JSON.parse(manifestText);
if(manifest.scientificOutcomeFieldsRetained!==false)throw new Error('identity firewall manifest retains scientific outcome fields');
const identityOnly=JSON.stringify({schemaVersion:1,purpose:'TCTGD-UPSTREAM-IDENTITY-ONLY',identityRecords:manifest.identityRecords});
fs.readFileSync=function(file,encoding){const p=path.resolve(String(file));if(p===path.resolve(originalSpecPath))return original(specV2Path,encoding||'utf8');if(p===path.resolve(upstream1)||p===path.resolve(upstream2))return encoding?identityOnly:Buffer.from(identityOnly,'utf8');return original(file,encoding);};
process.env.TCTGD_UPSTREAM_IDENTITY_ONLY_FIREWALL='true';
require('./run-tctgd-stage1-development.js');
