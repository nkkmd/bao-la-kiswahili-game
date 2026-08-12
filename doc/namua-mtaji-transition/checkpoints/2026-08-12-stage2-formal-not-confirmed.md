# Checkpoint — Stage 2 formal evaluation complete / not-confirmed

Date: 2026-08-12  
Status: **FORMAL PRIMARY ANALYSIS COMPLETE**

## Formal decision

The frozen Stage 2 P2-D2 primary analysis completed after the machine-enforced preoutcome firewall and independently bound outcome unlock.

```text
formal decision = not-confirmed
primary p_two_sided = 1.0
alpha = 0.05
```

No post-outcome extension, reseeding, comparator change, threshold relaxation, classifier refit, restandardization, relabeling, or rescue analysis was used.

## Corpus and integrity

```text
formal source commit = b0e04a1c53d9c4d982a37c9489f3b56d9e6282ca
condition = P2-D2 only
games = 4096
seeds = 20280001..20284096
observations = 227040
unique historical trajectories = 2874
verification = PASS
clock violations = 0
first Mtaji at ply 44 = 3886 / 3886 reached-Mtaji games
```

## Preoutcome matching

```text
raw fully ascertained Namua CBE rows = 37
unique earliest-CBE trajectories = 31
morphology-eligible exposures = 30
G1 = PASS (30 >= 20)
G2 = PASS (20 controls for every exposure)
matched sets = 30
unique controls = 600
control reuse = 0
progression violations = 0
```

Frozen identity:

```text
matchingAssignmentHash = b7de843fbe61f07fce9ac8a6143e73a1c2ff834f7e44b2600479af68991644b1
preoutcomeAssignmentCsvSha256 = bea056341b8f49d2a32f2ddffa5247a58ca87067f63371d77be362fbbc2e0374
eventTableSha256 = 84e80ce832e5f10c627f4fb09d906adaf201ecd1350b7764624b973af4af8d82
```

The preoutcome review passed with `morphologyLabelsRead = false` and `frozenMtajiClassifierLoaded = false` before the unlock was committed.

## Outcome firewall

Exact outcome unlock commit:

```text
afe1ca9e9021f5f391c2cedbf9c0fcf8330aafcb
```

The frozen Mtaji artifact then passed its hash audit:

```text
candidateDefinitionHash
= 7a276a8c795efddaf9b9555e0fbb7fdc1e56563d30ebcb352b42b3f53ba0e75d

stored = recomputed = expected
refit = false
restandardization = false
relabeling = false
```

## Primary outcome

```text
exposed M1 = 26 / 30 = 0.8666666667
controls M1 = 509 / 600 = 0.8483333333
mean within-stratum matched risk difference = +0.0183333333
Mantel-Haenszel common OR = 1.1617647059
observed T = 26
p_lower = 0.6873577200535744
p_upper = 0.5180837673658513
p_two_sided = 1.0
```

Because `p_two_sided >= 0.05`, the frozen decision rule yields:

> **not-confirmed**

`direction = null` is retained. The positive descriptive risk difference is not promoted to a directional finding.

## Independent post-evaluation audit

The final morphology CSV contained exactly 30 sets × 21 units = 630 rows. The preoutcome assignment columns and order were unchanged; all 600 controls remained unique and disjoint from exposures; all 630 first-Mtaji observations were at ply 44; M1/M2-to-Y coding had zero mismatches.

The formal statistics and all 30 stratum summaries were independently recomputed from the final CSV and matched the machine result exactly.

## Interpretation boundary

This negative formal result means only that the frozen P2-D2 matched analysis did not confirm the prespecified first-Mtaji morphology association.

It does not establish absence of all temporal structure, does not authorize causal or Mtaji-timing claims, does not generalize beyond P2-D2, and does not permit post-hoc subgroup/comparator rescue.

Canonical result:

```text
doc/namua-mtaji-transition/STAGE_2_FORMAL_RESULT.md
```
