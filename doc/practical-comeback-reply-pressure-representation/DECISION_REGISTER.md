# PCRPR-STUDY1 — Decision Register

更新日: 2026-08-29

本書は`PCRPR-STUDY1`のprospective decisionsとterminal decisionsを一体で保持する。既存のprospective decisionは、後続のoutcomeによって遡及変更しない。

## D01 — 研究識別

```text
Program = G2-07
Study ID = PCRPR-STUDY1
Formal title = Practical Comeback / Reply-Pressure Representation Study 1
Baseline main = e5ad840520eb6c5bd0408f924c1f9a55c4cba6a5
Branch = research/g2-07-practical-comeback-reply-pressure-representation
```

Status: **FROZEN**.

## D02 — Stage構成

```text
Stage 0 = PCRPR-S0-TECHNICAL-2026-08-29-v1
Stage 1 = PCRPR-S1-DEVELOPMENT-2026-08-29-v1
Stage 2 = PCRPR-S2-FORMAL-2026-08-29-v1
```

Stage 0はtechnical-only、Stage 1はdevelopment-only、Stage 2はfresh formal validation専用とする。

Status: **FROZEN**.

## D03 — upstream no-rescue

`PCEM-STUDY1`の55 audits / promoted 0 / Stage 2 non-authorization、`RCPR-STUDY1`のStage 1 technical-invalid / consumed block / Stage 2 non-authorizationを変更しない。

Status: **FROZEN IMMUTABLE BOUNDARY**.

## D04 — RAW identity

```text
include = pits,reserve,houseOwned,player,phase,winner,pending
exclude = turn,reason
validated transform set = []
canonicalization = false
symmetry reduction = false
```

Status: **FROZEN**.

## D05 — Primary representation unit

```text
historical RAW root occurrence × exact root-move variant
```

Status: **FROZEN**.

## D06 — Construct separation

baseline reference value、root-move-conditioned value、reply-conditioned value、machine-policy continuation value、reply-pressure representationを同一constructへ統合しない。

Status: **FROZEN**.

## D07 — Human-claim firewall

machine reply pressure / opponent-policy sensitivityをhuman difficulty、deception、human error probability、psychological pressure、expert-perceived complexityと同一視しない。

Status: **FROZEN**.

## D08 — Leakage taxonomy

```text
A = PRE_ROOT_OBSERVABLE
B = ROOT_OR_REPLY_DERIVED_OUTCOME_INDEPENDENT
C = SEARCH_OR_POLICY_DISTRIBUTION_DERIVED_OUTCOME_INDEPENDENT
D = CONTINUATION_OR_FUTURE_OUTCOME_DERIVED
```

predictorはA-Cのみ。Dはtarget/outcome専用。

Status: **FROZEN**.

## D09 — Representation family search space

```text
REPLY_SET_WIDTH
DEFENSE_MAINTAINING_REPLY_FRACTION
REPLY_QUALITY_DISTRIBUTION
PUNISHMENT_CONCENTRATION
BEST_REPLY_GAP_VECTOR
FORCING_REPLY_STRUCTURE
REPLY_BRANCH_ASYMMETRY
REPLY_SEARCH_STABILITY
OPPONENT_POLICY_SENSITIVITY
ROOT_MOVE_REFERENCE_CONTEXT
LOCAL_TACTICAL_GEOMETRY_RESERVE_HOUSE_PHASE
LOCAL_TEMPORAL_CONTEXT
```

Stage 1 outcome後のfamily追加は禁止。

Status: **FROZEN SEARCH-SPACE BOUNDARY**.

## D10 — Opponent-policy-sensitivity boundary

predictor側ではoutcome-independentなreply distribution / deterministic scoreのみを使用し、empirical terminal outcomeを特徴量へ入れない。

Status: **FROZEN**.

## D11 — G2-06 numeric lesson

canonical reply ordering、deterministic binary64 accumulation、binary64 serialization、integer-like-key adversarial control、reply permutation control、independent exact recomputationをStage 1 authorization前に要求する。

Status: **FROZEN TECHNICAL REQUIREMENT**.

## D12 — Stage 1 fresh block

