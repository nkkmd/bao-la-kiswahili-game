# LGTGECB-STUDY1 — Study 1 Protocol

Study ID: `LGTGECB-STUDY1`  
Agenda: `Research Generation 4 / G4-06`  
Baseline `main`: `6a005d9f84d222126dc41abfe17ad5baa4c96629`  
Research branch: `research/g4-06-geometry-exact-consequence-bridge`  
Authorization review: `G4-06-AUTHORIZATION-REVIEW-2026-09-26-V1`  
Current authorization: **`PREREGISTRATION-AND-STAGE0-ONLY`**

正式英語題目:

**Local Game-Tree Geometry / Exact-Consequence Bridge Study 1 — Prospective correspondence validation between bounded RAW local geometry and exact game-theoretic consequences within frozen solved Bao microdomains**

正式日本語題目:

**Baoの局所ゲーム木幾何とexact game-theoretic consequenceの対応検証1 — 完全解析済み固定microdomainにおけるbounded RAW geometryとexact value・solution distance・move-equivalence構造のprospective接続**

## 1. 中心問い

G4-05でcomplete closureと独立exact solver agreementが成立した固定8 microdomainについて、relative depth 5のbounded RAW local game-tree geometryは、root exact value、solution distance、value-preserving move count等のexact consequenceと再現可能な対応を持つか。

## 2. 研究上の位置づけ

本StudyはG4-05をrepair、reopen、rescueするものではない。G4-05の8 formal domainsをimmutable upstream populationとして受け取り、G4-06で新しく事前登録したgeometry / exact bridge constructだけを評価する。

本Studyからwhole-Bao optimality、AI棋力、人間の難しさ、因果機構を直接主張しない。

## 3. 上流populationの固定

G4-06のscientific populationはG4-05 canonical Stage 2でformal completeとなった8 domainsに限定する。

```text
upstream study = RLEMOF-STUDY1
upstream stage = RLEMOF-S2-FORMAL-2026-09-25-v1
canonical run = 36120286922 / attempt 1
upstream formal domains = 8
upstream root values = WIN 2 / LOSS 6
artifact SHA-256 = 90520ed47e8d314e15c0c8dab18d805fa147d69c54ab3e7a4afc2136238c2154
production result SHA-256 = 03f0f416dca4bb92de9c55e780d47e8d39c2e2bb50fa0d987953fa87f256fff0
independent result SHA-256 = acfb9fda216d0669e4432ab4bb112b07283e05def34e9793507c0c7ad9964140
```

population追加、seed extension、candidate replacement、`STATE-LIMIT` candidate rescueを行わない。

## 4. state identity

```text
RAW identity = pits,reserve,houseOwned,player,phase,winner,pending
excluded = turn,reason
validated transform set = []
canonicalization = false
symmetry reduction = false
```

G4-05およびLGTGMIVと同じRAW identityを維持する。

## 5. geometry construct

geometry measurement foundationは`LGTGMIV-STUDY1`のRAW-only / relative depth 5 instrumentとする。

```text
F1 = TREE-OCCURRENCE
F2 = RAW-GRAPH
F3 = TRANSPOSITION-RECONVERGENCE
F4 = TREE-GRAPH-RELATION
F5 = REPLY-GEOMETRY
relative horizon = 5
```

Formal Stage前にProgram Planの4概念に対応するscalarを固定する。

- corridor
- tree/RAW inflation
- transposition
- reply width

scalar化の式、depth集約、terminal truncation、denominator-zero処理はscientific output生成前にfreezeする。

## 6. exact consequence construct

formal候補は次とする。

1. root exact value: `WIN` / `LOSS`
2. root DTF
3. value-preserving root move count
4. DTF-optimal root move count（補助）

`value-preserving move`は、player-to-move基準のroot exact outcomeを悪化させない合法手としてformal Stage specで厳密に定義する。engine evaluation、search score、self-play outcomeを使用しない。

