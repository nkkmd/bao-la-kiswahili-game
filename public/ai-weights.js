"use strict";

(function exposeBaoAIWeights(root) {
  const PROFILES = ["bao", "bao-v2"];
  const DEFAULT_WEIGHTS = {
    namua: {
      boardSeeds: 1, frontSeeds: 1, frontOccupied: 5, frontConnections: 3,
      reusablePits: 3, mobility: 2, captureMoves: 3, maxCapture: 8,
      relayShape: 1, frontSafety: 8, houseValue: -7, reserveEfficiency: 1,
      transitionShape: 2, tempo: 2,
    },
    mtaji: {
      boardSeeds: 2, frontSeeds: 2, frontOccupied: 7, frontConnections: 4,
      reusablePits: 5, mobility: 3, captureMoves: 5, maxCapture: 8,
      relayShape: 1, frontSafety: 12, houseValue: 0, reserveEfficiency: 0,
      transitionShape: 0, tempo: 3,
    },
  };
  const PROFILE_WEIGHTS = {
    bao: DEFAULT_WEIGHTS,
    "bao-v2": DEFAULT_WEIGHTS,
  };
  const DEFAULT_V2_ADJUSTMENTS = {
    "namua-opening": { frontOccupied: 1, reserveEfficiency: 1 },
    "namua-midgame": {},
    "namua-endgame": { transitionShape: 3, frontConnections: 1, houseValue: 3 },
    "mtaji-attack": { maxCapture: 2, captureMoves: 1, tempo: 1 },
    "mtaji-endurance": { mobility: 2, frontOccupied: 2, frontSafety: 3, maxCapture: -2 },
    "mtaji-closing": { boardSeeds: 1, frontOccupied: 1, frontSafety: 2 },
    "mtaji-balanced": {},
  };

  function cloneWeights(weights = DEFAULT_WEIGHTS) {
    return {
      namua: { ...weights.namua },
      mtaji: { ...weights.mtaji },
    };
  }

  function validateWeights(weights) {
    if (!weights || !weights.namua || !weights.mtaji) throw new Error("Invalid AI weights");
    for (const phase of ["namua", "mtaji"]) {
      for (const name of Object.keys(DEFAULT_WEIGHTS[phase])) {
        if (!Number.isFinite(weights[phase][name])) {
          throw new Error(`Invalid AI weight: ${phase}.${name}`);
        }
      }
    }
    return weights;
  }

  function weightsForProfile(profile = "bao") {
    if (!PROFILES.includes(profile)) throw new Error(`Invalid AI weight profile: ${profile}`);
    return PROFILE_WEIGHTS[profile];
  }

  function cloneAdjustments(adjustments = DEFAULT_V2_ADJUSTMENTS) {
    return Object.fromEntries(Object.entries(adjustments)
      .map(([category, values]) => [category, { ...values }]));
  }

  function validateAdjustments(adjustments) {
    if (!adjustments || typeof adjustments !== "object") throw new Error("Invalid AI adjustments");
    for (const [category, values] of Object.entries(adjustments)) {
      if (!DEFAULT_V2_ADJUSTMENTS[category] || !values || typeof values !== "object") {
        throw new Error(`Invalid AI adjustment category: ${category}`);
      }
      for (const [name, value] of Object.entries(values)) {
        const phase = category.startsWith("namua") ? "namua" : "mtaji";
        if (!Object.hasOwn(DEFAULT_WEIGHTS[phase], name) || !Number.isFinite(value)) {
          throw new Error(`Invalid AI adjustment: ${category}.${name}`);
        }
      }
    }
    return adjustments;
  }

  const api = {
    DEFAULT_WEIGHTS,
    PROFILE_WEIGHTS,
    DEFAULT_V2_ADJUSTMENTS,
    PROFILES,
    cloneWeights,
    validateWeights,
    weightsForProfile,
    cloneAdjustments,
    validateAdjustments,
  };
  root.BaoAIWeights = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
}(typeof window !== "undefined" ? window : globalThis));
