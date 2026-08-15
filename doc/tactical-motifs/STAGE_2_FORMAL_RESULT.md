# Stage 2 Formal Result — Tactical Motifs / Tesuji Study 1

Date: 2026-08-15

Stage ID: `TM-S2-FORMAL-2026-08-14-v1`

## Formal conclusion

Stage 2 prospectively tested four canonical tactical-motif candidates on a fresh, non-overlapping 3,072-game corpus. All four candidates were estimable under every frozen transferability gate. After the two co-primary endpoints per candidate were evaluated with the preregistered exact one-sided binomial tests and all eight planned p-values were adjusted by Holm-Bonferroni at FWER 0.05, exactly one candidate was formally confirmed:

> **TM-S2-C03 = CONFIRMED**

The other three candidates are:

- `TM-S2-C01` = **NOT-CONFIRMED**
- `TM-S2-C02` = **NOT-CONFIRMED**
- `TM-S2-C04` = **NOT-CONFIRMED**

Study summary:

```text
formal candidates = 4
confirmed = 1
not-confirmed = 3
inconclusive-not-estimable = 0
technical-inconclusive = 0
```

There is no omnibus claim requirement. Candidate-specific decisions are the formal conclusions.

## Frozen identities

- Stage 2 spec SHA-256: `83ad5916b2f70846b493d9a4a87191c4a9d4bf667e27dcc624d4fe04014838d8`
- candidate-definition SHA-256: `667f4645fb7c0c704b1d3e49a1d7caefca54de2b9df2ddf0e542f7241aeb81e8`
- selection hash: `81a8d3a44f5ded622e953633d255f57ac63db41cc82a8bca76f28d2c10b84722`
- measurement hash: `c912d0eb5e0d2a5957163b0bd1a17e85e4756ef693d1b3aef545aad65aaed2c9`
- result-core hash: `62719429fcca9de8b99309e2b8542a237184a91c29863db23d5aa8c0f4ad6748`
- uploaded/local result artifact SHA-256: `f13f5a87464a5c8b360695977edc5fca4348f438fbf20c4bd5be682ed80d4dd4`
- evaluated at: `2026-08-15T08:05:53.965Z`
- evaluation source commit: `d41b061067ab2e5dbe65294d3860586d9d3c1454`
- source tree dirty: `false`

The result-core hash was independently recomputed from the artifact using the repository `stableStringify` / SHA-256 semantics and matched exactly.

## Formal design applied

Each candidate had two co-primary binary endpoints:

1. `structuralSuccess`: the deterministic canonical move satisfies the frozen candidate consequence;
2. `tacticalValueSuccess`: the deterministic canonical move belongs to the exact D3 top set among all legal root moveVariants under frozen `bao / phase2 / D3` instrumentation.

Each endpoint used:

- H0: `p <= 0.50`
- H1: `p > 0.50`
- exact one-sided binomial
- required observed rate `>= 0.60`

All eight p-values were adjusted together using Holm-Bonferroni at family-wise alpha `0.05`.

Consistency gates:

- D3 at-or-above-state-median rate `>= 0.60`
- D3 unique-worst rate `<= 0.15`

All four candidates passed all six preregistered estimability / transferability gates.

## Candidate results

| candidate | n | structural rate | structural Holm p | D3 top-set rate | D3 top-set Holm p | D3 >= median | D3 unique-worst | decision |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| `TM-S2-C01` | 1597 | 0.694427 | 3.3098e-55 | 0.493425 | 1.0 | 0.750783 | 0.080150 | **NOT-CONFIRMED** |
| `TM-S2-C02` | 2705 | 0.092791 | 1.0 | 0.307209 | 1.0 | 0.597043 | 0.230314 | **NOT-CONFIRMED** |
| `TM-S2-C03` | 1272 | 0.978774 | effectively < machine range | 0.736635 | 1.0679e-65 | 0.869497 | 0.070755 | **CONFIRMED** |
| `TM-S2-C04` | 1031 | 0.414161 | 1.0 | 0.315228 | 1.0 | 0.558681 | 0.195926 | **NOT-CONFIRMED** |

