"use strict";

if (typeof importScripts === "function") importScripts("./engine.js", "./ai-weights.js", "./ai.js");

function runSearch(message, engine = globalThis.BaoEngine, ai = globalThis.BaoAI) {
  if (!message || message.type !== "search") throw new Error("Invalid worker request");
  if (!engine || !ai) throw new Error("Bao AI dependencies are unavailable");
  const positionKey = ai.stateKey(message.state);
  const analysis = ai.analyzeMove(
    message.state,
    message.level,
    Math.random,
    message.options || {},
  );
  if (analysis.move) engine.applyMove(message.state, analysis.move);
  return {
    type: "result",
    id: message.id,
    positionKey,
    move: analysis.move,
    stats: analysis.stats,
  };
}

if (typeof self !== "undefined" && typeof self.addEventListener === "function") {
  self.addEventListener("message", (event) => {
    try {
      self.postMessage(runSearch(event.data));
    } catch (error) {
      self.postMessage({
        type: "error",
        id: event.data?.id,
        message: error instanceof Error ? error.message : String(error),
      });
    }
  });
}

if (typeof module !== "undefined" && module.exports) module.exports = { runSearch };
