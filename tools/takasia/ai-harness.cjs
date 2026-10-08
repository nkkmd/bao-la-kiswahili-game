"use strict";
const fs = require("node:fs"), path = require("node:path"), vm = require("node:vm");
const root = path.resolve(__dirname, "../..");
const F = require("./fixtures.json");
const old = require("../engineering/browser/pbai-p9/fixtures.json").rows;
function load({ missing = null, enabled = true, expertEnabled = enabled, detailed = false } = {}) {
  const ctx = vm.createContext({ performance }); ctx.self = ctx;
  let listener; ctx.addEventListener = (_, fn) => { listener = fn; };
  ctx.postMessage = r => { ctx.result = r; };
  ctx.importScripts = (...names) => names.forEach(name => {
    if (path.basename(name) === missing) throw Error("Injected missing asset");
    let text = fs.readFileSync(path.join(root, "public", name), "utf8");
    if (name.endsWith("ai-release.js")) text = text
      .replace("const PBAI_C015_ENABLED = true;", `const PBAI_C015_ENABLED = ${enabled};`)
      .replace("const PBAI_C015_EXPERT_ENABLED = true;", `const PBAI_C015_EXPERT_ENABLED = ${expertEnabled};`);
    if (detailed && name.endsWith("ai-config.js")) text = text.replace("pbaiC011LightweightTransitions: true", "pbaiC011LightweightTransitions: false");
    vm.runInContext(text, ctx, { filename: name });
  });
  ctx.importScripts("ai-release-worker.js");
  return { ctx, send(request) { listener({ data: request }); return ctx.result; } };
}
const rng = seed => () => { seed += 0x6D2B79F5; let t = seed; t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const stable = r => { const { elapsedMs, ...stats } = r.stats; return JSON.stringify({ move: r.move, stats }); };
function cases() {
  const swapped = structuredClone(F.detectionCases.find(f => f.id === "seat-swap").state);
  swapped.takasia = { player: 0, index: 3 };
  return [...old.map(f => ({ name: f.name, state: f.state, source: "P9-known-case" })),
    { name: "E30", state: F.e30.post, source: "guide-E30" },
    { name: "E30-seat-swap", state: swapped, source: "constructed" },
    { name: "owned-house-start", state: F.sowingCases[0].state, source: "constructed" }];
}
module.exports = { load, rng, stable, cases, root };
