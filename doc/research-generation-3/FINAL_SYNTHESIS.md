# Research Generation 3 — 最終統合報告

更新日: 2026-09-04
対象: `Bao Third-Generation Research Program`
Core agenda: `G3-01..G3-12`
状態: **`PROGRAM CLOSED / INTEGRATED TO MAIN`**

## 1. 結論

Research Generation 3は、Baoの**bounded RAW local game-tree / reachable-graph geometry**を中心に、測定器、branch / reply structure、tree / graph divergence、corridor / funnel、rule mechanism、search instability、persistence、continuous representation、longitudinal dynamics、deeper exact holdout、generalization境界をprospectiveに検証しました。

core `G3-01..G3-12`はすべてformal closureを持ちます。第三世代の完了は、一つの普遍法則を得たことを意味しません。`FORMAL-COMPLETE`、`NOT-CONFIRMED`、`NON-ESTIMABLE`、`TECHNICAL-INVALID`、独立前提Studyのinstrument / representation eligibilityを区別したまま保存したことが、世代全体の結論です。

```text
Research Generation 3 core program = CLOSED
authoritative scientific state identity = RAW
validated transform set = []
LGTGMIV F1..F5 = FORMAL-ELIGIBLE-ALL / RAW-only / relative depth 5
G3-04 = FORMAL-COMPLETE / C1+C6 CONFIRMED
G3-07 = FORMAL-COMPLETE / 3 CONFIRMED / 4 NOT-CONFIRMED / 1 NON-ESTIMABLE
CRCLGR-R1-EXACT-SQUASHED-L1 = FORMAL-ELIGIBLE-RESOURCE-BOUNDED-CONTINUOUS-REPRESENTATION
G3-10 = FORMAL-COMPLETE / C1+C2+C3+C5 CONFIRMED / C4 NOT-CONFIRMED
G3-11 = EXACT-WITHIN-FROZEN-DEPTH-10-DOMAIN / H1..H4 DEEPER-CONFIRMED
G3-12 = CLOSED / TECHNICAL-INVALID / no formal generalization-counterexample decision
whole-Bao state-space / game-tree size = NOT ESTABLISHED
causal / game-theoretic / human-difficulty law = NOT ESTABLISHED
```

## 2. 研究設計

第三世代は、Research Generation 2で強く残ったRAW-only bounded exact analysisを出発点としました。G2で成立しなかったstrategic clustering、canonicalization、whole-game growth estimatorを同じ形で再試行する世代にはしていません。

全体を通じて次を守りました。

1. Studyごとにidentity、population、seed、endpoint、threshold、resource ceiling、stopping ruleを結果を見る前に固定する。
2. developmentとformal holdoutを可能な範囲で分離する。
3. production computationとindependent reconstruction / verificationを分離する。
4. exact integer / rational primitiveを優先し、floating metricにはdeterministic ruleを固定する。
5. fresh access後にthreshold relaxation、seed extension、root replacement、module drop、subgroup rescueを行わない。
6. technical failure、resource cutoff、artifact failureをscientific nullへ読み替えない。
7. tree occurrence、RAW graph、search output、engine evaluation、game-theoretic value、人間の難しさを別のconstructとして扱う。
8. RAW identityを基準とし、未検証のsymmetry / canonicalizationをdeduplicationへ使わない。
9. protected depth-10 holdoutをG3-11までsealed evidenceとして保持する。
10. 公開AIのengineering outcomeをscientific successへ読み替えない。
11. machine-only evidenceをhuman claimの代用にしない。
12. closed Studyの修正・救済・再判定を行わず、必要な後続を独立Studyとして分ける。

## 3. Study別の最終状態

