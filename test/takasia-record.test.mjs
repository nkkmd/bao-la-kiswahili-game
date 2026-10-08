import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import crypto from "node:crypto";
import { createRequire } from "node:module";
import { handleRequest, validateRecord, replayAndVerify } from "../cloudflare/game-record-ingest/src/index.mjs";
const require = createRequire(import.meta.url);
const E = require("../public/engine.js");
const L = require("../public/engine-r002.js");
const Rules = require("../public/rule-versions.js");
const G = require("../public/game-record.js");
const Replay = require("../public/game-record-replay.js");
const D = require("../public/diagnostics.js");
const Contribution = require("../public/game-record-contribution.js");
const Converter = require("../tools/diagnostic-to-fixture.js");
const fixtures = JSON.parse(fs.readFileSync("tools/takasia/record-fixtures.json", "utf8"));
const e30 = JSON.parse(fs.readFileSync("tools/takasia/fixtures.json", "utf8")).e30;
const clone = (value) => structuredClone(value);
const reverseKeys = (value) => Array.isArray(value) ? value.map(reverseKeys)
  : value && typeof value === "object" ? Object.fromEntries(Object.entries(value).reverse().map(([key,entry])=>[key,reverseKeys(entry)])) : value;
const blobSha = (source) => crypto.createHash("sha1").update(`blob ${Buffer.byteLength(source)}\0${source}`).digest("hex");

test("旧再生エンジンは固定mainから公開名だけを変えた内容である", () => {
  const source = fs.readFileSync("public/engine-r002.js", "utf8");
  assert.equal(blobSha(source.replace("root.BaoLegacyEngine = api;", "root.BaoEngine = api;")), fixtures.sources.legacyEngineBlob);
  assert.equal(typeof L.detectTakasia, "undefined");
  assert.equal(globalThis.BaoEngine, E);
});

for (const name of ["legacy", "current"]) test(`保存・viewer・通常／軽量・受信の全着手と最終局面が一致する: ${name}`, () => {
  const { record } = fixtures[name]; const before = clone(record);
  assert.equal(G.validateRecord(record), true);
  const session = Replay.parseText(JSON.stringify(record), E);
  const expectedEngine = name === "legacy" ? L : E;
  assert.equal(session.engine, expectedEngine);
  let light = clone(record.initialPosition);
  for (let i = 0; i < record.moves.length; i++) {
    light = expectedEngine.applyMoveForSearch(light, record.moves[i].move).state;
    assert.deepEqual(light, session.states[i + 1]);
  }
  assert.deepEqual(G.replay(record, E), record.finalPosition);
  assert.deepEqual(session.states.at(-1), record.finalPosition);
  assert.equal(validateRecord(record), true);
  assert.equal(replayAndVerify(record), true);
  assert.equal(Contribution.verifyLocally(record), true);
  assert.deepEqual(record, before);
});

test("標準初期局面からtakasia成立・対象で停止・失効を実際に再生する", () => {
  const session = Replay.buildSession(fixtures.current.record, E);
  const active = session.states.findIndex((state) => state.takasia);
  assert.ok(active > 0); assert.equal(fixtures.current.activated, 1);
  const saved = Replay.seek(session, active);
  assert.deepEqual(saved.takasia, session.states[active].takasia);
  saved.takasia.index = 99;
  assert.notEqual(session.states[active].takasia.index, 99);
  const result = session.engine.applyMove(session.states[active], session.record.moves[active].move);
  assert.ok(result.events.some((event) => event.kind === "takasia" && event.action === "stop"));
  assert.equal(result.state.takasia, null);
  assert.deepEqual(result.state, session.states[active + 1]);
});

test("JSONの項目順が異なっても新旧棋譜の値を正しく検証する", () => {
  for(const name of ["current","legacy"]) {
    const record=reverseKeys(fixtures[name].record);
    assert.equal(validateRecord(record),true);
    assert.equal(replayAndVerify(record),true);
    assert.equal(Contribution.verifyLocally(record),true);
    assert.deepEqual(Replay.buildSession(record,E).states.at(-1),record.finalPosition);
  }
});

