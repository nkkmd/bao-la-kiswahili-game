# 2026-08-30 — UMSSR-STUDY1 Stage 1 pre-scientific source/spec freeze

## 目的

`UMSSR-S1-DEVELOPMENT-2026-08-30-v1`でscientific seedを消費する前に、development population、40-feature dictionary、numeric/scaling contract、representation selection、Stage 1 readiness、Stage 2 validation endpoint、production / independent tooling、technical smokeをprospectively固定する。

このcheckpointを含むcommitは**scientific authorizationではない**。

```text
Stage 1 = NOT-AUTHORIZED-NOT-EXECUTED
Stage 1 seeds 29310001..29314096 = RESERVED / UNCONSUMED
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
Stage 2 seeds 29410001..29418192 = RESERVED / UNCONSUMED
scientific evidence generated before freeze = false
```

## development population

```text
games = 4096
opening plies = 10
max ply = 96
source policies = UNIFORM / CAPTURE_FIRST / HIGH_CAPTURE / LOW_CAPTURE
phase assignment = SHA256 parity, no reassignment
selected roots = 512
strata = phase 2 x source policy 4
quota = 64 per stratum
selected RAW-state key = globally unique
```

root selectionはseed、source policy、phase、ply、legal-move count、RAW-state key、trajectory hash、opening-prefix hash、frozen hash rankだけを使用する。

winner、terminal outcome、search/evaluation score、tactical result、C03 result、reply result、cluster assignment、future continuationをselectionへ使用しない。

## Stage 1 actual feature set

40 featuresを`prereg/STAGE_1_FEATURE_DICTIONARY.json`へ固定する。

family:

- rule-semantic state
- RAW material / occupancy
- legal-move / one-ply branching
- search / ranking stability
- evaluation sign / top-set stability
- machine-decision raw agreement observables
- reply-set / reply-pressure raw observables
- tactical raw / original-scope `TM-S2-C03`
- depth-2 RAW local graph

次は直接使用しない。

```text
G2-06 RICH_ALL / classifier
G2-07 F05_ALL / lambda=100 model
G2-08 promoted taxonomy / classifier
G2-09 generalization / counterexample boundary
historical MTAJI-M1/MTAJI-M2 executable classifier
```

## numeric / scaling contract

```text
arithmetic = IEEE-754 binary64
feature row order = rawStateKey lexical
aggregation order = lexical
float canonical encoding = big-endian binary64 lowercase hex
undefined = forbidden
zero-variance feature = inactive before clustering
standardization = Stage 1 population mean / population SD
minimum active features = 24
minimum active feature families = 6
Stage 2 restandardization = forbidden
```

## representation selection

primary representationは単一scalarではなく、

```text
standardized multiaxial vector
+
deterministic K-means regime assignment
```

とする。

Study 1ではPCA / latent dimensionality reductionを使用しない。

```text
candidate K = 2,3,4,5,6
distance = squared Euclidean
initialization = deterministic global-mean-nearest first centroid + deterministic farthest-point continuation
Lloyd max iterations = 100
empty cluster = candidate K ineligible
regime labels = centroid binary64 lexical order -> R01..R0K
```

candidate Kのeligibility:

```text
minimum cluster support fraction >= 0.10
mean silhouette >= 0.05
5-fold held-out assignment stability >= 0.80
```

eligible Kのwinnerはmean silhouette最大、tieはstability大、さらにtieなら小さいKとする。

eligible Kが0なら、readinessがPASSしていても:

```text
STAGE1-DEVELOPMENT-BLOCKED-NO-REPRESENTATION
```

とする。threshold / K rangeを変更して救済しない。

## Stage 1 readiness

representation eligibilityとは別に、global readinessを次で固定する。

```text
generated games = exactly 4096
unique trajectories >= 3800
distinct generated opening prefixes >= 3000
selected roots = exactly 512
each phase/source-policy stratum = exactly 64
selected RAW states = all unique
selected distinct opening prefixes >= 480
max single selected opening-prefix share <= 0.02
active features >= 24
active feature families >= 6
production/independent source exact = required
production/independent selection exact = required
production/independent feature/scaler/K metrics exact = required
mandatory artifacts complete = required
```

readiness failureは`STAGE1-DEVELOPMENT-BLOCKED-NON-ESTIMABLE`であり、representation-selection failureと区別する。

## Stage 2 endpointをStage 1 outcome前に固定

Stage 2 validation contractはStage 1 outcomeを見ずに同じcommitへ固定する。

Stage 2 population:

```text
games = 8192
selected roots = 1024
8 phase/source-policy strata x 128
Stage 1 seed overlap = 0
trajectoryHash overlap = 0
openingPrefixHash overlap = 0
selectedRawStateKey overlap = 0
```

Stage 2ではStage 1 scaler / active features / centroidsをそのまま使用し、refit、restandardization、reclustering、K変更を禁止する。

primary:

```text
HELD_OUT_SUPPORT_AND_ASSIGNMENT_ROBUSTNESS
```

support:

```text
each frozen regime overall support >= 0.05
each frozen regime observed in >= 2 source policies
```

bounded search perturbation:

```text
base = Q1
perturbations = Q0, Q2
overall assignment robustness >= 0.75
within each regime robustness >= 0.65
```

primaryはsupportとrobustnessの全gate PASSを要求する。

## Stage 1 decision mapping

final scientific runnerでは順序を固定する。

1. production / independent mismatch等 -> `STAGE1-DEVELOPMENT-BLOCKED-TECHNICAL-INVALID`
2. resource / mandatory artifact failure -> `STAGE1-RESOURCE-CENSORED`
3. global readiness failure -> `STAGE1-DEVELOPMENT-BLOCKED-NON-ESTIMABLE`
4. readiness PASSかつeligible representation 0 -> `STAGE1-DEVELOPMENT-BLOCKED-NO-REPRESENTATION`
5. readiness PASSかつrepresentation selected -> `STAGE1-DEVELOPMENT-PASS-REPRESENTATION-FROZEN`

この順序をoutcome後に変更しない。

## tooling smoke

scientific authorization前にtechnical seed `29300001..29300064`だけを使用し、production / independentのsource、selection、40-feature rows、scaler、K-means candidate、representation objectをexact比較する。

workflowでは`set -euo pipefail`を使用し、runner failureを`tee`でmaskしない。

smoke failure後にscientific contract、feature、threshold、K range、population、scientific seedを変更することは認めない。実装defectだけを同一technical contractで修正できる。

## authorization boundary

このfreezeとtechnical smokeのPASSだけではStage 1を自動authorizeしない。

Stage 1 scientific runner / artifact contract / execution-start consume-once gateをsource-freezeし、technical preflightでPASSした後、別のexplicit authorization artifactが必要である。
