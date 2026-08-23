# REPRODUCIBILITY_INDEX — Blunder / Misvaluation Patterns Study 1

Updated: 2026-08-23  
Status: **STUDY 1 CLOSED / STAGE 1 + STAGE 2 COMPLETE**

## Study identity

```text
studyId = BMP-STUDY1
original baseline main HEAD = b1cc7047504b73c5a848e866f795c26a64250d13
integrated Stage 1 main HEAD = 52f5635be7064b5016baf7cde82faebe60609d9e
Stage 2 branch = research/blunder-misvaluation-patterns-stage2-formal
```

## Stage 1 exploratory identity

```text
stageId = BMP-S1-EXPLORATORY-2026-08-20-v1
spec SHA-256 = f4820c1fa77f8a3c1f808e5367e2b10a1150492c0a1544aa076b61929f68a3dd
Stage 1 games = 2048
seeds = 22400001..22402048
unique historical trajectories = 1884
distinct opening prefixes = 1621
selected unique rule states = 1200
measurementHash = 614c0a41473dcc6a3dd5a609d6b6890449b8cf9014a6cae711ec541fdf40cd92
promoted exploratory candidates = 4
```

Stage 1 support is not reused as Stage 2 confirmation evidence.

## Stage 2 frozen identity

```text
stageId = BMP-S2-FORMAL-2026-08-22-v1
candidate freeze SHA-256 = 12ee81bac3ec669d39427cac3fe46e6657e89228284a0d8e6111653098dd955b
formal spec SHA-256 = 4260411338d01d19ea12c1b67379bc72f34427081677bbb4dbfd010962ebcaab
authorization SHA-256 = 0e5b29fcf64caf82c3e2106b85387eea5bb04ed66a0624f75f76518f13596a87
scientific generation source commit = eecb2c8213fc71e518b0e96946e82790fd20961b
scientific measurement source commit = 06ce63155c5b060a9ea3f80ba5a2dc48216e848b
```

The historical pre-authorization spec-hash transcription error is documented in its own checkpoint. The canonical formal spec SHA is `426041...caab`.

## Stage 2 population and corpus verification

```text
games = 4096
seeds = 22500001..22504096
unique historical trajectories = 3559
distinct opening prefixes = 2827
summaryHash = 9875e142a1d1067d1fc0042e3eeaf9060a1d2b783bfb40a8782e72c1238a4b2c
verificationIdentityHash = e2fab371ae09d18e7fed0aa979f72cb87ec4e2fdc67caacdb6129818b2b38fa4
fullSearchRecomputation = true
corpus verification = PASS
```

## Stage 2 selection

```text
selectionHash = 76069e7d9bc93d06e07f15d5ac94244c53321ee97a05911aeea5db88e15741bf
G01 Namua selected unique rule states = 1868
G02 Mtaji selected unique rule states = 810
final Stage 1 overlap = 0 / 0 / 0
replacementPerformed = false
seedExtensionPerformed = false
alternateRootAfterRuleStateOverlapPerformed = false
selectionIntegrityPassed = true
```

## Stage 2 measurement and independent verification

```text
G01 measurements = 1868
G02 measurements = 810
total formal measurements = 2678
all formal D3 candidate tables finite = true
measurementHash = 6eb5da3219cdef80907e3f0b1053a1c113db9b97951b1d7c2487ccd0521681eb
```

Independent verification:

```text
verificationHash = e2a57675ecfd19ab00da3f1c4bafbacae7194b6be40d4644c87144c077cd7382
verifiedMeasurementRows = 2678
measurementHashMatches = true
independentFormalD3CandidateTableRecomputation = true
independentCandidateMatcherAndFailureRecomputation = true
stage1IdentityFirewallPassed = true
passed = true
```

## Stage 2 formal result identity

Complete local formal artifact:

```text
path = artifacts/local/blunder-misvaluation-patterns/stage2-formal-v1/stage2-formal-result.json
bytes = 480791
sha256 = e478d3fb29ad15508ddcaf6973d8eb8aa6bf4debd23921564ae08a1ac518293d
embedded resultHash = 1de774ca5aac8a284ec5f78395050238fab93643e47fc47046cf511612d50d50
independentMeasurementVerificationHash = e2a57675ecfd19ab00da3f1c4bafbacae7194b6be40d4644c87144c077cd7382
```

The earlier wrapper-generated local result with a null verification-binding field is superseded. The corrected result was produced by the already-frozen direct evaluator; endpoint values and formal decisions did not change.

