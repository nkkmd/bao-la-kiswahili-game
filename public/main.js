"use strict";

const E = window.BaoEngine;
const AI = window.BaoReleaseAI;
const AIConfig = window.BaoReleaseConfig;
const Diagnostics = window.BaoDiagnostics;
const Locale = window.BaoLocale;
const t = (english, japanese) => Locale?.t ? Locale.t(english, japanese) : english;
const canvas = document.querySelector("#game");
const ctx = canvas.getContext("2d");
const statusNode = document.querySelector("#status");
const helpNode = document.querySelector("#visible-help");
const soundButton = document.querySelector("#sound");
const speedButton = document.querySelector("#speed");
const difficultySelect = document.querySelector("#difficulty");
const difficultyField = document.querySelector("#difficulty-field");
const aiGenerationBadge = document.querySelector("#ai-generation-badge");
const gameModeSelect = document.querySelector("#game-mode");
const startScreen = document.querySelector("#start-screen");
const startButton = document.querySelector("#start-game");
const sideField = document.querySelector("#side-field");
const playerSideSelect = document.querySelector("#player-side");
const copyPositionButton = document.querySelector("#copy-position");
const markAIMoveButton = document.querySelector("#mark-ai-move");
const copyMarkedButton = document.querySelector("#copy-marked");
const clearMarkedButton = document.querySelector("#clear-marked");
const diagnosticStatus = document.querySelector("#diagnostic-status");
ctx.imageSmoothingEnabled = false;
const directionPanel = document.querySelector("#move-choices");
let renderedChoices = null;
const turnNumber = document.querySelector("#turn-number");
const turnNameNode = document.querySelector("#turn-name");
const phaseNode = document.querySelector("#phase-name");
const northHand = document.querySelector("#north-hand");
const southHand = document.querySelector("#south-hand");

const C = { night: "#071011", ink: "#172c2b", mid: "#34544a", soft: "#78998a", sky: "#a8c98b", pale: "#d3e4a5", gold: "#e2c36b", red: "#b95f5f" };
const PIT_X = Array.from({ length: 8 }, (_, i) => 76 + i * 70);
const ROW_Y = [106, 174, 256, 324];
const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;
let state = E.initialState();
let displayState = E.clone(state);
let moves = E.legalMoves(state);
let selected = null;
let choices = [];
let choiceBoxes = [];
let animation = null;
let fast = false;
let sound = load("bao_sound", "on") !== "off";
let audio = null;
let aiTimer = null;
let aiWorker = null;
let aiGeneration = 0;
let aiThinking = false;
let started = false;
let humanPlayer = 0;
let lastAIDiagnostic = null;

function isComputerGame() { return gameModeSelect.value === "computer"; }
function updateAIGenerationBadge() {
  const identity = AIConfig.displayIdentity(difficultySelect.value,
    lastAIDiagnostic?.ai.level === difficultySelect.value ? lastAIDiagnostic.ai.stats : null);
  const labels = { easy: ["Easy", "やさしい"], normal: ["Normal", "ふつう"], hard: ["Hard", "むずかしい"], expert: ["Mtaalamu", "ムタアラム"] };
  const label = labels[difficultySelect.value] || labels.normal;
  aiGenerationBadge.textContent = `${t(identity.label, identity.labelJa)} / ${t(...label)}`;
  aiGenerationBadge.title = identity.releaseId;
  aiGenerationBadge.hidden = !isComputerGame();
}
function isHumanTurn() { return !isComputerGame() || state.player === humanPlayer; }
function isAIActive() { return aiThinking || aiTimer !== null; }
function setAIThinking(value) {
  aiThinking = value;
  canvas.setAttribute("aria-busy", String(value));
}
function playerName(player) {
  if (!isComputerGame()) return player === 0 ? "SOUTH" : "NORTH";
  const side = player === 0 ? "SOUTH" : "NORTH";
  return player === humanPlayer ? t(`${side} (YOU)`, `${side}（あなた）`) : t(`${side} (COM)`, `${side}（COM）`);
}

