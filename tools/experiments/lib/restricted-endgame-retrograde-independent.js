"use strict";

// Independent retrograde verifier using predecessor propagation rather than
// the production solver's synchronous full-graph waves.

function validate(nodes) {
  const graph = new Map();
  for (const node of nodes) {
    if (!node || typeof node.id !== "string" || graph.has(node.id)) throw new Error("Invalid/duplicate node");
    if (![0, 1].includes(node.player) || ![null, 0, 1].includes(node.winner)) throw new Error("Invalid node semantics");
    if (!Array.isArray(node.moves)) throw new Error("Invalid moves");
    const keys = new Set();
    for (const move of node.moves) {
      if (!move || typeof move.key !== "string" || !move.key || typeof move.to !== "string") {
        throw new Error("Invalid move");
      }
      if (keys.has(move.key)) throw new Error("Duplicate move key");
      keys.add(move.key);
    }
    if (node.winner !== null && node.moves.length) throw new Error("Terminal node has moves");
    if (node.winner === null && !node.moves.length) throw new Error("Nonterminal node has no moves");
    graph.set(node.id, {
      id: node.id,
      player: node.player,
      winner: node.winner,
      moves: node.moves.map((move) => ({ key: move.key, to: move.to })),
    });
  }
  for (const node of graph.values()) {
    for (const move of node.moves) if (!graph.has(move.to)) throw new Error(`Missing successor ${move.to}`);
  }
  return graph;
}

function popMin(queue) {
  let best = 0;
  for (let i = 1; i < queue.length; i += 1) {
    if (queue[i].dtf < queue[best].dtf
      || (queue[i].dtf === queue[best].dtf && queue[i].id < queue[best].id)) best = i;
  }
  return queue.splice(best, 1)[0];
}

function sccMetadata(graph, unresolved) {
  let nextIndex = 0;
  const stack = [];
  const onStack = new Set();
  const index = new Map();
  const low = new Map();
  const components = [];

  function visit(id) {
    index.set(id, nextIndex);
    low.set(id, nextIndex);
    nextIndex += 1;
    stack.push(id);
    onStack.add(id);
    for (const move of graph.get(id).moves) {
      if (!unresolved.has(move.to)) continue;
      if (!index.has(move.to)) {
        visit(move.to);
        low.set(id, Math.min(low.get(id), low.get(move.to)));
      } else if (onStack.has(move.to)) {
        low.set(id, Math.min(low.get(id), index.get(move.to)));
      }
    }
    if (low.get(id) === index.get(id)) {
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

  for (const id of [...unresolved].sort()) if (!index.has(id)) visit(id);
  components.sort((a, b) => a[0].localeCompare(b[0]));
  const byNode = new Map();
  const metadata = components.map((members, i) => {
    const set = new Set(members);
    const cyclic = members.length > 1 || members.some(
      (id) => graph.get(id).moves.some((move) => move.to === id && set.has(move.to)),
    );
    const sccId = `SCC-${String(i + 1).padStart(4, "0")}`;
    for (const id of members) byNode.set(id, { sccId, cyclic });
    return { sccId, members, cyclic };
  });
  return { byNode, metadata };
}

function solveIndependent(nodes) {
  const graph = validate(nodes);
  const predecessors = new Map([...graph.keys()].map((id) => [id, []]));
  for (const node of graph.values()) {
    for (const move of node.moves) predecessors.get(move.to).push({ from: node.id, moveKey: move.key });
  }
  for (const rows of predecessors.values()) rows.sort((a, b) => a.from.localeCompare(b.from) || a.moveKey.localeCompare(b.moveKey));

  const core = new Map();
  const queue = [];
  const opponentResolvedCounts = new Map();
  const opponentMaxDistance = new Map();
  for (const node of graph.values()) {
    opponentResolvedCounts.set(node.id, 0);
    opponentMaxDistance.set(node.id, -Infinity);
    if (node.winner !== null) {
      core.set(node.id, { status: "TERMINAL", absoluteWinner: node.winner, dtf: 0 });
      queue.push({ id: node.id, dtf: 0 });
    }
  }

  while (queue.length) {
    const solvedChild = popMin(queue);
    const childResult = core.get(solvedChild.id);
    for (const pred of predecessors.get(solvedChild.id)) {
      if (core.has(pred.from)) continue;
      const node = graph.get(pred.from);
      if (childResult.absoluteWinner === node.player) {
        const row = { status: "WIN", absoluteWinner: node.player, dtf: childResult.dtf + 1 };
        core.set(node.id, row);
        queue.push({ id: node.id, dtf: row.dtf });
        continue;
      }
      const opponent = 1 - node.player;
      if (childResult.absoluteWinner !== opponent) continue;
      opponentResolvedCounts.set(node.id, opponentResolvedCounts.get(node.id) + 1);
      opponentMaxDistance.set(node.id, Math.max(opponentMaxDistance.get(node.id), childResult.dtf));
      if (opponentResolvedCounts.get(node.id) === node.moves.length) {
        const row = {
          status: "LOSS",
          absoluteWinner: opponent,
          dtf: opponentMaxDistance.get(node.id) + 1,
        };
        core.set(node.id, row);
        queue.push({ id: node.id, dtf: row.dtf });
      }
    }
  }

  const unresolved = new Set([...graph.keys()].filter((id) => !core.has(id)));
  const { byNode, metadata: recurrentSccs } = sccMetadata(graph, unresolved);
  const results = {};
  for (const id of [...graph.keys()].sort()) {
    const node = graph.get(id);
    if (unresolved.has(id)) {
      const scc = byNode.get(id);
      results[id] = {
        status: "RECURRENT",
        absoluteWinner: null,
        dtf: null,
        optimalMoveKeys: null,
        recurrentMoveKeys: node.moves.filter((move) => unresolved.has(move.to)).map((move) => move.key).sort(),
        sccId: scc.sccId,
        cyclicScc: scc.cyclic,
      };
      continue;
    }
    const row = core.get(id);
    if (row.status === "TERMINAL") {
      results[id] = {
        ...row,
        optimalMoveKeys: [],
        recurrentMoveKeys: [],
        sccId: null,
        cyclicScc: false,
      };
      continue;
    }
    const candidateMoves = node.moves.filter((move) => core.get(move.to)?.absoluteWinner === row.absoluteWinner);
    const targetDistance = row.dtf - 1;
    const optimalMoveKeys = row.status === "WIN"
      ? candidateMoves.filter((move) => core.get(move.to).dtf === targetDistance).map((move) => move.key).sort()
      : node.moves.filter((move) => core.get(move.to)?.absoluteWinner === row.absoluteWinner
          && core.get(move.to).dtf === targetDistance).map((move) => move.key).sort();
    results[id] = {
      ...row,
      optimalMoveKeys,
      recurrentMoveKeys: [],
      sccId: null,
      cyclicScc: false,
    };
  }

  return {
    results,
    recurrentSccs,
    counts: {
      nodes: graph.size,
      terminal: Object.values(results).filter((row) => row.status === "TERMINAL").length,
      win: Object.values(results).filter((row) => row.status === "WIN").length,
      loss: Object.values(results).filter((row) => row.status === "LOSS").length,
      recurrent: Object.values(results).filter((row) => row.status === "RECURRENT").length,
    },
  };
}

module.exports = { solveIndependent, validate };
