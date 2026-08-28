# G2-02 Stage 2 formal authorization checkpoint

Date: 2026-08-28

Study: `SRDR-STUDY1` — Search Reliability / Decision Robustness Study 1

Stage: `SRDR-S2-FORMAL-2026-08-27-v1`

## Authorization state

Stage 2 formal held-out replication is explicitly authorized for exactly one prospectively frozen population and instrument contract.

```text
source freeze commit = e176cafc15d2dde7b8767de6961959bb7ee9bb7b
Stage 2 spec SHA-256 = c4f4249896abc1a9b6c96c1782e4e3835cb395c1b436add3a8c90c1e02e1e509
preauthorization run = 33124483699 / success
source-freeze run = 33124483869 / success
authorization commit = bec87d54540c96c24353f2eeadc25338c53e54eb
formal run = 33124538584
runtime = ubuntu-24.04 / Node 22.23.2
```

## Frozen formal population

```text
games = 1536
seedStart = 25021001
seedEnd = 25022536
maxPly = 80
seed extension = prohibited
replacement = prohibited
early stopping = prohibited
```

## Consumed Stage 1 identity firewall

Immutable Stage 1 reference artifact:

```text
workflow run = 33123555267
artifact ID = 9667419537
artifact name = g2-02-stage1-development-v1-verified-canonical
artifact ZIP SHA-256 = 41c6b9940798aa1626b0c73279a47b53dbc3e14316d0cb75f48f4d194f5c8cf8
```

Stage 2 must exclude without replacement any trajectory/state overlapping Stage 1 by:

1. `historicalTrajectoryHash`;
2. `openingPrefixHash`;
3. selected authoritative `rawStateKey`.

Required post-firewall overlap counts are exactly `0 / 0 / 0`.

Stage 1 rows are not reusable as Stage 2 formal evidence.

## Frozen search grid

```text
D1_Q1
D2_Q1
D3_Q1
D2_Q0
D2_Q2
B64_Q1_MAXD3
B256_Q1_MAXD3
B1024_Q1_MAXD3
```

Move ordering is canonical lexical. Score tie tolerance is exactly zero. `D3_Q1` is a frozen higher-resource search reference only and is not game-theoretic truth.

## Frozen primary formal criterion

`mixed-material-sensitivity-and-high-budget-convergence/v1`

All formal gates must pass before the criterion is evaluated. `CONFIRMED` then requires all of:

```text
P1: D2_Q1 vs D3_Q1 pooled canonical-best disagreement
    two-sided 95% Wilson lower bound >= 0.20

P2: D2_Q2 vs D2_Q1 pooled canonical-best disagreement
    two-sided 95% Wilson lower bound >= 0.20

P3: B1024_Q1_MAXD3 vs D3_Q1 pooled canonical-best agreement
    two-sided 95% Wilson lower bound >= 0.90
```

Decision taxonomy:

```text
any preregistered gate fails -> INCONCLUSIVE
all gates pass and P1/P2/P3 all pass -> CONFIRMED
all gates pass and any of P1/P2/P3 fails -> NOT-CONFIRMED
technical execution failure -> no scientific decision
```

## Measurement hash contract

Stage 2 canonicalizes measurement hashing prospectively as:

```text
measurement core
-> JSON roundtrip
-> stable serialization
-> SHA-256
```

This is a representation contract only and prevents recurrence of the Stage 1 undefined-property hash split.

## No-rescue firewall

After Stage 2 authorization, the following are prohibited in response to observed results:

- additional seeds;
- seed extension;
- trajectory/state replacement;
- search-grid changes;
- score/tie tolerance changes;
- TopSet redefinition;
- endpoint replacement;
- threshold relaxation;
- subgroup rescue;
- alternate primary;
- failed-gate exception;
- treating higher-resource search as an optimal-play oracle.

## Execution entry confirmation

Formal workflow run `33124538584` passed:

1. explicit authorization validation; and
2. immutable Stage 1 consumed-identity artifact download.

It then entered frozen Stage 2 generation / firewall selection / measurement. No formal decision is recorded by this checkpoint.