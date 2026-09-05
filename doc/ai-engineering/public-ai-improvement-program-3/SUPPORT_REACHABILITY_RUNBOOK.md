# `PBAI-P3-D` — support / reachability実行runbook

凍結時状態: **`FROZEN / PRE-GENERATION`**

現在状態: **`EXECUTED ONCE / P3-D COMPLETE / PROGRAM CLOSED`**

このrunbookは実行前に凍結した手順を保存するもので、再実行認可を示しません。実行結果と終了境界は[`SUPPORT_REACHABILITY_RESULT.md`](SUPPORT_REACHABILITY_RESULT.md)と[`checkpoints/2026-09-05-p3-d-support-closure.md`](checkpoints/2026-09-05-p3-d-support-closure.md)を参照してください。

Run manifest:

- [`candidates/PBAI-C010-v1-predevelopment-support-run-manifest.json`](candidates/PBAI-C010-v1-predevelopment-support-run-manifest.json)

## 1. 実行境界

このrunbookは`AI-GEN2`だけを用いるpredevelopment support audit専用です。`PBAI-C010-v1`のfeature-on code、手選択、benefit endpoint、D5 reference、game outcomeを生成しません。

実行前に、manifest、production runner、独立verifier、testを同一commitへ固定し、その完全なcommit SHAをresultへ記録します。

## 2. 必要環境

```text
runtime = Node.js
required modules = Node built-ins only
network during run = not required
public source mutation = prohibited
working tree = clean isolated branch
```

OS、architecture、Node version、CPU、logical CPU count、total memory、execution commit、source hashを`environment.json`へ保存します。

## 3. 実行順序

repository rootで次を順番に実行します。

```bash
node test/public-ai-improvement-program3-support.test.js
node tools/engineering/run-pbai-p3-c010-predevelopment-support.js
node tools/engineering/verify-pbai-p3-c010-predevelopment-support-independent.js
```

最初のtestはsynthetic fixtureとinitial stateだけを使い、support seedを読みません。production runが`full-trace.jsonl`、`result.json`、`environment.json`を生成し、独立verifierがfull traceからtrigger、top-3、control、gateを別実装で再構成します。

## 4. 完了条件

- manifest・spec・source hashが一致する。
- candidate codeとdevelopment / validation / holdout seedを使用していない。
- full traceのSHA-256がcompact resultと一致する。
- feature-off semantic mismatchが0件である。
- productionとindependentのrow classification mismatchが0件である。
- aggregate gateを独立再構成できる。
- full artifactとcompact summaryの両方を保存する。

support gateのPASS / FAILにかかわらず、凍結済みfailure semanticsを適用して停止します。失敗後にseed、threshold、phase、control、public-budget subsetを変更しません。
