# Branch Expansion / Compression Transition Study 1

Research Generation 3 `G3-05` / `BECT-STUDY1` の研究ディレクトリです。

## Current status

```text
Study = BECT-STUDY1
Program position = G3-05
Study status = CLOSED / TECHNICAL-INVALID
program review = G3-05-AUTHORIZED
prospective preregistration = FROZEN / IMMUTABLE
Stage 0 v1 = BECT-S0-TECHNICAL-2026-09-02-v1 / TECHNICAL-INVALID
Stage 0 v2 = BECT-S0-TECHNICAL-2026-09-02-v2 / STAGE0-PASS
Stage 1 = BECT-S1-DEVELOPMENT-2026-09-02-v1 / TECHNICAL-INVALID / executions 1 authorized / 1 actual
Stage 2 = BECT-S2-FORMAL-2026-09-02-v1 / NOT-AUTHORIZED-NOT-EXECUTED
Stage 1 seed = 31510001..31510240 / CONSUMED
Stage 2 seed = 31520001..31520384 / NOT CONSUMED
formal promoted candidate set = []
no-rescue boundary = CROSSED / ACTIVE
protected depth-10 holdout = SEALED / NOT GENERATED / NOT READ
main integration = NOT PERFORMED
```

## Formal title

**Branch Expansion and Compression Transition Study 1 — Prospective exact analysis of longitudinal bounded local game-tree geometry change, transition onset, persistence, reopening, and reversal along Bao trajectories**

日本語題目:

**Baoにおけるbranch expansion / compression転移のprospective exact解析 — 対局trajectory上のbounded局所ゲーム木幾何の変化、転移開始、持続、再開放、反転の再現可能な検証**

## Study boundary

本Studyはstatic Namua/Mtaji differenceを再検定しません。G3-04のC1/C6はimmutableなupstream contextに限定し、G3-03 technical-invalid diagnosticはscientific inputへ使用しません。

Primary experimental unitはtrajectoryです。隣接plyのdepth-5 local windowsは強く重複し得るため、adjacent roots/event windowsを独立sampleとはみなしません。

## Measurement foundation

LGTGMIVでformal eligibilityを得たF1-F5だけを使用します。

```text
representation = RAW-ONLY
relative horizon = 5
validated transforms = []
```

8つのexact level endpointからadjacent-ply delta、onset、persistence、reversal、reopening/extinction dynamicsをprospectively構成します。

## Documents

- `STUDY_1_OVERVIEW.md` — 研究目的とprospective boundary
- `STUDY_1_FINAL_REPORT.md` — formal closure / technical-invalid result / interpretation boundary
- `STUDY_1_PROTOCOL.md` — human-readable frozen protocol
- `prereg/STUDY_1_SPEC.json` — machine-readable prospective contract
- `CURRENT_STATUS.md` — current state
- `DECISION_REGISTER.md` — immutable decisions
- `REPRODUCIBILITY_INDEX.md` — source/hash/run provenance
- `authorizations/` — Stage authorization
- `checkpoints/` — prospective / Stage checkpoints
- `results/` — Stage outputs
- `executions/` — execution-integrity records

## Protected evidence

standard initial RAW-root complete exact depth-10 holdout remains **`SEALED / NOT GENERATED / NOT READ`**.
