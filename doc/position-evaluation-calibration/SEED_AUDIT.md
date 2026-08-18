# Seed Audit — Position Evaluation / Win-Rate Calibration Study 1

Updated: 2026-08-18
Status: **OPEN — NEW STUDY SEED BLOCK NOT YET FROZEN**

## Rule

A new Stage 1/Stage 2 seed block may be frozen only after a repository-wide historical seed inventory is closed. Absence from a short hand-maintained list is not sufficient evidence of non-overlap.

No scientific generation is authorized while this audit is open.

## Documented research seed history restored so far

The following blocks are explicitly documented in canonical study records or frozen configs reviewed at initiation.

### Phase Transition Study 1

```text
exploratory pilot / pilot-v2 = 20260721..20260820
E-010 confirmation          = 20261001..20261200
E-011 shared                = 20262001..20262400
E-017 independent           = 20263001..20264000
E-018 shared                = 20265001..20267000
E-019 D1                    = 20268001..20274500
E-019 D3                    = 20268001..20272500
E-019 V2                    = 20268001..20270000
E-020 independent D3        = 20275001..20279500
```

E-019 deliberately uses nested prefix ranges across its three strata. These are one historical occupied seed namespace for the present non-overlap audit, not three disjoint ranges.

Sources include `doc/phase-transition/EXPERIMENT_INDEX.md` and `config/experiments/phase-transition-confirmation-v1.json`.

### Position Typology / Playing Style Study 1

```text
Stage 1 discovery base seed = 20270001
Stage 2 Mtaji confirmation  = 20310001..20310192
Stage 5 style confirmation  = 20350001..20350192
```

The Stage 1 base-seed mapping must still be expanded to its exact generated seed set by the repository-wide machine inventory before closure.

### Namua→Mtaji Strategic Temporal Transition Study 1

```text
Stage 1 primary paired openings = 20271001..20271032
Stage 1 extension #1            = 20272001..20272384
Stage 1 final extension         = 20273001..20273768
Stage 2 formal                  = 20280001..20284096
```

The Stage 1 extensions are documented in the final report and were exploratory/consumed before Stage 2.

### Position Complexity / Difficulty Study 1

```text
Stage 1 exploratory = 20400001..20400768
Stage 2 formal      = 20410001..20411024
```

### Tactical Motifs / Tesuji Study 1

```text
Stage 1 exploratory = 21900001..21900768
Stage 2 formal      = 22000001..22003072
```

### Tactical Motif Human / Expert Validation Study 1

```text
Stage 1 machine stimulus = 22100001..22101536
```

### First-player / AI benchmark / joseki / engine-development experiments

These older studies and engineering experiments contain numeric singleton seeds, opening-seed sets, and symbolic MCTS seeds in committed scripts/artifacts. Examples already observed during the audit include historical benchmark/engineering seeds in the `2026xxxx` namespace and joseki symbolic seeds such as `mcts-s1`, `mcts-s2`, `mcts-s3`.

They remain part of the inventory requirement even when they were not confirmatory scientific seed blocks. They must not be silently ignored when selecting the new Study 1 seed namespace.

## Important overlap observation

Historical studies did not always reserve globally disjoint numeric namespaces. For example, some later-study seed values lie numerically inside an earlier study's broader range while using different experimental generators/configurations.

Therefore the present firewall is deliberately stricter:

> the new calibration study will not reuse any numeric seed that appears in the normalized union of prior tracked seed usage, regardless of whether the historical generator/configuration differed.

## New-study allocation

```text
Stage 1 seed block = UNASSIGNED
Stage 2 seed block = UNASSIGNED
```

Candidate ranges may be discussed only after the exact repository scan. No candidate range is reserved by this document.

## Closure requirements

Before seed allocation:

1. scan tracked research docs, preregistrations, scripts and committed artifacts for seed-bearing fields/CLI defaults;
2. normalize singleton seeds and inclusive ranges;
3. distinguish exact research/engineering seed use from incidental numeric text;
4. record source path and study/stage for every used range/set;
5. detect and preserve historical overlaps rather than deduplicating away provenance;
6. form the union of all prior numeric seed use relevant to reproducible generators;
7. choose fresh Stage 1 and Stage 2 blocks outside that union;
8. freeze them in a machine-readable preregistration;
9. independently verify non-overlap before generation authorization.
