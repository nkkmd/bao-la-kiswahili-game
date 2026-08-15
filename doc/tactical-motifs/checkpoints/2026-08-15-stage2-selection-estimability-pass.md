# Stage 2 formal candidate-specific selection — estimability preview acceptance

Date: 2026-08-15

Stage ID: `TM-S2-FORMAL-2026-08-14-v1`

## Gate accepted

Candidate-specific selection has completed under the already frozen, outcome/value/consequence-blind root-selection rule. All four canonical candidates satisfy every preregistered estimability / transferability preview gate. Formal measurement is therefore authorized.

This gate does not inspect or decide any candidate consequence-success rate, D1/D2/D3 endpoint rate, p-value, Holm-adjusted result, or formal candidate decision.

## Frozen identity

- spec SHA-256: `83ad5916b2f70846b493d9a4a87191c4a9d4bf667e27dcc624d4fe04014838d8`
- candidate-definition SHA-256: `667f4645fb7c0c704b1d3e49a1d7caefca54de2b9df2ddf0e542f7241aeb81e8`
- generated games: `3072`
- unique historical trajectories in corpus: `2736`
- candidate count: `4`
- top-level replacement performed: `false`
- selection integrity passed: `true`
- top-level selection hash: `81a8d3a44f5ded622e953633d255f57ac63db41cc82a8bca76f28d2c10b84722`
- local selection-audit file SHA-256: `2ecef7ed76b15fac756a769fe94cb2852b33a5a9cf62488dbb3068dbf91f2037`

## Candidate selection audit

### TM-S2-C01 — Mtaji

- canonical candidate key: `23e3dbe362049a6e220fa2aa74b6f9364b8277cadc4f329e8181b483cf03fe38`
- eligible historical trajectories: `1607`
- selected before rule-state collapse: `1607`
- duplicate selected rule states collapsed: `10`
- selected unique historical trajectories / rule states: `1597`
- distinct opening prefixes: `1373`
- maximum single opening-prefix share: `0.003757044458359424`
- generation strata represented: `6`
- maximum single generation-stratum share: `0.19160926737633063`
- replacement performed: `false`
- candidate selection hash: `58b1c226334181f8feb26c8f9ae257dd724b0fe8aea1a74bb4bfa2defce58c62`
- estimable preview: `true`

### TM-S2-C02 — Namua

- canonical candidate key: `76dacf8980eeecec8af798b19fb3e87d23665a67bffaf555fb05cec5dea5c852`
- eligible historical trajectories: `2712`
- selected before rule-state collapse: `2712`
- duplicate selected rule states collapsed: `7`
- selected unique historical trajectories / rule states: `2705`
- distinct opening prefixes: `2192`
- maximum single opening-prefix share: `0.0022181146025878`
- generation strata represented: `6`
- maximum single generation-stratum share: `0.16968576709796673`
- replacement performed: `false`
- candidate selection hash: `706e8aaa6c0931d2443a1a8de88fc82d0c648e52734e6286408352a4f7a019cc`
- estimable preview: `true`

### TM-S2-C03 — Mtaji

- canonical candidate key: `7a9ebacdc74234cf206b59696a92551b3e15f5e97336ef09a16e1efbf0042eba`
- eligible historical trajectories: `1282`
- selected before rule-state collapse: `1282`
- duplicate selected rule states collapsed: `10`
- selected unique historical trajectories / rule states: `1272`
- distinct opening prefixes: `1121`
- maximum single opening-prefix share: `0.0031446540880503146`
- generation strata represented: `6`
- maximum single generation-stratum share: `0.1957547169811321`
- replacement performed: `false`
- candidate selection hash: `dc84a5a2c8750670faa2cb452d6d305b35fbf22119304ae1eda71807dccd001f`
- estimable preview: `true`

### TM-S2-C04 — Namua

- canonical candidate key: `8a2c28eaefd59c83d6a7983b3f7c6b36c80f677b08ab6d2af65203e6af0c8755`
- eligible historical trajectories: `1097`
- selected before rule-state collapse: `1097`
- duplicate selected rule states collapsed: `66`
- selected unique historical trajectories / rule states: `1031`
- distinct opening prefixes: `891`
- maximum single opening-prefix share: `0.004849660523763337`
- generation strata represented: `6`
- maximum single generation-stratum share: `0.21532492725509214`
- replacement performed: `false`
- candidate selection hash: `15a57fd0b250639ff88cd6199162575a675cd8039ce7fc540c3a738e86592ad3`
- estimable preview: `true`

## Frozen gate audit

Required per candidate:

- unique historical trajectories `>= 96`
- unique rule states `>= 96`
- distinct opening prefixes `>= 48`
- maximum single opening-prefix share `<= 0.10`
- generation strata represented `>= 4`
- maximum single generation-stratum share `<= 0.50`

All six gates are `true` for all four canonical candidates.

The smallest selected set is C04 with `1031` unique historical trajectories / rule states, which exceeds the frozen minimum by `935`. C04 also has `891` distinct opening prefixes and all six generation strata. Its maximum single opening-prefix share is approximately `0.00485`, and its maximum single stratum share is approximately `0.2153`; both are well within the frozen domination limits.

## Decision

**TM-S2-F02 candidate-specific selection / estimability-preview gate: PASS.**

Formal measurement may proceed on exactly these frozen selected roots. No extension, replacement, candidate substitution, paired-definition promotion, or root reselection is authorized.

The audit note is preserved: the prospective estimability preview does not itself authorize corpus extension and does not replace the final formal estimability assessment in evaluation.

## Still blocked

Formal evaluation remains blocked until measurement integrity is accepted.

## Next operation

```bash
node tools/experiments/run-tactical-motif-stage2-formal.js \
  --phase measure \
  2>&1 | tee /tmp/tm-stage2-measure.log
```

After measurement, inspect `artifacts/local/tactical-motifs/stage2-formal-v1/measurement-manifest.json` before executing `--phase evaluate`.
