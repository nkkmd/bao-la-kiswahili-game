# PBAI-P2 — Program最終報告

Program: `PBAI-P2`  
正式題目: `Generation-2 Evidence-Informed Public Bao AI Improvement Program 2`  
開始日: 2026-09-01  
完了日: 2026-09-01  
状態: **COMPLETE / KEEP-AI-GEN2**

## 1. 最終判断

```text
FINAL PROGRAM OUTCOME = KEEP-AI-GEN2
public lineage after closure = AI-GEN2
formal ADOPT = none
validation executions = 0
protected release holdout executions = 0
public deployments caused by PBAI-P2 = 0
AI-GEN3 promotion = NOT-AUTHORIZED / NOT-PROMOTED
```

PBAI-P2は、Research Generation 2の確定済みbounded evidenceだけをscientific premiseとして4件の初期engineering candidateをprospectively評価したが、いずれもfresh validationへ進むための凍結済みdevelopment authorization gateを通過しなかった。そのため既存のpublic `AI-GEN2`を維持する。

`KEEP-AI-GEN2`は事前に許可された正常なProgram outcomeであり、candidateを結果確認後に救済するためのthreshold緩和、seed追加、subgroup追加、mechanism微修正は行わない。

## 2. 不変の科学的境界

```text
scientific evidence cutoff
= cd200b85c1eb24aa4419bd5a9573552f3682f00d

baseline
= AI-GEN2-BASELINE-2026-09-01-v1

global gates
= PBAI-P2-C-GLOBAL-GATES-2026-09-01-v1

Research Generation 3 influence
= ZERO
```

Research Generation 3のscientific result、diagnostic、measurement、hypothesis、candidate ideaはPBAI-P2のcandidate設計、threshold、development、validation、interpretationへ使用していない。PBAI-P2のengineering outcomeによってResearch Generation 2のformal scientific decisionsも変更していない。

## 3. Candidate最終結果

### `PBAI-C006-v1` — strict RAW-safe search/cache identity

Frozen support universeでは:

```text
semantic unique RAW states = 389148
semantic collision witnesses = 0
natural reachable collision witnesses = 0
Worker stale-identity witnesses = 0
local evaluation-cache collision events = 0
local TT collision events = 0
```

Formal engineering disposition:

```text
WITHDRAWN-NO-ACTIONABLE-IDENTITY-DEFECT / CLOSED
implementation = NOT AUTHORIZED
```

これは`pending`をauthoritative RAW identityから除外してよいことや、全Bao到達状態でcollisionが存在しないことを意味しない。

### `PBAI-C007-v1` — depth-preserving same-key TT replacement

Canonical support:

```text
same-key TT store events = 16512
incoming shallower-than-existing overwrite events = 0
roots with such event = 0
later potential depth-benefit hits = 0
```

Frozen support floor `32 events / 16 roots`を満たさなかった。

```text
NON-ESTIMABLE-HOLD / CLOSED-WITHOUT-IMPLEMENTATION
```

### `PBAI-C008-v1` — root-best-flip-triggered two-move confirmation re-search

Predevelopment supportは`SUPPORT-PASS`。Feature-off exact equivalenceもPASSした後、development-only 71 eligible rootsで凍結gateを評価した。

```text
TopSet agreement delta = +0.2957746478873239        PASS
mean normalized rank-loss delta = -0.19413145539906107 PASS
severe-loss-rate excess = -0.09859154929577464     PASS
catastrophic new loss = 0                            PASS
median node ratio = 2.1004464285714284              FAIL (limit 1.60)
p95 node ratio = 3.079245283018868                  FAIL (limit 2.50)
negative-control failures = 0                        PASS
technical failures = 0                               PASS
```

Decision:

```text
DEVELOPMENT-BENEFIT-FAIL-HOLD / CLOSED
validation contract freeze = NOT AUTHORIZED
```

D4 engineering referenceへのagreement改善は観測されたが、higher-resource searchをgame-theoretic truthとは扱わない。また、quality gateの改善を理由に凍結済みcost gateを緩和しない。

### `PBAI-C009-v1` — exact single-reply forcing extension

Predevelopment supportは`SUPPORT-PASS`、feature-off exact equivalenceは256/256 comparisons一致でPASSした。Canonical development run `33504482668`では128 eligible rootsと64 negative controlsを独立再構成した。