| Agenda | Study | 最終状態 | 主要結果・境界 |
| --- | --- | --- | --- |
| `G3-01` | `LGTGMF-STUDY1` | `TECHNICAL-INVALID` | 当初の測定基盤からformal eligible familyは得られませんでした。 |
| 前提Study | `LGTGMIV-STUDY1` | `FORMAL-ELIGIBLE-ALL` | RAW-only relative depth-5 F1〜F5を測定器として適格化しました。 |
| `G3-02` | `EBRWS-STUDY1` | `TECHNICAL-INVALID` | effective branching / reply-widthのformal claimはありません。 |
| `G3-03` | `TCTGD-STUDY1` | `TECHNICAL-INVALID` | transposition / tree-graph divergenceのpromoted setは`[]`です。 |
| `G3-04` | `SFCDF-STUDY1` | `FORMAL-COMPLETE` | C1 `CONFIRMED / MTAJI-GREATER`、C6 `CONFIRMED / NAMUA-GREATER`です。 |
| `G3-05` | `BECT-STUDY1` | `TECHNICAL-INVALID` | branch expansion / compression transitionのformal resultはありません。 |
| `G3-06` | `BRMGI-STUDY1` | `TECHNICAL-INVALID` | Bao rule event→geometry effectのformal resultはありません。 |
| `G3-07` | `SILGM-STUDY1` | `FORMAL-COMPLETE` | 3件`CONFIRMED`、4件`NOT-CONFIRMED`、1件`NON-ESTIMABLE`です。 |
| `G3-08` | `LGPML-STUDY1` | `TECHNICAL-INVALID` | persistence / memory lengthのformal resultはありません。 |
| `G3-09` | `CLGR-STUDY1` | `TECHNICAL-INVALID` | 当初のcontinuous representationはformal eligibilityに到達していません。 |
| 前提Study | `RRCLGR-STUDY1` | `TECHNICAL-INVALID` | resource-robust retryを独立Studyとして閉じました。 |
| 前提Study | `CRCLGR-STUDY1` | `FORMAL-ELIGIBLE-RESOURCE-BOUNDED-CONTINUOUS-REPRESENTATION` | `CRCLGR-R1-EXACT-SQUASHED-L1`を適格化しました。 |
| `G3-10` | `GCLD-STUDY1` | `FORMAL-COMPLETE` | C1・C2・C3・C5が`CONFIRMED`、C4が`NOT-CONFIRMED`です。 |
| `G3-11` | `FDEGHV-STUDY1` | `EXACT-WITHIN-FROZEN-DEPTH-10-DOMAIN` | H1〜H4が`DEEPER-CONFIRMED`です。 |
| `G3-12` | `LGTGGC-STUDY1` | `TECHNICAL-INVALID` | Stage 2は未実行で、formal generalization / counterexample decisionはありません。 |

## 4. 測定基盤

G3-01 `LGTGMF-STUDY1`は`TECHNICAL-INVALID`で閉じ、formal eligible measurement familyを得ませんでした。この判断を修正せず、別の前提Study `LGTGMIV-STUDY1`をfresh evidenceで実施しました。

LGTGMIVはproductionとindependent implementationの一致により、RAW-only・relative depth 5の次の5 familyを測定器として適格化しました。

```text
F1 = TREE-OCCURRENCE
F2 = RAW-GRAPH
F3 = TRANSPOSITION-RECONVERGENCE
F4 = TREE-GRAPH-RELATION
F5 = REPLY-GEOMETRY
```

これはbounded measurementの再現性を示すもので、metricにgame-theoretic valueやhuman difficultyの意味を与えるものではありません。

## 5. Corridorとtree / graph structure

G3-02とG3-03は`TECHNICAL-INVALID`でfail-closedし、予定したformal broad claimを成立させていません。

G3-04 `SFCDF-STUDY1`はformal Stage 2まで完了し、2 candidateを確認しました。

```text
SFCDF-C1-UNIT-WIDTH-OCCUPANCY-FRACTION = CONFIRMED / MTAJI-GREATER
SFCDF-C6-CUMULATIVE-TREE-RAW-RATIO = CONFIRMED / NAMUA-GREATER
C2-C5 = not promoted / not formally tested
```

frozen paired population・RAW-only relative depth 5の範囲で、Mtaji側はunit-width local corridor occupancyが高く、Namua側はcumulative tree-occurrence / distinct-RAW-state inflationが高いという差が成立しました。

この結果をgame-theoretic forcing、best-move clarity、strategic simplicity、human ease、causal phase effectへ読み替えません。

## 6. 探索結果の不安定性