function load(key, fallback) { try { return localStorage.getItem(key) || fallback; } catch { return fallback; } }
function save(key, value) { try { localStorage.setItem(key, value); } catch { /* optional */ } }
function announce(message) { statusNode.textContent = ""; setTimeout(() => { statusNode.textContent = message; }, 20); }
function diagnosticRecords() { return Diagnostics.readMarked(localStorage); }
function updateDiagnosticStatus(message = "") {
  const count = diagnosticRecords().length;
  diagnosticStatus.textContent = message || t(`Records on this device: ${count}`, `端末内の記録: ${count}件`);
}
async function copyText(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const field = document.createElement("textarea");
  field.value = text;
  field.setAttribute("readonly", "");
  field.style.position = "fixed";
  field.style.opacity = "0";
  document.body.append(field);
  field.select();
  const copied = document.execCommand("copy");
  field.remove();
  if (!copied) throw new Error("Clipboard unavailable");
}
async function copyDiagnostic(value, successMessage) {
  try {
    await copyText(Diagnostics.stringify(value));
    updateDiagnosticStatus(successMessage);
    announce(successMessage);
  } catch {
    updateDiagnosticStatus(t("Could not copy.", "コピーできませんでした"));
    announce(t("Could not copy the diagnostic JSON.", "診断JSONをコピーできませんでした"));
  }
}
function tone(freq = 300, duration = .05) {
  if (!sound) return;
  audio ||= new (window.AudioContext || window.webkitAudioContext)();
  const osc = audio.createOscillator(); const gain = audio.createGain();
  osc.type = "square"; osc.frequency.value = freq; gain.gain.value = .025;
  osc.connect(gain); gain.connect(audio.destination); osc.start(); gain.gain.exponentialRampToValueAtTime(.001, audio.currentTime + duration); osc.stop(audio.currentTime + duration);
}

function rowFor(player, row) {
  if (player === 1) return row === E.BACK ? 0 : 1;
  return row === E.FRONT ? 2 : 3;
}

function screenIndex(player, index) { return player === 1 ? 7 - index : index; }

function pitPoint(position) {
  return {
    x: PIT_X[screenIndex(position.player, position.index)],
    y: ROW_Y[rowFor(position.player, position.row)],
  };
}

function handPoint(player) {
  return player === 0 ? { x: 590, y: 43 } : { x: 590, y: 18 };
}

function samePosition(a, b) {
  return a && b && a.player === b.player && a.row === b.row && a.index === b.index;
}

function positionFromPoint(x, y) {
  for (let player = 0; player < 2; player += 1) for (let row = 0; row < 2; row += 1) {
    const sy = ROW_Y[rowFor(player, row)];
    for (let index = 0; index < 8; index += 1) {
      const sx = PIT_X[screenIndex(player, index)];
      if ((x - sx) ** 2 + (y - sy) ** 2 <= 31 ** 2) return { player, row, index };
    }
  }
  return null;
}

function moveLabel(move) {
  const choiceSide = choiceDirection(move);
  const dir = choiceSide === "left" ? "← LEFT" : "RIGHT →";
  const capture = move.type === "capture" ? " CAPTURE" : "";
  const house = move.houseChoice === "use" ? " / NYUMBA USE" : move.houseChoice === "stop" ? " / NYUMBA STOP" : "";
  return `${dir}${capture}${house}`;
}

function choiceDirection(move) {
  return move.type === "capture" && move.side ? move.side : move.direction;
}

function expandedChoices(list) { return E.moveVariants(state, list); }

function choosePit(position) {
  if (!started || animation || isAIActive() || state.winner !== null
    || !isHumanTurn() || position.player !== state.player) return;
  const found = moves.filter((move) => move.row === position.row && move.index === position.index);
  if (!found.length) { tone(110); return; }
  selected = position;
  choices = expandedChoices(found);
  tone(340);
  helpNode.textContent = choices.length === 1
    ? t("Confirm this move", "選択を確定してください")
    : t("Choose a sowing direction", "蒔く方向を選んでください");
  announce(t(`${pitName(position)} selected. Choose a sowing direction.`, `${pitName(position)}を選択。蒔く方向を選んでください`));
}

function stopWorker() {
  if (aiWorker) aiWorker.terminate();
  aiWorker = null;
}

