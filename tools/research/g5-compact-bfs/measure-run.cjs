"use strict";
const fs=require("node:fs"),path=require("node:path"),cp=require("node:child_process"),os=require("node:os"),assert=require("node:assert/strict"),{hash}=require("./journal.cjs"),{binding}=require("./run.cjs");
const root=path.resolve(__dirname,"../../.."),docs=path.join(root,"doc/research-generation-5/bfs-integration-20261013"),manifest=JSON.parse(fs.readFileSync(path.join(docs,"MEASUREMENT_MANIFEST.json")));
for(const[p,h]of Object.entries(manifest.files))assert.equal(hash(fs.readFileSync(path.join(root,p))),h,p);
const {config}=binding(),rows=[],started=performance.now();
for(const fixture of config.benchmarkFixtures)for(let repeat=1;repeat<=config.benchmarkRepeats;repeat++)for(const mode of ["compact","reference"]){
 assert.ok(performance.now()-started<config.maxTotalMs);const text=cp.execFileSync(process.execPath,["--require",path.join(__dirname,"rss-observer.cjs"),path.join(__dirname,"benchmark.cjs"),mode,fixture],{encoding:"utf8",timeout:config.maxDomainMs}),[row,rss]=text.trim().split("\n").map(JSON.parse);assert.equal(row.complete,true);assert.ok(rss.linuxVmHwmBytes<=config.maxRssBytes);rows.push({...row,...rss,repeat});
}
const value={technicalId:manifest.technicalId,inputManifestSha256:hash(fs.readFileSync(path.join(docs,"MEASUREMENT_MANIFEST.json"))),node:process.version,platform:process.platform,architecture:process.arch,cpuModel:os.cpus()[0]?.model,measureIncludes:"BFS-and-serialization-excludes-fsync-journal-solver-firewall",rows,scientificResourceImprovementEstablished:false};
fs.writeFileSync(path.join(docs,"results/PROCESS_MEASUREMENT.json"),JSON.stringify(value,null,2)+"\n");console.log(JSON.stringify({rows:rows.length,groups:config.benchmarkFixtures.map(f=>({fixture:f,modes:["compact","reference"].map(m=>({mode:m,linuxHwm:rows.filter(r=>r.fixture===f&&r.mode===m).map(r=>r.linuxVmHwmBytes),ruMaxRss:rows.filter(r=>r.fixture===f&&r.mode===m).map(r=>r.ruMaxRssBytes)}))}))}));
