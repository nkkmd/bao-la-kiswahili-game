# Effective Branching / Reply-Width Structure Study 1

## Status

Research Generation 3 `G3-02` formal Study:

`EBRWS-STUDY1 = CLOSED / TECHNICAL-INVALID`

Formal English title:

**Effective Branching and Reply-Width Structure Study 1 — Prospective validation of reproducible multi-ply branching and reply-width profiles as bounded RAW local game-tree position characteristics in Bao**

正式日本語題目:

**Baoにおけるeffective branching / reply-width構造のprospective検証 — bounded RAW局所ゲーム木におけるmulti-ply branching・reply-width profileが再現可能な局面特性として成立する範囲の検証**

## Closure summary

Stage 0 technical validationはsynthetic fixturesのみで`STAGE0-PASS`となり、production / independent stage scientific coreはexact一致した。

Stage 1はfresh seed `31210001..31210192`、Namua 12 + Mtaji 12、relative depth 5として一度だけauthorized executionを行った。runner内部ではglobal mandatory gatesがPASSし、production / independent stage coreもexact一致した。

ただしcanonical Stage 1 result filesを生成した後、repositoryへのpushがnon-fast-forwardでrejectされた。runner-local commitはephemeral環境終了後に回収不能となり、full canonical result artifactをrepositoryへimmutable materializeできなかった。

fresh evidence生成後のsame-evidence rerunはauthorization/no-rescue boundaryに反するため実施しない。したがってfail-closedでStage 1およびStudyを`TECHNICAL-INVALID`として閉じ、Stage 2は`NOT-AUTHORIZED-NOT-EXECUTED`とする。

## Diagnostic-only Stage 1 observation

GitHub Actions run `33569323221`のrunner logには次の候補が記録された。

- `REPLY-WIDTH-SHAPE / namua / COMPRESSION-DOMINANT` = 12/12
- `REPLY-WIDTH-SHAPE / mtaji / COMPRESSION-DOMINANT` = 9/12

これらは**formal promoted candidatesではない**。canonical Stage 1 artifact materialization failure後にpositive resultへ救済せず、diagnostic provenanceとしてのみ保存する。

Formal promoted candidate set:

`[]`

## Scientific boundary

Authoritative representation:

- RAW state identity: `pits,reserve,houseOwned,player,phase,winner,pending`
- validated transform set: `[]`
- relative local horizon: depth 5

Primary dependency:

- `LGTGMIV-F1-TREE-OCCURRENCE`
- `LGTGMIV-F5-REPLY-GEOMETRY`

Secondary contextual dependency:

- `LGTGMIV-F2-RAW-GRAPH`
- `LGTGMIV-F3-TRANSPOSITION-RECONVERGENCE`
- `LGTGMIV-F4-TREE-GRAPH-RELATION`

`effective branching`は新しいvalidated instrumentではなく、eligible exact primitivesからprospectively定義したderived constructとして扱った。

## Frozen primary endpoint

Primary systems:

1. `TREE-WIDTH-SHAPE`
2. `REPLY-WIDTH-SHAPE`

Candidate gate:

`3 * classCount >= 2 * eligibleRootCount`

このthreshold、endpoint、family usage、phase、seed、root ruleはfresh evidence後に変更していない。

## Stage disposition

1. `EBRWS-S0-TECHNICAL-2026-09-01-v1` — `STAGE0-PASS`
2. `EBRWS-S1-DEVELOPMENT-2026-09-01-v1` — `TECHNICAL-INVALID`
3. `EBRWS-S2-FORMAL-2026-09-01-v1` — `NOT-AUTHORIZED-NOT-EXECUTED`

Stage 1 seed `31210001..31210192`は消費済み。Stage 2 seed `31220001..31220288`は未消費。

## Protected evidence

standard initial RAW root complete exact depth-10 holdout remains:

`SEALED / NOT GENERATED / NOT READ`

## Interpretation boundary

branching width / reply width / multi-ply width profileはmachine-observed bounded RAW geometryであり、best move、search difficulty、game-theoretic forcing、win/value、human difficultyへ読み替えない。

## Canonical records

- `STUDY_1_OVERVIEW.md` — 初見向け成果概要
- `STUDY_1_FINAL_REPORT.md` — scientific/technical closure正本
- `STUDY_1_PROTOCOL.md` — frozen prospective protocol
- `prereg/STUDY_1_SPEC.json` — machine-readable preregistration
- `CURRENT_STATUS.md` — current-facing state
- `DECISION_REGISTER.md` — formal decisions
- `REPRODUCIBILITY_INDEX.md` — reproducibility map
- `results/stage-1/STAGE_1_TECHNICAL_INVALID_RESULT.json` — authoritative Stage 1 closure result
- `checkpoints/2026-09-02-stage-1-materialization-failure-technical-invalid.md` — incident checkpoint

Historical `doc/research-generation-3/PROGRAM_PLAN.md` remains immutable and is not rewritten.