function cancelAI() {
  clearTimeout(aiTimer);
  aiTimer = null;
  aiGeneration += 1;
  setAIThinking(false);
  stopWorker();
}

function acceptAIMove(request, result) {
  if (request.id !== aiGeneration || !aiThinking) return;
  if (!started || !isComputerGame() || state.player === humanPlayer || state.winner !== null) {
    setAIThinking(false);
    return;
  }
  if (AI.stateKey(state) !== request.positionKey || result.positionKey !== request.positionKey) {
    setAIThinking(false);
    helpNode.textContent = t("Discarded a stale COM search result", "古いCOMの思考結果を破棄しました");
    return;
  }
  setAIThinking(false);
  if (!result.move) return;
  try {
    E.applyMove(state, result.move);
    lastAIDiagnostic = Diagnostics.createSnapshot(request.state, {
      mode: gameModeSelect.value,
      ai: {
        level: request.level,
        profile: request.options.evaluationProfile || "bao",
        move: result.move,
        stats: result.stats,
      },
    });
    updateAIGenerationBadge();
    playMove(result.move);
  } catch {
    helpNode.textContent = t("Could not verify the COM move", "COMの着手を検証できませんでした");
    announce(t("COM move error", "COMの着手エラーです"));
  }
}

function runAIFallback(request) {
  if (request.fallbackStarted) return;
  request.fallbackStarted = true;
  setTimeout(() => {
    if (request.id !== aiGeneration) return;
    try {
      const analysis = AI.analyzeMove(
        request.state, request.level, Math.random, request.options,
      );
      acceptAIMove(request, {
        positionKey: request.positionKey,
        move: analysis.move,
        stats: analysis.stats,
      });
    } catch {
      setAIThinking(false);
      helpNode.textContent = t("An error occurred while COM was thinking", "COMの思考処理でエラーが発生しました");
    }
  }, 0);
}

function startAI() {
  const request = {
    type: "search",
    id: ++aiGeneration,
    state: E.clone(state),
    level: difficultySelect.value,
    options: AIConfig.searchOptions(difficultySelect.value, navigator, state),
    positionKey: AI.stateKey(state),
  };
  setAIThinking(true);
  if (typeof Worker === "undefined") { runAIFallback(request); return; }
  try {
    aiWorker = new Worker("./ai-release-worker.js");
    aiWorker.addEventListener("message", (event) => {
      if (event.data?.id !== request.id) return;
      stopWorker();
      if (event.data.type === "result") acceptAIMove(request, event.data);
      else runAIFallback(request);
    });
    aiWorker.addEventListener("error", () => {
      if (request.id !== aiGeneration) return;
      stopWorker();
      runAIFallback(request);
    }, { once: true });
    aiWorker.postMessage(request);
  } catch {
    stopWorker();
    runAIFallback(request);
  }
}

function playMove(move) {
  const result = E.applyMove(state, move);
  selected = null; choices = []; choiceBoxes = [];
  if (fast) {
    state = result.state; displayState = E.clone(state); afterMove(); return;
  }
  animation = {
    events: result.events,
    index: 0,
    result: result.state,
    nextAt: performance.now(),
    current: null,
    lastPosition: null,
  };
  helpNode.textContent = t("Sowing KETE…", "KETEを蒔いています…");
  tone(move.type === "capture" ? 520 : 300, .08);
}

function afterMove() {
  animation = null;
  moves = E.legalMoves(state);
  if (!started) return;
  if (state.winner !== null) {
    const name = state.winner === 0 ? "SOUTH" : "NORTH";
    helpNode.textContent = `${name} WINS!`;
    announce(t(`${name} wins.`, `${name}の勝ちです`)); tone(740, .18);
  } else if (moves.length === 1 && moves[0].type === "pass") {
    playMove(moves[0]);
  } else if (isComputerGame() && state.player !== humanPlayer) {
    helpNode.textContent = t(`${playerName(state.player)} is thinking…`, `${playerName(state.player)}が考えています…`);
    announce(t("COM is thinking", "COMが考えています"));
    setAIThinking(true);
    aiTimer = setTimeout(() => {
      aiTimer = null;
      startAI();
    }, fast ? 40 : 350);
  } else {
    const name = playerName(state.player);
    helpNode.textContent = t(`${name}'s turn — choose a highlighted pit`, `${name}の手番 — 光っている穴を選んでください`);
    announce(t(`${name}'s turn. Choose an available pit.`, `${name}の手番。選べる穴を選んでください`));
  }
}

