# G3-02 / EBRWS-STUDY1 — Research completion checkpoint

Date: 2026-09-02

## Status

`G3-02 / EBRWS-STUDY1`の研究作業はresearch branch上で完了した。

```text
Study = EBRWS-STUDY1
Agenda position = G3-02
Research workflow = COMPLETE ON RESEARCH BRANCH
Formal Study disposition = CLOSED / TECHNICAL-INVALID
Stage 0 = STAGE0-PASS
Stage 1 = TECHNICAL-INVALID
Formal promoted candidate set = []
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
Stage 2 seed 31220001..31220288 = NOT CONSUMED
Main integration = NOT PERFORMED
Main integration authorization = PENDING EXPLICIT USER INSTRUCTION
G3-03 automatic start = NOT AUTHORIZED
```

## Formal closure basis

Stage 1には2つのtechnical-integrity failureが記録されている。

1. authorized run `33569323221`で生成されたcanonical Stage 1 result filesのrepository materializationがnon-fast-forward push rejectionにより失敗し、ephemeral local commit `709bc393`を回収できなかった。
2. exactly-one-execution authorizationに対して、workflow armingによりrun `33569382663`が意図せず2回目のscientific computationを実行した。これは`UNAUTHORIZED-DUPLICATE-INVALID / INVALID-DO-NOT-USE`であり、replication、confirmation、repair、rescueに使用しない。

```text
authorized Stage 1 scientific executions = 1
actual Stage 1 scientific executions = 2
execution-count contract = violated
formal use of runner-local positive summaries = DIAGNOSTIC-PROVENANCE-ONLY
```

Authorized runner-local diagnostic summaryのNamua 12/12、Mtaji 9/12 `REPLY-WIDTH-SHAPE / COMPRESSION-DOMINANT`はformal promoted candidateではなく、Studyのpositive scientific conclusionへ昇格させない。

## Immutable scientific boundaries

- G3-01 `LGTGMF-STUDY1` remains `CLOSED / TECHNICAL-INVALID`, formal eligible families `[]`.
- LGTGMIV `LGTGMIV-STUDY1` remains `CLOSED / FORMAL-ELIGIBLE-ALL` with F1..F5 formal eligible only within its frozen boundary.
- authoritative state identity remains RAW-only: `pits,reserve,houseOwned,player,phase,winner,pending`.
- validated transform set remains `[]`.
- no threshold, endpoint, family, phase, root, seed, horizon, resource ceiling, or decision taxonomy rescue was performed after fresh evidence.
- no valid / authorized same-evidence repair rerun exists for `EBRWS-STUDY1`.
- standard initial RAW-root complete exact depth-10 holdout remains `SEALED / NOT GENERATED / NOT READ`.

## Workflow closure audit

EBRWS固有GitHub Actions workflowsを全件監査し、以下5本をすべて`CLOSED / DISABLED`とした。各workflowはmanual `workflow_dispatch`のみを定義し、jobは`if: false`で実行不能である。

- `.github/workflows/ebrws-stage0-technical.yml`
- `.github/workflows/ebrws-stage1-tooling.yml`
- `.github/workflows/ebrws-stage1-development.yml`
- `.github/workflows/ebrws-central-doc-sync.yml`
- `.github/workflows/ebrws-technical-invalid-central-doc-sync.yml`

これによりG3-02からscientific / technical / central-document materializationが自動再実行される経路を閉じた。

## Documentation audit

Research branch上で以下のcurrent-facing / closure recordsをG3-02最終状態へ同期済みである。

- root `README.md`
- `doc/RESEARCH_INDEX.md`
- `doc/FUTURE_RESEARCH_AGENDA.md`
- `doc/research-generation-3/README.md`
- `doc/research-generation-3/CURRENT_STATUS.md`
- Study `README.md`
- `STUDY_1_OVERVIEW.md`
- `STUDY_1_FINAL_REPORT.md`
- `CURRENT_STATUS.md`
- `DECISION_REGISTER.md`
- `REPRODUCIBILITY_INDEX.md`
- machine-readable `results/stage-1/STAGE_1_TECHNICAL_INVALID_RESULT.json`
- relevant Study/RG3 checkpoints and program decisions

`doc/research-generation-3/PROGRAM_PLAN.md`はhistorical prospective planとして変更していない。completion audit時点でresearch branchと`main`の同ファイルblob SHAはともに:

`2bb90c11f1625f63f40a7eab8a3de7774505a1ac`

## Repository boundary at completion audit

Completion checkpoint直前のaudited research branch HEAD:

`7adcf16aa40cbe655444c0ab2126c5a02677efef`

Audited remote `main` HEAD:

`ca6a1e4a9b41d79d873fa71385972e402ffa5197`

`main`はG3-02作業によって変更していない。

## Integration hold

このcheckpointはresearch completionを記録するだけであり、`main` integration authorizationではない。

明示的なユーザー指示があるまで、G3-02 branchについて以下を行わない。

- merge to `main`
- fast-forward / ref move of `main`
- integration PRのmerge
- G3-02 completionを根拠とするG3-03 scientific executionの自動開始

次のprogram-level scientific actionは別のpost-G3-02 reviewを必要とする。
