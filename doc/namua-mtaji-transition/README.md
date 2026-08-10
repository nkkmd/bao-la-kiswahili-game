# Namua→Mtaji Strategic Temporal Transition Study

Status: **active / Stage 0 design**  
開始日: 2026-08-10  
Branch: `research/namua-mtaji-temporal-transition`  
Base: `main@c7d06d485789e1ea96d6603802423951a88c1f87`

## 研究題目

> **BaoにおけるNamua→Mtaji移行前後の戦略的転移構造 — capture-branch-expansionからMtaji morphologyへの時間的接続**

本研究は、完了済みの

1. 局面相転移点 Study 1
2. 局面類型と棋風 Study 1

から生じた未推定部分を扱う、**新規・prospectiveな独立研究**です。

既存Studyの再解析による救済、formal decisionの変更、negative/null/inconclusive resultの再解釈を目的としません。

研究上の直接の起点は [`../FUTURE_RESEARCH_AGENDA.md`](../FUTURE_RESEARCH_AGENDA.md) 4.2.1 です。

## 中心研究課題

> `capture-branch-expansion`は単にNamua中に現れるphenotypeなのか、それともformal Namua→Mtaji移行へ近づく過程に位置する戦略的転移構造なのか。

さらに、

> Namuaで観測されたtransition phenotypeの後に最初に到達するMtaji局面は、frozen `MTAJI-M1 / MTAJI-M2` classifier上でどのようなmorphologyを持つのか。

を調べます。

## 既存研究から固定して引き継ぐもの

### 局面相転移点 Study 1

Study 1はclosedです。

- `capture-branch-expansion`はboundedなstrategic-transition phenotypeとして定義済みです。
- classifier、threshold、classifier orderを変更しません。
- E-018 / H16: fixed `hard / bao / depth2` で `phase2 > legacy` confirmed。
- E-019 / H17: global `not-confirmed`。
- E-020 / H18: fixed `hard / bao / depth3` で `legacy > phase2` independently confirmed。
- depth2/depth3の逆転を一般的search-profile × depth interactionとは扱いません。
- `sustained-forcing window`はretrospective Stage B interpretationであり、新研究のfitted thresholdではありません。

### 局面類型と棋風 Study 1

こちらもclosedです。

- `MTAJI-M1 = Capture-Engaged Low-Contrast Morphology`
- `MTAJI-M2 = Capture-Sparse High-Contrast Morphology`

は、固定representation / population内でformalにconfirmedされたbounded Mtaji morphologyです。使用時はfrozen classifierをrefit・restandardize・relabelしません。

Namuaでは離散position typeをpromoteしません。

- `N-PROG`: progression context
- `N-ACT`: exploratory continuous capture-activity coordinate
- `N-CON`: exploratory continuous structural-contrast coordinate

`N-ACT/N-CON`はexploratoryのままです。

Playing styleについては、discrete cluster setはunsupported、`STYLE-C1..C4` exact 4D geometryはStage 5 formal `not-confirmed`です。新研究で救済しません。

## 新研究が扱う未推定部分

固定Stage 6 bridgeでは、unique trajectory-ply単位の`capture-branch-expansion` 59件が

```text
Namua = 59
Mtaji = 0
```

でした。

したがって、同一candidate ply上の

```text
capture-branch-expansion ↔ MTAJI-M1/M2
```

は推定できませんでした。

本研究ではこの未推定部分を、同時点associationではなく**時間的接続**として研究します。

## 主要RQ候補

### RQ1 — time-to-first-Mtaji

`capture-branch-expansion`後のfirst later Mtajiまでの時間構造は、事前に固定した適切な比較対象と異なるか。

### RQ2 — Namua末期の構造trajectory

Namua→Mtajiへ近づく過程で、少なくとも以下のrule-state / board-state primitiveがどのように変化するか。

- reserve
- house ownership / nyumba seeds
- legal mobility
- front-row occupancy / seeds / connections
- legal capture-option count
- capturable-seed morphology
- relay / chain structure
- forced-capture lifecycle

結果を見てから「移行前5手」「移行前10手」のようなwindowを選びません。可能な限り連続的event time、rule-derived progression coordinate、または事前固定したfunctional representationを使います。

### RQ3 — first Mtaji morphology

`capture-branch-expansion`を経たtrajectoryが最初に到達するnon-terminal Mtaji stateを、frozen classifierで`MTAJI-M1 / MTAJI-M2`へ分類し、その分布を比較します。

### RQ4 — search profile / depth

新しいtemporal endpointにsearch profileやdepthによる差があるかを検討します。

formalに扱う場合は、過去Studyのdepth2/depth3 reversalを再確認する設計ではなく、**新しいtemporal endpointに対する独立仮説**として事前登録します。

## Stage 0で既に判明している重要な設計制約

### 1. phenotype ascertainmentに未来8 plyを使う

