# PBAI-P1 Decision Register

## Program decisions frozen at establishment

### D01 — Separate engineering track

PBAI-P1はResearch Trackとは独立する。engineering resultは既存研究のformal decisionを変更しない。

### D02 — Evidence cutoff

PBAI-P1はprogram-start scientific evidence anchor `2db7c4d65771066e914f32cbc4116fcc3e9e386a`までのcompleted **Research Generation 1** researchを科学的inputとする。Research Generation 2 outcomeを途中追加しない。

### D03 — No implementation at program establishment

Program文書の追加だけではpublic AIコードを変更しない。PBAI-A/B/C完了前のcandidate implementationを承認しない。

### D04 — Research labels remain intact

`CONFIRMED`、`NOT-CONFIRMED`、`INCONCLUSIVE`、`NON-ESTIMABLE`、bounded exact、exploratory/descriptive等をengineering都合で再ラベルしない。

### D05 — No unvalidated win-probability semantics

Position Evaluation / Win-Rate Calibration Study 1はformal `INCONCLUSIVE`であり、既存mappingをvalidated Bao win probabilityとしてpublic UIまたはAI primary logicへ導入しない。

### D06 — RAW identity remains authoritative

validated transform setが存在しないため、unvalidated symmetry/reflection/seat swap/canonicalizationをproduction state identity、TT key、tablebase keyへ導入しない。

### D07 — Human claims remain separate

machine search complexity、reply concentration、error dependenceをhuman difficulty/error/deceptionとして表示しない。

### D08 — Ablation before combination

複数mechanismを同時導入せず、原則single-candidate comparisonから開始する。

### D09 — Holdout protection

release holdoutはcandidate tuningへ使用しない。holdout消耗時はnew blockをprospectively freezeする。

### D10 — Release safety dominates strength

rule correctness、invalid-state、crash、major operational regressionをstrength improvementで相殺しない。

## PBAI-A decisions — 2026-08-26

### D11 — Canonical Research Generation 1 evidence core

PBAI-Aのscientific evidence coreを次の14 completed Study areasとしてfreezeする。

```text
Phase Transition Study 1
Position Typology / Playing Style Study 1
Namua→Mtaji Strategic Temporal Transition Study 1
Position Complexity / Difficulty Study 1
Tactical Motifs / Tesuji Study 1
Tactical Motif Human / Expert Validation Study 1
Position Evaluation / Win-Rate Calibration Study 1
Blunder / Misvaluation Patterns Study 1
Critical Positions / Outcome Branching Study 1
Restricted Endgame / Winning Regions Study 1
Symmetry / Isomorphic Positions Study 1
ORISC-STUDY1
State Space / Game Tree Complexity Study 1
PCEM-STUDY1
```

First Joseki Study、first-player advantage research、paired-opening work、historical AI developmentは重要な先行context / engineering infrastructureとして扱うが、PBAI-AによってResearch Generation 1 scientific evidenceへ黙って再分類しない。特定のscientific findingをcandidate evidenceとして使う場合は、後続decisionでeligibilityを明示する。

### D12 — PBAI-A complete

`GENERATION_1_EVIDENCE_AUDIT.md`のStudy-by-Study audit、E1/E2/E3/E4分類、prohibited inference、candidate trace、Research Generation 2 exclusion、RAW identity boundaryを確認し、PBAI-Aを`COMPLETE`とする。

PBAI-A完了はcandidate implementation authorizationではない。

```text
PBAI-C001..PBAI-C005 = EVIDENCE-AUDIT-READY
AUTHORIZED-FOR-DEVELOPMENT = 0
```

### D13 — Current `AI.stateKey` is not the Research Generation 1 RAW identity contract

Research-derived authoritative RAW identityは次を含む。

```text
pits
reserve
houseOwned
player
phase
winner
pending
```

`turn`、`reason`は除外する。

PBAI-A開始時点の`public/ai.js` `AI.stateKey`は`pending`を含まないため、Research Generation 1のauthoritative RAW identityと同一ではない。この観測だけからcurrent public search failureを宣言しないが、`PBAI-C003`等のtablebase/research-derived RAW keyへ`AI.stateKey`を暗黙流用することを禁止する。

