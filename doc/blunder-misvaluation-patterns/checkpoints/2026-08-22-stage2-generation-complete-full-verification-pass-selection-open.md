# 2026-08-22 — Stage 2 generation complete / full verification PASS / selection open

## Scope

This checkpoint records completion of the fixed Stage 2 formal population and the mandatory independent full replay + generation-search verification.

No Stage 2 support-group selection, formal D3 measurement, independent formal measurement verification, or formal endpoint evaluation had been performed when this checkpoint was created.

## Frozen identity

```text
studyId = BMP-STUDY1
stageId = BMP-S2-FORMAL-2026-08-22-v1
spec SHA-256 = 4260411338d01d19ea12c1b67379bc72f34427081677bbb4dbfd010962ebcaab
candidate freeze SHA-256 = 12ee81bac3ec669d39427cac3fe46e6657e89228284a0d8e6111653098dd955b
authorization SHA-256 = 0e5b29fcf64caf82c3e2106b85387eea5bb04ed66a0624f75f76518f13596a87
scientific source commit = eecb2c8213fc71e518b0e96946e82790fd20961b
source tree dirty = false
```

## Generation result

```text
games = 4096 / 4096
seeds = 22500001..22504096
unique historical trajectories = 3559
duplicate historical-trajectory groups = 352
largest historical-trajectory group = 12
distinct opening prefixes = 2827
summaryHash = 9875e142a1d1067d1fc0042e3eeaf9060a1d2b783bfb40a8782e72c1238a4b2c
```

Condition counts:

```text
B-D1 = 683
B-D2 = 683
B-D3 = 683
LS-D2 = 683
V2-D2 = 682
LE-D2 = 682
```

The generation manifest remained bound to the exact authorized source-file SHA map.

## Independent verification

```text
passed = true
fullSearchRecomputation = true
gamesVerified = 4096
unique historical trajectories = 3559
distinct opening prefixes = 2827
verificationIdentityHash = e2fab371ae09d18e7fed0aa979f72cb87ec4e2fdc67caacdb6129818b2b38fa4
```

Generation and verification counts, condition distribution, source commit, clean-tree state and source-file SHA map agree exactly.

## Scientific decision

**Stage 2 corpus verification gate = PASS.**

The next permissible action is the frozen outcome-blind support-group selection. This does not authorize formal measurement or endpoint evaluation by itself.

The fixed execution order remains:

```text
generate
-> independent full replay + generation-search verification   PASS
-> support-group select                                      OPEN
-> formal measure                                            BLOCKED
-> independent formal measurement verification              BLOCKED
-> formal evaluate                                           BLOCKED
```

No seed extension, replacement, candidate edit, matcher/failure retuning, phase reassignment, endpoint change, multiplicity change, or manual override is authorized.
