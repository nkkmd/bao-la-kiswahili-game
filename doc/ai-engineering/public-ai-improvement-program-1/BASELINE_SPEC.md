# PBAI-P1 Public AI Baseline Specification

Status: **FROZEN / PBAI-B COMPLETE**  
Program: `PBAI-P1`  
Baseline ID: **`AI-GEN2-BASELINE-2026-08-26-v1`**  
Generation lineage: **`AI-GEN2`**

Canonical machine-readable manifest:

- `baselines/AI-GEN2-BASELINE-2026-08-26-v1.json`

## 1. Purpose and freeze boundary

PBAI-P1 candidate implementation前に、publicで使用されているBao AI lineage `AI-GEN2`のexact engineering baselineを固定する。

PBAI-P1のscientific evidence cutoffは別概念であり、`2db7c4d65771066e914f32cbc4116fcc3e9e386a`のcompleted Research Generation 1 evidenceへ固定されたままである。PBAI-Bはresearch evidenceを追加・再解釈しない。

本baselineのrepository source of truthは、PBAI-A統合直後の`main`:

```text
f4ae3b11901180cbe417b3e643e2b357d8045d2d
```

である。PBAI-A統合はdocumentation/test-onlyであり、public AI assetを変更していない。

## 2. Public deployment binding

```text
public endpoint
= https://bao-la-kiswahili.cultivationdata.net/

deployment target
= Cloudflare Pages static deployment

repository
= nkkmd/bao-la-kiswahili-game

source branch
= main

source directory
= public/

source commit
= f4ae3b11901180cbe417b3e643e2b357d8045d2d
```

PBAI-B時点でlive endpointは到達可能であり、公開画面のtitle、difficulty UI、rules/diagnostic surfaceはcurrent repository sourceと整合していることを確認した。

Cloudflare内部のdeployment IDはrepositoryおよび今回利用可能なtoolingから取得できなかった。したがって未観測IDを推定・捏造せず、deployment bindingは**公開endpoint + documented deployment target + `main/public` source ref**として固定する。

重要な観測境界:

```text
provider internal deployment ID = unavailable / not invented
exact live JS asset byte comparison = not performed
```

この境界はbaseline manifestに明示する。PBAI-P1 public adoption時には可能ならprovider-side deployment refもrelease registerへ追加する。

## 3. Exact file identity

SHA-256はGit blob SHAではなく、checkoutされたexact byte列からNode `crypto`で計算した。

| file | bytes | SHA-256 |
| --- | ---: | --- |
| `public/engine.js` | 13,462 | `e6acf1fe4d97db67dbcfadc3a785e802342ae0b0cbaec35f53eb8e77424cfc1c` |
| `public/ai.js` | 37,674 | `2823dbcf96c7a47489301ecd768a63975aa8b4e12b62cc4629fc8283ef5dff9e` |
| `public/ai-weights.js` | 3,269 | `7cf615fa43c7206e90a907a958108eb5e7595f69459c97aa667a3e2fe8bc18c8` |
| `public/ai-config.js` | 4,906 | `10d9ea331ad8fc485dca9f77e2bb327e36850142d28c948e66377dd347877f75` |
| `public/ai-worker.js` | 1,204 | `cca0996ce1d14f39d5db24de390550a0c3c583a6b08da2609d9f66532d1e5be4` |
| `public/main.js` | 24,844 | `ef11527a94de975945b861f3cd034f42c1f8eef1165b660659831f64be8b7830` |
| `public/index.html` | 7,144 | `e96eb85b535886290eedff869d775fb06d2a71ab263a0badf100a3a5595afd32` |
| `public/service-worker.js` | 911 | `6049176f0137d07a199023751e176bcdfc323be9a75da664290b728066171f83` |

最初の5件がminimum AI baseline identityであり、`main.js` / `index.html` / `service-worker.js`はactual public path、difficulty mapping、Worker/PWA bindingを固定する補助identityである。

## 4. Rules engine binding

Runtime rule engine:

```text
public/engine.js
SHA-256 = e6acf1fe4d97db67dbcfadc3a785e802342ae0b0cbaec35f53eb8e77424cfc1c
```

Rules baseline:

```text
doc/RULES_BASELINE.md = v1.0.0
external guide = bao-la-kiswahili-ja v0.1.0-draft / R-002
fixed external commit = 1179267b1f19b27a2138791253f2cb9cbfe98c14
```

