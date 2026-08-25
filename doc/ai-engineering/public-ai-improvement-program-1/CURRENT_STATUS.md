# PBAI-P1 Current Status

Date: 2026-08-26  
Program: `PBAI-P1` — Generation-1 Evidence-Informed Public Bao AI Improvement Program 1

## Status

```text
PROGRAM = ESTABLISHED
PBAI-A Research Generation 1 evidence audit = COMPLETE
PBAI-B AI-GEN2 exact public baseline = COMPLETE
AI-GEN2 exact baseline ID = AI-GEN2-BASELINE-2026-08-26-v1
PBAI-C benchmark framework = FRAMEWORK-FROZEN
PBAI-C numeric non-regression / release gates = NOT-FROZEN / NEXT
current public AI lineage = AI-GEN2
next adopted public AI lineage reserved = AI-GEN3
AI-GEN3 promotion = NOT-AUTHORIZED
candidate evidence-audit-ready = 5
AUTHORIZED-FOR-DEVELOPMENT = 0
candidate implementations = 0
candidate release decisions = 0
public deployments caused by PBAI-P1 = 0
public AI code changed by PBAI-P1 = false
Research Generation 2 evidence included = false
```

## AI generation naming

Canonical naming rule: `doc/ai-engineering/AI_GENERATION_NAMING.md`.

- `AI-GEN1`: historical legacy AI lineage.
- `AI-GEN2`: current public Bao AI lineage; lineage label, not an exact configuration ID.
- `AI-GEN3`: reserved for the next formally adopted public lineage after frozen validation/non-regression/release gates and explicit public adoption.
- `legacy` / `bao` / `bao-v2`: evaluation/search profile identifiers, not generation labels.
- `bao-v2` is not `AI-GEN2`.
- PBAI candidates remain `PBAI-Cxxx` until formal public adoption.
- research programs use `Research Generation 1` / `Research Generation 2`; AI generation numbers do not map to research generation numbers.

## Source-of-truth progression

PBAI-A work started from remote `main`:

```text
f50362a435a3c5cdd1d9b6dd8969b15dcf5e4dc8
```

which matched the supplied reference SHA. PBAI-A was integrated through PR #51. The resulting `main` commit and PBAI-B public-source anchor is:

```text
f4ae3b11901180cbe417b3e643e2b357d8045d2d
```

The fixed PBAI-P1 scientific evidence cutoff remains the earlier Research Generation 1 anchor:

```text
2db7c4d65771066e914f32cbc4116fcc3e9e386a
```

PBAI-B does not move that scientific cutoff.

## PBAI-A completion

`GENERATION_1_EVIDENCE_AUDIT.md` freezes:

- the 14-Study Research Generation 1 scientific evidence core;
- First Joseki / first-player work as earlier context/benchmark/infrastructure rather than silently reclassifying it as Research Generation 1 scientific evidence;
- E1/E2/E3/E4 engineering use for each Study;
- prohibited inference and regression risk;
- candidate traceability for `PBAI-C001..PBAI-C005`;
- Research Generation 2 exclusion;
- authoritative RAW identity requirements;
- the boundary that current `AI.stateKey` omits `pending` and is not the Research Generation 1 RAW identity contract.

Candidate state remains:

```text
PBAI-C001 = EVIDENCE-AUDIT-READY
PBAI-C002 = EVIDENCE-AUDIT-READY
PBAI-C003 = EVIDENCE-AUDIT-READY
PBAI-C004 = EVIDENCE-AUDIT-READY
PBAI-C005 = EVIDENCE-AUDIT-READY
AUTHORIZED-FOR-DEVELOPMENT = 0
```

## PBAI-B completion

Canonical exact baseline:

```text
baselineId = AI-GEN2-BASELINE-2026-08-26-v1
generationLineage = AI-GEN2
repository source = f4ae3b11901180cbe417b3e643e2b357d8045d2d
public directory = public/
public endpoint = https://bao-la-kiswahili.cultivationdata.net/
baselineFrozen = true
```

Canonical specification and manifest:

- `BASELINE_SPEC.md`
- `baselines/AI-GEN2-BASELINE-2026-08-26-v1.json`

Public deployment binding is the live endpoint plus the documented Cloudflare Pages static target and `main/public` source ref. A provider-internal Cloudflare deployment ID was not available through the repository/tooling used for PBAI-B and was not invented. Exact live JavaScript asset byte comparison was not performed; this limitation is recorded in the baseline rather than hidden.

### Frozen core file SHA-256

