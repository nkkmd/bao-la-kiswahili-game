# Critical Positions / Outcome Branching Study 1 — Final Report

更新日: 2026-08-24  
Status: **STUDY 1 CLOSED / STAGE 1 EXPLORATORY COMPLETE / 0 PROMOTED CANDIDATES / STAGE 2 NOT EXECUTED**

## 研究題目

> **Baoにおける重要局面と勝敗分岐点の同定 — move-sensitive continuation divergence と decision-critical position structure の抽出・検証**

Working English title: **Critical Positions / Outcome Branching Study 1**

## 結論

本Studyでは、同一root stateの全exact legal moveを個別にinterveneし、その後を事前固定したstochastic continuation policyで進めたときのroot-actor empirical continuation outcome divergenceを測定した。

Stage 1では600 selected rootsすべてがprimary-estimableであり、`D_range >= 0.30`のhigh-divergence rootは少なくとも次のとおり観測された。

```text
Namua = 52 / 300 = 0.1733333333
Mtaji = 87 / 300 = 0.29
overall = 139 / 600 = 0.2316666667
```

したがって、**fixed-policy empirical continuation divergenceが大きいroot自体はfresh Stage 1 population内に存在した**。

一方、事前にfreezeした「phase + 1–2 pre-root structural tokens」のcandidate grammarについて1183 candidate auditsを実施したところ、全promotion gatesを通過したcandidateは0件だった。

```text
candidateAuditCount = 1183
candidatesPassingPromotionGates = 0
supportEquivalenceRepresentativeCount = 0
promotedCandidateCount = 0
manualOverridePerformed = false
```

よって本Studyの中心的なStage 1 conclusionは、

> **重要度の高いfixed-policy continuation divergenceを示す局面は観測されたが、今回prospectively frozenした単純な1–2 token pre-root structural grammarでは、それを十分高率かつ十分なsupport/diversityで再現するmachine-reproducible structural classをpromotionできなかった。**

である。

これは「Baoに重要局面が存在しない」ことを意味しない。また、より高次元・非線形なrepresentation、人間・expertが認識する重要局面、game-theoretic turning pointの不存在も意味しない。

## Study architecture

```text
Stage 0 — construct / technical / feasibility audit      COMPLETE / PASS
Stage 1 — fresh exploratory discovery                    COMPLETE
Stage 2 — fresh prospective formal confirmation          NOT EXECUTED
Study 1                                                   CLOSED
```

Stage 2は「結果が弱かったため任意に省略」したのではない。Stage 2前提はexact Stage 1 promoted candidate mappingのprospective freezeであり、Stage 1のpromotion結果が0件だったためformal confirmation対象が存在しなかった。

## Primary construct

```text
fixed-policy empirical continuation divergence
```

For root `s` and exact legal move `m`:

```text
p_hat(s,m) = root-actor wins / 64
D_range(s) = max_m p_hat(s,m) - min_m p_hat(s,m)
highDivergence(s) = D_range(s) >= 0.30
```

Continuation policy:

```text
P1_NORMAL_TOP3
AI.analyzeMove(state, "normal", suppliedRng, { evaluationProfile: "bao" })
64 replicates per exact legal root move
maximum 200 post-root plies
common replicate seed across root moves at replicate index r
```

`p_hat`はfrozen policy下のempirical continuation quantityであり、game-theoretic winning probabilityではない。

## Source population

Fresh Stage 1 source corpus:

```text
games = 3072
seeds = 22600001..22603072
uniqueHistoricalTrajectories = 2726
distinctOpeningPrefixes = 2226
```

Generation strata:

```text
B-D1 = 512
B-D2 = 512
B-D3 = 512
LS-D2 = 512
V2-D2 = 512
LE-D2 = 512
```

Independent full corpus replay:

```text
passed = true
gamesVerified = 3072
fullCorpusReplay = true
```

## Outcome-blind root selection

Selection was completed without winner, continuation outcome, `D_range`, D2/D3 score, candidate matcher or post-move consequence.

