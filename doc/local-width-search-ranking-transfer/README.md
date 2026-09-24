# G4-03 — Local Width / Search-Ranking Transfer Study 1

Program: `Research Generation 4 / G4-03`  
Study ID: `LWSRT-STUDY1`  
Branch: `research/g4-03-width-ranking-transfer`

正式日本語題目:

**Baoのroot legal widthとsearch ranking変化の移送可能性研究1 — fresh source policy・reachable-root family・phase strataにおけるG3-07 confirmed associationのprospective再検証**

preregistration、Stage 0、Stage 1 development executionは完了している。Stage 1はGitHub Actionsで一回だけ正式実行し、`STAGE1-PASS`となった。現在はStage 2のimplementation、identity firewall、exact inference、pre-execution binding、seed-free preflightまで完了し、**final one-shot Stage 2 authorization review直前**である。Stage 2 fresh scientific seedにはまだ一度もアクセスしていない。

## 正本

- [`STUDY_1_PROTOCOL.md`](STUDY_1_PROTOCOL.md)
- [`prereg/STUDY_1_SPEC.json`](prereg/STUDY_1_SPEC.json)
- [`CURRENT_STATUS.md`](CURRENT_STATUS.md)
- [`checkpoints/2026-09-24-stage-1-completion.md`](checkpoints/2026-09-24-stage-1-completion.md)
- [`checkpoints/2026-09-24-stage-2-preflight.md`](checkpoints/2026-09-24-stage-2-preflight.md)
- [`authorizations/STAGE_1_AUTHORIZATION.json`](authorizations/STAGE_1_AUTHORIZATION.json) — Stage 1当初認可の履歴正本
- [`authorizations/STAGE_1_EXECUTION_ENVIRONMENT_AMENDMENT.json`](authorizations/STAGE_1_EXECUTION_ENVIRONMENT_AMENDMENT.json)
- [`authorizations/STAGE_1_PREEXECUTION_BINDING.json`](authorizations/STAGE_1_PREEXECUTION_BINDING.json)
- [`authorizations/STAGE_2_PREEXECUTION_BINDING.json`](authorizations/STAGE_2_PREEXECUTION_BINDING.json)
- [`prereg/STAGE_1_IDENTITY_FIREWALL_BINDING.json`](prereg/STAGE_1_IDENTITY_FIREWALL_BINDING.json)
- [`results/stage-1/STAGE_1_ARTIFACT_RECEIPT.json`](results/stage-1/STAGE_1_ARTIFACT_RECEIPT.json)
- [`results/stage-2-preflight/STAGE_2_PREFLIGHT_RECEIPT.json`](results/stage-2-preflight/STAGE_2_PREFLIGHT_RECEIPT.json)
- [`../research-program-decisions/2026-09-24-g4-03-stage2-preaccess-authorization-review.md`](../research-program-decisions/2026-09-24-g4-03-stage2-preaccess-authorization-review.md)

## Stage 1 result

Stage 1 canonical runはGitHub Actions `35987703180`。

```text
seed block = 40312001..40312768 / 768
scientific executions = 1 / 1
stage disposition = STAGE1-PASS
selected roots = 128 / 128
16 width cells = 8 / 8 each
SC1 defined = 128 / 128
SC2 defined = 128 / 128
SC3 defined = 128 / 128
production / independent exact = true
formal inference performed = false
```

Stage 1ではeffect direction、risk difference、p-value、generalization/counterexample decisionを生成していない。Stage 2はcanonical Stage 1 artifactからsource seed、trajectory、opening prefix、RAW rootのidentityだけを再materializeして重複排除に用いる。

## Stage 2 preparation boundary

Stage 2 pre-access reviewの判定は、

**`LWSRT-STUDY1-STAGE2-PREACCESS-PASS / FRESH-EXECUTION-NOT-YET-AUTHORIZED`**

である。

Stage 2 fixed contract:

```text
stage = LWSRT-S2-FORMAL-2026-09-24-v1
seed block = 40322001..40323536 / 1536
selection target = 12 HIGH + 12 LOW per policy × root-family × phase
formal tests = 12
exact test = phase-wise hypergeometric + Namua/Mtaji convolution
multiplicity = fixed-12 Holm-Bonferroni
family alpha = 1/20
```

seed-free preflight run `35991470739` と frozen binding validation run `35991767724` はともに`success`。Stage 2 fresh seed readは0のままである。

Stage 2 formal runner `tools/experiments/run-lwsrt-stage2-formal.js` は、別個のfinal authorization fileが存在しない限り実行を拒否する。execution environmentもまだ固定していないため、現時点でformal scientific executionを開始することはできない。

## Interpretation boundary

本Studyの対象はroot legal widthとdeterministic search-condition間のranking-preorder changeの**非因果的associationのtransferability**である。best move correctness、game-theoretic value、AI棋力、人間の難しさはendpointではない。

## Main integration

Research branchは`main`から隔離する。`main`統合はStudy closure・整合性監査後、ユーザーの明示指示があるまで行わない。public AI変更も本研究の自動的帰結とはしない。