Canonical compact result:

- [`results/STAGE_2_FORMAL_RESULT.json`](results/STAGE_2_FORMAL_RESULT.json)

## Formal decisions

```text
BMP-S2-C01 = NOT-CONFIRMED
BMP-S2-C02 = NOT-CONFIRMED
BMP-S2-C03 = NOT-CONFIRMED
BMP-S2-C04 = NOT-CONFIRMED
confirmedCount = 0
```

All four candidates were estimable and technically valid.

## Stage 1 execution chain

Key Stage 1 commits:

```text
contract freeze = 94b565468a9222dcaee0576529147ef032a284e6
contract validation execution = b3ff83a4b94b5e60e98ef48b6b2666a20a26334a
validated implementation = 8df328ca238611919ac58c262b92058712ee1049
tooling validation result = cd26cb3280fde00663618162f7c1e2d306470032
execution source freeze = 0a5c57aa5bb081b4785ce13678d057f5d3bc0b9c
Stage 1 generation authorization = 1af3828c1c25789d6f4af590ee973cffd34bca46
generation result = bb6375ff1ce3afab00d588b4b6e017b6aaf24541
verification result = 17995f04f3b9abbe0d73b2f035e8129ff07e191f
selection execution = 2f6567bab0590ca7741fd8ad9907118544f6331d
selection result = d6a8617a517140e34e9af3a5f2b0793884fb1345
measurement execution = 1c7fc1f8d979d6952433406e7ab5d0a515a633fb
measurement result = 5e916c6676022a50d551310f21cf1d3414b6c27c
discovery execution = 14c0d29683611ecd76771a213ce2380cb71fa18d
discovery result = ffb9184d84c775e94f52b91f0c1621ea46061a93
```

## Machine-readable records

Stage 1:

- [`results/STAGE_0_FEASIBILITY_RESULT.json`](results/STAGE_0_FEASIBILITY_RESULT.json)
- [`results/STAGE_1_CONTRACT_VALIDATION_RESULT.json`](results/STAGE_1_CONTRACT_VALIDATION_RESULT.json)
- [`results/STAGE_1_TOOLING_VALIDATION_RESULT.json`](results/STAGE_1_TOOLING_VALIDATION_RESULT.json)
- [`results/STAGE_1_GENERATION_RESULT.json`](results/STAGE_1_GENERATION_RESULT.json)
- [`results/STAGE_1_VERIFICATION_RESULT.json`](results/STAGE_1_VERIFICATION_RESULT.json)
- [`results/STAGE_1_SELECTION_RESULT.json`](results/STAGE_1_SELECTION_RESULT.json)
- [`results/STAGE_1_MEASUREMENT_RESULT.json`](results/STAGE_1_MEASUREMENT_RESULT.json)
- [`results/STAGE_1_DISCOVERY_RESULT.json`](results/STAGE_1_DISCOVERY_RESULT.json)

Stage 2:

- [`results/STAGE_2_TECHNICAL_VALIDATION_RESULT.json`](results/STAGE_2_TECHNICAL_VALIDATION_RESULT.json)
- [`results/STAGE_2_GENERATION_RESULT.json`](results/STAGE_2_GENERATION_RESULT.json)
- [`results/STAGE_2_VERIFICATION_RESULT.json`](results/STAGE_2_VERIFICATION_RESULT.json)
- [`results/STAGE_2_SELECTION_RESULT.json`](results/STAGE_2_SELECTION_RESULT.json)
- [`results/STAGE_2_MEASUREMENT_RESULT.json`](results/STAGE_2_MEASUREMENT_RESULT.json)
- [`results/STAGE_2_MEASUREMENT_VERIFICATION_RESULT.json`](results/STAGE_2_MEASUREMENT_VERIFICATION_RESULT.json)
- [`results/STAGE_2_FORMAL_RESULT.json`](results/STAGE_2_FORMAL_RESULT.json)

## Interpretation firewall

Reproducibility establishes the exact machine procedure and formal candidate decisions only.

```text
Study 1 formal result = 0 confirmed / 4 not-confirmed
game-theoretic claim = not authorized
human misconception claim = not authorized
expert/traditional claim = not authorized
pedagogical claim = not authorized
causal claim = not authorized
external-validity claim = not authorized
```

Study 1 is closed. Any alternate evaluator/depth, human-validation or game-theoretic follow-up must be a new prospective study.
