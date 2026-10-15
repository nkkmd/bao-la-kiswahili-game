"use strict";
const test = require('node:test'), assert = require('node:assert/strict');
const { ownScope } = require('../tools/research/g5-befcs-lifecycle/os-fixture.cjs');
test('専用unit自身のcgroup以外を拒否する', () => {
  const unit = 'bao-g5-lifecycle-0123456789abcdef.service';
  assert.equal(ownScope(unit, '0::/system.slice/' + unit + '\n'), '/sys/fs/cgroup/system.slice/' + unit);
  for (const raw of ['0::/\n', '0::/system.slice/other.service\n', '0::/../' + unit, '0::/x/' + unit + '\n1:memory:/x'])
    assert.throws(() => ownScope(unit, raw));
  assert.throws(() => ownScope('existing-system.service', '0::/system.slice/existing-system.service'));
});
