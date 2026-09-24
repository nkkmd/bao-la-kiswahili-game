# G4-03 — Local Width / Search-Ranking Transfer Study 1

Program: `Research Generation 4 / G4-03`  
Study ID: `LWSRT-STUDY1`  
Branch: `research/g4-03-width-ranking-transfer`

正式日本語題目:

**Baoのroot legal widthとsearch ranking変化の移送可能性研究1 — fresh source policy・reachable-root family・phase strataにおけるG3-07 confirmed associationのprospective再検証**

preregistrationとStage 0 technical-only verificationは完了している。Stage 1はfresh scientific seedへまだ一度もアクセスしていない状態で、当初の`LOCAL-ONCE`認可に対するpre-fresh execution-environment amendmentにより、**GitHub Actions上で一度だけ実行する`GITHUB-ACTIONS-ONCE`**へ変更した。Stage 2 scientific accessは未認可である。

## 正本

- [`STUDY_1_PROTOCOL.md`](STUDY_1_PROTOCOL.md)
- [`prereg/STUDY_1_SPEC.json`](prereg/STUDY_1_SPEC.json)
- [`authorizations/STAGE_0_AUTHORIZATION.json`](authorizations/STAGE_0_AUTHORIZATION.json)
- [`authorizations/STAGE_1_AUTHORIZATION.json`](authorizations/STAGE_1_AUTHORIZATION.json) — 当初認可の履歴正本
- [`authorizations/STAGE_1_EXECUTION_ENVIRONMENT_AMENDMENT.json`](authorizations/STAGE_1_EXECUTION_ENVIRONMENT_AMENDMENT.json) — Stage 1の有効な実行環境を`GITHUB-ACTIONS-ONCE`へ変更する追補
- [`authorizations/STAGE_1_PREEXECUTION_BINDING.json`](authorizations/STAGE_1_PREEXECUTION_BINDING.json)
- [`CURRENT_STATUS.md`](CURRENT_STATUS.md)

## Stage 1 execution boundary

- scientific design、runner logic、seed block `40312001..40312768` / 768 は変更しない。
- 本実行は `.github/workflows/lwsrt-stage1-actions-once.yml` の `workflow_dispatch` から一度だけ行う。
- fresh seedの最初のread前に、固定blob SHA、upstream identity firewall、過去artifact digestを再検証する。
- 本実行直前にリポジトリ上のdurable execution leaseを取得する。leaseが既に存在する場合はfresh seed access前にfail closedとする。
- local fresh generation、二回目のscientific execution、fresh access後のrerun、seed extensionは認可しない。

## Interpretation boundary

本Studyの対象はroot legal widthとdeterministic search-condition間のranking-preorder changeの**非因果的associationのtransferability**である。best move correctness、game-theoretic value、AI棋力、人間の難しさはendpointではない。

## Main integration

Research branchは`main`から隔離する。`main`統合はStudy closure・整合性監査後、ユーザーの明示指示があるまで行わない。
