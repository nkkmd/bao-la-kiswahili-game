# G3-10 / GCLD-STUDY1 — 最終報告

更新日: 2026-09-04

## 1. Formal status

```text
Study = GCLD-STUDY1
Program position = Research Generation 3 / G3-10
Study status = CLOSED / FORMAL-COMPLETE
Stage 0 = GCLD-S0-TECHNICAL-2026-09-03-v1 / STAGE0-PASS
Stage 1 = GCLD-S1-DEVELOPMENT-2026-09-03-v1 / STAGE1-PASS
Stage 2 = GCLD-S2-FORMAL-2026-09-03-v1 / FORMAL-COMPLETE
formal endpoints = 4 CONFIRMED / 1 NOT-CONFIRMED / 0 NON-ESTIMABLE
protected standard-root complete exact depth-10 holdout = SEALED / NOT GENERATED / NOT READ / NOT PEEKED
main integration = NOT AUTHORIZED / NOT PERFORMED
```

`FORMAL-COMPLETE`はStudy lifecycleの完了状態であり、5 endpointすべてがpositiveであったことを意味しない。本Studyのformal scientific decisionはendpointごとの`CONFIRMED` / `NOT-CONFIRMED` / `NON-ESTIMABLE`である。

## 2. 研究題目

**Geometry-Conditioned Longitudinal Dynamics Study 1 — Prospective exact trajectory-level validation of directionality, persistence, return, chronology-conditioned circulation, and first-order path dependence in formally eligible continuous bounded RAW local-game-tree geometry in Bao without reliance on discrete strategic regimes**

日本語正式題目:

**Baoにおける局所ゲーム木幾何の長期trajectory構造のprospective exact検証 — discrete strategic regimeに依存せず、formal-eligible continuous bounded RAW geometryを用いてdirectionality、persistence、return、chronology-conditioned circulation、first-order path dependenceをtrajectory-levelで検証する**

## 3. Scientific background and dependency

Historical G3-10は、局所ゲーム木幾何がtrajectory上で単なる独立なsnapshot集合ではなく、chronology-dependentな方向性・持続・回帰・履歴依存を持つかを検証する研究として計画されていた。

G3-09 `CLGR-STUDY1`はformal continuous representation eligibilityを確立できず`TECHNICAL-INVALID`で閉じたため、G3-10は一度`PREREQUISITE-REQUIRED`となった。その後、独立prerequisite `CRCLGR-STUDY1`がfresh evidenceによって

`FORMAL-ELIGIBLE-RESOURCE-BOUNDED-CONTINUOUS-REPRESENTATION`

を成立させた。post-CRCLGR reviewでhistorical G3-10のdependencyは満たされたと判断し、研究課題を変更せず`G3-10-AUTHORIZED`とした。

本StudyはG3-08、G3-09、RRCLGRを救済・再分類していない。それらのpartial scientific measurementはGCLD scientific evidenceとして使用していない。過去Study由来の情報はidentity firewall用途に限定した。

## 4. Representation and experimental unit

Geometry representation:

```text
representation = CRCLGR-R1-EXACT-SQUASHED-L1
base geometry = bounded RAW local game-tree reconstruction
relative depth = 5
axes = CRCLGR-A1..A6
coordinate arithmetic = exact reduced rational
trajectory distance = equal-weight exact L1
validated transform set = []
```

唯一のinferential experimental unitは**独立seedによるsource trajectory 1本**である。

各trajectoryについて、state after ply

```text
16,20,24,28,32,36,40,44,48,52,56,60,64,68,72
```

の15 checkpointを測定した。15 checkpointはrepeated measurementsであり、独立sampleとして数えていない。

## 5. Temporal control

各measured trajectoryの実際の15-point順序を、32個のprospectively fixed endpoint-preserving order-destroyed controlsと比較した。

- checkpoint 0と14は固定
- 13内部checkpointだけを並べ替え
- permutation rankは`stageId|sourceSeed|permutationIndex|checkpointPly`のSHA-256で決定
- geometry coordinateやscientific outcomeはpermutation生成に不使用
- control referenceは32 control値のexact median
- trajectory-level contrast = actual endpoint − control median

したがってformal testは「観測trajectoryの時間順序が、同じcheckpoint集合を持つ順序破壊controlに対して系統的な差を持つか」を検証する。

## 6. Primary endpoints

1. **C1 Directionality / path efficiency** — net displacement / total path length
2. **C2 Persistence / lag-distance gradient** — mean lag-4 distance − mean lag-1 distance
3. **C3 Return fraction** — immediate departure後にanchor近傍へ相対的に戻るanchorの割合
4. **C4 Chronology-conditioned circulation** — 6軸の全15 pairにおけるclosed ordered pathのabsolute signed shoelace circulation総和
5. **C5 First-order directional path dependence** — 隣接step間のsame-sign / opposite-sign axis movement balance

C4はoperational geometry-space circulation/hysteresis-like endpointであり、外部parameterを制御したphysical hysteresisではない。

## 7. Stage 0 technical validation

Stage 0はtechnical-only evidenceであり、scientific inferenceを行っていない。

