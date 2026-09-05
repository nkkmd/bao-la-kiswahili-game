# `PBAI-P3` — 公開AI baseline仕様

状態: **`FROZEN / PBAI-P3-B COMPLETE`**

Program: `PBAI-P3`

Baseline ID: **`AI-GEN2-BASELINE-2026-09-05-v1`**

公開系統: **`AI-GEN2`**

機械可読manifest:

- [`baselines/AI-GEN2-BASELINE-2026-09-05-v1.json`](baselines/AI-GEN2-BASELINE-2026-09-05-v1.json)

## 1. 固定境界

```text
current remote main at audit
= 1d57e7e1877c6ad00f45230d52c528a426abe25d

PBAI-P3 scientific evidence cutoff
= 479bc3d3a9b6c745e37a88529732180e8690d6b3

PBAI-P2 baseline source audit main
= 2265fb7ccbf6cf6dde6ab08d5519e44e61b9e972
```

Program開始時の`main`とscientific evidence cutoffは別概念です。`main`は現在の運用・公開用source identityを、cutoffはcandidate設計へ利用できる科学証拠の上限を固定します。

## 2. repository上の公開用source監査

PBAI-P2 baselineとProgram開始時`main`のGit blob identityを比較しました。

| file | Git blob | SHA-256 |
| --- | --- | --- |
| `public/engine.js` | `2f7885fa1ae38ddef5f14bbe2fecd4ca4fb84c7c` | `e6acf1fe4d97db67dbcfadc3a785e802342ae0b0cbaec35f53eb8e77424cfc1c` |
| `public/ai.js` | `8d472be415fac17e47a8e5e667cea9672e7a9ef5` | `2823dbcf96c7a47489301ecd768a63975aa8b4e12b62cc4629fc8283ef5dff9e` |
| `public/ai-weights.js` | `98969eb4c8e1403beedcf5c139a07166aa78175c` | `7cf615fa43c7206e90a907a958108eb5e7595f69459c97aa667a3e2fe8bc18c8` |
| `public/ai-config.js` | `a3f8c1dbd1d8d79a478f4724c51eeef6b02cf6a3` | `10d9ea331ad8fc485dca9f77e2bb327e36850142d28c948e66377dd347877f75` |
| `public/ai-worker.js` | `d774bf90abb26b3c0b780da75d9a070413bc3732` | `cca0996ce1d14f39d5db24de390550a0c3c583a6b08da2609d9f66532d1e5be4` |
| `public/main.js` | `133f5869633f6f54ed60d2fae7d371b218372a13` | `ef11527a94de975945b861f3cd034f42c1f8eef1165b660659831f64be8b7830` |
| `public/index.html` | `183fbca4f8446817680f2f991ef38518568abf2d` | `e96eb85b535886290eedff869d775fb06d2a71ab263a0badf100a3a5595afd32` |
| `public/service-worker.js` | `9e60e35c835d49b807dbaa93cde8c6950f571dfc` | `6049176f0137d07a199023751e176bcdfc323be9a75da664290b728066171f83` |

8件はPBAI-P2 baselineとbyte-identicalです。Research Generation 3 cutoffからProgram開始時`main`までにも`public/`の変更はありません。

```text
post-PBAI-P2 public source change detected = false
Research Generation 3-derived public source change detected = false
candidate source present in main = false
repository public-source lineage = AI-GEN2
```

## 3. 公開経路

repository内の公開entrypointは`public/index.html`であり、主要経路は次のとおりです。

```text
index.html -> main.js -> ai-worker.js -> AI.analyzeMove
Worker unavailable/failure -> main.js -> AI.analyzeMove
AIConfig.searchOptions -> request options
```

`public/index.html`は`engine.js`、`ai-weights.js`、`ai.js`、`ai-config.js`、診断関連source、`main.js`を読み込みます。primary Workerとmain-thread fallbackは同じsearch surfaceを使用します。

## 4. search / evaluation設定

```text
default evaluation profile = bao
UI default level = normal
quiescenceDepth = 1
transposition table = enabled
TT max entries = 50000
evaluation cache hard/expert = enabled
evaluation cache max entries = 2048
ttMoveFirst = false
historyHeuristic = false
aspirationWindow = 0
stableBestDepths = 0
normalizeTtMateScores = false
adaptive public default = false
```

```text
hard:
  low D6 / 400ms
  standard D8 / 500ms
  high D10 / 600ms

expert:
  low D10 / 1500ms
  standard D12 / 2000ms
  high D14 / 3000ms
```

## 5. state identityの既知境界

```text
authoritative RAW identity
= pits, reserve, houseOwned, player, phase, winner, pending

current AI.stateKey
= pits, player, phase, reserve, houseOwned, winner

current AI.stateKey includes pending = false
```

この差だけで公開searchの誤りやpractical collisionは確定しません。`PBAI-C006-v1`はfrozen support universeでactionable defectを確認できずclosedです。この判断をPBAI-P3で再開・救済しません。

## 6. PWA設定

```text
cache name = bao-la-kiswahili-v24
strategy = cache-first for GET; install pre-cache; activate removes old cache names
```

公開採用候補が将来生じた場合、service-worker cache version、旧asset、保存データ、rollback targetをrelease gateで明示的に検証します。

## 7. live deployment identityの観測限界

公開先はCloudflare Pages、source targetは`main/public/`、文書上のendpointは`https://bao-la-kiswahili.cultivationdata.net/`です。GitHub Pagesは使用されていません。

一方、repository内にCloudflare provider deployment ID、配備commitを証明するmanifest、配信中asset hashはありません。この環境からも配信中assetのbyte比較を完了できなかったため、次を明示します。

```text
provider deployment ID = UNAVAILABLE / NOT INVENTED
exact live JS byte comparison = NOT COMPLETED
repository public source identity = VERIFIED
live deployment byte identity = NOT INDEPENDENTLY VERIFIED
```

これは不一致を確認したという意味ではありません。candidate比較には上記のrepository source baselineを用いますが、公開`ADOPT`判断前にはlive identityを独立確認するか、未確認のままならfail-closedにします。

## 8. baselineの処置

```text
PBAI-P3-B = COMPLETE
baseline = AI-GEN2-BASELINE-2026-09-05-v1
lineage = AI-GEN2
candidate implementation observed before freeze = false
candidate outcome observed before freeze = false
AI-GEN3 promotion = NOT AUTHORIZED
```