test("旧棋譜を新版へ付け替えても同じ棋譜とは認めない", () => {
  const record = clone(fixtures.legacy.record);
  record.version = 2; record.rules = clone(Rules.CURRENT_RULES);
  record.initialPosition.takasia = null; record.finalPosition.takasia = null;
  assert.throws(() => Replay.buildSession(record, E), /illegal|mismatch/);
  assert.throws(() => replayAndVerify(record), /illegal|mismatch/);
});

test("形式版・ルール版の組合せ、未知の版、旧エンジン混在を拒否する", () => {
  for (const name of ["legacy", "current"]) {
    const record = clone(fixtures[name].record);
    record.version = name === "legacy" ? 2 : 1;
    assert.throws(() => G.validateRecord(record), /Unsupported/);
    assert.throws(() => validateRecord(record), /Unsupported/);
  }
  const record = clone(fixtures.current.record); record.rules.baseline = "R-999";
  assert.throws(() => Replay.buildSession(record, E), /Unsupported/);
  assert.throws(() => Rules.engineFor(2, Rules.CURRENT_RULES, L), /Takasia engine/);
});

test("新版のtakasia項目欠落と旧版への項目注入を拒否する", () => {
  const current = clone(fixtures.current.record); delete current.initialPosition.takasia;
  assert.throws(() => Replay.buildSession(current, E), /fields/);
  assert.throws(() => validateRecord(current), /Missing field/);
  const old = clone(fixtures.legacy.record); old.finalPosition.takasia = null;
  assert.throws(() => G.validateRecord(old), /fields/);
  assert.throws(() => validateRecord(old), /Unexpected field/);
});

test("takasiaの型・対象手番・範囲・phase・終局・未知項目を拒否する", () => {
  const changes = [
    s => { s.takasia = 3; }, s => { s.takasia.index = 8; }, s => { s.takasia.player = 0; },
    s => { s.phase = "namua"; }, s => { s.winner = 0; }, s => { s.takasia.note = "hidden"; },
    s => { s.reserve = [1, 0]; }, s => { s.takasia.index = 4; s.houseOwned[1] = true; },
  ];
  for (const change of changes) {
    const position = clone(e30.post); change(position);
    assert.throws(() => Rules.validatePosition(position, Rules.CURRENT_REVISION), /takasia/);
    assert.throws(() => D.stateFromSnapshot({ format: "bao-ai-diagnostic", version: 2, rules: Rules.CURRENT_RULES, position }), /takasia/);
  }
});

test("新棋譜の着手・結果の改ざんをviewerと受信で検出する", () => {
  for (const change of [r => {r.moves[3].turn++;}, r => {r.result.plies--;}, r => {r.finalPosition.turn++;}, r => {r.moves[0].move.houseChoice="stop";}]) {
    const record=clone(fixtures.current.record);change(record);
    assert.throws(() => Replay.buildSession(record,E), /mismatch|illegal/);
    assert.throws(() => replayAndVerify(record), /mismatch|match|illegal|choice/);
  }
});

