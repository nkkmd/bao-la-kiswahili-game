# Stage 2 formal corpus — full verification acceptance

Date: 2026-08-15

Stage ID: `TM-S2-FORMAL-2026-08-14-v1`

## Gate accepted

The fresh Stage 2 formal corpus has been generated under the active source-hash-bound authorization and independently replay/search verified. Candidate-specific selection is now authorized under the frozen Stage 2 contract.

No candidate consequence, search-value endpoint, formal success rate, p-value, or formal decision was inspected or used to alter the design at this gate.

## Frozen identity

- spec SHA-256: `83ad5916b2f70846b493d9a4a87191c4a9d4bf667e27dcc624d4fe04014838d8`
- candidate-definition SHA-256: `667f4645fb7c0c704b1d3e49a1d7caefca54de2b9df2ddf0e542f7241aeb81e8`
- authorization SHA-256: `43381afe4b219cd7653f6177982df697c0cb3e8f1874a4ac3d217930dfab1e51`
- source commit: `3082cd2132cdd572e43f5f78e8d662271a9ed492`
- source tree dirty: `false`

## Generation audit

- generated games: `3072`
- seed block: `22000001–22003072`
- condition counts:
  - `B-D1 = 512`
  - `B-D2 = 512`
  - `B-D3 = 512`
  - `LS-D2 = 512`
  - `V2-D2 = 512`
  - `LE-D2 = 512`
- unique historical trajectories: `2736`
- duplicate historical-trajectory groups: `239`
- largest duplicate group: `7`
- distinct opening prefixes: `2220`
- manifest summary hash: `e766078f6cd3e134d4bc03104712586a5d3d001d274e36be3552ef908a868f16`

The generated population exactly matches the preregistered 3,072-game, six-stratum, fresh-seed contract. No seed extension, replacement sampling, early stop, or outcome-dependent extension was performed.

## Independent verification

- `passed = true`
- `fullSearchRecomputation = true`
- `gamesVerified = 3072`
- unique historical trajectories: `2736`
- distinct opening prefixes: `2220`
- all six verified condition counts: `512`
- verification identity hash: `bec870b1bff4abe1d95b87a473e26b08343ada7c8f4b2ca1de44eb0473086c4d`

Manifest and verifier agree on trajectory count, opening-prefix count, stratum counts, source commit, clean-tree status, and the complete scientific source SHA-256 mapping.

## Decision

**TM-S2-F01 generation/full-verification gate: PASS.**

The frozen verification firewall is satisfied:

```text
verification.passed == true
fullSearchRecomputation == true
gamesVerified == 3072
```

Therefore candidate-specific `select` is authorized.

## Still blocked

Formal measurement and formal evaluation remain blocked until candidate-specific selection is executed and its identity/estimability audit is inspected.

No candidate may receive extra games or replacement roots if its frozen estimability/transferability gates are not met.

## Next operation

```bash
node tools/experiments/run-tactical-motif-stage2-formal.js \
  --phase select
```

After selection, inspect `selection-audit.json` before executing `--phase measure`.
