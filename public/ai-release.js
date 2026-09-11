"use strict";
(function exposeReleaseAdapter(root) {
  // hard・expertの正式採用。世代昇格と配信確認は別の記録で管理する。
  const PBAI_C015_ENABLED = true;
  const PBAI_C015_EXPERT_ENABLED = true;
  const enabledFor = level => (level === "hard" && PBAI_C015_ENABLED)
    || (level === "expert" && PBAI_C015_EXPERT_ENABLED);
  const baseline = root.BaoAI;
  const config = root.BaoAIConfig;
  const GENERATION = "AI-GEN4";
  const RELEASE_ID = "AI-GEN4-RELEASE-001";
  function searchOptions(level, capabilities = {}, state = null) {
    return { ...config.searchOptions(level, capabilities, state),
      ...(enabledFor(level) ? { pbaiC015LogicGate: true } : {}),
    };
  }
  function analyzeMove(state, level, random = Math.random, options = {}) {
    const requested = options.pbaiC015LogicGate === true && (level === "hard" || level === "expert")
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
    if (enabledFor(level) && !stats?.evaluationFallback
      && typeof root.BaoLogicGate?.evaluate === "function"
      && typeof root.BaoCandidateAI?.analyzeMove === "function") {
      return { label: GENERATION, labelJa: GENERATION, releaseId: RELEASE_ID,
        adoptionId: level === "expert" ? "PBAI-C015-EXPERT-ADOPTION-001" : "PBAI-C015-HARD-ADOPTION-001",
        evaluator: "PBAI-C015-v1" };
    }
    if (level === "easy" || level === "normal") {
      return { label: GENERATION, labelJa: GENERATION, releaseId: RELEASE_ID,
        evaluator: "AI-GEN3-baseline" };
    }
    return { label: config.GENERATION, labelJa: config.GENERATION, releaseId: config.RELEASE_ID };
  }
  root.BaoReleaseConfig = { ...config, GENERATION, RELEASE_ID, searchOptions, displayIdentity };
  root.BaoReleaseAI = { ...baseline, analyzeMove,
    chooseMove: (state, level, random, options) => analyzeMove(state, level, random, options).move,
  };
})(typeof window === "undefined" ? globalThis : window);
