"use strict";

const assert = require("node:assert/strict");
const E = require("../public/engine.js");
const Validator = require("../tools/experiments/validate-pcem-stage1-spec.js");
const P = require("../tools/experiments/lib/practical-comeback-stage0-production.js");
const Measurement = require("../tools/experiments/lib/practical-comeback-stage1-measurement.js");
const Independent = require("../tools/experiments/lib/practical-comeback-stage1-independent-core.js");
const IndependentDiscovery = require("../tools/experiments/lib/practical-comeback-stage1-independent-discovery.js");

const loaded = Validator.loadValidated();
assert.equal(loaded.spec.status, "prospective-frozen-not-authorized");
assert.equal(loaded.spec.scientificInferenceAuthorized, false);
assert.equal(loaded.spec.population.seedStart, 23200001);
assert.equal(loaded.spec.stage2Reservation.stage1MayConsume, false);
assert.ok(IndependentDiscovery && typeof IndependentDiscovery.discover === "function");

const technicalRoot = E.initialState();
const legal = P.exactLegalMoves(technicalRoot);
assert.ok(legal.length >= 2);
const reply = Measurement.replyAnalysis(technicalRoot, legal[0], loaded.spec);
assert.equal(reply.rootMoveKey, P.normalizeMove ? P.canonicalHash ? reply.rootMoveKey : reply.rootMoveKey : reply.rootMoveKey);
assert.equal(reply.legalReplyCount, reply.legalReplyMoveKeys.length);

const prodD1 = P.referenceSearch(technicalRoot, 1);
const indepD1 = Independent.referenceSearch(technicalRoot, 1);
assert.deepEqual(indepD1, prodD1);
assert.equal(Independent.canonicalHash(indepD1), P.canonicalHash(prodD1));

console.log("practical-comeback-stage1-contract: ok");
