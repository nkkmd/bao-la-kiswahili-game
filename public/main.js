"use strict";

const E = window.BaoEngine;
const AI = window.BaoAI;
const AIConfig = window.BaoAIConfig;
const canvas = document.querySelector("#game");
const ctx = canvas.getContext("2d");
const statusNode = document.querySelector("#status");
const helpNode = document.querySelector("#visible-help");
const soundButton = document.querySelector("#sound");
const speedButton = document.querySelector("#speed");
const difficultySelect = document.querySelector("#difficulty");
const difficultyField = document.querySelector("#difficulty-field");
const gameModeSelect = document.querySelector("#game-mode");
const startScreen = document.querySelector("#start-screen");
const startButton = document.querySelector("#start-game");
const sideField = document.querySelector("#side-field");
const playerSideSelect = document.querySelector("#player-side");
ctx.imageSmoothingEnabled = false;

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

function isComputerGame() { return gameModeSelect.value === "computer"; }
function isHumanTurn() { return !isComputerGame() || state.player === humanPlayer; }
function isAIActive() { return aiThinking || aiTimer !== null; }
function setAIThinking(value) {
  aiThinking = value;
  canvas.setAttribute("aria-busy", String(value));
}
function playerName(player) {
  if (!isComputerGame()) return player === 0 ? "SOUTH" : "NORTH";
  const side = player === 0 ? "SOUTH" : "NORTH";
  return player === humanPlayer ? `${side}（あなた）` : `${side}（COM）`;
}

function load(key, fallback) { try { return localStorage.getItem(key) || fallback; } catch { return fallback; } }
function save(key, value) { try { localStorage.setItem(key, value); } catch { /* optional */ } }
function announce(message) { statusNode.textContent = ""; setTimeout(() => { statusNode.textContent = message; }, 20); }
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
  helpNode.textContent = choices.length === 1 ? "選択を確定してください" : "蒔く方向を選んでください";
  announce(`${pitName(position)}を選択。蒔く方向を選んでください`);
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
    helpNode.textContent = "古いCOMの思考結果を破棄しました";
    return;
  }
  setAIThinking(false);
  if (!result.move) return;
  try {
    E.applyMove(state, result.move);
    playMove(result.move);
  } catch {
    helpNode.textContent = "COMの着手を検証できませんでした";
    announce("COMの着手エラーです");
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
      helpNode.textContent = "COMの思考処理でエラーが発生しました";
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
    aiWorker = new Worker("./ai-worker.js");
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
  helpNode.textContent = "KETEを蒔いています…";
  tone(move.type === "capture" ? 520 : 300, .08);
}

