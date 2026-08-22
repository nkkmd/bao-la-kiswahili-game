# Checkpoint — Stage 1 selection readiness PASS / measurement gate open

Date: 2026-08-22

Study: `BMP-STUDY1`

Stage: `BMP-S1-EXPLORATORY-2026-08-20-v1`

## Execution identity

The investigator executed outcome-blind Stage 1 state selection at exact local HEAD:

```text
2f6567bab0590ca7741fd8ad9907118544f6331d
```

The pre-selection status showed:

```text
authorizationFilePresent = true
generatedGames = 2048
expectedGames = 2048
hasManifest = true
hasVerification = true
hasSelectionAudit = false
measurementFiles = 0
hasDiscoveryResult = false
```

The scientific source-file SHA-256 map remained identical to the authorization-bound map.

## Selection result

```text
uniqueHistoricalTrajectories = 1884
unavailableAssignedPhase = 70
selectedBeforeRuleStateCollapse = 1814
duplicateSelectedRuleStatesCollapsed = 1
phasePoolAfterRuleStateCollapse.namua = 961
phasePoolAfterRuleStateCollapse.mtaji = 852
droppedByPhaseQuota.namua = 361
droppedByPhaseQuota.mtaji = 252
selectedUniqueRuleStates = 1200
selectedPhaseCounts.namua = 600
selectedPhaseCounts.mtaji = 600
distinctOpeningPrefixes = 1067
selectionHash = 80a8ccbacb2ee943a8620f853a91789e24a09a55a8d46a3b93936246536a10df
replacementPerformed = false
phaseReassignmentPerformed = false
passed = true
```

Selected generation-stratum counts:

```text
B-D1 = 191
B-D2 = 185
B-D3 = 218
LS-D2 = 203
V2-D2 = 187
LE-D2 = 216
```

## Frozen selection gate decision

All frozen selection/readiness gates passed:

```text
unique historical trajectories >= 1600                  PASS (1884)
selected unique rule states = 1200                       PASS (1200)
Namua selected = 600                                     PASS (600)
Mtaji selected = 600                                     PASS (600)
distinct selected opening prefixes >= 128                PASS (1067)
selected roots per generation stratum >= 100             PASS (minimum 185)
```

No rescue occurred. The 70 trajectories without an eligible state in their preassigned phase were left unavailable; there was no phase reassignment or replacement. Both post-collapse phase pools exceeded the fixed quota before deterministic quota ranking.

## Gate transition

```text
Stage 1 selection readiness = PASS
measurement gate = OPEN
discovery gate = BLOCKED PENDING MEASUREMENT READINESS
confirmatory inference = NOT AUTHORIZED
Stage 2 generation = NOT AUTHORIZED
```

The next permitted scientific operation is the frozen Stage 1 measurement phase only. Measurement must complete all 1200 selected roots and then separately pass the frozen measurement-readiness gates:

```text
measured move records >= 3600
complete finite D3 candidate tables for all selected roots
```

No candidate discovery or interpretation is authorized before measurement readiness PASS.
