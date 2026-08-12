# Position Complexity / Difficulty Study 1 — Research Plan

更新日: 2026-08-12  
Status: **DESIGN DOCUMENT / PRE-FORMAL / Stage 2 not preregistered**

## 1. Research question

Primary scientific question:

> Baoにおける「難しい局面」は単一の現象ではなく、structural complexity、search workload、decision ambiguity、prediction instabilityという異なるmachine-reproducible layerへ分離できるか。特に、局面のstructural branchingは探索深度を増したときのroot decision instabilityと関連するか。

Study 1は人間の主観的・認知的difficultyを直接測定しない。

## 2. Scientific scope

Study 1の目的は総合difficulty scoreの作成ではない。

まず次を別々に測る。

### A. Structural complexity

State-level raw quantitiesの候補:

```text
legalMoveCount
captureMoveCount
forcedCapture
max/mean capturable seeds
max/mean capture events
max/mean relay events
max/mean chain events
front occupancy / front connections
reusable pits
reserve
houseOwned / nyumbaSeeds
pitSeedVariance / seedConcentration
phase
```

`phase`はcontext/stratumであり、それ自体を「複雑度が高い/低い」という意味ラベルにしない。

### B. Search workload

固定implementation・固定search options下の候補:

```text
nodes
quiescenceNodes
cutoffs
evaluationRequests
evaluations
cache hits/stores
per-depth incremental counters
completedDepth
```

`elapsedMs`はhardware/runtime依存性が強いため、原則としてQA/descriptive onlyとする。

### C. Decision ambiguity

専用root-candidate instrumentationで測る候補:

```text
best-vs-second-best searched score gap
tied-best set size
top-k score dispersion
near-equivalent move count
candidate rank concentration / entropy
```

任意temperatureを必要とするentropyや「near-equivalent」のthresholdは、Stage 1でmeasurement behaviorを確認し、Stage 2に使う場合はformal outcomeを見る前に固定する。

### D. Prediction instability

同一state・同一evaluator/search implementationでdepth等のみを変えて測る候補:

```text
D1 -> D2 root optimum change
D2 -> D3 root optimum change
D3 -> D4 root optimum change
top-set overlap / disjointness
rank reversal
root score sign reversal
root score magnitude change
finite-grid stability depth
PV prefix instability (instrumentation validated only)
```

Search-profile/evaluator disagreementはsecondary/exploratory候補であり、closed phase-transition Study 1のD2/D3結果をpresent-study formal evidenceとして再利用しない。

## 3. Primary Study 1 design recommendation

### 3.1 Confirmatory center

Study 1のconfirmatory centerは、latent-factor数の証明ではなく、より直接的な次の関係とする。

> **Structural branchingがdepth-dependent root prediction instabilityと関連し、さらにdecision ambiguityがstructural branchingだけでは説明できない追加情報を持つか。**

これにより「複数layer」を、結果依存なPCA/factor modelや総合scoreを作らず検証できる。

### 3.2 Provisional primary structural variable

```text
legalMoveCount
```

理由:

- engineが直接生成する合法選択肢数で定義が明瞭;
- CBEの`captureMoveCount`とは異なる一般root branching quantity;
- evaluator/search resultを含まず、structural layerに留まる;
- 重み付きcompositeを作らない。

Stage 1で分布・degeneracy・phase coverageを監査した後、Stage 2前にこの採用可否をfreezeする。formal dataを見て別metricへ切替えることは禁止する。

### 3.3 Provisional primary prediction-instability outcome

推奨するprimary outcomeは、固定`phase2 / bao` searchでの**tie-aware D2→D3 root-optimum instability**。

候補定義:

```text
TopSet_d = exact full-window root candidate scores at depth d
           の最大scoreを共有する合法手集合

D23Instability = 1
  iff TopSet_2 ∩ TopSet_3 = empty
else 0
```

単純なcanonical best-move key変更よりtieに頑健である。

Stage 1でevent prevalenceが極端に低くestimabilityが成立しない場合、Stage 2のprimary endpointはStage 1終了時に別候補へ変更可能だが、その変更はStage 1 evidenceだけを根拠に文書化し、Stage 2 fresh corpus生成前に固定する。Stage 2 outcomeを見て変更してはならない。

### 3.4 Key secondary ambiguity metric

第一候補:

```text
margin_d2 = bestScore_d2 - secondBestScore_d2
```

対象は少なくとも2合法手を持ち、score scaleが通常評価域として比較可能なstate。mate/terminal-score領域はStage 0/1で明示的に検出し、formal metricに含めるか除外するかをStage 2前に固定する。

