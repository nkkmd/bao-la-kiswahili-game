"use strict";
const {fixture}=require("./fixtures.cjs"),config=require("../../../doc/research-generation-5/bfs-integration-20261013/CONFIG.json");
const mode=process.argv[2],id=process.argv[3];if(!["compact","reference"].includes(mode)||!config.benchmarkFixtures.includes(id))throw Error("Unregistered benchmark");
const C=require(mode==="compact"?"./compact.cjs":"./reference.cjs"),f=fixture(id,mode==="reference"),started=performance.now(),value=C.build(f,config),built=performance.now(),bytes=mode==="compact"?C.serialize(value):Buffer.from(JSON.stringify(value)),finished=performance.now();
console.log(JSON.stringify({mode,fixture:id,buildMs:built-started,serializeMs:finished-built,elapsedMs:finished-started,peakRssBytes:process.resourceUsage().maxRSS*1024,bytes:bytes.length,complete:mode==="compact"?value.domain.complete:value.complete}));
