# Stage 2 formal measurement — integrity acceptance

Date: 2026-08-15

Stage ID: `TM-S2-FORMAL-2026-08-14-v1`

## Gate accepted

The preregistered Stage 2 formal measurement phase completed on exactly the frozen candidate-specific selected sets. The compact `measurement-manifest.json` was inspected before formal evaluation.

No endpoint rate, exact-binomial p-value, Holm-adjusted p-value, consistency-gate result, or formal candidate decision was used to alter the design at this gate.

## Frozen identity

- spec SHA-256: `83ad5916b2f70846b493d9a4a87191c4a9d4bf667e27dcc624d4fe04014838d8`
- candidate-definition SHA-256: `667f4645fb7c0c704b1d3e49a1d7caefca54de2b9df2ddf0e542f7241aeb81e8`
- selection hash: `81a8d3a44f5ded622e953633d255f57ac63db41cc82a8bca76f28d2c10b84722`

All three identities match the frozen Stage 2 contract and the previously accepted selection audit.

## Measurement counts

| candidate | frozen selected unique states | completed measurements | match |
| --- | ---: | ---: | --- |
| `TM-S2-C01` | 1597 | 1597 | yes |
| `TM-S2-C02` | 2705 | 2705 | yes |
| `TM-S2-C03` | 1272 | 1272 | yes |
| `TM-S2-C04` | 1031 | 1031 | yes |

Total formal measurements: `6605`.

There is no reselection, supplementation, or candidate-specific replacement implied by the measurement counts.

## Measurement identity

Candidate-specific measurement hashes:

- `TM-S2-C01`: `3e66255a70116f37c75f6b299fd29faa7051595356e84ae9b94ca99ee63eb033`
- `TM-S2-C02`: `07ed4a22a9617658a973549088c729017ddb6541e4b8b8f2c40628ab423ab3c9`
- `TM-S2-C03`: `f9053e48840f3b6b72393f7fd560009b3d5f06c376319083786779ad3e63b1ba`
- `TM-S2-C04`: `01928aee253c664add28a40a11cbb15ca4d57ea74452ccc68a7a20a1d4820caf`

Overall measurement hash:

`c912d0eb5e0d2a5957163b0bd1a17e85e4756ef693d1b3aef545aad65aaed2c9`

`measurementIntegrityPassed = true`.

## Provenance

- source commit: `e6f5e9528d523e7710a953020b1719abf60a26e8`
- source tree dirty: `false`
- Node: `v24.6.0`
- platform: `linux / x64`

The manifest reports the same authorization-bound SHA-256 values for engine, AI, search instrumentation, Stage 2 formal/corpus helpers, validator, runner, verifier, evaluator, candidate definition, and formal spec. The documentation commits after scientific-source validation did not alter those bound scientific files.

## Decision

**TM-S2-F03 measurement-integrity gate: PASS.**

The frozen evaluation firewall is satisfied:

```text
measurementIntegrityPassed == true
completedMeasurementsByCandidate == frozen selectedUniqueRuleStates
selectionHash == previously accepted selection hash
scientific source hashes == authorization-bound mapping
sourceTreeDirty == false
```

Therefore formal `evaluate` is now authorized.

## Formal evaluation remains frozen

Evaluation must use exactly the preregistered rules:

- four canonical formal candidates;
- two co-primary binary endpoints per candidate;
- H0 `p <= 0.50` / H1 `p > 0.50`;
- exact one-sided binomial;
- observed endpoint rate `>= 0.60`;
- eight planned p-values adjusted by Holm-Bonferroni at FWER `0.05`;
- D3 at-or-above-median rate `>= 0.60`;
- D3 unique-worst rate `<= 0.15`;
- frozen estimability/transferability gates;
- no dropped endpoints, candidate substitution, favorable subset, threshold retuning, or rescue.

## Next operation

```bash
node tools/experiments/run-tactical-motif-stage2-formal.js \
  --phase evaluate \
  2>&1 | tee /tmp/tm-stage2-evaluate.log
```

After evaluation, inspect `artifacts/local/tactical-motifs/stage2-formal-v1/stage2-formal-result.json` before recording any final scientific interpretation.