function afterMove() {
  animation = null;
  moves = E.legalMoves(state);
  if (!started) return;
  if (state.winner !== null) {
    const name = state.winner === 0 ? "SOUTH" : "NORTH";
    helpNode.textContent = `${name} WINS!`;
    announce(`${name}の勝ちです`); tone(740, .18);
  } else if (moves.length === 1 && moves[0].type === "pass") {
    playMove(moves[0]);
  } else if (isComputerGame() && state.player !== humanPlayer) {
    helpNode.textContent = `${playerName(state.player)}が考えています…`;
    announce("COMが考えています");
    setAIThinking(true);
    aiTimer = setTimeout(() => {
      aiTimer = null;
      startAI();
    }, fast ? 40 : 350);
  } else {
    const name = playerName(state.player);
    helpNode.textContent = `${name}の手番 — 光っている穴を選んでください`;
    announce(`${name}の手番。選べる穴を選んでください`);
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
  rect(0, 0, 640, 430, C.sky);
  drawHeader(); drawBoard(); drawChoices();
  if (animation?.current) drawAnimationCue(now);
  if (state.winner !== null && !animation) drawWinner();
}

function drawHeader() {
  rect(0, 0, 640, 66, C.ink);
  const phase = displayState.phase.toUpperCase();
  label(`TURN ${displayState.turn}`, 20, 18, 11, "left", C.soft);
  label(phase, 320, 18, 12, "center", C.gold);
  label(`NORTH  HAND:${displayState.reserve[1]}`, 620, 18, 11, "right", C.pale);
  label(`SOUTH  HAND:${displayState.reserve[0]}`, 620, 43, 11, "right", C.pale);
  const turnName = displayState.player === 0 ? "▼ SOUTH" : "▲ NORTH";
  label(turnName, 20, 43, 14, "left", C.pale);
}

function drawBoard() {
  rect(26, 76, 588, 278, C.mid);
  rect(32, 82, 576, 266, C.gold);
  rect(38, 88, 564, 254, "#78905e");
  rect(38, 211, 564, 8, C.ink);
  label("NORTH", 14, 140, 10, "center", C.ink);
  label("SOUTH", 626, 290, 10, "center", C.ink);
  for (let player = 0; player < 2; player += 1) for (let row = 0; row < 2; row += 1) {
    for (let index = 0; index < 8; index += 1) drawPit(player, row, index);
  }
  label("KICHWA", PIT_X[0], 372, 9, "center", C.ink);
  label("NYUMBA", PIT_X[4], 372, 9, "center", C.ink);
  label("KICHWA", PIT_X[7], 372, 9, "center", C.ink);
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
  ctx.lineWidth = isActive ? 5 : isLegal ? 4 : 2;
  ctx.strokeStyle = isActive ? C.red : isLegal ? C.gold : C.soft;
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
  label(String(count), x, y - 1, count > 99 ? 13 : 17, "center", isSelected ? C.ink : C.pale);
  label(pitName({ player, row, index }), x, y + 37, 8, "center", C.ink);
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
  choiceBoxes = [];
  if (!choices.length || animation) return;
  const count = choices.length;
  const width = Math.min(200, (600 - (count - 1) * 8) / count);
  const total = count * width + (count - 1) * 8;
  choices.forEach((move, i) => {
    const x = 320 - total / 2 + i * (width + 8), y = 385;
    rect(x, y, width, 34, C.ink); ctx.strokeStyle = C.pale; ctx.strokeRect(x + .5, y + .5, width - 1, 33);
    label(moveLabel(move), x + width / 2, y + 17, count > 2 ? 8 : 10, "center", C.pale);
    choiceBoxes.push({ x, y, w: width, h: 34, move });
  });
}

function drawWinner() {
  rect(118, 148, 404, 134, C.night); ctx.strokeStyle = C.gold; ctx.lineWidth = 4; ctx.strokeRect(122, 152, 396, 126);
  label(state.winner === 0 ? "SOUTH WINS!" : "NORTH WINS!", 320, 190, 28, "center", C.pale);
  const reason = state.reason === "front-empty" ? "OPPONENT FRONT ROW IS EMPTY" : state.reason === "no-move" ? "OPPONENT HAS NO LEGAL MOVE" : "RELAY SAFETY LIMIT";
  label(reason, 320, 231, 10, "center", C.gold);
  label("NEW GAMEボタンでもう一度", 320, 258, 10, "center", C.soft);
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
  const y = (event.clientY - bounds.top) * canvas.height / bounds.height;
  const box = choiceBoxes.find((item) => x >= item.x && x <= item.x + item.w && y >= item.y && y <= item.y + item.h);
  if (box) { playMove(box.move); return; }
  const position = positionFromPoint(x, y); if (position) choosePit(position);
});

canvas.addEventListener("keydown", (event) => {
  if (event.key === "Escape") { selected = null; choices = []; helpNode.textContent = "選択を取り消しました"; }
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
    helpNode.textContent = `${pitName(selected)} — Enterで選択`;
    announce(`${pitName(selected)}を選択中。Enterで決定`);
    tone(300);
  }
});

function resetGame() {
  cancelAI();
  state = E.initialState(); displayState = E.clone(state); moves = E.legalMoves(state);
  selected = null; choices = []; choiceBoxes = []; animation = null; afterMove();
}

document.querySelector("#new-game").addEventListener("click", () => {
  if (animation || state.turn > 1) { if (!confirm("現在の対局を終了して、新しい対局を始めますか？")) return; }
  cancelAI(); animation = null; started = false;
  selected = null; choices = []; choiceBoxes = [];
  startScreen.hidden = false;
  helpNode.textContent = "対局設定を選んでSTART GAMEを押してください";
});
difficultySelect.value = load("bao_ai_level", "normal");
difficultySelect.addEventListener("change", () => save("bao_ai_level", difficultySelect.value));
gameModeSelect.value = load("bao_game_mode", "computer");
difficultyField.hidden = !isComputerGame();
sideField.hidden = !isComputerGame();
playerSideSelect.value = load("bao_player_side", "first");
playerSideSelect.addEventListener("change", () => save("bao_player_side", playerSideSelect.value));
gameModeSelect.addEventListener("change", () => {
  save("bao_game_mode", gameModeSelect.value);
  difficultyField.hidden = !isComputerGame();
  sideField.hidden = !isComputerGame();
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
soundButton.textContent = `SOUND ${sound ? "ON" : "OFF"}`;
soundButton.setAttribute("aria-pressed", String(sound));
if ("serviceWorker" in navigator && location.protocol !== "file:") window.addEventListener("load", () => navigator.serviceWorker.register("./service-worker.js"));
helpNode.textContent = "対局設定を選んでSTART GAMEを押してください";
setAIThinking(false);
requestAnimationFrame(loop);