## 7. experimental unitとsmall-N境界

primary experimental unitはG4-05 formal domain / rootである。state、edge、moveを独立標本として扱わない。

```text
N domains = 8
WIN roots = 2
LOSS roots = 6
```

小標本であるため、通常の大標本近似を主たる根拠にしない。finite exact summaryとfail-closed estimability gateを使用する。

formal relation summaryの第一候補:

- binary exact value: WIN-rootとLOSS-root間のgeometry pair ordering count
- ordered exact consequence: concordant / discordant / geometry-tie / consequence-tie count
- exact rational summaryを可能な限り使用

variation不足、measurable domain不足、定義不能は`NON-ESTIMABLE`とする。

## 8. upstream rootの再物質化境界

G4-05 artifactはroot state本体を保存していないため、formal G4-06 executionでは固定済み8 `(seed, ply, rootStateKey)` tupleからroot stateを再物質化する必要がある。

ただし次を必須とする。

1. candidate poolをscanしない。
2. input tupleを追加・削除・並べ替えて選好しない。
3. reconstructed RAW keyがupstream `rootStateKey`と一致しない場合はhard-failする。
4. exact closureをdownstream derived construct用に再構築する場合、upstream state-set / transition-set / solution digestと完全一致を要求する。
5. 不一致時にG4-05 decisionを変更しない。
6. G4-05 formal decisionを再評価しない。

この処理はG4-06のdownstream materializationであり、G4-05 Stage 2の再実験として扱わない。

## 9. Stage構成

### Stage 0 — technical-only

**AUTHORIZED**。

G4-05 8 formal domainsに対する新しいscientific bridge outputを生成しない。

technical fixture / synthetic fixtureを用いて、次を検証する。

- RAW identity / digest
- bounded geometry extraction
- exact solver connection
- value-preserving move classifier
- DTF-optimal move count
- exact rational scalar derivation
- pair ordering
- concordant / discordant / tie summary
- non-estimable mapping
- production / independent exact agreement
- corruption hard-fail
- scientific authorization flag=false

Stage 0 PASSはStage 1を自動認可しない。

### Stage 1 — formal bridge mapping

**NOT AUTHORIZED**。

Stage 0 PASS後の別authorizationで、8-domain manifest、scalar definitions、relation summaries、estimability gates、resource ceiling、execution context、rerun semanticsをfreezeした場合だけ実行候補になる。

## 10. no-rescue

scientific Stage開始後は、favorable relationを得るために次を行わない。

- geometry metricの追加・削除
- depth変更
- threshold relaxation
- domain除外
- outcome別subgroup rescue
- exact endpointの置換
- seed / root追加
- G4-05 `STATE-LIMIT` rootの復活
- symmetry / canonicalization導入
- higher-resource searchをtruthとして使用

## 11. 実行環境

長時間処理が必要な場合はGitHub Actionsを第一候補とする。

formal executionを将来Actionsで認可する場合は、少なくとも次をartifactへ保存する。

- source commit SHA
- upstream manifest digest
- Stage spec digest
- run ID / attempt
- production result
- independent verification result
- execution identity
- SHA-256 manifest

欠落artifact、timeout、resource cutoffをnegative scientific resultへ変換しない。

## 12. protected boundaries

- G4-05 candidate rescan = false
- G4-05 decision rerun = false
- G4-05 seed extension = false
- G4-10 depth-11 access = false
- G3-11 depth-10 rerun = false
- symmetry / canonicalization = false
- public AI change = false
- `main` integration during active study = false

## 13. 現在の許可範囲

```text
preregistration = AUTHORIZED
Stage 0 technical implementation = AUTHORIZED
Stage 0 technical execution = AUTHORIZED
G4-05 8-domain scientific bridge mapping = NOT AUTHORIZED
Stage 1 formal execution = NOT AUTHORIZED
main integration = NOT AUTHORIZED
public AI change = NOT AUTHORIZED
```
