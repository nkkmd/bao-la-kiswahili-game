# Critical Positions / Outcome Branching Study 1 — Stage 1 outcome-blind selection readiness PASS

Date: 2026-08-24 (Asia/Tokyo)

## Stage identity

```text
stageId = CPOB-S1-EXPLORATORY-2026-08-23-v1
specSha256 = 22710c008cbcb6f6030d30f3295e9e3420efeeed75edfbfc3de3e292ff6a16fc
selectionHash = 702baa878354be14ca97a026b2e97b48521a769b983874fb657e2c6afe82d57d
```

The mandatory independent full source-corpus replay had already passed before this selection was performed.

## Frozen selection procedure

The selected-root set was produced only by the preregistered outcome-blind procedure:

```text
collapse duplicate historicalTrajectoryHash groups
-> deterministic Namua/Mtaji assignment by frozen SHA parity
-> select one eligible root within assigned phase by frozen SHA rank
-> collapse duplicate selected ruleStateKey without replacement
-> apply frozen 300 Namua + 300 Mtaji quota
```

Forbidden inputs remained excluded from selection:

```text
game winner
continuation outcome
D_range
D2/D3 score
candidate matcher
post-move consequence
```

## Selection audit

```text
generatedGames = 3072
uniqueHistoricalTrajectories = 2726
unavailableAssignedPhase = 87
selectedBeforeRuleStateCollapse = 2639
duplicateSelectedRuleStatesCollapsed = 6
phasePoolAfterRuleStateCollapse:
  namua = 1356
  mtaji = 1277
droppedByPhaseQuota:
  namua = 1056
  mtaji = 977
selectedUniqueRuleStates = 600
replacementPerformed = false
phaseReassignmentPerformed = false
```

Final selected roots:

```text
Namua = 300
Mtaji = 300
total = 600
selected distinct opening prefixes = 567
maximum single selected generation-stratum share = 0.18833333333333332
```

Generation-stratum representation:

```text
B-D1 = 95
B-D2 = 95
B-D3 = 105
LS-D2 = 113
V2-D2 = 99
LE-D2 = 93
```

All frozen selection-readiness gates passed:

```text
uniqueHistoricalTrajectories = PASS
generatedDistinctOpeningPrefixes = PASS
selectedUniqueRuleStates = PASS
namuaSelectedRoots = PASS
mtajiSelectedRoots = PASS
selectedDistinctOpeningPrefixes = PASS
selectedPerGenerationStratum = PASS
maximumSingleSelectedGenerationStratumShare = PASS

selection readiness = PASS
```

## Independent compact-artifact cross-check

The supplied `selected-roots.json` and `selection-audit.json` were cross-checked independently before downstream authorization was treated as active.

Observed consistency:

```text
selected roots = 600
unique historicalTrajectoryHash = 600
unique ruleStateKey = 600
Namua/Mtaji = 300/300
condition counts = exact audit match
selected distinct openingPrefixHash = 567
terminal selected roots = 0
assigned-phase mismatches = 0
selected roots with actor legalMoveCount < 2 = 0
selected roots with ply < 8 = 0
selectionHash agrees across both artifacts = true
```

Compact local artifact SHA-256 values for the supplied copies:

```text
selected-roots.json = e55dab1918fc32e1a7fa9ccd2322cb55dd9e9a1cf135c15e5eea988e471ec6e3
selection-audit.json = da43afb1ff0d17570c3e710d6eec7c20aececa2023236f3540dd71103f78dec2
```

The local uploaded selection-audit copy does not itself carry a `specSha256` field; the paired selected-roots artifact carries the frozen spec SHA and both artifacts share the exact same selectionHash. This is recorded as an artifact-schema observation, not a scientific failure.

## Decision

**PASS.** The frozen selection-readiness firewall is satisfied. Stage 1 continuation measurement is now permitted under the already-authorized frozen Stage 1 pipeline.

The following remain unchanged and forbidden:

```text
no replacement
no seed extension
no phase reassignment
no replicate extension
no continuation-policy substitution
no threshold retuning
no favorable-subset rescue
no confirmatory claim from Stage 1
no Stage 2 generation
```

## Next permitted operation

```bash
node tools/experiments/run-critical-positions-stage1-exploratory.js --phase measure
```

Measurement must use all exact legal root moves, P1_NORMAL_TOP3, exactly 64 paired replicates per exact move, the frozen Stage 1 continuation salt, and the 200-ply post-root cap.

After measurement, preserve `measurement-audit.json` and do not run deterministic discovery until the independent `--phase measurement` verification has passed.
