# CURRENT_STATUS — Symmetry / Isomorphic Positions Study 1 （日本語の要点）

## 日本語での要点

Study-level closureはNON-ESTIMABLEで、validated 0、rejected 0、non-estimable 5である。

この文書に残る英語の説明は、closure時に固定したrepository / execution provenanceの原文である。canonical token、数値、hash、authorizationを変えずに保持しており、現在向けの説明は`README.md`と`STUDY_1_OVERVIEW.md`を優先する。

Updated: 2026-08-24

## Scientific status （日本語の要点）

**COMPLETED — formal result `NON-ESTIMABLE`; 0 formally validated transforms.**

> **Closure provenance clarification:** the executed Stage 1 v1 candidate-decision run was technically invalidated after the IDENTITY positive control exposed an exact-oracle reconstruction defect. Its fresh zero-mismatch observations are retained only as reproducible diagnostics. A corrected v2 path was drafted, but v2 was not authorized or executed. The canonical `NON-ESTIMABLE` result is therefore a **Study-level closure decision because no valid formal candidate-decision run was completed**, not a candidate validation or rejection.


The v1 candidate-decision execution used frozen candidate, domain, source-hash and authorization contracts, but was technically invalidated when the mandatory immutable Restricted Endgame 8-state oracle reconstruction failed the IDENTITY positive control. Production/independent fresh bounded-local diagnostics both observed exact zero mismatch, while the oracle path disagreed. No corrected v2 formal contract was completed or authorized. The Study therefore closes all five preregistered outcomes as `NON-ESTIMABLE` without a valid candidate-level pass/fail decision.

```text
VALIDATED-BOUNDED-ISOMORPHISM = 0
NOT-VALIDATED                  = 0
NON-ESTIMABLE                  = 5
```

The invalidated-v1 fresh zero-mismatch evidence is preserved as bounded diagnostic evidence only and is not promoted to formal validation.

## Source identity recovered at study start （識別と表現）

```text
repository = nkkmd/bao-la-kiswahili-game
main HEAD = f2edfe27f4e22198e28525b0ac09f6dd4834c488
public/engine.js blob = 2f7885fa1ae38ddef5f14bbe2fecd4ca4fb84c7c
Restricted Endgame canonical result blob = 811eb78806813d236dc91c776e1e408d4feac22e
historical transform-candidates.js blob = a9117f46643fc79fc3352771d684c4ac9f7a01f6
```

The upstream Restricted Endgame Study 1 remains immutable and retains formal decision `EXACT-SOLVED-WITHIN-FROZEN-DOMAIN`. This Study does not revise its raw state count, hashes, solution, or interpretation boundary.

## Frozen candidate set （日本語の要点）

Scientific candidates:

- `SIP-T01-SEAT-SWAP-LOCAL`
- `SIP-T02-LR-MTAJI-HOUSELESS`
- `SIP-T03-SEAT-SWAP-LR-MTAJI-HOUSELESS`

Controls:

- `SIP-C00-IDENTITY`
- `SIP-C01-LR-NO-DIRECTION-FLIP`

Candidate semantics were frozen before formal reachable-corpus outcomes. No post-outcome transform repair, failed-state/phase exclusion, root/depth shrinkage, or candidate rescue was performed.

## Frozen Stage 1 population （Stageの記録）

```text
formal seed block      = 22910001..22910064
maximum trajectory ply = 120
roots per stratum      = 8
local expansion depth  = 3
strata                  = namua / mtaji / mtaji-houseless
```

Domain materialization had shortage 0, witness replay failure 0, and trajectory runtime guard hit 0.

## Fresh bounded-local evidence （証拠と成果物）

| Outcome | Roots | States | Edges | Tested states | Mismatches |
| --- | ---: | ---: | ---: | ---: | ---: |
| T01 / Namua | 8 | 697 | 707 | 167 | 0 |
| T01 / Mtaji | 8 | 530 | 527 | 162 | 0 |
| T01 / Namua+Mtaji | 16 | 1227 | 1234 | 329 | 0 |
| T02 / Mtaji-houseless | 8 | 532 | 529 | 160 | 0 |
| T03 / Mtaji-houseless | 8 | 532 | 529 | 160 | 0 |

The negative control produced 638 independent fresh mismatches; the identity control produced zero fresh mismatches.

## Mandatory oracle-anchor limitation （限界）

The identity positive control failed the immutable 8-state oracle integration. Production counted 19 oracle mismatches; the independent implementation counted 10, so `G12` failed.

A post-outcome read-only diagnostic found:

```text
oracle stateRows                    = 8
stored stateKey mismatch rows       = 3
production/independent key disagreement = 0
seed totals observed                = 63, 64
recomputed legal transitions        = 7
successor escapes stored key set    = 0
```

The three mismatching rows are terminal rows whose stored `stateKey` does not equal the hash recomputed from the stored `ruleState`. This is recorded only as a limitation of using that immutable artifact as this Study's transform anchor; it does not alter the upstream Study.

## Reproducibility identities （再現性）

```text
specSha256 = ede4968d7702ffded73233cf05cbe10c94c4d3a1cb04ef850f85c727b56d2b0a
authorizationSha256 = a539de44b26e513ab461a559e97ee4e7914900178a469389a5c996def3d7f5a4
domainSha256 = fa40e1b7d2fc5e34291ec9537e8a5f19b280be8203d62ca8687090dc96ff9e22
productionResultSha256 = fd1c509b40a3ea40675e738826db8cb4030378ed8955f122594a6f5e4756574a
independentVerificationSha256 = 8e7327b4192e2616716d34deae86b15a51f269201f591a843310d414541596f0
archive workflow run = 32728925376
oracle diagnostic workflow run = 32728619101
```

## Downstream authorization （日本語の要点）

```text
validated transformation set = empty
canonicalization = NOT AUTHORIZED
symmetry-group claim = NOT AUTHORIZED
symmetry-reduced state counting = NOT AUTHORIZED
State Space Study raw identity = AUTHORIZED
use T01/T02/T03 for state reduction = NOT AUTHORIZED
```

## Canonical conclusion documents （結論）

- [`STUDY_1_OVERVIEW.md`](STUDY_1_OVERVIEW.md)
- [`STUDY_1_FINAL_REPORT.md`](STUDY_1_FINAL_REPORT.md)
- [`results/STAGE_1_FORMAL_RESULT.json`](results/STAGE_1_FORMAL_RESULT.json)
- [`results/STAGE_1_PRODUCTION_RESULT.json`](results/STAGE_1_PRODUCTION_RESULT.json)
- [`results/STAGE_1_INDEPENDENT_VERIFICATION.json`](results/STAGE_1_INDEPENDENT_VERIFICATION.json)

No further scientific outcome generation is authorized within Study 1.