予測方向は、smaller margin -> higher D23 instability。

## 4. Search configuration principle

Machine-reproducible measurementではadaptive time allocationを使わない。

Primary candidate configuration:

```text
level = hard
searchProfile = phase2
evaluationProfile = bao
timeLimitMs = Infinity
adaptive search = disabled
stable-best early stopping = disabled
fixed max depth per requested measurement
```

Quiescence depth、TT normalization、move-ordering options等もStage 1開始前に記録し、Stage 2 preregistrationで完全固定する。

既存`public/ai-config.js::complexityScore()`をsearch budget決定へ使用すると、structural featuresがsearch workloadへ直接注入され循環するため、research measurementでは使用禁止とする。

## 5. Stage plan

## Stage 0 — technical / representation feasibility

目的はmeasurement validityの確立のみ。scientific associationを検定しない。

Required work:

1. structural feature schemaを監査し、relay-related variableの意味を明記する;
2. exhaustive exact root-candidate score diagnosticを実装する;
3. per-depth traceを実装する;
4. score perspective、tie handling、mate-score handlingを監査する;
5. state mutationがないことをtestする;
6. repeated run determinismをtestする;
7. root-candidate tableのbestが既存`AI.analyzeMove`のfixed-depth root choice/scoreと整合することをsmoke positionsで確認する;
8. trajectory/state identityを再利用できることを確認する;
9. tiny technical statesのみ使用し、Stage 1/2から永久除外する。

Stage 0 failure例:

- root candidate valuesがexact/full-windowとして定義できない;
- diagnosticによりsearch semanticsが変わる;
- deterministic replayが成立しない;
- depth semanticsがquiescence等により定義不能。

この場合、ambiguity/PV metricはformal candidateへ進めない。

## Stage 1 — exploratory metric / design development

Stage 1はfresh exploratory corpusを使用し、以後formal confirmationには再利用しない。

Goals:

- eligible state availability;
- Namua/Mtaji coverage;
- legalMoveCount distribution;
- D1..D4 instability event prevalence;
- exact tie frequency;
- mate-score/terminal-search frequency;
- root margin scale;
- node/cutoff distribution;
- duplicate historical trajectories / duplicate rule states;
- one-state-per-trajectory sampling feasibility;
- candidate metricsのdegeneracy/collinearity;
- Stage 2 sample-size/estimability gatesの設定。

Allowed:

- candidate metric比較;
- visualization / descriptive correlation;
- sampling ruleの比較;
- technical sensitivity to a small prespecified search-option family。

Prohibited:

- Stage 1をconfirmationと呼ぶ;
- Stage 1で有意なmetricをそのままformal resultとして報告する;
- Stage 1 positionsをStage 2へ混ぜる。

Stage 1終了時に、Stage 2の以下を一度だけfreezeする。

```text
primary hypothesis
population
state-selection rule
structural variable
prediction-instability endpoint
ambiguity metric
search options
statistical model/test
alpha
multiplicity rule
estimability gates
sample size
seed range
stopping rule
success/not-confirmed/inconclusive rules
```

## Stage 2 — fresh held-out formal confirmation

Stage 2は独立seed blockで新規生成する。

No:

- early stopping;
- favorable seed search;
- result-dependent extension;
- metric substitution;
- threshold relaxation;
- post-hoc phase/subgroup rescue;
- prior-study corpusをformal evidenceへ混入。

大規模corpusはlocal executionとし、`artifacts/local/position-complexity/...`へ保存する。GitHub Actionsでは生成しない。

## 6. Formal population / independence recommendation

Study 1では全plyを独立sampleとして扱わない。

Preferred formal sampling design:

1. fixed seeded trajectory generatorでfresh gamesを生成;
2. `historicalTrajectoryHash`重複を検出;
3. formal positionは各unique historical trajectoryから事前固定のdeterministic ruleで**原則1 state**だけ選ぶ;
4. 同一`ruleStateKey`が複数trajectoryから選ばれた場合、同じdeterministic computational outcomeを独立反復として数えないため、事前固定ruleで1代表へcollapseする;
5. Namua/Mtaji coverageが必要なら、phase assignment/samplingはseedやhashでoutcome-independentに事前割当する;
6. target ply/phaseに到達しないtrajectoryを結果依存で置換しない。

この方式は「all plies + cluster robust SE」よりinformation量は少ないが、deterministic engine研究で最も明瞭にpseudo-replicationを防げるため第一候補とする。

Stage 1でavailabilityが不足する場合のみ、bounded multiple states per trajectory + trajectory-clustered inferenceを第二候補として検討し、Stage 2前に固定する。

