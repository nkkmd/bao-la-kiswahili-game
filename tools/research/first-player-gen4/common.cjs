'use strict';
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const {performance} = require('node:perf_hooks');
const {execFileSync} = require('node:child_process');
const protocol = require('./protocol.json');
const ROOT = path.resolve(__dirname, '../../..');
const PUBLIC = ['engine', 'ai-weights', 'ai', 'ai-config', 'logic-evaluator', 'ai-candidate', 'ai-release'];
const SOURCE_FILES = PUBLIC.map(n => `public/${n}.js`).concat([
  'tools/research/first-player-gen4/protocol.json',
  'tools/research/first-player-gen4/common.cjs',
  'tools/research/first-player-gen4/run.cjs',
  'tools/research/first-player-gen4/aggregate.cjs',
  'tools/research/first-player-gen4/verify.py',
  'test/first-player-gen4.test.cjs',
  '.github/workflows/first-player-gen4.yml',
]);
const clone = v => JSON.parse(JSON.stringify(v));
const canonical = v => v === null || typeof v !== 'object' ? JSON.stringify(v)
  : Array.isArray(v) ? '[' + v.map(canonical).join(',') + ']'
  : '{' + Object.keys(v).sort().map(k => JSON.stringify(k) + ':' + canonical(v[k])).join(',') + '}';
const sha = v => crypto.createHash('sha256').update(typeof v === 'string' || Buffer.isBuffer(v) ? v : canonical(v)).digest('hex');
function assert(ok, message) { if (!ok) throw new Error(message); }
function atomic(file, value) {
  fs.mkdirSync(path.dirname(file), {recursive: true});
  const temp = `${file}.tmp-${process.pid}`;
  const fd = fs.openSync(temp, 'w');
  try { fs.writeFileSync(fd, JSON.stringify(value) + '\n'); fs.fsyncSync(fd); } finally { fs.closeSync(fd); }
  fs.renameSync(temp, file);
}
function rng(seed) {
  let v = seed >>> 0;
  return () => { v += 0x6D2B79F5; let n = Math.imul(v ^ v >>> 15, 1 | v);
    n ^= n + Math.imul(n ^ n >>> 7, 61 | n); return ((n ^ n >>> 14) >>> 0) / 4294967296; };
}
const seedFor = (...p) => parseInt(sha(p.join('\0')).slice(0, 8), 16) >>> 0;
function git(args) { return execFileSync('git', args, {cwd: ROOT, encoding: 'utf8'}).trim(); }
function sourceHashes() { return Object.fromEntries(SOURCE_FILES.map(f => [f, sha(fs.readFileSync(path.join(ROOT, f)))])); }
function checkFreeze() {
  const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, 'source-manifest.json')));
  assert(canonical(manifest.sources) === canonical(sourceHashes()), 'FROZEN_SOURCE_MISMATCH');
  return manifest;
}
function engine() {
  const c = vm.createContext({performance});
  for (const n of PUBLIC) vm.runInContext(fs.readFileSync(path.join(ROOT, 'public', n + '.js'), 'utf8'), c);
  assert(c.BaoReleaseConfig.GENERATION === 'AI-GEN4' && c.BaoReleaseConfig.displayIdentity('expert').evaluator === 'PBAI-C015-v1', 'RELEASE_IDENTITY');
  return {E: c.BaoEngine, A: c.BaoReleaseAI, C: c.BaoReleaseConfig, L: c.BaoLogicGate, context: c};
}
function exchange(s) {
  return {...clone(s), pits: clone([s.pits[1], s.pits[0]]), reserve: [s.reserve[1], s.reserve[0]],
    houseOwned: [s.houseOwned[1], s.houseOwned[0]], pending: [s.pending[1], s.pending[0]],
    player: 1 - s.player, winner: s.winner === null ? null : 1 - s.winner};
}
function stateKey(s) { const c = clone(s); delete c.turn; return sha(c); }
function options(c) {
  assert(protocol.conditions.includes(c), 'UNKNOWN_CONDITION');
  return {...engineOptions(), timeLimitMs: c === 'G4E2000' ? 2000 : protocol.fixedSearchCeilingMs,
    maxDepth: c === 'G4E2000' ? 12 : c === 'G4D6' ? 6 : 4,
    ...(c === 'G3D4' ? {pbaiC015LogicGate: false} : {})};
}
let cachedOptions;
function engineOptions() { return cachedOptions ||= engine().C.searchOptions('expert', {hardwareConcurrency: 4, deviceMemory: 4}); }
function analyze(e, state, condition) {
  const opt = options(condition), r = e.A.analyzeMove(clone(state), 'expert', () => 0.5, opt);
  if (condition !== 'G3D4') assert(r.stats.evaluationCandidate === 'PBAI-C015-v1' && r.stats.evaluationFallback === false, 'EVALUATOR_FALLBACK');
  assert(e.E.moveVariantsForSearch(state).some(m => canonical(m) === canonical(r.move)), 'ILLEGAL_AI_MOVE');
  return clone(r);
}
function opening(e, phase, policy, plies, slot) {
  assert(['pilot', 'formal', 'sensitivity'].includes(phase) && protocol.policies.includes(policy), 'DOMAIN');
  const seed = seedFor(protocol.seedNamespace, phase, policy, plies, slot), random = rng(seed);
  let state = e.E.initialState(); const moves = [];
  for (let p = 0; p < plies && state.winner === null; p++) {
    let pool = clone(e.E.moveVariantsForSearch(state)); assert(pool.length > 0, 'OPENING_NO_MOVE');
    if (policy === 'top3') {
      pool = pool.map(move => ({move, value: e.L.evaluate(e.E.applyMoveForSearch(state, move).state, state.player)}))
        .sort((a,b) => b.value - a.value || canonical(a.move).localeCompare(canonical(b.move))).slice(0, 3).map(r => r.move);
    }
    const move = pool[Math.floor(random() * pool.length)]; moves.push(move);
    state = clone(e.E.applyMoveForSearch(state, move).state);
  }
  return {phase, policy, plies, slot, seed, moves, state, hash: sha({moves, state}), stateHash: sha(state)};
}
function gameId(o, condition, seat) { return `${o.phase}-${o.policy}-${o.plies}-${String(o.slot).padStart(4, '0')}-${condition}-s${seat}`; }
function provenance() { return {sourceCommit: git(['rev-parse', 'HEAD']), node: process.version,
  runId: process.env.GITHUB_RUN_ID || null, attempt: process.env.GITHUB_RUN_ATTEMPT || null,
  platform: process.platform, arch: process.arch}; }
module.exports = {protocol, ROOT, PUBLIC, SOURCE_FILES, clone, canonical, sha, assert, atomic, rng, seedFor,
  git, sourceHashes, checkFreeze, engine, exchange, stateKey, options, analyze, opening, gameId, provenance};
