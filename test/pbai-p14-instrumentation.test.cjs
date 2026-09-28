'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const { instrumentEngine } = require('../tools/engineering/lib/pbai-p14-instrument.cjs');

const source = fs.readFileSync('public/engine.js', 'utf8');

function load(engineSource, diagnostics = null) {
  const context = vm.createContext({ performance, __pbaiP14Diagnostics: diagnostics });
  context.self = context;
  vm.runInContext(engineSource, context, { filename: 'engine.js' });
  return context.BaoEngine;
}

test('PBAI-P14 instrumentation counts transitions without changing initial legal results', () => {
  const diagnostics = { applyMoveCalls: 0, namuaCaptureVariantInputs: 0,
    collapsedStopUsePairs: 0, splitStopUsePairs: 0 };
  const baseline = load(source);
  const measured = load(instrumentEngine(source), diagnostics);
  const initial = baseline.initialState();
  const baselineMoves = baseline.moveVariants(initial);
  const measuredMoves = measured.moveVariants(initial);
  assert.deepEqual(JSON.parse(JSON.stringify(measuredMoves)), JSON.parse(JSON.stringify(baselineMoves)));
  const baselineResult = baseline.applyMove(initial, baselineMoves[0]);
  const measuredResult = measured.applyMove(initial, baselineMoves[0]);
  assert.deepEqual(JSON.parse(JSON.stringify(measuredResult)), JSON.parse(JSON.stringify(baselineResult)));
  assert.equal(diagnostics.applyMoveCalls, 1);
  assert.equal(diagnostics.namuaCaptureVariantInputs, 0);
});

test('PBAI-P14 instrumentation preserves and counts Namua stop/use expansion', () => {
  const diagnostics = { applyMoveCalls: 0, namuaCaptureVariantInputs: 0,
    collapsedStopUsePairs: 0, splitStopUsePairs: 0 };
  const baseline = load(source);
  const measured = load(instrumentEngine(source), diagnostics);
  let found = null;
  for (let seed = 1; seed <= 64 && !found; seed += 1) {
    let state = baseline.initialState();
    let value = seed >>> 0;
    const random = () => {
      value = (value + 1831565813) >>> 0;
      let z = Math.imul(value ^ (value >>> 15), value | 1);
      z = (z ^ (z + Math.imul(z ^ (z >>> 7), z | 61))) >>> 0;
      return ((z ^ (z >>> 14)) >>> 0) / 4294967296;
    };
    for (let ply = 0; ply < 128 && state.winner === null; ply += 1) {
      const moves = baseline.moveVariants(state);
      if (state.phase === 'namua' && moves.some(move => move.type === 'capture')) {
        found = state;
        break;
      }
      if (!moves.length) break;
      state = baseline.applyMove(state, moves[Math.floor(random() * moves.length)]).state;
    }
  }
  assert.ok(found, 'test fixture generation should find a Namua capture state');
  const baselineMoves = baseline.moveVariants(found);
  const measuredMoves = measured.moveVariants(found);
  assert.deepEqual(JSON.parse(JSON.stringify(measuredMoves)), JSON.parse(JSON.stringify(baselineMoves)));
  assert.ok(diagnostics.applyMoveCalls >= 2);
  assert.ok(diagnostics.namuaCaptureVariantInputs > 0);
  assert.equal(diagnostics.collapsedStopUsePairs + diagnostics.splitStopUsePairs,
    diagnostics.namuaCaptureVariantInputs);
});