```text
selected roots = 600
Namua = 300
Mtaji = 300
unique selected historical trajectories = 600
unique selected rule states = 600
selected distinct opening prefixes = 567
replacementPerformed = false
phaseReassignmentPerformed = false
selectionHash = 702baa878354be14ca97a026b2e97b48521a769b983874fb657e2c6afe82d57d
```

All preregistered selection-readiness gates passed.

## Measurement and independent verification

Initial measurement:

```text
measuredExactRootMoveInterventions = 2666
primaryEstimableRoots = 600
primaryNonEstimableRoots = 0
primaryEstimableNamuaRoots = 300
primaryEstimableMtajiRoots = 300
finiteD2D3CandidateTables = PASS
replacementPerformed = false
replicateExtensionPerformed = false
continuationPolicySubstitutionPerformed = false
```

Mandatory independent verification:

```text
passed = true
rootsReselectedIndependently = 600
fullContinuationRemeasurement = true
fullSecondaryRecomputation = true
fullStructuralRecomputation = true
measuredExactRootMoveInterventions = 2666
primaryEstimableRoots = 600
```

したがってcandidate discoveryは、verified measurementを前提として実行された。

## High-divergence root occurrence

Candidate audit内のsingle-token `legalMoveCount` binsは各phaseでselected rootsをdisjointにpartitionする。

Namua:

```text
legalMoveCount=2   : 1 / 59 high-divergence
legalMoveCount=3-4 : 14 / 92
legalMoveCount=5+  : 37 / 149
TOTAL              : 52 / 300
```

Mtaji:

```text
legalMoveCount=2   : 9 / 97 high-divergence
legalMoveCount=3-4 : 39 / 110
legalMoveCount=5+  : 39 / 93
TOTAL              : 87 / 300
```

Overall:

```text
139 / 600 = 0.2316666667
```

これはStage 1 exploratory populationにおけるmachine/policy-conditioned occurrenceであり、population-universal prevalence estimateとして扱わない。

## Frozen structural candidate grammar

Candidate object:

```text
phase
+ 1–2 pre-root structural condition tokens
```

Token families included legal/capture move counts, Namua reserve bins, house/nyumba state, front occupancy/connections and reusable pits. Outcome、search value、post-move consequenceはmatcherから除外した。

Promotion gates:

```text
minimum opportunity unique historical trajectories = 24
minimum opportunity unique rule states = 24
minimum high-divergence unique historical trajectories = 16
minimum distinct opening prefixes = 6
maximum single opening-prefix share = 0.40
minimum generation strata = 3
maximum single generation-stratum share = 0.60
minimum high-divergence rate = 0.65
minimum median D_range = 0.35
```

Manual promotion was forbidden and zero promoted candidates was explicitly valid.

## Stage 1 discovery result

```text
candidateAuditCount = 1183
candidatesPassingPromotionGates = 0
supportEquivalenceRepresentativeCount = 0
promotedCandidateCount = 0
zeroPromotedCandidatesAllowed = true
manualOverridePerformed = false
resultHash = 565b6f1570aa20a8b239d9275109fcb6bad2ec9d6f583c359b205b37ad7f6ce8
```

Individual gate pass counts:

```text
opportunityUniqueHistoricalTrajectories = 748 / 1183
opportunityUniqueRuleStates = 748 / 1183
highDivergenceUniqueHistoricalTrajectories = 244 / 1183
distinctOpeningPrefixes = 1045 / 1183
maximumSingleOpeningPrefixShare = 1105 / 1183
generationStrata = 1086 / 1183
maximumSingleGenerationStratumShare = 1111 / 1183
highDivergenceRate = 52 / 1183
medianDRange = 54 / 1183
```

このgate decompositionはnegative resultの構造を記録するためのdescriptive auditである。near-missを新candidateへ昇格させる根拠ではない。

## Hypothesis-level interpretation

### CPOB-H1 — exploratory existence

Fresh Stage 1 rootsの中に`D_range >= 0.30`を満たすrootは観測された。したがってfrozen policy / population内では「material continuation divergenceを示すrootが存在する」というexploratory existence observationは得られた。

