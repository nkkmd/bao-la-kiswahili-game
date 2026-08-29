# G2-08 / MDFT-STUDY1 — Final Closure Audit

Date: 2026-08-30

## Canonical closure

```text
Program = G2-08
Study = MDFT-STUDY1
Stage 0 = STAGE0-TECHNICAL-PASS
Stage 1 = STAGE1-DEVELOPMENT-BLOCKED-NON-ESTIMABLE
Study formal decision = NON-ESTIMABLE
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
```

Stage 1 seeds `28910001..28914096` are permanently `CONSUMED`. Same-block rerun, repair, replacement and extension remain not authorized.

Stage 2 seeds `29010001..29018192` remain `RESERVED / UNCONSUMED`.

## Stage 1 technical integrity

Authorized scientific run:

```text
run = 33277102013
execution HEAD = dfb9bf316dc767ae5920aba5a3308aa5f05d3acf
actions artifact = 9722157483
artifact ZIP SHA-256 = bb34d16874175dcb581ad8725983a3ed4778687c0f3a2965ae929daaffbfe921
```

Production and independent implementations matched exactly:

```text
development core SHA-256 = f7e4e962f0a0c44e2466ed3d52b28c8c98b2a6e4aa0ee8c29b329c9afa5e305c
full production shard SHA-256 = 21d55192d45a9b568d7cae01a367e20e39159bb8c7332683137863a926774830
full independent shard SHA-256 = 21d55192d45a9b568d7cae01a367e20e39159bb8c7332683137863a926774830
```

Mandatory artifact preservation and frozen resource ceilings passed. The closure is therefore scientific non-estimability, not technical invalidity or resource censoring.

## Scientific closure reason

Fresh Stage 1 generated 4,096 games, 4,068 unique trajectories and 512 selected roots (Namua/Mtaji 256/256). Two frozen global readiness gates failed:

```text
distinct opening prefixes = 2836 < 3000
maximum single source-policy share = LOW_CAPTURE 170/512 = 0.33203125 > 0.32
```

Leaf-level promotion calculations were true for F01/F02/F03/F05/F06/F10, false for F04/F07/F08, while F09 had been excluded prospectively as technically ineligible. Global readiness failure prevents all six true leaf calculations from becoming a frozen taxonomy or Stage 2 formal targets.

## Documentation audit

The following closure surfaces are synchronized:

- `README.md`
- `doc/RESEARCH_INDEX.md`
- `doc/FUTURE_RESEARCH_AGENDA.md`
- `doc/machine-decision-failure-taxonomy/README.md`
- `STUDY_1_OVERVIEW.md`
- `STUDY_1_FINAL_REPORT.md`
- `CURRENT_STATUS.md`
- `DECISION_REGISTER.md`
- `REPRODUCIBILITY_INDEX.md`
- `RESEARCH_LOG.md`
- `RESUME_HERE.md`
- canonical Stage 0/Stage 1 result and artifact-manifest files

Current-facing sequencing now records G2-08 as completed and G2-09 as the next unstarted machine-only agenda item.

## Repository-scope audit

Remote `main` was re-read immediately before integration audit:

```text
main HEAD = cb660e166460e0f19d4ba16d5283fa880d55757f
research branch audited HEAD = 208468184864934042bca4a08730917ab4a3f704
merge base = cb660e166460e0f19d4ba16d5283fa880d55757f
ahead = 52
behind = 0
```

The branch changes only research documentation, research experiment tools/workflows, and localized central-document registration. No `public/` gameplay or AI implementation file is modified. No AI-engineering program file is modified.

## Immutable boundaries checked

- G2-03 validated transform set remains empty.
- G2-07 formal technical-invalid closure is unchanged.
- BMP Study 1 remains 0 `CONFIRMED` / 4 `NOT-CONFIRMED`.
- TM-S2-C03 remains `CONFIRMED`; C01/C02/C04 remain `NOT-CONFIRMED`.
- G2-08 F09 historical-classifier non-reconstructibility does not revise Position Typology Study 1.
- Higher-resource search is not promoted to game-theoretic truth.
- Human claims remain unauthorized.

## Audit disposition

```text
STUDY-CLOSURE-AUDIT-PASS
READY-FOR-PR-REVIEW
DIRECT-MAIN-WRITE = NOT PERFORMED
```
