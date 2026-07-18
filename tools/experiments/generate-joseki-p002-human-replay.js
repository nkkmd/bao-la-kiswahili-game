#!/usr/bin/env node
"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const { E, atomicWriteJson, hashValue, moveKey } = require("./lib/joseki-common.js");

const ROOT = path.resolve(__dirname, "../..");
const SOURCE_FILE = "tools/experiments/generate-joseki-p002-human-replay.js";

function parseArgs(argv) {
  const options = {
    study: "artifacts/joseki-study/summaries/forced-p002-summary.json",
    proof: "artifacts/joseki-study/verified/p002-bounded-win-proof.json",
    output: "artifacts/joseki-study/verified/p002-human-replay.json",
    verification: "artifacts/joseki-study/verified/p002-human-replay-verification.json",
    markdown: "doc/joseki/P002_HUMAN_REPLAY.md",
  };
  for (let index = 0; index < argv.length; index += 2) {
    const field = ({ "--study": "study", "--proof": "proof", "--output": "output",
      "--verification": "verification", "--markdown": "markdown" })[argv[index]];
    if (!field) throw new Error(`Unknown argument: ${argv[index]}`);
    options[field] = argv[index + 1];
  }
  return options;
}

function sha256(file) {
  return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}
function sum(values) { return values.reduce((total, value) => total + value, 0); }
function ledger(state) {
  const board = state.pits.map((rows) => sum(rows[0]) + sum(rows[1]));
  const pending = state.pending ? [...state.pending] : [0, 0];
  return { board, reserve: [...state.reserve], pending,
    total: sum(board) + sum(state.reserve) + sum(pending) };
}
function board(state) {
  return { northBack: [...state.pits[1][E.BACK]], northFront: [...state.pits[1][E.FRONT]],
    southFront: [...state.pits[0][E.FRONT]], southBack: [...state.pits[0][E.BACK]] };
}
function eventSummary(events) {
  const captures = events.filter(({ kind }) => kind === "capture")
    .map(({ player, index, count }) => ({ fromPlayer: player, index, count }));
  return { eventKinds: [...new Set(events.map(({ kind }) => kind))],
    reserveDrops: events.filter(({ kind }) => kind === "reserve").length,
    captures, capturedSeeds: sum(captures.map(({ count }) => count)),
    lifts: events.filter(({ kind }) => kind === "lift")
      .map(({ position, count }) => ({ position, count })),
    relays: events.filter(({ kind }) => kind === "relay")
      .map(({ position, count }) => ({ position, count })),
    sowEvents: events.filter(({ kind }) => kind === "sow").length,
    endedTurn: events.some(({ kind }) => kind === "turn"),
    endedGame: events.some(({ kind }) => kind === "win") };
}

function certificateMove(node) {
  if (node.kind === "south-or") return { key: node.moveKey, next: node.child };
  if (node.kind === "north-and") {
    if (node.children.length !== 1) throw new Error("Human replay requires the certified North reply to be unique");
    return { key: node.children[0].moveKey, next: node.children[0].child };
  }
  return null;
}