G3-05とG3-06は`TECHNICAL-INVALID`で、branch transitionやrule-event mechanismのpositive・negative・null resultはありません。

G3-07 `SILGM-STUDY1`は8 candidateをformalに記録しました。

```text
estimable = 7
CONFIRMED = 3
NOT-CONFIRMED = 4
NON-ESTIMABLE = 1
```

確認された3件は、root legal width `G1`のhigh stratumでranking-preorder change `E3`がより集中するというbounded associationです。depth、node-budget、quiescenceの3種類のpeer search perturbationで成立しました。

```text
SC1 = DEPTH
SC2 = NODE-BUDGET
SC3 = QUIESCENCE
G1 ROOT-LEGAL-WIDTH × E3 RANKING-PREORDER-CHANGE = HIGHER-IN-HIGH
```

これはnon-causal associationです。root legal widthがsearch failureを生む、ranking changeが悪手を意味する、deeper searchがtruthである、とは主張しません。

G3-08は`TECHNICAL-INVALID`であり、geometry memoryが短い・存在しないという結果ではありません。

## 7. Continuous representationとlongitudinal dynamics

G3-09 `CLGR-STUDY1`はformal Stage 2のresource / relay-limit failureで`TECHNICAL-INVALID`となりました。partial measurementsはformal evidenceへ昇格していません。

別の前提Study `RRCLGR-STUDY1`も`TECHNICAL-INVALID`で閉じました。その後、さらに独立した`CRCLGR-STUDY1`が次のrepresentationをformal eligibility化しました。

```text
CRCLGR-R1-EXACT-SQUASHED-L1
= FORMAL-ELIGIBLE-RESOURCE-BOUNDED-CONTINUOUS-REPRESENTATION
```

これはG3-09の判断を修正するものではありません。

G3-10 `GCLD-STUDY1`は、このbounded representationだけをformal inputとしてfresh longitudinal validationを行いました。

```text
C1-DIRECTIONALITY-PATH-EFFICIENCY = CONFIRMED / ACTUAL-GREATER
C2-PERSISTENCE-LAG-DISTANCE-GRADIENT = CONFIRMED / ACTUAL-GREATER
C3-RETURN-FRACTION = CONFIRMED / ACTUAL-LESS
C4-CHRONOLOGY-CONDITIONED-CIRCULATION = NOT-CONFIRMED
C5-FIRST-ORDER-DIRECTIONAL-PATH-DEPENDENCE = CONFIRMED / ACTUAL-GREATER
```

この結果はcausal dynamics、physical hysteresis、strategic regime、human cognition、game-theoretic valueを確立しません。

## 8. 保護されたdepth-10 exact holdout

G3-11 `FDEGHV-STUDY1`は、program開始時から保護していたstandard initial RAW rootのdepth-10 holdoutを、一度だけcomplete enumerationしました。独立実装によるfull re-enumerationもPASSしました。

```text
depth-10 unique RAW states = 348270
depth-10 tree-node occurrences = 494456
depth-10 duplicate arrivals = 11725
depth-10 multi-predecessor states = 10383
cumulative distinct RAW states through depth 10 = 451127
cumulative tree-node occurrences through depth 10 = 631101
depth-labelled legal edges through parent depth 9 = 466768
```

```text
H1 exact-depth novelty continuation = DEEPER-CONFIRMED
H2 layer tree/RAW divergence continuation = DEEPER-CONFIRMED
H3 cumulative tree/RAW inflation continuation = DEEPER-CONFIRMED
H4 transposition persistence = DEEPER-CONFIRMED
```

exact claimはstandard initial RAW rootのfrozen depth-10 domainに限られます。Bao全体、depth 11以深、symmetry-reduced count、G2-12 estimator validationを意味しません。

## 9. 一般化・反例検証を担う最終Study

G3-12 `LGTGGC-STUDY1`は、G3-04・G3-07・G3-10のformal-eligible claimsをfresh source-policy / reachable-root-family matrixへ移すcapstoneでした。

Stage 0 v3はPASSし、Stage 1のSFCDF transferはdevelopment PASSとなりました。一方SILGM transferでは、frozen LOW root populationと継承search helperのroot-ranking前提が適合せずfail-closedしました。GCLD transferは未実行です。

