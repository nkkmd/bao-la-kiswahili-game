# 2026-08-23 — Stage 2 selection PASS / formal measurement open

## Scope

This checkpoint records the outcome-blind Stage 2 support-group selection after the authorized 4096-game corpus passed independent full replay/search verification.

No formal endpoint result was inspected or interpreted at selection.

## Frozen identity

```text
studyId = BMP-STUDY1
stageId = BMP-S2-FORMAL-2026-08-22-v1
spec SHA-256 = 4260411338d01d19ea12c1b67379bc72f34427081677bbb4dbfd010962ebcaab
candidate freeze SHA-256 = 12ee81bac3ec669d39427cac3fe46e6657e89228284a0d8e6111653098dd955b
```

## Pre-selection Stage 1 firewall

From 3559 representative Stage 2 historical trajectories:

```text
historicalTrajectoryHash overlap dropped = 299
openingPrefixHash overlap dropped = 633
```

## G01 Namua

```text
eligible historical trajectories = 1890
Stage 1 rule-state overlaps dropped = 0
duplicate selected rule states collapsed = 22
selected unique rule states = 1868
selectionHash = c8942b90f6806c8c0aa16301b890e064393daed6e6cbd441cb8a3d6242878a23
```

Prospective estimability preview:

```text
unique historical trajectories = 1868 >= 96
unique rule states = 1868 >= 96
distinct opening prefixes = 1695 >= 48
maximum one-opening-prefix share = 0.0021413276231263384 <= 0.10
generation strata = 6 >= 4
maximum one-generation-stratum share = 0.20717344753747324 <= 0.50
estimablePreview = true
```

G01 is shared by `BMP-S2-C01`, `BMP-S2-C02`, and `BMP-S2-C03`.

## G02 Mtaji

```text
eligible historical trajectories = 823
Stage 1 rule-state overlaps dropped = 1
duplicate selected rule states collapsed = 12
selected unique rule states = 810
selectionHash = dcb7ae94cb802da931257e5ca26809ea22d1eda857ff356e3ba8af8fcfd1636e
```

Prospective estimability preview:

```text
unique historical trajectories = 810 >= 96
unique rule states = 810 >= 96
distinct opening prefixes = 763 >= 48
maximum one-opening-prefix share = 0.0049382716049382715 <= 0.10
generation strata = 6 >= 4
maximum one-generation-stratum share = 0.18888888888888888 <= 0.50
estimablePreview = true
```

G02 is used by `BMP-S2-C04`.

## Final identity firewall

```text
historicalTrajectoryHash overlap = 0
openingPrefixHash overlap = 0
ruleStateKey overlap = 0
stage1IdentityFirewallPassed = true
```

No rescue occurred:

```text
replacementPerformed = false
seedExtensionPerformed = false
alternateRootAfterRuleStateOverlapPerformed = false
```

Overall selection identity:

```text
selectionHash = 76069e7d9bc93d06e07f15d5ac94244c53321ee97a05911aeea5db88e15741bf
selectionIntegrityPassed = true
```

## Decision

**Stage 2 outcome-blind selection gate = PASS.**

Formal D3 measurement is now open under the frozen Stage 2 specification. Formal evaluation remains blocked until measurement production completes and the independent formal measurement verifier passes.

This checkpoint does not establish recurrence, confirmation, blunder status, or any human/expert interpretation.