既存`capture-branch-expansion` classifierはcandidate後の最大8 plyを使ってpersistenceを判定し、さらにfirst future Mtajiが8 ply以内なら先に`namua-to-mtaji-precursor`へ分類します。

したがって、`capture-branch-expansion`および同じnon-precursor classifier familyのeventは、定義上「Mtajiまで8 ply以内」の範囲を持ちません。

このためformal survival clockをcandidate plyから開始すると、exposure classificationに未来情報を使うことになります。Stage 0/1では、少なくとも次を比較してからtime originをfreezeします。

- candidate-ply originを使用する設計
- classifier ascertainment完了後 (`candidatePly + 8`) をlandmarkとする設計
- raw candidate-to-Mtaji距離をdescriptiveに残し、formal endpointはpost-ascertainment timeとする設計

結果を見て有利なoriginを選ぶことは禁止します。

### 2. formal Namua→Mtajiはreserve exhaustionで発生する

現engineでは、turn終了時に両playerのreserveが0ならphaseが`mtaji`へ切り替わります。

したがって、`time-to-first-Mtaji`はreserve残量と機械的に強く関係します。新研究では、raw reserveをprogress contextとして必ず監査し、単なるgame progressionとstrategic-transition phenotypeの関係を混同しません。

`N-PROG`をconfirmed coordinateとして使うのではなく、engine primitiveであるreserveを直接扱います。

### 3. terminal before Mtajiとmax-plyは同じではない

- natural game termination before Mtajiは、Mtaji到達を不可能にするabsorbing competing event候補です。
- max-ply打切りはadministrative right censoring候補です。

単純に「Mtaji非到達gameを除外」しません。実際の頻度をfresh pilotで確認してから、survival / competing-risk設計をfreezeします。

### 4. raw plyは独立標本ではない

primary statistical unitはまだfreezeしません。

同一trajectory内の複数candidate event、重複trajectory、overlapping risk episodeをStage 1 pilotで監査し、以下のどれをformal primary unitとするかを結果を見る前に固定します。

- one index event per game / trajectory
- trajectory-event episode with trajectory-clustered inference
- prespecified risk-set / matched episode
- その他、依存構造を明示的に扱う設計

## 研究stage

1. **Stage 0 — schema / engine / artifact / replay feasibility audit**
2. **Stage 1 — fresh exploratory temporal pilot**
3. **Stage 2 — endpoint / comparator / population / unit / censoring / model / seed freeze**
4. **Stage 3 — preregistration**
5. **Stage 4 — fresh held-out formal corpus generation**
6. **Stage 5 — preregistered confirmatory analysis**
7. **Stage 6 — bounded secondary analysis / external-validity diagnostics if preregistered or clearly exploratory**
8. **Stage 7 — final integration / closure**

Formal corpusはlocalで生成し、GitHub Actionsで大規模生成しません。held-out formal corpusはpreregistration freeze前に科学的inspectionしません。

## 現在の文書

- [`RESEARCH_PLAN.md`](RESEARCH_PLAN.md) — 研究設計骨格
- [`CURRENT_STATUS.md`](CURRENT_STATUS.md) — 現在地・固定境界・pause point
- [`STAGE_0_AUDIT.md`](STAGE_0_AUDIT.md) — Stage 0 feasibility audit設計
- [`checkpoints/`](checkpoints/) — 研究判断の時系列記録

## 既存科学的正本

### Phase-transition Study 1

- [`../phase-transition/STUDY_1_OVERVIEW.md`](../phase-transition/STUDY_1_OVERVIEW.md)
- [`../phase-transition/STUDY_1_FINAL_REPORT.md`](../phase-transition/STUDY_1_FINAL_REPORT.md)
- [`../phase-transition/STUDY_1_VOCABULARY.md`](../phase-transition/STUDY_1_VOCABULARY.md)
- [`../phase-transition/FORMAL_EXPORT_INDEX.md`](../phase-transition/FORMAL_EXPORT_INDEX.md)

### Position-typology / playing-style Study 1

- [`../position-typology/STUDY_1_OVERVIEW.md`](../position-typology/STUDY_1_OVERVIEW.md)
- [`../position-typology/STUDY_1_FINAL_REPORT.md`](../position-typology/STUDY_1_FINAL_REPORT.md)
- [`../position-typology/STUDY_1_VOCABULARY.md`](../position-typology/STUDY_1_VOCABULARY.md)
- [`../position-typology/REPRODUCIBILITY_INDEX.md`](../position-typology/REPRODUCIBILITY_INDEX.md)
- [`../position-typology/MTAJI_CONFIRMED_ONTOLOGY.md`](../position-typology/MTAJI_CONFIRMED_ONTOLOGY.md)

## Interpretation boundary

本研究が将来positive resultを得ても、それだけで次を主張しません。

- universal Bao transition law
- causal mediation
- MTAJI-M1/M2のuniversal ontology化
- N-ACT/N-CONのconfirmed coordinate化
- STYLE-C1..C4の救済
- general search-profile × depth interaction
- 既存Studyのformal decision変更
