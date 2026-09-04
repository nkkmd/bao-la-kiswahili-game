# NamuaからMtajiへの戦略的時間遷移

Status: **Study 1 closed / repository closure complete / formal decision `NOT-CONFIRMED`**  
開始日: 2026-08-10  
正式評価日: 2026-08-12
closure日: 2026-08-12
研究ブランチ: `research/namua-mtaji-temporal-transition`
Base: `main@c7d06d485789e1ea96d6603802423951a88c1f87`

## 研究題目

> **BaoにおけるNamua→Mtaji移行前後の戦略的転移構造 — capture-branch-expansionからMtaji morphologyへの時間的接続**

本研究は、完了済みの

1. 局面相転移点 Study 1
2. 局面類型と棋風 Study 1

から生じた未推定部分を扱った、prospectiveな独立研究です。

既存Studyのformal decision、threshold、negative/null/inconclusive result、classifier、vocabulary statusは変更・救済していません。

## 結論

Fresh held-out Stage 2 formal corpusを使ったprimary formal analysisは完了しました。

formal condition:

```text
P2-D2 only
hard / bao / phase2 / depth2
games = 4096
seeds = 20280001..20284096
```

formal exposure / comparator:

```text
exposure = earliest fully ascertained Namua CBE per unique historical trajectory
comparator = exact-ply R3-M
controls = 20 unique controls per exposure
global control reuse = false
```

観測されたestimability:

```text
unique earliest-CBE trajectories = 31
morphology-eligible exposed trajectories = 30
G1 = PASS (30 >= 20)
G2 = PASS (20 controls for every exposure)
matched sets = 30
unique controls = 600
```

first-Mtaji morphology:

```text
Exposed MTAJI-M1 = 26 / 30 = 0.8667
Matched-control MTAJI-M1 = 509 / 600 = 0.8483
mean within-stratum matched risk difference = +0.01833
Mantel-Haenszel common OR = 1.1618
```

事前登録した単一のprimary test:

```text
matched-set exact conditional Poisson-binomial test
observed T = 26
p_two_sided = 1.0
alpha = 0.05
```

正式判断:

> **NOT-CONFIRMED**

固定済みのP2-D2・first-Mtaji-morphology-eligible対象集団では、完全に把握したNamua `capture-branch-expansion`の先行とfirst-Mtaji frozen morphologyとの関連は、exact-ply R3-M controlとの比較で確認されませんでした。

小さな正方向のdescriptive differenceは、傾向または救済されたpositive resultとして扱いません。

## 決定論的なNamua進行時計

formal outcome analysisより前に、設計上の重要な事実として次を確定しました。

```text
initial total reserve = 44
first Mtaji observation = ply 44
Namua total reserve at ply t = 44 - t
```

Stage 2でも、Mtajiへ到達した3,886局すべてでfirst Mtajiはply 44となり、違反は0件でした。

したがって、このengineにおけるfirst-Mtaji timingはsurvival / hazard endpointではありません。本Studyは、CBEがMtajiを早める・遅らせるとは主張しません。

## 最初に読む文書

1. [`STUDY_1_OVERVIEW.md`](STUDY_1_OVERVIEW.md) — 初見向け成果概要
2. [`STUDY_1_FINAL_REPORT.md`](STUDY_1_FINAL_REPORT.md) — 科学的最終統合
3. [`STAGE_2_FORMAL_RESULT.md`](STAGE_2_FORMAL_RESULT.md) — canonical Stage 2 formal result
4. [`REPRODUCIBILITY_INDEX.md`](REPRODUCIBILITY_INDEX.md) — hash / artifact / tooling索引
5. [`CURRENT_STATUS.md`](CURRENT_STATUS.md) — closure状態とimmutable boundary
6. [`RESUME_HERE.md`](RESUME_HERE.md) — closed studyの安全な復元入口

## 正式設計・事前登録

