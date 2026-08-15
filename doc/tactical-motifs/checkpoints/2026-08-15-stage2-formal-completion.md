# Stage 2 Formal Completion — Tactical Motifs / Tesuji Study 1

Date: 2026-08-15

Stage ID: `TM-S2-FORMAL-2026-08-14-v1`

## Gate accepted

The preregistered Stage 2 formal evaluation has completed and has been independently audited against the frozen spec, candidate definition, selection identity, measurement identity, exact-binomial tests, Holm-Bonferroni family, consistency gates, estimability gates, result-core hash, and source provenance.

**Stage 2 formal evaluation: ACCEPTED / COMPLETE.**

## Final candidate decisions

```text
TM-S2-C01 = NOT-CONFIRMED
TM-S2-C02 = NOT-CONFIRMED
TM-S2-C03 = CONFIRMED
TM-S2-C04 = NOT-CONFIRMED
```

Confirmed count: `1 / 4`.

No candidate was non-estimable or technically inconclusive.

## Result identity

- spec SHA-256: `83ad5916b2f70846b493d9a4a87191c4a9d4bf667e27dcc624d4fe04014838d8`
- candidate-definition SHA-256: `667f4645fb7c0c704b1d3e49a1d7caefca54de2b9df2ddf0e542f7241aeb81e8`
- selection hash: `81a8d3a44f5ded622e953633d255f57ac63db41cc82a8bca76f28d2c10b84722`
- measurement hash: `c912d0eb5e0d2a5957163b0bd1a17e85e4756ef693d1b3aef545aad65aaed2c9`
- result-core hash: `62719429fcca9de8b99309e2b8542a237184a91c29863db23d5aa8c0f4ad6748`
- uploaded/local result artifact SHA-256: `f13f5a87464a5c8b360695977edc5fca4348f438fbf20c4bd5be682ed80d4dd4`
- evaluated at: `2026-08-15T08:05:53.965Z`
- evaluation source commit: `d41b061067ab2e5dbe65294d3860586d9d3c1454`
- source tree dirty: `false`

The stored result-core hash was independently recomputed and matched exactly.

## Multiplicity audit

Exactly eight planned co-primary tests were retained in the Holm-Bonferroni family at FWER 0.05. No endpoint was removed and no p-value was substituted for non-estimability.

Rejected endpoints after Holm adjustment:

- `TM-S2-C01:structuralSuccess`
- `TM-S2-C03:structuralSuccess`
- `TM-S2-C03:tacticalValueSuccess`

Only C03 had both required co-primary endpoints rejected and both observed rates at or above 0.60.

## C03 formal gate audit

```text
n = 1272
estimable = true
structural success = 1245 / 1272 = 0.978774
D3 top set = 937 / 1272 = 0.736635
D3 at-or-above median = 1106 / 1272 = 0.869497
D3 unique worst = 90 / 1272 = 0.070755
```

Every estimability, co-primary, multiplicity, observed-rate, and consistency gate passes.

The structural exact-binomial p-value is below double-precision range; independent high-precision recomputation gives approximately `5.79e-328`. This numerical representation issue cannot alter the decision.

## Negative-result retention

C01, C02, and C04 remain `NOT-CONFIRMED`. No additional seeds, replacement roots, paired-definition substitution, post-hoc candidate merging, alternative endpoint, threshold relaxation, or depth selection is allowed.

## Interpretation boundary

C03 is confirmed only as a **machine-reproducible transferable tactical motif under the frozen Bao engine/search operationalization**.

This completion does not authorize traditional/expert recognition, human importance, pedagogical importance, or generalization beyond the frozen rules and search instrument.

## Study closure

With this checkpoint, Tactical Motifs / Tesuji Study 1 is scientifically complete. Future replication, external-validity work, or human/expert validation must be a new prospective independent study and must preserve all decisions recorded here.
