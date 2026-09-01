# PBAI-P2 Engineering Benchmark Protocol

Status: **FROZEN / PBAI-P2-C GLOBAL GATES COMPLETE**  
Program: `PBAI-P2`  
Gate spec: **`PBAI-P2-C-GLOBAL-GATES-2026-09-01-v1`**  
Baseline: **`AI-GEN2-BASELINE-2026-09-01-v1`**

Canonical machine-readable specification:

- `benchmark/PBAI-P2-C-GLOBAL-GATES-2026-09-01-v1.json`

## 1. freeze timing

Global gate、fresh split、failure semanticsはcandidate implementation / candidate benchmark outcomeが0の状態で固定した。

```text
PBAI-P2-A evidence audit = COMPLETE
PBAI-P2-B baseline = COMPLETE
candidate implementations = 0
candidate outcomes = 0
validation outcomes = 0
release holdout outcomes = 0
Research Generation 3 influence = ZERO
```

PBAI-P1で用いたengineering non-inferiority toleranceは、current public AI sourceがP1 exact baseline sourceとbyte-identicalであるため、結果に合わせて変更せず安全側のcontinuity controlとしてそのまま継承した。ただしPBAI-P2ではseed / root source blocksを全面的にfreshな専用namespaceへ変更する。

## 2. evidence separation

最低4層を混合しない。

```text
baseline-only / predevelopment support
  -> PBAI-P2-D exact contract
  -> PBAI-P2-E development
  -> source/config freeze
  -> PBAI-P2-F fresh independent validation
  -> candidate source/config freeze
  -> explicit holdout authorization
  -> PBAI-P2-G protected release holdout
  -> final correctness/operational gate
  -> ADOPT / REJECT / HOLD
  -> PBAI-P2-H actual deployment if ADOPT
```

Validationはtuningに使用しない。release holdoutはselection、threshold設定、tuning、candidate rescueに使用しない。

## 3. fixed-depth playing-strength comparison

```text
level = hard
maxDepth = 3
timeLimitMs = Infinity
maxTurns = 160
```

同一seeded openingをcandidate / baselineのSouth/Northを交換した2局で評価する。administrative max-turn unresolvedはengineering score上`0.5`とするが、Baoの科学的draw claimではない。

Core:

```text
development
  Namua 42100001..42100128
  Mtaji 42101001..42101128

validation
  Namua 42200001..42200256
  Mtaji 42201001..42201256

release holdout
  Namua 42300001..42300512
  Mtaji 42301001..42301512
```

Challenge validation:

```text
42202001..42202064  Namua / openingPlies 4
42203001..42203064  Namua / openingPlies 12
42204001..42204064  Mtaji / openingPlies 0
42205001..42205064  Mtaji / openingPlies 8
```

Challenge holdout:

```text
42302001..42302128
42303001..42303128
42304001..42304128
42305001..42305128
```

20,000-replicate opening-pair bootstrap、analysis seed `43999991`を固定する。

Validation / holdout global safety gate:

```text
pooled observed score >= 0.50
one-sided 95% LCB >= 0.47
each core phase >= 0.48
each seat >= 0.47
each challenge stratum >= 0.45
```

Locked validation+holdoutではpooled LCB `>=0.48`、phase `>=0.49`、seat `>=0.48`を要求する。

## 4. decision quality

Fresh root source:

```text
development = 42400001..42400512 / target 256
validation = 42500001..42501024 / target 512
release = 42600001..42602048 / target 1024
```

Selection:

- legal move count >=2;
- Namua / Mtaji 50/50 target;
- unique authoritative RAW state;
- unique historical trajectory;
- outcome/value/consequence-blind deterministic ranking;
- outcome inspection後のreplacement禁止。

Reference:

```text
AI-GEN2 frozen process
bao evaluation
exact-full-window root candidates
D4
quiescenceDepth 1
timeLimit Infinity
```

これはengineering comparison referenceであり、game-theoretic truth、validated optimal play、validated win probabilityではない。

Metrics:

- D4 TopSet agreement;
- normalized reference rank loss;
- severe-loss frequency;
- catastrophic new loss;
- phase-stratified deltas。

Validation / release safety:

```text
catastrophic new loss = 0
severe-loss rate excess <= 0.01
TopSet agreement delta >= -0.02
mean normalized rank-loss delta <= +0.02
each phase severe-loss excess <= 0.02
each phase TopSet agreement delta >= -0.03
```

## 5. operational quality

Fresh roots:

```text
development = 42700001..42700256 / target 128
validation = 42800001..42800512 / target 256
release = 42900001..42901024 / target 512
```

Primary public-budget condition:

```text
standard hard = D8 / 500ms
standard expert subset = D12 / 2000ms
```

同じroot / hostでcandidateとbaselineをAB/BA交互順に実行する。

Hard limits:

```text
crash / unhandled exception = 0
illegal move = 0
invalid state = 0
median elapsed ratio <= 1.05
p95 elapsed ratio <= 1.10
median completed-depth delta >= -1
fraction with depth deficit >=2 <= 0.05
timeout-rate increase <= 0.05
direct/Worker deterministic mismatch = 0
added public static assets <= 524288 bytes
```

persistent table/cacheを追加するcandidateはdevelopment前に追加memory gateを固定する。

## 6. correctness / regression

Correctnessはstrengthやspeedで相殺できないhard gateである。

- `public/engine.js` SHA-256 remains `e6acf1fe4d97db67dbcfadc3a785e802342ae0b0cbaec35f53eb8e77424cfc1c` within an AI candidate;
- legal move errors = 0;
- state corruption = 0;
- invalid cache reuse = 0 where applicable;
- terminal result preservation;
- deterministic fixed-depth behavior;
- direct / Worker consistency;
- relevant existing tests all pass;
- tactical regression failures = 0;
- candidate-specific fixtures failures = 0;
- validated transform set remains `[]`;
- no canonicalization / symmetry reduction;
- no prohibited scientific/human inference in implementation or UI。

Regression strataはNamua / Mtaji、opening / middle / closing-or-terminal-near、historically reachable、tactical、low-branch / high-branchを含む。

## 7. overlap firewall

Development / validation / release間では少なくとも次を監査する。

```text
seed
historical trajectory
opening prefix
authoritative RAW state
```

RAW keyはG2-authoritative fields:

```text
pits,reserve,houseOwned,player,phase,winner,pending
```

を使用する。unvalidated transformによるdeduplicationは行わない。

## 8. independent verificationとartifact redundancy

Validation / releaseではproduction implementationだけで判定しない。

最低限:

- candidate source/config hash verification;
- independent replayまたはmechanismに適したindependent measurement reconstruction;
- artifact hash verification;
- feature-off baseline equivalence;
- decision / aggregate reconstruction。

mandatory verifier evidenceは単一upload transportだけに依存させない。full artifactに加え、exact contractが検証できるcompact canonical summary + hashesを別経路でmaterializeする。ただしtransport failureを結果後に都合よく免除することはしない。frozen redundant contractでverificationを満たせなければ`TECHNICAL-INVALID`である。

## 9. candidate-specific intended benefit

Global non-regressionだけではcandidateを採用しない。各candidateは`PBAI-P2-D`で、implementation前に次を固定する。

- exact mechanism / feature flag;
- G2 evidence tier / provenance;
- affected code surface;
- support / estimability gate;
- intended-benefit endpoint;
- minimum practical benefit;
- target / control strata;
- development / validation / release population mapping;
- cost / memory gate;
- failure semantics / rollback。

Candidate-specific ruleはglobal gateを緩和できない。

## 10. failure semantics

```text
technical / verifier / mandatory evidence failure
-> TECHNICAL-INVALID

frozen predevelopment support minimum not met
-> NON-ESTIMABLE / HOLD

development intended benefit failure
-> DEVELOPMENT-BENEFIT-FAIL / HOLD

development hard safety failure
-> REJECT / HOLD

validation failure
-> VALIDATION-FAIL / HOLD
-> same-version tuning against validation prohibited

release holdout failure
-> RELEASE-HOLDOUT-FAIL / REJECT-OR-HOLD
-> changed mechanism/threshold requires new candidate/version + new future holdout

missing prerequisite
-> NOT-AUTHORIZED-NOT-EXECUTED
```

## 11. release / generation rule

release holdoutは`PBAI-P2-C`時点で**NOT-AUTHORIZED**。

必要条件:

```text
fresh independent validation PASS
+ candidate source/config hash freeze
+ explicit PBAI-P2-F holdout authorization
```

holdout PASS後も、formal `ADOPT`がなければdeploymentしない。`AI-GEN3`はformal `ADOPT`だけでも付与せず、actual public-default deploymentまで完了した場合にのみ`PBAI-P2-H`でpromotionする。

candidateが全てgateを通らない場合:

```text
FINAL PROGRAM OUTCOME = KEEP-AI-GEN2
```

を正規の正常終了とする。