```text
Actions run = 33766979732
result artifact ID = 9898031889
result ZIP SHA-256 = 9cde41d5ff549fb9aa82be3c0e5772b28c2f37a603bc2a83e49f3d769e2abeb4
Stage disposition = STAGE0-PASS
technical candidate trajectories = 4 / 4 complete
fully eligible = 4 / 4
real technical measured trajectories = 2
checkpoint count = 15
control permutations = 32
fresh scientific seed access = false
```

Stage 0で確認したもの:

- C1..C5 exact endpoint arithmetic
- endpoint-preserving permutation exactness
- exact control median
- exact sign test / Holm arithmetic
- real source trajectory through ply 72
- 15-checkpoint preflight exactness
- production / independent longitudinal aggregation exactness
- source terminal / relay-limit / resource failureのfail-closed動作
- trajectoryをinferential unitとしcheckpointを独立sampleにしないこと

## 8. Stage 1 development

Fresh seed block:

`32210001..32210256`

```text
Actions run = 33767857909
result artifact ID = 9899355887
result ZIP SHA-256 = 12a498f8da08adedb8dd8ab758790e3395927dd2580c9d9e8f45e89ac0270ed2
candidate trajectories = 24
resource eligible = 24
measured = 16
production / independent exact = true
C1..C5 defined contrasts = 16 / 16 each
Stage disposition = STAGE1-PASS
formal inference performed = false
p-values computed = false
endpoint signs used for promotion = false
effect sizes used for promotion = false
```

Stage 1の役割はformal effectを見つけることではなく、Stage 2のreadinessを検証することだった。promotionは24/24 complete manifest、resource support、16 measured trajectoryのexact reproducibility、C1..C5の定義可能性だけに基づいた。

Canonical Stage 1 scientific-result SHA-256:

`c2cd89d70f288b5d9abadf611edf494d784b025b3e4483e8d6794918cc4dac1d`

## 9. Stage 2 authorization and pre-fresh abort

Stage 1 readinessを満たした後、別のfresh-free reviewで`GCLD-STAGE2-AUTHORIZED`を固定した。

最初のStage 2 wrapper run `33809894513`は、authorization verificationとdurable lease upload後、scientific runnerの`firewall()` metadata checkで直ちに停止した。

```text
error = G3-09 firewall not identity-only
fresh Stage 2 seed reads = 0
candidate generation = 0
scientific result artifact = 0
classification = PRE-FRESH-ACCESS-TECHNICAL-ABORT / SCIENTIFIC-EXECUTION-NOT-CONSUMED
```

このrunをrerunしなかった。原因はhistorical G3-09 Stage 2 selection artifactに、後世のidentity-only artifactで採用された明示metadata `scientificOutcomeFieldsRetained=false`が存在しないことだった。

科学契約を変更せず、fresh access前にtechnical execution V2をfreezeした。V2 adapterはG3-09 Stage 2 selectionから次の3 fieldだけをprojectionする。

- `rootRawSha256`
- `sourceTrajectorySha256`
- `openingPrefixSha256`

G3-09のpartial geometry measurementsやscientific coordinate valuesは読み込んでいない。

## 10. Stage 2 formal population and execution

Fresh seed block:

`32220001..32220384`

V2 pre-fresh identity projection check、source-bound authorization、durable lease uploadをPASSした後、唯一のfirst-fresh formal executionを行った。

```text
technical execution = GCLD-S2-EXEC-V2-2026-09-04
machine authorization commit = d78c54db3a2fef3be68c6e09f7a334e21653428f
trigger commit = 0793503e19dbacc86432e495636876668657f806
Actions run = 33810395545
run number = 1
result artifact ID = 9916587217
result ZIP SHA-256 = 63e55a9a8f5d6c3752c15cee06a01c327fd717606bf7086b3d1242f780126a4f
candidate trajectories = 48 / 48 complete
resource eligible = 47 / 48
formal measured trajectories = 32
production / independent exact = true
Stage disposition = FORMAL-COMPLETE
```

Candidate search中、ply 72以前にterminalとなった294 source trajectoryはsource-policy rejectionとして除外された。48件のcandidate manifest完成後に全candidateの15 checkpoint preflightを行った。

唯一のresource-ineligible candidateはseed `32220258`であり、ply 68 checkpointが`RELAY_LIMIT`となった。frozen resource ruleに従ってtrajectory全体をineligibleとした。47 eligibleはminimum gate 40を上回ったため、frozen candidate orderの最初の32 eligible trajectoryをformal populationとした。replacementもseed extensionもない。

## 11. Formal inference

各endpointで32 trajectoryのcontrastを作成した。contrast=0はsign test denominatorからのみ除外し、tiesとして報告した。

- test: exact two-sided binomial sign test
- null: positive / negative = 1/2
- minimum nonzero trajectory count = 20
- family: C1..C5固定5 endpoint
- multiplicity: Holm
- family alpha: `1/20`

全5 endpointがestimableだった。

## 12. Formal results