### D14 — PBAI-B is the next authorized phase

PBAI-A完了後の次工程は`AI-GEN2` exact public baseline freezeである。PBAI-C numeric gates未freezeの間はcandidate developmentを承認しない。

### D15 — Candidate evidence readiness does not reserve AI-GEN3

`EVIDENCE-AUDIT-READY`、`AUTHORIZED-FOR-DEVELOPMENT`、development build、validation pass、release candidateのいずれも`AI-GEN3`を意味しない。`AI-GEN3`は明示的`ADOPT` decisionとpublic-default deployment後のみ付与する。

## PBAI-B decisions — 2026-08-26

### D16 — Exact AI-GEN2 baseline identity

```text
baselineId = AI-GEN2-BASELINE-2026-08-26-v1
generationLineage = AI-GEN2
repository = nkkmd/bao-la-kiswahili-game
source branch = main
source commit = f4ae3b11901180cbe417b3e643e2b357d8045d2d
public source directory = public/
```

Machine-readable正本は`baselines/AI-GEN2-BASELINE-2026-08-26-v1.json`とする。

### D17 — Public deployment binding and unknown-provider-ID boundary

PBAI-B public endpointは`https://bao-la-kiswahili.cultivationdata.net/`。Cloudflare provider内部のdeployment IDは今回のrepository/toolingから取得できなかったため推測しない。Bindingはpublic endpoint + documented Cloudflare Pages target + `main/public` source ref + repository asset SHA-256とする。Exact live JS asset byte comparison未実施の境界も明記する。

### D18 — Current public hard/expert configuration overrides stale historical prose

Current `public/ai-config.js`をbaseline authorityとする。

```text
hard:   low D6/400ms; standard D8/500ms; high D10/600ms
expert: low D10/1500ms; standard D12/2000ms; high D14/3000ms
adaptive public default = false
```

`AI_DEVELOPMENT_LOG.md`のhistorical `D4/450ms`記述はcurrent truthとして使用しない。

### D19 — Search/runtime semantics are baseline properties, not candidate claims

```text
default evaluation = bao
hard/expert = enhanced alpha-beta iterative deepening
historical benchmark identifier = phase2
quiescenceDepth = 1
TT max entries = 50,000
evaluation cache hard/expert = enabled / max 2,048
PWA cache = bao-la-kiswahili-v24
```

D13 RAW-identity prohibitionは維持する。

### D20 — Fixed-depth and time-limited baseline evidence remain separate

PBAI-B canonical workflow `32910436754`でdeterministic fixed-depth verificationとtime-limited operational smokeを別々に実行し、relevant regressionsをPASSした。Time-limited absolute valuesはcandidate acceptance thresholdではない。

### D21 — PWA/cache identity is part of release safety

Current cache `bao-la-kiswahili-v24`はAI/engine/worker/configをpre-cacheする。Future public adoptionではPWA cache version / asset replacement / rollback behaviorをrelease gateへ含める。PBAI-Bはpublic assetを変更しない。

### D22 — PBAI-B complete; PBAI-C numeric gate freeze is next

```text
PBAI-B = COMPLETE
baselineFrozen = true
baselineId = AI-GEN2-BASELINE-2026-08-26-v1
PBAI-C numeric gates = NOT-FROZEN
AUTHORIZED-FOR-DEVELOPMENT = 0
AI-GEN3 = NOT-AUTHORIZED
```

## PBAI-C decisions — 2026-08-26

### D23 — Global gate-spec identity and pre-outcome freeze

Canonical PBAI-C gate specを次としてfreezeする。

```text
gateSpecId = PBAI-C-GLOBAL-GATES-2026-08-26-v1
baselineId = AI-GEN2-BASELINE-2026-08-26-v1
gate-freeze source main = 0887551fd2e67c6e90c5171465b3354f9042adc4
candidate implementations observed before freeze = 0
candidate outcomes observed before freeze = 0
Research Generation 2 evidence included = false
```

