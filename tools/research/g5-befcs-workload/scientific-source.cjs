"use strict";
const assert=require("node:assert/strict"),M=require("../g5-01/measurement.cjs");
const {Stop,draw,screen,rawStates,summary}=require("../g5-branch-envelope/source.cjs");
const startedSources=new Set();
function generateSource(seed, spec, initial, api, exclusions, context, hooks = {}) {
  require("./science-gate.cjs").authorizeRead(seed, context);
  const identity=context.binding+":"+context.index;assert.ok(!startedSources.has(identity),"SOURCE-REINITIALIZATION-REFUSED");startedSources.add(identity);
  const source = { sourceId: context.sourceId, evidenceClass: "BEFCS-SCIENTIFIC-SOURCE", seed, trace: [], screens: [],
    firstEligible: null, finalState: initial, stop: null, candidate: null, selectionStatus: null };
  let state = structuredClone(initial), random = seed, ply = 0;
  const emit = hooks.emit ?? (() => {}), observe = hooks.observe ?? (() => {}), check = hooks.check ?? (() => {});
  // remote consume receiptの照合後だけ、科学PRNGを初期化する。
  emit({ kind: "scientific-source-consume", seed, sourceId: context.sourceId }); observe(state, "SOURCE-INITIAL");
  try {
    for (; ply <= spec.maxPly; ply++) {
      check(); source.finalState = state;
      if (state.winner !== null) { source.stop = "NATURAL-TERMINAL"; break; }
      const options = api.variants(state), width = options.moves.length;
      assert.ok(width, "SOURCE-NONTERMINAL-NO-MOVES");
      if (ply >= spec.minCandidatePly && state.phase === "mtaji" && state.reserve.every(v => v === 0)
        && width >= spec.minRootWidth && width <= spec.maxRootWidth) {
        const examined = screen(state, ply, spec, api, observe);
        source.screens.push(examined); emit({ kind: "source-screen", screen: examined });
        if (examined.status === "BRANCH-ENVELOPE-ELIGIBLE" && source.firstEligible === null)
          source.firstEligible = { ply, raw: M.rawKey(state), state: structuredClone(state), screenIndex: source.screens.length - 1 };
        if (examined.status.startsWith("SCREEN-")) { source.stop = examined.status; break; }
      }
      if (ply === spec.maxPly) { source.stop = "PLY-LIMIT"; break; }
      const picked = draw(random, width), move = options.moves[picked.index], r = api.apply(state, move);
      for (const s of rawStates(r)) observe(s, "SOURCE-TRANSITION");
      const row = { ply, randomBefore: random, draws: picked.draws, moveKey: M.moveKey(move), move,
        rawBefore: M.rawKey(state), outcome: summary(r) };
      if (r.status !== "TERMINATED") { source.stopped = row; source.stop = r.status; emit({ kind: "source-stop", row }); break; }
      emit({ kind: "source-step", row }); source.trace.push(row);
      state = r.state; random = picked.random; source.finalState = state;
      if ((ply + 1) % spec.checkpointSourcePlyInterval === 0) hooks.checkpoint?.(source);
    }
  } catch (error) {
    if (!(error instanceof Stop)) throw error;
    source.stop = error.code; source.interruption = { ply, witness: error.witness, verification: "PREFIX-ONLY-NOT-FULL" };
  }
  source.finalState = state;
  const first = source.firstEligible;
  const overlap = first ? source.screens[first.screenIndex].readIdentities.some(id => exclusions.has(id)) : false;
  const regular = ["NATURAL-TERMINAL", "PLY-LIMIT"].includes(source.stop);
  source.selectionStatus = !regular ? "SOURCE-FAILURE-NO-CANDIDATE" : !first ? "NO-STRUCTURAL-ROOT"
    : overlap ? "FIRST-ROOT-OVERLAP-EXCLUDED" : "FIRST-ROOT-FROZEN";
  if (regular && first && !overlap) source.candidate = { raw: first.raw, ply: first.ply, state: first.state };
  hooks.checkpoint?.(source, { final: true }); return source;
}
function freezeCandidates(sources, count) {
  const roots = new Set(), candidates = [], dispositions = [];
  for (const source of sources) {
    if (!source.candidate) { dispositions.push({ sourceId: source.sourceId, status: source.selectionStatus }); continue; }
    const duplicate = roots.has(source.candidate.raw); roots.add(source.candidate.raw);
    dispositions.push({ sourceId: source.sourceId, status: duplicate ? "DUPLICATE-FIRST-ROOT-EXCLUDED" : candidates.length >= count ? "UNSELECTED-NO-REPLACEMENT" : "FROZEN" });
    if (!duplicate && candidates.length < count) candidates.push({ sourceId: source.sourceId, ...source.candidate });
  }
  return { candidates, dispositions };
}
module.exports={generateSource,freezeCandidates};
