"use strict";
const test = require('node:test'), assert = require('node:assert/strict');
const L = require('../tools/research/g5-befcs-lifecycle/ledger.cjs');
const { LIMITS } = require('../tools/research/g5-befcs-envelope/envelope.cjs');
function fixture() {
  let time = 0;
  const m = { scopeCreatedBeforeCheckout: true, controllerIncluded: true, scopeId: 'fixture-parent',
    hardMemoryBytes: LIMITS.maxRssBytes, swapMaxBytes: 0, coveredRoles: [...L.ROLES],
    memoryPeakBytes: 100, workspaceBytes: 100, remoteBytes: 0, accountingComplete: true };
  const ledger = L.create({ evidenceClass: 'TECHNICAL-WHOLE-LIFECYCLE-FIXTURE', scientificSeedsRead: 0, limits: { ...LIMITS } }, () => time, () => ({ ...m }));
  return { ledger, m, time(value) { time = value; } };
}
const receipt = () => ({ workStopped: true, allManagedChildrenStopped: true, durableReceipt: { sha256: 'a'.repeat(64), acknowledged: true } });
test('checkoutから保存ACKまで同じ時計を使用し科学条件を開放しない', () => {
  const f = fixture(); L.PHASES.forEach((p, n) => { f.time(n * 100); f.ledger.enter(p); });
  f.time(700); const r = f.ledger.finish(receipt());
  assert.equal(r.elapsedMs, 700); assert.equal(r.scientificExecutionAuthorized, false); assert.equal(r.wholeLifecycleOsProven, false);
  assert.throws(() => f.ledger.sample(), /CLOSED/);
});
test('checkoutの遅延も終了予約時間を消費する', () => {
  const f = fixture(); f.ledger.enter('checkout'); f.time(LIMITS.maxTotalMs - LIMITS.finalizationReserveMs);
  assert.throws(() => f.ledger.enter('prepare'), /FINALIZATION-RESERVE/);
  assert.equal(f.ledger.status, 'STOPPED');
});
test('保存ACKが全体期限に達した場合は完成扱いを拒否する', () => {
  const f = fixture(); L.PHASES.forEach(p => f.ledger.enter(p)); f.time(LIMITS.maxTotalMs);
  assert.throws(() => f.ledger.finish(receipt()), /DEADLINE/); assert.equal(f.ledger.status, 'STOPPED');
});
test('supervisorや転送の監督漏れ・後付けscopeを拒否する', () => {
  for (const change of [{ controllerIncluded: false }, { coveredRoles: L.ROLES.filter(r => r !== 'preserver') }, { scopeCreatedBeforeCheckout: false }]) {
    const f = fixture(); Object.assign(f.m, change); assert.throws(() => f.ledger.enter('checkout')); assert.equal(f.ledger.status, 'STOPPED');
  }
});
test('現在RSSが低くてもkernel peakの超過を保持する', () => {
  const f = fixture(); f.ledger.enter('checkout'); f.m.memoryPeakBytes = LIMITS.maxRssBytes + 1;
  assert.throws(() => f.ledger.sample(), /MEMORY-LIMIT/);
});
test('checkoutとremote保存の合算容量・終了予約域を検査する', () => {
  const f = fixture(); f.m.workspaceBytes = LIMITS.maxEvidenceBytes - LIMITS.storageReserveBytes; f.m.remoteBytes = 1;
  assert.throws(() => f.ledger.enter('checkout'), /STORAGE-LIMIT/);
});
test('時計逆行とscope切替を拒否する', () => {
  const f = fixture(); f.time(100); f.ledger.enter('checkout'); f.time(99); assert.throws(() => f.ledger.sample(), /CLOCK-REGRESSION/);
  const g = fixture(); g.ledger.enter('checkout'); g.m.scopeId = 'replacement'; assert.throws(() => g.ledger.sample(), /SCOPE-CHANGED/);
});
test('ACK欠落・停止未確認・途中phaseを完成へ昇格しない', () => {
  const f = fixture(); f.ledger.enter('checkout'); assert.throws(() => f.ledger.finish(receipt()), /NOT-PRESERVED/);
  for (const change of [{ workStopped: false }, { allManagedChildrenStopped: false }, { durableReceipt: { sha256: 'a'.repeat(64), acknowledged: false } }]) {
    const g = fixture(); L.PHASES.forEach(p => g.ledger.enter(p)); assert.throws(() => g.ledger.finish({ ...receipt(), ...change })); assert.equal(g.ledger.status, 'STOPPED');
  }
});
test('科学分類と予算変更を最初の測定より前に拒否する', () => {
  let touched = false;
  for (const config of [{ evidenceClass: 'SCIENCE', scientificSeedsRead: 0, limits: LIMITS }, { evidenceClass: 'TECHNICAL-WHOLE-LIFECYCLE-FIXTURE', scientificSeedsRead: 0, limits: { ...LIMITS, maxTotalMs: LIMITS.maxTotalMs + 1 } }])
    assert.throws(() => L.create(config, () => { touched = true; }, () => {}));
  assert.equal(touched, false);
});

test('kernel peakとremote累積量の巻戻しを拒否する', () => {
  for (const key of ['memoryPeakBytes', 'remoteBytes']) {
    const f = fixture(); f.m[key] = 100; f.ledger.enter('checkout'); f.m[key] = 99;
    assert.throws(() => f.ledger.sample(), /COUNTER-REGRESSION/);
  }
});
