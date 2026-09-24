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
- 本実行は `.github/workflows/lwsrt-stage1-actions-once.yml` が、研究ブランチ上の専用triggerファイル `authorizations/STAGE_1_ACTIONS_EXECUTION_TRIGGER.json` の**単独コミット**を検知したときに一度だけ開始する。
- triggerファイルは準備段階では存在させない。作成そのものを本実行開始操作として扱う。
- triggerは固定study/stage/seed block、`EXECUTE-AUTHORIZED-STAGE1-ONCE`、no-rerun / no-seed-extension acknowledgementを満たし、そのコミットで変更されたパスがtriggerファイル1件だけであることを要求する。
- fresh seedの最初のread前に、固定blob SHA、upstream identity firewall、過去artifact digestを再検証する。
- 本実行直前にリポジトリ上のdurable execution leaseを取得する。leaseが既に存在する場合はfresh seed access前にfail closedとする。
- local fresh generation、二回目のscientific execution、fresh access後のrerun、seed extensionは認可しない。
- `main`には本実行workflowを置かず、研究ブランチの隔離を維持する。

## Interpretation boundary

本Studyの対象はroot legal widthとdeterministic search-condition間のranking-preorder changeの**非因果的associationのtransferability**である。best move correctness、game-theoretic value、AI棋力、人間の難しさはendpointではない。

## Main integration

Research branchは`main`から隔離する。`main`統合はStudy closure・整合性監査後、ユーザーの明示指示があるまで行わない。
