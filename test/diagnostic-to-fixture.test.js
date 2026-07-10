"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const E = require("../public/engine.js");
const Diagnostics = require("../public/diagnostics.js");
const Converter = require("../tools/diagnostic-to-fixture.js");

const snapshot = Diagnostics.createSnapshot(E.initialState(), {
  ai: {
    level: "hard",
    profile: "bao",
    move: { type: "takata", phase: "namua", row: 0, index: 5, direction: "left" },
    stats: { completedDepth: 6, nodes: 100 },
  },
});
const directory = fs.mkdtempSync(path.join(os.tmpdir(), "bao-diagnostic-"));
const input = path.join(directory, "diagnostic.json");
fs.writeFileSync(input, JSON.stringify([snapshot, snapshot]));

const options = Converter.parseArgs(["--input", input, "--index", "1", "--output", "/tmp/out.js"]);
assert.equal(options.index, 1);
assert.equal(Converter.loadSnapshots(input, 1).length, 1);

const fixture = Converter.fixtureTemplate(snapshot);
assert.match(fixture, /category: "human-review"/);
assert.match(fixture, /depth: 6/);
assert.match(fixture, /Observed AI move/);
assert.match(fixture, /assert\.fail\("TODO:/,
  "generated fixtures cannot silently pass before human review");
assert.match(fixture, /"pits"/, "generated fixtures contain a reproducible board");
assert.equal(Converter.convertSnapshots([snapshot, snapshot]).match(/category: "human-review"/g).length, 2);

assert.throws(() => Converter.parseArgs([]), /--input is required/);
assert.throws(() => Converter.loadSnapshots(input, 2), /out of range/);
assert.throws(() => Converter.convertSnapshots([]), /No diagnostic/);

console.log("Bao diagnostic fixture converter tests passed");