test("診断v2は対象と改訂統計を往復し、v1は旧ルールと識別する", () => {
  const snapshot = D.createSnapshot(e30.post, {ai:{level:"hard", stats:{ruleRevision:Rules.CURRENT_REVISION, aiRevision:"AI-GEN4-TAKASIA-001", nodes:100, privateNote:"excluded"}}});
  assert.equal(snapshot.version,2); assert.deepEqual(snapshot.rules,Rules.CURRENT_RULES);
  assert.deepEqual(D.stateFromSnapshot(JSON.parse(D.stringify(snapshot))),e30.post);
  assert.equal(snapshot.ai.stats.ruleRevision,Rules.CURRENT_REVISION);
  assert.equal(snapshot.ai.stats.aiRevision,"AI-GEN4-TAKASIA-001");
  assert.equal(snapshot.ai.stats.privateNote,undefined);
  const old={format:"bao-ai-diagnostic",version:1,position:fixtures.legacy.record.initialPosition};
  assert.deepEqual(D.stateFromSnapshot(old),old.position);
  assert.deepEqual(D.rulesFromSnapshot(old),Rules.LEGACY_RULES);
  assert.match(Converter.fixtureTemplate(snapshot), /ruleRevision: "BAO-RULES-V0.2.0-TAKASIA-001"/);
  assert.match(Converter.fixtureTemplate(old), /ruleRevision: "R-002"/);
  const mixed=clone(snapshot);mixed.ai.stats.ruleRevision="R-002";
  assert.throws(()=>D.stateFromSnapshot(mixed),/mismatch/);
  old.position=clone(e30.post);assert.throws(()=>D.stateFromSnapshot(old),/fields/);
});

test("新旧診断を同じ端末記録へ保持しても版の意味を変更しない", () => {
  const data=new Map();const storage={getItem:k=>data.get(k),setItem:(k,v)=>data.set(k,v)};
  const old={format:"bao-ai-diagnostic",version:1,position:clone(fixtures.legacy.record.initialPosition)};
  const current=D.createSnapshot(e30.post);
  D.markSnapshot(storage,old);D.markSnapshot(storage,current);
  assert.deepEqual(D.readMarked(storage),[old,current]);
});

test("旧棋譜の閲覧局面を診断保存しても新ルールへ付け替えない", async () => {
  const source=fs.readFileSync("public/main.js","utf8");
  const code=source.slice(source.indexOf('copyPositionButton.addEventListener('),source.indexOf('markAIMoveButton.addEventListener('));
  let callback, saved;
  const context=vm.createContext({copyPositionButton:{addEventListener:(_event,cb)=>{callback=cb;}},
    state:clone(fixtures.legacy.record.initialPosition),Diagnostics:D,gameModeSelect:{value:"replay"},
    isReplayMode:()=>true,replaySession:{record:fixtures.legacy.record},
    copyDiagnostic:value=>{saved=clone(value);},updateDiagnosticStatus(){},announce(){},t:english=>english});
  vm.runInContext(code,context);await callback();
  assert.equal(saved.version,1);assert.equal(saved.rules,undefined);
  assert.equal(Object.hasOwn(saved.position,"takasia"),false);
  assert.deepEqual(D.rulesFromSnapshot(saved),Rules.LEGACY_RULES);
});

test("ブラウザーでも旧エンジンを隔離し新旧棋譜を選択する", () => {
  const context=vm.createContext({console});context.window=context;
  for(const file of ["engine.js","engine-r002.js","rule-versions.js","game-record.js","game-record-replay.js"])
    vm.runInContext(fs.readFileSync(`public/${file}`,"utf8"),context);
  context.oldText=JSON.stringify(fixtures.legacy.record);context.newText=JSON.stringify(fixtures.current.record);
  assert.equal(vm.runInContext("BaoGameRecordReplay.parseText(oldText, BaoEngine).engine === BaoLegacyEngine",context),true);
  assert.equal(vm.runInContext("BaoGameRecordReplay.parseText(newText, BaoEngine).engine === BaoEngine",context),true);
  assert.equal(vm.runInContext("typeof BaoEngine.detectTakasia",context),"function");
});

test("進むの実コードは検証時に選択した旧ルールでアニメーションを作る", () => {
  const source=fs.readFileSync("public/main.js","utf8");
  const code=source.slice(source.indexOf("function playMove(move) {"),source.indexOf("function afterMove()"));
  const old=fixtures.legacy.record;const expected=L.applyMove(old.initialPosition,old.moves[0].move);
  const context=vm.createContext({state:clone(old.initialPosition),E:{applyMove(){throw Error("wrong engine");}},replaySession:{engine:L},isReplayMode:()=>true,fast:false,
    selected:null,choices:[],choiceBoxes:[],latestRuleCommentary:null,animation:null,performance:{now:()=>0},applyRuleCommentary(){},moveRuleCommentary(){},tone(){}});
  vm.runInContext(code,context);context.move=old.moves[0].move;vm.runInContext("playMove(move)",context);
  assert.deepEqual(JSON.parse(JSON.stringify(context.animation.events)),expected.events);
  assert.deepEqual(JSON.parse(JSON.stringify(context.animation.result)),expected.state);
});

