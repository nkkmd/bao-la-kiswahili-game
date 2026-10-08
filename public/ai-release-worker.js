"use strict";
importScripts("./engine.js", "./ai-weights.js", "./ai.js", "./ai-config.js");
try { importScripts("./logic-evaluator.js", "./ai-candidate.js"); } catch { /* 基準AIへ戻す。 */ }
importScripts("./ai-release.js");
self.addEventListener("message", event => {
  const message = event.data;
  try {
    if (!message || message.type !== "search") throw Error("Invalid worker request");
    if (typeof BaoEngine.detectTakasia !== "function") throw Error("Takasia engine is unavailable");
    if (message.ruleRevision && message.ruleRevision !== BaoReleaseConfig.RULE_REVISION) throw Error("AI rule revision mismatch");
    const positionKey = BaoReleaseAI.stateKey(message.state);
    if (message.positionKey && message.positionKey !== positionKey) throw Error("AI position key mismatch");
    const result = BaoReleaseAI.analyzeMove(message.state, message.level, Math.random, message.options || {});
    if (result.move) BaoEngine.applyMove(message.state, result.move);
    self.postMessage({ type: "result", id: message.id, positionKey, ruleRevision: BaoReleaseConfig.RULE_REVISION, move: result.move, stats: result.stats });
  } catch (error) {
    self.postMessage({ type: "error", id: message?.id, message: error instanceof Error ? error.message : String(error) });
  }
});
