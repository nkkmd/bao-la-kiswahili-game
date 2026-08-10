# Stage 6 Cross-Study Bridge — Archive Inventory Runbook

Date: 2026-08-10  
Status: **secondary / preparatory / no scientific cross-study result yet**

## Purpose

Stage 5 ended with:

```text
formalDecision = not-confirmed
```

The next substantive research objective is the original `RESEARCH_PLAN.md` cross-study relation between this position-typology study and closed phase-transition Study 1.

Because implementation inserted independent confirmation stages, this document calls the next operational phase **Stage 6**. This does not retroactively alter the original Research Plan; it only avoids reusing the Stage 5 label already used for playing-style confirmation.

The first Stage 6 operation is **archive inventory only**.

It does not:

- generate games,
- rerun a formal experiment,
- rerun Study 1 evaluation,
- modify or extract over formal archive directories,
- change any Study 1 decision,
- change Stage 5 `not-confirmed`,
- inspect scientific result values for hypothesis selection.

## Why an archive inventory is needed

Study 1 formal observations store phase-transition features and state hashes but do not serialize the full pit array. However each archived formal game stores the complete move sequence.

Therefore exact board state at any candidate ply is deterministically reconstructable from:

```text
initialState -> archived moves -> target ply
```

This creates a valid bridge to the current position-typology representation without new game generation.

Before implementing that bridge, exact member paths for game JSON, candidate metrics, paired endpoints, integrity reports and related analysis outputs must be identified in the fixed final archives.

## Fixed Study 1 archives

### E-018

```text
/home/oruorane/bao-e018-exports/e018-final-formal-evaluation.tar.gz
SHA-256 = bc9b5ae8423628e499b97285d6a56a7abde558d29efe7fb47d9c5a550cee3bc5
formal decision = confirmed only at hard / bao / depth2, phase2 > legacy
```

### E-019

```text
/home/oruorane/bao-e019-exports/e019-final-formal-evaluation.tar.gz
SHA-256 = 6a43fa611997049462a14a4ef4ba4816f6469f7c9931b3920e50f7eef866da75
formal global decision = not-confirmed
D3 opposite-direction result remains an observed component result, not a rescued formal claim
```

### E-020

```text
/home/oruorane/bao-e020-exports/e020-final-formal-evaluation.tar.gz
SHA-256 = 37d54414778c075069ab9ba2a80b73e6f9eefccbc944db8abf867da7d2800bd2
formal decision = confirmed only at hard / bao / depth3, legacy > phase2
```

These hashes come from `doc/phase-transition/FORMAL_EXPORT_INDEX.md` and are immutable inputs to this inventory.

## Tool

```text
tools/experiments/inventory-position-typology-stage6-study1-archives.py
```

The tool uses Python standard-library `tarfile` in read-only mode.

It:

1. verifies each archive SHA-256,
2. lists archive members without extraction,
3. rejects unsafe absolute / `..` paths,
4. classifies likely member paths for:
   - formal game JSON,
   - `candidate-control-metrics.csv`,
   - other candidate CSV,
   - paired endpoint JSON,
   - integrity JSON,
   - evaluation JSON,
   - trajectory diagnostics,
   - structural diagnostics,
   - manifests / configs,
5. emits only member-path inventory and counts.

It does not read candidate outcomes or scientific metric values.

## Local execution

```bash
source ~/.venvs/bao-phase-transition-e011/bin/activate

git switch research/position-typology-and-playing-style
git pull --ff-only

git status --short
python --version

python -m py_compile \
  tools/experiments/inventory-position-typology-stage6-study1-archives.py

python tools/experiments/inventory-position-typology-stage6-study1-archives.py
```

If the archives have been moved, use explicit read-only source paths:

```bash
python tools/experiments/inventory-position-typology-stage6-study1-archives.py \
  --e018 /path/to/e018-final-formal-evaluation.tar.gz \
  --e019 /path/to/e019-final-formal-evaluation.tar.gz \
  --e020 /path/to/e020-final-formal-evaluation.tar.gz
```

Expected output:

```text
artifacts/local/position-typology/stage6-cross-study-bridge-v1/study1-archive-inventory.json
```

Share only that JSON.

## Interpretation boundary after inventory

The inventory may be used only to answer:

- which fixed archive members contain game trajectories,
- which contain candidate/control rows,
- which contain paired endpoints / integrity provenance,
- whether deterministic board replay is technically feasible.

Do not yet test whether `capture-branch-expansion` is associated with MTAJI-M1/M2, N-ACT/N-CON, or STYLE-C1..C4.

The scientific bridge protocol must be written **after** member-path/schema feasibility is known and **before** cross-study relation values are inspected.

## Planned bridge hierarchy

Subject to archive feasibility, later Stage 6 should prioritize:

1. **confirmed position-level vocabulary first**
   - MTAJI-M1 / MTAJI-M2,
2. bounded secondary position descriptors
   - Mtaji relational polarity,
3. exploratory state coordinates only with explicit label
   - N-ACT / N-CON,
4. STYLE-C1..C4 only as optional exploratory trajectory descriptors
   - never as confirmed styles.

A particularly important feasibility question is phase overlap. Study 1 expansion candidates were often observed in `namua`, while MTAJI-M1/M2 apply only to `mtaji`. The bridge must report this overlap before any association claim.

No method may force a Mtaji type assignment onto Namua positions.
