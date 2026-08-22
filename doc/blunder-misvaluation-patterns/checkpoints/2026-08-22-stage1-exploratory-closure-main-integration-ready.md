# 2026-08-22 — Stage 1 exploratory closure / main integration ready

## Scope

This checkpoint closes the repository/documentation boundary for **Stage 1 exploratory discovery only** before integration to `main`.

Blunder / Misvaluation Patterns **Study 1 remains active** because Stage 2 formal confirmation has not started.

## Baseline / branch

```text
baseline main HEAD = b1cc7047504b73c5a848e866f795c26a64250d13
research branch = research/blunder-misvaluation-patterns
```

At the start of the final integration audit, `main` remained exactly at the baseline HEAD; the research branch was ahead and not behind.

## Stage 1 closure state

```text
Stage 0 technical / construct audit = COMPLETE
Stage 1 scientific generation = COMPLETE (2048 / 2048)
independent full replay/search verification = PASS
outcome-blind selection = COMPLETE
selection readiness = PASS
measurement = COMPLETE (1200 roots / 5295 legal moves)
measurement readiness = PASS
automatic exploratory discovery = COMPLETE
promoted exploratory candidates = 4
candidate confirmation = NOT PERFORMED
Study 1 formal result = NONE
Stage 2 formal spec = NOT CREATED
Stage 2 scientific generation = NOT AUTHORIZED
```

## Frozen Stage 1 identities

```text
stageId = BMP-S1-EXPLORATORY-2026-08-20-v1
specSha256 = f4820c1fa77f8a3c1f808e5367e2b10a1150492c0a1544aa076b61929f68a3dd
verificationIdentityHash = f0ef925b8690020762c90c5438565d731bce46476bd5428f77450407e1867343
selectionHash = 80a8ccbacb2ee943a8620f853a91789e24a09a55a8d46a3b93936246536a10df
measurementHash = 614c0a41473dcc6a3dd5a609d6b6890449b8cf9014a6cae711ec541fdf40cd92
```

Raw discovery artifact:

```text
path = artifacts/local/blunder-misvaluation-patterns/stage1-exploratory-v1/discovery-result.json
bytes = 268693257
sha256 = c910b7c4f854daf0223fa5ed935dc0b2a5fe844ef5541d623adfdaca94cb8d26
```

## Promoted exploratory candidates

```text
BMP-S1-C01 — Namua / worstReplyActorFrontConnectionsDeltaNegative
BMP-S1-C02 — Namua / actorCaptureMoveDeltaNegative
BMP-S1-C03 — Namua / actorLegalMoveDeltaNegative
BMP-S1-C04 — Mtaji / allRepliesActorCaptureMoveDeltaNegative
```

All four passed the frozen Stage 1 promotion gates and deterministic caps. They are not confirmed blunders.

## Final documentation boundary

Before main integration, the repository documentation was updated so that:

- root `README.md` links to the BMP Study 1 overview;
- `doc/RESEARCH_INDEX.md` records Study 1 as active, Stage 1 exploratory complete, Stage 2 not started;
- `doc/FUTURE_RESEARCH_AGENDA.md` advances the program to Stage 2 formal confirmation and preserves all closed-study boundaries;
- `STUDY_1_OVERVIEW.md` describes the overall active Study;
- `STAGE_1_EXPLORATORY_REPORT.md` is the scientific integration for the completed exploratory stage;
- `REPRODUCIBILITY_INDEX.md` freezes Stage 1 hashes/artifacts/tooling;
- the premature `STUDY_1_FINAL_REPORT.md` label was removed because Study 1 is not yet formally complete.

## Interpretation firewall

```text
Stage 1 support/data may not be reused as Stage 2 confirmation evidence
confirmed Bao blunder claim = NOT AUTHORIZED
game-theoretic blunder claim = NOT AUTHORIZED
human misconception claim = NOT AUTHORIZED
expert/traditional recognition claim = NOT AUTHORIZED
pedagogical claim = NOT AUTHORIZED
```

## Main integration decision

Stage 1 exploratory evidence and its documentation are ready to be fixed in `main` as an immutable upstream discovery boundary before prospective Stage 2 design.

Integration does **not** authorize Stage 2 scientific generation.
