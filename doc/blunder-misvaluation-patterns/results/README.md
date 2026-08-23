# Results

Stage 2 formal evaluation is complete.

```text
Stage 1 exploratory discovery = COMPLETE
Stage 1 exploratory candidates promoted = 4
Stage 2 generation / independent verification = COMPLETE / PASS
Stage 2 support-group selection = PASS
Stage 2 formal measurement = COMPLETE (2678 rows)
Stage 2 independent measurement verification = PASS
Stage 2 formal evaluation = COMPLETE
formal candidates = 4
estimable = 4
CONFIRMED = 0
NOT-CONFIRMED = 4
Study 1 = CLOSED
```

## Canonical machine-readable records

- `STAGE_2_TECHNICAL_VALIDATION_RESULT.json`
- `STAGE_2_GENERATION_RESULT.json`
- `STAGE_2_VERIFICATION_RESULT.json`
- `STAGE_2_SELECTION_RESULT.json`
- `STAGE_2_MEASUREMENT_RESULT.json`
- `STAGE_2_MEASUREMENT_VERIFICATION_RESULT.json`
- `STAGE_2_FORMAL_RESULT.json` — compact canonical Stage 2 formal result and Study 1 closure.

## Stage 2 identity

```text
stageId = BMP-S2-FORMAL-2026-08-22-v1
candidate freeze SHA-256 = 12ee81bac3ec669d39427cac3fe46e6657e89228284a0d8e6111653098dd955b
formal spec SHA-256 = 4260411338d01d19ea12c1b67379bc72f34427081677bbb4dbfd010962ebcaab
authorization SHA-256 = 0e5b29fcf64caf82c3e2106b85387eea5bb04ed66a0624f75f76518f13596a87
selectionHash = 76069e7d9bc93d06e07f15d5ac94244c53321ee97a05911aeea5db88e15741bf
measurementHash = 6eb5da3219cdef80907e3f0b1053a1c113db9b97951b1d7c2487ccd0521681eb
measurement verificationHash = e2a57675ecfd19ab00da3f1c4bafbacae7194b6be40d4644c87144c077cd7382
formal embedded resultHash = 1de774ca5aac8a284ec5f78395050238fab93643e47fc47046cf511612d50d50
raw formal-result SHA-256 = e478d3fb29ad15508ddcaf6973d8eb8aa6bf4debd23921564ae08a1ac518293d
```

## Candidate results

| Candidate | Failure recurrence | D3-inferior recurrence | Decision |
| --- | ---: | ---: | --- |
| `BMP-S2-C01` | 0.923983 | 0.464668 | **NOT-CONFIRMED** |
| `BMP-S2-C02` | 0.797645 | 0.464668 | **NOT-CONFIRMED** |
| `BMP-S2-C03` | 0.794968 | 0.464668 | **NOT-CONFIRMED** |
| `BMP-S2-C04` | 0.627160 | 0.507407 | **NOT-CONFIRMED** |

C01-C03 reproduce their frozen structural failure signatures strongly but fail the D3-inferior co-primary endpoint. C04 fails the absolute failure-signature confirmation floor and the D3-inferior endpoint.

All four candidates were estimable and passed technical integrity and consistency gates; this is not a non-estimability result.

## Artifact policy

The complete formal output remains local:

```text
artifacts/local/blunder-misvaluation-patterns/stage2-formal-v1/stage2-formal-result.json
```

It contains large opening-prefix count maps and is not committed. The repository stores the compact canonical result instead.

The earlier wrapper-produced local result with a null independent-measurement-verification hash is superseded. The canonical formal output binds verification hash `e2a57675...7382`; endpoint values and decisions are unchanged.

## Interpretation

`NOT-CONFIRMED` applies only to the preregistered machine-operational confirmation rule. It does not establish game-theoretic soundness, absence of human misconception, expert/traditional rejection, lack of pedagogical value, causal mechanism, or external validity.
