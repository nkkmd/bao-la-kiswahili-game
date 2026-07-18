#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const {
  E,
  atomicWriteJson,
  hashValue,
  moveKey,
} = require("./lib/joseki-common.js");

const HORIZON = 9;

function engineSha256() {
  return crypto.createHash("sha256")
    .update(fs.readFileSync(path.resolve(__dirname, "../../public/engine.js")))
    .digest("hex");
}

function parseArgs(argv) {
  const options = {
    study: "artifacts/joseki-study/summaries/forced-p002-summary.json",
    output: "artifacts/joseki-study/verified/p002-bounded-win-proof.json",
    markdown: "doc/joseki/P002_BOUNDED_WIN_PROOF.md",
  };
  for (let index = 0; index < argv.length; index += 2) {
    const field = ({ "--study": "study", "--output": "output", "--markdown": "markdown" })[argv[index]];
    if (!field) throw new Error(`Unknown argument: ${argv[index]}`);
    if (argv[index + 1] === undefined) throw new Error(`Missing value for ${argv[index]}`);
    options[field] = argv[index + 1];
  }
  return options;
}

function createSolver() {
  const memo = new Map();
  const stats = {
    visitedNodes: 0,
    cacheHits: 0,
    terminalNodes: 0,
    horizonNodes: 0,
    maxBranching: 0,
  };

  function key(state, remaining) {
    return `${hashValue(state)}:${remaining}`;
  }

  function solve(state, remaining) {
    stats.visitedNodes += 1;
    if (state.winner !== null) {
      stats.terminalNodes += 1;
      return state.winner === 0;
    }
    if (remaining === 0) {
      stats.horizonNodes += 1;
      return false;
    }
    const memoKey = key(state, remaining);
    if (memo.has(memoKey)) {
      stats.cacheHits += 1;
      return memo.get(memoKey);
    }
    const legalMoves = E.moveVariants(state);
    stats.maxBranching = Math.max(stats.maxBranching, legalMoves.length);
    let southCanForceWin;
    if (state.player === 0) {
      southCanForceWin = legalMoves.some((move) => solve(E.applyMove(state, move).state, remaining - 1));
    } else {
      southCanForceWin = legalMoves.every((move) => solve(E.applyMove(state, move).state, remaining - 1));
    }
    memo.set(memoKey, southCanForceWin);
    return southCanForceWin;
  }

  function result(state, remaining) {
    if (state.winner !== null) return state.winner === 0;
    if (remaining === 0) return false;
    const memoKey = key(state, remaining);
    if (!memo.has(memoKey)) throw new Error(`Missing solved state ${memoKey}`);
    return memo.get(memoKey);
  }

  function certificate(state, remaining) {
    if (state.winner !== null) {
      if (state.winner !== 0) throw new Error("Cannot certify a non-South terminal state");
      return { kind: "terminal", stateHash: hashValue(state), remaining,
        winner: state.winner, reason: state.reason };
    }
    if (remaining === 0 || !result(state, remaining)) {
      throw new Error("Cannot certify a state without a bounded South forced win");
    }
    const legalMoves = E.moveVariants(state);
    if (state.player === 0) {
      const move = legalMoves.find((candidate) =>
        result(E.applyMove(state, candidate).state, remaining - 1));
      if (!move) throw new Error("South winning witness is missing");
      const next = E.applyMove(state, move).state;
      return { kind: "south-or", stateHash: hashValue(state), remaining,
        legalMoveCount: legalMoves.length, moveKey: moveKey(move),
        child: certificate(next, remaining - 1) };
    }
    return { kind: "north-and", stateHash: hashValue(state), remaining,
      legalMoveCount: legalMoves.length,
      children: legalMoves.map((move) => ({ moveKey: moveKey(move),
        child: certificate(E.applyMove(state, move).state, remaining - 1) })) };
  }

  return { certificate, memo, solve, stats };
}

