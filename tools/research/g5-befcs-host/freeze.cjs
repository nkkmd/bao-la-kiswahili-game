"use strict";
// 本技術fixtureだけの固定。科学登録ファイルを作成しない。
const fs = require('node:fs'), path = require('node:path'), cp = require('node:child_process');
const { hash } = require('../g5-befcs-workload/registry.cjs');
const root = path.resolve(__dirname, '../../..'), directory = 'doc/research-generation-5/befcs-host-20261013';
function save(name, files) {
  fs.writeFileSync(path.join(root, directory, name), JSON.stringify({ evidenceClass: 'TECHNICAL-HOST-PROTOCOL',
    scientificSeedsRead: 0, scientificLeaseCreated: false, scientificStudyRegistered: false,
    files: Object.fromEntries([...new Set(files)].sort().map(file => [file, hash(fs.readFileSync(path.join(root, file)))])) }, null, 2) + '\n');
}
if (process.argv[2] === '--inputs') {
  const prior = JSON.parse(fs.readFileSync(path.join(root, 'doc/research-generation-5/befcs-workload-20261013/PROTECTED_INPUTS_V2.json')));
  const tracked = cp.execFileSync('git', ['ls-files', 'doc/research-generation-5/befcs-workload-20261013'], { cwd: root, encoding: 'utf8' }).trim().split('\n');
  save('PROTECTED_INPUTS.json', [...Object.keys(prior.files), ...tracked]);
  const sources = fs.readdirSync(path.join(root, 'tools/research/g5-befcs-host')).map(f => 'tools/research/g5-befcs-host/' + f);
  save('SOURCE_MANIFEST.json', [...sources, 'test/g5-befcs-host.test.cjs', '.github/workflows/g5-befcs-host-preflight.yml', directory + '/TECHNICAL_CONTRACT.md', directory + '/PROTECTED_INPUTS.json',
    ...Object.keys(JSON.parse(fs.readFileSync(path.join(root, 'doc/research-generation-5/befcs-workload-20261013/SOURCE_MANIFEST_V2.json'))).files)]);
} else if (process.argv[2] === '--outputs') {
  save('OUTPUT_BINDING.json', [directory + '/results/RESULT.json', directory + '/results/TECHNICAL_EVIDENCE.json.gz']);
} else throw Error('TECHNICAL-FREEZE-MODE-REQUIRED');
