# Research Generation 3 — 現在の状態

更新日: 2026-09-04
Program: `Bao Third-Generation Research Program`（正式Program名）
状態: **`CLOSED / CORE G3-01..G3-12 COMPLETE / INTEGRATED TO MAIN`**

Research Generation 3のcore machine programは完了しています。次に自動実行されるStudyやStageはなく、closed evidenceの再実行・救済も承認されていません。

## Program全体

```text
Program lifecycle = CLOSED
Core agenda = G3-01..G3-12 / all formally closed
Human track = G3-H01 / DEFERRED / INDEPENDENT / NON-BLOCKING
Section 16 completion conditions = 14 / 14 PASS
Final synthesis = COMPLETE
Program final result = COMPLETE
Main integration = COMPLETE / FAST-FORWARD / force=false
Scientific execution authorized by closure = none
```

## Study別の最終状態

| Agenda / Study | 最終状態 | 主要な結果・境界 |
| --- | --- | --- |
| `G3-01` / `LGTGMF-STUDY1` | `TECHNICAL-INVALID` | formal eligible measurement familyは`[]`です。 |
| 前提Study / `LGTGMIV-STUDY1` | `FORMAL-ELIGIBLE-ALL` | RAW-only・relative depth 5のF1〜F5を適格化しました。 |
| `G3-02` / `EBRWS-STUDY1` | `TECHNICAL-INVALID` | promoted `[]`、Stage 2は未承認・未実行です。 |
| `G3-03` / `TCTGD-STUDY1` | `TECHNICAL-INVALID` | promoted `[]`、Stage 2は未承認・未実行です。 |
| `G3-04` / `SFCDF-STUDY1` | `FORMAL-COMPLETE` | C1 `CONFIRMED / MTAJI-GREATER`、C6 `CONFIRMED / NAMUA-GREATER`です。 |
| `G3-05` / `BECT-STUDY1` | `TECHNICAL-INVALID` | promoted `[]`、Stage 2は未承認・未実行です。 |
| `G3-06` / `BRMGI-STUDY1` | `TECHNICAL-INVALID` | Stage 1 seedsは消費済み、Stage 2 seedsは未消費です。 |
| `G3-07` / `SILGM-STUDY1` | `FORMAL-COMPLETE` | 3件`CONFIRMED`、4件`NOT-CONFIRMED`、1件`NON-ESTIMABLE`です。 |
| `G3-08` / `LGPML-STUDY1` | `TECHNICAL-INVALID` | Stage 1 seedsは消費済み、Stage 2は未承認です。 |
| `G3-09` / `CLGR-STUDY1` | `TECHNICAL-INVALID` | formal representation eligibilityは成立していません。 |
| 前提Study / `RRCLGR-STUDY1` | `TECHNICAL-INVALID` | 同Study内の救済にせず、独立Studyとして閉じました。 |
| 前提Study / `CRCLGR-STUDY1` | `FORMAL-ELIGIBLE-RESOURCE-BOUNDED-CONTINUOUS-REPRESENTATION` | `CRCLGR-R1-EXACT-SQUASHED-L1`を適格化しました。 |
| `G3-10` / `GCLD-STUDY1` | `FORMAL-COMPLETE` | C1・C2・C3・C5が`CONFIRMED`、C4が`NOT-CONFIRMED`です。 |
| `G3-11` / `FDEGHV-STUDY1` | `EXACT-WITHIN-FROZEN-DEPTH-10-DOMAIN` | H1〜H4が`DEEPER-CONFIRMED`です。 |
| `G3-12` / `LGTGGC-STUDY1` | `TECHNICAL-INVALID` | formal generalization / counterexample decisionはありません。 |

## G3-11のexact resultと保護状態

G3-11は、program開始時から保護していたstandard initial RAW rootのdepth-10 exact holdoutを、一度だけcomplete enumerationしました。独立実装によるfull re-enumerationもPASSしています。

```text
depth-10 unique RAW states = 348270
depth-10 tree-node occurrences = 494456
depth-10 duplicate arrivals = 11725
depth-10 multi-predecessor states = 10383
cumulative distinct RAW states through depth 10 = 451127
depth-labelled legal edges through parent depth 9 = 466768
cumulative tree-node occurrences through depth 10 = 631101
H1 = DEEPER-CONFIRMED
H2 = DEEPER-CONFIRMED
H3 = DEEPER-CONFIRMED
H4 = DEEPER-CONFIRMED
```