For `TM-S2-C03:structuralSuccess`, the stored double-precision p-value is `0` because the exact upper-tail probability is below IEEE-754 double range. Independent high-precision recomputation gives approximately `5.79 × 10^-328`; this does not affect the rejection or formal decision.

## TM-S2-C03 — confirmed machine-reproducible tactical motif

Canonical Stage 1 rank: `5`

Canonical candidate key:

`7a9ebacdc74234cf206b59696a92551b3e15f5e97336ef09a16e1efbf0042eba`

Frozen definition:

```text
phase = mtaji
precondition = reusablePits=0-2
move abstraction = takata / row 1 / direction right / coarse-no-index
structural consequence = actorNyumbaSeedsDeltaSign=0
```

Formal fresh-corpus evidence:

```text
selected roots = 1272
unique historical trajectories = 1272
unique rule states = 1272
distinct opening prefixes = 1121
generation strata = 6
maximum opening-prefix share = 0.003145
maximum generation-stratum share = 0.195755

structural success = 1245 / 1272 = 0.978774
D3 top-set success = 937 / 1272 = 0.736635
D3 at-or-above-state-median = 1106 / 1272 = 0.869497
D3 unique-worst = 90 / 1272 = 0.070755
```

Both co-primary observed rates exceed 0.60, both Holm-adjusted tests reject, and both D3 consistency gates pass. Therefore the preregistered formal decision is **CONFIRMED**.

The paired Stage 1 rank-6 definition remains diagnostic-only. At the C03 canonical selected roots its paired consequence held in 1237/1272 = 0.972484, but this quantity has no formal decision use and does not alter the canonical C03 definition.

## Why the other candidates were not confirmed

### TM-S2-C01

The structural consequence reproduced strongly (`1109/1597 = 0.694427`) and the structural endpoint rejected after Holm adjustment. However D3 top-set membership was only `788/1597 = 0.493425`, below both the 0.60 observed-rate requirement and the null benchmark. Because both co-primary endpoints are required, the candidate is **NOT-CONFIRMED**.

### TM-S2-C02

Structural success was `251/2705 = 0.092791` and D3 top-set membership was `831/2705 = 0.307209`. The D3 at-or-above-median rate (`0.597043`) also fell just below the fixed 0.60 consistency threshold, while D3 unique-worst (`0.230314`) exceeded the 0.15 maximum. The candidate is **NOT-CONFIRMED**.

### TM-S2-C04

Structural success was `427/1031 = 0.414161` and D3 top-set membership was `325/1031 = 0.315228`. D3 at-or-above-median (`0.558681`) failed the minimum and D3 unique-worst (`0.195926`) exceeded the maximum. The candidate is **NOT-CONFIRMED**.

## Interpretation boundary

The `CONFIRMED` label for C03 authorizes only the following claim:

> Under the frozen Bao rules, engine, candidate representation, population, root-selection procedure, and exact D3 search operationalization used in this study, C03 is a machine-reproducible transferable tactical motif.

It does **not** establish:

- traditional or expert-recognized tesuji status;
- human strategic importance;
- beginner importance;
- pedagogical value;
- causal strategic benefit outside the formal operationalization;
- generalization to other Bao rule sets, engines, evaluators, or search instruments.

Human/expert/traditional validation therefore remains a separate prospective research question.

## No-rescue closure

The three `NOT-CONFIRMED` candidates remain negative formal results. They may not be rescued by:

- extra seeds or extra games;
- alternative subsets;
- paired-definition substitution;
- candidate merge/split;
- endpoint or threshold retuning;
- favorable depth selection;
- dropping failed endpoints from multiplicity control;
- renaming a failed definition after outcome inspection.

Any further test requires a new prospective study/version and a fresh non-overlapping corpus.
