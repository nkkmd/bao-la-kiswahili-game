# CPOB Stage 1 — Full Corpus Replay Verification PASS

Date: 2026-08-23

Stage:

```text
CPOB-S1-EXPLORATORY-2026-08-23-v1
```

Frozen specification:

```text
specSha256 = 22710c008cbcb6f6030d30f3295e9e3420efeeed75edfbfc3de3e292ff6a16fc
```

## Verification result

The independently produced local `verification.json` for the frozen Stage 1 source corpus reports:

```text
passed = true
fullCorpusReplay = true
gamesVerified = 3072
uniqueHistoricalTrajectories = 2726
distinctOpeningPrefixes = 2226
scientificInferenceAuthorized = false
confirmatoryReuseAllowed = false
```

This satisfies the mandatory corpus-verification firewall required before outcome-blind root selection.

The verifier independently replayed the complete frozen source corpus under the preregistered engine/AI semantics and checked the stored move/state/trajectory/opening-prefix identities before writing `verification.json`.

## Scientific interpretation

This is a reproducibility / identity verification result. It does **not** authorize or establish:

- confirmatory scientific inference from Stage 1;
- game-theoretic criticality;
- validated win-probability interpretation;
- human/expert criticality;
- rescue or relabeling of any completed study;
- Stage 2 generation.

No Stage 1 continuation measurement has yet been run at this checkpoint, and no `D_range` or continuation-win-rate evidence is used by the root-selection procedure.

## Gate transition

Before this checkpoint:

```text
source generation = COMPLETE
full corpus replay verification = PENDING
root selection = BLOCKED
```

After this checkpoint:

```text
source generation = COMPLETE
full corpus replay verification = PASS
outcome-blind root selection = UNBLOCKED / NEXT
continuation measurement = NOT STARTED
Stage 2 generation = NOT AUTHORIZED
```

The next permitted command is:

```bash
node tools/experiments/run-critical-positions-stage1-exploratory.js --phase select
```

Selection must remain exactly as frozen: duplicate historical trajectories collapse first; phase assignment is hash-based; within-phase root choice is hash-ranked; duplicate rule states collapse without replacement; fixed 300 Namua / 300 Mtaji quotas apply; and no winner, continuation outcome, `D_range`, D2/D3 value, post-move consequence, or candidate-discovery information may influence selection.

If the resulting selection-readiness audit fails, downstream measurement must stop without replacement, phase reassignment, seed extension, threshold retuning, or other rescue.