```text
TopSet agreement delta = +0.015625                  FAIL (required >= +0.03)
mean normalized rank-loss delta = +0.003924851190476197 FAIL (required <= -0.01)
severe-loss-rate excess = -0.015625                 PASS
catastrophic new loss = 0                            PASS
median node ratio = 1.0140845070422535              PASS
p95 node ratio = 1.3620689655172413                 PASS
runtime trigger failures = 0                         PASS
max-extension-path failures = 0                     PASS
negative-control failures = 18 / 64                 FAIL (required 0)
technical failures = 0                               PASS
```

Frozen decision mappingに従い:

```text
TECHNICAL-INVALID-REJECT-OR-HOLD / CLOSED
validation contract freeze = NOT AUTHORIZED
```

とする。Negative-control gateに加えてprimary benefit gateも2項目とも未達である。結果確認後にcontrol定義、trigger、population、thresholdを変更してsame-version救済しない。

## 4. Independent verification

Mandatory independent reconstructionは、dynamic support / developmentを実施した各candidateでproduction runnerとは別実装として要求した。

C008 developmentおよびC009 developmentでは、population、row-level metrics、aggregate gates、decision、deterministic coreを独立再構成して一致を確認した。

C009 canonical development:

```text
workflow run = 33504482668
job = 99845173939
artifact = 9799229328
artifact ZIP SHA-256 = 527f31fdcf17bdb6c1d48f1899099951bc1989f6ef9ff3c6a7d33aacd4527b22
production result SHA-256 = 20207afe6e11ef36f397bd59da254c6e12fd3fb453eab962f84e0d3e70e0622f
independent verification SHA-256 = 68bd106c74695c8fe8bfd29902b564c4873394460f6a705a5fe14ac3743749e9
deterministic core SHA-256 = b2bd6806c75307a49999c29743e919fe67a44b368e6d81e6e8abaed9f47005dc
```

最初のC009 development workflow attempt `33504249360`は`node --check`でsyntax errorを検出してdevelopment seedsへ到達する前に停止した。修正は欠落した閉じ括弧1箇所だけであり、candidate mechanism、population、threshold、decision mappingは変更していない。

## 5. Validation / holdout firewall

初期fresh splitのうち実際に開いたのはdevelopment decision roots `424xxxxx`までである。

```text
validation decision roots 425xxxxx = NOT ACCESSED
release holdout decision roots 426xxxxx = NOT ACCESSED
strength validation / holdout = NOT ACCESSED
operational validation / holdout = NOT ACCESSED
```

C008、C009ともvalidation contract freeze authorizationに到達しなかったため、PBAI-P2-F / Gの実行条件は成立しなかった。未使用のvalidation / holdoutを「結果0」と解釈しない。

## 6. Public source / release state

Candidate implementationはisolated development branchesでfeature-gated / default-offとしてのみmaterializeした。失敗candidateの`public/ai.js`差分をpublic `main`へ採用しない。

```text
public AI source changed by PBAI-P2 = false
public default feature changes = none
PWA cache migration = not required
rollback release = not required
release candidate = none
formal ADOPT = none
```

したがってpublic lineageは開始時と同じ`AI-GEN2`である。

## 7. AI generation decision

`AI-GEN3` promotionにはformal `ADOPT`だけでなくfresh validation、protected release holdout、actual public-default deploymentが必要である。PBAI-P2ではいずれも成立していない。

```text
AI-GEN3 = RESERVED / NOT-PROMOTED
```

Research Generation 3の番号とAI generation番号には対応関係を持たせない。

## 8. Program closure boundary

PBAI-P2 initial inventory `PBAI-C006-v1..PBAI-C009-v1`は全件closedである。Initial inventory外candidateの追加は規則上可能だったが、Program outcome確認後に新candidateを追加するoutcome-independentな事前根拠はfreezeされていない。したがって、今回の結果を材料にC010等を発明してProgramを延長しない。

将来、新しいAI Engineering Programを開始する場合は、新しいProgram-level evidence cutoff、fresh split、candidate inventory、gate freezeを別途prospectively設定する。

## 9. 最終チェック

- Research Generation 3 influence = 0: **PASS**
- G2 formal decisions unchanged: **PASS**
- all initial candidate dispositions explicit: **PASS**
- mandatory independent verification for executed dynamic outcomes: **PASS**
- validation / holdout firewall preserved: **PASS**
- public candidate deployment absent: **PASS**
- `AI-GEN3` promotion absent: **PASS**

```text
PBAI-P2 = COMPLETE
FINAL PROGRAM OUTCOME = KEEP-AI-GEN2
```
