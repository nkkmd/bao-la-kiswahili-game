#!/usr/bin/env node
"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const {
  atomicWriteJson,
  hashValue,
  josekiProvenance,
} = require("./lib/joseki-common.js");
const { validateTree } = require("./generate-joseki-tree.js");

function parseArgs(argv) {
  const options = {
    tree: "artifacts/joseki-study/corpus/candidate-tree-8ply.json",
    phase2: "artifacts/joseki-study/phase-4",
    mcts: "artifacts/joseki-study/robustness/mcts-8ply",
    phase2Verification: "artifacts/joseki-study/verified/phase-4-verification.json",
    mctsVerification: "artifacts/joseki-study/verified/mcts-8ply-verification.json",
    output: "artifacts/joseki-study/summaries/position-patterns-summary.json",
    markdown: "doc/joseki/POSITION_PATTERNS.md",
  };
  for (let index = 0; index < argv.length; index += 2) {
    const key = argv[index];
    const value = argv[index + 1];
    if (key === "--tree") options.tree = value;
    else if (key === "--phase2") options.phase2 = value;
    else if (key === "--mcts") options.mcts = value;
    else if (key === "--phase2-verification") options.phase2Verification = value;
    else if (key === "--mcts-verification") options.mctsVerification = value;
    else if (key === "--output") options.output = value;
    else if (key === "--markdown") options.markdown = value;
    else throw new Error(`Unknown argument: ${key}`);
  }
  return options;
}

function mean(values) {
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null;
}

function median(values) {
  if (!values.length) return null;
  const sorted = values.slice().sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
}

function pearson(left, right) {
  if (left.length !== right.length || left.length < 2) return null;
  const leftMean = mean(left);
  const rightMean = mean(right);
  let numerator = 0;
  let leftVariance = 0;
  let rightVariance = 0;
  for (let index = 0; index < left.length; index += 1) {
    const leftDelta = left[index] - leftMean;
    const rightDelta = right[index] - rightMean;
    numerator += leftDelta * rightDelta;
    leftVariance += leftDelta ** 2;
    rightVariance += rightDelta ** 2;
  }
  const denominator = Math.sqrt(leftVariance * rightVariance);
  return denominator ? numerator / denominator : null;
}

function averageRanks(values) {
  const ranked = values.map((value, index) => ({ value, index })).sort((a, b) => a.value - b.value);
  const result = Array(values.length);
  for (let start = 0; start < ranked.length;) {
    let end = start + 1;
    while (end < ranked.length && ranked[end].value === ranked[start].value) end += 1;
    const rank = (start + 1 + end) / 2;
    for (let index = start; index < end; index += 1) result[ranked[index].index] = rank;
    start = end;
  }
  return result;
}

function spearman(left, right) {
  return pearson(averageRanks(left), averageRanks(right));
}

function legalBucket(count) {
  if (count === 0) return "terminal";
  if (count === 1) return "forced-move";
  if (count <= 4) return "2-4";
  if (count <= 7) return "5-7";
  return "8+";
}

function houseClass(houseOwned) {
  if (houseOwned[0] && houseOwned[1]) return "both-owned";
  if (houseOwned[0]) return "south-only";
  if (houseOwned[1]) return "north-only";
  return "neither-owned";
}

