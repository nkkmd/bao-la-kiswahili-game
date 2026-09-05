# G3-08 / LGPML-STUDY1 — 最終報告

更新日: 2026-09-03

## 1. formal decision（正式判断）

```text
Study = LGPML-STUDY1
Program position = Research Generation 3 / G3-08
Study status = CLOSED / TECHNICAL-INVALID
Stage 0 = LGPML-S0-TECHNICAL-2026-09-03-v1 / STAGE0-PASS
Stage 1 = LGPML-S1-DEVELOPMENT-2026-09-03-v1 / STAGE1-TECHNICAL-INVALID
Stage 2 = LGPML-S2-FORMAL-2026-09-03-v1 / NOT-AUTHORIZED-NOT-EXECUTED
Stage 1 seed = 31810001..31810256 / CONSUMED
Stage 2 seed = 31820001..31820384 / NOT CONSUMED
formal promoted candidate set = []
protected standard-root complete exact depth-10 holdout = SEALED / NOT GENERATED / NOT READ / NOT PEEKED
main integration = NOT PERFORMED
```

LGPML-STUDY1は、Bao trajectory上でbounded RAW local game-tree geometryのchange-sign dependence、persistence、reversal、first-exit、returnをprospectively測定し、boundedなgeometry memory lengthを検証するResearch Generation 3 / G3-08の独立研究として開始した。

Stage 0 technical validationはPASSした。その後、fresh Stage 1をexactly one authorized executionで開始したが、10 trajectoryのfrozen complete development populationを測定し終える前に、required relative-depth-5 RAW reconstruction中でLGTGMIVの`relay-limit enumeration` technical errorが発生した。

fresh scientific access後であり、同一seed block / same evidenceをengine・enumeration handling修正後に再実行することはfrozen no-rescue ruleに反する。したがってLGPML-STUDY1のformal lifecycle decisionは **`CLOSED / TECHNICAL-INVALID`** とする。

## 2. 結果を見る前に固定したscope

Representation / measurement boundary:

```text
representation = RAW-ONLY
relative local horizon = 5
validated transforms = []
state identity = pits,reserve,houseOwned,player,phase,winner,pending
measurement foundation = LGTGMIV-STUDY1 / F1..F5
experimental unit = source trajectory
analysis roots = plies 16..63 inclusive / 48 roots per eligible trajectory
```

Frozen geometry panel:

1. `LGPML-G1-ROOT-LEGAL-WIDTH`
2. `LGPML-G2-CUMULATIVE-TREE-OCCURRENCE`
3. `LGPML-G3-CUMULATIVE-DISTINCT-RAW-STATES`
4. `LGPML-G4-CUMULATIVE-TREE-RAW-RATIO`
5. `LGPML-G5-DUPLICATE-TRANSITION-FRACTION`
6. `LGPML-G6-UNIT-WIDTH-OCCUPANCY-FRACTION`

Primary processは各metricのone-ply exact rational change signで、lag setはprospectively `{1,2,4,8}` に固定した。phase crossingはundefined、ZEROをformal SAME/OPPOSITE比較から除外した。first-exit / returnはsecondary descriptiveのみで、formal promotion family外とした。

## 3. fresh-evidence firewall（証拠分離規則）

Stage 1 selection前に、upstream studiesのscientific outcomeを保持しないidentity-only firewallをmaterializeした。

```text
rootRawSha256 identities = 269
sourceTrajectorySha256 identities = 244
openingPrefixSha256 identities = 187
identity core SHA-256 = d123435bb93d5746e7a1fee8b9b35d166a5bff57ce681c8df01d987a64f6a7d3
scientific outcome fields retained = false
G3-07 Stage 2 deterministic selection core = c78f561bb6fdeadad50c968313073f8d0b6cc87c94e1e961c28e43ab7389bd89
```

G3-07の3 CONFIRMED candidatesのdirection / threshold / p-valueをLGPML candidate selectionへ使用していない。G3-05 technical-invalid scientific outputもscientific inputにしていない。

## 4. Stage 0のtechnical validation

Stage 0はtechnical seed namespaceのみを使用し、scientific useを禁止した。

```text
Stage 0 = STAGE0-PASS
run = 33727822427
job = 100560742801
result artifact = 9882655923
result ZIP SHA-256 = 44be205b804a549dfcf9d73cb99bbc3532ec946c8529134edf13f26326184c03
technical seed = 31809002 / scientific use prohibited
measured plies = 16,17,44,45
deterministic core = 6e51e95ae7afa97fb8993e698dbe7f290454433f012bb24cbc17b6d1d1b8411d
max combined production+independent root elapsed = 10877 ms
Stage 1 seed access = false
Stage 2 seed access = false
protected depth-10 access = false
```

production / independent relative-depth-5 reconstruction、G1..G6 level derivation、exact rational arithmetic、lag semantics、ZERO exclusion、cross-phase censoring、first-exit / return、canonical equalityをtechnical fixture上で確認した。

## 5. Stage 1のauthorizationとexactly-once実行

Fresh-free preauthorization audit:

```text
run = 33729048934
job = 100564565986
disposition = STAGE1-PREAUTH-STATIC-AUDIT-PASS
Stage 1 seed access = false
protected depth-10 access = false
```

Authorization / execution:

```text
authorization commit = a7904798de848fe8af3bd7e66b1b81741590ba95
trigger commit = bfd0f7b0f754b4ffc14faae018a2ceb52647677f
max authorized scientific executions = 1
workflow run = 33731577464
job = 100572486927
run attempt = 1
lease artifact = 9884042604
lease ZIP SHA-256 = 61a50d3e5657dd8a84dc4e63780e9a715829db2daa8285e78d88dc3af22eda28
authorized scientific executions = 1
actual scientific executions = 1
fresh access started = true
seed block consumed = true
no-rescue boundary crossed = true
```

