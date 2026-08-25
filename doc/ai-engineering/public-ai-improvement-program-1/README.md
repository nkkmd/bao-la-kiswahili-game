# Public Bao AI Improvement Program 1 (`PBAI-P1`)

**正式作業名:** Generation-1 Evidence-Informed Public Bao AI Improvement Program 1  
**開始日:** 2026-08-26  
**Program scientific evidence anchor:** `2db7c4d65771066e914f32cbc4116fcc3e9e386a`  
**Status:** ESTABLISHED / **PBAI-A, PBAI-B, PBAI-C COMPLETE** / PBAI-D exact candidate contract next / no public AI implementation change

## 1. Purpose and track separation

PBAI-P1は、完了済み**Research Generation 1**の成果をengineering inputとして、public Bao AIを改善できるcandidateを独立に設計・比較・検証し、public adoptionの可否をengineering decisionとして判断するprogramである。

Engineering outcomeによってResearch Generation 1のformal decision、threshold、classifier、endpoint、population、interpretation boundaryを変更しない。Research Generation 2 outcomeはPBAI-P1へ逐次流入させない。

## 2. Canonical AI naming

```text
current public lineage = AI-GEN2
frozen exact comparator = AI-GEN2-BASELINE-2026-08-26-v1
next adopted public lineage reserved = AI-GEN3
candidate IDs = PBAI-Cxxx
pre-adoption release candidate = PBAI-P1-RCxx
```

`AI-GEN2`はlineage label、frozen baseline IDはexact engineering configurationである。

`legacy` / `bao` / `bao-v2`等はprofile identifierでありAI世代名ではない。`bao-v2`は`AI-GEN2`ではない。

`AI-GEN3`はvalidation passやrelease candidate作成だけでは付与しない。Explicit `ADOPT` + public-default deployment後のみpromotionする。

## 3. Completed prerequisite phases

### PBAI-A — Research Generation 1 evidence audit

- 14-Study scientific evidence coreを固定。
- E1/E2/E3/E4 engineering useを科学labelとは別に整理。
- prohibited inferenceとResearch Generation 2 exclusionを固定。
- `PBAI-C001..PBAI-C005`は`EVIDENCE-AUDIT-READY`。
- candidate authorizationは0。

Canonical audit: [`GENERATION_1_EVIDENCE_AUDIT.md`](GENERATION_1_EVIDENCE_AUDIT.md)

### PBAI-B — exact AI-GEN2 baseline

```text
baselineId = AI-GEN2-BASELINE-2026-08-26-v1
baseline public-source commit = f4ae3b11901180cbe417b3e643e2b357d8045d2d
public endpoint = https://bao-la-kiswahili.cultivationdata.net/
```

Exact file hashes、rules binding、`bao` evaluation、hard/expert search/config、quiescence/TT/cache、randomness、Worker/fallback、PWA semanticsを固定した。

Canonical sources:

- [`BASELINE_SPEC.md`](BASELINE_SPEC.md)
- [`baselines/AI-GEN2-BASELINE-2026-08-26-v1.json`](baselines/AI-GEN2-BASELINE-2026-08-26-v1.json)

### PBAI-C — global benchmark / non-regression / release gates

Candidate implementation/outcomeが0の状態でglobal numeric floorsをfreezeした。

Canonical sources:

- [`BENCHMARK_PROTOCOL.md`](BENCHMARK_PROTOCOL.md)
- [`benchmark/PBAI-C-GLOBAL-GATES-2026-08-26-v1.json`](benchmark/PBAI-C-GLOBAL-GATES-2026-08-26-v1.json)

主要global gates:

```text
playing strength:
  validation/holdout pooled observed score >= 0.50
  one-sided 95% pair-bootstrap LCB >= 0.47
  locked validation+holdout LCB >= 0.48

decision quality:
  new catastrophic losses = 0
  severe-loss excess <= +0.01 per validation/holdout
  top-set agreement delta >= -0.02
  normalized rank-loss delta <= +0.02

operational:
  crash / illegal move / invalid state = 0
  median elapsed ratio <= 1.05
  p95 elapsed ratio <= 1.10
  >=2-depth deficit roots <= 5%

correctness:
  frozen public/engine.js unchanged
  tactical failures = 0
  candidate-specific regression failures = 0
```

Development / validation / release-holdout seed blocks are frozen separately. Holdout ranges are reserved but **not authorized for execution** until validation PASS and explicit PBAI-F authorization。

## 4. Program flow

```text
PBAI-A  Research Generation 1 evidence audit                 COMPLETE
PBAI-B  AI-GEN2 exact public baseline freeze                 COMPLETE
PBAI-C  global numeric benchmark/release-gate freeze         COMPLETE
PBAI-D  one exact candidate contract + development auth      NEXT
PBAI-E  development / ablation
PBAI-F  fresh validation + conditional holdout authorization
PBAI-G  final regression / operational gate
PBAI-H  staged public deployment / keep-or-rollback
```

## 5. Candidate isolation

Every candidate must be feature-gated before implementation:

```text
feature off = frozen baseline comparator
feature on = exactly one PBAI candidate
public default before adoption = off
```

Combined mechanisms require a new candidate ID and prior single-component ablations。

Global PBAI-C gates cannot be weakened by a candidate-specific contract。

## 6. PBAI-D authorization requirement

Before one candidate becomes `AUTHORIZED-FOR-DEVELOPMENT`, its registry entry must prospectively freeze:

- exact mechanism and feature flag;
- exact affected subsystem;
- intended-benefit endpoint;
- minimum practical benefit;
- target/control strata;
- candidate-local development/validation/holdout blocks or fixtures;
- runtime/memory budget where applicable;
- failure handling and rollback;
- prohibited scientific inference;
- confirmation that the PBAI-C global thresholds remain unchanged。

Normal improvement candidates must pass a prospectively declared benefit gate in addition to non-regression. A correctness/semantics-only maintenance candidate may use a correctness/equivalence benefit, but only if that class is declared before implementation。

## 7. Non-negotiable scientific/engineering boundaries

- Research decisionをengineering resultで変更しない。
- Calibration Study 1 mappingをvalidated Bao win probabilityとして使わない。
- BMP C01-C04をconfirmed blunder ruleとしてhard-codeしない。
- unvalidated symmetry/canonicalizationをproduction identityへ導入しない。
- machine reply/search quantitiesをhuman difficulty/errorとして表示しない。
- PCEM-T1..T8をvalidated winning-try detectorとしてproduction化しない。
- Research Generation 1 RAW identityを必要とするtablebase keyへcurrent `AI.stateKey`を流用しない。
- Research Generation 2 outcomeをPBAI-P1へ追加しない。
- strength improvementでrule/tactical/crash failureを相殺しない。
- release holdoutをcandidate tuningへ使用しない。

## 8. Current authorization boundary

```text
PBAI-A = COMPLETE
PBAI-B = COMPLETE
PBAI-C = COMPLETE
PBAI-C001..PBAI-C005 = EVIDENCE-AUDIT-READY
AUTHORIZED-FOR-DEVELOPMENT = 0
candidate implementations = 0
release holdout execution = NOT-AUTHORIZED
public deployments caused by PBAI-P1 = 0
AI-GEN3 = RESERVED / NOT-AUTHORIZED
```

次に許可されるのは、**1件だけのexact PBAI-D candidate contract作成と、そのcontractが全要件を満たした場合のdevelopment authorization**である。

適切なcandidateがglobal + candidate-specific gatesを満たさなければ、`KEEP-AI-GEN2`が正常なProgram resultである。
