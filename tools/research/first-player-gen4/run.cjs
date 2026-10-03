'use strict';
const fs = require('node:fs');
const path = require('node:path');
const {performance} = require('node:perf_hooks');
const C = require('./common.cjs');
const {protocol: P, clone, canonical, sha, assert, atomic, engine, exchange, stateKey, opening, gameId, analyze} = C;
const accepted = new Set(['front-empty', 'no-move']);
function seal(record) { const v = clone(record); delete v.recordHash; return {...v, recordHash: sha(v)}; }
function replay(e, record) {
  const v = clone(record); delete v.recordHash; assert(sha(v) === record.recordHash, 'RECORD_HASH');
  let s = clone(record.startState);
  for (const row of record.turns) {
    assert(sha(s) === row.beforeHash && s.winner === null, 'REPLAY_BEFORE_HASH');
    assert(e.E.moveVariants(s).some(m => canonical(m) === canonical(row.move)), 'REPLAY_LEGAL');
    s = clone(e.E.applyMove(s, row.move).state);
    assert(sha(s) === row.afterHash, 'REPLAY_AFTER_HASH');
  }
  assert(canonical(s) === canonical(record.state), 'REPLAY_FINAL_STATE');
  if (record.complete) {
    const known = s.winner !== null && accepted.has(s.reason);
    assert(record.outcome.score === (known ? Number(s.winner === record.firstPlayer) : null), 'OUTCOME_SCORE');
  }
  return s;
}
async function play(e, o, condition, seat, dir, manifestHash, config = {}) {
  const id = gameId(o, condition, seat), file = path.join(dir, 'games', id + '.json');
  let record;
  if (fs.existsSync(file)) {
    record = JSON.parse(fs.readFileSync(file));
    assert(record.id === id && record.manifestHash === manifestHash && record.openingHash === o.hash, 'CHECKPOINT_IDENTITY');
    replay(e, record); if (record.complete) return record;
  } else {
    const start = seat ? exchange(o.state) : clone(o.state);
    record = {id, study: P.id, manifestHash, provenance: C.provenance(), phase: o.phase, policy: o.policy,
      requestedOpeningPlies: o.plies, slot: o.slot, seed: o.seed, openingHash: o.hash,
      openingStateHash: o.stateHash, openingMoves: o.moves, firstPlayer: seat, condition,
      startState: start, state: start, turns: [], complete: false, outcome: null};
  }
  const maxPlies = config.maxPlies ?? P.maxPlies;
  const previous = new Set([stateKey(record.startState)]);
  for (const row of record.turns) previous.add(row.afterRepetitionHash);
  let stop = null;
  while (record.state.winner === null && o.moves.length + record.turns.length < maxPlies) {
    const state = record.state;
    const choices = e.E.moveVariantsForSearch(state);
    assert(choices.length > 0, 'LIVE_STATE_NO_MOVE');
    const result = choices.length === 1 ? {move: clone(choices[0]), stats: {forced: true, elapsedMs: 0, completedDepth: 0, nodes: 0}}
      : (config.decide ? config.decide(state, condition) : analyze(e, state, condition));
    if (!result.stats.forced && condition !== 'G4E2000' && result.stats.completedDepth !== C.options(condition).maxDepth) {
      stop = 'fixed-depth-ceiling'; break;
    }
    assert(choices.some(m => canonical(m) === canonical(result.move)), 'DECISION_ILLEGAL');
    const applied = e.E.applyMoveForSearch(state, result.move), next = clone(applied.state);
    const repetitionHash = stateKey(next);
    record.turns.push({move: result.move, beforeHash: sha(state), afterHash: sha(next),
      afterRepetitionHash: repetitionHash, phase: state.phase, reserve: state.reserve,
      houseOwned: state.houseOwned, legalVariants: choices.length,
      captured: applied.events.filter(x => x.kind === 'capture').reduce((s, x) => s + x.count, 0),
      stats: {forced: result.stats.forced || false, completedDepth: result.stats.completedDepth,
        nodes: result.stats.nodes, elapsedMs: result.stats.elapsedMs, rootScore: result.stats.rootScore ?? null,
        timedOut: result.stats.timedOut || false, evaluationCandidate: result.stats.evaluationCandidate ?? null}});
    record.state = next;
    atomic(file, seal(record));
    await new Promise(resolve => setImmediate(resolve));
    if (next.winner === null && previous.has(repetitionHash)) { stop = 'repeated-state'; break; }
    previous.add(repetitionHash);
    if (config.pauseAfter && record.turns.length >= config.pauseAfter) return seal(record);
    if (config.deadline && performance.now() > config.deadline) return seal(record);
  }
  const known = record.state.winner !== null && accepted.has(record.state.reason);
  record.complete = true;
  record.outcome = {winner: record.state.winner, reason: known ? record.state.reason
    : record.state.reason || stop || 'max-plies', score: known ? Number(record.state.winner === seat) : null,
    totalPlies: o.moves.length + record.turns.length};
  record = seal(record); atomic(file, record);
  return record;
}
function taskList(phase, shard, family) {
  const rows = [];
  assert(['pilot', 'formal', 'sensitivity'].includes(phase), 'PHASE');
  assert(['all','fixed','expert-uniform','expert-top3'].includes(family), 'FAMILY');
  assert(Number.isInteger(shard) && shard >= 0 && shard < P.shards, 'SHARD');
  assert(phase === 'formal' || shard === 0, 'NONFORMAL_SHARD');
  for (const policy of P.policies) {
    const count = phase === 'pilot' ? P.pilotSlotsPerPolicy : phase === 'formal' ? P.formalSlotsPerPolicy : P.sensitivitySlotsPerDomain;
    const pliesList = phase === 'sensitivity' ? P.sensitivityOpeningPlies : [P.openingPlies];
    for (const plies of pliesList) for (let slot = 0; slot < count; slot++) {
      if (phase === 'formal' && slot % P.shards !== shard) continue;
      let conditions = phase === 'sensitivity' ? ['G4D4'] : P.conditions;
      if (phase === 'pilot') conditions = slot < P.pilotStrongSlotsPerPolicy ? ['G4D4', 'G4D6', 'G4E2000', 'G3D4'] : ['G4D4'];
      if (family === 'fixed') conditions = conditions.filter(c => c !== 'G4E2000');
      else if (family.startsWith('expert-')) {
        if (policy !== family.slice(7)) continue;
        conditions = conditions.filter(c => c === 'G4E2000');
      }
      for (const condition of conditions) for (const seat of [0, 1]) rows.push({phase, policy, plies, slot, condition, seat});
    }
  }
  // 奇偶で順序を反転し、固定した条件が常に先に実行されないようにする。
  return rows.sort((a,b) => a.slot - b.slot || sha(a).localeCompare(sha(b)));
}
async function run(phase, dir, shard = 0, family = 'all') {
  const manifest = C.checkFreeze(), manifestHash = sha(manifest), e = engine();
  const tasks = taskList(phase, shard, family), deadline = performance.now() + 220 * 60000;
  const start = performance.now(); let complete = 0;
  for (const t of tasks) {
    const o = opening(e, phase, t.policy, t.plies, t.slot);
    const record = await play(e, o, t.condition, t.seat, dir, manifestHash, {deadline});
    if (!record.complete) { console.log('CHECKPOINT-SAVED'); process.exitCode = 75; return; }
    complete++;
    if (complete % 8 === 0 || complete === tasks.length) console.log(JSON.stringify({phase, shard, family, complete, expected: tasks.length, seconds: Math.round((performance.now()-start)/1000)}));
  }
  atomic(path.join(dir, `completion-${phase}-${family}-${shard}.json`), {study: P.id, manifestHash, phase, shard, family, expected: tasks.length, complete, seconds: (performance.now()-start)/1000, provenance: C.provenance()});
}
async function diagnostic(dir) {
  const manifestHash = sha(C.checkFreeze()), e = engine(), results = [];
  const o = {phase: 'diagnostic', policy: 'standard', plies: 0, slot: 0, seed: null, moves: [], state: clone(e.E.initialState())};
  o.stateHash = sha(o.state); o.hash = sha({moves: [], state: o.state});
  for (const c of P.conditions) for (const seat of [0,1]) {
    const r = await play(e, o, c, seat, dir, manifestHash); results.push({id: r.id, condition: c, seat, outcome: r.outcome, trajectoryHash: sha(r.turns.map(x=>x.move))});
  }
  atomic(path.join(dir, 'diagnostic.json'), {study: P.id, independentSampleSize: 0, results});
}
if (require.main === module) {
  const [cmd, dir, shard, family] = process.argv.slice(2);
  (cmd === 'diagnostic' ? diagnostic(dir) : run(cmd, dir, Number(shard || 0), family || 'all'))
    .catch(err => {console.error(err.stack); process.exitCode=1;});
}
module.exports = {play, replay, seal, taskList, run, diagnostic};