Stage 1をrerunしていない。

## 6. Stage 1で観測したtechnical result

Canonical result:

```text
stageDisposition = STAGE1-TECHNICAL-INVALID
formalPromotedCandidateSet = []
promotedCandidateCount = 0
technical error = relay-limit enumeration 74581ece7d29895d9727bb9cd507046f98a158b51466abdeaa335eb9e60d510e
stage2AutomaticallyAuthorized = false
protectedDepth10Access = false
```

Workflow log上、9 trajectoriesがcomplete trajectory aggregationまで進んだ後、次のrequired root reconstructionでtechnical errorが発生した。

complete trajectory logのprovenance:

```text
31810001
31810003
31810004
31810010
31810015
31810016
31810024
31810025
31810028
```

これらのpartial measurementsはcomplete frozen 10-trajectory development populationではない。runnerは10/10 valid population、all candidate slotsのcomplete support、promotion hierarchyのvalid final summaryへ到達していない。

したがって9 trajectoriesの途中情報からpersistence direction、candidate prevalence、memory lengthその他のscientific conclusionを導かない。formal candidateをpromotionしない。

formal promoted candidate set:

**`[]`**

## 7. durable artifactとexact-byte mirror

Stage 1 failure後もcanonical resultはdurable artifactへ保存された。

```text
artifact ID = 9886738874
artifact name = lgpml-stage1-result-33731577464
artifact ZIP SHA-256 = ef2ed1d6c28b30461d03f3a294cb3cb3d11d9f951fa24b6e6f2a94f546d6f53c
scientific-result.json bytes = 1718
scientific-result.json SHA-256 = e8bb384dd8ba526029ee62753836847f25b45546e013fb4b224f5ab02c68a46c
```

Canonical repository mirror:

`results/stage-1/scientific-result.json`

Mirror commit:

`79fb4c51940d255e05c8e1c5469f1f759b81bf26`

repository mirrorではscientific computationを再実行していない。

## 8. technical-invalidの解釈

Observed failureは、frozen eligible trajectoryのlocal geometryをrelative depth 5までexact RAW reconstructionしている途中で、upstream LGTGMIV enumerationが`relay-limit` conditionへ到達したことによる。

Formalに言えるのは、prospectively frozen Stage 1 execution contractの下で、complete valid development datasetとpromotion decisionを生成できなかったことである。

以下はformalに主張しない。

- Baoのlocal geometryにpersistenceが存在する／存在しない
- G1..G6のどれかが特定lagまでmemoryを持つ／持たない
- branch-heavy / compressed / transposition-rich等の特徴が特定memory lengthを持つ
- persistenceがNamuaまたはMtajiで強い／弱い
- geometry resetやreversalがphase transition、strategic recurrence、randomnessを意味する
- partial 9 trajectoriesがStage 1 target populationを代表する
- persistenceがbest move、position value、win probability、search difficulty、人間難度、human memory、causal mechanismを意味する
- relative depth 5の局所structureをより深いgame treeへ一般化できる

これはnegative/null scientific findingではなく、**technical validity result**である。

## 9. no-rescue closure（救済的変更を行わない終了）

Stage 1 seed block `31810001..31810256`はconsume済みで、no-rescue boundaryはactiveである。

禁止事項:

- same Stage 1 evidenceのrerun
- relay-limit handlingを修正した同一seed再評価
- seed extension / root replacement / favorable subset selectionを行うこと
- lag / metric / endpoint / phase treatment / support gate / promotion hierarchy / resource ceilingの事後変更
- partial trajectoriesをformal promoted candidateへ格上げすること
- LGPML-STUDY1としてStage 2を実行すること

relay-limit-safeなlongitudinal geometry designを将来検討する場合は、LGPML-STUDY1の救済ではなく、**新しいprospective independent Study/version**として扱う必要がある。

## 10. Stage 2とprotected evidence

Stage 2の前提であるvalid Stage 1 completionとnonempty frozen promoted setを満たさない。

```text
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
Stage 2 seed = 31820001..31820384 / NOT CONSUMED
```

Stage 2 pretoolingはfresh-free synthetic-only validationまで実施した。

```text
pretooling v1 = fixture expected-count error / no scientific consequence
pretooling v2 run = 33732602250
pretooling v2 job = 100575749583
pretooling v2 = STAGE2-PRETOOLING-AUDIT-PASS
Stage 2 seed access = false
```

このtechnical readinessはStage 2 scientific authorizationを意味しない。

standard initial RAW-root complete exact depth-10 holdoutは、次の状態を維持する。

**`SEALED / NOT GENERATED / NOT READ / NOT PEEKED`**

## 11. 最終closure

```text
G3-08 / LGPML-STUDY1 = CLOSED / TECHNICAL-INVALID
formal promoted candidate set = []
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
same-evidence rescue = PROHIBITED
main integration = NOT AUTHORIZED / NOT PERFORMED
```

LGPML-STUDY1は研究設計を遡及変更せず、technical-invalid outcomeをそのまま閉鎖記録として保持する。

<!-- LGPML-G3-08-POST-CLOSURE-INTEGRATION -->
## closure後のrepository integration追記

Study closure時点ではmain integrationは未承認だった。その後、2026-09-03の明示的ユーザー指示により、audited research branch tip `72bd208267359f461e9dbbde938bb952eb01b91c` をremote `main`へfast-forward / `force=false`で統合した。このrepository lifecycle eventは`CLOSED / TECHNICAL-INVALID`、formal promoted candidate set `[]`、Stage 2 non-execution、no-rescue、protected depth-10 sealingを変更しない。
