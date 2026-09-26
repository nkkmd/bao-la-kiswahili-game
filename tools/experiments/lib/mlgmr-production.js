"use strict";

const G = require("./gcld-production.js");

const AXES = G.AXES;
const DEFAULT_LAGS = Object.freeze([1, 2, 4, 8]);
const DEFAULT_RETURN_HORIZONS = Object.freeze([1, 2, 4]);

function need(value, message) {
  if (!value) throw new Error(message);
}

function coordinates(row) {
  need(row && row.representation && row.representation.coordinates, "representation coordinates missing");
  return row.representation.coordinates;
}

function validateRows(rows) {
  need(Array.isArray(rows) && rows.length === 15, "15 checkpoint rows required");
  for (let i = 0; i < rows.length; i++) {
    need(Number.isInteger(rows[i].ply), `row ${i} ply missing`);
    need(typeof rows[i].phase === "string" && rows[i].phase.length > 0, `row ${i} phase missing`);
    const c = coordinates(rows[i]);
    for (const axis of AXES) need(c[axis] && c[axis].defined === true, `row ${i} axis ${axis} undefined`);
    if (i > 0) need(rows[i].ply > rows[i - 1].ply, "checkpoint rows not strictly ordered");
  }
}

function signBetween(a, b, axis) {
  return G.sign(G.sub(coordinates(b)[axis], coordinates(a)[axis]));
}

function changeTable(rows) {
  validateRows(rows);
  const changes = [];
  for (let j = 0; j < rows.length - 1; j++) {
    const phaseCrossing = rows[j].phase !== rows[j + 1].phase;
    const signs = {};
    for (const axis of AXES) signs[axis] = phaseCrossing ? null : signBetween(rows[j], rows[j + 1], axis);
    changes.push({ index: j, fromPly: rows[j].ply, toPly: rows[j + 1].ply, phaseCrossing, signs });
  }
  return changes;
}

function samePhaseAcrossLagSpan(rows, startChangeIndex, lag) {
  const endRowIndex = startChangeIndex + lag + 1;
  need(startChangeIndex >= 0 && endRowIndex < rows.length, "lag span outside rows");
  const phase = rows[startChangeIndex].phase;
  for (let i = startChangeIndex + 1; i <= endRowIndex; i++) if (rows[i].phase !== phase) return false;
  return true;
}

function balanceSign(balance) {
  if (balance > 0) return "POSITIVE";
  if (balance < 0) return "NEGATIVE";
  return "ZERO";
}

function slotId(axis, lag) {
  return `${axis}-LAG${lag}`;
}

function lagSummary(rows, lags = DEFAULT_LAGS) {
  validateRows(rows);
  const changes = changeTable(rows);
  const slots = {};
  for (const axis of AXES) {
    for (const lag of lags) {
      need(Number.isInteger(lag) && lag > 0, `invalid lag ${lag}`);
      let sameCount = 0;
      let oppositeCount = 0;
      let zeroExcludedCount = 0;
      let phaseCrossingCensoredCount = 0;
      let windowCensoredCount = 0;
      for (let j = 0; j < changes.length; j++) {
        if (j + lag >= changes.length) {
          windowCensoredCount++;
          continue;
        }
        if (!samePhaseAcrossLagSpan(rows, j, lag)) {
          phaseCrossingCensoredCount++;
          continue;
        }
        const first = changes[j].signs[axis];
        const later = changes[j + lag].signs[axis];
        need(first !== null && later !== null, "same-phase span contains undefined sign");
        if (first === 0 || later === 0) {
          zeroExcludedCount++;
          continue;
        }
        if (first === later) sameCount++;
        else oppositeCount++;
      }
      const comparableNonzero = sameCount + oppositeCount;
      const balance = sameCount - oppositeCount;
      slots[slotId(axis, lag)] = {
        axis,
        lag,
        sameCount,
        oppositeCount,
        zeroExcludedCount,
        phaseCrossingCensoredCount,
        windowCensoredCount,
        comparableNonzero,
        balance,
        balanceSign: balanceSign(balance)
      };
    }
  }
  return { lags: [...lags], axes: [...AXES], slots };
}

function firstReversal(changes, axis) {
  for (let i = 0; i + 1 < changes.length; i++) {
    const a = changes[i];
    const b = changes[i + 1];
    if (a.phaseCrossing || b.phaseCrossing) continue;
    const first = a.signs[axis];
    const second = b.signs[axis];
    if (first === 0 || second === 0 || first === null || second === null) continue;
    if (first !== second) return { originIndex: i, reversalIndex: i + 1, originSign: first, reversedSign: second };
  }
  return null;
}

function returnSummary(rows, horizons = DEFAULT_RETURN_HORIZONS) {
  validateRows(rows);
  const changes = changeTable(rows);
  const byAxis = {};
  for (const axis of AXES) {
    const reversal = firstReversal(changes, axis);
    const horizonResults = {};
    for (const horizon of horizons) {
      need(Number.isInteger(horizon) && horizon > 0, `invalid return horizon ${horizon}`);
      if (!reversal) {
        horizonResults[String(horizon)] = { classification: "NO-FIRST-REVERSAL" };
        continue;
      }
      if (reversal.reversalIndex + horizon >= changes.length) {
        horizonResults[String(horizon)] = { classification: "NO-WINDOW" };
        continue;
      }
      let censored = false;
      let returned = false;
      for (let idx = reversal.reversalIndex + 1; idx <= reversal.reversalIndex + horizon; idx++) {
        const c = changes[idx];
        if (c.phaseCrossing || c.signs[axis] === null || c.signs[axis] === 0) {
          censored = true;
          break;
        }
        if (c.signs[axis] === reversal.originSign) returned = true;
      }
      horizonResults[String(horizon)] = {
        classification: censored ? "ZERO-OR-PHASE-CENSORED" : (returned ? "RETURN" : "STAY-REVERSED")
      };
    }
    byAxis[axis] = {
      firstReversal: reversal ? {
        originChangeIndex: reversal.originIndex,
        reversalChangeIndex: reversal.reversalIndex,
        originSign: reversal.originSign,
        reversedSign: reversal.reversedSign
      } : null,
      horizons: horizonResults
    };
  }
  return { horizons: [...horizons], axes: [...AXES], byAxis };
}

function contiguousPersistence(formalLabels, lags = DEFAULT_LAGS) {
  const out = {};
  for (const axis of AXES) {
    let max = null;
    for (const lag of lags) {
      const label = formalLabels[slotId(axis, lag)];
      if (label === "PERSISTENCE-CONFIRMED") max = lag;
      else break;
    }
    out[axis] = max === null ? "NONE" : max;
  }
  return out;
}

function formalSignTest(balances) {
  need(Array.isArray(balances), "balances must be array");
  return G.signTest(balances.map(value => {
    need(Number.isSafeInteger(value), "balance must be safe integer");
    return G.q(BigInt(value));
  }));
}

function summary(rows, lags = DEFAULT_LAGS, horizons = DEFAULT_RETURN_HORIZONS) {
  return {
    representationId: G.representationId,
    checkpointPlies: rows.map(row => row.ply),
    lag: lagSummary(rows, lags),
    return: returnSummary(rows, horizons)
  };
}

module.exports = {
  AXES,
  DEFAULT_LAGS,
  DEFAULT_RETURN_HORIZONS,
  changeTable,
  lagSummary,
  returnSummary,
  contiguousPersistence,
  formalSignTest,
  summary,
  slotId,
  representationId: G.representationId,
  canonical: G.canonical,
  digestCanonical: G.digestCanonical
};