function pitName(p) { return `${p.player === 0 ? (p.row === 0 ? "A" : "B") : (p.row === 0 ? "a" : "b")}${p.index + 1}`; }
function rect(x, y, w, h, color) { ctx.fillStyle = color; ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); }
function label(value, x, y, size = 12, align = "left", color = C.ink) { ctx.fillStyle = color; ctx.font = `bold ${size}px "Courier New", "MS Gothic", monospace`; ctx.textAlign = align; ctx.textBaseline = "middle"; ctx.fillText(value, x, y); }
function cueScale() {
  const cssScale = (canvas.clientWidth || canvas.width) / canvas.width;
  return Math.min(2.2, Math.max(1, 1 / Math.max(cssScale, .45)));
}

function draw(now) {
  rect(0, 0, 640, 330, C.sky);
  drawHeader();
  ctx.save(); ctx.translate(0, -66);
  drawBoard();
  if (animation?.current) drawAnimationCue(now);
  if (state.winner !== null && !animation) drawWinner();
  ctx.restore();
  drawChoices();
}

function drawHeader() {
  turnNumber.textContent = `TURN ${displayState.turn}`;
  turnNameNode.textContent = displayState.player === 0 ? "▼ SOUTH" : "▲ NORTH";
  phaseNode.textContent = displayState.phase.toUpperCase();
  northHand.textContent = displayState.reserve[1];
  southHand.textContent = displayState.reserve[0];
}

function drawBoard() {
  rect(26, 76, 588, 278, C.mid);
  rect(32, 82, 576, 266, C.gold);
  rect(38, 88, 564, 254, "#78905e");
  rect(38, 211, 564, 8, C.ink);


  for (let player = 0; player < 2; player += 1) for (let row = 0; row < 2; row += 1) {
    for (let index = 0; index < 8; index += 1) drawPit(player, row, index);
  }
  label("KICHWA", PIT_X[0], 373, Math.min(18, 11 * cueScale()), "center", C.ink);
  label("NYUMBA", PIT_X[4], 373, Math.min(18, 11 * cueScale()), "center", C.ink);
  label("KICHWA", PIT_X[7], 373, Math.min(18, 11 * cueScale()), "center", C.ink);
}

function drawPit(player, row, index) {
  const x = PIT_X[screenIndex(player, index)], y = ROW_Y[rowFor(player, row)];
  const count = displayState.pits[player][row][index];
  const isLegal = !animation && !isAIActive() && isHumanTurn()
    && moves.some((m) => m.row === row && m.index === index && player === state.player);
  const isSelected = selected && selected.player === player && selected.row === row && selected.index === index;
  const isActive = samePosition(animation?.current?.position, { player, row, index });
  ctx.beginPath(); ctx.arc(x, y, index === E.HOUSE && row === E.FRONT ? 29 : 25, 0, Math.PI * 2);
  ctx.fillStyle = isSelected ? C.pale : C.ink; ctx.fill();
  ctx.lineWidth = isActive ? 5 : isSelected ? 5 : isLegal ? 4 : 2;
  ctx.strokeStyle = isActive ? C.red : isSelected ? C.pale : isLegal ? C.gold : C.soft;
  ctx.stroke();
  if (isActive) {
    const scale = cueScale();
    ctx.beginPath();
    ctx.arc(x, y, 34 * scale, 0, Math.PI * 2);
    ctx.setLineDash([5, 4]);
    ctx.lineWidth = 2;
    ctx.strokeStyle = C.pale;
    ctx.stroke();
    ctx.setLineDash([]);
  }
  if (row === E.FRONT && index === E.HOUSE) {
    ctx.strokeStyle = displayState.houseOwned[player] ? C.pale : C.red; ctx.lineWidth = 2; ctx.strokeRect(x - 31, y - 31, 62, 62);
  }
  label(String(count), x, y - 1, count > 99 ? Math.min(24, 19 * cueScale()) : Math.min(31, 23 * cueScale()), "center", isSelected ? C.ink : C.pale);
  const nameOffset = player === 0 ? -1 : 1;
  label(
    pitName({ player, row, index }),
    x + nameOffset * 21,
    y + nameOffset * 26,
    Math.min(16, 11 * cueScale()),
    "center",
    C.ink,
  );
}

