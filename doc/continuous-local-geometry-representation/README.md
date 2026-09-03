# Continuous Local-Geometry Representation Study 1

Research Generation 3 `G3-09` / `CLGR-STUDY1` の研究ディレクトリ。

Current lifecycle status:

**`CLOSED / TECHNICAL-INVALID`**
<!-- CLGR-G3-09-FINAL-AUDIT:README -->

Repository/document closure status: **`FINAL CONSISTENCY AUDIT PASS / RESEARCH BRANCH REVIEW-READY`** (`33754250314`).

## Formal Study identity

- Study ID: `CLGR-STUDY1`
- English title: **Continuous Local-Geometry Representation Study 1 — Prospective construction and fresh-holdout eligibility validation of an exact multiaxial bounded RAW local game-tree geometry representation in Bao**
- 日本語正式題目: **Baoにおける局所ゲーム木幾何の連続多軸表現のprospective構築とfresh holdout eligibility検証 — bounded RAW depth-5 exact geometryを離散candidateへ早期縮約しない再現可能representationの確立**
- Program position: Research Generation 3 / `G3-09`
- Reviewed baseline main: `6c218b9cc3f492fb96d051768702682fef9bb66a`
- Research branch: `research/g3-09-continuous-local-geometry-representation`

## Final decision

**`G3-09 / CLGR-STUDY1 = CLOSED / TECHNICAL-INVALID`**

Stage 1 development passed the prospectively frozen representation gates on 48 fresh roots. The separately authorized exactly-one Stage 2 formal holdout selected 72 roots but failed closed after 61 completed measurements because required depth-5 RAW enumeration raised a `relay-limit` error at Mtaji source seed `31920066`.

Therefore formal eligibility of the continuous representation was **not established**. The Stage 2 partial measurements are not a completed formal sample and are not reusable as positive, negative or null formal scientific evidence.

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

`CLGR-R1-EXACT-SQUASHED-L1` was the only primary representation family.

It retained six prospectively fixed exact geometry axes:

1. `CLGR-A1-ROOT-LEGAL-WIDTH`
2. `CLGR-A2-CUMULATIVE-TREE-OCCURRENCE`
3. `CLGR-A3-CUMULATIVE-DISTINCT-RAW-STATES`
4. `CLGR-A4-CUMULATIVE-TREE-RAW-RATIO`
5. `CLGR-A5-DUPLICATE-TRANSITION-FRACTION`
6. `CLGR-A6-UNIT-WIDTH-OCCUPANCY-FRACTION`

For any nonnegative exact rational `q=n/d`, the coordinate transform was fixed as `q/(1+q)=n/(n+d)` in reduced rational form. Integers use `d=1`. No centering, z-scoring, phase-specific standardization, learned weighting, PCA, spectral embedding, clustering or post-development feature selection was allowed.

Distance was equal-weight exact L1 across the six transformed coordinates.

## Stage record

- `CLGR-S0-TECHNICAL-2026-09-03-v1` — `TECHNICAL-INVALID`, pre-fresh, no rerun
- `CLGR-S0-TECHNICAL-2026-09-03-v2` — `STAGE0-PASS`
- `CLGR-S1-DEVELOPMENT-2026-09-03-v1` — `STAGE1-PASS`, exactly one fresh execution, 24 Namua + 24 Mtaji
- `CLGR-S2-FORMAL-2026-09-03-v1` — `TECHNICAL-INVALID`, exactly one fresh execution, 36 Namua + 36 Mtaji selected, 61 roots measured before fail-closed

Stage 1 canonical result SHA-256:

`1e63937dc5967276f68253c9efa819554b0ea3b346f471c04dea92cbd90dc529`

Stage 2 formal-result JSON SHA-256:

`11cee4ab7d2fbd1105f69ff1592b01a3ebd651aa1bedbf79414e7b338935ef73`

## No-rescue boundary

Because Stage 2 fresh evidence was accessed, `CLGR-STUDY1` may not be repaired through rerun, seed extension, root replacement, relay-limit handling change, resource-ceiling relaxation, representation redesign or formal-gate modification.

A future relay-limit-safe continuous-representation investigation must be a new prospective independent Study/version.

## Protected evidence

Standard initial RAW-root complete exact depth-10 holdout remains:

**`SEALED / NOT GENERATED / NOT READ / NOT PEEKED`**

It was never required or opened by this Study.

## Downstream boundary

G3-10 is **not automatically authorized**. A separate post-G3-09 current-state authorization review is required because the historical G3-10 design assumes validated local-geometry coordinates, while G3-09 formal representation eligibility was not established.

Historical `doc/research-generation-3/PROGRAM_PLAN.md` remains unchanged.

## Main integration boundary

Main integration is prohibited until explicit user instruction after closure and final repository/document consistency audit.

## Read next

- `STUDY_1_FINAL_REPORT.md`
- `CURRENT_STATUS.md`
- `DECISION_REGISTER.md`
- `REPRODUCIBILITY_INDEX.md`
- `STUDY_1_PROTOCOL.md`
- `prereg/STUDY_1_SPEC.json`