function verifyCertificate(startState, certificate, expectedHorizon = HORIZON) {
  const counts = { certificateNodes: 0, terminalLeaves: 0, southOrNodes: 0,
    northAndNodes: 0, northRepliesCovered: 0, maxBranching: 0, maxPly: 0 };

  function visit(state, node, remaining, ply) {
    counts.certificateNodes += 1;
    counts.maxPly = Math.max(counts.maxPly, ply);
    if (node.stateHash !== hashValue(state)) throw new Error(`Certificate state mismatch at ply ${ply}`);
    if (node.remaining !== remaining) throw new Error(`Certificate horizon mismatch at ply ${ply}`);
    if (state.winner !== null) {
      if (node.kind !== "terminal" || state.winner !== 0 || node.winner !== 0
        || node.reason !== state.reason) throw new Error(`Invalid terminal certificate at ply ${ply}`);
      counts.terminalLeaves += 1;
      return;
    }
    if (remaining === 0) throw new Error(`Nonterminal certificate reached horizon at ply ${ply}`);
    const legalMoves = E.moveVariants(state);
    counts.maxBranching = Math.max(counts.maxBranching, legalMoves.length);
    if (node.legalMoveCount !== legalMoves.length) throw new Error(`Legal-count mismatch at ply ${ply}`);
    if (state.player === 0) {
      if (node.kind !== "south-or") throw new Error(`Expected South OR node at ply ${ply}`);
      const move = legalMoves.find((candidate) => moveKey(candidate) === node.moveKey);
      if (!move) throw new Error(`Illegal South witness at ply ${ply}`);
      counts.southOrNodes += 1;
      visit(E.applyMove(state, move).state, node.child, remaining - 1, ply + 1);
      return;
    }
    if (node.kind !== "north-and" || !Array.isArray(node.children)
      || node.children.length !== legalMoves.length) throw new Error(`Incomplete North AND node at ply ${ply}`);
    const legalKeys = legalMoves.map(moveKey).sort();
    const childKeys = node.children.map(({ moveKey: childMoveKey }) => childMoveKey).sort();
    if (JSON.stringify(legalKeys) !== JSON.stringify(childKeys)) {
      throw new Error(`North reply set mismatch at ply ${ply}`);
    }
    counts.northAndNodes += 1;
    counts.northRepliesCovered += legalMoves.length;
    for (const entry of node.children) {
      const move = legalMoves.find((candidate) => moveKey(candidate) === entry.moveKey);
      visit(E.applyMove(state, move).state, entry.child, remaining - 1, ply + 1);
    }
  }

  visit(E.clone(startState), certificate, expectedHorizon, 0);
  if (counts.terminalLeaves === 0) throw new Error("Certificate contains no terminal South win");
  return counts;
}

function resultIdentity(proof) {
  return { studyId: proof.studyId, nodeId: proof.nodeId,
    startStateHash: proof.startStateHash, rulesEngineSha256: proof.rulesEngineSha256,
    horizonPlies: proof.horizonPlies, candidateResults: proof.candidateResults,
    solverStats: proof.solverStats, verification: proof.verification,
    certificateHash: proof.certificateHash };
}

function verifyProof(study, proof) {
  if (!proof.passed || proof.startStateHash !== hashValue(study.position.state)
    || proof.consensusMoveKey !== study.selection.consensusMoveKey) {
    throw new Error("P002 proof identity mismatch");
  }
  if (proof.rulesEngineSha256 !== engineSha256()) throw new Error("P002 rules engine hash mismatch");
  if (proof.certificateHash !== hashValue(proof.certificate)) throw new Error("P002 certificate hash mismatch");
  if (proof.resultHash !== hashValue(resultIdentity(proof))) throw new Error("P002 result hash mismatch");
  const verification = verifyCertificate(study.position.state, proof.certificate, proof.horizonPlies);
  if (JSON.stringify(verification) !== JSON.stringify(proof.verification)) {
    throw new Error("P002 stored verification mismatch");
  }
  return verification;
}

function buildProof(study) {
  const startState = E.clone(study.position.state);
  const solver = createSolver();
  const candidateResults = [];
  for (const move of E.moveVariants(startState)) {
    const before = { ...solver.stats };
    const southCanForceWin = solver.solve(E.applyMove(startState, move).state, HORIZON - 1);
    candidateResults.push({ moveKey: moveKey(move), southCanForceWin,
      visitedNodes: solver.stats.visitedNodes - before.visitedNodes,
      cacheHits: solver.stats.cacheHits - before.cacheHits });
  }
  const consensus = candidateResults.find(({ moveKey: key }) => key === study.selection.consensusMoveKey);
  if (!consensus || !consensus.southCanForceWin) throw new Error("P002 consensus move has no bounded win");
  if (!solver.solve(startState, HORIZON)) throw new Error("P002 root has no bounded South win");
  const rootCertificate = solver.certificate(startState, HORIZON);
  if (rootCertificate.moveKey !== study.selection.consensusMoveKey) {
    throw new Error("The first certified winning witness is not the P002 consensus move");
  }
  const verification = verifyCertificate(startState, rootCertificate);
  const proof = {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    passed: true,
    studyId: "P002",
    nodeId: study.selection.selectedNodeId,
    startStateHash: hashValue(startState),
    rulesEngineSha256: engineSha256(),
    horizonPlies: HORIZON,
    semantics: {
      southNodes: "OR: at least one legal move must retain a South win",
      northNodes: "AND: every legal reply must retain a South win",
      leaf: "South must be terminal winner on or before the horizon",
    },
    implementationScope: "public/engine.js legal move generation, transitions, and terminal result only",
    excludedFromProof: ["public/ai.js", "static evaluation", "alpha-beta search", "quiescence search"],
    caveat: "This is independent of the AI evaluator and search, but it still relies on the same rules engine rather than an independent Bao implementation.",
    consensusMoveKey: study.selection.consensusMoveKey,
    consensusSouthCanForceWin: true,
    candidateResults,
    solverStats: { ...solver.stats, uniqueMemoizedStates: solver.memo.size },
    verification,
    certificate: rootCertificate,
  };
  proof.certificateHash = hashValue(rootCertificate);
  proof.resultHash = hashValue(resultIdentity(proof));
  verifyProof(study, proof);
  return proof;
}

