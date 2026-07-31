"use strict";

function mean(values) {
  const finite = values.filter(Number.isFinite);
  return finite.length ? finite.reduce((sum, value) => sum + value, 0) / finite.length : null;
}

function maxOrNull(values) {
  const finite = values.filter(Number.isFinite);
  return finite.length ? Math.max(...finite) : null;
}

function groupByGame(observations) {
  const games = new Map();
  for (const row of observations) {
    if (!row || typeof row.gameId !== "string" || !Number.isInteger(Number(row.ply))) {
      throw new Error("Each observation requires gameId and integer ply");
    }
    if (!games.has(row.gameId)) games.set(row.gameId, []);
    games.get(row.gameId).push({ ...row, ply: Number(row.ply) });
  }
  for (const rows of games.values()) rows.sort((a, b) => a.ply - b.ply);
  return games;
}

function extractForcedCaptureRegimes(observations) {
  const regimes = [];
  for (const [gameId, rows] of groupByGame(observations)) {
    let startIndex = null;
    for (let index = 0; index <= rows.length; index += 1) {
      const active = index < rows.length && rows[index].forcedCapture === true;
      if (active && startIndex === null) startIndex = index;
      if ((!active || index === rows.length) && startIndex !== null) {
        const endIndex = index - 1;
        const segment = rows.slice(startIndex, endIndex + 1);
        const startPly = segment[0].ply;
        const endPly = segment.at(-1).ply;
        regimes.push({
          regimeId: `${gameId}:${startPly}-${endPly}`,
          gameId,
          startPly,
          endPly,
          length: endPly - startPly + 1,
          observationCount: segment.length,
          phaseAtStart: segment[0].phase || null,
          phaseAtEnd: segment.at(-1).phase || null,
          meanCaptureMoveCount: mean(segment.map((row) => Number(row.captureMoveCount))),
          maxCaptureMoveCount: maxOrNull(segment.map((row) => Number(row.captureMoveCount))),
        });
        startIndex = null;
      }
    }
  }
  return regimes;
}

function findContainingRegime(regimes, gameId, ply) {
  return regimes.find((regime) => regime.gameId === gameId && regime.startPly <= ply && ply <= regime.endPly) || null;
}

function firstDistance(rows, candidatePly, predicate) {
  const match = rows.find((row) => row.ply > candidatePly && predicate(row));
  return match ? match.ply - candidatePly : null;
}

function classifyCandidate(metrics, options = {}) {
  const settings = {
    expansionDelta: 3,
    convergenceDelta: -2,
    persistenceFraction: 0.5,
    eventWindow: 8,
    ...options,
  };
  if (metrics.distanceToMtaji !== null && metrics.distanceToMtaji <= settings.eventWindow) return "namua-to-mtaji-precursor";
  if (metrics.distanceToForcingRelease !== null && metrics.distanceToForcingRelease <= settings.eventWindow) return "forcing-release-precursor";
  if (metrics.captureDelta !== null && metrics.captureDelta >= settings.expansionDelta) {
    return metrics.postPersistenceFraction !== null && metrics.postPersistenceFraction >= settings.persistenceFraction
      ? "capture-branch-expansion"
      : "temporary-spike";
  }
  if (metrics.captureDelta !== null && metrics.captureDelta <= settings.convergenceDelta) return "capture-branch-convergence";
  return "temporary-spike";
}

function analyzeCandidate(candidate, gameRows, regimes, options = {}) {
  const settings = {
    before: 3,
    after: 8,
    expansionDelta: 3,
    convergenceDelta: -2,
    persistenceFraction: 0.5,
    eventWindow: 8,
    ...options,
  };
  const gameId = candidate.gameId || candidate.representativeGameId;
  const candidatePly = Number(candidate.ply ?? candidate.representativePly);
  if (!gameId || !Number.isInteger(candidatePly)) throw new Error("Candidate requires gameId and ply");

  const rows = gameRows.get(gameId) || [];
  const target = rows.find((row) => row.ply === candidatePly);
  if (!target) throw new Error(`Observation not found for ${gameId} ply ${candidatePly}`);
  const regime = findContainingRegime(regimes, gameId, candidatePly);
  const beforeRows = rows.filter((row) => row.ply >= candidatePly - settings.before && row.ply < candidatePly);
  const afterRows = rows.filter((row) => row.ply > candidatePly && row.ply <= candidatePly + settings.after);
  const baseline = mean(beforeRows.map((row) => Number(row.captureMoveCount)));
  const targetCapture = Number(target.captureMoveCount);
  const postMean = mean(afterRows.map((row) => Number(row.captureMoveCount)));
  const elevatedRows = baseline === null
    ? []
    : afterRows.filter((row) => Number(row.captureMoveCount) >= baseline + settings.expansionDelta);
  const distanceToForcingRelease = firstDistance(rows, candidatePly, (row) => row.forcedCapture !== true);
  const distanceToMtaji = target.phase === "mtaji" ? 0 : firstDistance(rows, candidatePly, (row) => row.phase === "mtaji");
  const terminal = rows.at(-1);
  const distanceToTerminal = terminal ? terminal.ply - candidatePly : null;
  const recoveryDistance = baseline === null ? null : firstDistance(
    rows,
    candidatePly,
    (row) => Number(row.captureMoveCount) <= baseline + 1,
  );

  const metrics = {
    archetypeId: candidate.archetypeId || null,
    category: candidate.category || null,
    gameId,
    candidatePly,
    forcedCaptureAtCandidate: target.forcedCapture === true,
    regimeId: regime?.regimeId || null,
    regimeStartPly: regime?.startPly ?? null,
    regimeEndPly: regime?.endPly ?? null,
    regimeLength: regime?.length ?? null,
    positionInRegime: regime ? candidatePly - regime.startPly : null,
    normalizedPositionInRegime: regime && regime.length > 1 ? (candidatePly - regime.startPly) / (regime.length - 1) : regime ? 0 : null,
    preCaptureMean: baseline,
    candidateCaptureMoveCount: Number.isFinite(targetCapture) ? targetCapture : null,
    postCaptureMean: postMean,
    postCaptureMax: maxOrNull(afterRows.map((row) => Number(row.captureMoveCount))),
    captureDelta: baseline === null || !Number.isFinite(targetCapture) ? null : targetCapture - baseline,
    postPersistenceFraction: afterRows.length ? elevatedRows.length / afterRows.length : null,
    recoveryDistance,
    returnedToBaseline: recoveryDistance !== null,
    distanceToForcingRelease,
    distanceToMtaji,
    distanceToTerminal,
  };
  metrics.classification = classifyCandidate(metrics, settings);
  return metrics;
}

module.exports = {
  analyzeCandidate,
  classifyCandidate,
  extractForcedCaptureRegimes,
  findContainingRegime,
  groupByGame,
  mean,
};
