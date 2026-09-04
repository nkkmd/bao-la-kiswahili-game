# transposition集中とtree / graph divergence — `TCTGD-STUDY1`

Research Generation 3 `G3-03` / `TCTGD-STUDY1` の研究ディレクトリです。

## 正式な状態

```text
Study status = CLOSED / TECHNICAL-INVALID
Stage 0 = STAGE0-PASS
Stage 1 = TECHNICAL-INVALID
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
Stage 1 seed = 31310001..31310192 / CONSUMED
Stage 2 seed = 31320001..31320288 / NOT CONSUMED
formal promoted candidate set = []
protected depth-10 holdout = SEALED / NOT GENERATED / NOT READ
```

## 最初に読む文書

- [`STUDY_1_OVERVIEW.md`](STUDY_1_OVERVIEW.md) — 初見向けの研究概要とformal closure
- [`STUDY_1_FINAL_REPORT.md`](STUDY_1_FINAL_REPORT.md) — scientific/technical closureの正本
- [`../research-program-decisions/2026-09-02-g3-03-technical-invalid-closure.md`](../research-program-decisions/2026-09-02-g3-03-technical-invalid-closure.md) — program-level closure decision
- [`CURRENT_STATUS.md`](CURRENT_STATUS.md) — 現在のclosure状態
- [`DECISION_REGISTER.md`](DECISION_REGISTER.md) — authorization / freeze / no-rescue / closure decisions
- [`REPRODUCIBILITY_INDEX.md`](REPRODUCIBILITY_INDEX.md) — source/hash/run/artifact provenance
- [`STUDY_1_PROTOCOL.md`](STUDY_1_PROTOCOL.md) — frozen scientific contract
- `prereg/STUDY_1_SPEC.json` — machine-readable preregistration

## 何を調べたか

RAW-only / relative depth 5のbounded local geometryについて、transposition concentration、reconvergence、multi-parent RAW state、duplicate occurrence、tree occurrence / RAW graph divergenceのphase差をprospectively検証しました。

Stage 0はtechnical fixturesでPASSし、Stage 1はfresh 12 paired trajectories / 24 rootsをexactly one authorized executionで測定しました。

## なぜ TECHNICAL-INVALID か

Productionとindependentのcanonical scientific content自体は一致しましたが、frozen runnerがprototype-sensitiveな`util.isDeepStrictEqual`をmandatory root/stage gateとして用いていました。production endpoint mapは通常object、independent endpoint mapは`Object.create(null)`だったため、同じkey/valueとcanonical serializationでもin-memory prototype差でmandatory equality gateがFAILしました。

この欠陥が判明したのはfresh Stage 1 evidence生成後です。同じseedでprototypeを修正して再実行したり、equality ruleを事後変更して救済することはno-rescue ruleに反するため行っていません。

## 正式判断への帰結

```text
TCTGD-STUDY1 = CLOSED / TECHNICAL-INVALID
formal promoted candidate set = []
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
```

Stage 1 runnerが記録したC1–C4の方向はdiagnostic provenanceだけで、formal positive findingではありません。

## 解釈上の境界

このStudyから、Bao一般についてtransposition concentrationやtree/graph divergenceのphase差、search ease、best-move clarity、strategic/tactical simplicity、game-theoretic forcing、position value、win probability、human difficultyをformalに主張しません。

## 研究プログラム上の境界

G3-03 closure後のseparate program reviewはその後完了し、G3-04が別Studyとして独立に実施・closureされました。これはG3-03のtechnical-invalid resultを救済・再分類するものではありません。

Standard initial RAW-root complete exact depth-10 holdoutは引き続き **`SEALED / NOT GENERATED / NOT READ`** です。
