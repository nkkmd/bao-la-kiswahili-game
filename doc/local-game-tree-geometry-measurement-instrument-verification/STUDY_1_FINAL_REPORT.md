# LGTGMIV-STUDY1 — Study 1最終報告

## 1. formal conclusion（正式な結論）

**Study:** `LGTGMIV-STUDY1` — Local Game-Tree Geometry Measurement Instrument Verification Study 1
**日本語題目:** Baoにおける局所ゲーム木幾何測定instrumentのprospective再構築と独立検証 — deterministic scientific core、exact RAW tree/graph reconstruction、cross-implementation reproducibilityのfresh evidenceによる確立  
**Final status:** `CLOSED`  
**Formal decision:** **`FORMAL-ELIGIBLE-ALL`**

Stage 2 fresh formal holdoutで、Stage 1からpromoteされた5つの測定familyすべてが、prospectively frozenされたexact production / independent verification gateを満たした。

formal validationに適格と判定した測定family:

1. `LGTGMIV-F1-TREE-OCCURRENCE`
2. `LGTGMIV-F2-RAW-GRAPH`
3. `LGTGMIV-F3-TRANSPOSITION-RECONVERGENCE`
4. `LGTGMIV-F4-TREE-GRAPH-RELATION`
5. `LGTGMIV-F5-REPLY-GEOMETRY`

この結論は、本Studyで固定したRAW-only state identity、depth-5 bounded local reconstruction、fresh population、canonical serialization、resource ceiling、production / independent implementation contractの範囲に限定される。

## 2. Studyの位置づけ

本StudyはResearch Generation 3のG3-01後、G3-02前に置いた独立measurement-instrument prerequisiteである。G3-01 `LGTGMF-STUDY1`のcorrected rerun、Study 2、repair、rescueではない。

G3-01はruntime-dependent telemetryをstage-level canonical hashへ含める実装欠陥により`TECHNICAL-INVALID`で閉じた。本Studyではそのfailure modeをdesign informationとしてのみ用い、scientific canonical coreとexecution telemetryをprospectively分離したうえで、fresh seed / fresh evidenceを使って新規にinstrument eligibilityを検証した。

G3-01のformal decisionは変更しない。

```text
LGTGMF-STUDY1 = CLOSED / TECHNICAL-INVALID
G3-01 formal eligible families = []
G3-01 Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
```

## 3. immutable representation contract （固定した規則）

Authoritative scientific state identityはRAW-onlyである。

`pits,reserve,houseOwned,player,phase,winner,pending`

Validated transform setは `[]`。symmetry、reflection、player swap、canonical orbit、symmetry-reduced deduplicationは導入していない。

Move identityは次の8 fieldで固定した。

`type,phase,row,index,direction,side,houseChoice,houseTwo`

Scientific hashはdeterministic canonical JSONとSHA-256で構成し、elapsed time、RSS、CPU、runner、PID、workflow job、filesystem path等のexecution-dependent telemetryをscientific digestから除外した。

## 4. Stage 0 — technical instrumentのvalidation

Stage 0 `LGTGMIV-S0-TECHNICAL-2026-08-31-v1`はsynthetic / non-scientific controlsだけを用いた。

検証対象には以下を含めた。

- RAW-state / move canonical serializationのdeterminism
- traversal / legal-move / root orderのinvariance
- repeat-run determinism
- production / structurally independent implementationのexact agreement
- family / root / Stage digestのagreement
- telemetry mutation invariance
- G3-01 failure modeのnegative control
- static implementation independence
- fresh scientific seed未消費
- protected depth-10 evidence未開封

Formal workflow run `33386868192`はPASSした。

- `stageReconstructionCoreSha256 = 33c63d62cfaf9f38d81680f42e799a5084e2ef86686810bbe46f543a9fbe42b9`
- `stageScientificCoreSha256 = 38871e544593fa4e0120fe77bbb48c47e643bb89d816acfde2dfd1dd9bdc0c0b`

Stage 0 dispositionは`STAGE0-PASS`である。

## 5. Stage 1 — fresh developmentのvalidation

Stage 1 `LGTGMIV-S1-DEVELOPMENT-2026-08-31-v1`は、別authorization後に一度だけ実行した。

- seed block: `31110001..31110128`
- selected populationはNamua 8 + Mtaji 8で16 unique RAW root
- relative horizon: depth 5
- evidence class: `FRESH-DEVELOPMENT`
- formal run: `33450205296`
- result commit: `52812f37197df74e90d1864720ad1b7e6f13d7fa`

全16 rootsでproduction / independentのreconstruction coreがexact一致し、5 familyすべてでroot-level / stage-level digestがexact一致した。resource gateを含むglobal gateもPASSした。

- `stageReconstructionCoreSha256 = 2f641919bf067428416afd65a9a502c30c2ad3261cfe6b1355499809076505ac`
- `stageScientificCoreSha256 = 91c4ed0a23edbf12398ca644db7d6864011f4d26c88da93019095decf524f271`

Stage 1 dispositionは`STAGE1-PASS`。5 familyすべてをStage 2へpromoteした。

Stage 1 resultはread-only auditでも確認済みであり、同じfresh blockのformal rerun / repairは永久に禁止される。

## 6. Stage 2 — fresh formal holdout （Stageの記録）

Stage 2 `LGTGMIV-S2-FORMAL-2026-08-31-v1`は、Stage 1 PASSとnon-empty promoted family setを確認した別authorization、およびfresh holdout未開封のpre-execution audit後に一度だけ実行した。

