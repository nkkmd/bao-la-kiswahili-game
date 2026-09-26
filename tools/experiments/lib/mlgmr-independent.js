"use strict";

const I = require("./gcld-independent.js");

const AXES = I.AXES;
const LAGS = Object.freeze([1, 2, 4, 8]);
const RETURN_HORIZONS = Object.freeze([1, 2, 4]);

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function coord(row, axis) {
  assert(row && row.representation && row.representation.coordinates, "missing representation");
  const value = row.representation.coordinates[axis];
  assert(value && value.defined === true, `undefined coordinate ${axis}`);
  return value;
}

function checkRows(rows) {
  assert(Array.isArray(rows), "rows not array");
  assert(rows.length === 15, "checkpoint count must be 15");
  let previousPly = -Infinity;
  for (const row of rows) {
    assert(Number.isInteger(row.ply) && row.ply > previousPly, "checkpoint order invalid");
    assert(typeof row.phase === "string" && row.phase.length > 0, "phase unavailable");
    for (let a = 0; a < AXES.length; a++) coord(row, AXES[a]);
    previousPly = row.ply;
  }
}

function deltaSign(rows, index, axis) {
  return I.sign(I.sub(coord(rows[index + 1], axis), coord(rows[index], axis)));
}

function buildChanges(rows) {
  checkRows(rows);
  const out = new Array(14);
  let i = 0;
  while (i < 14) {
    const crossing = rows[i].phase !== rows[i + 1].phase;
    const signs = {};
    for (let a = 0; a < AXES.length; a++) signs[AXES[a]] = crossing ? null : deltaSign(rows, i, AXES[a]);
    out[i] = { index: i, fromPly: rows[i].ply, toPly: rows[i + 1].ply, phaseCrossing: crossing, signs };
    i++;
  }
  return out;
}

function spanHasSinglePhase(rows, changeIndex, lag) {
  const last = changeIndex + lag + 1;
  assert(changeIndex >= 0 && last < rows.length, "span out of bounds");
  for (let r = changeIndex + 1; r <= last; r++) if (rows[r].phase !== rows[changeIndex].phase) return false;
  return true;
}

function labelBalance(n) {
  return n === 0 ? "ZERO" : (n > 0 ? "POSITIVE" : "NEGATIVE");
}

function makeSlotId(axis, lag) {
  return axis + "-LAG" + lag;
}

function summarizeLags(rows, lags = LAGS) {
  checkRows(rows);
  const changes = buildChanges(rows);
  const slots = {};
  for (let ai = 0; ai < AXES.length; ai++) {
    const axis = AXES[ai];
    for (let li = 0; li < lags.length; li++) {
      const lag = lags[li];
      assert(Number.isInteger(lag) && lag > 0, "bad lag");
      const count = { same: 0, opposite: 0, zero: 0, phase: 0, window: 0 };
      let j = 0;
      while (j < changes.length) {
        const laterIndex = j + lag;
        if (laterIndex >= changes.length) {
          count.window++;
          j++;
          continue;
        }
        if (!spanHasSinglePhase(rows, j, lag)) {
          count.phase++;
          j++;
          continue;
        }
        const x = changes[j].signs[axis];
        const y = changes[laterIndex].signs[axis];
        assert(x !== null && y !== null, "undefined sign in same-phase span");
        if (x === 0 || y === 0) count.zero++;
        else if (x === y) count.same++;
        else count.opposite++;
        j++;
      }
      const comparable = count.same + count.opposite;
      const balance = count.same - count.opposite;
      slots[makeSlotId(axis, lag)] = {
        axis,
        lag,
        sameCount: count.same,
        oppositeCount: count.opposite,
        zeroExcludedCount: count.zero,
        phaseCrossingCensoredCount: count.phase,
        windowCensoredCount: count.window,
        comparableNonzero: comparable,
        balance,
        balanceSign: labelBalance(balance)
      };
    }
  }
  return { lags: Array.from(lags), axes: Array.from(AXES), slots };
}