- [`STAGE_2_FORMAL_PROTOCOL.md`](STAGE_2_FORMAL_PROTOCOL.md) — frozen human-readable protocol
- [`preregistration/STAGE_2_FORMAL_SPEC.json`](preregistration/STAGE_2_FORMAL_SPEC.json) — machine-readable preregistration
- [`preregistration/STAGE_2_OUTCOME_UNLOCK.json`](preregistration/STAGE_2_OUTCOME_UNLOCK.json) — independently reviewed preoutcome identity binding
- [`STAGE_2_RUNBOOK.md`](STAGE_2_RUNBOOK.md) — completed execution runbook

## 主要checkpoint

- [`checkpoints/2026-08-11-stage1-complete-stage2-formal-freeze.md`](checkpoints/2026-08-11-stage1-complete-stage2-formal-freeze.md)
- [`checkpoints/2026-08-11-stage2-pre-generation-firewall-hardening.md`](checkpoints/2026-08-11-stage2-pre-generation-firewall-hardening.md)
- [`checkpoints/2026-08-12-stage2-formal-not-confirmed.md`](checkpoints/2026-08-12-stage2-formal-not-confirmed.md)
- [`checkpoints/2026-08-12-study1-formal-closure.md`](checkpoints/2026-08-12-study1-formal-closure.md)

## 上流研究から固定して引き継いだ定義

### `capture-branch-expansion`の定義

```text
before = 3
after = 8
expansionDelta = 3
convergenceDelta = -2
persistenceFraction = 0.5
eventWindow = 8
```

### 過去の`Category-A`

```text
signalThreshold = 2.0
persistenceThreshold = 0.75
clusterMaxGap = 1
non-forcing groups = reserve / mobility / capture / front
```

### Mtajiのmorphology

```text
candidateDefinitionHash
= 7a276a8c795efddaf9b9555e0fbb7fdc1e56563d30ebcb352b42b3f53ba0e75d

MTAJI-M1 = Capture-Engaged Low-Contrast Morphology
MTAJI-M2 = Capture-Sparse High-Contrast Morphology
```

classifier refit、restandardization、relabeling、threshold tuning、alternative-kによる救済は行っていません。

Namuaのdiscrete typeは、引き続き支持されていません。N-ACT / N-CONはexploratory coordinateのままであり、STYLE-C1..C4のexact geometryもformal `NOT-CONFIRMED`のままです。

## outcome情報の分離と最終監査

M1 / M2 labelを読む前に、preoutcome matchingを完了しました。

```text
morphologyLabelsRead during matching = false
frozen Mtaji classifier loaded during matching = false
```

independent reviewがPASSした後に限り、exact matching / config / file identityを`preregistration/STAGE_2_OUTCOME_UNLOCK.json`へ固定しました。

評価に使用したmorphology assignmentは、固定済みpreoutcome assignmentとexactに一致しました。評価後のindependent reviewは、primary count、すべてのmatched-set summary、Poisson-binomial test、risk difference、MH OR、最終判断を再現しました。

## Stage 1の実行履歴

Stage 1 corpusはすべて消費済みのexploratory evidenceとして固定し、Stage 2 formal inferenceから除外しています。

Stage 1の最終readiness:

```text
unique CBE trajectory-ply units = 14
unique CBE historical trajectories = 14
frozen gate = >=10 units / >=8 trajectories
result = PASS
```

## 解釈上の境界

このformal negative resultから、次の主張や変更は認められません。

- proof of absence of all Namua→Mtaji temporal structure;
- causal nullの主張
- Mtaji timing / hazardの主張
- P2-D2を超える一般化
- MTAJI-M1 / M2を普遍的ontologyとする主張
- 結果確認後のcandidate-ply subgroup、comparator、threshold、seed、sample sizeによる救済
- N-ACT / N-CONまたはSTYLE-C1..C4の再分類

新しいconfirmatory questionは、fresh preregistrationとfresh evidenceを用いる別のprospective Studyとして扱う必要があります。

## 終了済みStudyの扱い

Study 1は完了しています。Stage 2のgame追加、都合のよいseed blockの探索、comparator / control比の変更、primary resultの再解釈は行いません。

formal corpusとそこから生成した大規模artifactは`artifacts/local/`に置き、gitignore対象としてcommitしません。formal generationはlocal-onlyであり、4,096-game corpusの生成にGitHub Actionsは使用していません。
