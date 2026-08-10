# Stage 6 Study 1 Formal Archive Inventory Result

更新日: 2026-08-10  
Status: **accepted / schema audit next**

## Artifact

Local artifact:

```text
artifacts/local/position-typology/stage6-cross-study-bridge-v1/study1-archive-inventory.json
```

## Boundary validation

Inventory artifact reports:

```text
formalExperiment = false
secondaryCrossStudyPreparation = true
archivesExtracted = false
formalAnalysisRerun = false
gamesExecuted = false
scientificResultValuesInspected = false
study1FormalDecisionsModified = false
stage5DecisionModified = false
```

The inventory is therefore accepted as a member-path feasibility audit only.

## Archive identity

All three fixed formal archives matched the Study 1 export index.

```text
E-018
SHA-256 = bc9b5ae8423628e499b97285d6a56a7abde558d29efe7fb47d9c5a550cee3bc5
members = 4046
unsafe members = 0
formal game JSON = 4000

E-019
SHA-256 = 6a43fa611997049462a14a4ef4ba4816f6469f7c9931b3920e50f7eef866da75
members = 26120
unsafe members = 0
formal game JSON = 26000

E-020
SHA-256 = 37d54414778c075069ab9ba2a80b73e6f9eefccbc944db8abf867da7d2800bd2
members = 9049
unsafe members = 0
formal game JSON = 9000
```

## Cross-study bridge source scope

The archive inventory confirms the required source classes exist:

- formal game JSON,
- `candidate-control-metrics.csv`,
- candidate/archetype CSV,
- manifest JSON,
- integrity JSON,
- formal evaluation JSON,
- paired endpoint JSON.

For the bridge itself, the next protocol remains intentionally narrower:

```text
E-018 D2: P2 / LG
E-019 D3: P2 / LG
E-020 D3: P2 / LG
```

E-019 D1 and V2 are not included in the core D2/D3 bridge.

## Why schema audit is still required

Member-path existence does not by itself prove that the archived candidate rows contain the exact identifiers needed to join to a reconstructed board state.

Before any association calculation, the next audit must confirm the presence and naming of:

- candidate `gameId`,
- candidate/event ply,
- fixed phenotype `classification`,
- phase field where available,
- trajectory identity where available,
- archived moves and observation state hashes.

No cross-study association values may be calculated before that schema audit is complete and the bridge protocol is frozen.

## Interpretation boundary

This inventory does not alter:

- E-018/H16 `confirmed` at fixed D2,
- E-019/H17 global `not-confirmed`,
- E-020/H18 `confirmed` at fixed D3,
- Stage 2 Mtaji `confirmed`,
- Stage 5 playing-style `not-confirmed`.

It is infrastructure for a later secondary / hypothesis-generation relation analysis only.
