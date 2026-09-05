# Namua→Mtaji Strategic Temporal Transition — Study 1 Overview （概要）

更新日: 2026-08-12  
Status: **STUDY 1 COMPLETE / FORMAL RESULT = NOT-CONFIRMED**

## 研究題目

> **BaoにおけるNamua→Mtaji移行前後の戦略的転移構造 — capture-branch-expansionからMtaji morphologyへの時間的接続**

## 何を調べたか

この研究は、完了済みの「局面相転移点 Study 1」で定義された Namua の `capture-branch-expansion`（CBE）と、完了済みの「局面類型と棋風 Study 1」で独立確認された Mtaji morphology `MTAJI-M1 / MTAJI-M2` のあいだに、prospectiveな時間的接続があるかを検討した独立研究です。

既存Studyのformal decision、CBE定義、Category-A定義、Mtaji classifier、negative/null/inconclusive resultは変更していません。

## 最初に分かった重要なこと

現engineの標準trajectoryでは、NamuaからMtajiへの移行時点はreserve depletionによって決まり、Mtajiへ到達するgameではfirst Mtaji observationが必ずply 44になります。

```text
initial total reserve = 44
Namua total reserve at ply t = 44 - t
first Mtaji observation = ply 44
```

したがって、当初候補だった `time-to-first-Mtaji` / survival / hazard という問いは、strategic timing endpointとしては成立しませんでした。

この結果は研究途中で得られたdesign constraintであり、formal outcomeを見た後の再解釈ではありません。研究はその境界を固定し、Stage 2ではfirst-Mtaji **morphology association**だけをprimary formal questionとして事前固定しました。

## Formal design （方法と設計）

正式検証は次の単一条件に限定しました。

```text
P2-D2
hard / bao / phase2 / depth2
```

Fresh held-out formal corpus:

```text
games = 4096
opening seeds = 20280001..20284096
opening = seeded-uniform-legal / 8 plies
max ply = 100
```

Exposure:

```text
unique historicalTrajectoryHash
earliest fully ascertained Namua CBE only
maximum one exposure per historical trajectory
```

Comparator `R3-M`:

```text
same P2-D2
exact candidate ply
not Category A at exact index
same forced-capture status
no Namua CBE anywhere in control trajectory
first-Mtaji morphology eligible
20 unique controls per exposure
global control reuse = false
```

M1/M2を読む前にmatchingをfreezeし、独立reviewとoutcome-unlock commitを挟むmachine-enforced outcome firewallを使用しました。

## Formal corpusとestimability

4096 gamesはfull replay・provenance・seed range・trajectory identity・move legalityを含む全verificationをPASSしました。

```text
observations = 227040
unique historical trajectories = 2874
reached Mtaji games = 3886
first-Mtaji morphology eligible games = 3885
```

CBE側は、37 fully ascertained Namua CBE rowsから31 unique earliest-CBE trajectoriesが得られ、そのうち30 trajectoryがfirst-Mtaji morphology eligibleでした。

```text
G1: exposures >= 20
observed = 30
PASS

G2: exactly 20 unique controls / exposure
PASS
```

30 matched sets × 20 controls = 600 controlsで、control trajectoryのglobal reuseは0でした。

## Primary result （結果）

Frozen classifier:

```text
MTAJI-M1 = Capture-Engaged Low-Contrast Morphology
MTAJI-M2 = Capture-Sparse High-Contrast Morphology
```

Observed first-Mtaji morphology:

```text
Exposed:
  M1 = 26 / 30 = 0.8667
  M2 = 4 / 30

Matched controls:
  M1 = 509 / 600 = 0.8483
  M2 = 91 / 600
```

Descriptive summaries:

```text
mean within-stratum matched risk difference = +0.01833
Mantel-Haenszel common OR = 1.1618
```

Primary preregistered test:

```text
matched-set exact conditional Poisson-binomial test
observed T = 26
p_two_sided = 1.0
alpha = 0.05
```

Formal decision:

> **NOT-CONFIRMED**

## 何が分かったか

この固定P2-D2・Mtaji-reaching target populationでは、先行するfully ascertained Namua CBEとfirst-Mtaji `MTAJI-M1 / MTAJI-M2` morphologyとの関連は、事前登録したmatched-set formal testでは確認されませんでした。

M1率はexposed 86.7%、matched controls 84.8%で記述的差は小さく、primary conditional null distribution上で観測値は極端ではありませんでした。

## 何を意味しないか

`not-confirmed` は次を意味しません。

- CBEと後続構造の関係が存在しないことの証明
- causal null effect
- Mtaji移行を早める／遅らせるというtiming result
- first-Mtaji hazardへの効果
- P2-D2以外への一般化
- candidate-ply subgroupや別comparatorで結果を救済してよいという許可

positive descriptive risk differenceを「傾向」「弱い効果」としてformal resultの代替にすることもしません。

## この研究が残したもの

1. Namua→Mtajiのclockがdeterministic progressionであることを明確化した。
2. CBEからMtaji morphologyへ接続するprospective formal designを、trajectory identity・exact-ply matching・outcome firewall付きで実装した。
3. 30 independent exposure trajectoriesと600 globally non-reused controlsでformal estimabilityを確保した。
4. primary morphology associationを結果依存のrescueなしで `not-confirmed` として閉じた。
5. 将来研究を、timing/hazardの再包装ではなく、別途preregisterする新しい構造trajectory・external-validity・human/expert validation等へ切り分ける境界を残した。

## 詳細

- [`STUDY_1_FINAL_REPORT.md`](STUDY_1_FINAL_REPORT.md) — 科学的最終統合
- [`STAGE_2_FORMAL_RESULT.md`](STAGE_2_FORMAL_RESULT.md) — Stage 2 formal result正本
- [`REPRODUCIBILITY_INDEX.md`](REPRODUCIBILITY_INDEX.md) — hash / protocol / tooling / local artifact索引
- [`CURRENT_STATUS.md`](CURRENT_STATUS.md) — closure状態とimmutable boundary
