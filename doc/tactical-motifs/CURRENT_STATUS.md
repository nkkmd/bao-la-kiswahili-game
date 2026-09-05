# CURRENT_STATUS — Tactical Motifs / Tesuji Study 1 （日本語の要点）

## 日本語での要点

TM-S2-C03だけがCONFIRMEDで、残る3候補はNOT-CONFIRMEDである。

この文書に残る英語の説明は、closure時に固定したrepository / execution provenanceの原文である。canonical token、数値、hash、authorizationを変えずに保持しており、現在向けの説明は`README.md`と`STUDY_1_OVERVIEW.md`を優先する。

Updated: 2026-08-15

## Current state （日本語の要点）

**CLOSED / COMPLETE — Stage 0 technical validation, Stage 1 prospective exploratory discovery, and Stage 2 fresh prospective formal confirmation are complete.**

Final Stage 2 decisions:

```text
TM-S2-C01 = NOT-CONFIRMED
TM-S2-C02 = NOT-CONFIRMED
TM-S2-C03 = CONFIRMED
TM-S2-C04 = NOT-CONFIRMED
```

Exactly one candidate is confirmed as a **machine-reproducible transferable tactical motif under the frozen Bao engine/search operationalization**.

Baseline `main` HEAD at study start:

`08c70ba6ac980884d51562c207410db3521b8ae4`

Study branch:

`research/tactical-motif-discovery`

## Scientific state （日本語の要点）

- Stage 0 technical inspection: **COMPLETE / VALIDATED**
- Stage 1 exploratory discovery: **COMPLETE**
- Stage 1 promoted definitions: **8 / FROZEN**
- Stage 2 canonical formal candidates: **4 / FROZEN**
- Stage 2 formal spec/tooling: **FROZEN / VALIDATED**
- Stage 2 numerical hardening: **COMPLETE BEFORE SCIENTIFIC GENERATION**
- Stage 2 fresh corpus: **3,072 games / FULLY VERIFIED**
- Stage 2 selection: **COMPLETE / INTEGRITY PASSED**
- Stage 2 estimability: **ALL 4 CANDIDATES PASS ALL 6 GATES**
- Stage 2 measurements: **6,605 / INTEGRITY PASSED**
- Stage 2 formal evaluation: **COMPLETE / ACCEPTED**
- confirmed candidates: **1 / 4 — C03**
- human/expert/traditional/pedagogical claim: **NOT ESTABLISHED / OUT OF SCOPE**

## Final formal identity （結論）

Stage ID:

`TM-S2-FORMAL-2026-08-14-v1`

- candidate-definition SHA-256: `667f4645fb7c0c704b1d3e49a1d7caefca54de2b9df2ddf0e542f7241aeb81e8`
- formal spec SHA-256: `83ad5916b2f70846b493d9a4a87191c4a9d4bf667e27dcc624d4fe04014838d8`
- authorization SHA-256: `43381afe4b219cd7653f6177982df697c0cb3e8f1874a4ac3d217930dfab1e51`
- selection hash: `81a8d3a44f5ded622e953633d255f57ac63db41cc82a8bca76f28d2c10b84722`
- measurement hash: `c912d0eb5e0d2a5957163b0bd1a17e85e4756ef693d1b3aef545aad65aaed2c9`
- result-core hash: `62719429fcca9de8b99309e2b8542a237184a91c29863db23d5aa8c0f4ad6748`
- local/uploaded result artifact SHA-256: `f13f5a87464a5c8b360695977edc5fca4348f438fbf20c4bd5be682ed80d4dd4`
- evaluation source commit: `d41b061067ab2e5dbe65294d3860586d9d3c1454`
- source tree dirty: `false`

## Confirmed candidate — TM-S2-C03 （日本語の要点）

Canonical Stage 1 rank: `5`

Canonical candidate key:

`7a9ebacdc74234cf206b59696a92551b3e15f5e97336ef09a16e1efbf0042eba`

Frozen definition:

```text
phase = mtaji
precondition = reusablePits=0-2
move = takata / row 1 / direction right / coarse-no-index
consequence = actorNyumbaSeedsDeltaSign=0
```

Fresh formal result:

```text
selected roots = 1272
distinct opening prefixes = 1121
generation strata = 6
structural success = 1245 / 1272 = 0.978774
D3 top set = 937 / 1272 = 0.736635
D3 at-or-above median = 1106 / 1272 = 0.869497
D3 unique worst = 90 / 1272 = 0.070755
formal decision = CONFIRMED
```

Both co-primary endpoints passed the frozen `>=0.60` observed-rate requirement and Holm-adjusted significance criterion. Both D3 consistency gates also passed.

## Negative formal results （結果）

### C01 — NOT-CONFIRMED （日本語の要点）

Structural consequence reproduced (`0.694427`) but D3 top-set rate was `0.493425`. The tactical-value co-primary endpoint failed, so the candidate is not confirmed.

### C02 — NOT-CONFIRMED （日本語の要点）

Structural success `0.092791`, D3 top-set `0.307209`, D3 median consistency `0.597043`, and unique-worst `0.230314` do not satisfy the frozen decision rule.

### C04 — NOT-CONFIRMED （日本語の要点）

Structural success `0.414161`, D3 top-set `0.315228`, D3 median consistency `0.558681`, and unique-worst `0.195926` do not satisfy the frozen decision rule.

No result is rescued by extra seeds, paired-definition substitution, subset selection, threshold change, endpoint change, depth selection, candidate merging, or renaming.

## Numerical audit （日本語の要点）

The Stage 2 result-core SHA-256 was independently recomputed from the final artifact and matched exactly.

Independent exact-binomial recalculation reproduced the endpoint p-values within numerical precision. For `C03:structuralSuccess`, the exact probability is approximately `5.79 × 10^-328`, below IEEE-754 double range; the stored `0` therefore reflects representational underflow after a scientifically valid log-space computation and cannot change the decision.

## Interpretation boundary （適用範囲と制限）

C03 may now be described only as a **machine-reproducible transferable tactical motif under the frozen Study 1 operationalization**.

Study 1 does not establish:

- traditional/expert-recognized tesuji status;
- human strategic importance;
- beginner importance;
- pedagogical value;
- causal benefit outside the frozen formal construct;
- external validity across other Bao rule implementations, engines, evaluators, or search instruments.

These require separate prospective studies.

## Canonical closure documents （結論）

- `STUDY_1_OVERVIEW.md` — 初見向け成果概要
- `STUDY_1_FINAL_REPORT.md` — Study 1 scientific integration
- `STAGE_2_FORMAL_RESULT.md` — canonical Stage 2 formal result
- `REPRODUCIBILITY_INDEX.md` — hash / artifact / tooling index
- `checkpoints/2026-08-15-stage2-formal-completion.md` — closure checkpoint
- `DECISION_REGISTER.md` — immutable scientific decisions

## Closure rule （結論）

This study is closed. Any replication, human/expert validation, external-validity study, pedagogical study, or alternative motif formalization must be a new prospective independent study using a separately frozen contract. The final decisions above are immutable historical results.
