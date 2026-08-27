# PEOCR-STUDY1 — Current Status

更新日: 2026-08-27

## Status

**STUDY COMPLETE / FORMAL DECISION `INCONCLUSIVE` / SCIENTIFIC CLOSURE COMPLETE ON RESEARCH BRANCH**

## Identity

```text
Program = G2-01
Study ID = PEOCR-STUDY1
Research Generation = Research Generation 2
Baseline main = 9e9cb6e2525f09a873e741db9f8fa42696839fbe
Research branch = research/g2-01-position-evaluation-empirical-outcome-calibration-replication
Formal source commit = 5d1b4a40ef95ac639787aa0abf040a455c3c2995
Formal workflow run = 33038132423
Scientific closure commit = b651b98b6267ddfb6f7ac11814f3e23870c83404
```

## Stage closure

```text
Stage 0 = COMPLETE / STAGE0-TECHNICAL-PASS
Stage 1 = COMPLETE / MODEL-FROZEN-DEVELOPMENT
Stage 2 technical smoke = COMPLETE / PASS
Stage 2 formal generation = COMPLETE / 8192 games
Stage 2 independent verification = PASS
Stage 2 formal decision = INCONCLUSIVE
```

Failed prospectively frozen estimability gates:

```text
unique historical trajectories after Stage 1 firewall = 3898 < 4500
selected unique RAW states = 3570 < 4000
Mtaji selected states = 1747 < 1750
```

All 8 shard independent replays、integrated selection/measurement verification、Stage 1 overlap trajectory/opening/RAW = 0/0/0、outcome-count gates、administrative truncation 0、source/hash bindingはPASSした。

Because estimability gates did not all pass, the co-primary Brier/log-loss formal branch was not entered and canonical `primary` is `null`. `NOT-CONFIRMED` is not an authorized label.

## Canonical evidence

```text
artifact ID = 9636207301
artifact ZIP SHA-256 = 056626968573aa8aa12adb4b84a1375c4bba8dd2b816f1464f4df8fa3abcb5b0
formal result SHA-256 = 42aab2a086b323c1dcb9e39b1187cdd5375dfc7251bd89e5ed2fd24409c35b0c
selection hash = eb3e65fd388168e6440eee7c64675face828d285755992f01bcf4b8c8879dbea
measurement hash = e3e6fe1d763f5ca2bf8b654ce39a4d3b3edda125e7e1eb92f9daee00c0f38294
```

## No-rescue boundary

No additional Stage 2 game, seed extension, overlap replacement, gate relaxation, mapping refit, near-miss exception, favorable subgroup, or alternate-primary relabeling is authorized within `PEOCR-STUDY1`.

Scientific closure is complete on the research branch. PR #67 remains the integration vehicle; merging to `main` is a repository integration step and does not alter the scientific decision.
