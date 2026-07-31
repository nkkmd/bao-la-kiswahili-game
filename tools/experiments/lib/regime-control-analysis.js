"use strict";

function overlapsCandidate(row, candidates, buffer = 8) {
  return candidates.some((candidate) => candidate.gameId === row.gameId
    && row.ply >= Number(candidate.startPly) - buffer
    && row.ply <= Number(candidate.endPly) + buffer);
}

function classCounts(rows) {
  const counts = {};
  for (const row of rows) counts[row.classification] = (counts[row.classification] || 0) + 1;
  return Object.fromEntries(Object.entries(counts).sort());
}

function sensitivitySettings() {
  const settings = [];
  for (const expansionDelta of [2, 3, 4]) {
    for (const persistenceFraction of [0.25, 0.5, 0.75]) {
      for (const eventWindow of [5, 8, 12]) {
        settings.push({ expansionDelta, convergenceDelta: -2, persistenceFraction, eventWindow });
      }
    }
  }
  return settings;
}

module.exports = { classCounts, overlapsCandidate, sensitivitySettings };
