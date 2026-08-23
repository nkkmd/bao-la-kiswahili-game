# Checkpoint — Stage 2 formal complete / Study 1 closed / zero confirmed

Date: 2026-08-23

## State

```text
studyId = BMP-STUDY1
stageId = BMP-S2-FORMAL-2026-08-22-v1
Stage 2 formal evaluation = COMPLETE
formal candidates = 4
estimable candidates = 4
CONFIRMED = 0
NOT-CONFIRMED = 4
Study 1 = CLOSED
```

## Formal identity

```text
candidate freeze SHA-256 = 12ee81bac3ec669d39427cac3fe46e6657e89228284a0d8e6111653098dd955b
formal spec SHA-256 = 4260411338d01d19ea12c1b67379bc72f34427081677bbb4dbfd010962ebcaab
selectionHash = 76069e7d9bc93d06e07f15d5ac94244c53321ee97a05911aeea5db88e15741bf
measurementHash = 6eb5da3219cdef80907e3f0b1053a1c113db9b97951b1d7c2487ccd0521681eb
independent measurement verificationHash = e2a57675ecfd19ab00da3f1c4bafbacae7194b6be40d4644c87144c077cd7382
formal embedded resultHash = 1de774ca5aac8a284ec5f78395050238fab93643e47fc47046cf511612d50d50
raw formal-result file SHA-256 = e478d3fb29ad15508ddcaf6973d8eb8aa6bf4debd23921564ae08a1ac518293d
```

The earlier wrapper-generated local result with null measurement-verification binding is superseded and is not the canonical formal result. The corrected direct frozen evaluator output binds the exact independent measurement verification hash above. Endpoint values and candidate decisions are unchanged by this provenance correction.

## Candidate decisions

```text
BMP-S2-C01 = NOT-CONFIRMED
BMP-S2-C02 = NOT-CONFIRMED
BMP-S2-C03 = NOT-CONFIRMED
BMP-S2-C04 = NOT-CONFIRMED
```

C01-C03 strongly reproduce their frozen failure signatures but fail the frozen D3-inferior co-primary endpoint (`0.464668 < 0.70`).

C04 has failure-signature recurrence `0.627160 < 0.65` and D3-inferior recurrence `0.507407 < 0.70`.

All candidates were estimable and technically valid. Therefore this is not a non-estimability closure.

## No rescue

No seed extension, replacement, identity-overlap replacement, candidate/matcher/failure-token edit, phase reassignment, endpoint substitution, threshold/floor retuning, multiplicity/alpha change, alternate primary depth/evaluator, favorable subgroup promotion or manual override is authorized or performed.

## Interpretation boundary

`NOT-CONFIRMED` means the exploratory candidate did not satisfy the prospective machine-operational confirmation rule. It does not establish game-theoretic soundness, absence of human misconception, expert/traditional rejection, lack of pedagogical value, causal mechanism, or external validity.

D3 is a frozen machine reference, not ground truth.

## Closure

Stage 0, Stage 1 and Stage 2 are complete. `BMP-STUDY1` is scientifically closed. Any future work on structural failure patterns, alternate search depths/evaluators, human judgement or game-theoretic status must be a new prospective study rather than a rescue or continuation of this formal result.