function markdown(proof) {
  const rows = proof.candidateResults.map((candidate) =>
    `| \`${candidate.moveKey}\` | ${candidate.southCanForceWin ? "yes" : "no"} | ${candidate.visitedNodes.toLocaleString("en-US")} | ${candidate.cacheHits.toLocaleString("en-US")} |`);
  return ["# P002 9 ply有界強制勝ちの全枝検証", "", `生成日時: ${proof.generatedAt}`, "",
    "AI評価器・alpha-beta・quiescenceを使わず、現ルールエンジンの合法手生成、着手適用、終局判定だけで9 plyのAND/OR探索を行った。South手番では勝てる合法手が1つ以上存在すること、North手番では全合法応手の後もSouthが勝てることを要求した。", "",
    `合意手 \`${proof.consensusMoveKey}\` には9 ply以内のSouth強制勝ちがある。保存証明書をルールエンジンで再検証し、North節点では合法応手集合を全て照合した。`, "",
    "| P002の合法手 | 9 ply以内の強制勝ち | 訪問節点 | cache hit |", "| --- | --- | ---: | ---: |", ...rows, "",
    "`no`はこの9 ply以内にSouth終局勝ちを強制できないという有界判定であり、代替手が最終的に負けることまでは意味しない。", "",
    "## 証明条件", "",
    `- horizon: ${proof.horizonPlies} ply`,
    `- 全探索訪問節点: ${proof.solverStats.visitedNodes.toLocaleString("en-US")}`,
    `- memo化状態: ${proof.solverStats.uniqueMemoizedStates.toLocaleString("en-US")}`,
    `- 最大分岐数: ${proof.solverStats.maxBranching}`,
    `- 証明書節点: ${proof.verification.certificateNodes}`,
    `- South OR節点: ${proof.verification.southOrNodes}`,
    `- North AND節点: ${proof.verification.northAndNodes}`,
    `- North合法応手の証明対象: ${proof.verification.northRepliesCovered}`,
    `- South終局leaf: ${proof.verification.terminalLeaves}`, "",
    "## 解釈", "",
    "- depth 8探索の勝ちスコアは評価値だけの現象ではなく、現ルール実装上の全応手を対象にした有界強制勝ちとして再現した。",
    "- 主変化を1本再生しただけでなく、North節点をAND条件で検査している。South節点は戦略の存在証明なので勝てる1手を証明書に保持する。",
    "- これはAI探索から独立しているが、ルール実装自体からは独立していない。人間棋譜または別ルール実装による検証なしに`validated`や暫定定石へ昇格しない。", "",
    "## 完全性", "",
    `- rules engine sha256: \`${proof.rulesEngineSha256}\``,
    `- certificate hash: \`${proof.certificateHash}\``,
    `- result hash: \`${proof.resultHash}\``, ""].join("\n");
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const study = JSON.parse(fs.readFileSync(options.study, "utf8"));
  const proof = buildProof(study);
  atomicWriteJson(options.output, proof);
  fs.mkdirSync(path.dirname(options.markdown), { recursive: true });
  fs.writeFileSync(options.markdown, markdown(proof));
  console.log(JSON.stringify({ output: options.output, markdown: options.markdown,
    consensusSouthCanForceWin: proof.consensusSouthCanForceWin,
    candidateResults: proof.candidateResults, solverStats: proof.solverStats,
    verification: proof.verification, certificateHash: proof.certificateHash,
    resultHash: proof.resultHash }, null, 2));
}

if (require.main === module) main();
module.exports = { HORIZON, buildProof, createSolver, markdown, parseArgs,
  verifyCertificate, verifyProof };
