# Position Complexity / Difficulty Study — Research Log

Status: **append-only research chronology**

Do not rewrite prior entries to make later outcomes appear more expected. Corrections should be appended with explicit reference to the corrected entry.

---

## 2026-08-12 — Study initiation and canonical-state recovery

### Repository baseline

Current GitHub `main` was checked before study initiation.

```text
main HEAD = d681b4593242973fcb33805edca12eb3e8633653
expected prior closure HEAD = d681b4593242973fcb33805edca12eb3e8633653
match = true
```

No newer commit required a delta audit.

New branch created:

```text
research/position-complexity-difficulty
```

### Closed studies restored from GitHub

Read and treated as immutable historical records:

- phase-transition Study 1;
- position-typology / playing-style Study 1;
- Namua→Mtaji Strategic Temporal Transition Study 1.

Important inherited outcomes retained unchanged:

```text
phase-transition:
  E-010 not-confirmed
  E-011 inconclusive
  E-017 not-confirmed
  E-018/H16 confirmed only fixed D2 phase2 > legacy
  E-019/H17 global not-confirmed
  E-020/H18 confirmed only fixed D3 legacy > phase2

position typology:
  MTAJI-M1/M2 bounded confirmed morphology
  no discrete Namua type
  N-ACT/N-CON exploratory only
  no discrete style typology
  STYLE-C1..C4 exact geometry formal not-confirmed

Namua->Mtaji:
  formal decision NOT-CONFIRMED
  first Mtaji clock deterministic at ply 44 in the frozen engine
```

No rescue interpretation was adopted.

### Documentation anomaly

The requested:

```text
doc/phase-transition/REPRODUCIBILITY_INDEX.md
```

was not present on `main`.

The audit used the existing phase-transition Final Report, Current Status and `FORMAL_EXPORT_INDEX.md` instead. No replacement document was inferred to exist.

### Read-only technical audit

Inspected current engine/search/feature tooling.

Main findings:

1. Structural state variables are already broadly available through the position-typology feature extractor.
2. Search workload counters already include nodes, quiescence nodes, cutoffs, evaluations, cache statistics, completed depth and root score.
3. Current iterative deepening exposes only aggregate root-best-change counts, not the full depth-by-depth sequence.
4. Alpha-beta search does not expose an exhaustive exact root candidate score table, so searched best-second gap and related ambiguity metrics are not yet valid.
5. Generic PV instability is not currently instrumented; joseki-specific line reconstruction is not adopted as a general metric.
6. `public/ai-config.js::complexityScore()` is an adaptive budget heuristic, not a validated scientific complexity score, and creates circularity if adaptive search is used in this study.
7. Wall-clock time is hardware-dependent; deterministic search counters are preferred for initial inference.

### Initial design direction

Study 1 will separate:

```text
structural complexity
search workload
decision ambiguity
prediction instability
```

No global composite difficulty score is authorized.

Primary candidate relation:

```text
legalMoveCount
  -> tie-aware D2-to-D3 root-optimum instability
```

Key secondary candidate:

```text
exact D2 best-vs-second searched score gap
  as incremental ambiguity information beyond structural branching
```

These are not yet Stage 2 frozen metrics.

### Stage state

```text
Stage 0 read-only audit = complete
Stage 0 instrumentation implementation = pending
Stage 1 exploratory corpus = not generated
Stage 2 formal preregistration = not created
Stage 2 formal corpus = not authorized / not generated
```

Next authorized work is Stage 0 diagnostic instrumentation and technical-only validation.