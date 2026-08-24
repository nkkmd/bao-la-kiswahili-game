"use strict";

/**
 * Generic deterministic retrograde solver for Stage 0 synthetic fixtures.
 *
 * This module is deliberately independent of BaoEngine. Nodes use absolute
 * player identities so terminal states do not depend on how a runtime engine
 * stores its `player` field after a winning move.
 *
 * Node schema:
 * {
 *   id: string,
 *   player: 0 | 1,
 *   winner: null | 0 | 1,
 *   moves: [{ key: string, to: string }]
 * }
 */

function validateGraph(nodes) {
  if (!Array.isArray(nodes) || nodes.length === 0) throw new Error("Graph must contain nodes");
  const map = new Map();
  for (const node of nodes) {
    if (!node || typeof node.id !== "string" || !node.id) throw new Error("Invalid node id");
    if (map.has(node.id)) throw new Error(`Duplicate node id: ${node.id}`);
    if (![0, 1].includes(node.player)) throw new Error(`Invalid player: ${node.id}`);
    if (![null, 0, 1].includes(node.winner)) throw new Error(`Invalid winner: ${node.id}`);
    if (!Array.isArray(node.moves)) throw new Error(`Invalid moves: ${node.id}`);
    const keys = new Set();
    for (const move of node.moves) {
      if (!move || typeof move.key !== "string" || !move.key) {
        throw new Error(`Invalid move key: ${node.id}`);
      }
      if (keys.has(move.key)) throw new Error(`Duplicate move key at ${node.id}: ${move.key}`);
      keys.add(move.key);
      if (typeof move.to !== "string" || !move.to) throw new Error(`Invalid successor: ${node.id}`);
    }
    if (node.winner !== null && node.moves.length !== 0) {
      throw new Error(`Terminal node has outgoing moves: ${node.id}`);
    }
    if (node.winner === null && node.moves.length === 0) {
      throw new Error(`Nonterminal node has no moves: ${node.id}`);
    }
    map.set(node.id, {
      id: node.id,
      player: node.player,
      winner: node.winner,
      moves: node.moves.map((move) => ({ key: move.key, to: move.to })),
    });
  }
  for (const node of map.values()) {
    for (const move of node.moves) {
      if (!map.has(move.to)) throw new Error(`Missing successor ${move.to} from ${node.id}`);
    }
  }
  return map;
}

function unresolvedSccs(graph, unresolved) {
  let index = 0;
  const stack = [];
  const onStack = new Set();
  const indices = new Map();
  const low = new Map();
  const components = [];

  function strongConnect(id) {
    indices.set(id, index);
    low.set(id, index);
    index += 1;
    stack.push(id);
    onStack.add(id);

    const node = graph.get(id);
    for (const move of node.moves) {
      const to = move.to;
      if (!unresolved.has(to)) continue;
      if (!indices.has(to)) {
        strongConnect(to);
        low.set(id, Math.min(low.get(id), low.get(to)));
      } else if (onStack.has(to)) {
        low.set(id, Math.min(low.get(id), indices.get(to)));
      }
    }

    if (low.get(id) === indices.get(id)) {
      const members = [];
      while (true) {
        const member = stack.pop();
        onStack.delete(member);
        members.push(member);
        if (member === id) break;
      }
      members.sort();
      components.push(members);
    }
  }

  for (const id of [...unresolved].sort()) {
    if (!indices.has(id)) strongConnect(id);
  }

  components.sort((a, b) => a[0].localeCompare(b[0]));
  const byNode = new Map();
  const metadata = components.map((members, i) => {
    const set = new Set(members);
    const selfLoop = members.some((id) => graph.get(id).moves.some(
      (move) => move.to === id && set.has(move.to),
    ));
    const cyclic = members.length > 1 || selfLoop;
    const sccId = `SCC-${String(i + 1).padStart(4, "0")}`;
    for (const id of members) byNode.set(id, { sccId, cyclic });
    return { sccId, members, cyclic };
  });
  return { byNode, metadata };
}

function solveRetrograde(nodes) {
  const graph = validateGraph(nodes);
  const solved = new Map();

  for (const node of graph.values()) {
    if (node.winner === null) continue;
    solved.set(node.id, {
      status: node.winner === node.player ? "WIN" : "LOSS",
      absoluteWinner: node.winner,
      dtf: 0,
      optimalMoveKeys: [],
      recurrentMoveKeys: [],
      sccId: null,
      cyclicScc: false,
    });
  }

  let changed = true;
  while (changed) {
    changed = false;
    for (const node of [...graph.values()].sort((a, b) => a.id.localeCompare(b.id))) {
      if (solved.has(node.id) || node.winner !== null) continue;
      const rows = node.moves.map((move) => ({ move, result: solved.get(move.to) || null }));
      const winning = rows.filter(({ result }) => result && result.absoluteWinner === node.player);
      if (winning.length) {
        const bestChildDistance = Math.min(...winning.map(({ result }) => result.dtf));
        const optimalMoveKeys = winning
          .filter(({ result }) => result.dtf === bestChildDistance)
          .map(({ move }) => move.key)
          .sort();
        solved.set(node.id, {
          status: "WIN",
          absoluteWinner: node.player,
          dtf: bestChildDistance + 1,
          optimalMoveKeys,
          recurrentMoveKeys: [],
          sccId: null,
          cyclicScc: false,
        });
        changed = true;
        continue;
      }

      const allResolved = rows.every(({ result }) => result !== null);
      const opponent = 1 - node.player;
      if (allResolved && rows.every(({ result }) => result.absoluteWinner === opponent)) {
        const bestResistanceDistance = Math.max(...rows.map(({ result }) => result.dtf));
        const optimalMoveKeys = rows
          .filter(({ result }) => result.dtf === bestResistanceDistance)
          .map(({ move }) => move.key)
          .sort();
        solved.set(node.id, {
          status: "LOSS",
          absoluteWinner: opponent,
          dtf: bestResistanceDistance + 1,
          optimalMoveKeys,
          recurrentMoveKeys: [],
          sccId: null,
          cyclicScc: false,
        });
        changed = true;
      }
    }
  }

  const unresolved = new Set([...graph.keys()].filter((id) => !solved.has(id)));
  const { byNode, metadata: recurrentSccs } = unresolvedSccs(graph, unresolved);
  for (const id of [...unresolved].sort()) {
    const node = graph.get(id);
    const scc = byNode.get(id);
    solved.set(id, {
      status: "RECURRENT",
      absoluteWinner: null,
      dtf: null,
      optimalMoveKeys: null,
      recurrentMoveKeys: node.moves
        .filter((move) => unresolved.has(move.to))
        .map((move) => move.key)
        .sort(),
      sccId: scc.sccId,
      cyclicScc: scc.cyclic,
    });
  }

  const results = Object.fromEntries([...solved.entries()]
    .sort(([a], [b]) => a.localeCompare(b)));
  return {
    results,
    recurrentSccs,
    counts: {
      nodes: graph.size,
      win: Object.values(results).filter((row) => row.status === "WIN").length,
      loss: Object.values(results).filter((row) => row.status === "LOSS").length,
      recurrent: Object.values(results).filter((row) => row.status === "RECURRENT").length,
    },
  };
}

module.exports = { solveRetrograde, validateGraph };