| Endpoint | + | − | ties | Exact raw p | Holm-adjusted exact p | Decision | Direction |
| --- | ---: | ---: | ---: | --- | --- | --- | --- |
| C1 Directionality / path efficiency | 31 | 1 | 0 | `33/2147483648` | `165/2147483648` | **CONFIRMED** | ACTUAL-GREATER |
| C2 Persistence / lag-distance gradient | 30 | 2 | 0 | `529/2147483648` | `1587/2147483648` | **CONFIRMED** | ACTUAL-GREATER |
| C3 Return fraction | 1 | 28 | 3 | `15/134217728` | `15/33554432` | **CONFIRMED** | ACTUAL-LESS |
| C4 Chronology-conditioned circulation | 12 | 20 | 0 | `462411533/2147483648` | `462411533/2147483648` | NOT-CONFIRMED | — |
| C5 First-order directional path dependence | 24 | 8 | 0 | `15033173/2147483648` | `15033173/1073741824` | **CONFIRMED** | ACTUAL-GREATER |

Canonical Stage 2 scientific-result SHA-256:

`c5ec84cecb4e540ce7ad9f52548dac14deecde3423b2f4d10e1c39e1000ae09f`

## 13. Scientific interpretation

### C1 — directionality

Actual chronologyはorder-destroyed controlsより高いpath efficiencyを示した。これは、同じcheckpoint集合を無秩序に並べた場合より、実際のtrajectory順序がgeometry spaceをより方向的に進む構造を持つことと整合する。

### C2 — persistence

Actual chronologyではlag-4とlag-1のdistance gradientがcontrolsより大きかった。これは近接checkpointほどgeometryが相対的に近いというshort-lag persistence structureと整合する。

### C3 — return

Actual chronologyのreturn fractionはcontrolsより低かった。したがって「実trajectoryでは無秩序順序より頻繁に戻る」という単純なreturn-enhancementではなく、むしろorder-destroyed sequenceよりreturnが抑制された方向でformal confirmationされた。これはC1 directionalityとも整合的だが、両者を同一mechanismとみなす因果解釈はしない。

### C4 — circulation

Chronology-conditioned circulationは`NOT-CONFIRMED`だった。このendpointについてactual chronologyがcontrolsと系統的に異なるというformal evidenceは得られなかった。したがってGCLDからphysical hysteresisや強いloop/circulation structureを主張してはならない。

### C5 — first-order path dependence

Actual chronologyでは隣接geometry stepのdirectional sign persistenceがcontrolsより高かった。これはfirst-order history dependenceに対応するprospectively fixed operational endpointについてformal confirmationを与える。

## 14. What the Study establishes

本Studyのbounded populationとrepresentation boundary内では、local geometry trajectoryが単なるcheckpoint集合ではなく、**時間順序そのものに依存する複数の構造を持つ**ことがformalに支持された。

特に次の4点がconfirmationされた。

1. directional path efficiency
2. short-lag persistence
3. reduced return relative to order-destroyed controls
4. first-order directional path dependence

一方、chronology-conditioned circulationはconfirmationされなかった。

## 15. What the Study does not establish

本Studyは次を確立しない。

- causal mechanism
- physical hysteresis
- strategic phase/regime classifier
- human-perceived difficulty
- search quality / best move correctness
- winning probability / game-theoretic value
- whole-game or unbounded geometry
- all Bao trajectoriesへの無条件一般化
- protected standard-root complete exact depth-10 geometry

`CRCLGR-R1-EXACT-SQUASHED-L1`とdepth-5 resource eligibilityを通過したfresh trajectoriesに対するformal conclusionとして読む必要がある。

## 16. Integrity and no-rescue

Stage 1 first fresh access以降、次を行っていない。

- seed extension
- trajectory replacement
- checkpoint変更
- axis / weight / scaling変更
- endpoint変更
- temporal-control変更
- test / multiplicity変更
- estimability threshold変更
- resource ceiling relaxation
- same-evidence scientific rerun

Stage 2 initial wrapper failureはfresh access前であり、scientific evidenceは0だった。V2はtechnical identity projectionだけを修正し、scientific designは変更していない。

## 17. Artifact preservation

Stage 2 canonical artifactはActions artifact ID `9916587217`からZIP SHA-256と内部8ファイル全SHA-256を検証し、scientific recomputationなしでrepositoryへexact-byte mirrorした。

```text
mirror workflow run = 33816914860
mirror commit = 622dae1ede85b3e8856a86a3b647a056f7ac08db
```

production / independent measurement JSONはbyte-identicalで、同じGit blob identityを持つ。

## 18. Final disposition

**`GCLD-STUDY1 = CLOSED / FORMAL-COMPLETE`**

Formal endpoint disposition:

```text
CONFIRMED = C1, C2, C3, C5
NOT-CONFIRMED = C4
NON-ESTIMABLE = none
```

このclosureはG3-08、G3-09、RRCLGRの過去decisionを変更しない。Historical `doc/research-generation-3/PROGRAM_PLAN.md`も変更しない。

`main` integrationは科学的closureとは別のrepository operationである。明示的なユーザー指示があるまで`NOT AUTHORIZED / NOT PERFORMED`を維持する。
