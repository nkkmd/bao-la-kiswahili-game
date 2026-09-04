# PEOCR-STUDY1 — 現在の状態

更新日: 2026-08-27

## 状態

**STUDY COMPLETE / FORMAL DECISION `INCONCLUSIVE` / SCIENTIFIC CLOSURE COMPLETE / INTEGRATED IN `main`**

## 研究識別子

```text
Program = G2-01
Study ID = PEOCR-STUDY1
Research Generation = Research Generation 2
Baseline main = 9e9cb6e2525f09a873e741db9f8fa42696839fbe
Research branch = research/g2-01-position-evaluation-empirical-outcome-calibration-replication
Formal source commit = 5d1b4a40ef95ac639787aa0abf040a455c3c2995
Formal workflow run = 33038132423
Scientific closure commit = b651b98b6267ddfb6f7ac11814f3e23870c83404
Integration PR = #67
Integration merge commit = 12ce1f5f212349cc827147adcb5de8e7eadb98f3
```

## Stageごとの終了状態

```text
Stage 0 = COMPLETE / STAGE0-TECHNICAL-PASS
Stage 1 = COMPLETE / MODEL-FROZEN-DEVELOPMENT
Stage 2 technical smoke = COMPLETE / PASS
Stage 2 formal generation = COMPLETE / 8192 games
Stage 2 independent verification = PASS
Stage 2 formal decision = INCONCLUSIVE
Repository integration = COMPLETE / main
```

事前に固定した推定可能性の判定条件のうち、次の3条件がFAILしました。

```text
unique historical trajectories after Stage 1 firewall = 3898 < 4500
selected unique RAW states = 3570 < 4000
Mtaji selected states = 1747 < 1750
```

一方、全8 shardのindependent replay、統合後のselection / measurement verification、Stage 1 overlap trajectory / opening / RAW = 0 / 0 / 0、outcome-count gates、administrative truncation 0、source / hash bindingはPASSしました。

すべてのestimability gateを満たさなかったため、co-primary Brier / log-loss formal branchには入っていません。canonical `primary`は`null`です。

したがって、`NOT-CONFIRMED`は本Studyで承認されたlabelではありません。

## canonical evidence （証拠と成果物）

```text
artifact ID = 9636207301
artifact ZIP SHA-256 = 056626968573aa8aa12adb4b84a1375c4bba8dd2b816f1464f4df8fa3abcb5b0
formal result SHA-256 = 42aab2a086b323c1dcb9e39b1187cdd5375dfc7251bd89e5ed2fd24409c35b0c
selection hash = eb3e65fd388168e6440eee7c64675face828d285755992f01bcf4b8c8879dbea
measurement hash = e3e6fe1d763f5ca2bf8b654ce39a4d3b3edda125e7e1eb92f9daee00c0f38294
```

## no-rescue boundary （解釈上の境界）

`PEOCR-STUDY1`内では、additional Stage 2 game、seed extension、overlap replacement、gate relaxation、mapping refit、near-miss exception、favorable subgroup、alternate-primary relabelingを行うことは承認されていません。

Scientific closureは完了しており、PR #67は`12ce1f5f212349cc827147adcb5de8e7eadb98f3`で`main`へ統合されています。

Repository integrationは、`PEOCR-STUDY1 = INCONCLUSIVE`という科学的判断や、いかなる解釈上の境界も変更しません。
