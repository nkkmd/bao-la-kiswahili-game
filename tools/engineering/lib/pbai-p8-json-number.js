"use strict";
const assert=require('node:assert/strict');
// JSON preserves finite numeric values, but serializes both signed zeros as 0.
// This comparison has no tolerance and never accepts null, NaN or Infinity.
function equalSavedNumber(saved,recomputed) {
  assert.ok(Number.isFinite(saved)&&Number.isFinite(recomputed),'Saved numeric value must be finite');
  assert.ok(saved===recomputed,`Saved numeric mismatch: ${saved} vs ${recomputed}`);
}
module.exports={equalSavedNumber};
