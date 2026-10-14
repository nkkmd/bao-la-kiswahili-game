"use strict";
const assert=require('node:assert/strict'),J=require('../g5-befcs-joined/policy.cjs');
const CLASS='TECHNICAL-REMOTE-STOP-V3-128-FIXTURE',MODES=['complete','host-oom','lost-response','deadline','proxy-final-mirror'];
function config(mode,runId){return {evidenceClass:CLASS,scientificSeedsRead:0,count:128,mode,runId,runAttempt:1,limits:{...J.LIMITS},partitions:{...J.PARTITIONS},stopLeadMs:1000};}
function validate(c){assert.equal(c.evidenceClass,CLASS,'SCIENTIFIC-REMOTE-JOINED-HOST-NOT-RELEASED');assert.equal(c.scientificSeedsRead,0);assert.equal(c.count,128);assert.equal(c.runAttempt,1);assert.match(c.runId,/^[1-9][0-9]*$/);assert.ok(MODES.includes(c.mode));assert.deepEqual(c.limits,J.LIMITS);assert.deepEqual(c.partitions,J.PARTITIONS);assert.equal(c.stopLeadMs,1000);return c.mode==='deadline'?{totalMs:30000,reserveMs:10000}:{totalMs:J.LIMITS.maxTotalMs,reserveMs:J.LIMITS.finalizationReserveMs};}
function ref(c){validate(c);return 'refs/heads/research/g5-remote-stop-v3-'+c.runId+'-a1-'+c.mode;}
function remote(env){assert.equal(env.GITHUB_ACTIONS,'true');assert.equal(env.GITHUB_REPOSITORY,'nkkmd/bao-la-kiswahili-game');assert.equal(env.GITHUB_EVENT_NAME,'push');assert.equal(env.GITHUB_RUN_ATTEMPT,'1');assert.equal(env.GITHUB_REF,'refs/heads/research/g5-befcs-remote-stop-v3-preflight');assert.match(env.GITHUB_RUN_ID,/^[1-9][0-9]*$/);assert.ok(env.BEFCS_GIT_TOKEN);return 'https://github.com/nkkmd/bao-la-kiswahili-game.git';}
module.exports={CLASS,MODES,config,validate,ref,remote,LIMITS:J.LIMITS,PARTITIONS:J.PARTITIONS,ownCgroup:J.ownCgroup};