保護状態は次のとおりです。

```text
depth 10 = OPENED / CONSUMED EXACTLY ONCE
same-evidence rerun = NOT AUTHORIZED
depth 11 = NOT AUTHORIZED / NOT ACCESSED
```

この結果をwhole-Bao state-space / game-tree size、depth 11以深、symmetry-reduced countへ外挿しません。

## G3-12のclosure

G3-12は、G3-04・G3-07・G3-10のbounded claimsをfresh transfer matrixで検証するcapstoneでした。Stage 0 v3はPASSし、同じexactly-once Stage 1 execution内でSFCDF transferはdevelopment PASSとなりました。

一方、SILGM transferでは、frozen LOW populationがlegal width 1を許容するのに対し、継承したsearch helperがcomplete root rankingを必須とするcompatibility gapが生じました。このためfail-closedし、後続を実行していません。

```text
G3-12 = CLOSED / TECHNICAL-INVALID
Stage 1 Actions run = 33848876682 / exactly one
Stage 1 result artifact = 9927866205
SFCDF transfer = STAGE1-PASS / 40 pairs / 80 roots
SILGM transfer = STAGE1-TECHNICAL-INVALID
GCLD transfer = NOT EXECUTED / seeds 32313001..32313384 UNREAD
Stage 2 = LGTGGC-STAGE2-NOT-AUTHORIZED / NOT EXECUTED
formal generalization decisions = NONE
formal counterexample decisions = NONE
same-evidence rerun = NOT AUTHORIZED
```

これはupstream claimsが一般化しないというnegative resultではありません。formal Stage 2を実行していないため、generalization / counterexampleを判定していないという意味です。

## 不変の境界

```text
authoritative scientific state identity = RAW
validated transform set = []
G2-12 estimator scientific reuse = NOT AUTHORIZED
symmetry / canonicalization rescue = NOT AUTHORIZED
G3-11 depth-10 rerun = NOT AUTHORIZED
depth-11 access = NOT AUTHORIZED
G3-12 Stage 1 repair / replay = NOT AUTHORIZED
G3-12 Stage 2 access = NOT AUTHORIZED
closed G3 endpoint / threshold / seed / population rescue = NOT AUTHORIZED
```

`TECHNICAL-INVALID`はscientific nullではありません。必要な技術・検証・resource条件を満たせず、そのStudyが予定したscientific claimをformalに評価できなかったことを示します。

## 人間を対象とする研究

`G3-H01 — Human Perception of Local Branching / Decision Pressure Study 1`は`DEFERRED / INDEPENDENT / NON-BLOCKING`です。human scientific outcomeは生成しておらず、`N=0`をnegative evidenceとして扱いません。

## 読む順序

1. [`FINAL_SYNTHESIS.md`](FINAL_SYNTHESIS.md) — 世代全体の科学的統合
2. [`PROGRAM_FINAL_RESULT.json`](PROGRAM_FINAL_RESULT.json) — machine-readableな最終状態
3. [`../local-game-tree-geometry-generalization-counterexample/STUDY_1_FINAL_REPORT.md`](../local-game-tree-geometry-generalization-counterexample/STUDY_1_FINAL_REPORT.md) — G3-12 closureの正本
4. [`../fresh-depth10-exact-geometry-holdout/STUDY_1_FINAL_REPORT.md`](../fresh-depth10-exact-geometry-holdout/STUDY_1_FINAL_REPORT.md) — G3-11 exact resultの正本
5. [`../research-program-decisions/2026-09-04-research-generation-3-program-closure.md`](../research-program-decisions/2026-09-04-research-generation-3-program-closure.md) — program closure decision
6. [`checkpoints/2026-09-04-research-generation-3-main-integration-complete.md`](checkpoints/2026-09-04-research-generation-3-main-integration-complete.md) — `main`統合記録

新しい科学研究には、別のStudy / Research Generationと、独立したprospective authorizationが必要です。
