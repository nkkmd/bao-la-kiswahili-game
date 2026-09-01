# PBAI-P2 Public AI Baseline Specification

Status: **FROZEN / PBAI-P2-B COMPLETE**  
Program: `PBAI-P2`  
Baseline ID: **`AI-GEN2-BASELINE-2026-09-01-v1`**  
Generation lineage: **`AI-GEN2`**

Canonical machine-readable manifest:

- `baselines/AI-GEN2-BASELINE-2026-09-01-v1.json`

## 1. freeze boundary

PBAI-P2 candidate outcomeを生成する前に、current public Bao AI comparatorをread-onlyで再監査し、exact source identityを固定した。

```text
current remote main at audit
= 2265fb7ccbf6cf6dde6ab08d5519e44e61b9e972

PBAI-P2 scientific evidence cutoff
= cd200b85c1eb24aa4419bd5a9573552f3682f00d

PBAI-P1 exact baseline source
= f4ae3b11901180cbe417b3e643e2b357d8045d2d
```

current `main`とscientific evidence cutoffは別概念である。current `main`はintegration / public-source operational stateの確認にのみ使用し、post-cutoff research evidenceをcandidateへ流入させない。

## 2. current public source audit

PBAI-P1 baseline sourceとcurrent `main`のGit blob identityを比較した。

| file | current Git blob | PBAI-P1 baseline sourceとの一致 |
| --- | --- | --- |
| `public/engine.js` | `2f7885fa1ae38ddef5f14bbe2fecd4ca4fb84c7c` | exact |
| `public/ai.js` | `8d472be415fac17e47a8e5e667cea9672e7a9ef5` | exact |
| `public/ai-weights.js` | `98969eb4c8e1403beedcf5c139a07166aa78175c` | exact |
| `public/ai-config.js` | `a3f8c1dbd1d8d79a478f4724c51eeef6b02cf6a3` | exact |
| `public/ai-worker.js` | `d774bf90abb26b3c0b780da75d9a070413bc3732` | exact |
| `public/main.js` | `133f5869633f6f54ed60d2fae7d371b218372a13` | exact |
| `public/index.html` | `183fbca4f8446817680f2f991ef38518568abf2d` | exact |
| `public/service-worker.js` | `9e60e35c835d49b807dbaa93cde8c6950f571dfc` | exact |

Git blob equalityはrepository内のbyte identityを保証する。よってPBAI-P1でexact byte列から計算したSHA-256をPBAI-P2 baseline manifestへ安全に再bindできる。

結論:

```text
post-G2 public AI source change detected = false
Research Generation 3-derived public AI change detected = false
ambiguous provenance public AI change = false
alternate/fail-closed baseline required = false
```

PBAI-P2は既存PBAI-P1 baseline IDをそのまま流用せず、監査日・current main・evidence firewallを新しいmanifestへbindingした`AI-GEN2-BASELINE-2026-09-01-v1`として再freezeする。

## 3. exact SHA-256 identity

| file | SHA-256 |
| --- | --- |
| `public/engine.js` | `e6acf1fe4d97db67dbcfadc3a785e802342ae0b0cbaec35f53eb8e77424cfc1c` |
| `public/ai.js` | `2823dbcf96c7a47489301ecd768a63975aa8b4e12b62cc4629fc8283ef5dff9e` |
| `public/ai-weights.js` | `7cf615fa43c7206e90a907a958108eb5e7595f69459c97aa667a3e2fe8bc18c8` |
| `public/ai-config.js` | `10d9ea331ad8fc485dca9f77e2bb327e36850142d28c948e66377dd347877f75` |
| `public/ai-worker.js` | `cca0996ce1d14f39d5db24de390550a0c3c583a6b08da2609d9f66532d1e5be4` |
| `public/main.js` | `ef11527a94de975945b861f3cd034f42c1f8eef1165b660659831f64be8b7830` |
| `public/index.html` | `e96eb85b535886290eedff869d775fb06d2a71ab263a0badf100a3a5595afd32` |
| `public/service-worker.js` | `6049176f0137d07a199023751e176bcdfc323be9a75da664290b728066171f83` |

最初の5件をminimum AI identity、後3件をWorker/fallback/PWA/public execution bindingとする。

## 4. search / evaluation configuration

Public default evaluation:

```text
bao
```

Hard / expertはenhanced alpha-beta iterative-deepening familyを使用し、主要baseline semanticsは次である。

```text
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

Public search budgetsは既存AI-GEN2 baselineのまま:

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

## 5. transposition / evaluation-cache identity

Current `AI.stateKey`は次を含む。

```text
pits
player
phase
reserve
houseOwned
winner
```

Research Generation 2 authoritative RAW identityは次である。

```text
pits
reserve
houseOwned
player
phase
winner
pending
```

したがって:

```text
current AI.stateKey includes pending = false
current AI.stateKey == authoritative RAW identity = false
```

Current default transposition keyはmate-score normalization無効時:

```text
AI.stateKey(state) + "@" + ply
```

Evaluation cacheはplayer prefixと`AI.stateKey(state)`を使う。Worker / main stale-result guardも`AI.stateKey`によるposition identityを使用する。

この差は`PBAI-C006-v1`の**predevelopment support question**を正当化するが、差が存在するだけでcurrent public searchのincorrectness、practical collision、decision defectを確定しない。

## 6. Worker / fallback binding

Primary path:

```text
main.js -> ai-worker.js -> AI.analyzeMove
```

Workerはsearch requestの`state`, `level`, `options`を使用する。Worker failure / unsupported時はmain-thread fallbackが同じAI search surfaceを使用する。

PBAI-P2 correctness gateではcandidate feature-off時のdirect/Worker一致と、candidateがWorker-facing identityへ影響する場合のcandidate-on一致を必須とする。

## 7. PWA cache

```text
cache name = bao-la-kiswahili-v24
strategy = cache-first for GET; install pre-cache; activate removes old cache names
```

AI / engine / worker / config等はpre-cache対象である。将来candidateをpublic assetへ採用する場合、service-worker cache versionとrollback targetをrelease gateで明示的に更新・検証する。

## 8. Research Generation 3 purity

Baseline re-freezeにResearch Generation 3 scientific content、measurement、diagnostic、hypothesis、candidate mechanismを使用していない。

current main上でG3期のcommitが存在することはoperational historyとしてのみ認識し、public AI sourceがPBAI-P1 baseline sourceとbyte-identicalであることから、G3由来AI変更の切り分け問題は発生しなかった。

## 9. baseline disposition

```text
PBAI-P2-B = COMPLETE
baseline = AI-GEN2-BASELINE-2026-09-01-v1
lineage = AI-GEN2
candidate implementation before freeze = 0
candidate outcome before freeze = 0
AI-GEN3 promotion = NOT AUTHORIZED
```
