# Continuous Local-Geometry Representation Study 1

Research Generation 3 `G3-09` / `CLGR-STUDY1` の研究ディレクトリ。

Current lifecycle status:

**`PROSPECTIVE-FROZEN / STAGE-0-ONLY / FRESH-STAGE-1-NOT-AUTHORIZED`**

## Formal Study identity

- Study ID: `CLGR-STUDY1`
- English title: **Continuous Local-Geometry Representation Study 1 — Prospective construction and fresh-holdout eligibility validation of an exact multiaxial bounded RAW local game-tree geometry representation in Bao**
- 日本語正式題目: **Baoにおける局所ゲーム木幾何の連続多軸表現のprospective構築とfresh holdout eligibility検証 — bounded RAW depth-5 exact geometryを離散candidateへ早期縮約しない再現可能representationの確立**
- Program position: Research Generation 3 / `G3-09`
- Reviewed baseline main: `6c218b9cc3f492fb96d051768702682fef9bb66a`
- Research branch: `research/g3-09-continuous-local-geometry-representation`

## Authorization boundary

Post-G3-08 current-state review concluded:

**`G3-09-AUTHORIZED`**

This permits Study/preregistration freeze and technical-only Stage 0. It does not authorize fresh Stage 1.

G3-08 partial Stage 1 trajectory measurements are prohibited as G3-09 scientific evidence. The G3-08 `relay-limit enumeration` failure is technical design information only.

## Measurement foundation

```text
LGTGMIV-STUDY1 = CLOSED / FORMAL-ELIGIBLE-ALL
eligible families = F1,F2,F3,F4,F5
representation = RAW-ONLY
relative local horizon = 5
validated transform set = []
state identity = pits,reserve,houseOwned,player,phase,winner,pending
move identity = type,phase,row,index,direction,side,houseChoice,houseTwo
```

## Frozen primary representation

`CLGR-R1-EXACT-SQUASHED-L1` is the only primary representation family.

It preserves six prospectively fixed exact geometry axes:

1. `CLGR-A1-ROOT-LEGAL-WIDTH`
2. `CLGR-A2-CUMULATIVE-TREE-OCCURRENCE`
3. `CLGR-A3-CUMULATIVE-DISTINCT-RAW-STATES`
4. `CLGR-A4-CUMULATIVE-TREE-RAW-RATIO`
5. `CLGR-A5-DUPLICATE-TRANSITION-FRACTION`
6. `CLGR-A6-UNIT-WIDTH-OCCUPANCY-FRACTION`

For any nonnegative exact rational `q=n/d`, the coordinate transform is fixed as `q/(1+q)=n/(n+d)` in reduced rational form. Integers use `d=1`. No centering, z-scoring, phase-specific standardization, learned weighting, PCA, spectral embedding, clustering or post-development feature selection is allowed.

Distance is equal-weight exact L1 across the six transformed coordinates.

## Stage structure

- `CLGR-S0-TECHNICAL-2026-09-03-v1` — technical-only validation; authorized
- `CLGR-S1-DEVELOPMENT-2026-09-03-v1` — fresh development; **not authorized** until separate post-Stage-0 review
- `CLGR-S2-FORMAL-2026-09-03-v1` — fresh formal holdout; **not authorized** until valid Stage 1 completion and separate Stage 2 review

## Protected evidence

Standard initial RAW-root complete exact depth-10 holdout remains:

**`SEALED / NOT GENERATED / NOT READ / NOT PEEKED`**

It is not required by this Study and may not be partially generated, probed or resource-tested.

## Main integration boundary

Main integration is prohibited until explicit user instruction after scientific closure and final repository/document consistency audit.

## Read next

- `STUDY_1_PROTOCOL.md`
- `prereg/STUDY_1_SPEC.json`
- `CURRENT_STATUS.md`
- `DECISION_REGISTER.md`
- `REPRODUCIBILITY_INDEX.md`