function drawAnimationCue(now) {
  const cue = animation.current;
  const scale = cueScale();
  if (cue.flight) {
    const progress = Math.min(1, Math.max(0, (now - cue.startedAt) / cue.duration));
    const ease = progress < .5 ? 2 * progress * progress : 1 - ((-2 * progress + 2) ** 2) / 2;
    const arc = Math.sin(progress * Math.PI) * 18 * scale;
    const x = cue.flight.from.x + (cue.flight.to.x - cue.flight.from.x) * ease;
    const y = cue.flight.from.y + (cue.flight.to.y - cue.flight.from.y) * ease - arc;
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#071011aa";
    ctx.beginPath();
    ctx.moveTo(cue.flight.from.x, cue.flight.from.y);
    ctx.lineTo(cue.flight.to.x, cue.flight.to.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x, y, 8 * scale, 0, Math.PI * 2);
    ctx.fillStyle = C.gold;
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = C.pale;
    ctx.stroke();
  }
  if (cue.label) {
    const width = 212 * scale;
    const height = 20 * scale;
    const x = 320 - width / 2;
    const y = 362;
    rect(x, y, width, height, C.ink);
    ctx.strokeStyle = C.gold;
    ctx.lineWidth = 1;
    ctx.strokeRect(x + .5, y + .5, width - 1, height - 1);
    label(cue.label, 320, y + height / 2, 10 * scale, "center", C.pale);
  }
}

function drawChoices() {
  if (renderedChoices === choices) return;
  renderedChoices = choices;
  directionPanel.replaceChildren();
  choices.forEach(move => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = moveLabel(move);
    button.addEventListener("click", () => {
      if (!animation && !isAIActive() && choices.includes(move)) playMove(move);
    });
    directionPanel.append(button);
  });
}

function drawWinner() {
  rect(118, 148, 404, 134, C.night); ctx.strokeStyle = C.gold; ctx.lineWidth = 4; ctx.strokeRect(122, 152, 396, 126);
  label(state.winner === 0 ? "SOUTH WINS!" : "NORTH WINS!", 320, 190, 28, "center", C.pale);
  const reason = state.reason === "front-empty" ? "OPPONENT FRONT ROW IS EMPTY" : state.reason === "no-move" ? "OPPONENT HAS NO LEGAL MOVE" : "RELAY SAFETY LIMIT";
  label(reason, 320, 231, 10, "center", C.gold);
  label(t("PRESS NEW GAME TO PLAY AGAIN", "NEW GAMEボタンでもう一度"), 320, 258, 10, "center", C.soft);
}

function animationDelay(eventCount, event) {
  const cssWidth = canvas.clientWidth || canvas.width;
  const mobileScale = cssWidth < 380 ? 1.8 : cssWidth < 520 ? 1.6 : 1;
  const motionScale = REDUCED ? 1.25 : 1;
  const scale = mobileScale * motionScale;
  if (event.kind !== "sow" && event.kind !== "reserve") return (eventCount > 120 ? 130 : 180) * scale;
  if (eventCount > 160) return 100 * scale;
  if (eventCount > 90) return 125 * scale;
  return 260 * scale;
}

