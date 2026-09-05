# `PBAI-C010-v1` — 実装前support / reachability監査protocol

凍結時状態: **`FROZEN / EXECUTION AUTHORIZED BY SEPARATE ARTIFACT / PRE-GENERATION`**

現在状態: **`COMPLETE / HOLD / NON-ESTIMABLE-HOLD / CLOSED-WITHOUT-IMPLEMENTATION`**

このprotocolは実行前に凍結した契約です。実行結果とProgramの終了判断は[`SUPPORT_REACHABILITY_RESULT.md`](SUPPORT_REACHABILITY_RESULT.md)と[`PROGRAM_FINAL_REPORT.md`](PROGRAM_FINAL_REPORT.md)に分離して記録しています。以下の数値、seed、gate、failure semanticsは終了後も変更しません。

Spec ID: `PBAI-C010-v1-PREDEVELOPMENT-SUPPORT-2026-09-05-v1`

Program Stage: `PBAI-P3-D`

機械可読spec:

- [`candidates/PBAI-C010-v1-predevelopment-support-spec.json`](candidates/PBAI-C010-v1-predevelopment-support-spec.json)

## 1. 目的

candidate実装前に、`AI-GEN2`だけを使って次を確認します。

- root legal widthを追加探索なしで取得できるか。
- 連続する完了iterationのroot ranking preorderを観測できるか。
- widthとranking churnの結合triggerがfresh root populationで十分に存在するか。
- 上位3手だけのbounded support probeが固定node reserve内で完了可能か。
- public `hard` / `expert` budgetでもtrigger計算まで到達できるか。
- instrumentationがbaselineの選択手、score、node count、制御経路を変えないか。

これはcandidate benefitを測るbenchmarkではありません。candidate feature、candidate move selection、D5 reference agreement、rank-loss、勝敗、勝率は生成または評価しません。

## 2. 新規source population

```text
source seed block = 44000001..44004096
source trajectories = 4096 maximum
maximum plies per trajectory = 160
candidate code = prohibited
validation / release seeds = unread
```

各seedへphaseをhashで事前割当し、そのphaseに到達したtrajectoryから、legal move countが2以上のrootをoutcome-blind hash rankingで最大1件選びます。1 trajectoryから複数rootを独立標本として取りません。

```text
independent unit = trajectory
selected root maximum per trajectory = 1
phase target = Namua 2048 / Mtaji 2048
authoritative identity = pits,reserve,houseOwned,player,phase,winner,pending
symmetry deduplication = prohibited
```

割当phaseへ到達しないtrajectoryは欠測として記録し、別seedで置換しません。

## 3. baseline-only観測

instrumentationは隔離されたsupport harnessへ置き、`public/`を変更しません。baselineと同一のmove generation、evaluation、enhanced iterative-deepening searchを使用します。

各完了iterationについて、全root legal moveのsearch-return scoreとcanonical move keyを記録します。runtime preorderはsearchが既に返したscoreの`<`、`=`、`>`関係から構成し、SILGM formal `E3`と同一instrumentであるとは主張しません。

必須条件:

```text
instrumented feature-off vs uninstrumented baseline selected move mismatch = 0
root score mismatch = 0
pre-existing deterministic stat mismatch = 0
extra search caused by telemetry = 0
production / independent reconstruction mismatch = 0
```

wall-clockは観測しますが、instrumentation overheadの影響を受けるためsupport gateのprimary独立量にしません。node count、完了depth、trigger判定をprimaryとします。

## 4. trigger定義

root legal widthの条件:

```text
Namua > 4
Mtaji > 3
```

ranking churnは、連続する2つの完了iterationで、少なくとも1つのroot move pairのpreorder relationが変化した場合に成立します。partialまたはtimeoutしたiterationを比較へ使いません。

```text
trigger = width condition AND ranking churn
top set = later iteration top 3
activation maximum = once per analyzeMove
```

G3-07のphase thresholdを変更してsupportを救済しません。equal-width層はhighへ含めません。

## 5. 測定条件

### 5.1 deterministic固定depth条件