- seed block: `31120001..31120192`
- selected populationはNamua 12 + Mtaji 12で24 unique RAW root
- relative horizon: depth 5
- evidence class: `FRESH-FORMAL-HOLDOUT`
- formal workflow run: `33452082425`
- immutable result commit: `5fbdd72a8c0a8d34b1b74cf0829a6f972812a549`

Stage 2はG3-01およびStage 1のRAW-root identity、full source trajectory identity、first-16-prefix identityをexclusion-only firewallとして使用した。geometry outcomeをroot selectionへ用いていない。

Formal result:

```text
population = 24/24
Namua = 12
Mtaji = 12
production / independent exact root reconstruction = 24/24
global gate = PASS
resource gate = PASS
formal eligible families = 5/5
formal decision = FORMAL-ELIGIBLE-ALL
```

各familyも全24 rootsでexact gateを満たした。

- F1 exact roots: 24/24
- F2 exact roots: 24/24
- F3 exact roots: 24/24
- F4 exact roots: 24/24
- F5 exact roots: 24/24

Canonical hashes:

- `stageReconstructionCoreSha256 = 307c907a90cd7239a617278a2378f4e048b10f16877428a3c886de5377b01a1d`
- `stageScientificCoreSha256 = 97ad7dc21e1758d31fa09e487389bf5d3935b1d98daf3eaa2f1b524d7169f9a4`
- scientific result fileのSHA-256は`9a28e629440a1d9212ad67ef78451deba869747d313dc75462693701074e1f96`
- telemetry file SHA-256: `0db24cc1d1f59432a519dfaad88ffffe8d2217d1cebf4291b6361dc8f2778bc0`

Stage family hashes:

- F1: `a9953979274fa8092053d5daed64c2284339728ed9d125d2143b246b2ac3dfe9`
- F2: `3b000e509ec19faefd6fd6c1161e503570373c47715e1de436cc4fdfb0343f39`
- F3: `2d787070c7f49936dcf11ed26d290caeacc76a0feab63ba075c362b6919120f9`
- F4: `b0cd2e8c1264df81472d8e354962ec15bb970dbec39d6d84926e25f778eabf8a`
- F5: `75688449f5f86fb8c027aa8d7ab4b3a05a8e9ed18614f95d841d23161e31b5b2`

## 7. read-only post-result audit （概要）

Stage 2結果commit後、scientific evidenceを再生成しないread-only auditを実施した。

- audit workflow run: `33452400324`
- audit result commit: `ad057e499e34f70493ac1d7332fe42332323d293`
- audit result: `passed = true`
- engine imported: false
- scientific re-executionは行っていない

Auditはcommitted JSONだけを読み、file SHA-256、24-root structure、production / independent exact flags、family gate、stage hashes、resource telemetry、protected-evidence flagsを検証した。

Resource auditでは、Stage 2 total elapsedは`159574.533277 ms`、stage artifact bytesは`6086521`で、凍結済みceiling内だった。

## 8. 科学的解釈

本Studyがformalに成立させたのは、**bounded RAW local game-tree / graph geometryを再現可能に測定するinstrument familyのeligibility**である。

具体的には、固定したdepth-5 local domainで、次の構造量をproduction / independent別実装からexact一致で再構築できることがfresh formal holdout上で確認された。

- tree occurrence geometry
- RAW reachable graphのgeometry
- transposition / reconvergence structure
- tree / graph divergenceのrelation
- reply-width / narrow-path geometry

これは「Bao全体のゲーム木の大きさ」を測定した結果ではない。また、特定geometryが戦略的に良い・悪い、勝率を予測する、game-theoretic valueを持つ、human difficultyを表す、というclaimでもない。これらは別Studyで独立に検証する必要がある。

## 9. claim boundary（主張できる範囲）

本Studyから直接主張できないもの:

- Bao全体のstate-space / game-tree size
- depth 5を超えるinstrument validityの自動一般化
- symmetry-reduced / canonicalized geometry
- validated transformの存在
- local geometryと勝敗・評価値・search failureの因果関係
- game-theoretic value
- human cognitive difficulty
- G3-01のretroactive rescue
- G3-02の自動authorization

Authoritative state identityは引き続きRAW-only、validated transform setは`[]`である。

## 10. protected evidence （証拠の状態）

standard initial RAW rootのcomplete exact depth-10 holdoutは、本Studyの全Stageを通して生成・readしていない。

```text
Protected depth-10 holdout = SEALED / NOT GENERATED / NOT READ
```

このevidenceはG3-11向けのprotected boundaryとして維持する。

## 11. downstream disposition （最終状態）

`LGTGMIV-STUDY1`は次で正式に閉じる。

```text
LGTGMIV-STUDY1 = CLOSED / FORMAL-ELIGIBLE-ALL
formal eligible measurement families =
  LGTGMIV-F1-TREE-OCCURRENCE
  LGTGMIV-F2-RAW-GRAPH
  LGTGMIV-F3-TRANSPOSITION-RECONVERGENCE
  LGTGMIV-F4-TREE-GRAPH-RELATION
  LGTGMIV-F5-REPLY-GEOMETRY
```

ただし、`automaticG302StartAuthorized = false`である。

G3-02〜G3-08は本Study closureだけでは開始しない。G3-02を開始するには、current repository state、dependency、protected evidence、formal eligible family setを確認する**別のResearch Generation 3 post-closure authorization review**が必要である。
