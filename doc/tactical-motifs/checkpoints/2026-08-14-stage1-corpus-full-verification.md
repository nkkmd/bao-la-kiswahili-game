# Stage 1 exploratory corpus — generation and full replay/search verification checkpoint

Date: 2026-08-14

Stage ID: `TM-S1-EXPLORATORY-2026-08-14-v1`

## Purpose

Record completion of the preregistered `generate → verify` integrity boundary before any state selection, motif measurement, candidate discovery, or scientific interpretation.

This checkpoint does not change the frozen Stage 1 scientific contract, candidate grammar, thresholds, seed block, phase assignment, matching/deduplication rules, or Stage 2 boundary.

## Frozen bindings

- spec SHA-256: `f2836ae6adb2278b70956242384945afda55c4ee209a2fefd0d0b4d553c2f76c`
- generation source commit: `6694714194eee2f536e90b4411566d9126e162ae`
- manifest authorization SHA-256: `9df06af5c330a529c7d4b33fbd3fa885a084fd1797d425a20d4ce620b6328f9a`
- source tree dirty: `false`

## Generation result

The exact preregistered corpus completed:

- games: 768
- seeds: `21900001–21900768`
- `B-D1`: 128
- `B-D2`: 128
- `B-D3`: 128
- `LS-D2`: 128
- `V2-D2`: 128
- `LE-D2`: 128
- unique historical trajectories: 741
- duplicate historical-trajectory groups: 27
- largest historical-trajectory group: 2
- distinct opening-prefix identities: 681
- manifest summary hash: `7d11bae51a21b77ed91eb7ffe4098d6be3e7035a0480689616a72bd76b3eb96c`

The six generation strata are trajectory-diversification metadata only and do not reopen any prior formal search/evaluator comparison.

## Independent verification result

The independent verifier completed the required full fixed-seed replay and post-opening search recomputation for every game:

- `passed`: `true`
- `fullSearchRecomputation`: `true`
- games verified: 768
- unique historical trajectories: 741
- distinct opening prefixes: 681
- verification identity hash: `9584bba101e3cad37bcf2c05556f478ab6ca9cd3d16c923614bd0245a9a1f9ec`
- verifier source tree dirty: `false`

The manifest and verification artifacts report identical scientific source-file SHA-256 mappings, equal to the previously authorized frozen mapping.

## Integrity interpretation

This is a technical reproducibility milestone, not a motif finding.

No selected scientific root, motif measurement, candidate support count, D3 promotion statistic, candidate ranking, or candidate label has been inspected or generated at this checkpoint.

No seed extension, replacement sampling, threshold retuning, phase reassignment, opening-threshold relaxation, favorable subset selection, depth selection, failed-candidate renaming, or manual promotion occurred.

## Gate decision

The pre-frozen execution firewall permits the deterministic `select` phase because the required `verification.json` conditions are satisfied:

- `passed=true`
- `fullSearchRecomputation=true`

The next operation is therefore:

`node tools/experiments/run-tactical-motif-stage1-exploratory.js --phase select`

After selection, `selection-audit.json` must be inspected against every frozen readiness gate before measurement may begin.

Stage 2 generation remains not authorized. No `confirmed tesuji` claim is authorized.
