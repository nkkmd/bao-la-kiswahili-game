"use strict";
const assert=require('node:assert/strict');
const CLASS='TECHNICAL-AUTHENTICATED-GIT-FIXTURE',MODES=['complete','stale-cas','lost-response','proxy-before-consume','proxy-final-mirror'];
function validate(c){assert.equal(c.evidenceClass,CLASS,'SCIENTIFIC-GIT-HOST-NOT-RELEASED');assert.equal(c.scientificSeedsRead,0);assert.equal(c.runAttempt,1);assert.match(c.runId,/^[1-9][0-9]*$/);assert.ok(MODES.includes(c.mode));return c;}
function fixtureRef(c){validate(c);return 'refs/heads/research/g5-git-fixture-'+c.runId+'-a1-'+c.mode;}
function remote(env){assert.equal(env.GITHUB_ACTIONS,'true');assert.equal(env.GITHUB_REPOSITORY,'nkkmd/bao-la-kiswahili-game');assert.equal(env.GITHUB_EVENT_NAME,'push');assert.equal(env.GITHUB_RUN_ATTEMPT,'1');assert.equal(env.GITHUB_REF,'refs/heads/research/g5-befcs-git-preflight');assert.match(env.GITHUB_RUN_ID,/^[1-9][0-9]*$/);assert.ok(env.BEFCS_GIT_TOKEN,'FIXTURE-TOKEN-MISSING');return 'https://github.com/nkkmd/bao-la-kiswahili-game.git';}
module.exports={CLASS,MODES,validate,fixtureRef,remote};
