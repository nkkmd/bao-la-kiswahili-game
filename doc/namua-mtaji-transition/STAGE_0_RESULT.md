# Stage 0 Result — Namua→Mtaji Temporal Transition

Date: 2026-08-11  
Status: **PASS / Stage 0 technical feasibility closed**  
Study: `namua-mtaji-temporal-transition`  
Source commit executed locally: `023a8bd16ec16838e1a5f072bdc941f702f850b6`

## 1. Scope

Stage 0 was a technical feasibility audit only.

It did not authorize:

- scientific association inference;
- candidate discovery;
- formal endpoint selection;
- formal comparator selection;
- formal seed selection;
- formal statistical model selection.

The local smoke corpus is consumed as technical QA and must never be reused as a formal confirmation corpus.

## 2. Received local artifacts

The following local-only artifacts were inspected on 2026-08-11:

```text
artifacts/local/namua-mtaji-transition/stage0-smoke-v1/manifest.json
artifacts/local/namua-mtaji-transition/stage0-smoke-v1/verification.json
artifacts/local/namua-mtaji-transition/stage0-smoke-v1/mtaji-artifact-audit.json
```

Artifact identity:

```text
configHash
= 49cbccf1b060afccc9148b70308484eb6c30abb8e800c8b50ec931f1e7a27492

instrumentationHash
= 12906122b3706f8e941d1a46d831335a72ac7907b349fc1e6435a30800d4c24d

summaryHash
= c64ab305cd4691a44738d3068187c453ad2b609aaabf28083aa8652d1b18f916
```

The source tree was clean at generation time.

## 3. Technical smoke summary

```text
games                         = 8
observations                  = 452
unique historical trajectories = 8
largest trajectory group      = 1
reached Mtaji games            = 8
first-Mtaji morphology eligible = 8
terminal before Mtaji          = 0
administrative truncation      = 0
phase-transition event games   = 8
```

Conditions were technical coverage only:

```text
P2-D1 = 2
P2-D2 = 2
LG-D2 = 2
V2-D2 = 2
```

These counts are not scientific estimates.

## 4. Replay and compatibility result

`verification.json` returned:

```text
passed = true
sourceHashesMatch = true
```

The verifier checked:

- schema readability and observation validation;
- deterministic full replay;
- stored-observation recomputation;
- compatibility with the inherited phase-transition representation;
- move legality;
- before/after state identity;
- phase monotonicity;
- phase-event linkage;
- first-Mtaji reserve exhaustion;
- temporal-outcome recomputation;
- trajectory hash;
- summary recomputation;
- source provenance.

Counts:

```text
observations checked          = 452
legal moves checked           = 1878
legacy compatibility checks   = 452
phase transition events       = 8
```

All named checks passed.

## 5. Frozen Mtaji classifier result

The historical frozen classifier artifact was found at the expected local historical-artifact location.

Expected, stored, and independently recomputed hashes were identical:

```text
7a276a8c795efddaf9b9555e0fbb7fdc1e56563d30ebcb352b42b3f53ba0e75d
```

Validation result:

```text
passed = true
representationDimensions = 40
classifierRefitPerformed = false
restandardizationPerformed = false
relabelingPerformed = false
```

All 8 smoke games had a first Mtaji observation eligible for technical frozen-classifier application.

The smoke labels happened to be:

```text
MTAJI-M1 = 5
MTAJI-M2 = 3
```

This distribution is **not scientific evidence** and must not be used as a prior effect estimate, target ratio, or hypothesis direction. Its only Stage 0 meaning is that both frozen labels are technically reachable and the end-to-end classifier path works.

## 6. Stage 0 completion gate

The Stage 0 gate is closed as PASS because the available evidence establishes:

1. new schema compatibility;
2. inherited representation/classifier compatibility;
3. engine Namua→Mtaji semantics under deterministic replay;
4. full replay verification;
5. exact first-Mtaji recomputation;
6. source provenance/hash integrity;
7. frozen MTAJI artifact availability and exact hash identity;
8. explicit technical/non-scientific smoke boundary;
9. no formal seed block inspection.

Stage 1 generation remains conditional on documenting its exploratory protocol first.

## 7. Methodological findings carried forward

Stage 0 does not resolve the following design questions:

- exact formal comparator;
- candidate-ply versus post-ascertainment time origin;
- primary statistical unit;
- repeated-event policy;
- reserve adjustment/matching policy;
- survival versus competing-risk model;
- formal condition set;
- formal sample size and seed block.

The main pre-pilot risks remain:

1. 8-ply phenotype look-ahead / ascertainment structure;
2. mechanical dependence of first Mtaji on reserve exhaustion;
3. repeated candidate episodes within trajectories;
4. terminal-before-Mtaji versus administrative truncation;
5. fair comparator support.

## 8. Decision

> **Stage 0 technical feasibility is confirmed. Stage 1 fresh exploratory temporal pilot may proceed only under a documented, consumed exploratory protocol. No formal scientific decision has changed.**
