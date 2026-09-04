# effective branching・reply-width構造 — `EBRWS-STUDY1`

## 現在の状態

Research Generation 3 `G3-02`のformal Studyです。

`EBRWS-STUDY1 = CLOSED / TECHNICAL-INVALID`

研究工程: `COMPLETE / MAIN INTEGRATED`
mainへの統合: `COMPLETE / PR #92 / merge b41c7eda74dd1002e98e4d82714fadb987d1f1e1`

正式英語題目:

**Effective Branching and Reply-Width Structure Study 1 — Prospective validation of reproducible multi-ply branching and reply-width profiles as bounded RAW local game-tree position characteristics in Bao**

正式日本語題目:

**Baoにおけるeffective branching / reply-width構造のprospective検証 — bounded RAW局所ゲーム木におけるmulti-ply branching・reply-width profileが再現可能な局面特性として成立する範囲の検証**

## 終了結果の要約

Stage 0 technical validationはsynthetic fixturesのみで`STAGE0-PASS`となり、production / independent stage scientific coreはexact一致した。

Stage 1はfresh seed `31210001..31210192`、Namua 12 + Mtaji 12、relative depth 5として**exactly one scientific execution**をprospectively authorizationした。authorized run `33569323221`のrunner内部ではglobal mandatory gatesがPASSし、production / independent stage coreもexact一致した。

ただしcanonical Stage 1 result filesを生成した後、repositoryへのpushがnon-fast-forwardでrejectされた。runner-local commitはephemeral環境終了後に回収不能となり、full canonical result artifactをrepositoryへimmutable materializeできなかった。

この時点でno-rescue boundaryはcross済みであり、失われたartifactを作り直すためのauthorized / intentional same-evidence repair rerunは行わない。

さらにfinal Actions-history auditで、workflow armingによってrun `33569382663`が意図せずqueueされ、同じStage 1 scientific computationが2回目も実行されていたことが判明した。これはexactly-one-execution authorizationに違反するため`UNAUTHORIZED-DUPLICATE-INVALID` / `INVALID-DO-NOT-USE`とし、formal replication、confirmation、repair、rescueには使用しない。

以上のtechnical-integrity failuresをfail-closedに適用し、Stage 1およびStudyを`TECHNICAL-INVALID`として閉じた。Stage 2は`NOT-AUTHORIZED-NOT-EXECUTED`である。

## 診断用途に限るStage 1観測

Authorized GitHub Actions run `33569323221`のrunner logには次の候補が記録された。

- `REPLY-WIDTH-SHAPE / namua / COMPRESSION-DOMINANT` = 12/12
- `REPLY-WIDTH-SHAPE / mtaji / COMPRESSION-DOMINANT` = 9/12

これらは**formal promoted candidatesではない**。canonical Stage 1 artifact materialization failure後にpositive resultへ救済せず、diagnostic provenanceとしてのみ保存する。

Unauthorized duplicate runでも同じscientific core / candidate-set / scientific-result file hashがrunner-localに得られたが、この一致もscientific inferenceへ使用しない。

formalにpromotionされたcandidate set:

`[]`

## 科学的な主張範囲

正本となるrepresentation:

- RAW state identity: `pits,reserve,houseOwned,player,phase,winner,pending`
- validated transform set: `[]`
- relative local horizon: depth 5

主要dependency:

- `LGTGMIV-F1-TREE-OCCURRENCE`
- `LGTGMIV-F5-REPLY-GEOMETRY`

補助的なcontext dependency:

- `LGTGMIV-F2-RAW-GRAPH`
- `LGTGMIV-F3-TRANSPOSITION-RECONVERGENCE`
- `LGTGMIV-F4-TREE-GRAPH-RELATION`

`effective branching`は新しいvalidated instrumentではなく、eligible exact primitivesからprospectively定義したderived constructとして扱った。

## 固定済みの主要endpoint

主要system:

1. `TREE-WIDTH-SHAPE`
2. `REPLY-WIDTH-SHAPE`

candidate gate:

`3 * classCount >= 2 * eligibleRootCount`

このthreshold、endpoint、family usage、phase、seed、root ruleはfresh evidence後に変更していない。

## 各Stageの状態

1. `EBRWS-S0-TECHNICAL-2026-09-01-v1` — `STAGE0-PASS`
2. `EBRWS-S1-DEVELOPMENT-2026-09-01-v1` — `TECHNICAL-INVALID`
3. `EBRWS-S2-FORMAL-2026-09-01-v1` — `NOT-AUTHORIZED-NOT-EXECUTED`

Stage 1 seed `31210001..31210192`は消費済み。Stage 2 seed `31220001..31220288`は未消費。

## 保護された証拠

standard initial RAW rootのcomplete exact depth-10 holdoutは、次の状態を維持しました。

`SEALED / NOT GENERATED / NOT READ`

## 解釈上の境界

branching width / reply width / multi-ply width profileはmachine-observed bounded RAW geometryであり、best move、search difficulty、game-theoretic forcing、win/value、human difficultyへ読み替えない。

## 正本となる記録

- [`STUDY_1_OVERVIEW.md`](STUDY_1_OVERVIEW.md) — 初見向け成果概要
- [`STUDY_1_FINAL_REPORT.md`](STUDY_1_FINAL_REPORT.md) — scientific/technical closure正本
- [`STUDY_1_PROTOCOL.md`](STUDY_1_PROTOCOL.md) — frozen prospective protocol
- `prereg/STUDY_1_SPEC.json` — machine-readable preregistration
- [`CURRENT_STATUS.md`](CURRENT_STATUS.md) — current-facing state
- [`DECISION_REGISTER.md`](DECISION_REGISTER.md) — formal decisions
- [`REPRODUCIBILITY_INDEX.md`](REPRODUCIBILITY_INDEX.md) — reproducibility map
- `results/stage-1/STAGE_1_TECHNICAL_INVALID_RESULT.json` — Stage 1 closure result・実行監査の正本
- [`checkpoints/2026-09-02-stage-1-materialization-failure-technical-invalid.md`](checkpoints/2026-09-02-stage-1-materialization-failure-technical-invalid.md) — materialization incident checkpoint
- [`checkpoints/2026-09-02-stage-1-unintended-duplicate-execution.md`](checkpoints/2026-09-02-stage-1-unintended-duplicate-execution.md) — execution-count violation checkpoint
- [`checkpoints/2026-09-02-main-integration-complete.md`](checkpoints/2026-09-02-main-integration-complete.md) — repository main integration completion checkpoint

過去の計画を記録する`doc/research-generation-3/PROGRAM_PLAN.md`は変更不可のまま保持し、書き換えていません。

## GitHub Actions実行履歴の最終監査

```text
authorized Stage 1 scientific executions = 1
actual Stage 1 scientific executions = 2
run 33569323221 = authorized / canonical materialization failure
run 33569382663 = unauthorized duplicate / INVALID-DO-NOT-USE
formal promoted candidate set = []
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
Stage 1 execution workflow = CLOSED / DISABLED
```

この事実はStudyの`CLOSED / TECHNICAL-INVALID` closureを変更せず、technical-invalid根拠を追加する。Stage 2は未実行、depth-10 holdoutはsealedのままである。