test("新しい依存資産はscript順とPWAキャッシュへ含まれる", () => {
  const html=fs.readFileSync("public/index.html","utf8");
  assert.ok(html.indexOf('./engine-r002.js')<html.indexOf('./rule-versions.js'));
  assert.ok(html.indexOf('./rule-versions.js')<html.indexOf('./diagnostics.js'));
  const files=vm.runInNewContext(fs.readFileSync("public/service-worker.js","utf8")+"\nFILES;",{URL,self:{registration:{scope:"https://example.test/"},addEventListener(){}}});
  for(const file of ["engine-r002.js","rule-versions.js"])assert.ok(files.includes(`./${file}`));
});

test("v2のR2保存・版メタデータ・重複判定は新状態を落とさない", async () => {
  const objects=new Map();let sequence=0;
  const view=entry=>entry ? {etag:entry.etag,text:async()=>entry.text}:null;
  const env={COLLECTION_ENABLED:"true",ALLOWED_ORIGINS:"https://example.test",TURNSTILE_HOSTNAMES:"example.test",TURNSTILE_SECRET_KEY:"test-secret",
    GAME_RECORDS:{head:async key=>view(objects.get(key)),get:async key=>view(objects.get(key)),put:async(key,text,options)=>{
      const old=objects.get(key);if(options.onlyIf instanceof Headers && old)return null;
      if(options.onlyIf?.etagMatches && old?.etag!==options.onlyIf.etagMatches)return null;
      const entry={etag:String(++sequence),text,options};objects.set(key,entry);return view(entry);
    }}};
  const request=record=>new Request("https://collector.example/v1/game-records",{method:"POST",headers:{Origin:"https://example.test","Content-Type":"application/json"},body:JSON.stringify({record,turnstileToken:"test-turnstile-token",consent:{version:1,purpose:"ai-improvement"}})});
  const previous=globalThis.fetch;globalThis.fetch=async()=>Response.json({success:true,action:"game_record_contribution",hostname:"example.test"});
  try {
    const record=clone(fixtures.current.record);
    assert.equal((await handleRequest(request(record),env)).status,201);
    assert.equal((await handleRequest(request(reverseKeys(record)),env)).status,200);
    const entries=[...objects.entries()].filter(([key])=>key.startsWith("records/"));
    assert.equal(entries.length,1);assert.ok(entries[0][0].startsWith("records/v2/"));
    const entry=entries[0][1];assert.deepEqual(JSON.parse(entry.text),record);
    assert.equal(entry.options.customMetadata.version,"2");
    assert.equal(entry.options.customMetadata.ruleRevision,Rules.CURRENT_REVISION);
    assert.equal(entry.options.customMetadata.aiRevision,"AI-GEN4-TAKASIA-001");
    const invalid=clone(record);delete invalid.initialPosition.takasia;
    assert.equal((await handleRequest(request(invalid),env)).status,400);
    assert.equal([...objects.keys()].filter(key=>key.startsWith("records/")).length,1);
  } finally {globalThis.fetch=previous;}
});

test("新AIメタデータのルール混在と自由項目を拒否する", () => {
  for(const [key,value] of [["ruleRevision","R-002"],["memo","hidden"]]) {
    const record=clone(fixtures.current.record);record.settings.ai[key]=value;
    assert.throws(()=>Replay.buildSession(record,E),/mismatch|field/);
    assert.throws(()=>validateRecord(record),/mismatch|field/);
  }
});
