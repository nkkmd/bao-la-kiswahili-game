"use strict";
const fs = require('node:fs'), path = require('node:path'), assert = require('node:assert/strict');
const LIMITS = Object.freeze({ maxTotalMs: 1200000, maxDomainMs: 180000,
  maxRssBytes: 1073741824, maxEvidenceBytes: 268435456, storageReserveBytes: 16777216,
  finalizationReserveMs: 180000 });
// 物理的な全作業領域を計数する。hard linkも各pathで数え、過少計数しない。
function disk(root) {
  let logical = 0, allocated = 0, files = 0;
  function visit(p) {
    const s = fs.lstatSync(p); assert.ok(!s.isSymbolicLink(), 'WORKSPACE-SYMLINK-REFUSED');
    allocated += s.blocks * 512;
    if (s.isDirectory()) for (const n of fs.readdirSync(p)) visit(path.join(p, n));
    else { assert.ok(s.isFile(), 'WORKSPACE-SPECIAL-FILE-REFUSED'); logical += s.size; files++; }
  }
  visit(root); return { logical, allocated, charged: Math.max(logical, allocated), files };
}
function createEnvelope(config, clock, measure) {
  assert.equal(config.evidenceClass, 'TECHNICAL-ENVELOPE-FIXTURE', 'SCIENTIFIC-ENVELOPE-NOT-RELEASED');
  assert.equal(config.scientificSeedsRead, 0);
  assert.deepEqual(config.limits, LIMITS, 'PROPOSED-LIMITS-MUST-NOT-CHANGE');
  const started = clock(); let state = 'ACTIVE', reason = null, remoteBytes = 0;
  const peak = { rss: 0, chargedBytes: 0 }; let reserved = 0;
  function stop(code) { if (state === 'ACTIVE') { state = 'STOPPED'; reason = code; } }
  function sample(phase = 'ordinary', extra = 0) {
    assert.ok(Number.isSafeInteger(extra) && extra >= 0);
    assert.ok(['ordinary', 'final'].includes(phase));
    if (state === 'FINISHED') throw Error('ENVELOPE-FINISHED-NO-RETRY');
    if (phase === 'ordinary' && state !== 'ACTIVE') throw Error('ENVELOPE-STOPPED-NO-RETRY');
    const elapsed = clock() - started, m = measure();
    assert.ok(Number.isFinite(elapsed) && elapsed >= 0 && Number.isSafeInteger(m.rss) && m.rss >= 0);
    assert.ok(Number.isSafeInteger(m.diskBytes) && m.diskBytes >= 0);
    const charged = m.diskBytes + remoteBytes + reserved + extra;
    peak.rss = Math.max(peak.rss, m.rss); peak.chargedBytes = Math.max(peak.chargedBytes, charged);
    let code = null;
    if (elapsed >= LIMITS.maxTotalMs) code = 'ENVELOPE-TOTAL-TIME-LIMIT';
    else if (m.rss > LIMITS.maxRssBytes) code = 'ENVELOPE-TOTAL-MEMORY-LIMIT';
    else if (charged > LIMITS.maxEvidenceBytes - (phase === 'ordinary' ? LIMITS.storageReserveBytes : 0)) code = 'ENVELOPE-TOTAL-STORAGE-LIMIT';
    else if (phase === 'ordinary' && elapsed >= LIMITS.maxTotalMs - LIMITS.finalizationReserveMs) code = 'ENVELOPE-FINALIZATION-RESERVE';
    if (code) { stop(code); throw Error(code); }
    return { elapsedMs: elapsed, remainingMs: LIMITS.maxTotalMs - elapsed, ...m, chargedBytes: charged };
  }
  function reserve(bytes, phase = 'ordinary') {
    sample(phase, bytes); reserved += bytes; let live = true;
    return () => { assert.ok(live, 'RESERVATION-ALREADY-RELEASED'); live = false; reserved -= bytes; };
  }
  function admitDomain() {
    const m = sample();
    if (m.remainingMs < LIMITS.maxDomainMs + LIMITS.finalizationReserveMs) {
      stop('ENVELOPE-INSUFFICIENT-DOMAIN-TIME'); throw Error(reason);
    }
    return clock();
  }
  function domainCheck(began) {
    sample(); if (clock() - began >= LIMITS.maxDomainMs) { stop('ENVELOPE-DOMAIN-TIME-LIMIT'); throw Error(reason); }
  }
  function transportTimeout(phase, maxMs = 30000) {
    const m = sample(phase), remaining = m.remainingMs - (phase === 'ordinary' ? LIMITS.finalizationReserveMs : 0);
    assert.ok(Number.isSafeInteger(maxMs) && maxMs > 0);
    return Math.max(1, Math.floor(Math.min(maxMs, remaining)));
  }
  function chargeRemote(bytes, phase = 'ordinary') {
    assert.ok(Number.isSafeInteger(bytes) && bytes >= remoteBytes, 'REMOTE-ACCOUNTING-MUST-BE-CUMULATIVE');
    sample(phase, bytes - remoteBytes); remoteBytes = bytes;
  }
  return { sample, reserve, admitDomain, domainCheck, transportTimeout, chargeRemote, stop,
    finish() { sample('final'); state = 'FINISHED'; },
    get status() { return state; }, get reason() { return reason; },
    get accounting() { return { ...peak, remoteBytes, outstandingReservations: reserved }; } };
}
module.exports = { LIMITS, disk, createEnvelope };
