# `PBAI-P3` — main統合前の文書・workflow最終監査

日付: 2026-09-05

状態: **`PASS / DOCUMENTATION-AND-WORKFLOW-AUDIT-COMPLETE`**

## 1. 監査の目的と境界

終了済み`PBAI-P3`をmainへ統合する前に、root [`README.md`](../../../../README.md)、中央索引、Program文書、公開source identity、成果物identity、GitHub ActionsのPR発火範囲を最終確認しました。この監査は文書とCI運用範囲の是正であり、candidate実装、benchmark、validation、release holdout、公開変更、deployment、main統合ではありません。

```text
audit base main = 1d57e7e1877c6ad00f45230d52c528a426abe25d
working branch = engineering/pbai-p3-d-support-audit
PBAI-P3 = COMPLETE / KEEP-AI-GEN2
candidate = PBAI-C010-v1 / CLOSED-WITHOUT-IMPLEMENTATION
current public lineage = AI-GEN2
AI-GEN3 = RESERVED / NOT-PROMOTED
```

## 2. 文書上の是正

- [`../BENCHMARK_PROTOCOL.md`](../BENCHMARK_PROTOCOL.md)、[`../SUPPORT_REACHABILITY_PROTOCOL.md`](../SUPPORT_REACHABILITY_PROTOCOL.md)、[`../SUPPORT_REACHABILITY_RUNBOOK.md`](../SUPPORT_REACHABILITY_RUNBOOK.md)で、凍結時のauthorizationと現在の終了状態を明示的に分離した。
- 凍結済み数値、seed、gate、failure semantics、authorization record、pre-generation checkpointは変更していない。
- [`../DECISION_REGISTER.md`](../DECISION_REGISTER.md)を追加し、初期化、contract凍結、P3-D認可、support判断、no-rescue、Program closureを時系列で記録した。
- [`../RELEASE_REGISTER.md`](../RELEASE_REGISTER.md)を追加し、engineering support判断とは別に、`KEEP-AI-GEN2`、公開source不変、配備0件、`AI-GEN3`非昇格を記録した。
- root README、中央索引、Program入口、現在状態、再開位置、最終報告、証拠分離規則から新しい台帳へ到達できるようにした。
- `compact result`はscore-redacted schemaを指し、byte sizeの保証ではないことを説明した。凍結済みartifactは変更していない。

## 3. 閉鎖済みworkflowのPR発火範囲

変更前のP3-only branch差分は、共通のroot README、`doc/AI_ENGINEERING_INDEX.md`、`doc/ai-engineering/AI_GENERATION_NAMING.md`、またはworkflow自身のpathにより、13件の過去Study / Program用workflowを発火させる状態でした。

各workflowの`pull_request.paths`だけを、対応する過去Study / Program固有の文書、tool、testへ限定しました。既存の`push`条件と`workflow_dispatch`は変更していません。変更後のbranch全差分を`origin/main`に対するPRとして照合した結果は次のとおりです。

```text
historical workflows audited = 13
historical workflows triggered by P3 branch diff before correction = 13
historical workflows triggered by P3 branch diff after correction = 0
all pull_request workflows triggered by P3 branch diff after correction = 0
```

この是正は過去Study / Programの契約、結果、artifact、test本体を変更しません。過去Program固有surfaceを変更するPRでは、対応するworkflowが引き続き発火します。

## 4. 再検証結果

```text
PBAI-P3 support tooling test = PASS
Bao AI test = PASS
Search Reliability / Decision Robustness Stage 0 test = PASS
modified workflow YAML parse = PASS / 13 files
broken relative links = 0
git diff --check = PASS
public/ diff against origin/main = 0
AI-GEN2 bound source hash matches = 8 / 8
```

成果物4件のSHA-256は[`../SUPPORT_REACHABILITY_RESULT.md`](../SUPPORT_REACHABILITY_RESULT.md)に記録した値と一致しました。`environment.json`、`full-trace.jsonl`、`result.json`、`independent-verification.json`は変更していません。

## 5. 日本語品質

root README、中央索引、AI世代命名、PBAI-P3配下の人間向けMarkdown 25件を横断確認し、相対リンク139件のリンク切れは0件でした。英語だけの見出しはrepository名`Bao la Kiswahili`、既存technical heading `canonical namespace`、canonical Study ID見出しだけであり、通常の説明見出しまたは説明文として新たな英語だけの文を追加していません。

## 6. 停止位置

```text
candidate implementation = NOT AUTHORIZED / NOT EXECUTED
benchmark = NOT AUTHORIZED / NOT EXECUTED
validation = NOT AUTHORIZED / NOT EXECUTED
release holdout = NOT AUTHORIZED / NOT EXECUTED
public change = NOT AUTHORIZED / NOT EXECUTED
deployment = NOT AUTHORIZED / NOT EXECUTED
pull request = NOT CREATED
main integration = NOT AUTHORIZED / NOT EXECUTED
```

このbranchは文書・workflowの最終監査を通過しましたが、PR作成またはmain統合は別の明示的な指示を必要とします。
