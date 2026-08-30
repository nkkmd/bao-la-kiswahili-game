#!/usr/bin/env python3
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
AGENDA = ROOT / "doc/FUTURE_RESEARCH_AGENDA.md"
PROGRAM = ROOT / "doc/research-program-decisions/2026-08-26-second-generation-pure-research-agenda.md"
INDEX = ROOT / "doc/RESEARCH_INDEX.md"
SELECTION = ROOT / "doc/research-program-decisions/2026-08-30-pre-g2-11-strategic-representation-prerequisite-selection.md"


def read(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def write(path: Path, text: str) -> None:
    path.write_text(text, encoding="utf-8")


# Required selection state must already exist.
selection = read(SELECTION)
for token in [
    "SELECTED NEXT RESEARCH DIRECTION / NOT YET PREREGISTERED",
    "formal Study ID fixed = false",
    "scientific seeds authorized = false",
    "G2-11 authorized = false",
]:
    if token not in selection:
        raise SystemExit(f"selection decision missing token: {token}")

index = read(INDEX)
if "**現在選択済みの次研究方向:** Pre-G2-11 strategic representation prerequisite" not in index:
    raise SystemExit("RESEARCH_INDEX selected-next-study marker missing")

agenda = read(AGENDA)
if "#### Pre-G2-11 prerequisite — new prospective strategic representation Study" not in agenda:
    raise SystemExit("Agenda prerequisite section missing")
if "#### G2-11 — Long-Horizon Strategic Transition Structure Study 1" not in agenda:
    raise SystemExit("Agenda G2-11 section missing")
# Documentation-only cleanup of an existing duplicated completion marker.
agenda = agenda.replace(
    "P1: G2-07 (completed), G2-08 (completed), G2-09 (completed), G2-10 (completed) (completed)",
    "P1: G2-07 (completed), G2-08 (completed), G2-09 (completed), G2-10 (completed)",
)
write(AGENDA, agenda)

program = read(PROGRAM)
pre_heading = "## 2026-08-30 — Pre-G2-11 strategic representation prerequisite selection"
if program.count(pre_heading) != 1:
    raise SystemExit(f"pre-G2-11 program heading count = {program.count(pre_heading)}")

backfill_heading = "## 2026-08-30 — G2-07 through G2-10 program-progress backfill"
if backfill_heading not in program:
    backfill = '''## 2026-08-30 — G2-07 through G2-10 program-progress backfill

This section is a documentation synchronization backfill only. It records already-closed Studies in the Research Generation 2 program ledger and does not alter any Study-level formal decision, scientific artifact, seed state, threshold, endpoint, or interpretation boundary.

### G2-07 — Practical Comeback / Reply-Pressure Representation Study 1

Agenda label `G2-07` was instantiated as `PCRPR-STUDY1` under a separate prospective contract.

```text
Stage 0 = STAGE0-TECHNICAL-PASS
Stage 1 = STAGE1-TECHNICAL-INVALID
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
Stage 1 seed block = CONSUMED
same-block rerun = NOT AUTHORIZED
```

Fresh Stage 1 production and independent replay completed the scientific computation and matched the development core, but the mandatory independent full artifact upload timed out before the prospectively required final exact verification artifact could be materialized. The frozen fail-closed rule therefore closed Stage 1 as technical-invalid. Production-only values were not promoted and the consumed block was not repaired/rerun.

### G2-08 — Machine Decision-Failure Taxonomy Study 1

Agenda label `G2-08` was instantiated as `MDFT-STUDY1` under a fresh prospective machine-only taxonomy contract.

```text
Stage 0 = STAGE0-TECHNICAL-PASS
Stage 1 = STAGE1-DEVELOPMENT-BLOCKED-NON-ESTIMABLE
Study formal decision = NON-ESTIMABLE
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
```

Production / independent Stage 1 recomputation completed exactly, but two prospectively frozen global readiness gates failed: distinct opening-prefix diversity and maximum source-policy share. Development leaf signals were not promoted to a validated taxonomy and no threshold/reweighting/root-deletion/seed-extension rescue was used.

### G2-09 — Tactical Motif Generalization / Counterexample Study 1

Agenda label `G2-09` was instantiated as `TMGC-STUDY1` under a fresh prospective C03 generalization-boundary contract.

```text
Stage 0 = STAGE0-TECHNICAL-PASS
Stage 1 = STAGE1-DEVELOPMENT-BLOCKED-TECHNICAL-INVALID
Study formal decision = TECHNICAL-INVALID
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
Stage 1/2 scientific seed blocks = UNCONSUMED
```

The pre-scientific technical-only tooling smoke failed in the independent boundary aggregator. The frozen no-rescue rule did not authorize same-Study repair/rerun, so no C03 generalization/counterexample scientific result was generated. Research Generation 1 `TM-S2-C03 = CONFIRMED` remains unchanged within its original frozen scope.

### G2-10 — Unified Multiaxial Strategic State Representation Study 1

Agenda label `G2-10` was instantiated as `UMSSR-STUDY1` under a fresh prospective multiaxial representation contract.

```text
Stage 0 = STAGE0-TECHNICAL-PASS
Stage 1 = STAGE1-DEVELOPMENT-BLOCKED-NO-REPRESENTATION
selectedRepresentation = null
Study formal decision = NOT-AUTHORIZED-NOT-EXECUTED
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
Stage 1 seeds = CONSUMED
Stage 2 seeds = RESERVED / UNCONSUMED
G2-11 candidate input authorized = false
```

Stage 1 completed 4,096 games / 512 roots / 40 active features with production / independent full-exact agreement and all scientific-readiness/resource gates passing. However none of the prospectively fixed deterministic K-means `K=2..6` candidates passed all support/silhouette/five-fold assignment-stability promotion criteria. No frozen representation was created and Stage 2 was not authorized. This is a valid negative development closure, not a technical failure or proof that Bao has no useful strategic representation.

'''
    program = program.replace(pre_heading, backfill + pre_heading, 1)
    write(PROGRAM, program)

print("pre-G2-11 repository preparation finalization materialized")