## 7. Proposed confirmatory hypotheses and models

### Primary H1 — structural branching vs prediction instability

Candidate model:

```text
logit P(D23Instability = 1)
  = beta0 + beta1 * log1p(legalMoveCount) + beta2 * phase
```

Formal question:

```text
H0: beta1 = 0
H1: beta1 != 0
```

Two-sidedを推奨する。現時点では「関連」を主張し、増加方向を結果前に無理に仮定しないためである。

Primary alpha candidate:

```text
0.05
```

If one-state-per-unique-state design is used, standard likelihood-ratio/Wald inference may be used after model diagnostics. If bounded repeated states are retained, trajectory-cluster robust or trajectory-block resampling must be preregistered instead.

### Key secondary H2 — ambiguity adds information beyond structure

Candidate model:

```text
logit P(D23Instability = 1)
  = beta0
  + beta1 * log1p(legalMoveCount)
  + beta2 * phase
  + beta3 * ambiguityMetric_d2
```

Expected direction for raw score margin:

```text
larger best-second gap -> lower instability
```

H2 tests incremental association of ambiguity after structural branching. It does not establish human difficulty or causal mediation.

### Secondary / exploratory H3 — search workload relation

Examine effect sizes/correlations between structural variables and:

```text
log1p(nodes_D2)
log1p(nodes_D3)
per-depth incremental nodes
cutoffs / evaluations
```

This layer should initially remain secondary because search workload is implementation-specific and partly determined by alpha-beta ordering/cache behavior.

### Exploratory H4 — multidimensional structure

Use correlation matrices, partial correlations, PCA/factor diagnostics or other dimension summaries only as exploratory evidence for whether one latent factor is inadequate.

Do not make the number of latent dimensions the Study 1 primary claim unless a separate preregistered validation design is later created.

## 8. Multiplicity / false discovery

Recommended hierarchy:

```text
Primary H1:
  one test, alpha = 0.05, no multiplicity adjustment needed.

Key secondary confirmatory family:
  small predeclared family, Holm correction at family-wise alpha = 0.05.

Broad exploratory metric matrix:
  no confirmed/not-confirmed decisions from unadjusted p-values.
  effect sizes + uncertainty first.
  if inferential p-values are tabulated, use BH-FDR with a prespecified q (candidate 0.10) and label exploratory.
```

Do not select the primary metric from the smallest p-value.

## 9. Success / not-confirmed / inconclusive framework

Exact thresholds will be frozen after Stage 1 and before Stage 2.

Conceptual rule:

### `confirmed`

- all technical/estimability gates pass;
- preregistered primary test passes its alpha rule;
- model/data validity gates pass.

### `not-confirmed`

- technical and estimability gates pass;
- primary test does not pass the preregistered criterion, including opposite direction if a directional rule is eventually frozen.

### `inconclusive`

Only for preregistered non-outcome failures such as:

- insufficient unique trajectories/states;
- insufficient instability events for the frozen model;
- diagnostic equivalence failure;
- corrupt/incomplete corpus;
- model non-estimability under a predeclared gate.

Do not convert an ordinary non-significant valid result into `inconclusive`.

## 10. What Study 1 will not claim

Even if H1/H2 are confirmed, Study 1 will not establish:

- a universal human difficulty scale;
- one universal Bao difficulty score;
- implementation-independent computational complexity;
- causal mediation from structural branching through ambiguity to instability;
- that CBE causes search instability;
- a general phase2-vs-legacy depth interaction;
- that MTAJI-M1/M2 are difficulty classes;
- that N-ACT/N-CON or STYLE-C1..C4 have been independently rescued/confirmed.

## 11. Formal preregistration checklist before Stage 2

Must be present and hash-frozen before formal generation:

- study ID / hypothesis ID;
- exact source commit;
- exact instrumentation hashes;
- formal generator and verifier;
- fresh seed range and game count;
- opening/trajectory policy;
- phase/state-selection schedule;
- unique trajectory/state handling;
- inclusion/exclusion criteria;
- exact structural features;
- exact search/evaluator options;
- score perspective and tie rule;
- mate/terminal handling;
- primary outcome;
- secondary outcomes;
- model/test and alpha;
- multiplicity rule;
- availability/estimability gates;
- missing/corrupt-data policy;
- stopping rule = fixed complete corpus, no outcome stopping;
- `confirmed / not-confirmed / inconclusive` decision table;
- artifact paths / hashes / verification procedure;
- explicit statement that prior closed-study results are motivation only.

Until these are frozen, Stage 2 formal corpus generation remains unauthorized.