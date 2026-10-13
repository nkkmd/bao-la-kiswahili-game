"use strict";
const fs=require('node:fs');
const [group,root,mode,directory]=process.argv.slice(2);
const assert=require('node:assert/strict'),path=require('node:path'),{ownCgroup,MODES}=require('./policy.cjs');
assert.ok(MODES.includes(mode));ownCgroup(path.basename(root),'0::'+root.slice('/sys/fs/cgroup'.length));assert.equal(group,root+'/watch');
assert.equal(fs.readFileSync('/proc/self/cgroup','utf8').trim(),'0::'+root.slice('/sys/fs/cgroup'.length)+'/control');
fs.writeFileSync(group+'/cgroup.procs',String(process.pid));
const started=performance.now(),records=[];
function save(){const fd=fs.openSync(directory+'/WATCH.json','w');try{fs.writeFileSync(fd,JSON.stringify({records,elapsedMs:performance.now()-started,scientificSeedsRead:0})+'\n');fs.fsyncSync(fd);}finally{fs.closeSync(fd);}}
function kill(name,reason){fs.writeFileSync(root+'/'+name+'/cgroup.kill','1');records.push({target:name,reason,atMs:performance.now()-started});save();}
const ordinary=setTimeout(()=>kill('work','ORDINARY-DEADLINE'),5000);
const total=setTimeout(()=>{kill('work','TOTAL-DEADLINE');kill('control','TOTAL-DEADLINE');clearInterval(poll);save();process.exit(0);},15000);
const poll=setInterval(()=>{
 if(mode==='observer-oom'&&fs.existsSync(directory+'/OBSERVER_STARTED.json')&&Number(fs.readFileSync(root+'/control/memory.events','utf8').match(/^oom_kill (\d+)$/m)[1])>0){kill('work','OBSERVER-OOM-NO-RESUME');clearTimeout(ordinary);clearTimeout(total);clearInterval(poll);save();process.exit(0);}
 if(fs.existsSync(directory+'/OBSERVER_DONE.json')){clearTimeout(ordinary);clearTimeout(total);clearInterval(poll);save();process.exit(0);}
},20);
save();