function buildAnimationCue(event, now, duration) {
  const cue = { kind: event.kind, duration, startedAt: now, position: null, flight: null, label: "" };
  if (event.kind === "capture") {
    const position = { player: event.player, row: E.FRONT, index: event.index };
    cue.position = position;
    cue.label = `CAPTURE ${pitName(position)} (${event.count})`;
    animation.lastPosition = position;
    return cue;
  }
  if (event.position) {
    cue.position = event.position;
    if (event.kind === "reserve") {
      cue.flight = { from: handPoint(event.position.player), to: pitPoint(event.position) };
      cue.label = `HAND -> ${pitName(event.position)}`;
    } else if (event.kind === "sow") {
      const fromPosition = animation.lastPosition || event.position;
      cue.flight = { from: pitPoint(fromPosition), to: pitPoint(event.position) };
      cue.label = `${pitName(event.position)} +1`;
    } else {
      cue.label = `${event.kind.toUpperCase()} ${pitName(event.position)} (${event.count})`;
    }
    animation.lastPosition = event.position;
    return cue;
  }
  animation.lastPosition = null;
  cue.label = event.kind.toUpperCase();
  return cue;
}

function loop(now) {
  if (animation && now >= animation.nextAt) {
    const event = animation.events[animation.index];
    if (event) {
      const duration = animationDelay(animation.events.length, event);
      displayState = E.clone(event.state);
      animation.current = buildAnimationCue(event, now, duration);
      animation.index += 1;
      animation.nextAt = now + duration;
      if (event.kind === "capture") tone(600, .035); else if (event.kind === "sow") tone(210 + (animation.index % 5) * 25, .018);
    } else { state = animation.result; displayState = E.clone(state); afterMove(); }
  }
  draw(now); requestAnimationFrame(loop);
}

canvas.addEventListener("pointerdown", (event) => {
  event.preventDefault(); canvas.focus();
  const bounds = canvas.getBoundingClientRect();
  const x = (event.clientX - bounds.left) * canvas.width / bounds.width;
  const y = (event.clientY - bounds.top) * canvas.height / bounds.height + 66;
  const box = choiceBoxes.find((item) => x >= item.x && x <= item.x + item.w && y >= item.y && y <= item.y + item.h);
  if (box) { playMove(box.move); return; }
  const position = positionFromPoint(x, y); if (position) choosePit(position);
});

canvas.addEventListener("keydown", (event) => {
  if (event.key === "Escape") { selected = null; choices = []; helpNode.textContent = t("Selection cancelled", "選択を取り消しました"); }
  if ((event.key === "Enter" || event.key === " ") && choices.length === 1) { event.preventDefault(); playMove(choices[0]); return; }
  if ((event.key === "Enter" || event.key === " ") && selected && !choices.length) { event.preventDefault(); choosePit(selected); return; }
  if (event.key === "ArrowLeft" && choices.length) { event.preventDefault(); const move = choices.find((m) => choiceDirection(m) === "left"); if (move) playMove(move); }
  if (event.key === "ArrowRight" && choices.length) { event.preventDefault(); const move = choices.find((m) => choiceDirection(m) === "right"); if (move) playMove(move); }
  if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key) && !choices.length
    && !animation && !isAIActive() && isHumanTurn()) {
    event.preventDefault();
    const available = [...new Map(moves.filter((m) => m.type !== "pass").map((m) => [`${m.row}:${m.index}`, { player: state.player, row: m.row, index: m.index }])).values()];
    if (!available.length) return;
    const current = selected ? available.findIndex((p) => p.row === selected.row && p.index === selected.index) : -1;
    const step = event.key === "ArrowLeft" || event.key === "ArrowUp" ? -1 : 1;
    selected = available[(current + step + available.length) % available.length];
    helpNode.textContent = t(`${pitName(selected)} — Press Enter to select`, `${pitName(selected)} — Enterで選択`);
    announce(t(`${pitName(selected)} selected. Press Enter to confirm.`, `${pitName(selected)}を選択中。Enterで決定`));
    tone(300);
  }
});

function resetGame() {
  cancelAI();
  lastAIDiagnostic = null;
  state = E.initialState(); displayState = E.clone(state); moves = E.legalMoves(state);
  selected = null; choices = []; choiceBoxes = []; animation = null; afterMove();
}