function locateFirstReversal(changes, axis) {
  let i = 0;
  while (i + 1 < changes.length) {
    const left = changes[i];
    const right = changes[i + 1];
    if (!left.phaseCrossing && !right.phaseCrossing) {
      const a = left.signs[axis];
      const b = right.signs[axis];
      if (a !== null && b !== null && a !== 0 && b !== 0 && a !== b) {
        return { originIndex: i, reversalIndex: i + 1, originSign: a, reversedSign: b };
      }
    }
    i++;
  }
  return null;
}

function summarizeReturn(rows, horizons = RETURN_HORIZONS) {
  checkRows(rows);
  const changes = buildChanges(rows);
  const byAxis = {};
  for (const axis of AXES) {
    const rev = locateFirstReversal(changes, axis);
    const horizonRows = {};
    for (const h of horizons) {
      assert(Number.isInteger(h) && h > 0, "bad return horizon");
      if (rev === null) {
        horizonRows[String(h)] = { classification: "NO-FIRST-REVERSAL" };
        continue;
      }
      const lastIndex = rev.reversalIndex + h;
      if (lastIndex >= changes.length) {
        horizonRows[String(h)] = { classification: "NO-WINDOW" };
        continue;
      }
      let bad = false;
      let cameBack = false;
      let k = rev.reversalIndex + 1;
      while (k <= lastIndex) {
        const change = changes[k];
        const sign = change.signs[axis];
        if (change.phaseCrossing || sign === null || sign === 0) {
          bad = true;
          break;
        }
        if (sign === rev.originSign) cameBack = true;
        k++;
      }
      horizonRows[String(h)] = { classification: bad ? "ZERO-OR-PHASE-CENSORED" : (cameBack ? "RETURN" : "STAY-REVERSED") };
    }
    byAxis[axis] = {
      firstReversal: rev === null ? null : {
        originChangeIndex: rev.originIndex,
        reversalChangeIndex: rev.reversalIndex,
        originSign: rev.originSign,
        reversedSign: rev.reversedSign
      },
      horizons: horizonRows
    };
  }
  return { horizons: Array.from(horizons), axes: Array.from(AXES), byAxis };
}

function deriveContiguous(labels, lags = LAGS) {
  const result = {};
  for (let a = 0; a < AXES.length; a++) {
    const axis = AXES[a];
    let value = "NONE";
    for (let i = 0; i < lags.length; i++) {
      const lag = lags[i];
      if (labels[makeSlotId(axis, lag)] !== "PERSISTENCE-CONFIRMED") break;
      value = lag;
    }
    result[axis] = value;
  }
  return result;
}

function signTestFromBalances(values) {
  assert(Array.isArray(values), "balances not array");
  const fractions = [];
  for (let i = 0; i < values.length; i++) {
    assert(Number.isSafeInteger(values[i]), "balance not safe integer");
    fractions.push(I.q(BigInt(values[i])));
  }
  return I.signTest(fractions);
}

function summarize(rows, lags = LAGS, horizons = RETURN_HORIZONS) {
  return {
    representationId: I.representationId,
    checkpointPlies: rows.map(r => r.ply),
    lag: summarizeLags(rows, lags),
    return: summarizeReturn(rows, horizons)
  };
}

module.exports = {
  AXES,
  DEFAULT_LAGS: LAGS,
  DEFAULT_RETURN_HORIZONS: RETURN_HORIZONS,
  changeTable: buildChanges,
  lagSummary: summarizeLags,
  returnSummary: summarizeReturn,
  contiguousPersistence: deriveContiguous,
  formalSignTest: signTestFromBalances,
  summary: summarize,
  slotId: makeSlotId,
  representationId: I.representationId,
  canonical: I.canonical,
  digestCanonical: I.digestCanonical
};
