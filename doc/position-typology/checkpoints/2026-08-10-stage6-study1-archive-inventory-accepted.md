# Checkpoint — Stage 6 Study 1 Archive Inventory Accepted

Date: 2026-08-10  
Status: **inventory accepted / schema-only audit next**

## Completed

The local `study1-archive-inventory.json` was inspected and accepted.

Fixed archive SHA-256 values match the closed Study 1 export index for E-018, E-019, and E-020. All archives report zero unsafe members.

The inventory remained read-only:

```text
archivesExtracted = false
formalAnalysisRerun = false
gamesExecuted = false
scientificResultValuesInspected = false
```

No Study 1 or Stage 5 decision was modified.

## Fixed core bridge corpus scope

```text
E-018 D2 P2 / LG
E-019 D3 P2 / LG
E-020 D3 P2 / LG
```

E-019 D1 and V2 remain outside the core bridge.

## Next permitted operation

Run only the archive schema audit:

```text
tools/experiments/inspect-position-typology-stage6-study1-archive-schemas.py
```

Expected output:

```text
artifacts/local/position-typology/stage6-cross-study-bridge-v1/study1-archive-schema-audit.json
```

The schema audit may expose only field names, JSON key/type structure and replay feasibility. It may not calculate any cross-study association values.

## Still prohibited

- new game generation,
- modification of formal archives,
- rerunning or replacing Study 1 formal evaluation,
- changing Stage 5 `not-confirmed`,
- treating exploratory N-ACT/N-CON or STYLE-C1..C4 as confirmed,
- calculating relation results before the bridge protocol is frozen,
- result-dependent definition of the candidate comparator or state bridge.