document.querySelector("#new-game").addEventListener("click", () => {
  if (animation || state.turn > 1) {
    if (!confirm(t("End the current game and start a new one?", "現在の対局を終了して、新しい対局を始めますか？"))) return;
  }
  cancelAI(); animation = null; started = false;
  selected = null; choices = []; choiceBoxes = [];
  startScreen.hidden = false;
  helpNode.textContent = t("Choose game settings, then press START GAME", "対局設定を選んでSTART GAMEを押してください");
});
difficultySelect.value = load("bao_ai_level", "normal");
difficultySelect.addEventListener("change", () => save("bao_ai_level", difficultySelect.value));
gameModeSelect.value = load("bao_game_mode", "computer");
difficultyField.hidden = !isComputerGame();
sideField.hidden = !isComputerGame();
updateAIGenerationBadge();
playerSideSelect.value = load("bao_player_side", "first");
playerSideSelect.addEventListener("change", () => save("bao_player_side", playerSideSelect.value));
gameModeSelect.addEventListener("change", () => {
  save("bao_game_mode", gameModeSelect.value);
  difficultyField.hidden = !isComputerGame();
  sideField.hidden = !isComputerGame();
  updateAIGenerationBadge();
});
startButton.addEventListener("click", () => {
  save("bao_game_mode", gameModeSelect.value);
  save("bao_ai_level", difficultySelect.value);
  save("bao_player_side", playerSideSelect.value);
  humanPlayer = playerSideSelect.value === "second" ? 1 : 0;
  started = true;
  startScreen.hidden = true;
  resetGame();
  canvas.focus();
});
soundButton.addEventListener("click", () => { sound = !sound; save("bao_sound", sound ? "on" : "off"); soundButton.textContent = `SOUND ${sound ? "ON" : "OFF"}`; soundButton.setAttribute("aria-pressed", String(sound)); if (sound) tone(); });
speedButton.addEventListener("click", () => { fast = !fast; speedButton.textContent = `FAST ${fast ? "ON" : "OFF"}`; speedButton.setAttribute("aria-pressed", String(fast)); });
copyPositionButton.addEventListener("click", () => {
  const snapshot = Diagnostics.createSnapshot(state, { mode: gameModeSelect.value });
  copyDiagnostic(snapshot, t("Copied current position.", "現在局面をコピーしました"));
});
markAIMoveButton.addEventListener("click", () => {
  if (!lastAIDiagnostic) {
    updateDiagnosticStatus(t("No AI move is available to record yet", "記録できるAI着手がまだありません"));
    announce(t("There is no previous AI move", "直前のAI着手がありません"));
    return;
  }
  const marked = { ...lastAIDiagnostic, reason: "unexpected-ai-move" };
  const records = Diagnostics.markSnapshot(localStorage, marked);
  updateDiagnosticStatus(t(`AI move saved (on this device: ${records.length})`, `AI着手を保存しました（端末内: ${records.length}件）`));
  announce(t("Saved the previous AI move on this device", "直前のAI着手をこの端末に保存しました"));
});
copyMarkedButton.addEventListener("click", () => {
  const records = diagnosticRecords();
  if (!records.length) {
    updateDiagnosticStatus(t("There are no records to copy", "コピーする記録がありません"));
    announce(t("There are no AI diagnostic records on this device", "端末内のAI診断記録はありません"));
    return;
  }
  copyDiagnostic(records, t(`Copied ${records.length} record(s).`, `${records.length}件の記録をコピーしました`));
});
clearMarkedButton.addEventListener("click", () => {
  const count = diagnosticRecords().length;
  if (!count) { updateDiagnosticStatus(); return; }
  if (!confirm(t(`Delete ${count} AI diagnostic record(s) from this device?`, `${count}件の端末内AI診断記録を削除しますか？`))) return;
  Diagnostics.clearMarked(localStorage);
  updateDiagnosticStatus(t("Deleted records from this device", "端末内の記録を削除しました"));
  announce(t("Deleted AI diagnostic records from this device", "端末内のAI診断記録を削除しました"));
});
soundButton.textContent = `SOUND ${sound ? "ON" : "OFF"}`;
soundButton.setAttribute("aria-pressed", String(sound));
if ("serviceWorker" in navigator && location.protocol !== "file:") window.addEventListener("load", () => navigator.serviceWorker.register("./service-worker.js"));

helpNode.textContent = t("Choose game settings, then press START GAME", "対局設定を選んでSTART GAMEを押してください");
setAIThinking(false);
updateDiagnosticStatus();
requestAnimationFrame(loop);