これはformal confirmation labelではない。

### CPOB-H2 — structural recurrence

Frozen structural matcher grammarからpromotionされたcandidateは0件だった。

したがって、**今回のgrammarとpromotion ruleの範囲では、Stage 2 confirmationへ送れるrecurrent structural classは得られなかった**。

### CPOB-H3 / H4 / H5

D2/D3 search axes、TopSet instability、immediate structural transition、one-ply response envelopesはStage 1で測定・独立再計算されたが、これらはStudy 1ではsecondary / descriptive / hypothesis-generating axesであり、本closureで新しいformal claimへ昇格させない。

## Why Stage 2 was not run

Stage 2 boundary required:

```text
separate candidate freeze
formal preregistration
source-hash-bound authorization
fresh evidence
zero Stage 1 identity overlap
```

最初の条件であるexact Stage 1 candidate mappingが存在しない。

```text
promotedCandidateCount = 0
```

したがって、Stage 2を開始するためにcandidate thresholdを緩和したり、near-missを選んだり、grammarを拡張したりすることはresult-triggered rescueになる。

```text
Stage 2 seeds 22700001..22706144 = RESERVED / UNCONSUMED
Stage 2 generation = NOT AUTHORIZED / NOT EXECUTED
```

Formal candidate labels `CONFIRMED` / `NOT-CONFIRMED` / `INCONCLUSIVE-NOT-ESTIMABLE` / `TECHNICAL-INCONCLUSIVE` は、formal candidateが存在しなかったため本Studyでは適用しない。

## What is not authorized

本結果から次は主張しない。

```text
Baoに重要局面は存在しない
high-divergence rootはgame-theoretic turning pointである
D_rangeは真の勝率差である
engine score差はwin-probability差である
今回の1–2 token grammar以外の表現でも予測不能である
multi-feature / nonlinear classifierにも構造は存在しない
human playersが同じ局面を重要と認識する／しない
expertsやtraditional Bao theoryが同じturning pointsを持つ／持たない
```

Position Evaluation / Win-Rate Calibration Study 1は`INCONCLUSIVE`のままであり、そのexploratory isotonic mappingをvalidated probability converterとして使用していない。

## No-rescue closure

```text
seed extension = false
replacement sampling = false
root replacement = false
phase reassignment = false
replicate extension = false
continuation policy substitution = false
continuation cap change = false
D_range threshold retuning = false
candidate grammar edit = false
support/diversity threshold relaxation = false
near-miss promotion = false
manual override = false
```

## Canonical identities

```text
stageId = CPOB-S1-EXPLORATORY-2026-08-23-v1
spec SHA-256 = 22710c008cbcb6f6030d30f3295e9e3420efeeed75edfbfc3de3e292ff6a16fc
selectionHash = 702baa878354be14ca97a026b2e97b48521a769b983874fb657e2c6afe82d57d
discovery embedded resultHash = 565b6f1570aa20a8b239d9275109fcb6bad2ec9d6f583c359b205b37ad7f6ce8
uploaded discovery artifact SHA-256 = e1931c0f84b294bf8201e7732756bf156d688e4a38d55587e61b7303848d5024
```

Compact repository record:

- [`results/STAGE_1_EXPLORATORY_SUMMARY.json`](results/STAGE_1_EXPLORATORY_SUMMARY.json)

Closure checkpoint:

- [`checkpoints/2026-08-24-stage1-discovery-zero-promoted-candidates-study-closure.md`](checkpoints/2026-08-24-stage1-discovery-zero-promoted-candidates-study-closure.md)

## Final Study 1 state

```text
Stage 0 = COMPLETE / PASS
Stage 1 source corpus = COMPLETE / VERIFIED
Stage 1 selected roots = 600 / 600 estimable
Stage 1 high-divergence roots = 139 / 600 (exploratory)
Stage 1 candidate audits = 1183
Stage 1 promoted candidates = 0
Stage 2 formal candidates = 0
Stage 2 = NOT EXECUTED
Study 1 = CLOSED AFTER STAGE 1 NEGATIVE EXPLORATORY RESULT
```