function build(study, proof) {
  let state = E.clone(study.position.state);
  let certificate = proof.certificate;
  const initialLedger = ledger(state);
  const plies = [];
  while (certificate.kind !== "terminal") {
    const witness = certificateMove(certificate);
    const legalMoves = E.moveVariants(state);
    const move = legalMoves.find((candidate) => moveKey(candidate) === witness.key);
    if (!move) throw new Error(`Certified P002 move is illegal at ply ${plies.length + 1}`);
    const before = state;
    const applied = E.applyMove(before, move);
    state = applied.state;
    const beforeLedger = ledger(before);
    const afterLedger = ledger(state);
    if (beforeLedger.total !== initialLedger.total || afterLedger.total !== initialLedger.total) {
      throw new Error(`P002 seed ledger mismatch at ply ${plies.length + 1}`);
    }
    plies.push({ ply: plies.length + 1, player: before.player,
      playerName: before.player === 0 ? "South" : "North",
      turn: before.turn, phase: before.phase, legalMoveCount: legalMoves.length,
      uniqueLegalMove: legalMoves.length === 1, moveKey: witness.key,
      move: { type: move.type, row: move.row, index: move.index,
        direction: move.direction ?? null, side: move.side ?? null,
        useHouse: move.useHouse ?? false },
      before: { stateHash: hashValue(before), board: board(before), ledger: beforeLedger,
        houseOwned: [...before.houseOwned] },
      events: eventSummary(applied.events), eventsHash: hashValue(applied.events),
      after: { stateHash: hashValue(state), board: board(state), ledger: afterLedger,
        houseOwned: [...state.houseOwned], winner: state.winner, reason: state.reason } });
    certificate = witness.next;
  }
  if (plies.length !== 9 || state.winner !== 0 || state.reason !== "front-empty"
    || certificate.winner !== 0 || certificate.reason !== "front-empty") {
    throw new Error("P002 human replay terminal mismatch");
  }
  return { schemaVersion: 1, generatedAt: new Date().toISOString(),
    purpose: "P002の認証済み9手系列を盤面単位で確認する人間向け照合票",
    dependencyCaveat: "盤面はpublic/engine.jsから生成しており、独立検証ではない。チェック欄は人間または別ルール実装による確認のため意図的に未記入としている。",
    nodeId: study.selection.selectedNodeId, startStateHash: hashValue(study.position.state),
    initialTotalSeeds: initialLedger.total, proofCertificateHash: proof.certificateHash,
    plies, terminal: { winner: state.winner, reason: state.reason,
      stateHash: hashValue(state), board: board(state), ledger: ledger(state) } };
}

function verifyReplay(study, proof, replay) {
  const rebuilt = build(study, proof);
  const identity = (value) => ({ nodeId: value.nodeId, startStateHash: value.startStateHash,
    initialTotalSeeds: value.initialTotalSeeds, proofCertificateHash: value.proofCertificateHash,
    plies: value.plies, terminal: value.terminal });
  if (hashValue(identity(rebuilt)) !== hashValue(identity(replay))) {
    throw new Error("P002 human replay content mismatch");
  }
  return { passed: true, plies: replay.plies.length,
    legalMovesChecked: replay.plies.length,
    uniqueNorthReplies: replay.plies.filter(({ player, uniqueLegalMove }) =>
      player === 1 && uniqueLegalMove).length,
    seedLedgerChecks: replay.plies.length * 2,
    seedTotal: replay.initialTotalSeeds,
    terminalWinner: replay.terminal.winner, terminalReason: replay.terminal.reason };
}

