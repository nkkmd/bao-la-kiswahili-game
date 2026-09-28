'use strict';

const assert = require('node:assert/strict');

function replaceOnce(source, before, after, label) {
  const first = source.indexOf(before);
  assert.notEqual(first, -1, `PBAI-P14 instrumentation anchor missing: ${label}`);
  assert.equal(source.indexOf(before, first + 1), -1, `PBAI-P14 instrumentation anchor not unique: ${label}`);
  return source.slice(0, first) + after + source.slice(first + before.length);
}

function instrumentEngine(source) {
  let result = source;

  result = replaceOnce(
    result,
    '  function applyMove(source, move, recording) {\n    const state = clone(source);',
    '  function applyMove(source, move, recording) {\n    if (root.__pbaiP14Diagnostics) root.__pbaiP14Diagnostics.applyMoveCalls += 1;\n    const state = clone(source);',
    'applyMove counter',
  );

  result = replaceOnce(
    result,
    '        const b = applyMove(state, use, recording).state;\n        return JSON.stringify(a) === JSON.stringify(b) ? [move] : [stop, use];',
    `        const b = applyMove(state, use, recording).state;
        const sameAfterState = JSON.stringify(a) === JSON.stringify(b);
        const diagnostics = root.__pbaiP14Diagnostics;
        if (diagnostics) {
          diagnostics.namuaCaptureVariantInputs += 1;
          if (sameAfterState) diagnostics.collapsedStopUsePairs += 1;
          else diagnostics.splitStopUsePairs += 1;
        }
        return sameAfterState ? [move] : [stop, use];`,
    'Namua stop/use comparison',
  );

  return result;
}

module.exports = { instrumentEngine };