function readBlock(directory, nodeId) {
  const file = path.join(directory, "nodes", `${nodeId}.json`);
  if (!fs.existsSync(file)) throw new Error(`Missing result block: ${file}`);
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function assertVerification(file, treeHash, expectedResults) {
  const verification = JSON.parse(fs.readFileSync(file, "utf8"));
  if (!verification.passed || verification.treeHash !== treeHash
    || verification.results !== expectedResults || verification.partialResults !== 0) {
    throw new Error(`Stored verification mismatch: ${file}`);
  }
  return verification;
}

function loadRows(options) {
  const tree = JSON.parse(fs.readFileSync(options.tree, "utf8"));
  validateTree(tree);
  const leaves = tree.nodes.filter(({ ply }) => ply === 8);
  const phase2Verification = assertVerification(options.phase2Verification, tree.treeHash, leaves.length * 6);
  const mctsVerification = assertVerification(options.mctsVerification, tree.treeHash, leaves.length * 3);
  const rows = leaves.map((node) => {
    const phase2Block = readBlock(options.phase2, node.nodeId);
    const mctsBlock = readBlock(options.mcts, node.nodeId);
    if (phase2Block.stateHash !== node.stateHash || mctsBlock.stateHash !== node.stateHash) {
      throw new Error(`Cross-artifact state mismatch: ${node.nodeId}`);
    }
    const phase2Results = phase2Block.results;
    const baseline = phase2Results.find(({ conditionId }) => conditionId === "bao-d2");
    if (!baseline || phase2Results.length !== 6 || mctsBlock.results.length !== 3) {
      throw new Error(`Cross-artifact condition mismatch: ${node.nodeId}`);
    }
    const legalMoveCount = node.features.legalMoves[node.state.player];
    const mctsMoves = mctsBlock.results.map(({ recommendedMoveKey }) => recommendedMoveKey);
    const conditionMoves = phase2Results.map(({ recommendedMoveKey }) => recommendedMoveKey);
    return {
      nodeId: node.nodeId,
      stateHash: node.stateHash,
      moveKeys: node.moveKeys,
      legalMoveCount,
      legalBucket: legalBucket(legalMoveCount),
      forcedCapture: node.features.forcedCapture[node.state.player],
      houseClass: houseClass(node.state.houseOwned),
      southHouseOwned: node.state.houseOwned[0],
      boardSeedDifference: node.features.boardSeeds[0] - node.features.boardSeeds[1],
      frontSeedDifference: node.features.frontSeeds[0] - node.features.frontSeeds[1],
      nyumbaSeedDifference: node.features.nyumbaSeeds[0] - node.features.nyumbaSeeds[1],
      baoD2Score: baseline.southSearchScore,
      phase2MoveKey: baseline.recommendedMoveKey,
      phase2ConditionUnanimous: new Set(conditionMoves).size === 1,
      phase2BaselineAgreementRate: conditionMoves.filter((move) => move === baseline.recommendedMoveKey).length
        / conditionMoves.length,
      mctsUnanimous: new Set(mctsMoves).size === 1,
      mctsPhase2AgreementRate: mctsMoves.filter((move) => move === baseline.recommendedMoveKey).length
        / mctsMoves.length,
    };
  });
  return { tree, rows, phase2Verification, mctsVerification };
}

function groupSummary(rows, key, value) {
  const scores = rows.map(({ baoD2Score }) => baoD2Score).filter(Number.isFinite);
  return {
    key,
    value,
    nodes: rows.length,
    scoredNodes: scores.length,
    score: {
      mean: mean(scores),
      median: median(scores),
      minimum: scores.length ? Math.min(...scores) : null,
      maximum: scores.length ? Math.max(...scores) : null,
      positiveRate: scores.length ? scores.filter((score) => score > 0).length / scores.length : null,
    },
    phase2ConditionUnanimousRate: rows.filter(({ phase2ConditionUnanimous }) => phase2ConditionUnanimous).length
      / rows.length,
    averagePhase2BaselineAgreement: mean(rows.map(({ phase2BaselineAgreementRate }) => phase2BaselineAgreementRate)),
    mctsUnanimousRate: rows.filter(({ mctsUnanimous }) => mctsUnanimous).length / rows.length,
    averageMctsPhase2Agreement: mean(rows.map(({ mctsPhase2AgreementRate }) => mctsPhase2AgreementRate)),
  };
}

function groupBy(rows, key, selector) {
  const groups = new Map();
  for (const row of rows) {
    const value = selector(row);
    if (!groups.has(value)) groups.set(value, []);
    groups.get(value).push(row);
  }
  return [...groups.entries()].sort(([left], [right]) => left.localeCompare(right))
    .map(([value, selected]) => groupSummary(selected, key, value));
}

function compactRow(row) {
  return {
    nodeId: row.nodeId,
    score: row.baoD2Score,
    legalMoveCount: row.legalMoveCount,
    forcedCapture: row.forcedCapture,
    houseClass: row.houseClass,
    phase2MoveKey: row.phase2MoveKey,
    mctsUnanimous: row.mctsUnanimous,
    mctsPhase2AgreementRate: row.mctsPhase2AgreementRate,
    moveKeys: row.moveKeys,
  };
}

function selectRows(rows, predicate, compare, limit = 5) {
  return rows.filter(predicate).sort(compare).slice(0, limit).map(compactRow);
}

function buildSummary(loaded, options) {
  const { tree, rows, phase2Verification, mctsVerification } = loaded;
  const scored = rows.filter(({ baoD2Score }) => Number.isFinite(baoD2Score));
  const scoreValues = scored.map(({ baoD2Score }) => baoD2Score);
  const metrics = [
    ["legalMoveCount", scored.map(({ legalMoveCount }) => legalMoveCount)],
    ["boardSeedDifference", scored.map(({ boardSeedDifference }) => boardSeedDifference)],
    ["frontSeedDifference", scored.map(({ frontSeedDifference }) => frontSeedDifference)],
    ["nyumbaSeedDifference", scored.map(({ nyumbaSeedDifference }) => nyumbaSeedDifference)],
  ].map(([metric, values]) => ({ metric, pearson: pearson(values, scoreValues),
    spearman: spearman(values, scoreValues) }));
  const groups = {
    legalBucket: groupBy(rows, "legalBucket", ({ legalBucket: value }) => value),
    forcedCapture: groupBy(rows, "forcedCapture", ({ forcedCapture }) => String(forcedCapture)),
    houseClass: groupBy(rows, "houseClass", ({ houseClass: value }) => value),
    branchingCapture: groupBy(rows, "branchingCapture",
      (row) => `${row.legalBucket}/${row.forcedCapture ? "forced-capture" : "mixed"}`),
  };
  const descending = (left, right) => (right.baoD2Score ?? -Infinity) - (left.baoD2Score ?? -Infinity)
    || left.nodeId.localeCompare(right.nodeId);
  const ascending = (left, right) => (left.baoD2Score ?? Infinity) - (right.baoD2Score ?? Infinity)
    || left.nodeId.localeCompare(right.nodeId);
  const source = josekiProvenance();
  const script = path.relative(path.resolve(__dirname, "../.."), __filename);
  const scriptSha256 = crypto.createHash("sha256").update(fs.readFileSync(__filename)).digest("hex");
  return {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    status: "descriptive-patterns",
    scope: "cross-artifact position patterns on all focused 8-ply leaves",
    integrity: {
      treeHash: tree.treeHash,
      nodes: rows.length,
      scoredNodes: scored.length,
      phase2VerificationHash: phase2Verification.verificationHash,
      mctsVerificationHash: mctsVerification.verificationHash,
      sourceCommit: source.sourceCommit,
      sourceFileSha256: { [script]: scriptSha256 },
      analysisHash: hashValue({ treeHash: tree.treeHash, rows }),
    },
    groups,
    correlations: metrics,
    counterexamples: {
      highestScores: selectRows(rows, ({ baoD2Score }) => Number.isFinite(baoD2Score), descending),
      lowestScores: selectRows(rows, ({ baoD2Score }) => Number.isFinite(baoD2Score), ascending),
      lowBranchForcedMctsDisagreement: selectRows(rows,
        (row) => row.legalBucket === "2-4" && row.forcedCapture && !row.mctsUnanimous, ascending),
      highBranchMctsUnanimity: selectRows(rows,
        (row) => row.legalMoveCount >= 8 && row.mctsUnanimous, descending),
      southNyumbaOwnedNegative: selectRows(rows,
        (row) => row.southHouseOwned && row.baoD2Score < 0, ascending),
      southNyumbaLostPositive: selectRows(rows,
        (row) => !row.southHouseOwned && row.baoD2Score > 0, descending),
    },
  };
}

function percent(value) { return value === null ? "n/a" : `${(value * 100).toFixed(1)}%`; }
function number(value) { return value === null ? "n/a" : value.toFixed(2); }

function groupTable(groups) {
  return [
    "| 分類 | 局面 | C0中央値 | C0正値率 | phase2全条件一致 | MCTS seed一致 | MCTS/C0一致 |",
    "| --- | ---: | ---: | ---: | ---: | ---: | ---: |",
    ...groups.map((group) => `| ${group.value} | ${group.nodes} | ${number(group.score.median)} | ${percent(group.score.positiveRate)} | ${percent(group.phase2ConditionUnanimousRate)} | ${percent(group.mctsUnanimousRate)} | ${percent(group.averageMctsPhase2Agreement)} |`),
  ].join("\n");
}

function counterexampleLines(title, rows) {
  return [
    `### ${title}`,
    "",
    ...(rows.length ? rows.map((row) => `- \`${row.nodeId}\`: C0 ${row.score}, 合法手 ${row.legalMoveCount}, ${row.houseClass}, MCTS seed一致 ${row.mctsUnanimous ? "yes" : "no"}`) : ["- 該当なし"]),
    "",
  ];
}

function markdown(summary) {
  return [
    "# 8 ply局面パターン",
    "",
    `生成日時: ${summary.generatedAt}`,
    "",
    "候補木の全8 ply葉について、C0（bao depth 2）評価、6 phase2条件の推奨手、3 seed短時間MCTSを局面特徴別に横断集計した。相関と群差は記述統計であり、因果関係や理論的価値を示さない。",
    "",
    "## 分岐数 × 強制捕獲",
    "",
    groupTable(summary.groups.branchingCapture),
    "",
    "## nyumba所有状態",
    "",
    groupTable(summary.groups.houseClass),
    "",
    "## C0評価との相関",
    "",
    "| 指標 | Pearson | Spearman |",
    "| --- | ---: | ---: |",
    ...summary.correlations.map((item) => `| ${item.metric} | ${number(item.pearson)} | ${number(item.spearman)} |`),
    "",
    "## 反例候補",
    "",
    ...counterexampleLines("低分岐・強制捕獲でもMCTS seedが割れる局面", summary.counterexamples.lowBranchForcedMctsDisagreement),
    ...counterexampleLines("高分岐でもMCTS seedが一致する局面", summary.counterexamples.highBranchMctsUnanimity),
    ...counterexampleLines("South nyumba維持中でもC0が負の局面", summary.counterexamples.southNyumbaOwnedNegative),
    ...counterexampleLines("South nyumba喪失後でもC0が正の局面", summary.counterexamples.southNyumbaLostPositive),
    "## 完全性",
    "",
    `- tree hash: \`${summary.integrity.treeHash}\``,
    `- 局面: ${summary.integrity.nodes}（C0評価あり ${summary.integrity.scoredNodes}）`,
    `- Phase 4 verification hash: \`${summary.integrity.phase2VerificationHash}\``,
    `- MCTS verification hash: \`${summary.integrity.mctsVerificationHash}\``,
    `- analysis hash: \`${summary.integrity.analysisHash}\``,
    "",
  ].join("\n");
}

function analyze(options) {
  const summary = buildSummary(loadRows(options), options);
  atomicWriteJson(options.output, summary);
  fs.mkdirSync(path.dirname(options.markdown), { recursive: true });
  fs.writeFileSync(options.markdown, markdown(summary));
  return summary;
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const summary = analyze(options);
  console.log(JSON.stringify({ output: options.output, markdown: options.markdown,
    status: summary.status, integrity: summary.integrity, correlations: summary.correlations }, null, 2));
}
if (require.main === module) main();

module.exports = {
  analyze, averageRanks, buildSummary, groupBy, groupSummary, houseClass, legalBucket,
  loadRows, markdown, mean, median, parseArgs, pearson, spearman,
};