```text
games = 3072
seeds = 28710001..28713072
use = CONSUME-ONCE-DEVELOPMENT-ONLY
```

Status at reservation: **RESERVED / UNCONSUMED**.

## D13 — Stage 2 fresh block

```text
seeds = 28810001..28816144
count = 6144
use = FORMAL-ONLY
```

Reservationはauthorizationではない。

Status: **RESERVED / UNCONSUMED**.

## D14 — Source population

8-ply seeded-uniform exact opening、max observed ply 100、6 generation strata `B-D1/B-D2/B-D3/LS-D2/V2-D2/LE-D2`、root target 400（Namua/Mtaji 200/200）を固定する。

Status: **FROZEN BEFORE SCIENTIFIC EXECUTION**.

## D15 — Root selection

trajectory occurrenceをphase assignment後にhash-selectし、その後D3 disadvantage (`bestScore < 0`)を評価する。失敗時のwithin-trajectory replacementは禁止。duplicate RAW stateはquota前にdeterministically collapseする。

Status: **FROZEN**.

## D16 — Continuation / target

```text
actor = canonical D2 best
strong = canonical D2 best / 1 replicate
medium = seeded D1 top3 / 16 replicates
weak = seeded uniform exact reply / 8 replicates
horizon = 96 post-root plies
primary target = medium bounded-win rate - strong bounded-win indicator
```

Status: **FROZEN**.

## D17 — Model contract

5 prospectively declared family sets、ridge lambda `0.1,1,10,100`、5-fold grouped CV、pooled OOF RMSE primary、tie-aware Spearman secondary、individual scalar selectionなし、interactionなし。

Status: **FROZEN**.

## D18 — Consume-once rule

explicit authorization + source/spec/hash validation成功後、execution-start生成時点でblockをCONSUMEDとする。以後、rerun、repair、replacement、extension、threshold/model/target/tolerance変更は禁止。

Status: **FROZEN**.

## D19 — Independent verifier

Bao engine/AIのauthoritative semanticsは共有可能だが、PCRPR production feature/model/result helpersをimportしない別実装でdecision coreを再構築する。

Status: **FROZEN**.

## D20 — Stage 2 automatic authorization禁止

Stage 1が成功してもStage 2を自動開始しない。

Status: **FROZEN**.

## D21 — Stage 0 numeric contract

```text
search = pcrpr-exact-full-window/bao/q0/v1
aggregation order = lexical exact move identity
float = deterministic IEEE-754 binary64
scalar encoding = big-endian binary64 lowercase hex
feature equality = EXACT
tolerance = none
```

Status: **FROZEN**.

## D22 — Stage 0 canonical decision

```text
workflow = 33238931893 / success
artifact = 9710763348
production gates = 18/18 PASS
independent gates = 9/9 PASS
feature width = 80
Decision = STAGE0-TECHNICAL-PASS
```

Status: **FROZEN TECHNICAL RESULT**.

## D23 — Pre-outcome family-set correction

initial Stage 1 specの`F03_REPLY_POLICY`と`F04_ALL_NO_TEMPORAL`重複を、implementation validation、authorization、seed consumption、scientific outcomeより前に修正した。

Status: **VALID PRE-OUTCOME CORRECTION**.

## D24 — Deterministic computation contract

row/feature order、target arithmetic、fold、standardization、normal equation、Cholesky、prediction、RMSE、Spearman、top-quintile、candidate selection、binary64 model serializationを固定し、independent exact result/hash matchを要求する。

Status: **FROZEN PRE-OUTCOME**.

## D25 — Stage 1 decision mapping

```text
all gates + full independent verification PASS
  -> STAGE1-DEVELOPMENT-PASS-AND-FORMAL-TARGET-AVAILABLE
population/root/target support failure
  -> STAGE1-DEVELOPMENT-BLOCKED-NON-ESTIMABLE
model/enrichment failure
  -> STAGE1-DEVELOPMENT-BLOCKED-ZERO-PROMOTION
resource ceiling failure after consumption
  -> RESOURCE-CENSORED
technical/integrity/independent-verification failure
  -> STAGE1-TECHNICAL-INVALID
```

Status: **FROZEN PROSPECTIVELY**.

