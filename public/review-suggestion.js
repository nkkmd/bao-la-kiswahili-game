"use strict";

(function exposeBaoReviewSuggestion(root) {
  const HISTORY_KEY = "bao_ai_depth_history_v1";
  const ELIGIBLE_LEVELS = new Set(["hard", "expert"]);
  const MIN_DEPTH = { hard: 3, expert: 4 };
  const HISTORY_LIMIT = 10;

  function finite(value) {
    return Number.isFinite(value) ? value : null;
  }

  function eligible(level) {
    return ELIGIBLE_LEVELS.has(level);
  }

  function median(values) {
    const sorted = values.filter(Number.isFinite).slice().sort((a, b) => a - b);
    if (!sorted.length) return null;
    const middle = Math.floor(sorted.length / 2);
    return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
  }

  function readHistory(storage, level) {
    if (!storage || !eligible(level)) return [];
    try {
      const parsed = JSON.parse(storage.getItem(HISTORY_KEY) || "{}");
      return Array.isArray(parsed[level]) ? parsed[level].filter(Number.isFinite) : [];
    } catch {
      return [];
    }
  }

  function writeHistory(storage, level, depth) {
    if (!storage || !eligible(level) || !Number.isFinite(depth)) return;
    try {
      const parsed = JSON.parse(storage.getItem(HISTORY_KEY) || "{}");
      const current = Array.isArray(parsed[level]) ? parsed[level].filter(Number.isFinite) : [];
      parsed[level] = current.concat(depth).slice(-HISTORY_LIMIT);
      storage.setItem(HISTORY_KEY, JSON.stringify(parsed));
    } catch {
      // Depth history is optional and must never interrupt the game.
    }
  }

  function countFrontPits(state, player) {
    return state?.pits?.[player]?.[0]?.filter((value) => value > 0).length || 0;
  }

  function captureOptions(engine, state) {
    try {
      return engine.legalMoves(state).filter((move) => move.type === "capture").length;
    } catch {
      return 0;
    }
  }

  function hypotheticalOpponentState(engine, state, player) {
    const copy = engine.clone(state);
    copy.player = 1 - player;
    copy.winner = null;
    copy.reason = "";
    return copy;
  }

  function addSignal(signals, type, label, weight, details = {}) {
    signals.push({ type, label, weight, ...details });
  }

  function analyze(engine, state, context, history = []) {
    const level = String(context?.ai?.level || "unknown");
    const stats = context?.ai?.stats || {};
    const depth = finite(stats.completedDepth);
    const result = {
      enabled: eligible(level),
      level,
      stats: {
        completedDepth: depth,
        elapsedMs: finite(stats.elapsedMs),
        nodes: finite(stats.nodes),
        timedOut: stats.timedOut === true,
      },
      recentMedianDepth: median(history),
      score: 0,
      recommendation: "none",
      signals: [],
    };
    if (!result.enabled) return result;

    if (result.stats.timedOut) {
      addSignal(result.signals, "timeout", "探索が時間切れになりました", 2, { value: true });
    }

    const minimum = MIN_DEPTH[level];
    if (depth !== null && depth < minimum) {
      addSignal(result.signals, "shallow-depth", `完了深度が目安の${minimum}未満でした`, 2, {
        value: depth,
        threshold: minimum,
      });
    }

    if (depth !== null && result.recentMedianDepth !== null
      && history.length >= 3 && depth <= result.recentMedianDepth - 2) {
      addSignal(result.signals, "depth-below-recent-median", "直近の探索より完了深度が大きく低下しました", 2, {
        value: depth,
        baseline: result.recentMedianDepth,
      });
    }

    try {
      const player = state.player;
      const beforeOpponent = hypotheticalOpponentState(engine, state, player);
      const beforeCaptures = captureOptions(engine, beforeOpponent);
      const applied = engine.applyMove(state, context.ai.move).state;
      const afterCaptures = captureOptions(engine, applied);
      if (afterCaptures >= beforeCaptures + 2) {
        addSignal(result.signals, "opponent-capture-options-increase", "相手の捕獲可能手が増加しました", 2, {
          before: beforeCaptures,
          after: afterCaptures,
        });
      }

      const frontBefore = countFrontPits(state, player);
      const frontAfter = countFrontPits(applied, player);
      if (frontAfter <= frontBefore - 2) {
        addSignal(result.signals, "front-occupancy-drop", "自分の前列の占有穴が大きく減少しました", 2, {
          before: frontBefore,
          after: frontAfter,
        });
      }

      if (applied.winner === 1 - player) {
        addSignal(result.signals, "immediate-loss", "この着手直後に敗北が確定しました", 4, { value: true });
      }
    } catch {
      // A failed secondary audit must not reject an otherwise legal AI move.
    }

    result.score = result.signals.reduce((sum, signal) => sum + signal.weight, 0);
    result.recommendation = result.score >= 2 ? "save" : "none";
    return result;
  }

  function formatNumber(value) {
    return Number.isFinite(value) ? value.toLocaleString("ja-JP") : "—";
  }

  function render(analysis) {
    const panel = document.querySelector("#ai-review-suggestion");
    const statsNode = document.querySelector("#ai-review-stats");
    const messageNode = document.querySelector("#ai-review-message");
    const reasonsNode = document.querySelector("#ai-review-reasons");
    if (!panel || !statsNode || !messageNode || !reasonsNode) return;

    if (!analysis.enabled) {
      panel.hidden = true;
      return;
    }

    const levelName = analysis.level === "expert" ? "ムタアラム" : "むずかしい";
    statsNode.textContent = [
      `難易度: ${levelName}`,
      `完了深度: ${formatNumber(analysis.stats.completedDepth)}`,
      `探索時間: ${formatNumber(analysis.stats.elapsedMs)} ms`,
      `探索局面数: ${formatNumber(analysis.stats.nodes)}`,
      `時間切れ: ${analysis.stats.timedOut ? "あり" : "なし"}`,
    ].join(" / ");

    reasonsNode.replaceChildren();
    if (analysis.recommendation === "save") {
      messageNode.textContent = "調査候補の局面です。AIの手の記録を推奨します。";
      for (const signal of analysis.signals) {
        const item = document.createElement("li");
        item.textContent = signal.label;
        reasonsNode.append(item);
      }
      panel.dataset.recommendation = "save";
    } else {
      messageNode.textContent = "直前のAI探索結果です。保存推奨条件には該当しませんでした。";
      panel.dataset.recommendation = "none";
    }
    panel.hidden = false;
  }

  function installBrowserHook() {
    const diagnostics = root.BaoDiagnostics;
    const engine = root.BaoEngine;
    if (!diagnostics || !engine || typeof document === "undefined") return;

    const originalCreateSnapshot = diagnostics.createSnapshot.bind(diagnostics);
    diagnostics.createSnapshot = (state, context = {}) => {
      const history = readHistory(root.localStorage, context?.ai?.level);
      const analysis = analyze(engine, state, context, history);
      const snapshot = originalCreateSnapshot(state, context);
      if (analysis.enabled) {
        snapshot.review = {
          status: "unreviewed",
          recommendation: analysis.recommendation,
          score: analysis.score,
          recentMedianDepth: analysis.recentMedianDepth,
          signals: analysis.signals,
        };
        writeHistory(root.localStorage, analysis.level, analysis.stats.completedDepth);
        render(analysis);
      }
      return snapshot;
    };

    document.querySelector("#dismiss-ai-review")?.addEventListener("click", () => {
      const panel = document.querySelector("#ai-review-suggestion");
      if (panel) panel.hidden = true;
    });
  }

  const api = { HISTORY_KEY, MIN_DEPTH, eligible, median, analyze };
  root.BaoReviewSuggestion = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  installBrowserHook();
}(typeof window !== "undefined" ? window : globalThis));
