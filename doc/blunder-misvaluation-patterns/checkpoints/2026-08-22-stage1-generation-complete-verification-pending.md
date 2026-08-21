# BMP Stage 1 generation complete — verification pending

Date: 2026-08-22 JST

## Stage identity

```text
studyId = BMP-STUDY1
stageId = BMP-S1-EXPLORATORY-2026-08-20-v1
specSha256 = f4820c1fa77f8a3c1f808e5367e2b10a1150492c0a1544aa076b61929f68a3dd
authorizationSha256 = 469d1614a8e6609b05cca6047c364dab35754a41ede825f54de492d47d8c8e75
generation sourceCommit = a8fd9ac0361d276e0f4a05e7df7d7a0c0ecd6ad2
sourceTreeDirty = false
```

## Authorized corpus generation result

```text
games = 2048
seeds = 22400001..22402048
uniqueHistoricalTrajectories = 1884
duplicateHistoricalTrajectoryGroups = 121
largestHistoricalTrajectoryGroup = 7
distinctOpeningPrefixes = 1621
summaryHash = 0db8a18aa28020d8803a144d592966753f16a83425680993a1bfd310dfc2a7e9
```

Frozen six-stratum assignment was observed exactly:

```text
B-D1 = 342
B-D2 = 342
B-D3 = 341
LS-D2 = 341
V2-D2 = 341
LE-D2 = 341
```

The manifest-reported source-file SHA-256 map matches the source-bound authorization map, and the runner reported a clean scientific source tree.

Machine-readable compact record:

`../results/STAGE_1_GENERATION_RESULT.json`

## Interpretation boundary

The corpus exists, but it has **not yet passed independent full replay/search verification**.

The generation-level counts show only that:

```text
uniqueHistoricalTrajectories 1884 >= frozen minimum 1600
distinctOpeningPrefixes 1621 >= frozen minimum 128
```

These two numerical observations are not a complete Stage 1 readiness decision.

The following remain unevaluated until later authorized gates:

```text
full replay/search verification
600 Namua + 600 Mtaji quota realizability
1200 unique selected rule states
selected-per-stratum support
finite complete D3 candidate tables
measured move-record minimum
candidate discovery/promotion
```

## Firewall

Until independent verification returns PASS:

```text
selection = BLOCKED
measurement = BLOCKED
discovery = BLOCKED
confirmatory inference = NOT AUTHORIZED
Stage 2 generation = NOT AUTHORIZED
```

No seed extension, replacement sampling, phase reassignment, threshold retuning, favorable subset selection, or other rescue action is authorized.

## Next gate

Run only the independent full replay/search verifier against the generated 2048-game corpus. Do not run `--phase select` before verification PASS is recorded.
