"use strict";

const assert = require("node:assert/strict");
const { reachableStates } = require("../tools/symmetry/generate-states.js");
const { verify } = require("../tools/symmetry/verify-transition-symmetry.js");

const result = verify(reachableStates(1000, 20260714), "D");
assert.equal(result.mismatches.length, 0);
assert.ok(result.transitions >= 1000);

console.log(`Transition symmetry tests passed (${result.transitions} transitions)`);
