"use strict";

(function exposeBaoAI(root) {
  const E = root.BaoEngine || (typeof require !== "undefined" ? require("./engine.js") : null);
  const WeightConfig = root.BaoAIWeights
    || (typeof require !== "undefined" ? require("./ai-weights.js") : null);
  const WIN = 1_000_000;
  const EVALUATION_WEIGHTS = WeightConfig.DEFAULT_WEIGHTS;

  function emptyStats(level) {
    return {
      level,
      elapsedMs: 0,
      nodes: 0,
      quiescenceNodes: 0,
      cutoffs: 0,
      cacheHits: 0,
      cacheStores: 0,
      historyUpdates: 0,
      aspirationResearches: 0,
      evaluationRequests: 0,
      evaluations: 0,
      evaluationCacheHits: 0,
      evaluationCacheStores: 0,
      evaluationCachePeak: 0,
      evaluationCacheEvictions: 0,
      completedDepth: 0,
      rootScore: null,
      timedOut: false,
      earlyStopped: false,
      stableIterations: 0,
      rootBestChanges: 0,
      allocatedTimeMs: 0,
      baseTimeLimitMs: 0,
      adaptiveComplexity: 0,
      simulations: 0,
      playoutTurns: 0,
      maxPlayoutTurns: 0,
    };
  }

  function movesFor(state) {
    return E.moveVariants(state);
  }

  function legacyEvaluate(state, player) {
    if (state.winner !== null) return state.winner === player ? WIN : -WIN;
    const opponent = 1 - player;
    const sum = (values) => values.reduce((total, value) => total + value, 0);
    const occupied = (values) => values.filter((value) => value > 0).length;
    const ownFront = state.pits[player][E.FRONT];
    const enemyFront = state.pits[opponent][E.FRONT];
    const ownBoard = sum(state.pits[player][0]) + sum(state.pits[player][1]);
    const enemyBoard = sum(state.pits[opponent][0]) + sum(state.pits[opponent][1]);
    return (ownBoard - enemyBoard) * 5
      + (occupied(ownFront) - occupied(enemyFront)) * 35
      + (sum(ownFront) - sum(enemyFront)) * 4
      + (state.houseOwned[player] ? 18 : 0)
      - (state.houseOwned[opponent] ? 18 : 0);
  }

  function sum(values) {
    return values.reduce((total, value) => total + value, 0);
  }

  function occupied(values) {
    return values.filter((value) => value > 0).length;
  }

  function frontConnections(front) {
    let result = 0;
    for (let index = 0; index < front.length - 1; index += 1) {
      if (front[index] > 0 && front[index + 1] > 0) result += 1;
    }
    return result;
  }

  function legalMovesFor(state, player) {
    if (state.winner !== null) return [];
    return E.legalMoves(state.player === player ? state : { ...state, player });
  }

  function playerMetrics(state, player) {
    const view = state.player === player ? state : { ...state, player };
    const front = state.pits[player][E.FRONT];
    const back = state.pits[player][E.BACK];
    const moves = legalMovesFor(view, player);
    const captures = moves.filter((move) => move.type === "capture");
    const captureOutcomes = captures.map((move) => E.applyMove(view, move).events);
    const captureAmounts = captureOutcomes.map((events) => events
      .filter((event) => event.kind === "capture")
      .reduce((total, event) => total + event.count, 0));
    const relayLengths = captureOutcomes.map((events) => events
      .filter((event) => event.kind === "relay" || event.kind === "capture").length);
    const maxCapture = captureAmounts.length ? Math.max(...captureAmounts) : 0;
    const relayLength = relayLengths.length ? Math.max(...relayLengths) : 0;
    const frontCount = occupied(front);
    const reusable = [...front, ...back].filter((value) => value >= 2).length;
    const reserve = state.reserve[player];
    const houseSeeds = front[E.HOUSE];
    return {
      boardSeeds: sum(front) + sum(back),
      frontSeeds: sum(front),
      frontOccupied: frontCount,
      frontConnections: frontConnections(front),
      reusablePits: reusable,
      mobility: moves.filter((move) => move.type !== "pass").length,
      captureMoves: captures.length,
      maxCapture,
      relayShape: relayLength + Math.min(reusable, 4),
      frontSafety: frontCount >= 3 ? 2 : frontCount === 2 ? 0 : -3,
      houseValue: state.houseOwned[player] ? 2 + Math.min(houseSeeds, 12) : 0,
      reserveEfficiency: reserve > 0 ? Math.round(frontCount * 10 / reserve) : 0,
      transitionShape: state.phase === "namua" && reserve <= 4
        ? frontCount + frontConnections(front) + reusable : 0,
      tempo: state.player === player ? 1 : 0,
    };
  }

  function metricPair(state, player) {
    return {
      own: playerMetrics(state, player),
      enemy: playerMetrics(state, 1 - player),
    };
  }

  function featuresFromMetrics(own, enemy) {
    return Object.fromEntries(Object.keys(own).map((name) => [name, own[name] - enemy[name]]));
  }

  function evaluateFeatures(state, player) {
    const { own, enemy } = metricPair(state, player);
    return featuresFromMetrics(own, enemy);
  }

  function categoryFromMetrics(state, player, own, enemy) {
    if (state.phase === "namua") {
      const reserve = state.reserve[player];
      const enemyReserve = state.reserve[1 - player];
      if (reserve <= 4 || enemyReserve <= 4) return "namua-endgame";
      if (state.turn <= 8 || reserve >= 16) return "namua-opening";
      return "namua-midgame";
    }
    const totalBoardSeeds = own.boardSeeds + enemy.boardSeeds;
    if (own.maxCapture >= enemy.frontSeeds && own.maxCapture > 0) return "mtaji-attack";
    if (totalBoardSeeds <= 12 || enemy.frontOccupied <= 2) return "mtaji-closing";
    if ((own.maxCapture === 0 && own.frontOccupied <= 4)
      || enemy.maxCapture >= Math.max(4, own.frontSeeds / 2)) {
      return "mtaji-endurance";
    }
    return "mtaji-balanced";
  }

  function evaluationCategory(state, player) {
    const { own, enemy } = metricPair(state, player);
    return categoryFromMetrics(state, player, own, enemy);
  }

  function adjustedWeights(
    state, player, profile, evaluationWeights, features, category = null,
    evaluationAdjustments = WeightConfig.DEFAULT_V2_ADJUSTMENTS,
  ) {
    const weights = { ...evaluationWeights[state.phase] };
    if (profile !== "bao-v2") return weights;
    category ||= evaluationCategory(state, player);
    const adjustment = evaluationAdjustments[category] || {};
    for (const [name, delta] of Object.entries(adjustment)) {
      weights[name] += delta;
    }
    if (features.frontSafety < 0 && features.maxCapture > 0) {
      weights.maxCapture = Math.max(4, weights.maxCapture - 3);
    }
    return weights;
  }

  function evaluationBreakdown(state, player, options = {}) {
    const profile = options.evaluationProfile || "bao";
    const evaluationWeights = options.evaluationWeights
      ? WeightConfig.validateWeights(options.evaluationWeights)
      : WeightConfig.weightsForProfile(profile);
    const evaluationAdjustments = options.evaluationAdjustments
      ? WeightConfig.validateAdjustments(options.evaluationAdjustments)
      : WeightConfig.DEFAULT_V2_ADJUSTMENTS;
    if (state.winner !== null) {
      const total = state.winner === player ? WIN : -WIN;
      return {
        profile, category: "terminal", phase: state.phase, legacy: total,
        features: {}, weights: {}, contributions: {}, total,
      };
    }
    const legacy = legacyEvaluate(state, player);
    const { own, enemy } = metricPair(state, player);
    const features = featuresFromMetrics(own, enemy);
    const category = categoryFromMetrics(state, player, own, enemy);
    const weights = adjustedWeights(
      state, player, profile, evaluationWeights, features, category, evaluationAdjustments,
    );
    const contributions = Object.fromEntries(Object.entries(weights).map(
      ([name, weight]) => [name, features[name] * weight],
    ));
    return {
      profile,
      category,
      phase: state.phase,
      legacy,
      features,
      weights,
      contributions,
      total: legacy + Object.values(contributions).reduce((score, value) => score + value, 0),
    };
  }

  function weightedEvaluation(state, player, evaluationWeights) {
    if (state.winner !== null) return state.winner === player ? WIN : -WIN;
    const features = evaluateFeatures(state, player);
    const weights = evaluationWeights[state.phase];
    return legacyEvaluate(state, player) + Object.entries(weights).reduce(
      (score, [name, weight]) => score + features[name] * weight,
      0,
    );
  }

  function profiledEvaluation(
    state, player, profile, evaluationWeights,
    evaluationAdjustments = WeightConfig.DEFAULT_V2_ADJUSTMENTS,
  ) {
    if (profile === "bao") return weightedEvaluation(state, player, evaluationWeights);
    if (state.winner !== null) return state.winner === player ? WIN : -WIN;
    const { own, enemy } = metricPair(state, player);
    const features = featuresFromMetrics(own, enemy);
    const category = categoryFromMetrics(state, player, own, enemy);
    const weights = adjustedWeights(
      state, player, profile, evaluationWeights, features, category, evaluationAdjustments,
    );
    return legacyEvaluate(state, player) + Object.entries(weights).reduce(
      (score, [name, weight]) => score + features[name] * weight,
      0,
    );
  }

  function evaluateWithWeights(state, player, evaluationWeights) {
    return weightedEvaluation(state, player, evaluationWeights);
  }

  function evaluateWithProfile(
    state, player, profile = "bao", evaluationWeights = null, evaluationAdjustments = null,
  ) {
    const selected = evaluationWeights
      ? WeightConfig.validateWeights(evaluationWeights)
      : WeightConfig.weightsForProfile(profile);
    const selectedAdjustments = evaluationAdjustments
      ? WeightConfig.validateAdjustments(evaluationAdjustments)
      : WeightConfig.DEFAULT_V2_ADJUSTMENTS;
    return profiledEvaluation(state, player, profile, selected, selectedAdjustments);
  }

  function evaluate(state, player) {
    return evaluateWithProfile(state, player, "bao", EVALUATION_WEIGHTS);
  }

  function evaluatorFor(profile, weights, adjustments) {
    if (profile === "legacy") return legacyEvaluate;
    const selectedProfile = profile || "bao";
    const selected = weights ? WeightConfig.validateWeights(weights) : WeightConfig.weightsForProfile(selectedProfile);
    const selectedAdjustments = adjustments
      ? WeightConfig.validateAdjustments(adjustments)
      : WeightConfig.DEFAULT_V2_ADJUSTMENTS;
    return (state, player) => evaluateWithProfile(
      state, player, selectedProfile, selected, selectedAdjustments,
    );
  }

  function evaluationAccessor(evaluator, stats, enabled, maxEntries = 2_048) {
    const cache = enabled ? new Map() : null;
    return (state, player) => {
      stats.evaluationRequests += 1;
      if (cache) {
        const key = `${player}|${stateKey(state)}`;
        if (cache.has(key)) {
          stats.evaluationCacheHits += 1;
          return cache.get(key);
        }
        const value = evaluator(state, player);
        stats.evaluations += 1;
        if (cache.size >= maxEntries) {
          cache.delete(cache.keys().next().value);
          stats.evaluationCacheEvictions += 1;
        }
        cache.set(key, value);
        stats.evaluationCacheStores += 1;
        stats.evaluationCachePeak = Math.max(stats.evaluationCachePeak, cache.size);
        return value;
      }
      stats.evaluations += 1;
      return evaluator(state, player);
    };
  }

  function immediateScore(state, move, player, evaluator) {
    const next = E.applyMove(state, move).state;
    if (next.winner === player) return WIN;
    const enemy = 1 - player;
    const before = state.pits[enemy][E.FRONT].reduce((a, b) => a + b, 0);
    const after = next.pits[enemy][E.FRONT].reduce((a, b) => a + b, 0);
    return evaluator(next, player) + (before - after) * 12;
  }

  function ordered(state, player, evaluator) {
    return movesFor(state).map((move) => ({ move, score: immediateScore(state, move, player, evaluator) }))
      .sort((a, b) => b.score - a.score);
  }

  function search(state, depth, alpha, beta, player, deadline, stats, evaluator) {
    if (performanceNow() >= deadline) throw new Error("timeout");
    stats.nodes += 1;
    if (depth === 0 || state.winner !== null) return evaluator(state, player);
    const choices = ordered(state, player, evaluator);
    if (!choices.length) return state.player === player ? -WIN : WIN;
    const maximizing = state.player === player;
    let best = maximizing ? -Infinity : Infinity;
    for (const choice of choices) {
      const next = E.applyMove(state, choice.move).state;
      const value = search(next, depth - 1, alpha, beta, player, deadline, stats, evaluator);
      if (maximizing) {
        best = Math.max(best, value); alpha = Math.max(alpha, best);
      } else {
        best = Math.min(best, value); beta = Math.min(beta, best);
      }
      if (beta <= alpha) { stats.cutoffs += 1; break; }
    }
    return best;
  }

  function moveKey(move) {
    if (!move) return "";
    return [
      move.type, move.phase, move.row, move.index, move.direction, move.side,
      move.houseChoice, Boolean(move.houseTwo),
    ].join(":");
  }

  function stateKey(state) {
    return [
      state.pits.flat(2).join(","),
      state.player,
      state.phase,
      state.reserve.join(","),
      state.houseOwned.map(Number).join(","),
      state.winner === null ? "-" : state.winner,
    ].join("|");
  }

  function terminalScore(state, player, ply) {
    if (state.winner === null) return null;
    return state.winner === player ? WIN - ply : -WIN + ply;
  }

  function ttScore(value, ply) {
    if (value > WIN / 2) return value + ply;
    if (value < -WIN / 2) return value - ply;
    return value;
  }

  function scoreFromTt(value, ply) {
    if (value > WIN / 2) return value - ply;
    if (value < -WIN / 2) return value + ply;
    return value;
  }

  function transpositionKey(state, ply, normalizeMateScores) {
    const key = stateKey(state);
    return normalizeMateScores ? key : `${key}@${ply}`;
  }

  function captureCount(events) {
    return events.filter((event) => event.kind === "capture")
      .reduce((total, event) => total + event.count, 0);
  }

  function enhancedOrdered(
    state, player, evaluator, preferredMove, killerMove, ttMoveFirst = false, history = null,
  ) {
    const maximizing = state.player === player;
    return movesFor(state).map((move) => {
      const result = E.applyMove(state, move);
      const captured = captureCount(result.events);
      const immediateWin = result.state.winner === state.player ? 1 : 0;
      return {
        move,
        next: result.state,
        immediateWin,
        captured,
        preferred: moveKey(move) === preferredMove ? 1 : 0,
        killer: moveKey(move) === killerMove ? 1 : 0,
        historyScore: history?.get(`${state.player}:${moveKey(move)}`) || 0,
        staticScore: immediateWin || captured ? 0 : evaluator(result.state, player),
      };
    }).sort((a, b) => b.immediateWin - a.immediateWin
      || (ttMoveFirst ? b.preferred - a.preferred : 0)
      || b.captured - a.captured
      || (ttMoveFirst ? 0 : b.preferred - a.preferred)
      || b.killer - a.killer
      || b.historyScore - a.historyScore
      || (maximizing ? b.staticScore - a.staticScore : a.staticScore - b.staticScore));
  }

  function quiescence(
    state, alpha, beta, player, deadline, stats, evaluator, ply, remaining, orderCaptures = false,
  ) {
    if (performanceNow() >= deadline) throw new Error("timeout");
    stats.nodes += 1;
    stats.quiescenceNodes += 1;
    const terminal = terminalScore(state, player, ply);
    if (terminal !== null) return terminal;
    const captures = movesFor(state).filter((move) => move.type === "capture");
    if (!captures.length || remaining === 0) return evaluator(state, player);
    const maximizing = state.player === player;
    let best = maximizing ? -Infinity : Infinity;
    const choices = orderCaptures ? captures.map((move) => {
      const result = E.applyMove(state, move);
      return {
        move,
        next: result.state,
        immediateWin: result.state.winner === state.player ? 1 : 0,
        captured: captureCount(result.events),
      };
    }).sort((a, b) => b.immediateWin - a.immediateWin || b.captured - a.captured)
      : captures.map((move) => ({ move, next: null }));
    for (const choice of choices) {
      const next = choice.next || E.applyMove(state, choice.move).state;
      const value = quiescence(
        next, alpha, beta, player, deadline, stats, evaluator, ply + 1, remaining - 1,
        orderCaptures,
      );
      if (maximizing) {
        best = Math.max(best, value);
        alpha = Math.max(alpha, best);
      } else {
        best = Math.min(best, value);
        beta = Math.min(beta, best);
      }
      if (beta <= alpha) { stats.cutoffs += 1; break; }
    }
    return best;
  }

  function storeTable(context, key, entry) {
    if (context.table.size >= context.maxTableEntries && !context.table.has(key)) {
      context.table.delete(context.table.keys().next().value);
    }
    context.table.set(key, entry);
    context.stats.cacheStores += 1;
  }

  function enhancedSearch(state, depth, alpha, beta, player, context, ply) {
    if (performanceNow() >= context.deadline) throw new Error("timeout");
    context.stats.nodes += 1;
    const terminal = terminalScore(state, player, ply);
    if (terminal !== null) return terminal;
    if (depth === 0) return quiescence(
      state, alpha, beta, player, context.deadline, context.stats,
      context.evaluator, ply, context.quiescenceDepth, context.orderQuiescenceCaptures,
    );

    const key = transpositionKey(state, ply, context.normalizeTtMateScores);
    const originalAlpha = alpha;
    const originalBeta = beta;
    const cached = context.table.get(key);
    if (cached && cached.depth >= depth) {
      context.stats.cacheHits += 1;
      const cachedValue = context.normalizeTtMateScores
        ? scoreFromTt(cached.value, ply) : cached.value;
      if (cached.flag === "exact") return cachedValue;
      if (cached.flag === "lower") alpha = Math.max(alpha, cachedValue);
      else if (cached.flag === "upper") beta = Math.min(beta, cachedValue);
      if (alpha >= beta) return cachedValue;
    }

    const choices = enhancedOrdered(
      state, player, context.evaluator, cached?.bestMove || "", context.killers.get(ply) || "",
      context.ttMoveFirst, context.history,
    );
    if (!choices.length) return state.player === player ? -WIN + ply : WIN - ply;
    const maximizing = state.player === player;
    let best = maximizing ? -Infinity : Infinity;
    let bestMove = choices[0].move;
    for (let index = 0; index < choices.length; index += 1) {
      const choice = choices[index];
      let value;
      if (index === 0) {
        value = enhancedSearch(choice.next, depth - 1, alpha, beta, player, context, ply + 1);
      } else if (maximizing) {
        value = enhancedSearch(choice.next, depth - 1, alpha, alpha + 1, player, context, ply + 1);
        if (value > alpha && value < beta) {
          value = enhancedSearch(choice.next, depth - 1, alpha, beta, player, context, ply + 1);
        }
      } else {
        value = enhancedSearch(choice.next, depth - 1, beta - 1, beta, player, context, ply + 1);
        if (value < beta && value > alpha) {
          value = enhancedSearch(choice.next, depth - 1, alpha, beta, player, context, ply + 1);
        }
      }
      if ((maximizing && value > best) || (!maximizing && value < best)) {
        best = value;
        bestMove = choice.move;
      }
      if (maximizing) alpha = Math.max(alpha, best);
      else beta = Math.min(beta, best);
      if (beta <= alpha) {
        context.stats.cutoffs += 1;
        if (choice.move.type !== "capture") {
          context.killers.set(ply, moveKey(choice.move));
          if (context.history) {
            const historyKey = `${state.player}:${moveKey(choice.move)}`;
            context.history.set(historyKey, (context.history.get(historyKey) || 0) + depth * depth);
            context.stats.historyUpdates += 1;
          }
        }
        break;
      }
    }

    const flag = best <= originalAlpha ? "upper" : best >= originalBeta ? "lower" : "exact";
    const storedValue = context.normalizeTtMateScores ? ttScore(best, ply) : best;
    storeTable(context, key, { depth, value: storedValue, flag, bestMove: moveKey(bestMove) });
    return best;
  }

  function performanceNow() {
    return typeof performance !== "undefined" ? performance.now() : Date.now();
  }

  function normalizedScore(state, player, evaluator) {
    if (state.winner !== null) return state.winner === player ? 1 : -1;
    return Math.tanh(evaluator(state, player) / 400);
  }

  function mctsPolicy(options) {
    const policy = options.mctsPolicy || "evaluation";
    if (!["random", "capture", "balanced", "evaluation"].includes(policy)) {
      throw new Error(`Invalid MCTS policy: ${policy}`);
    }
    return policy;
  }

  function mctsRootSelection(options) {
    const selection = options.mctsRoot || "visits";
    if (!["visits", "value"].includes(selection)) {
      throw new Error(`Invalid MCTS root selection: ${selection}`);
    }
    return selection;
  }

  function mctsReward(options) {
    const reward = options.mctsReward || "evaluation";
    if (!["evaluation", "terminal", "fast-terminal"].includes(reward)) {
      throw new Error(`Invalid MCTS reward: ${reward}`);
    }
    return reward;
  }

  function mctsPrior(options) {
    const prior = options.mctsPrior || "none";
    if (!["none", "static"].includes(prior)) {
      throw new Error(`Invalid MCTS prior: ${prior}`);
    }
    return prior;
  }

  function mctsCandidateSource(options) {
    const source = options.mctsCandidateSource || "static";
    if (!["all", "static", "phase2"].includes(source)) {
      throw new Error(`Invalid MCTS candidate source: ${source}`);
    }
    return source;
  }

  function estimatedCapture(state, move) {
    if (move.type !== "capture") return 0;
    const player = state.player;
    if (move.phase === "namua") return state.pits[1 - player][E.FRONT][7 - move.index];
    let cursor = { player, row: move.row, index: move.index };
    const seeds = state.pits[player][move.row][move.index];
    for (let count = 0; count < seeds; count += 1) {
      cursor = E.nextPit(player, cursor, move.direction);
    }
    if (cursor.row !== E.FRONT) return 0;
    return state.pits[1 - player][E.FRONT][7 - cursor.index];
  }

  function lightMoveScore(state, move) {
    const captured = estimatedCapture(state, move);
    const enemyFrontSeeds = sum(state.pits[1 - state.player][E.FRONT]);
    const win = captured >= enemyFrontSeeds && captured > 0 ? 100_000 : 0;
    if (move.type === "capture") return win + captured * 10;
    const frontBonus = move.row === E.FRONT ? 2 : 0;
    const directionBonus = (move.index <= 1 && move.direction === "right")
      || (move.index >= 6 && move.direction === "left") ? 1 : 0;
    return frontBonus + directionBonus;
  }

  function captureMoveScore(state, move) {
    const captured = estimatedCapture(state, move);
    const enemyFrontSeeds = sum(state.pits[1 - state.player][E.FRONT]);
    return (captured >= enemyFrontSeeds && captured > 0 ? 100_000 : 0) + captured;
  }

  function playoutMove(state, player, evaluator, random, policy) {
    const choices = movesFor(state);
    if (!choices.length) return null;
    if (policy === "random") return choices[Math.floor(random() * choices.length)];
    const ranked = choices.map((move) => {
      if (policy === "capture" || policy === "balanced") {
        return { move, score: policy === "capture" ? captureMoveScore(state, move) : lightMoveScore(state, move) };
      }
      const result = E.applyMove(state, move);
      const captured = captureCount(result.events);
      const win = result.state.winner === state.player ? 100_000 : 0;
      const score = normalizedScore(result.state, player, evaluator);
      return { move, score: win + captured * 0.08 + score };
    }).sort((a, b) => {
      if (state.player === player) return b.score - a.score;
      return a.score - b.score;
    });
    const pool = ranked.slice(0, Math.min(3, ranked.length));
    return pool[Math.floor(random() * pool.length)].move;
  }

  function playoutReward(state, player, evaluator, turns, maxTurns, reward) {
    if (state.winner === player) {
      if (reward === "fast-terminal") return 1 - (turns / Math.max(1, maxTurns)) * 0.1;
      return 1;
    }
    if (state.winner === 1 - player) {
      if (reward === "fast-terminal") return -1 + (turns / Math.max(1, maxTurns)) * 0.1;
      return -1;
    }
    if (reward === "terminal" || reward === "fast-terminal") return 0;
    return normalizedScore(state, player, evaluator);
  }

  function runPlayout(state, player, evaluator, random, maxTurns, stats, policy, deadline, reward) {
    let current = state;
    let turns = 0;
    while (current.winner === null && turns < maxTurns) {
      if (performanceNow() >= deadline) {
        stats.timedOut = true;
        return { completed: false, value: 0 };
      }
      const move = playoutMove(current, player, evaluator, random, policy);
      if (!move) break;
      current = E.applyMove(current, move).state;
      turns += 1;
    }
    stats.playoutTurns += turns;
    stats.maxPlayoutTurns = Math.max(stats.maxPlayoutTurns, turns);
    return {
      completed: true,
      value: playoutReward(current, player, evaluator, turns, maxTurns, reward),
    };
  }

  function mctsChildScore(parent, child, player, exploration) {
    if (child.visits === 0) return parent.state.player === player ? Infinity : -Infinity;
    const average = child.value / child.visits;
    const explore = exploration * Math.sqrt(Math.log(Math.max(1, parent.visits)) / child.visits);
    return parent.state.player === player ? average + explore : average - explore;
  }

  function selectMctsChild(node, player, exploration) {
    return node.children.reduce((best, child) => {
      if (!best) return child;
      const score = mctsChildScore(node, child, player, exploration);
      const bestScore = mctsChildScore(node, best, player, exploration);
      return node.state.player === player
        ? (score > bestScore ? child : best)
        : (score < bestScore ? child : best);
    }, null);
  }

  function createMctsNode(state, move = null, parent = null) {
    return {
      state,
      move,
      parent,
      children: [],
      untried: movesFor(state).slice(),
      visits: 0,
      value: 0,
    };
  }

  function applyRootPrior(root, player, evaluator, prior, weight, stats) {
    if (prior === "none" || root.state.winner !== null) return;
    const visits = Math.max(0, weight);
    if (visits === 0) return;
    const children = root.untried.map((move) => {
      const next = E.applyMove(root.state, move).state;
      const child = createMctsNode(next, move, root);
      child.visits = visits;
      child.value = normalizedScore(next, player, evaluator) * visits;
      return child;
    });
    root.children.push(...children);
    root.untried = [];
    root.visits += children.reduce((total, child) => total + child.visits, 0);
    root.value += children.reduce((total, child) => total + child.value, 0);
    stats.nodes += children.length;
  }

  function rootCandidateScore(root, move, player, evaluator, source, depth, deadline, stats) {
    const next = E.applyMove(root.state, move).state;
    if (next.winner === root.state.player) return 100_000;
    if (source !== "phase2" || depth <= 1) return evaluator(next, player);
    if (performanceNow() >= deadline) {
      stats.timedOut = true;
      return evaluator(next, player);
    }
    const context = {
      table: new Map(),
      killers: new Map(),
      evaluator,
      stats,
      deadline,
      quiescenceDepth: 0,
      maxTableEntries: 2000,
    };
    try {
      return enhancedSearch(next, depth - 1, -Infinity, Infinity, player, context, 1);
    } catch (error) {
      if (error.message !== "timeout") throw error;
      stats.timedOut = true;
      return evaluator(next, player);
    }
  }

  function limitRootCandidates(root, player, evaluator, limit, source, depth, deadline, stats) {
    if (source === "all" || !limit || root.untried.length <= limit) return;
    const maximizing = root.state.player === player;
    root.untried = root.untried.map((move) => {
      return {
        move,
        score: rootCandidateScore(root, move, player, evaluator, source, depth, deadline, stats),
      };
    }).sort((a, b) => (maximizing ? b.score - a.score : a.score - b.score))
      .slice(0, limit)
      .map((item) => item.move);
  }

  function mctsSearch(state, player, deadline, stats, evaluator, random, options) {
    const root = createMctsNode(state);
    const exploration = options.mctsExploration ?? Math.SQRT2;
    const maxPlayoutTurns = options.mctsPlayoutTurns ?? 80;
    const policy = mctsPolicy(options);
    const rootSelection = mctsRootSelection(options);
    const reward = mctsReward(options);
    const prior = mctsPrior(options);
    const priorWeight = options.mctsPriorWeight ?? 1;
    const candidateLimit = options.mctsCandidateLimit ?? 0;
    const candidateSource = mctsCandidateSource(options);
    const candidateDepth = Math.max(1, options.mctsCandidateDepth ?? 1);
    const maxIterations = options.mctsIterations
      ?? (Number.isFinite(options.timeLimitMs ?? 450) ? Infinity : 200);
    let bestMove = ordered(state, player, evaluator)[0]?.move || root.untried[0] || null;
    limitRootCandidates(root, player, evaluator, candidateLimit, candidateSource, candidateDepth, deadline, stats);
    applyRootPrior(root, player, evaluator, prior, priorWeight, stats);

    for (let iteration = 0; iteration < maxIterations; iteration += 1) {
      if (performanceNow() >= deadline) {
        stats.timedOut = true;
        break;
      }
      let node = root;
      while (node.untried.length === 0 && node.children.length && node.state.winner === null) {
        node = selectMctsChild(node, player, exploration);
      }
      if (node.untried.length && node.state.winner === null) {
        const index = Math.floor(random() * node.untried.length);
        const move = node.untried.splice(index, 1)[0];
        const next = E.applyMove(node.state, move).state;
        const child = createMctsNode(next, move, node);
        node.children.push(child);
        node = child;
        stats.nodes += 1;
      }

      const playout = runPlayout(
        node.state, player, evaluator, random, maxPlayoutTurns, stats, policy, deadline, reward,
      );
      if (!playout.completed) break;
      const { value } = playout;
      stats.simulations += 1;
      for (let current = node; current; current = current.parent) {
        current.visits += 1;
        current.value += value;
      }
    }

    const score = (child) => child.visits ? child.value / child.visits : -Infinity;
    const completed = root.children.slice().sort((a, b) => {
      if (rootSelection === "value") return score(b) - score(a) || b.visits - a.visits;
      return b.visits - a.visits || score(b) - score(a);
    })[0];
    if (completed?.move) bestMove = completed.move;
    stats.completedDepth = 0;
    return bestMove;
  }

  function analyzeMove(state, level = "normal", random = Math.random, options = {}) {
    const startedAt = performanceNow();
    const stats = emptyStats(level);
    const choices = movesFor(state);
    const rawEvaluator = evaluatorFor(
      options.evaluationProfile, options.evaluationWeights, options.evaluationAdjustments,
    );
    const useEvaluationCache = options.evaluationCache
      ?? (level === "hard" || level === "expert");
    const evaluator = evaluationAccessor(
      rawEvaluator, stats, useEvaluationCache,
      options.maxEvaluationCacheEntries ?? 2_048,
    );
    if (!choices.length) return { move: null, stats };
    if (level === "easy") {
      const move = choices[Math.floor(random() * choices.length)];
      stats.elapsedMs = performanceNow() - startedAt;
      return { move, stats };
    }
    if (level === "normal") {
      const ranked = choices.map((move) => ({
        move, score: immediateScore(state, move, state.player, evaluator),
      }))
        .sort((a, b) => b.score - a.score);
      const pool = ranked.slice(0, Math.min(3, ranked.length));
      const move = pool[Math.floor(random() * pool.length)].move;
      stats.nodes = choices.length;
      stats.completedDepth = 1;
      stats.elapsedMs = performanceNow() - startedAt;
      return { move, stats };
    }

    const player = state.player;
    const ranked = ordered(state, player, evaluator);
    let bestMove = ranked[0].move;
    const timeLimitMs = options.timeLimitMs ?? 450;
    const maxDepth = options.maxDepth ?? 4;
    stats.allocatedTimeMs = timeLimitMs;
    stats.baseTimeLimitMs = options.adaptive?.baseTimeLimitMs ?? timeLimitMs;
    stats.adaptiveComplexity = options.adaptive?.complexityScore ?? 0;
    const deadline = performanceNow() + timeLimitMs;
    if (options.searchProfile === "mcts") {
      bestMove = mctsSearch(state, player, deadline, stats, evaluator, random, options);
      stats.elapsedMs = performanceNow() - startedAt;
      return { move: bestMove, stats };
    }
    if (options.searchProfile !== "legacy") {
      const context = {
        table: new Map(),
        killers: new Map(),
        history: options.historyHeuristic ? new Map() : null,
        evaluator,
        stats,
        deadline,
        quiescenceDepth: options.quiescenceDepth ?? 1,
        maxTableEntries: options.maxTableEntries ?? 50_000,
        ttMoveFirst: options.ttMoveFirst ?? false,
        orderQuiescenceCaptures: options.orderQuiescenceCaptures ?? false,
        normalizeTtMateScores: options.normalizeTtMateScores ?? false,
      };
      let previousBestKey = moveKey(bestMove);
      let previousScore = null;
      let stableIterations = 0;
      const stableBestDepths = options.stableBestDepths ?? 0;
      const stableBestMinDepth = options.stableBestMinDepth ?? 3;
      for (let depth = 1; depth <= maxDepth; depth += 1) {
        try {
          const aspirationWindow = options.aspirationWindow ?? 0;
          let alpha = -Infinity;
          let beta = Infinity;
          if (aspirationWindow > 0 && previousScore !== null) {
            alpha = previousScore - aspirationWindow;
            beta = previousScore + aspirationWindow;
          }
          let score = enhancedSearch(state, depth, alpha, beta, player, context, 0);
          if (score <= alpha || score >= beta) {
            context.stats.aspirationResearches += 1;
            score = enhancedSearch(state, depth, -Infinity, Infinity, player, context, 0);
          }
          previousScore = score;
          stats.rootScore = score;
          const completed = context.table.get(transpositionKey(
            state, 0, context.normalizeTtMateScores,
          ));
          if (completed?.bestMove) {
            bestMove = movesFor(state).find((move) => moveKey(move) === completed.bestMove) || bestMove;
          }
          const currentBestKey = moveKey(bestMove);
          if (currentBestKey === previousBestKey) stableIterations += 1;
          else {
            stableIterations = 0;
            stats.rootBestChanges += 1;
          }
          previousBestKey = currentBestKey;
          stats.stableIterations = stableIterations;
          stats.completedDepth = depth;
          if (stableBestDepths > 0 && depth >= stableBestMinDepth
            && stableIterations >= stableBestDepths) {
            stats.earlyStopped = true;
            break;
          }
        } catch (error) {
          if (error.message !== "timeout") throw error;
          stats.timedOut = true;
          break;
        }
      }
      stats.elapsedMs = performanceNow() - startedAt;
      return { move: bestMove, stats };
    }

    for (let depth = 1; depth <= maxDepth; depth += 1) {
      let iterationBest = bestMove;
      let iterationScore = -Infinity;
      try {
        for (const choice of ranked) {
          const next = E.applyMove(state, choice.move).state;
          const score = search(
            next, depth - 1, -Infinity, Infinity, player, deadline, stats, evaluator,
          );
          if (score > iterationScore) { iterationScore = score; iterationBest = choice.move; }
        }
        bestMove = iterationBest;
        stats.rootScore = iterationScore;
        stats.completedDepth = depth;
      } catch (error) {
        if (error.message !== "timeout") throw error;
        stats.timedOut = true;
        break;
      }
    }
    stats.elapsedMs = performanceNow() - startedAt;
    return { move: bestMove, stats };
  }

  function chooseMove(state, level = "normal", random = Math.random, options = {}) {
    return analyzeMove(state, level, random, options).move;
  }

  const api = {
    chooseMove,
    analyzeMove,
    evaluate,
    evaluateWithWeights,
    evaluateWithProfile,
    evaluationBreakdown,
    evaluationCategory,
    evaluateFeatures,
    playerMetrics,
    legacyEvaluate,
    stateKey,
    moveKey,
    EVALUATION_WEIGHTS,
  };
  root.BaoAI = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
}(typeof window !== "undefined" ? window : globalThis));
