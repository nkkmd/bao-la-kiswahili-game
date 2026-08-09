# 局面類型と棋風研究 — 現在地

更新日: 2026-08-09  
Status: **Stage 0 repository audit complete / instrumentation implementation pending / no formal experiment authorized**

Branch: `research/position-typology-and-playing-style`

Stage 0監査: [`STAGE_0_AUDIT.md`](STAGE_0_AUDIT.md)

## 現在地

次の優先研究課題として **「Baoにおける局面類型と棋風の発見・検証」** を開始した。

2026-08-09に、指定研究文書、Study 1正本、現在のengine、AI、experiment tooling、artifact schema、symmetry / identity toolingを対象とするStage 0 repository auditを完了した。

現時点ではまだ大量自己対局、clustering、formal confirmationは開始していない。Stage 0の次工程は、position typology専用instrumentation、position identity QA、小規模exploratory smokeである。

以下は引き続き固定していない。

- formal hypothesis
- cluster数
- position-type名称
- playing-style名称
- feature setの最終版
- preprocessing
- seed block
- confirmation threshold
- statistical test
- formal execution policy

したがって、`RESEARCH_PLAN.md`および`STAGE_0_AUDIT.md`はpreregistrationではない。

## 直前研究との境界

局面相転移点Study 1はclosedであり、PR #26は`main`へmerge済み。

本研究ではStudy 1の以下を変更しない。

- E-010: `not-confirmed`
- E-011: `inconclusive`
- E-017: `not-confirmed`
- E-018/H16: `confirmed` only fixed `hard / bao / depth2`
- E-019/H17: global `not-confirmed`
- E-020/H18: `confirmed` only fixed `hard / bao / depth3`
- `capture-branch-expansion` classifier / vocabulary
- forced-capture regime definition
- `sustained-forcing window` のStage B retrospective interpretation boundary
- trajectory-ply sensitivityの位置づけ

Study 1の成果は、本研究後半のcross-study analysisで参照できるが、局面類型の発見をStudy 1の結論へ合わせるために使用しない。

特にStudy 1 formal corpusはinitial typology discovery corpusへ入れず、独立に得られた局面類型との関係を後から検討する。

## Stage 0 repository auditの主要所見

### 1. 既存基盤は再利用可能

現在のrepositoryには、次の研究基盤が既にある。

- Bao rule engineによる完全なstate transition
- seeded deterministic self-play / opening generation
- AI evaluator / search-profile比較基盤
- source commit / source-file hash / config hash provenance
- atomic write / resume / verification patterns
- state hash / trajectory hash
- symmetry transform / symmetry audit
- phase-transition feature extraction
- forced-capture regime analysis
- trajectory-ply duplication sensitivity tooling

したがって、新研究用runnerをゼロから作る必要はない。

### 2. 既存phase-transition observationだけではtypologyには不足

現在のobservationは以下を保存している。

- phase
- reserve
- houseOwned
- legal move count
- capture move count
- forced capture
- board seed count
- non-empty pit count
- front-row occupancy / seed count
- stateHash / previousStateHash

ただしfull `pits`はobservationに保存していないため、seed distributionやtypology用canonical positionをobservation単体から復元できない。

一方、完全なgame artifactに`moves`があればengineから全stateをreplayできる。新exploratory corpusではfull pit stateとprimitive structural featuresを明示保存する専用schemaを作る。

### 3. Position identityを層別化する必要がある

既存`stateHash`はhistorical replay identityとして有用だが、`turn`、terminal metadata等を含むため、そのまま「同じ構造」の定義にはしない。

Stage 0では次を分離する。

- historical exact state identity
- rule-state identity
- seat-canonical identity
- trajectory identity

既存symmetry研究で確認済みのSouth/North seat exchangeはcanonicalization候補として利用できる。ただし単純な左右列反転・方向反転はnyumba等の意味を変え得るため使用しない。

### 4. Featureを三層に分離する

初期typology discoveryでは、board / legal-stateから直接導出されるprimitive featureを主対象とする。

trajectory context（ply、forced-capture regime lifecycle等）とAI内部情報（evaluation、depth、nodes、cutoff等）は初期cluster形成から分離し、後段のtransition / interpretation / playing-style分析へ置く。

### 5. 新しいexploratory corpusが必要

既存joseki / first-player artifactsは各研究目的に合わせた局面分布を持つため、position typology discoveryの主corpusにはしない。

Study 1 formal corpusもcross-study independenceのためdiscoveryから隔離する。

新規exploratory corpusを作るが、正式なseed blockやconfirmatory designはまだ固定しない。

## 次に行う作業

Stage 0 instrumentationとして、次をこの順に行う。

1. position-typology専用state / feature extractorを実装する。
2. full pits + primitive structural featuresを保存する新schemaを追加する。
3. typology用`ruleStateKey`とseat-canonical position keyを実装する。
4. 新しいreachable-state sample上でseat-symmetry invarianceを再監査する。
5. schema / replay / deduplication / provenance verifierを追加する。
6. 既存seeded-generation / atomic-resume基盤を再利用したexploratory generatorを用意する。
7. 小規模instrumentation smokeのみ生成する。
8. smokeではcoverage / duplication / phase balance / opening concentrationを監査し、clusteringはまだ行わない。
9. smoke結果からStage 1 exploratory corpusのsampling designを決める。

## 重要原則

- position typeとplaying styleを分離する。
- playing styleを一局面だけから判定しない。
- `phase2` / `legacy`等の実装名をそのまま棋風名にしない。
- 勝率・AI評価値を局面類型そのものと同一視しない。
- 類型名を先に決めてクラスタを当てはめない。
- trajectory重複・決定論的反復を独立標本として扱わない。
- raw ply数を独立標本数とみなさない。
- Study 1 formal decisionsを変更しない。
- exploratory discoveryとfuture confirmatory validationを分離する。
- formal corpusをGitHub Actionsで生成しない。

## 次のdecision point

instrumentation smokeとidentity / duplication auditの後に、次を判断する。

- namua / mtajiを分離して類型化するか、共通feature spaceで扱うか
- raw pit vectorをcluster inputへ直接含めるか、構造summaryを主にするか
- rule-state dedupだけか、seat-canonical dedupまでprimaryにするか
- trajectory-level weightingとbalanced subsamplingのどちらを主とするか
- unsupervised / semi-supervised / rule-basedのどれを主探索にするか
- exploratory corpusのgeneration strata、規模、多様性条件
- Stage 2 replication用held-out design

これらを決めるまではformal confirmationへ進まない。
