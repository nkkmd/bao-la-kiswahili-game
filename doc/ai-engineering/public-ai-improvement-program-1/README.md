# Public Bao AI Improvement Program 1 (`PBAI-P1`)

**正式作業名:** Generation-1 Evidence-Informed Public Bao AI Improvement Program 1  
**開始日:** 2026-08-26  
**Program scientific evidence anchor:** `2db7c4d65771066e914f32cbc4116fcc3e9e386a`  
**Status:** PBAI-A/B/C COMPLETE / C002 HOLD / **PBAI-C004-v1 CONTRACT FROZEN; DEVELOPMENT AUTHORIZED AFTER MERGE** / public AI unchanged

## 1. Purpose and separation

PBAI-P1はcompleted **Research Generation 1**をengineering inputとしてpublic Bao AIのcandidateを設計・比較・検証するengineering programである。Engineering outcomeによって既存Studyのformal decision、threshold、classifier、endpoint、population、interpretation boundaryを変更しない。Research Generation 2 outcomeはPBAI-P1へ逐次流入させない。

## 2. Canonical identities

```text
current public lineage = AI-GEN2
frozen exact comparator = AI-GEN2-BASELINE-2026-08-26-v1
global gate spec = PBAI-C-GLOBAL-GATES-2026-08-26-v1
closed first candidate = PBAI-C002-v1 / NON-ESTIMABLE / HOLD
current exact development contract = PBAI-C004-v1
next adopted public lineage reserved = AI-GEN3
```

`AI-GEN3`はcandidate authorization、development、validation、release-candidate作成だけでは付与しない。Explicit `ADOPT` + actual public-default deployment後のみpromotionする。

## 3. Completed prerequisites

### PBAI-A — Research Generation 1 evidence audit

14-Study evidence core、engineering-use tier、prohibited inference、Research Generation 2 exclusion、RAW identity boundaryをfreezeした。

Canonical: [`GENERATION_1_EVIDENCE_AUDIT.md`](GENERATION_1_EVIDENCE_AUDIT.md)

### PBAI-B — exact AI-GEN2 baseline

```text
baseline = AI-GEN2-BASELINE-2026-08-26-v1
baseline public-source commit = f4ae3b11901180cbe417b3e643e2b357d8045d2d
```

Exact public source hashes、rules binding、evaluation/search/config、Worker/fallback、PWA/cache semanticsをfreezeした。

### PBAI-C — global engineering gates

Candidate implementation/outcomeが0の状態でstrength / decision-quality / operational / correctness / holdout gatesをfreezeした。

Canonical:

- [`BENCHMARK_PROTOCOL.md`](BENCHMARK_PROTOCOL.md)
- [`benchmark/PBAI-C-GLOBAL-GATES-2026-08-26-v1.json`](benchmark/PBAI-C-GLOBAL-GATES-2026-08-26-v1.json)

Release-holdout ranges are frozen but execution remains **NOT-AUTHORIZED**.

## 4. Closed candidate — PBAI-C002-v1

`TM-S2-C03 = CONFIRMED`をengineering inputとしたmove-ordering-only candidate。Isolated implementation safety checksはPASSしたが、prospectively frozen development populationでeligible targetが5件しかなく、minimum 48に達しなかった。

```text
PBAI-C002-v1 = NON-ESTIMABLE / HOLD
candidate benefit metrics = NOT EXECUTED
validation = NOT EXECUTED
release holdout = NOT EXECUTED
PR #55 = CLOSED WITHOUT MERGE
public/main implementation = unchanged
```

Scientific `TM-S2-C03 = CONFIRMED`は変更しない。同versionのpopulation/trigger/threshold rescueは禁止する。

Canonical result: [`candidates/PBAI-C002-v1-development-result.json`](candidates/PBAI-C002-v1-development-result.json)

## 5. Current candidate — PBAI-C004-v1

Primary engineering inputはPosition Complexity / Difficulty Study 1の**reproducible exact D2/D3 search measurement**である。Studyのformal decision自体は`INCONCLUSIVE`のまま維持する。

Research endpoint:

```text
D23Instability = exact TopSet_D2 ∩ TopSet_D3 = empty
```