Machine-readable正本は`benchmark/PBAI-C-GLOBAL-GATES-2026-08-26-v1.json`とする。

Global gatesはcandidate-specific contractで緩和できない。

### D24 — Playing-strength non-inferiority rule

Primary relative playing-strength evidenceはhard / fixed D3 / unlimited timeのpaired shared-opening comparisonとする。Candidate/baselineは同openingでSouth/Northを交換する。

Validationとfresh release holdoutは各々:

```text
core observed candidate score >= 0.50
one-sided 95% opening-pair bootstrap LCB >= 0.47
each core phase observed score >= 0.48
each seat observed score >= 0.47
each challenge stratum observed score >= 0.45
```

Locked validation + holdout final check:

```text
core observed score >= 0.50
one-sided 95% LCB >= 0.48
each core phase >= 0.49
each seat >= 0.48
```

Bootstrapはopening pairをunit、20,000 replicates、analysis seed `31999991`で固定する。

Sample上のpooled observed scoreがbaseline未満のcandidateはpublic adoptionへ通さない。

### D25 — Decision-quality non-regression rule

Fresh rootsはfrozen baseline D4 exact-full-window `bao` referenceで評価する。

Validationとholdoutは各々:

```text
catastrophic new loss count = 0
severe-loss excess <= +0.01
top-set agreement delta >= -0.02
mean normalized rank-loss delta <= +0.02
per-phase severe-loss excess <= +0.02
per-phase top-set agreement delta >= -0.03
```

Locked validation + holdoutでは:

```text
catastrophic new loss count = 0
severe-loss excess <= +0.005
top-set agreement delta >= -0.01
mean normalized rank-loss delta <= +0.01
```

を要求する。

### D26 — Correctness and operational hard floors

Correctness hard gates:

```text
frozen public/engine.js SHA unchanged
existing tactical failures = 0
candidate-specific regression failures = 0
required relevant test failures = 0
crash / illegal move / invalid state = 0
unvalidated canonicalization = prohibited
Research Generation 1 RAW identity violation = prohibited
scientifically prohibited inference in implementation/UI = prohibited
```

Operational relative gates:

```text
median elapsed ratio <= 1.05
p95 elapsed ratio <= 1.10
median completed-depth delta >= -1
fraction roots candidate >=2 depths below baseline <= 0.05
timeout-rate increase <= +0.05
direct/Worker deterministic mismatch = 0
added public static candidate assets <= 524,288 bytes
```

Persistent tables/cachesを導入するcandidateはimplementation前に追加memory gateをfreezeする。

### D27 — Frozen split and release-holdout authorization firewall

Development、validation、release holdoutのseed blocksをglobal gate specへprospectively freezeする。Engineering namespaces `31000001..31801024`内の各blockは相互非重複とする。

PBAI-C時点:

```text
release holdout ranges = FROZEN
release holdout execution = NOT-AUTHORIZED
```

Holdout実行にはvalidation PASS、candidate source/config hash freeze、explicit PBAI-F authorizationを必要とする。Holdoutを見た後のsame-holdout retuning、threshold relaxation、mechanism rescueは禁止する。

### D28 — Candidate isolation / feature-off baseline comparator

Every candidate must be feature-gated:

```text
feature off = frozen baseline comparator
feature on = exactly one PBAI candidate
public default before adoption = off
```

Feature-offはmandatory frozen baseline fixturesを再現する必要がある。複合変更はnew candidate IDを必要とし、component ablationを先行する。

### D29 — Candidate-specific intended-benefit rule remains mandatory

PBAI-C global non-regression PASSだけでは通常のimprovement candidateをADOPTしない。

PBAI-Dで各candidateについてimplementation前に:

- exact mechanism/flag;
- primary intended-benefit endpoint;
- minimum practical benefit;
- target/control strata;
- candidate-local dev/validation/holdout block;
- runtime/memory budget where applicable;
- failure/rollback contract;

をfreezeする。

Correctness/semantics-only maintenance candidateはstrength improvementを必須としないが、prospectivelyそのclassを宣言し、exact equivalence/correctness benefitとglobal non-regressionを満たす必要がある。