```text
G3-12 = CLOSED / TECHNICAL-INVALID
SFCDF Stage 1 = STAGE1-PASS / development readiness only
SILGM Stage 1 = STAGE1-TECHNICAL-INVALID
GCLD Stage 1 = NOT EXECUTED / seeds UNREAD
Stage 2 = NOT AUTHORIZED / NOT EXECUTED / all formal seeds UNREAD
formal generalization decisions = NONE
formal counterexample decisions = NONE
```

したがってgeneralization boundaryは確定していません。これは「一般化しない」というnegative resultでも、「counterexampleがない」という結果でもありません。

## 10. 第三世代で分かったこと

第三世代で比較的強く残ったformal knowledgeは次のとおりです。

- RAW-only relative depth 5で再構築できるlocal-geometry measurement instrument
- G3-04の限定populationにおけるcorridor / tree-graph phase structureの差
- G3-07の限定populationにおけるlocal widthとsearch-output changeの関連
- G3-10のresource-bounded continuous geometry trajectory structure
- G3-11のstandard-root depth-10 exact continuation

## 11. 確立していないこと

- universal effective-branching / transposition law
- Bao rule eventがgeometryを変えるcausal mechanism
- formal geometry persistence / memory length
- universal local-geometry taxonomy
- local geometryのwhole-Bao generalization boundary
- whole-Bao state-space / game-tree size
- depth-11 exact result
- validated symmetry / canonicalization
- game-theoretic forcing / optimality
- position value / win probability
- human difficulty / perception
- strategic-regime validation
- causal or physical hysteresis

`TECHNICAL-INVALID`は、必要なtechnical / verification / resource conditionを満たせずformal claimを評価できなかったことを示します。仮説の不存在を示すnegative resultではありません。

## 12. 人間を対象とする研究

`G3-H01 — Human Perception of Local Branching / Decision Pressure Study 1`は`DEFERRED / INDEPENDENT / NON-BLOCKING`です。qualified participant accessを確保できない状態で、machine geometryをhuman difficultyのproxyにしていません。

```text
human scientific outcome generated = false
N=0 = not negative human evidence
blocks core program closure = false
```

## 13. 不変の証拠境界

```text
G3-11 depth 10 = OPENED / CONSUMED EXACTLY ONCE
G3-11 depth-10 same-evidence rerun = NOT AUTHORIZED
depth 11 = NOT AUTHORIZED / NOT ACCESSED
G3-12 Stage 1 repair / replay = NOT AUTHORIZED
G3-12 Stage 2 seed access = NOT AUTHORIZED
G2-12 estimator scientific reuse = NOT AUTHORIZED
symmetry / canonicalization rescue = NOT AUTHORIZED
closed G3 endpoint / threshold / seed / population rescue = NOT AUTHORIZED
```

新しい研究は、既存Studyのcompletion / repairではなく、新しいprospective StudyまたはResearch Generationとして別途承認します。

## 14. 正本と統合状態

- [`PROGRAM_PLAN.md`](PROGRAM_PLAN.md) — 開始前に固定したprospective plan
- [`PROGRAM_FINAL_RESULT.json`](PROGRAM_FINAL_RESULT.json) — machine-readableな最終状態
- [`CURRENT_STATUS.md`](CURRENT_STATUS.md) — current-facing closure state
- [`../research-program-decisions/2026-09-04-post-g3-12-research-generation-3-closure-review.md`](../research-program-decisions/2026-09-04-post-g3-12-research-generation-3-closure-review.md) — closure review
- [`../research-program-decisions/2026-09-04-research-generation-3-program-closure.md`](../research-program-decisions/2026-09-04-research-generation-3-program-closure.md) — program closure decision
- [`checkpoints/2026-09-04-research-generation-3-main-integration-complete.md`](checkpoints/2026-09-04-research-generation-3-main-integration-complete.md) — `main`統合記録

`main`へのforceなしfast-forward integrationは完了済みです。Program closureはpositive resultの多さではなく、確認・未確認・推定不能・technical-invalid・protected exact resultを含む境界を再現可能な形で残したことによります。