```text
evaluation profile = bao
level = hard
maxDepth = 3
timeLimitMs = Infinity
quiescenceDepth = 1
required completed iterations = D2 and D3
```

この条件でD2→D3 ranking churn、trigger、top-3集合を測ります。

### 5.2 public-budget reachability条件

```text
standard hard = D8 / 500ms
standard expert = D12 / 2000ms
same recorded host / isolated process
AB / BA order not applicable because candidate is absent
```

各条件で、D2/D3完了、最初のeligible trigger、node/time headroomを測ります。public budget値を延長しません。

### 5.3 上位3手のbounded support probe

candidate selectionへ使わず、上位3手を次depthでfull-window評価するための必要nodeだけを測ります。

```text
probe candidates = later completed iteration top 3
probe depth = later completed depth + 1
window = full window per root candidate
node reserve = min(floor(nodes consumed through trigger * 0.50), 32768)
deadline extension = 0 ms
all three complete = probe support complete
partial probe score / move choice = discarded and not reported as benefit
```

support artifactはroot identity、phase、width、preorder-change count、完了depth、node count、probe completion、reserve exhaustionだけを保存します。root score、D5 agreement、candidate-selected move、game outcomeをsupport decisionへ提供しません。

## 6. support判定条件

すべてconjunctiveです。

```text
selected unique trajectories >= 2048 total
selected roots per phase >= 768
D2/D3 complete roots per phase >= 640
eligible trigger roots >= 128 total
eligible trigger roots per phase >= 48
top-3 probe-complete trigger roots >= 96 total
top-3 probe-complete trigger roots per phase >= 32
high-width / no-churn controls >= 64 total
low-or-equal-width / churn controls >= 64 total
low-or-equal-width / no-churn controls >= 64 total
public hard reachable triggers >= 64 total and >= 24 per phase
public expert reachable triggers >= 64 total and >= 24 per phase
technical failures = 0
instrumentation semantic mismatches = 0
production / independent row-classification mismatches = 0
```

条件未達時はformal dispositionを`HOLD / NON-ESTIMABLE-HOLD / CLOSED-WITHOUT-IMPLEMENTATION`とします。technicalまたはverifier failureは`HOLD / TECHNICAL-INVALID-EVIDENCE / CLOSED-WITHOUT-IMPLEMENTATION`です。seed追加、phase統合、threshold緩和、equal-widthのhigh編入、control除外を行いません。

## 7. negative control要件

次を別々に保持します。

- high-width / no-churn: widthだけで発火しないことを確認する。
- low-or-equal-width / churn: churnだけで発火しないことを確認する。
- low-or-equal-width / no-churn: 完全なtrigger-zero controlとする。
- incomplete D3 / timeout: 不完全rankingをtriggerへ使わないfixtureとする。
- feature-off instrumentation: baselineの全deterministic outputが変わらないことを確認する。

controlをprimary targetへ併合しません。

## 8. 独立再構成

production support harnessとindependent verifierは、次を共有実装にしません。

- root ranking preorder構成
- pairwise churn判定
- phase別width判定
- top-3選択
- support gate集計

共有してよいのは凍結済みbaseline source、RAW serialization schema、machine-readable specだけです。row classificationとaggregate decisionはexact一致を要求します。

## 9. 情報遮断と実行境界

次は`PBAI-P3-C`でspecを凍結した時点のauthorization fieldです。後に与えられた`PBAI-P3-D`の限定的な実行認可は[`authorizations/2026-09-05-p3-d-execution-authorization.md`](authorizations/2026-09-05-p3-d-execution-authorization.md)に分離して記録しており、凍結済みspec自体は書き換えません。

```text
support execution authorized now = false
candidate implementation authorized now = false
development benchmark authorized now = false
validation seeds accessible = false
release holdout seeds accessible = false
```

`PBAI-P3-D`はこの別認可により1回だけ実行されました。support runnerはcandidate codeを含まず、凍結済みgateのFAILにより`PBAI-P3-E`以降は`NOT-AUTHORIZED / NOT-EXECUTED`のままです。