function boardText(position) {
  return ["index        0  1  2  3  4  5  6  7",
    `North back   ${position.northBack.map((value) => String(value).padStart(2)).join(" ")}`,
    `North front  ${position.northFront.map((value) => String(value).padStart(2)).join(" ")}`,
    `South front  ${position.southFront.map((value) => String(value).padStart(2)).join(" ")}`,
    `South back   ${position.southBack.map((value) => String(value).padStart(2)).join(" ")}`].join("\n");
}
function markdown(replay, verification) {
  const sections = replay.plies.flatMap((item) => {
    const captures = item.events.captures.length ? item.events.captures
      .map((capture) => `${capture.fromPlayer === 0 ? "South" : "North"} front index ${capture.index}から${capture.count}石`).join("、") : "なし";
    const relays = item.events.relays.length ? item.events.relays
      .map(({ position, count }) => `${position.player === 0 ? "South" : "North"} ${position.row === E.FRONT ? "front" : "back"} index ${position.index} (${count}石)`).join("、") : "なし";
    return [`## ${item.ply}. ${item.playerName} — \`${item.moveKey}\``, "",
      `手番開始: turn ${item.turn}、${item.phase}、合法手${item.legalMoveCount}通り${item.uniqueLegalMove ? "（1択）" : ""}`, "",
      "### 着手前", "", "```text", boardText(item.before.board), "```", "",
      `reserve South/North: ${item.before.ledger.reserve[0]} / ${item.before.ledger.reserve[1]}`,
      `石数台帳 board South/North + reserve + pending = ${item.before.ledger.board[0]} / ${item.before.ledger.board[1]} + ${item.before.ledger.reserve.join("/")} + ${item.before.ledger.pending.join("/")} = ${item.before.ledger.total}`,
      `state hash: \`${item.before.stateHash}\``, "", "### イベント要約", "",
      `- reserve投入: ${item.events.reserveDrops}`,
      `- 捕獲: ${captures}`,
      `- relay: ${relays}`,
      `- sowイベント: ${item.events.sowEvents}`,
      `- events hash: \`${item.eventsHash}\``, "", "### 着手後", "", "```text",
      boardText(item.after.board), "```", "",
      `reserve South/North: ${item.after.ledger.reserve[0]} / ${item.after.ledger.reserve[1]}`,
      `石数台帳 board South/North + reserve + pending = ${item.after.ledger.board[0]} / ${item.after.ledger.board[1]} + ${item.after.ledger.reserve.join("/")} + ${item.after.ledger.pending.join("/")} = ${item.after.ledger.total}`,
      `state hash: \`${item.after.stateHash}\``, "", "### 人間照合欄", "",
      "- [ ] 着手前盤面とreserveが一致する",
      "- [ ] 指定着手がBaoのルール上合法である",
      "- [ ] 捕獲元、播種方向、relayがイベント要約と一致する",
      "- [ ] 着手後盤面と石数台帳が一致する", ""];
  });
  return ["# P002 9手強制勝ち系列 — 人間向け盤面照合票", "",
    `生成日時: ${replay.generatedAt}`, "", replay.dependencyCaveat, "",
    "## 照合方法", "",
    "1. indexは0〜7で左から右に表示する。North/Southとも成果物内の配列順であり、物理盤の見え方に合わせて必要なら読み替える。",
    "2. 各着手前盤面からmove keyの着手を手作業または別実装で適用する。",
    "3. 捕獲・播種・relay、着手後盤面、reserveを確認してチェック欄を埋める。",
    "4. 最終局面でNorth frontが全て0となり、Southの`front-empty`勝ちになることを確認する。", "",
    `開始局面: \`${replay.startStateHash}\``,
    `証明書hash: \`${replay.proofCertificateHash}\``,
    `総石数: ${replay.initialTotalSeeds}`, "", ...sections,
    "## 最終確認", "", "```text", boardText(replay.terminal.board), "```", "",
    `- [ ] North frontが全て0である`,
    `- [ ] 勝者がSouth、理由が\`${replay.terminal.reason}\`である`,
    `- [ ] 最終state hash \`${replay.terminal.stateHash}\`と一致する`, "",
    "## 自動生成側の完全性", "",
    `- ply: ${verification.plies}`,
    `- North 1択応手: ${verification.uniqueNorthReplies}/4`,
    `- 石数台帳照合: ${verification.seedLedgerChecks}`,
    `- terminal: South / ${verification.terminalReason}`, ""].join("\n");
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const study = JSON.parse(fs.readFileSync(options.study, "utf8"));
  const proof = JSON.parse(fs.readFileSync(options.proof, "utf8"));
  const replay = build(study, proof);
  const verified = verifyReplay(study, proof, replay);
  const sourceFileSha256 = sha256(path.join(ROOT, SOURCE_FILE));
  const rulesEngineSha256 = sha256(path.join(ROOT, "public/engine.js"));
  const replayHash = hashValue({ nodeId: replay.nodeId, startStateHash: replay.startStateHash,
    initialTotalSeeds: replay.initialTotalSeeds, proofCertificateHash: replay.proofCertificateHash,
    plies: replay.plies, terminal: replay.terminal });
  const verification = { schemaVersion: 1, verifiedAt: new Date().toISOString(),
    ...verified, sourceFileSha256, rulesEngineSha256, replayHash };
  replay.integrity = verification;
  atomicWriteJson(options.output, replay);
  atomicWriteJson(options.verification, verification);
  fs.mkdirSync(path.dirname(options.markdown), { recursive: true });
  fs.writeFileSync(options.markdown, markdown(replay, verification));
  console.log(JSON.stringify({ output: options.output, markdown: options.markdown,
    verification: options.verification, ...verification }, null, 2));
}

if (require.main === module) main();
module.exports = { board, boardText, build, eventSummary, ledger, markdown,
  parseArgs, verifyReplay };
