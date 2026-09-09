"use strict";
(function exposeReleaseAdapter(root) {
  // 公開採用前は無効。検証用コピーでのみ有効化する。
  const PBAI_C015_ENABLED = false;
  const baseline = root.BaoAI;
  const config = root.BaoAIConfig;
  function searchOptions(level, capabilities = {}, state = null) {
    return { ...config.searchOptions(level, capabilities, state),
      ...(PBAI_C015_ENABLED && level === "hard" ? { pbaiC015LogicGate: true } : {}),
    };
  }
  function analyzeMove(state, level, random = Math.random, options = {}) {
    const requested = options.pbaiC015LogicGate === true && level === "hard"
      && (!options.evaluationProfile || options.evaluationProfile === "bao")
      && (!options.searchProfile || options.searchProfile === "phase2")
      && !options.evaluationWeights && !options.evaluationAdjustments;
    if (!requested) return baseline.analyzeMove(state, level, random, options);
    const available = typeof root.BaoLogicGate?.evaluate === "function"
      && typeof root.BaoCandidateAI?.analyzeMove === "function";
    const result = (available ? root.BaoCandidateAI : baseline).analyzeMove(state, level, random, options);
    result.stats.evaluationCandidate = available ? "PBAI-C015-v1" : "AI-GEN3-baseline";
    result.stats.evaluationFallback = !available;
    return result;
  }
  root.BaoReleaseConfig = { ...config, searchOptions };
  root.BaoReleaseAI = { ...baseline, analyzeMove,
    chooseMove: (state, level, random, options) => analyzeMove(state, level, random, options).move,
  };
})(typeof window === "undefined" ? globalThis : window);