## D26 — Preauthorization validation

以下はscientific seed consumption前にPASSした。

```text
production smoke = 33240901637
resource preflight = 33240989191
independent exact smoke = 33241110983
source-freeze audit = 33241372471
source-freeze commit = eb48ecae8d5ae171175f7cc9f00c9bcc77b2c237
```

Status: **PASS**.

## D27 — Stage 1 explicit authorization

```text
authorization commit = 64f0352e7d8b26432e2a68c408e403859c3e71bf
workflow = 33241465899
authorize-and-consume job = 99071430645 / success
```

Status: **AUTHORIZED AND EXECUTION STARTED**.

## D28 — Stage 1 consumption

consume-once gate成功により:

```text
seeds 28710001..28713072 = CONSUMED
same-block rerun = NOT AUTHORIZED
repair = NOT AUTHORIZED
replacement = NOT AUTHORIZED
extension = NOT AUTHORIZED
```

Status: **IRREVERSIBLY CONSUMED**.

## D29 — Production outcome disposition

production job `99071451933`は計算・artifact uploadとも成功し、400 roots / 1429 rows、`F05_ALL`、`lambda=100`、support/performance gates PASSを報告した。

production disposition:

```text
STAGE1-DEVELOPMENT-PASS-PENDING-INDEPENDENT-VERIFICATION
```

Status: **PRODUCTION-ONLY UNVERIFIED PROVENANCE**.

## D30 — Independent computation completion

independent job `99071451969`のscientific replay stepは成功した。terminal stdoutは3072 games / 400 roots / 1429 rows / `F05_ALL` / `lambda=100`を報告し、development core SHA256はproductionと一致した。

```text
4a45d6f9d634510226922589d67f52919911fe40fa2a6a95ff8c24c08cc409a2
```

Status: **COMPUTATION COMPLETED / FULL ARTIFACT NOT PRESERVED**.

## D31 — Independent artifact transport incident

`actions/upload-artifact@v4`の`CreateArtifact` requestが5回連続timeoutし、full `independent-result.json`はartifactとしてmaterializeされなかった。

Status: **TECHNICAL INCIDENT**.

## D32 — stdout-only substitution禁止

frozen final comparerはsource corpus、selection、rows、measurements、compact rows、development core、model、final model、readinessをfull objectsからexact比較する契約である。terminal stdoutのcore hash一致をfull verificationの代替にしない。

Status: **NO POST-OUTCOME RELAXATION**.

## D33 — Final comparer未実行

required independent artifactが存在しないためfinal-verification job `99096549383`はskippedとなった。

```text
mandatory full independent verification = INCOMPLETE
```

Status: **FAIL-CLOSED**.

## D34 — Stage 1 final decision

prospectively frozen decision mappingをそのまま適用する。

```text
Stage 1 = STAGE1-TECHNICAL-INVALID
```

これはrepresentationのscientific rejectionではなく、mandatory full independent verification contractを満たせなかったtechnical-invalid closureである。

Status: **FINAL / IMMUTABLE FOR PCRPR-STUDY1**.

## D35 — Production metricsの扱い

`F05_ALL`、`lambda=100`、OOF metrics、top-quintile enrichment、support/performance PASSはprovenanceとfuture hypothesis generationにのみ使用可能。validated representation/modelまたはaccepted scientific evidenceとして使用しない。

Status: **UNVERIFIED PROVENANCE ONLY**.

## D36 — Stage 2 closure

```text
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
seeds 28810001..28816144 = RESERVED / UNCONSUMED
```

Stage 1 production signalを理由にStage 2を例外authorizationしない。

Status: **FINAL NON-AUTHORIZATION**.

## D37 — Study closure

```text
PCRPR-STUDY1 = CLOSED
scientificInferenceAuthorized = false
confirmatoryReuseAllowed = false
same-study result-driven retry = NOT AUTHORIZED
```

Status: **CLOSED**.

## D38 — main integration

本closureはresearch branch上で行う。mainへのmergeは別の明示的指示があるまで実施しない。

```text
main integration = NOT PERFORMED
```

Status: **HELD FOR EXPLICIT INTEGRATION DECISION**.
