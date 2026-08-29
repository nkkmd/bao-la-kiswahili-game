# DRSSE-STUDY1 — 判断台帳

すべての判断はprospective orderとno-rescue boundaryを維持します。

## D001 — 独立prospective Study

`DRSSE-STUDY1`はResearch Generation 2 `G2-05`であり、G1 SSGTCおよびG2-01〜G2-04とは独立しています。upstream formal decisionは変更しないcontextです。

## D002 — baselineとbranch

Study開始時のremote `main`は`c515c36a9b27a796dc7eae13fd1b2cec2b9d3ea6`でした。統合までresearch workは`research/g2-05-deep-raw-state-space-enumeration`で実施しました。

## D003 — RAW identity

identity fieldはexactに`pits`, `reserve`, `houseOwned`, `player`, `phase`, `winner`, `pending`です。`turn`と`reason`は除外します。`pending`欠落はinvalidです。

## D004 — transformation reductionなし

validated transformation setは`[]`です。symmetry reduction、canonicalization、player-swap equivalence、left / right equivalence、quotient countingは禁止します。

## D005 — bounded exact question

G2-05はfixed depthまでのcomplete forward enumerationを測定します。terminalまでのclosureは要求せず、未列挙部分やfull-game state space / game-tree complexityを推定しません。

## D006 — complete-layer principle

depthがexactと認められるのは、そのlayer構築に必要なすべてのlegal expansionがcompleteかつverifiedである場合だけです。incomplete layerをexactとして報告してはいけません。

## D007 — formal targetをprospectiveに固定

formal outcome生成前にstandard initial RAW rootとtarget depth 9を固定しました。required reachable layersは0..9、required parent expansion layersは0..8です。

## D008 — resource contract

outcome生成前に次のformal ceilingを固定しました。500,000 cumulative RAW states、3,000,000 depth-labelled edges、500,000 parent expansions、3,000,000 move evaluations、1,000,000,000 tree occurrences、6 GiB RSS、1200 seconds wall clock、1 GiB uncompressed artifactです。

outcome確認後にcapを引き上げてはいけません。

## D009 — formal decision taxonomy

結果を見る前に次のlabelを予約しました。

- `EXACT-WITHIN-FROZEN-DEPTH-9-DOMAIN`
- `NOT-EXACTLY-ENUMERATED`
- `NON-ESTIMABLE`

technical / resource stop classificationはestimateではありません。

## D010 — Stage 0 technical scope

Stage 0ではG1 SSGTC bounded dataをtechnical positive fixtureとしてのみ使用できます。G2-05 scientific evidenceは生成しません。

## D011 — Stage 0 technical history

最初のStage 0 workflowは存在しないsmoke-test pathによりenumeration前に停止しました。2回目はtransition-hash fixture convention mismatchを明らかにしました。どちらもaccepted runではなく、technical historyとして保存します。

## D012 — Stage 0 acceptance

Canonical run `33155526103`はproduction、separate-process independent verification、すべてのfrozen corruption controlをPASSしました。Decisionは`STAGE0-TECHNICAL-PASS`です。

## D013 — Stage 1 firewall

Stage 1はfresh development / resource characterizationのみです。Stage 1 row、root、count、transposition observation、artifactをformal Stage 2 evidenceへ使用してはいけません。

## D014 — Stage 1 acceptance

Fresh seed block `28050001..28050064`から、frozen selection ruleの下でNamua 3 roots、Mtaji 3 rootsを選択しました。6 rootsすべてがdepth 5を完了し、independent selection / re-enumerationも成功しました。Decisionは`STAGE1-DEVELOPMENT-PASS`です。

## D015 — Stage 1後もStage 2 designを変更しない

Stage 1 outcomeを理由に、既に固定済みのstandard root、depth 9 target、resource ceiling、RAW identity、endpoint、formal decision ruleを変更しませんでした。

## D016 — formal source freeze

Stage 2 spec、engine、production enumerator、independent enumerator、formal runner / verifier、workflow blobをformal authorization前に固定しました。

## D017 — one-time Stage 2 authorization

commit `9199a3d25ea38978673f94bfcd4250aa3b5411fa`で、frozen source setに対するformal executionをexactly once承認しました。Stage 1 artifactとG2-04 artifactはformal inputから除外したままです。

## D018 — formal exact result

Canonical Stage 2 run `33156581843`はresource / admin stopなしでdepth 9を完了しました。materialized verificationとfull independent depth-9 re-enumerationもPASSしました。

Formal decision:

```text
EXACT-WITHIN-FROZEN-DEPTH-9-DOMAIN
```

Canonical cumulative endpoint:

```text
RAW states = 102857
depth-labelled legal edges = 106773
tree node occurrences = 136645
tree edge occurrences = 136644
tree / cumulative RAW-state ratio = 1.328494900687362
```

## D019 — exact identities

```text
cumulativeRawStateSetSha256 = 993c5056ca54521b7b124d8c5c97fa18d8ef04b860b5e4c6870df278d5944816
cumulativeGlobalRawGraphEdgeSetSha256 = da836a6a0b2e18c155f59de7617b4e72ab62955410ca7725a3f3525211f9a654
cumulativeDepthLabelledEdgeSetSha256 = 3453b457aee547c645be0ec3a3a5550656e9fcaa1917be13d5ac0bb0e7b69aed
productionResultCoreSha256 = b9e79571ab2492edf717569cb331f381e4dbff603684d2e932b8b57c2ffb322b
independentCoreSha256 = 02e4a1fa865af977cb10c1f288c42886b32453e56a40bc85cbb0dc9975b257d3
decisionCoreSha256 = c1756994ceea3ea9b605805ddd6387f359aeb14e14d894bfc8a1e8b26122fa3f
```

## D020 — no-rescue closure

G2-04 root / partial closure、G1 depth-9 partial row、Stage 1 row / root、symmetry transform、canonicalization resultはformal Stage 2 evidenceに使用していません。outcome後のroot / depth / cap / identity / endpoint変更は承認しません。

## D021 — interpretation boundary

exact decisionはfrozen standard-root depth-9 RAW domainに限定されます。full Bao state-space size、full game-tree complexity、asymptotic growth、unbounded estimate、symmetry-reduced count、engineering performanceは承認された結論ではありません。

## D022 — future-estimation boundary

未列挙depthやfull-game sizeに関するinferenceには、planned Research Generation 2 G2-12 workを含む新しいprospective protocolが必要です。