### D30 — No compensation across major gate classes

Playing strength、decision quality、operational quality、correctness、robustnessを別軸として判定する。

```text
strength improvement cannot offset correctness failure
operational improvement cannot offset decision failure
decision improvement cannot offset major robustness failure
```

Candidate-specific benefitもglobal hard gate failureを相殺できない。

### D31 — PBAI-C complete; PBAI-D is next

Global numeric gates、sample/seed blocks、holdout firewall、candidate isolation、release conjunctionをcandidate outcome前にfreezeしたため:

```text
PBAI-C = COMPLETE
PBAI-C global gates = FROZEN
AUTHORIZED-FOR-DEVELOPMENT = 0
candidate implementations = 0
release holdout execution = NOT-AUTHORIZED
AI-GEN3 promotion = NOT-AUTHORIZED
```

とする。

次に許可されるphaseはPBAI-Dの**one exact candidate contract + development authorization**である。適切なcandidateが存在しない場合の正常なprogram outcomeは`KEEP-AI-GEN2`である。

## PBAI-D / PBAI-E candidate decisions — 2026-08-26

### D32 — PBAI-C002-v1 was prospectively authorized as move-ordering-only

`PBAI-C002-v1`は`TM-S2-C03`のResearch Generation 1 evidenceを使う最初のengineering candidateとして、PR #54でexact contractをfreezeしてdevelopmentのみをauthorizeした。

```text
feature = pbaiC002C03Ordering
public default = off
mechanism = enhanced-alpha-beta root move ordering only
allowed public code surface = public/ai.js only
selective extension = prohibited
evaluation bonus = prohibited
forced move = prohibited
depth/time-budget change = prohibited
persistent table/cache = prohibited
```

Research consequenceはruntime triggerへ使用せず、scientific interpretation boundaryを維持した。

### D33 — C002 development population was materialized before benefit metrics

PBAI-E isolated draft PR #55でpre-metric safety testsをPASSした後、frozen development source block `31300001..31300512`だけをmaterializeした。

```text
run = 32914807381
job = 98016194190
population digest = e016daa0f4669ac7730d34725de16d8c1ff10c398ca07867f47e81df0b399ea7
population = 128 Namua + 128 Mtaji = 256
historical trajectory candidates = 432
eligible C002 target roots = 5
required minimum estimable roots = 48
controls = 32 Namua + 32 Mtaji reusablePits>=3
candidate benefit metrics observed = false
validation seeds accessed = false
release holdout seeds accessed = false
```

Artifact `9587768831`のZIP SHA-256は`bbf591baa19bdc33eb2a747e11e8fd390fd0fb33c84efd215cadbd19942d6d16`。

### D34 — PBAI-C002-v1 is NON-ESTIMABLE / HOLD; no rescue

Frozen contractのminimum estimability gate `48`に対しeligible target supportが`5`だったため、candidate node/score benefit evaluationへ進まない。

```text
PBAI-C002-v1 = NON-ESTIMABLE / HOLD
candidate benefit metrics = NOT EXECUTED
validation = NOT EXECUTED
release holdout = NOT EXECUTED
PR #55 = CLOSED WITHOUT MERGE
public/main AI change = 0
```

同versionでのsource-block replacement、selector replacement、trigger/order/threshold retuningは禁止する。これは`TM-S2-C03 = CONFIRMED`というResearch Track decisionを変更せず、C03の有効性にnegative evidenceを与えるものでもない。`PBAI-C002-v1`のprospective engineering population/endpointが推定不能だったというengineering resultだけを意味する。

C002 development authorizationはclosureと同時に終了し、`AUTHORIZED-FOR-DEVELOPMENT count = 0`へ戻す。次に進む場合は別の`EVIDENCE-AUDIT-READY` candidateについて新しいexact pre-outcome contractをfreezeする。

## Future decisions

次candidateのcandidate-specific contract、development authorization、development/validation outcome、holdout authorization、adoption/rejection、release/rollback decisionは本registerへ追記する。