```text
public/engine.js
  e6acf1fe4d97db67dbcfadc3a785e802342ae0b0cbaec35f53eb8e77424cfc1c
public/ai.js
  2823dbcf96c7a47489301ecd768a63975aa8b4e12b62cc4629fc8283ef5dff9e
public/ai-weights.js
  7cf615fa43c7206e90a907a958108eb5e7595f69459c97aa667a3e2fe8bc18c8
public/ai-config.js
  10d9ea331ad8fc485dca9f77e2bb327e36850142d28c948e66377dd347877f75
public/ai-worker.js
  cca0996ce1d14f39d5db24de390550a0c3c583a6b08da2609d9f66532d1e5be4
```

`public/main.js`, `public/index.html`, and `public/service-worker.js` are also hash-bound in the manifest because they control the deployed path, UI mapping, Worker wiring and PWA caching.

### Frozen public AI semantics

```text
default UI level = normal / ふつう
default evaluation = bao
hard/expert search = enhanced alpha-beta iterative deepening
historical benchmark identifier = phase2
adaptive public default = false
quiescenceDepth = 1
TT max entries = 50,000
evaluation cache hard/expert = enabled / max 2,048
PWA cache = bao-la-kiswahili-v24
```

Hard device tiers:

```text
low      D6  / 400ms
standard D8  / 500ms
high     D10 / 600ms
```

Expert / ムタアラム tiers:

```text
low      D10 / 1500ms
standard D12 / 2000ms
high     D14 / 3000ms
```

### Identity boundary retained

Current `AI.stateKey` does not include `pending`. Therefore it remains non-interchangeable with Research Generation 1 authoritative RAW identity and is not authorized as a research-derived tablebase key. PBAI-B records this as an exact baseline property; it does not retroactively declare current public search scientifically invalid.

### Verification

Canonical baseline workflow:

```text
runId = 32910436754
jobId = 98003385552
result = PASS
```

Deterministic standard-root hard/bao D3 smoke:

```text
move = takata:namua:0:5:right:::false
rootScore = 13
nodes = 158
quiescenceNodes = 88
completedDepth = 3
timedOut = false
worker/direct move equality = PASS
```

Time-limited operational behavior was measured separately and is descriptive only. On the canonical GitHub-hosted runner, standard hard reached completed depth 6 at the 500ms budget and standard expert reached depth 7 at the 2000ms budget; both returned legal safe moves after timeout. These values are **not** acceptance thresholds and are not cross-device guarantees.

Workflow artifact:

```text
artifactId = 9586339640
artifact ZIP SHA-256 = 34bfc5e9ad33dc2b62be5f3965ad845c84639ff326424fe8e8db00e52bcd3507
```

Relevant engine/AI/evaluation/search/config/worker/tactical/program-contract tests all passed.

## Documentation reconciliation after PBAI-B

`doc/AI_DEVELOPMENT_LOG.md` still contains the historical hard-browser description `D4 / 450ms`. That statement is retained as historical engineering record and is **not** current baseline truth. Current public settings are the device-tier values frozen above and in `BASELINE_SPEC.md`.

Likewise, historical MCTS, adaptive search, `bao-v2`, and tuning variants remain historical/experimental mechanisms and are not silently treated as current `AI-GEN2` default behavior.

## Benchmark / regression state

Reusable infrastructure includes deterministic fixed-depth benchmarks, paired openings with South/North seat swap, Namua/Mtaji opening generation, time-limited operational benchmarks, tactical regressions, search/TT/quiescence/evaluation-cache tests, Worker/config tests, and Research Generation 1 replay/verification infrastructure.

`BENCHMARK_PROTOCOL.md` has a frozen framework, but **candidate-independent numeric non-regression/release thresholds and candidate-specific numeric acceptance rules are still not frozen**. Therefore PBAI-C is not complete and no candidate may yet be implemented.

## Next required work

1. **PBAI-C — Engineering Benchmark / Numeric Non-Regression / Release-Gate Freeze**: freeze numeric hard gates, statistical/non-inferiority rules, development/validation/release-holdout separation, seed blocks, strength/decision-quality/robustness/operational endpoints, and candidate-specific acceptance rules before seeing candidate outcomes.
2. Only after PBAI-C may one `PBAI-Cxxx` candidate be moved to `AUTHORIZED-FOR-DEVELOPMENT`.
3. Candidate mechanisms should be evaluated individually before combined candidates.
4. `AI-GEN3` remains reserved until validation + holdout + regression + operational gates pass, an explicit `ADOPT` decision exists, and the approved build is deployed as public default.

## Explicitly not done

- no evaluation-weight change;
- no phase/morphology bonus;
- no tactical C03 production hard-code;
- no adaptive/selective deepening implementation;
- no exact-oracle connection to public AI;
- no score→win-probability conversion;
- no symmetry/canonicalization introduction;
- no PBAI-P1-caused public deployment;
- no `AI-GEN3` promotion.
