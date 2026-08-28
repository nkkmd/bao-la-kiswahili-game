# SRDR-STUDY1 — Current Status

更新日: 2026-08-28

## Status

**STUDY COMPLETE / STAGE 0 PASS / STAGE 1 PROFILE-FROZEN-DEVELOPMENT / STAGE 2 COMPLETE / FORMAL DECISION `INCONCLUSIVE` / SCIENTIFIC CLOSURE COMPLETE / INTEGRATED IN `main`**

## Identity

```text
Program = G2-02
Study ID = SRDR-STUDY1
Research Generation = Research Generation 2
Formal title = Search Reliability / Decision Robustness Study 1
Baseline main = db6980bffb7e6853751914da628db8936c76d81e
Research branch = research/g2-02-search-reliability-decision-robustness
Stage 2 source-freeze commit = e176cafc15d2dde7b8767de6961959bb7ee9bb7b
Stage 2 authorization commit = bec87d54540c96c24353f2eeadc25338c53e54eb
Scientific closure head = f6814e4e828ea07ec309f6f7352c825494d8ff20
Integration PR = #68
Integration merge commit = ee5f0a5e769516d635fe8b70e42244a8dc8d9b34
```

## Stage decisions

```text
Stage 0 = SRDR-S0-TECHNICAL-2026-08-27-v1 = PASS
Stage 1 = SRDR-S1-DEVELOPMENT-2026-08-27-v1 = PROFILE-FROZEN-DEVELOPMENT
Stage 2 = SRDR-S2-FORMAL-2026-08-27-v1 = COMPLETE / INCONCLUSIVE
Study formal decision = INCONCLUSIVE
Repository integration = COMPLETE / main
```

## Stage 2 reason

Independent verification passed with zero replay / selection / measurement mismatches and exact selection/measurement hash equality. The sole failed preregistered gate was:

```text
unique historical trajectories after Stage 1 firewall = 1040
required = 1050
shortfall = 10
```

Therefore `primaryFormalCriterion = null`. No seed extension, replacement or threshold relaxation is authorized.

## Canonical provenance

```text
workflow run = 33124538584
artifact ID = 9672561139
artifact ZIP SHA-256 = c107773d7f7a7cd9ba05a875305486738e10268435730283d6aa46cb5340e47a
canonical result hash = 7386f3efed01ba325bc3f03ed02e9cfc2d72ad48c356509987b5fcc8780f7d36
```

## Main integration provenance

```text
integration PR = #68
merged research head = f6814e4e828ea07ec309f6f7352c825494d8ff20
merge commit = ee5f0a5e769516d635fe8b70e42244a8dc8d9b34
integration date = 2026-08-28
formal decision unchanged = INCONCLUSIVE
primaryFormalCriterion unchanged = null
scientific result changed by integration = false
```

Before merge, the branch was `66` commits ahead and `0` behind `main`, had no unresolved review threads, and all five normal PR workflows were green. The idempotent G2-02 closure finalization workflow also passed against the immutable Stage 2 artifact.

## Immutable boundaries

`PEOCR-STUDY1 = INCONCLUSIVE` and Position Complexity / Difficulty Study 1 remain unchanged. G2-02 does not establish game-theoretic best moves, human difficulty, engine correctness or public-AI strength. Higher-resource search remains a frozen reference only.

## Next

`SRDR-STUDY1` is scientifically closed and integrated into `main`. No further G2-02 scientific generation is authorized. Any re-test of formal search-reliability confirmation requires a new prospective Study/version and fresh evidence.