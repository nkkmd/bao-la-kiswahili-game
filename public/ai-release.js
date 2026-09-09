"use strict";
(function exposeReleaseAdapter(root) {
  // hard限定の正式採用。配備状況は採用記録で管理する。
  const PBAI_C015_ENABLED = true;
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
  function displayIdentity(level, stats = null) {
    if (PBAI_C015_ENABLED && level === "hard" && !stats?.evaluationFallback
      && typeof root.BaoLogicGate?.evaluate === "function"
      && typeof root.BaoCandidateAI?.analyzeMove === "function") {
      return { label: "Logic Gate AI", labelJa: "論理ゲートAI", releaseId: "PBAI-C015-HARD-ADOPTION-001" };
    }
    return { label: config.GENERATION, labelJa: config.GENERATION, releaseId: config.RELEASE_ID };
  }
  root.BaoReleaseConfig = { ...config, searchOptions, displayIdentity };
  root.BaoReleaseAI = { ...baseline, analyzeMove,
    chooseMove: (state, level, random, options) => analyzeMove(state, level, random, options).move,
  };
})(typeof window === "undefined" ? globalThis : window);