Known rule/implementation boundaries remain:

- `takasia` is not implemented;
- relay safety limit is an implementation guard, not an added Bao rule;
- candidate benchmark中にrule engineをcandidateと一緒に変更しない。

Rule changeが必要になった場合は、AI candidate comparisonとは別のversion/baseline問題として扱う。

## 5. Public difficulty mapping

UI mapping:

| public label | internal level |
| --- | --- |
| やさしい | `easy` |
| ふつう | `normal` |
| むずかしい | `hard` |
| ムタアラム | `expert` |

Fresh/default UI selection is:

```text
normal / ふつう
```

`localStorage` key `bao_ai_level`が存在する場合は前回値を復元し、存在しない場合は`normal`へfallbackする。

## 6. Evaluation baseline

Public default evaluation profile:

```text
bao
```

`AI.evaluate(state, player)`は`bao` semanticsを使用する。

`bao-v2`はhistorical experimental / diagnostic evaluation profileであり、以下ではない。

```text
AI-GEN2
AI-GEN2 baseline
public generation label
```

Terminal evaluation magnitude:

```text
WIN = 1,000,000
LOSS = -1,000,000
```

Exact phase-specific weight valuesは`public/ai-weights.js`のfrozen SHA-256へbindする。

Position Evaluation / Win-Rate Calibration Study 1は`INCONCLUSIVE`のままであり、これらengine scoresをvalidated Bao win probabilityとは呼ばない。

## 7. Public search implementation

`hard` / `expert`のpublic default pathは、`searchProfile="legacy"`でも`mcts`でもなく、`public/ai.js`のenhanced alpha-beta iterative-deepening pathである。historical benchmark toolingではこのfamilyを`phase2` identifierで表す。

主要構成:

- iterative deepening;
- alpha-beta;
- PVS-style null-window search + required full-window re-search;
- transposition table;
- immediate-win / capture-priority move ordering;
- cached/preferred move ordering;
- killer move ordering;
- static-evaluation ordering;
- capture-only quiescence search;
- hard/expert evaluation cache.

Historical MCTS implementationはコードに残るがpublic defaultではない。

## 8. Device tier and exact public budgets

`deviceTier()` inputs:

```text
navigator.hardwareConcurrency
navigator.deviceMemory
```

Missing value fallback:

```text
hardwareConcurrency = 4
deviceMemory = 4
=> standard
```

Tier rules:

```text
low      = cores <= 2 OR memory <= 2
high     = cores >= 8 AND memory >= 4
standard = otherwise
```

### hard / むずかしい

| tier | maxDepth | timeLimitMs |
| --- | ---: | ---: |
| low | 6 | 400 |
| standard | 8 | 500 |
| high | 10 | 600 |

### expert / ムタアラム

| tier | maxDepth | timeLimitMs |
| --- | ---: | ---: |
| low | 10 | 1500 |
| standard | 12 | 2000 |
| high | 14 | 3000 |

`searchOptions()`は現在`baseSearchOptions()`をそのまま返す。

したがってhistorical `adaptiveSearchOptions()` APIは存在するが:

```text
adaptive public default = false
```

である。

## 9. Time-limit and max-depth semantics

### Time limit

Searchはabsolute deadlineを作り、search/quiescence entryでdeadlineを確認する。

Timeout時:

- `stats.timedOut = true`;
- exceptionをpublic failureとして外へ投げず、iterative-deepening loopを停止する;
- 直前までに保持しているsafe/best available root moveを返す;
- returned moveはrule engineでlegalでなければならない。

### Max depth

`maxDepth`はprincipal iterative-deepening depthのupper boundである。

ただしdepth 0でquiescenceへ入るため、`maxDepth=N`を「N legal movesより先を絶対に見ない」と解釈してはいけない。

Fixed-depth engineering comparisonでは:

```text
timeLimitMs = Infinity
explicit maxDepth
```

を使用し、time-limited operational evaluationと混同しない。

## 10. Quiescence semantics

Public hard/expert default:

```text
quiescenceDepth = 1
capture-only extension = true
orderQuiescenceCaptures = false
```

terminalはquiescence中も優先される。

`PBAI-C002`等がselective extensionを導入する場合、このbaseline quiescence behaviorとの差分を明示する。

## 11. Move-ordering semantics