これはproduction classifierとしてコピーしない。C004は新しいengineering hypothesisである。

### Predevelopment support firewall

Candidate implementation前にsupport ruleをfreezeし、PBAI-C development blockだけをbaseline-onlyで測定した。

```text
run = 32917223072
job = 98023357050
artifact = 9588624025
population digest = fd450aeef6fa62bc42543cf1734d356e60259dd3ade1ab20bc10d2ed471ba734
population = 128 Namua + 128 Mtaji = 256
exact TopSet-disjoint = 54
minimum estimable = 48
SUPPORT = PASS
candidate code used = false
candidate benefit metrics observed = false
validation/holdout seeds accessed = false
```

Canonical:

- [`candidates/PBAI-C004-v1-predevelopment-support-spec.json`](candidates/PBAI-C004-v1-predevelopment-support-spec.json)
- [`candidates/PBAI-C004-v1-predevelopment-support-result.json`](candidates/PBAI-C004-v1-predevelopment-support-result.json)

### Exact v1 mechanism

Canonical contract: [`candidates/PBAI-C004-v1.json`](candidates/PBAI-C004-v1.json)

```text
feature = pbaiC004D23RootTtFirst
public default = off
allowed public source surface = public/ai.js only
mechanism = enhanced-alpha-beta root move ordering only
```

Within one `analyzeMove` call, D2 and D3 must both complete without timeout. If their deterministic selected root move keys differ, depths >=4 give the current root TT preferred move TT-first priority. Internal-node ordering is unchanged.

Not authorized:

```text
runtime exact TopSet computation
scientific human-difficulty/general-complexity classifier
extra time/depth budget
evaluation or quiescence change
persistent cache/table
forced move
engine/config/worker/UI change
```

### Target / boundary / negative control separation

The support probe exposed a necessary runtime boundary:

```text
primary: exact TopSet-disjoint = 54
boundary: TopSets overlap but deterministic canonical best changes = 5
negative control: deterministic canonical best unchanged = 197
```

Primary roots alone determine the intended-benefit result. Boundary roots receive semantic-safety + cost auditing only. Negative controls must not trigger and must reproduce feature-off exactly.

### Candidate-specific benefit gate

Primary fixed-depth D4 feature-on/off:

```text
development/validation median nodes(on/off) <= 0.95
fraction roots candidate nodes <= baseline >= 0.55
release holdout median <= 0.97 and fraction >= 0.52
root-score mismatches = 0
selected move outside frozen D4 top set = 0
catastrophic new losses = 0
```

Boundary roots additionally require aggregate candidate/baseline node ratio <=1.10, with no benefit claim. Global PBAI-C gates remain mandatory.

## 6. Program flow

```text
PBAI-A  Research Generation 1 evidence audit                    COMPLETE
PBAI-B  AI-GEN2 exact public baseline freeze                    COMPLETE
PBAI-C  global numeric benchmark/release-gate freeze            COMPLETE
C002    isolated candidate                                      NON-ESTIMABLE / HOLD
C004-D  predevelopment support + exact contract                 SUPPORT PASS / FROZEN
C004-E  isolated development / ablation                         NEXT AFTER CONTRACT MERGE
PBAI-F  fresh validation + conditional holdout authorization
PBAI-G  final regression / operational gate
PBAI-H  staged public deployment / keep-or-rollback
```

## 7. Current authorization boundary

```text
PBAI-C001 authorized = false
PBAI-C002 authorized = false / HOLD
PBAI-C003 authorized = false
PBAI-C004 authorized = true after exact-contract merge
PBAI-C005 authorized = false
AUTHORIZED-FOR-DEVELOPMENT = 1 after merge
active candidate implementation = 0
release holdout execution = NOT-AUTHORIZED
public deployments caused by PBAI-P1 = 0
AI-GEN3 = RESERVED / NOT-AUTHORIZED
```

The contract-freeze change itself contains no candidate `public/` implementation edits. After merge, the next permitted operation is a fresh isolated `PBAI-C004-v1` development branch from the resulting `main`.

Failure, non-estimability or lack of practical benefit are valid outcomes; `KEEP-AI-GEN2` remains acceptable.