Default enhanced orderingは概ね次の優先順位である。

```text
1. immediate win
2. capture amount
3. cached / preferred move
4. killer move
5. static evaluation
```

`ttMoveFirst=false`がdefaultなので、cached/preferred moveはcapture priorityを追い越さない。

現在default:

```text
ttMoveFirst = false
historyHeuristic = false
aspirationWindow = 0
stableBestDepths = 0
orderQuiescenceCaptures = false
normalizeTtMateScores = false
```

これらのhistorical experimental optionsがコードに存在することと、public defaultであることを混同しない。

## 12. Transposition-table semantics

Default TT:

```text
enabled = true
maxTableEntries = 50,000
```

Default transposition key:

```text
AI.stateKey(state) + "@" + ply
```

`normalizeTtMateScores=false`なのでplyがkeyへ含まれる。

Entry fields:

```text
depth
value
flag = exact / lower / upper
bestMove
```

Cap到達時は新規key挿入前にMapのoldest entryを1件削除する。

### Critical identity boundary

Current `AI.stateKey` includes:

```text
pits
player
phase
reserve
houseOwned
winner
```

but does **not** include:

```text
pending
```

Research Generation 1 authoritative RAW identity is:

```text
pits
reserve
houseOwned
player
phase
winner
pending
```

Therefore:

```text
current AI.stateKey
!= Research Generation 1 authoritative RAW identity
```

PBAI-Bはこの差をbaseline propertyとして固定するが、この事実だけからcurrent public searchのincorrectnessをformal判定しない。

一方、`PBAI-C003`等のresearch-derived exact lookup/tablebase keyにcurrent `AI.stateKey`を流用することは引き続き禁止する。専用strict RAW bindingが必要である。

## 13. Evaluation-cache semantics

Default:

```text
hard/expert = enabled
normal = disabled
max entries = 2,048
```

Evaluation-cache keyもcurrent `AI.stateKey`を使用し、player prefixを付与する。

したがってRAW identity boundaryはTTだけでなくevaluation cacheのbaseline semanticsにも関係する。

## 14. Randomness / seed semantics

### easy

supplied RNG / public `Math.random`でexact legal moveVariantsから1手を選ぶ。

### normal

immediate scoreでrankした上位最大3手からsupplied RNG / public `Math.random`で1手を選ぶ。

### hard / expert default

Default enhanced search自体はsupplied RNGを使用しない。

したがってfixed state + fixed options + fixed sourceではdeterministic fixed-depth comparisonが可能である。

Benchmarkのopening randomnessは`tools/benchmark.js`側のexplicit seeded RNGで制御する。

## 15. Worker / fallback semantics

Primary public path:

```text
main.js
  -> new Worker("./ai-worker.js")
  -> AI.analyzeMove(state, level, Math.random, options)
```

Worker dependencies:

```text
./engine.js
./ai-weights.js
./ai.js
```

Worker failure / unsupported Workerではmain thread fallbackを使用し、同じrequestの:

```text
state
level
options
```

を`AI.analyzeMove`へ渡す。

Worker result受理前には`AI.stateKey` positionKey equalityでstale resultを拒否する。

## 16. PWA/cache semantics

Service Worker cache:

```text
bao-la-kiswahili-v24
```

Strategy:

```text
install: current asset listをpre-cache
activate: current name以外のcacheを削除
fetch GET: cache-first, miss時network
```

AI/engine/worker/configはpre-cache対象である。

したがってfuture public adoptionでは、public asset変更だけでなくcache version / deployment behaviorもrelease gateで確認する必要がある。

PBAI-B自体はpublic assetを変更しないためcache versionは変更しない。

## 17. Deterministic baseline verification

Canonical inspection workflow:

```text
runId = 32910436754
jobId = 98003385552
Node = 20.20.2
result = PASS
```

Standard initial state、hard、`bao`、`maxDepth=3`、`timeLimitMs=Infinity`:

```text
move = takata:namua:0:5:right:::false
rootScore = 13
nodes = 158
quiescenceNodes = 88
evaluationRequests = 114
evaluations = 60
completedDepth = 3
timedOut = false
```

異なるsupplied RNGでも同じroot moveとなった。

Worker pathも:

```text
takata:namua:0:5:right:::false
```

でdirect pathと一致した。

Zero-time diagnosticではtimeoutを記録しながらlegal root move:

```text
takata:namua:0:5:left:::false
```

を返した。

これはpublic time budgetそのもののbenchmarkではなくtimeout-safe behaviorのdeterministic contract checkである。

## 18. Time-limited operational inspection — separate from fixed-depth

同じworkflowでpublic hard/expert tier budgetsをstandard initial stateへ適用するdescriptive smokeを別ステップで実施した。

GitHub-hosted runner上の例:

```text
hard / standard
configured D8 / 500ms
elapsed 501.009588ms
completed depth 6
timedOut = true
move = takata:namua:0:5:left:::false

expert / standard
configured D12 / 2000ms
elapsed 2001.204498ms
completed depth 7
timedOut = true
move = takata:namua:0:5:right:::false
```

Full low/standard/high measurementsはworkflow artifact:

```text
runId = 32910436754
artifactId = 9586339640
artifact ZIP SHA-256 = 34bfc5e9ad33dc2b62be5f3965ad845c84639ff326424fe8e8db00e52bcd3507
```

に保存した。

これらelapsed/depth値は:

```text
descriptive only
not acceptance thresholds
not cross-device guarantees
```

である。PBAI-Cのoperational gateはcandidate resultを見る前に別途freezeする。

## 19. Regression verification

PBAI-B canonical workflowで以下がPASSした。

```text
test/engine.test.js
test/ai.test.js
test/evaluation.test.js
test/search.test.js
test/ai-config.test.js
test/ai-worker.test.js
test/tactical.test.js
test/public-ai-improvement-program1-contract.test.js
```

PBAI-Bはpublic AI codeを変更していない。

## 20. Documentation reconciliation

PBAI-Aで発見した`doc/AI_DEVELOPMENT_LOG.md`のhard browser default `D4 / 450ms`表記は、現在のpublic configとは一致しない。

PBAI-B decision:

> `AI_DEVELOPMENT_LOG.md`はhistorical engineering recordとして書き換えず、current exact baseline truthは本Baseline Spec + frozen manifest + current public sourceとする。

現在のhard public settingsは本書Section 8のdevice-tier settingsである。

同様にhistorical roadmap/profile名称をcurrent generation labelへ読み替えない。

## 21. Baseline freeze gate

```text
generationLineage = AI-GEN2                         PASS
repository source commit bound                      PASS
public endpoint / deployment source-ref bound       PASS with provider-ID boundary recorded
public difficulty mapping verified                  PASS
relevant public files SHA-256 frozen                PASS
rules engine binding frozen                         PASS
default evaluation profile verified                 PASS
default search path verified                        PASS
hard/expert settings frozen                         PASS
time-limit / max-depth semantics frozen             PASS
quiescence semantics frozen                         PASS
move-ordering semantics frozen                      PASS
TT/evaluation-cache semantics frozen                PASS
randomness semantics frozen                         PASS
worker/fallback semantics frozen                    PASS
PWA/cache implications frozen                       PASS
deterministic fixed-depth reproduction              PASS
time-limited behavior separately measured           PASS
rule/AI/search/config/worker/tactical regressions    PASS
public AI implementation changed by PBAI-B          false
```

Therefore:

```text
PBAI-B = COMPLETE
baselineFrozen = true
baselineId = AI-GEN2-BASELINE-2026-08-26-v1
generationLineage = AI-GEN2
```

## 22. Authorization after freeze

PBAI-B completion does **not** authorize a candidate implementation.

```text
candidateImplementationAuthorized = false
AUTHORIZED-FOR-DEVELOPMENT count = 0
PBAI-C numeric non-regression/release gates = NOT-FROZEN
AI-GEN3 promotionAuthorized = false
```

Next phase is **PBAI-C — Engineering Benchmark / Non-Regression / Release-Gate Freeze**.

Only after PBAI-C numeric gates are frozen may an individually specified `PBAI-Cxxx` candidate be considered for `AUTHORIZED-FOR-DEVELOPMENT`.

## 23. Baseline drift rule

このfreeze後にlive public AIがPBAI-P1外で変更されても、candidate comparisonのbaselineを黙って差し替えない。

- `AI-GEN2-BASELINE-2026-08-26-v1`をimmutable comparison targetとして保持する;
- live driftは別に記録する;
- 必要なら新baseline ID/versionをprospectively発行する;
- minor patch/config changeだけでAI generationを自動的に進めない。
